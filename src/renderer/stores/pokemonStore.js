import { defineStore } from "pinia";

const API_BASE = (
  import.meta.env.VITE_POKEAPI_BASE_URL ?? "https://pokeapi.co/api/v2/"
).replace(/\/?$/, "/");
const SPRITES_BASE = (
  import.meta.env.VITE_POKESPRITES_BASE_URL ??
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/"
).replace(/\/?$/, "/");

const idFromUrl = (url) => Number(url.match(/\/pokemon\/(\d+)\/?$/)[1]);
const artworkUrl = (id) =>
  `${SPRITES_BASE}pokemon/other/official-artwork/${id}.png`;
const TTL_MS = 1000 * 60 * 60 * 48; // 48h

export const usePokemonStore = defineStore("pokemon", {
  state: () => ({
    list: [],
    cache: {},
    loading: false,
    error: null,
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

    async preload(limit = 20, offset = 0) {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(
          `${API_BASE}pokemon?limit=${limit}&offset=${offset}`
        );
        const data = await res.json();
        this.list = data.results.map((r) => {
          const id = idFromUrl(r.url);
          return { id, name: r.name, artwork: artworkUrl(id) };
        });
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },

    async loadPokemonById(id, { force = false } = {}) {
      // usa caché si existe y NO está stale
      if (!force && !this._stale(id)) {
        console.log("[PokemonStore] Loading cache...");
        return this.cache[id].data;
      }

      this.loading = true;
      this.error = null;
      try {
        console.log("[PokemonStore] No cache, using API...");
        const res = await fetch(`${API_BASE}pokemon/${id}`);
        const data = await res.json();
        const pokemon = {
          id: data.id,
          name: data.name,
          types: data.types.map((t) => t.type.name),
          stats: data.stats.map((s) => ({
            name: s.stat.name,
            base: s.base_stat,
          })),
          artwork: artworkUrl(data.id),
        };
        return this._save(id, pokemon);
      } catch (e) {
        this.error = e;
        return this.cache[id]?.data ?? null;
      } finally {
        this.loading = false;
      }
    },

    invalidate(id) {
      delete this.cache[id];
    },
    invalidateAll() {
      this.cache = {};
    },
  },
});
