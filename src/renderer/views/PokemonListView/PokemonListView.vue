<template>
  <div>
    <h1 class="mb-4 font-bold text-2xl text-gray-700">{{ header }}</h1>

    <!--TODO: Load spinner -->
    <div v-if="pokemonStore.loading && !pokemonStore.hasError" class="p-4">
      Loading...
    </div>

    <!-- Render cache -->
    <div v-else class="relative">
      <PokemonList />
    </div>

    <!-- Error Banner -->
    <div
      v-if="
        pokemonStore.preloaded == false &&
        pokemonStore.list.length <= 0
      "
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

import { onMounted } from "vue";
import { usePokemonStore } from "@/renderer/stores/pokemonStore";
import { showErrorPopup } from "@/renderer/helpers/errorHelper";

const header = "Pokemon List";
const pokemonStore = usePokemonStore();

onMounted(async () => {
  pokemonStore.resetStates();
  try {
    await pokemonStore.preload(36, 0);
  } catch (e) {
    showErrorPopup(e);
    console.warn("[App] preload falló:", e?.message || e);
  }
});

async function retryPreload() {
  try {
    pokemonStore.resetStates();
    await pokemonStore.preload(36, 0);
  } catch (e) {
    showErrorPopup(e);
  }
}
</script>

<style></style>
