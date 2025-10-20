<template>
      <div id="pokemon-grid" class="pokemon-grid relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-100 py-6 sm:py-12">
        <div class="mx-auto max-w-screen-xl px-4 w-full">
          <h2 class="mb-4 font-bold text-xl text-gray-600">{{header}}</h2>
          <div class="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            <PokemonCard v-for="pokemon in pokemonStore.list" :key="pokemon.id" :pokemon="pokemon"/>
          </div>
        </div>
      </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PokemonCard from '../PokemonCard/PokemonCard.vue';
import { usePokemonStore } from '../../../stores/pokemonStore';

const header = ref('Pokemon List')

const pokemonStore = usePokemonStore()


</script>

<style scoped lang="scss" src="./PokemonList.scss" />
