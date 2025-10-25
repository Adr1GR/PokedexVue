import { defineStore } from "pinia";
import {
  hasInternetConnection,
  canFetchPokemon,
} from "@/renderer/helpers/connectionHelper";
import { getDominantColor } from "@/renderer/helpers/colorHelper";

const API_BASE =
  import.meta.env.VITE_POKEAPI_BASE_URL ?? "https://pokeapi.co/api/v2/";
const SPRITES_BASE =
  import.meta.env.VITE_POKESPRITES_BASE_URL ??
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/";

const DEFAULT_COLOR = "rgb(245,245,245)";
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // last number are days

const idFromUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const m = url.match(/\/pokemon\/(\d+)\/?$/);
  return m ? Number(m[1]) : null;
};

const getArtworkUrl = (id) =>
  `${SPRITES_BASE}pokemon/other/official-artwork/${id}.png`;

export const usePokemonStore = defineStore("pokemon", {
  state: () => ({
    pokemonList: [],
    pokemonDetails: {},
    loading: false,
    error: null,
  }),
  getters: {
    total: (s) => s.pokemonList.length,
  },
  persist: {
    key: "pokemon-store-v2",
    paths: ["pokemonList", "pokemonDetails"],
  },
  actions: {
    _savePokemonList(data) {
      if (!Array.isArray(data) || data.length === 0) return;
      this.pokemonList.push(...data);
    },

    _isStalePokemonDetails(id) {
      const e = this.pokemonDetails[id];
      if (!e) return true;
      return Date.now() - e.updatedAt > TTL_MS;
    },

    _savePokemonDetails(id, data) {
      this.pokemonDetails[id] = { data, updatedAt: Date.now() };
      return data;
    },

    setError(err) {
      this.error = err instanceof Error ? err : new Error(String(err));
    },
    clearError() {
      this.error = null;
    },

    resetState() {
      this.loading = false;
      this.error = null;
    },

    async loadPokemonListFromStorage() {
      this.resetState();
      if (!this.pokemonList || this.pokemonList.length <= 0) return false;

      for (const p of this.pokemonList) {
        if (!p.dominantColor && p.artwork) {
          p.dominantColor = await getDominantColor(p.artwork, "light");
        }
      }
      return true;
    },

    async fetchPokemonList(limit = 20, offset = 0) {
      this.loading = true;
      this.clearError();

      let isOnline = await hasInternetConnection();
      let canFetch = await canFetchPokemon();

      if (!isOnline || !canFetch) {
        this.loading = false;
        this.setError(new Error("No internet or cannot fetch"));
        return false;
      }

      try {
        const res = await fetch(
          `${API_BASE}pokemon?limit=${limit}&offset=${offset}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data?.results || !Array.isArray(data.results)) {
          throw new Error("Malformed response from API");
        }

        const newPokemonListLoaded = await Promise.all(
          data.results.map(async (r) => {
            const id = idFromUrl(r.url);
            const artwork = id ? getArtworkUrl(id) : null;
            let dominantColor = DEFAULT_COLOR;
            if (artwork) {
              try {
                dominantColor = await getDominantColor(artwork, "light");
              } catch {
                dominantColor = DEFAULT_COLOR;
              }
            }
            return { id, name: r.name, artwork, dominantColor };
          })
        );

        this._savePokemonList(newPokemonListLoaded);
        return true;
      } catch (e) {
        this.setError(e);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async loadPokemonByIdFromStorage(id) {
      this.resetState();
      if (!Number.isFinite(id)) return null;

      const entry = this.pokemonDetails[id];
      if (!entry) return null;

      if (!entry.data.dominantColor && entry.data.artwork) {
        entry.data.dominantColor = await getDominantColor(
          entry.data.artwork,
          "light"
        );
      }

      return entry.data;
    },

    async fetchPokemonById(id, { force = false } = {}) {
      this.loading = true;
      this.clearError();

      if (!Number.isFinite(id)) {
        this.loading = false;
        return null;
      }

      if (
        !force &&
        this.pokemonDetails[id] &&
        !this._isStalePokemonDetails(id)
      ) {
        this.loading = false;
        return this.pokemonDetails[id].data;
      }

      const isOnline = await hasInternetConnection();
      const canFetch = await canFetchPokemon();

      if (!isOnline || !canFetch) {
        this.loading = false;
        this.setError(new Error("No internet or cannot fetch"));
        return this.pokemonDetails[id]?.data ?? null;
      }

      try {
        const res = await fetch(`${API_BASE}pokemon/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data || !data.id) throw new Error("Malformed pokemon data");

        const pokemon = {
          id: data.id,
          name: data.name,
          types: Array.isArray(data.types)
            ? data.types.map((t) => t.type.name)
            : [],
          stats: Array.isArray(data.stats)
            ? data.stats.map((s) => ({
                name: s.stat.name,
                base: s.base_stat,
              }))
            : [],
          artwork: getArtworkUrl(data.id),
          dominantColor: getArtworkUrl(data.id)
            ? await getDominantColor(getArtworkUrl(data.id), "light")
            : DEFAULT_COLOR,
        };

        return this._savePokemonDetails(id, pokemon);
      } catch (e) {
        this.setError(e);
        return this.pokemonDetails[id]?.data ?? null;
      } finally {
        this.loading = false;
      }
    },
  },
});
