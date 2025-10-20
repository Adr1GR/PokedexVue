<template>
    <h1 class="">detalles pokemon</h1>
</template>

<script setup>
import { onMounted } from 'vue';
import { usePokemonStore } from '../../../stores/pokemonStore';

const pokemonStore = usePokemonStore()

</script>

<style scoped lang="scss" src="./PokemonDetails.scss"></style>