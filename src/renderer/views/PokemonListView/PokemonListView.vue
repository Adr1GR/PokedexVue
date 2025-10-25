<template>
  <div>
    <h1 class="mb-4 font-bold text-2xl text-gray-700">{{ header }}</h1>

    <!--TODO: Load spinner -->
    <div v-if="loading && !showError" class="p-4">Loading...</div>

    <!-- Render cache -->
    <div v-else class="relative">
      <PokemonList />
    </div>

    <!-- Error Banner -->
    <div
      v-if="showError"
      class="fixed inset-x-0 bottom-20 sm:bottom-80 z-50 bg-red-600 text-white p-4 flex items-center justify-between mx-0 xs:mx-20 sm:mx-40 md:mx-60 lg:mx-80 xl:mx-100"
      role="alert"
    >
      <div>
        <div class="font-semibold">Unnable to connect</div>
        <div class="text-sm mt-1">
          Error: {{ pokemonStore.error?.message || "Unknown" }}
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="retryPreload"
          class="px-3 py-1 rounded bg-white text-black"
        >
          Retry
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import PokemonList from "@/renderer/components/PokemonList/PokemonList.vue";

import { onMounted, computed } from "vue";
import { usePokemonStore } from "@/renderer/stores/pokemonStore";

const header = "Pokédex";
const pokemonStore = usePokemonStore();
const showError = computed(() => !!pokemonStore.error);
const loading = computed(() => !!pokemonStore.loading);

onMounted(async () => {
  if (pokemonStore.total <= 0) {
    try {
      await pokemonStore.fetchPokemonList(151, 0);
    } catch (e) {
      console.log(e);
    }
  } else {
    await pokemonStore.loadPokemonListFromStorage();
  }
});

async function retryPreload() {
  pokemonStore.clearError();
  await pokemonStore.fetchPokemonList(36, 0);
}
</script>

<style></style>
