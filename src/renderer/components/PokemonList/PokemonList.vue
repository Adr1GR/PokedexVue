<template>
  <div
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
  >
    <PokemonCard
      v-for="pokemon in pokemonStore.pokemonList"
      :key="pokemon.id"
      :id="pokemon.id"
      :pokemon="pokemon"
    />
  </div>
</template>

<script setup>
import { usePokemonStore } from "@/renderer/stores/pokemonStore";
import PokemonCard from "@/renderer/components/PokemonCard/PokemonCard.vue";

const pokemonStore = usePokemonStore();
</script>

<style scoped lang="scss" src="./PokemonList.scss" />
