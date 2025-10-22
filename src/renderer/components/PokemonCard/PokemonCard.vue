<template>
  <div
    class="relative flex flex-col shadow-md rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 max-w-sm"
  >
    <RouterLink
      class="z-20 absolute h-full w-full top-0 left-0"
      :to="{ name: 'pokemon-details', params: { id: pokemon.id } }"
    >
      &nbsp;
    </RouterLink>
    <div class="h-auto overflow-hidden">
      <div class="h-44 overflow-hidden relative">
        <img
          v-if="pokemon"
          :src="pokemon.artwork"
          :alt="pokemon?.name"
          loading="lazy"
        />
      </div>
    </div>
    <div class="bg-white px-3">
      <h3 class="text-lg mb-2">{{ pokemonName }}</h3>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";

const { pokemon } = defineProps({
  pokemon: { type: Object, required: true },
});

let pokemonName = pokemon.name;
pokemonName =
  String(pokemonName).charAt(0).toUpperCase() + String(pokemonName).slice(1);
</script>

<style scoped lang="scss" src="./PokemonCard.scss" />
