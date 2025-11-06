<template>
  <div>
    <h1 class="title">{{ header }}</h1>

    <LoadingPokeball v-if="loading && !showError" />
    <PokemonList v-else-if="dataReady" :pokemons="pokemons" id="pokemon-grid" class="mb-14" />

    <div
      v-if="showError"
      class="secondary-text-color secondary-background-color fixed inset-x-0 bottom-20 sm:bottom-80 z-50 p-4 flex items-center justify-between mx-0 xs:mx-20 sm:mx-40 md:mx-60 lg:mx-80 xl:mx-100 cursor-pointer"
      role="alert"
    ></div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { usePokemonStore } from '@/renderer/stores/pokemonStore';
import PokemonList from '@/renderer/components/PokemonList/PokemonList.vue';
import LoadingPokeball from '@/renderer/components/LoadingPokeball/LoadingPokeball.vue';

const pokemonStore = usePokemonStore();

const header = 'Pokédex';
const showError = computed(() => !!pokemonStore.error);
const loading = computed(() => !!pokemonStore.loading);
let dataReady = ref(false);

let pokemons = ref([]);

onMounted(async () => {
  if (!pokemonStore.savedPokemonList) {
    await pokemonStore.fetchAndSaveAllPokemonsList(pokemons.value);
  }
  pokemons.value = await pokemonStore.getAllPokemons;
  dataReady.value = true;
});
</script>

<style></style>
