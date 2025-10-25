<template>
  <h1 class="title capitalize">
    {{ pokemon.name }}
  </h1>

  <div
    class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8"
  >
    <!-- image -->
    <div
      class="h-44 sm:h-70 md:h-90 overflow-hidden flex items-center justify-center border border-gray-300 rounded-md"
      :style="{
        background: `linear-gradient(135deg, rgb(245,245,245) 50%, ${pokemon.dominantColor} 50%)`,
        boxShadow: `0 0 12px 1.5px ${pokemon.dominantColor}`,
        borderColor: pokemon.dominantColor,
      }"
    >
      <img
        :src="pokemon.artwork"
        :alt="pokemon.name"
        class="w-full h-full object-contain"
        crossorigin="anonymous"
      />
    </div>

    <!-- pokedex info -->
    <div>
      <h3 class="medium-title">Pokedex Info</h3>
      <span
        v-for="t in pokemon.types"
        :key="t"
        class="inline-block px-2 py-1 rounded text-white text-sm mr-2 capitalize"
        :style="{ backgroundColor: getPokemonTypeColor(t.type?.name ?? t) }"
      >
        {{ t }}
      </span>
    </div>

    <!-- base stats -->
    <div>
      <h3 class="medium-title">Base Stats</h3>
      <ul>
        <li v-for="s in pokemon.stats" :key="s.name" class="mb-2">
          <div>
            <span class=" capitalize">{{ s.name }}: </span>
            <span class="small-title capitalize">{{ s.base }}</span>
          </div>

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
import { usePokemonStore } from "@/renderer/stores/pokemonStore";

const pokemonStore = usePokemonStore();

const { pokemon } = defineProps({
  pokemon: { type: Object, required: true },
});
</script>

<style scoped lang="scss" src="./PokemonDetails.scss"></style>
