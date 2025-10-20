<template>
  <div>
    <PokemonList/>
  </div>
</template>

<script setup>
import PokemonList from './components/PokemonList/PokemonList.vue'
import { usePokemonStore } from '../stores/pokemonStore'
import { onMounted } from 'vue'

const pokemonStore = usePokemonStore()

onMounted(async () => {
  if (!pokemonStore.list.length) {
    await pokemonStore.preload()
  }
})

</script>

<style scoped lang="scss" src="./App.scss" />
