<template>
  <div>
    <h1 class="title">{{ header }}</h1>

    <!-- Load spinner -->
    <LoadingPokeball v-if="loading && !showError && listLength <= 0" />

    <!-- Render pokemonList -->
    <div v-else>
      <PokemonList id="pokemon-grid" class="mb-14" />

      <button
        v-if="listLength > 0"
        @click="loadMore"
        class="secondary-text-color secondary-background-color mx-auto block px-12 py-3 rounded-xl font-semibold cursor-pointer flex items-center justify-center"
        :disabled="loading"
      >
        <span v-if="!loading">Load more</span>
        <img v-else src="@/assets/images/pokeball.png" alt="Loading" class="pokeball-spin-button" />
      </button>
    </div>

    <!-- Error Banner -->
    <div
      v-if="showError"
      class="secondary-text-color secondary-background-color fixed inset-x-0 bottom-20 sm:bottom-80 z-50 p-4 flex items-center justify-between mx-0 xs:mx-20 sm:mx-40 md:mx-60 lg:mx-80 xl:mx-100 cursor-pointer"
      role="alert"
    >
      <div>
        <div class="font-semibold">Unnable to connect</div>
        <div class="text-sm mt-1">Error: {{ pokemonStore.error?.message || 'Unknown' }}</div>
      </div>
      <div class="flex items-center gap-2">
        <button @click="retryPreload" class="px-3 py-1 rounded bg-white text-black">Retry</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { usePokemonStore } from '@/renderer/stores/pokemonStore';
import PokemonList from '@/renderer/components/PokemonList/PokemonList.vue';
import LoadingPokeball from '@/renderer/components/LoadingPokeball/LoadingPokeball.vue';
import { useAppSettingsStore } from '@/renderer/stores/appSettingsStore';
import { FIRST_POKEMON_LOAD_QUANTITY } from '@/constants/appConstants';

const appSettings = useAppSettingsStore();
const pokemonStore = usePokemonStore();

const header = 'Pokédex';
const showError = computed(() => !!pokemonStore.error);
const loading = computed(() => !!pokemonStore.loading);
const listLength = computed(() => pokemonStore.total);

onMounted(async () => {
  if (pokemonStore.total <= 0) {
    try {
      await pokemonStore.fetchAndSavePokemonEssentials(FIRST_POKEMON_LOAD_QUANTITY, 0);
    } catch (e) {
      console.log(e);
    }
  }
});

async function retryPreload() {
  pokemonStore.clearError();
  await pokemonStore.fetchAndSavePokemonEssentials(FIRST_POKEMON_LOAD_QUANTITY, 0);
}

async function loadMore() {
  await pokemonStore.fetchAndSavePokemonEssentials(appSettings.pokemonList.loadMoreQuantity, listLength.value);
}
</script>

<style></style>
