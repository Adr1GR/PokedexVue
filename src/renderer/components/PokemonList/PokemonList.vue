<template>
    <h1 class="text-primary">{{header}}</h1>
      <div id="pokemon-grid" class="pokemon-grid row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        <PokemonCard v-for="pokemon in pokemonsList" :key="pokemon.key" :pokemon="pokemon"/>
      </div>
</template>

<script setup>
import { ref } from 'vue'
import PokemonCard from '../PokemonCard/PokemonCard.vue';

const header = ref('Pokemon List')
const pokemonsList = ref([
  { id: 1, name: 'Pikachu', type: 'Eléctrico', damage: 55, defense: 40 },
  { id: 2, name: 'Charizard', type: 'Fuego/Volador', damage: 84, defense: 78 },
  { id: 3, name: 'Bulbasaur', type: 'Planta/Veneno', damage: 49, defense: 49 },
  { id: 4, name: 'Squirtle', type: 'Agua', damage: 48, defense: 65 },
  { id: 5, name: 'Gengar', type: 'Fantasma/Veneno', damage: 65, defense: 60 },
  { id: 6, name: 'Onix', type: 'Roca/Tierra', damage: 45, defense: 160 },
  { id: 7, name: 'Alakazam', type: 'Psíquico', damage: 50, defense: 45 },
  { id: 8, name: 'Machamp', type: 'Lucha', damage: 100, defense: 80 },
  { id: 9, name: 'Snorlax', type: 'Normal', damage: 110, defense: 65 },
  { id: 10, name: 'Dragonite', type: 'Dragón/Volador', damage: 134, defense: 95 }
]);
</script>

<style scoped lang="scss" src="./PokemonList.scss" />
