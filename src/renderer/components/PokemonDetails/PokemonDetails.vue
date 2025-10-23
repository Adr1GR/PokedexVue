<template>
  <h1 class="mb-4 font-bold text-2xl text-gray-700 capitalize">
    {{ pokemon.name }}
  </h1>
  <div class="hidden"></div>

  <div
    class="py-6 sm:py-12 grid w-full grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-0 sm:gap-4 md:gap-8"
  >
    <div
      class="h-44 sm:h-80 overflow-hidden flex items-center justify-center border border-gray-300 rounded-md bg-gray-50"
    >
      <img
        :src="pokemon.artwork"
        :alt="pokemon.name"
        class="w-full h-full object-contain"
      />
    </div>
    <div class="mt-8 sm:mt-0">
      <h3 class="text-xl text-gray-700 font-medium mb-2">Pokedex Info</h3>
      <span
        v-for="t in pokemon.types"
        :key="t"
        :class="[
          'inline-block px-2 py-1 rounded text-white text-sm mr-2 capitalize',
        ]"
        :style="{ backgroundColor: getPokemonTypeColor(t.type?.name ?? t) }"
      >
        {{ t }}
      </span>
    </div>
    <div class="mt-8 sm:mt-0">
      <h3 class="text-xl text-gray-700 font-medium mb-2">Base Stats</h3>
      <ul>
        <li v-for="s in pokemon.stats" :key="s.name" class="mb-2">
          <span class="text-md capitalize">{{ s.name }}: {{ s.base }}</span>
          <div class="relative">
            <div class="w-full bg-gray-200 rounded-sm h-4">
              <div
                class="h-full rounded-sm"
                :style="{
                  width: (s.base / 255) * 100 + '%',
                  backgroundColor: getPokemonStatColor(s.name),
                }"
              ></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {
  getPokemonStatColor,
  getPokemonTypeColor,
} from "@/renderer/helpers/colorHelper.js";

const { pokemon } = defineProps({
  pokemon: { type: Object, required: true },
});
</script>

<style scoped lang="scss" src="./PokemonDetails.scss"></style>
