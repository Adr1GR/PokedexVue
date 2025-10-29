/* URLs */
export const URL_POKEAPI_BASE = 'https://pokeapi.co/api/v2/';
export const URL_SPRITES_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/';
export const URL_CHECK_INTERNET_CONNECTION = 'https://www.google.com/favicon.ico';
export const URL_APP_REPOSITORY = 'https://github.com/Adr1GR/PokedexVue';
export const URL_APP_DOWNLOADS = 'https://github.com/Adr1GR/PokedexVue/releases/latest';

/** Stores Keys */
export const STORE_KEY_POKEMON = 'pokemon-store-v3';
export const STORE_KEY_APP_SETTINGS = 'app-settings-v1';

/* ====== App Settings options ====== */

// ---- user-visible settings
export const SETTINGS_OPTIONS_APP_LANGUAGES = ['en', 'es'];
export const SETTINGS_OPTIONS_APP_THEMES = ['light', 'dark'];

// ---- data & misc
export const SETTINGS_OPTIONS_POKEMON_DATA_REFRESH_RATES = [1, 7, 15, 30, 'never'];

// ---- list/card settings
export const SETTINGS_OPTIONS_POKEMON_LIST_IMAGE_STYLES = [
  'officialArtwork',
  'officialArtworkShiny',
  'sprite',
  'spriteBack',
  'spriteShiny',
  'spriteShinyBack',
  'home',
  'homeShiny',
  'showdown',
];

export const SETTINGS_OPTIONS_POKEMON_LIST_BACKGROUND_STYLES = ['diagonal', 'fullCover'];

export const SETTINGS_OPTIONS_POKEMON_LIST_BACKGROUND_COLORS = [
  'plainDefaultColor',
  'medianLight',
  'medianAverage',
  'medianDark',
];

export const SETTINGS_OPTIONS_POKEMON_LIST_LOAD_MORE_QUANTITY = [12, 30, 48];

// ---- details page settings
export const SETTINGS_OPTIONS_POKEMON_DETAILS_IMAGE_STYLES = [
  'officialArtwork',
  'officialArtworkShiny',
  'sprite',
  'spriteBack',
  'spriteShiny',
  'spriteShinyBack',
  'home',
  'homeShiny',
  'showdown',
];

export const SETTINGS_OPTIONS_POKEMON_DETAILS_BACKGROUND_STYLES = ['diagonal', 'fullCover'];

export const SETTINGS_OPTIONS_POKEMON_DETAILS_BACKGROUND_COLORS = [
  'plainDefaultColor',
  'medianLight',
  'medianAverage',
  'medianDark',
];

export const SETTINGS_OPTIONS_POKEMON_DETAILS_PAGE_STYLES = ['default', 'simple'];

/** ====== App Settings Default Options ====== */

// ---- user-visible settings
export const DEFAULT_OPTION_APP_LANGUAGES = 'en';
export const DEFAULT_OPTION_APP_THEMES = 'light';

// ---- data & misc
export const DEFAULT_OPTION_POKEMON_DATA_REFRESH_RATES = 7;

// ---- list/card settings
export const DEFAULT_OPTION_POKEMON_LIST_IMAGE_STYLES = 'officialArtwork';

export const DEFAULT_OPTION_POKEMON_LIST_BACKGROUND_STYLES = 'diagonal';

export const DEFAULT_OPTION_POKEMON_LIST_BACKGROUND_COLORS = 'medianLight';

export const DEFAULT_OPTION_POKEMON_LIST_LOAD_MORE_QUANTITY = 12;

// ---- details page settings
export const DEFAULT_OPTION_POKEMON_DETAILS_IMAGE_STYLES = 'officialArtwork';

export const DEFAULT_OPTION_POKEMON_DETAILS_BACKGROUND_STYLES = 'diagonal';

export const DEFAULT_OPTION_POKEMON_DETAILS_BACKGROUND_COLORS = 'medianLight';

export const DEFAULT_OPTION_POKEMON_DETAILS_PAGE_STYLES = 'default';

/*
 *
 *
 * Colors default values and fallbacks*/
export const COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK = 'rgb(235,235,235)';
export const COLOR_DEFAULT_POKEMON_ID_FALLBACK = '#888888';

export const COLOR_DEFAULT_POKEMON_STAT_HP = '#EF4444';
export const COLOR_DEFAULT_POKEMON_STAT_ATTACK = '#F97316';
export const COLOR_DEFAULT_POKEMON_STAT_DEFENSE = '#EAB308';
export const COLOR_DEFAULT_POKEMON_STAT_SPECIAL_ATTACK = '#3B82F6';
export const COLOR_DEFAULT_POKEMON_STAT_SPECIAL_DEFENSE = '#22C55E';
export const COLOR_DEFAULT_POKEMON_STAT_SPEED = '#EC4899';

export const COLOR_DEFAULT_POKEMON_TYPE_NORMAL = '#9CA3AF';
export const COLOR_DEFAULT_POKEMON_TYPE_FIRE = '#EF4444';
export const COLOR_DEFAULT_POKEMON_TYPE_WATER = '#3B82F6';
export const COLOR_DEFAULT_POKEMON_TYPE_ELECTRIC = '#FACC15';
export const COLOR_DEFAULT_POKEMON_TYPE_GRASS = '#22C55E';
export const COLOR_DEFAULT_POKEMON_TYPE_ICE = '#22D3EE';
export const COLOR_DEFAULT_POKEMON_TYPE_FIGHTING = '#C2410C';
export const COLOR_DEFAULT_POKEMON_TYPE_POISON = '#A855F7';
export const COLOR_DEFAULT_POKEMON_TYPE_GROUND = '#D97706';
export const COLOR_DEFAULT_POKEMON_TYPE_FLYING = '#38BDF8';
export const COLOR_DEFAULT_POKEMON_TYPE_PSYCHIC = '#F472B6';
export const COLOR_DEFAULT_POKEMON_TYPE_BUG = '#84CC16';
export const COLOR_DEFAULT_POKEMON_TYPE_ROCK = '#78716C';
export const COLOR_DEFAULT_POKEMON_TYPE_GHOST = '#4338CA';
export const COLOR_DEFAULT_POKEMON_TYPE_DRAGON = '#4F46E5';
export const COLOR_DEFAULT_POKEMON_TYPE_DARK = '#262626';
export const COLOR_DEFAULT_POKEMON_TYPE_STEEL = '#6B7280';
export const COLOR_DEFAULT_POKEMON_TYPE_FAIRY = '#F9A8D4';

/*
 *
 *
 * Timers*/

export const TIMER_POKEMON_IMAGE_LOAD_WAITING_TIME = 200;


/*
 *
 *
 * Loads*/
export const FIRST_POKEMON_LOAD_QUANTITY = 30;