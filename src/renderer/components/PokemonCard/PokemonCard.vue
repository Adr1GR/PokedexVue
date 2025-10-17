<template>
  <div class="card text-start">
      <img class="card-img-top" src="" alt="Title" />
    <div class="card-body">
      <h4 class="card-title">{{ pokemon.name }}</h4>
      <p class="card-text">{{ pokemon.type }}</p>
     </div>
   </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'

const { pokemon } = defineProps({
  pokemon: { type: Object, required: true }
})

</script>

<style scoped lang="scss" src="./PokemonCard.scss" />
