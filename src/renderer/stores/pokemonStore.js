import { URL_POKEAPI_BASE, URL_SPRITES_BASE, URL_POKEMON_DATA, STORE_KEY_POKEMON } from '@/constants/appConstants.js';
import { defineStore } from 'pinia';
import { hasInternetConnection, canFetchPokemon } from '@/renderer/helpers/connectionsHelper';

const API_BASE = import.meta.env.VITE_POKEAPI_BASE_URL ?? URL_POKEAPI_BASE;
const POKEMON_DATA = import.meta.env.VITE_POKEMON_DATA_URL ?? URL_POKEMON_DATA;
const SPRITES_BASE = import.meta.env.VITE_POKESPRITES_BASE_URL ?? URL_SPRITES_BASE;

const getSprites = (id) => ({
  tileSprite: {
    tileName: null,
    position: {
      x: null,
      y: null,
    },
  },
  officialArtwork: `${SPRITES_BASE}pokemon/other/official-artwork/${id}.png`,
  officialArtworkShiny: `${SPRITES_BASE}pokemon/other/official-artwork/shiny/${id}.png`,
  sprite: `${SPRITES_BASE}pokemon/${id}.png`,
  spriteBack: `${SPRITES_BASE}pokemon/back/${id}.png`,
  spriteShiny: `${SPRITES_BASE}pokemon/shiny/${id}.png`,
  spriteShinyBack: `${SPRITES_BASE}pokemon/back/shiny/${id}.png`,
  home: `${SPRITES_BASE}pokemon/other/home/${id}.png`,
  homeShiny: `${SPRITES_BASE}pokemon/other/home/shiny/${id}.png`,
  showdown: `${SPRITES_BASE}pokemon/other/showdown/${id}.gif`,
});

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: {},
    loading: false,
    error: null,
  }),
  getters: {
    total: (state) => Object.keys(state.pokemons).length,
    getPokemonById: (state) => (id) => state.pokemons[id] || null,
    getAllPokemons: (state) => Object.values(state.pokemons),
    hasImageUrls: (state) => (id) => {
      const p = state.pokemons[id];
      return p?.imageUrl && Object.keys(p.imageUrl).length > 0;
    },
    getPokemonsList: (state) =>
      Object.entries(state.pokemons).map(([id, data]) => ({
        id,
        ...data,
      })),
    getImageUrlFromPokemon: (state) => (id, imageStyle) => state.pokemons[id].sprites[imageStyle] || null,
  },

  persist: {
    key: STORE_KEY_POKEMON,
    paths: ['pokemons'],
  },
  actions: {
    _savePokemonDataById(id, data) {
      if (!id) return;
      if (!data || typeof data !== 'object') return;
      this.pokemons[id] = { ...data, lastUpdateTime: Date.now() };
      return this.pokemons[id];
    },

    _isStalePokemon(id) {
      const entry = this.pokemonDetails[id];
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

    async pokemonByIdHasDetails(id) {
      const pokemon = await this.getPokemonById(id);
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

    async getAllPokemonsList() {
      this.loading = true;
      try {
        const data = await fetch(POKEMON_DATA)
          .then((response) => response.json())
          .catch((e) => console.error('Error fetching JSON: ', e));
        this.loading = false;
        return data;
      } catch (e) {
        console.error(e);
        this.setError(e);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async addImageUrlToPokemons(list) {
      list.forEach(async (e) => {
        const pokemonImages = {
          sprites: getSprites(e.id),
        };
        try {
          await this._savePokemonDataById(e.id, pokemonImages);
        } catch (e) {
          console.error('Error saving pokemon', e);
        }
      });
    },

    async fetchAndSavePokemonDetails(id) {
      if (!(await this._pokemonFetchIsPossible())) return false;
      try {
        const res = await fetch(`${API_BASE}pokemon/${id}`);
        //if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const existing = this.getPokemonById(id);
        const sprites = existing != null ? existing.sprites : getSprites(id);

        const pokemonSpecies = await this.getPokemonSpeciesByUrl(data.species.url);

        const pokemonDetails = {
          id: id,
          baseExperience: data.base_experience,
          names: {
            en: data.name,
          },
          sprites,
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
          await this._savePokemonDataById(id, pokemonDetails);
        } catch (e) {
          console.error('Error saving pokemon', id, e);
        }
        return true;
      } catch (e) {
        console.error(e);
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
        console.error(e);
        this.setError(e);
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
