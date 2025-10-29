import {
  URL_POKEAPI_BASE,
  URL_SPRITES_BASE,
  STORE_KEY_POKEMON,
  COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
} from '@/constants/appConstants.js';
import { defineStore } from 'pinia';
import { hasInternetConnection, canFetchPokemon } from '@/renderer/helpers/connectionsHelper';
import { getDominantColors } from '@/renderer/helpers/stylesHelper';

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
    getPokemonById: (state) => {
      return (pokemonId) => state.pokemons[pokemonId] || null;
    },
    getAllPokemons: (state) => Object.values(state.pokemons),
    hasImageUrls: (state) => {
      return (pokemonId) => {
        const p = state.pokemons[pokemonId];
        return p?.imageUrl && Object.keys(p.imageUrl).length > 0;
      };
    },
    hasBackgroundColors: (state) => {
      return (pokemonId) => {
        const p = state.pokemons[pokemonId];
        return (
          p?.backgroundColors && Object.keys(p.backgroundColors).length > 0 && p.backgroundColors.plainDefaultColor
        );
      };
    },
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

      try {
        const res = await fetch(`${API_BASE}pokemon?limit=${limit}&offset=${offset}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data?.results || !Array.isArray(data.results)) throw new Error('Malformed response from API');

        const newPokemonEssentials = [];

        for (const r of data.results) {
          if (this.pokemonByIdHasDetails()) {
            const pokemonId = pokemonIdFromUrl(r.url);
            const sprites = getSprites(pokemonId) || null;

            const backgroundColors = await getDominantColors(sprites['officialArtwork']);

            newPokemonEssentials.push({
              pokemonId,
              names: { en: r.name },
              sprites,
              backgroundColors,
            });
          }
        }

        for (const item of newPokemonEssentials) {
          try {
            await this._savePokemonDataById(item.pokemonId, item);
          } catch (saveErr) {
            console.error('Error guardando pokemon', item.pokemonId, saveErr);
          }
        }

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
        const backgroundColors =
          existing && this.hasBackgroundColors(pokemonId)
            ? existing.backgroundColors
            : await getDominantColors(sprites['officialArtwork']); // getDominantColor

        const pokemonSpecies = await this.getPokemonSpeciesByUrl(data.species.url);

        const pokemonDetails = {
          pokemonId: pokemonId,
          baseExperience: data.base_experience,
          names: {
            en: data.name,
          },
          sprites,
          backgroundColors,
          types: Array.isArray(data.types) ? data.types.map((t) => t.type.name) : [],
          stats: Array.isArray(data.stats)
            ? data.stats.map((s) => ({
                name: s.stat.name,
                base: s.base_stat,
              }))
            : [],
          species: pokemonSpecies,

          // --- NUEVO ---
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
              flavorTextsByLanguage[lang] = entry.flavor_text.replace(/\f/g, ' '); // quitar saltos extraños
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
