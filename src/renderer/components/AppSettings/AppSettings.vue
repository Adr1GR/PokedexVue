<template>
  <div class="">
    <!-- User -->
    <section class="mb-4 bg-gray-50 rounded-md p-6 shadow">
      <h2 class="medium-title">User</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <label class="flex flex-col">
          <span class="small-title">Language</span>
          <select v-model="language" class="input px-3 py-2 rounded border border-gray-300">
            <option v-for="opt in LANGUAGES" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </label>

        <label class="flex flex-col">
          <span class="small-title">Theme</span>
          <select v-model="theme" class="input px-3 py-2 rounded border border-gray-300">
            <option v-for="opt in THEMES" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </label>
      </div>
    </section>

    <!-- Data -->
    <section class="mb-4 bg-gray-50 rounded-lg p-6 shadow">
      <h2 class="medium-title">Data</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <label class="flex flex-col">
          <span class="small-title">Refresh rate (days)</span>
          <select v-model="refreshRate" class="input px-3 py-2 rounded border border-gray-300">
            <option v-for="opt in DATA_REFRESH_RATES" :key="String(opt)" :value="opt">
              {{ String(opt) }}
            </option>
          </select>
        </label>
      </div>
    </section>

    <!-- Pokemon list -->
    <section class="mb-4 bg-gray-50 rounded-lg p-6 shadow">
      <h2 class="medium-title">Pokemon list</h2>
      <div class="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <label class="flex flex-col md:col-span-1">
          <span class="small-title">"Load more" quantity</span>
          <select v-model="listLoadMoreQuantity" class="input px-3 py-2 rounded border border-gray-300">
            <option v-for="opt in LIST_LOAD_MORE_QUANTITY_OPTIONS" :key="String(opt)" :value="opt">
              {{ String(opt) }}
            </option>
          </select>
        </label>
      </div>

      <details class="mb-4 border-gray-50 rounded">
        <summary class="cursor-pointer font-normal">Styles</summary>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
          <label class="flex flex-col">
            <span class="small-title">Pokemon image style</span>
            <select v-model="listCardImageStyle" class="input px-3 py-2 rounded border border-gray-300">
              <option v-for="opt in LIST_CARD_IMAGE_STYLES" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </label>

          <label class="flex flex-col">
            <span class="small-title">Pokemon background style</span>
            <select v-model="listCardBackgroundStyle" class="input px-3 py-2 rounded border border-gray-300">
              <option v-for="opt in LIST_CARD_BACKGROUND_STYLES" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </label>

          <label class="flex flex-col">
            <span class="small-title">Pokemon background color</span>
            <select v-model="listCardBackgroundColor" class="input px-3 py-2 rounded border border-gray-300">
              <option v-for="opt in LIST_CARD_BACKGROUND_COLORS" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </label>
        </div>
      </details>
    </section>

    <!-- Pokemon details -->
    <section class="mb-4 bg-gray-50 rounded-lg p-6 shadow">
      <h2 class="medium-title">Pokemon details</h2>

      <div class="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <label class="flex flex-col">
          <span class="small-title">Pokemon details page style</span>
          <select v-model="detailsPageStyle" class="input px-3 py-2 rounded border border-gray-300">
            <option v-for="opt in DETAILS_PAGE_STYLES" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </label>
      </div>

      <details class="mb-4 border-gray-50 rounded">
        <summary class="cursor-pointer font-normal">Styles</summary>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
          <label class="flex flex-col">
            <span class="small-title">Pokemon image style</span>
            <select v-model="detailsCardImageStyle" class="input px-3 py-2 rounded border border-gray-300">
              <option v-for="opt in DETAILS_CARD_IMAGE_STYLES" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </label>

          <label class="flex flex-col">
            <span class="small-title">Pokemon background style</span>
            <select v-model="detailsCardBackgroundStyle" class="input px-3 py-2 rounded border border-gray-300">
              <option v-for="opt in DETAILS_CARD_BACKGROUND_STYLES" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </label>

          <label class="flex flex-col">
            <span class="small-title">Pokemon background color</span>
            <select v-model="detailsCardBackgroundColor" class="input px-3 py-2 rounded border border-gray-300">
              <option v-for="opt in DETAILS_CARD_BACKGROUND_COLORS" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </label>
        </div>
      </details>
    </section>

    <!-- Actions -->
    <div class="flex gap-3">
      <!-- <button
        class="px-4 py-2 secondary-background-color secondary-text-color rounded-md"
        @click="resetToDefaults"
      >
        Reset to defaults
      </button> -->
      <button
        class="px-4 py-2 border border-primary-text-color rounded-md cursor-pointer text-red-600"
        @click="initDefaultsForce"
      >
        Force init defaults (overwrite)
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAppSettingsStore } from '@/renderer/stores/appSettingsStore';
import {
  // ---- user-visible settings
  SETTINGS_OPTIONS_APP_LANGUAGES,
  SETTINGS_OPTIONS_APP_THEMES,
  // ---- data & misc
  SETTINGS_OPTIONS_POKEMON_DATA_REFRESH_RATES,
  // ---- list/card settings
  SETTINGS_OPTIONS_POKEMON_LIST_IMAGE_STYLES,
  SETTINGS_OPTIONS_POKEMON_LIST_BACKGROUND_STYLES,
  SETTINGS_OPTIONS_POKEMON_LIST_BACKGROUND_COLORS,
  SETTINGS_OPTIONS_POKEMON_LIST_LOAD_MORE_QUANTITY,
  // ---- details page settings
  SETTINGS_OPTIONS_POKEMON_DETAILS_PAGE_STYLES,
  SETTINGS_OPTIONS_POKEMON_DETAILS_IMAGE_STYLES,
  SETTINGS_OPTIONS_POKEMON_DETAILS_BACKGROUND_STYLES,
  SETTINGS_OPTIONS_POKEMON_DETAILS_BACKGROUND_COLORS,
} from '@/constants/appConstants.js';

const store = useAppSettingsStore();

// Bindings
// ---- user-visible settings
const language = computed({
  get: () => store.user.language,
  set: (v) => store.setAppLanguage(v),
});
const theme = computed({
  get: () => store.user.theme,
  set: (v) => store.setAppTheme(v),
});

// ---- data & misc
const refreshRate = computed({
  get: () => store.data.refreshRate,
  set: (v) => store.setDataRefreshRate(v),
});

// ---- list/card settings
const listCardImageStyle = computed({
  get: () => store.pokemonList.cardImageStyle,
  set: (v) => store.setListCardImageStyle(v),
});
const listCardBackgroundStyle = computed({
  get: () => store.pokemonList.cardBackgroundStyle,
  set: (v) => store.setListCardBackgroundStyle(v),
});
const listCardBackgroundColor = computed({
  get: () => store.pokemonList.cardBackgroundColor,
  set: (v) => store.setListCardBackgroundColor(v),
});
const listLoadMoreQuantity = computed({
  get: () => store.pokemonList.loadMoreQuantity,
  set: (v) => store.setListLoadMoreQuantity(v),
});

// ---- details page settings
const detailsCardImageStyle = computed({
  get: () => store.pokemonDetails.cardImageStyle,
  set: (v) => store.setDetailsCardImageStyle(v),
});
const detailsCardBackgroundColor = computed({
  get: () => store.pokemonDetails.cardBackgroundColor,
  set: (v) => store.setDetailsCardBackgroundColor(v),
});
const detailsCardBackgroundStyle = computed({
  get: () => store.pokemonDetails.cardBackgroundStyle,
  set: (v) => store.setDetailsCardBackgroundStyle(v),
});
const detailsPageStyle = computed({
  get: () => store.pokemonDetails.pageStyle,
  set: (v) => store.setDetailsPageStyle(v),
});

// Expose constants for template
// ---- user-visible settings
const LANGUAGES = SETTINGS_OPTIONS_APP_LANGUAGES;
const THEMES = SETTINGS_OPTIONS_APP_THEMES;
// ---- data & misc
const DATA_REFRESH_RATES = SETTINGS_OPTIONS_POKEMON_DATA_REFRESH_RATES;
// ---- list/card settings
const LIST_CARD_IMAGE_STYLES = SETTINGS_OPTIONS_POKEMON_LIST_IMAGE_STYLES;
const LIST_CARD_BACKGROUND_STYLES = SETTINGS_OPTIONS_POKEMON_LIST_BACKGROUND_STYLES;
const LIST_CARD_BACKGROUND_COLORS = SETTINGS_OPTIONS_POKEMON_LIST_BACKGROUND_COLORS;
const LIST_LOAD_MORE_QUANTITY_OPTIONS = SETTINGS_OPTIONS_POKEMON_LIST_LOAD_MORE_QUANTITY;
// ---- details page settings
const DETAILS_CARD_IMAGE_STYLES = SETTINGS_OPTIONS_POKEMON_DETAILS_IMAGE_STYLES;
const DETAILS_CARD_BACKGROUND_STYLES = SETTINGS_OPTIONS_POKEMON_DETAILS_BACKGROUND_STYLES;
const DETAILS_CARD_BACKGROUND_COLORS = SETTINGS_OPTIONS_POKEMON_DETAILS_BACKGROUND_COLORS;
const DETAILS_PAGE_STYLES = SETTINGS_OPTIONS_POKEMON_DETAILS_PAGE_STYLES;

// Actions
function resetToDefaults() {
  store.resetToDefaults();
}
function initDefaultsForce() {
  store.initDefaults({ force: true });
}
</script>
