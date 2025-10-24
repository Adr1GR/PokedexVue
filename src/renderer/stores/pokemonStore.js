import { defineStore } from "pinia";
import { isUrlReachable } from "@/renderer/helpers/connectionHelper";
import { showErrorPopup } from "@/renderer/helpers/errorHelper";

const API_BASE = import.meta.env
  .VITE_POKEAPI_BASE_URL; /*  ?? "https://pokeapi.co/api/v2/"
).replace(/\/?$/, "/" */
const SPRITES_BASE = import.meta.env.VITE_POKESPRITES_BASE_URL; /*  ??
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/"
).replace(/\/?$/, "/" */

const idFromUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const m = url.match(/\/pokemon\/(\d+)\/?$/);
  return m ? Number(m[1]) : null;
};

const artworkUrl = (id) =>
  `${SPRITES_BASE}pokemon/other/official-artwork/${id}.png`;
const TTL_MS = 1000 * 60 * 60 * 48; // 48h

export const usePokemonStore = defineStore("pokemon", {
  state: () => ({
    list: [],
    cache: {},
    loading: false,
    error: null,
    reachable: true,
    preloaded: false,
  }),
  getters: {
    total: (s) => s.list.length,
  },
  persist: {
    key: "pokemon-store-v1",
    paths: ["list", "cache"],
  },
  actions: {
    _stale(id) {
      const e = this.cache[id];
      if (!e) return true;
      return Date.now() - e.updatedAt > TTL_MS;
    },
    _save(id, data) {
      this.cache[id] = { data, updatedAt: Date.now() };
      return data;
    },

    setError(e) {
      this.error = e;
    },
    clearError() {
      this.error = null;
    },

    setLoadingTrue() {
      this.loading = true;
    },
    setLoadingFalse() {
      this.loading = false;
    },

    invalidate(id) {
      delete this.cache[id];
    },
    invalidateAll() {
      this.cache = {};
    },

    setReachableTrue() {
      this.reachable = true;
    },
    setReachableFalse() {
      this.reachable = false;
    },

    printStateOnConsole() {
      console.log("- List Length: " + this.list.length);
      console.log("- Cache Length: " + Object.keys(this.cache).length);
      console.log("- Loading State: " + this.loading);
      console.log("- Error: " + this.error);
      console.log("- Reachable State: " + this.reachable);
    },

    async resetStates() {
      this.loading = false;
      this.error = null;
      this.reachable = true;
      this.preloaded = false;
      return;
    },

    async preload(limit = 20, offset = 0) {
      // si ya hemos preloadado, salir
      if (this.preloaded) return;

      this.setLoadingTrue();
      this.clearError();

      // si ya hay lista persistida, marcar preloaded y salir rápido
      if (this.list.length > 0) {
        this.preloaded = true;
        this.setLoadingFalse();
        this.clearError();
        return;
      }

      // comprobar reachability (la función isUrlReachable devuelve bool)
      this.reachable = await isUrlReachable(API_BASE + "pokemon?limit=1", 2500);

      if (this.reachable) {
        try {
          const res = await fetch(
            `${API_BASE}pokemon?limit=${limit}&offset=${offset}`
          );
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (!data || !Array.isArray(data.results)) {
            throw new Error("Malformed response from API");
          }
          this.list = data.results.map((r) => {
            const id = idFromUrl(r.url);
            return { id, name: r.name, artwork: artworkUrl(id) };
          });
        } catch (e) {
          this.setError(e);
        } finally {
          this.preloaded = true;
          this.setLoadingFalse();
        }
      } else {
        // sólo mostrar popup cuando no es reachable
        showErrorPopup("Preload isUrlReachable FALSE", "from preload()");
        this.preloaded = true; // intent terminado aunque sin datos
        this.setLoadingFalse();
      }
    },

    async loadPokemonById(id, { force = false } = {}) {
      this.setLoadingTrue();
      this.clearError();

      if (!Number.isFinite(id)) return null;

      if (!force && this.cache[id] && !this._stale(id)) {
        return this.cache[id].data;
      }

      try {
        console.log(
          `[PokemonStore] Pokemon with id ${id} NOT in cache. Loading from API...`
        );
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
            ? data.stats.map((s) => ({ name: s.stat.name, base: s.base_stat }))
            : [],
          artwork: artworkUrl(data.id),
        };
        return this._save(id, pokemon);
      } catch (e) {
        this.setError(e);
        return this.cache[id]?.data ?? null;
      } finally {
        this.setLoadingFalse();
      }
    },
  },
});
