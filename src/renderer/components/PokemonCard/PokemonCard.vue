<template>
  <div class="hover:-translate-y-1 duration-300">
    <div
      :style="{ backgroundColor: pokemon.dominantColor }"
      class="relative flex flex-col overflow-hidden hover:shadow-lg max-w-sm border border-gray-300 rounded-md"
    >
      <RouterLink
        class="z-20 absolute h-full w-full top-0 left-0"
        :to="{ name: 'pokemon-details', params: { id: pokemon.id } }"
      />
      <div class="h-44 overflow-hidden flex items-center justify-center">
        <img
          v-if="pokemon"
          :src="pokemon.artwork"
          :alt="pokemon?.name"
          loading="lazy"
          crossorigin="anonymous"
          class="w-full h-full object-contain"
        />
      </div>
      <div
        :class="[
          'px-3 py-0.5 rounded-b-md',
          shouldUseLightText(pokemon.dominantColor)
            ? 'text-white'
            : 'text-black',
        ]"
      >
        <h3 class="text-md capitalize">{{ pokemon.name }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { shouldUseLightText } from "@/renderer/helpers/colorHelper";

const { pokemon } = defineProps({ pokemon: { type: Object, required: true } });
</script>

<style scoped lang="scss" src="./PokemonCard.scss" />
