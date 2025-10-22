<template>
  <div class="mt-4">
    <h1 class="text-2xl capitalize">{{ pokemon.name }}</h1>
    <img :src="pokemon.artwork" :alt="pokemon.name" />
    <ul>
      <li v-for="s in pokemon.stats" :key="s.name">
        {{ s.name }}: {{ s.base }}
      </li>
    </ul>
    <p>Tipos: {{ pokemon.types.join(", ") }}</p>
  </div>
</template>

<script setup>
const { pokemon } = defineProps({
  pokemon: { type: Object, required: true },
});
</script>

<style scoped lang="scss" src="./PokemonDetails.scss"></style>
