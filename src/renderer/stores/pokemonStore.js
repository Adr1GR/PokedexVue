import {
  URL_POKEAPI_BASE,
  URL_SPRITES_BASE,
  STORE_KEY_POKEMON,
  COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
} from '@/constants/appConstants.js';
import { defineStore } from 'pinia';
import { hasInternetConnection, canFetchPokemon } from '@/renderer/helpers/connectionsHelper';
import { getMedianLight, deriveDarkVariants } from '@/renderer/helpers/stylesHelper';

const API_BASE = import.meta.env.VITE_POKEAPI_BASE_URL ?? URL_POKEAPI_BASE;
const SPRITES_BASE = import.meta.env.VITE_POKESPRITES_BASE_URL ?? URL_SPRITES_BASE;

const pokemonIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  const m = url.match(/\/pokemon\/(\d+)\/?$/);
  return m ? Number(m[1]) : null;
};

const getSprites = (pokemonId) => ({
  tileSprite: {
    tileName: null,
    position: {
      x: null,
      y: null,
    },
  },
  officialArtwork: `${SPRITES_BASE}pokemon/other/official-artwork/${pokemonId}.png`,
  officialArtworkShiny: `${SPRITES_BASE}pokemon/other/official-artwork/shiny/${pokemonId}.png`,
  sprite: `${SPRITES_BASE}pokemon/${pokemonId}.png`,
  spriteBack: `${SPRITES_BASE}pokemon/back/${pokemonId}.png`,
  spriteShiny: `${SPRITES_BASE}pokemon/shiny/${pokemonId}.png`,
  spriteShinyBack: `${SPRITES_BASE}pokemon/back/shiny/${pokemonId}.png`,
  home: `${SPRITES_BASE}pokemon/other/home/${pokemonId}.png`,
  homeShiny: `${SPRITES_BASE}pokemon/other/home/shiny/${pokemonId}.png`,
  showdown: `${SPRITES_BASE}pokemon/other/showdown/${pokemonId}.gif`,
});

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: {},
    loading: false,
    error: null,
  }),
  getters: {
    total: (state) => Object.keys(state.pokemons).length,
    getPokemonById: (state) => (pokemonId) => state.pokemons[pokemonId] || null,
    getAllPokemons: (state) => Object.values(state.pokemons),
    hasImageUrls: (state) => (pokemonId) => {
      const p = state.pokemons[pokemonId];
      return p?.imageUrl && Object.keys(p.imageUrl).length > 0;
    },
    hasBackgroundColors: (state) => (pokemonId) => {
      const p = state.pokemons[pokemonId];
      return p?.backgroundColors && Object.keys(p.backgroundColors).length >= 3 && p.backgroundColors.plainDefaultColor;
    },
    getPokemonsList: (state) =>
      Object.entries(state.pokemons).map(([pokemonId, data]) => ({
        pokemonId,
        ...data,
      })),
  },

  persist: {
    key: STORE_KEY_POKEMON,
    paths: ['pokemons'],
  },
  actions: {
    _savePokemonDataById(pokemonId, data) {
      if (!pokemonId) return;
      if (!data || typeof data !== 'object') return;
      this.pokemons[pokemonId] = { ...data, lastUpdateTime: Date.now() };
      return this.pokemons[pokemonId];
    },

    _isStalePokemon(pokemonId) {
      const entry = this.pokemonDetails[pokemonId];
      if (!entry) return true;
      return Date.now() - entry.updatedAt > 1000 * 60 * 60 * 24 * 7; // TODO: READ SETTINGS data.refreshRate
    },

    async _pokemonFetchIsPossible() {
      this.loading = true;
      this.clearError();
      const isOnline = await hasInternetConnection();
      const canFetch = await canFetchPokemon();
      if (!isOnline || !canFetch) {
        this.loading = false;
        this.setError(new Error('No internet or cannot fetch'));
        return false;
      } else {
        return true;
      }
    },

    async pokemonByIdHasDetails(pokemonId) {
      const pokemon = await this.getPokemonById(pokemonId);
      if (pokemon != null && pokemon?.baseExperience != null) {
        return true;
      }
      return false;
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

    async fetchAndSavePokemonEssentials(limit = 20, offset = 0) {
      if (!(await this._pokemonFetchIsPossible())) return false;

      // concurrency helper: run promise factories with a concurrency limit
      const runConcurrent = async (factories, concurrency = 6) => {
        const results = [];
        let idx = 0;
        const workers = new Array(Math.min(concurrency, factories.length)).fill(null).map(async () => {
          while (idx < factories.length) {
            const i = idx++;
            try {
              results[i] = await factories[i]();
            } catch (err) {
              results[i] = { status: 'rejected', reason: err };
            }
          }
        });
        await Promise.all(workers);
        return results;
      };

      try {
        const res = await fetch(`${API_BASE}pokemon?limit=${limit}&offset=${offset}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data?.results || !Array.isArray(data.results)) throw new Error('Malformed response from API');

        // --- FIRST PASS: compute medianLight for each result and save minimal pokemon entry ---
        const factories = data.results.map((r) => {
          return async () => {
            const pokemonId = pokemonIdFromUrl(r.url);
            if (!pokemonId) return { pokemonId, ok: false };

            const sprites = getSprites(pokemonId);

            // attempt to get medianLight, but always catch errors and fallback
            let medianLight;
            try {
              medianLight = await getMedianLight(sprites.officialArtwork);
            } catch (err) {
              console.error(`[getMedianLight] error for ${pokemonId}`, err);
              medianLight = COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK;
            }

            const newPokemonEssentials = {
              pokemonId,
              names: { en: r.name },
              sprites,
              // store only medianLight for now. others will be derived later.
              backgroundColors: {
                medianLight,
              },
            };

            try {
              // save minimal data immediately
              this._savePokemonDataById(pokemonId, newPokemonEssentials);
              return { pokemonId, ok: true };
            } catch (saveErr) {
              console.error('Error saving (first pass) pokemon', pokemonId, saveErr);
              return { pokemonId, ok: false, reason: saveErr };
            }
          };
        });

        // Run with limited concurrency to avoid heavy parallel work.
        await runConcurrent(factories, 6);

        // --- SECOND PASS: derive medianAverage & medianDark for saved entries and update them progressively ---
        const allSavedIds = Object.keys(this.pokemons)
          .map((k) => Number(k))
          .filter(Boolean);

        // Build factories for derivation only for entries that have medianLight but miss others.
        const deriveFactories = allSavedIds.map((pokemonId) => {
          return async () => {
            const existing = this.getPokemonById(pokemonId);
            if (!existing) return { pokemonId, ok: false, reason: 'missing' };

            const bg = existing.backgroundColors ?? {};
            // If already has the derived colors skip
            if (bg.medianAverage && bg.medianDark) return { pokemonId, ok: true, skipped: true };

            const medianLight =
              bg.medianLight ??
              (await getMedianLight(existing.sprites?.officialArtwork ?? getSprites(pokemonId).officialArtwork)).catch(
                () => COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK
              );

            let derived;
            try {
              derived = deriveDarkVariants(medianLight);
            } catch (err) {
              console.error('[deriveDarkVariants] error', pokemonId, err);
              derived = {
                medianAverage: COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
                medianDark: COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
              };
            }

            const updatedBg = {
              ...bg,
              medianLight,
              medianAverage: derived.medianAverage,
              medianDark: derived.medianDark,
            };

            // Merge with existing minimal entry and save
            const updated = {
              ...existing,
              backgroundColors: updatedBg,
              lastUpdateTime: Date.now(),
            };

            try {
              this._savePokemonDataById(pokemonId, updated);
              return { pokemonId, ok: true };
            } catch (saveErr) {
              console.error('Error saving (second pass) pokemon', pokemonId, saveErr);
              return { pokemonId, ok: false, reason: saveErr };
            }
          };
        });

        // Run second pass with a slightly lower concurrency to avoid UI jank.
        await runConcurrent(deriveFactories, 4);

        return true;
      } catch (e) {
        this.setError(e);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async fetchAndSavePokemonDetails(pokemonId) {
      if (!(await this._pokemonFetchIsPossible())) return false;
      try {
        const res = await fetch(`${API_BASE}pokemon/${pokemonId}`);
        //if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const existing = this.getPokemonById(pokemonId);
        const sprites = existing != null ? existing.sprites : getSprites(pokemonId);

        // --- COLOR LOGIC FIXED ---
        // Keep existing full backgroundColors if it already contains derived values.
        let backgroundColors = {};
        const existingBg = existing?.backgroundColors ?? null;

        const hasFullBg =
          existingBg &&
          typeof existingBg.plainDefaultColor === 'string' &&
          typeof existingBg.medianLight === 'string' &&
          typeof existingBg.medianAverage === 'string' &&
          typeof existingBg.medianDark === 'string';

        if (hasFullBg) {
          // reuse full set
          backgroundColors = existingBg;
        } else {
          // obtain medianLight either from existing partial data or by computing it
          const fallback = COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK;
          let medianLight =
            (existingBg && typeof existingBg.medianLight === 'string' && existingBg.medianLight) || null;

          if (!medianLight) {
            try {
              medianLight = await getMedianLight(sprites?.officialArtwork);
            } catch (err) {
              console.error('[getMedianLight] error for', pokemonId, err);
              medianLight = fallback;
            }
          }

          // derive the other two colors
          let derived = { medianAverage: fallback, medianDark: fallback };
          try {
            derived = deriveDarkVariants(medianLight);
          } catch (err) {
            console.error('[deriveDarkVariants] error for', pokemonId, err);
            derived = { medianAverage: fallback, medianDark: fallback };
          }

          backgroundColors = {
            plainDefaultColor: fallback,
            medianLight,
            medianAverage: derived.medianAverage,
            medianDark: derived.medianDark,
          };
        }
        // --- END COLOR LOGIC ---

        const pokemonSpecies = await this.getPokemonSpeciesByUrl(data.species.url);

        const pokemonDetails = {
          pokemonId: pokemonId,
          baseExperience: data.base_experience,
          names: {
            en: data.name,
          },
          sprites,
          backgroundColors: backgroundColors,
          types: Array.isArray(data.types) ? data.types.map((t) => t.type.name) : [],
          stats: Array.isArray(data.stats)
            ? data.stats.map((s) => ({
                name: s.stat.name,
                base: s.base_stat,
              }))
            : [],
          species: pokemonSpecies,
          height: data.height,
          weight: data.weight,
          abilities: Array.isArray(data.abilities)
            ? data.abilities.map((a) => ({
                name: a.ability?.name,
                url: a.ability?.url,
                isHidden: a.is_hidden,
                slot: a.slot,
              }))
            : [],
          forms: Array.isArray(data.forms)
            ? data.forms.map((f) => ({
                name: f.name,
                url: f.url,
              }))
            : [],
          gameIndices: Array.isArray(data.game_indices)
            ? data.game_indices.map((g) => ({
                gameIndex: g.game_index,
                version: g.version,
              }))
            : [],
          heldItems: Array.isArray(data.held_items)
            ? data.held_items.map((h) => ({
                item: h.item,
                versionDetails: h.version_details,
              }))
            : [],
          locationAreaEncounters: data.location_area_encounters,
          moves: Array.isArray(data.moves)
            ? data.moves.map((m) => ({
                move: m.move,
                versionGroupDetails: m.version_group_details,
              }))
            : [],
          cries: data.cries ?? {},
          pastTypes: Array.isArray(data.past_types) ? data.past_types : [],
          pastAbilities: Array.isArray(data.past_abilities) ? data.past_abilities : [],
        };

        try {
          await this._savePokemonDataById(pokemonId, pokemonDetails);
        } catch (saveErr) {
          console.error('Error saving pokemon', pokemonId, saveErr);
        }

        return true;
      } catch (e) {
        this.setError(e);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async getPokemonSpeciesByUrl(url) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const flavorTextsByLanguage = {};
        if (Array.isArray(data.flavor_text_entries)) {
          data.flavor_text_entries.forEach((entry) => {
            const lang = entry.language?.name;
            if (lang) {
              flavorTextsByLanguage[lang] = entry.flavor_text.replace(/\f/g, ' ');
            }
          });
        }

        const pokemonSpecies = {
          id: data.id,
          name: data.name,
          order: data.order,
          genderRate: data.gender_rate,
          captureRate: data.capture_rate,
          baseHappiness: data.base_happiness,
          isBaby: data.is_baby,
          isLegendary: data.is_legendary,
          isMythical: data.is_mythical,
          hatchCounter: data.hatch_counter,
          hasGenderDifferences: data.has_gender_differences,
          formsSwitchable: data.forms_switchable,
          growthRate: data.growth_rate,
          pokedexNumbers: data.pokedex_numbers,
          eggGroups: data.egg_groups,
          color: data.color,
          shape: data.shape,
          evolvesFromSpecies: data.evolves_from_species,
          evolutionChain: data.evolution_chain,
          habitat: data.habitat,
          generation: data.generation,
          names: data.names,
          flavorTextEntries: flavorTextsByLanguage,
          formDescriptions: data.form_descriptions,
          genera: data.genera,
          varieties: data.varieties,
        };

        return pokemonSpecies;
      } catch (e) {
        this.setError(e);
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
