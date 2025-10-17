<template>
    <h1>Pokemon List</h1>
    <ul id="pokemonList" class="pokemonList">
    </ul>
</template>

<script>
import { ref } from 'vue'

const pokemons = [
  { name: "Pikachu", type: "Eléctrico", damage: 55, defense: 40 },
  { name: "Charizard", type: "Fuego/Volador", damage: 84, defense: 78 },
  { name: "Bulbasaur", type: "Planta/Veneno", damage: 49, defense: 49 },
  { name: "Squirtle", type: "Agua", damage: 48, defense: 65 },
  { name: "Gengar", type: "Fantasma/Veneno", damage: 65, defense: 60 },
  { name: "Onix", type: "Roca/Tierra", damage: 45, defense: 160 },
  { name: "Alakazam", type: "Psíquico", damage: 50, defense: 45 },
  { name: "Machamp", type: "Lucha", damage: 100, defense: 80 },
  { name: "Snorlax", type: "Normal", damage: 110, defense: 65 },
  { name: "Dragonite", type: "Dragón/Volador", damage: 134, defense: 95 }
];

for (let i = 0; i < pokemons.length; i++) {


}

</script>

<style scoped lang="scss" src="./PokemonList.scss" />
