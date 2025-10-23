<template>
  <div
    class="relative flex flex-col overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 max-w-sm border border-gray-300 rounded-md bg-gray-50"
  >
    <RouterLink
      class="z-20 absolute h-full w-full top-0 left-0"
      :to="{ name: 'pokemon-details', params: { id: pokemon.id } }"
    >
      &nbsp;
    </RouterLink>
    <div class="h-auto overflow-hidden">
      <div
        class="h-44 overflow-hidden flex items-center justify-center"
      >
        <img
          v-if="pokemon"
          :src="pokemon.artwork"
          :alt="pokemon?.name"
          loading="lazy"
          class="w-full h-full object-contain"
        />
      </div>
    </div>
    <div class="bg-red-500 px-3 py-0.5 rounded-b-md">
      <h3 class="text-md text-white capitalize">{{ pokemon.name }}</h3>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";

const { pokemon } = defineProps({
  pokemon: { type: Object, required: true },
});
</script>

<style scoped lang="scss" src="./PokemonCard.scss" />
