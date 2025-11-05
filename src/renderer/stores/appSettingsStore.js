import {
  /** Store key */
  STORE_KEY_APP_SETTINGS,

  /** ===== SETTINGS OPTIONS ===== */
  // ---- user-visible settings
  SETTINGS_OPTIONS_APP_LANGUAGES,
  SETTINGS_OPTIONS_APP_THEMES,
  // ---- data & misc
  SETTINGS_OPTIONS_POKEMON_DATA_REFRESH_RATES,
  // ---- list/card settings
  SETTINGS_OPTIONS_POKEMON_LIST_IMAGE_STYLES,
  SETTINGS_OPTIONS_POKEMON_LIST_BACKGROUND_STYLES,
  SETTINGS_OPTIONS_POKEMON_LIST_LOAD_MORE_QUANTITY,
  // ---- details page settings
  SETTINGS_OPTIONS_POKEMON_DETAILS_IMAGE_STYLES,
  SETTINGS_OPTIONS_POKEMON_DETAILS_BACKGROUND_STYLES,
  SETTINGS_OPTIONS_POKEMON_DETAILS_PAGE_STYLES,

  /** ===== SETTINGS DEFAULT OPTIONS ===== */
  // ---- user-visible settings
  DEFAULT_OPTION_APP_LANGUAGES,
  DEFAULT_OPTION_APP_THEMES,
  // ---- data & misc
  DEFAULT_OPTION_POKEMON_DATA_REFRESH_RATES,
  // ---- list/card settings
  DEFAULT_OPTION_POKEMON_LIST_IMAGE_STYLES,
  DEFAULT_OPTION_POKEMON_LIST_BACKGROUND_STYLES,
  DEFAULT_OPTION_POKEMON_LIST_LOAD_MORE_QUANTITY,
  // ---- details page settings
  DEFAULT_OPTION_POKEMON_DETAILS_IMAGE_STYLES,
  DEFAULT_OPTION_POKEMON_DETAILS_BACKGROUND_STYLES,
  DEFAULT_OPTION_POKEMON_DETAILS_PAGE_STYLES,

  /** Color defaults / fallbacks */
  COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
  COLOR_DEFAULT_POKEMON_ID_FALLBACK,
} from '@/constants/appConstants.js';

import { defineStore } from 'pinia';

export const useAppSettingsStore = defineStore('appSettings', {
  state: () => ({
    // user-visible settings
    user: {
      language: DEFAULT_OPTION_APP_LANGUAGES,
      theme: DEFAULT_OPTION_APP_THEMES,
    },

    // data & misc
    data: {
      refreshRate: DEFAULT_OPTION_POKEMON_DATA_REFRESH_RATES,
    },

    // list/card settings
    pokemonList: {
      cardImageStyle: DEFAULT_OPTION_POKEMON_LIST_IMAGE_STYLES,
      cardBackgroundStyle: DEFAULT_OPTION_POKEMON_LIST_BACKGROUND_STYLES,
      loadMoreQuantity: DEFAULT_OPTION_POKEMON_LIST_LOAD_MORE_QUANTITY,
    },

    // details page settings
    pokemonDetails: {
      cardImageStyle: DEFAULT_OPTION_POKEMON_DETAILS_IMAGE_STYLES,
      cardBackgroundStyle: DEFAULT_OPTION_POKEMON_DETAILS_BACKGROUND_STYLES,
      pageStyle: DEFAULT_OPTION_POKEMON_DETAILS_PAGE_STYLES,
    },

    // UI color fallbacks
    colorFallbacks: {
      background: COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
      id: COLOR_DEFAULT_POKEMON_ID_FALLBACK,
    },
  }),

  persist: {
    key: STORE_KEY_APP_SETTINGS,
    paths: ['user', 'data', 'pokemonList', 'pokemonDetails'],
  },

  getters: {
    userConfig: (s) => s.user,
    dataConfig: (s) => s.data,
    pokemonListConfig: (s) => s.pokemonList,
    pokemonDetailsConfig: (s) => s.pokemonDetails,

    combinedPokemonConfig: (s) => ({
      // list
      cardImageStyle: s.pokemonList.imageStyle,
      cardBackgroundStyle: s.pokemonList.cardBackgroundStyle,
      loadMoreQuantity: s.pokemonList.loadMoreQuantity,

      // details
      cardImageStyle: s.pokemonList.imageStyle,
      cardBackgroundStyle: s.pokemonList.cardBackgroundStyle,
      pageStyle: s.pokemonList.pageStyle,
    }),
  },

  actions: {
    // --- User ---
    setAppLanguage(lang) {
      if (SETTINGS_OPTIONS_APP_LANGUAGES.includes(lang)) {
        this.user.language = lang;
      }
    },
    setAppTheme(theme) {
      if (SETTINGS_OPTIONS_APP_THEMES.includes(theme)) {
        this.user.theme = theme;
      }
    },

    // --- Data ---
    setDataRefreshRate(rate) {
      if (SETTINGS_OPTIONS_POKEMON_DATA_REFRESH_RATES.includes(rate)) {
        this.data.refreshRate = rate;
      }
    },

    // --- Pokemon List ---
    setListCardImageStyle(imageStyle) {
      if (SETTINGS_OPTIONS_POKEMON_LIST_IMAGE_STYLES.includes(imageStyle)) {
        this.pokemonList.cardImageStyle = imageStyle;
      }
    },

    setListCardBackgroundStyle(backgroundStyle) {
      if (SETTINGS_OPTIONS_POKEMON_LIST_BACKGROUND_STYLES.includes(backgroundStyle)) {
        this.pokemonList.cardBackgroundStyle = backgroundStyle;
      }
    },

    setListLoadMoreQuantity(quantity) {
      if (SETTINGS_OPTIONS_POKEMON_LIST_LOAD_MORE_QUANTITY.includes(quantity)) {
        this.pokemonList.loadMoreQuantity = quantity;
      }
    },

    // --- Pokemon Details ---
    setDetailsCardImageStyle(imageStyle) {
      if (SETTINGS_OPTIONS_POKEMON_DETAILS_IMAGE_STYLES.includes(imageStyle)) {
        this.pokemonDetails.cardImageStyle = imageStyle;
      }
    },

    setDetailsCardBackgroundStyle(backgroundStyle) {
      if (SETTINGS_OPTIONS_POKEMON_DETAILS_BACKGROUND_STYLES.includes(backgroundStyle)) {
        this.pokemonDetails.cardBackgroundStyle = backgroundStyle;
      }
    },

    setDetailsPageStyle(pStyle) {
      if (SETTINGS_OPTIONS_POKEMON_DETAILS_PAGE_STYLES.includes(pStyle)) {
        this.pokemonDetails.pageStyle = pStyle;
      }
    },

    // init localstorage with default values
    initDefaults({ force = false } = {}) {
      const storageKey = STORE_KEY_APP_SETTINGS;
      const exists = !!localStorage.getItem(storageKey);
      if (!force && exists) return false;

      const defaults = {
        user: {
          language: DEFAULT_OPTION_APP_LANGUAGES ?? 'english',
          theme: DEFAULT_OPTION_APP_THEMES ?? 'light',
        },
        data: {
          refreshRate: DEFAULT_OPTION_POKEMON_DATA_REFRESH_RATES ?? 7,
        },
        pokemonList: {
          cardImageStyle: DEFAULT_OPTION_POKEMON_LIST_IMAGE_STYLES ?? 'officialArtwork',
          cardBackgroundStyle: DEFAULT_OPTION_POKEMON_LIST_BACKGROUND_STYLES ?? 'diagonal',
          loadMoreQuantity: DEFAULT_OPTION_POKEMON_LIST_LOAD_MORE_QUANTITY ?? 30,
        },
        pokemonDetails: {
          cardImageStyle: DEFAULT_OPTION_POKEMON_DETAILS_IMAGE_STYLES ?? 'officialArtwork',
          cardBackgroundStyle: DEFAULT_OPTION_POKEMON_DETAILS_BACKGROUND_STYLES ?? 'diagonal',
          pageStyle: DEFAULT_OPTION_POKEMON_DETAILS_PAGE_STYLES ?? 'default',
        },
      };

      try {
        localStorage.setItem(storageKey, JSON.stringify(defaults));
      } catch (err) {
        console.warn('Could not write defaults to localStorage', err);
      }

      this.$patch(defaults);
      return true;
    },

    // reset to constants defaults (does NOT touch localStorage)
    resetToDefaults() {
      this.$patch({
        user: {
          language: DEFAULT_OPTION_APP_LANGUAGES ?? 'english',
          theme: DEFAULT_OPTION_APP_THEMES ?? 'light',
        },
        data: {
          refreshRate: DEFAULT_OPTION_POKEMON_DATA_REFRESH_RATES ?? 7,
        },
        pokemonList: {
          cardImageStyle: DEFAULT_OPTION_POKEMON_LIST_IMAGE_STYLES ?? 'officialArtwork',
          cardBackgroundStyle: DEFAULT_OPTION_POKEMON_LIST_BACKGROUND_STYLES ?? 'diagonal',
          loadMoreQuantity: DEFAULT_OPTION_POKEMON_LIST_LOAD_MORE_QUANTITY ?? 30,
        },
        pokemonDetails: {
          cardImageStyle: DEFAULT_OPTION_POKEMON_DETAILS_IMAGE_STYLES ?? 'officialArtwork',
          cardBackgroundStyle: DEFAULT_OPTION_POKEMON_DETAILS_BACKGROUND_STYLES ?? 'diagonal',
          pageStyle: DEFAULT_OPTION_POKEMON_DETAILS_PAGE_STYLES ?? 'default',
        },
      });
    },
  },
});
