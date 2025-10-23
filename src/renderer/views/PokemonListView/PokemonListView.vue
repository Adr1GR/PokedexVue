<template>
  <div>
    <h1 class="mb-4 font-bold text-2xl text-gray-700">{{ header }}</h1>
    <PokemonList />
  </div>
</template>

<script setup>
import { ref } from "vue";
import PokemonList from "@/renderer/components/PokemonList/PokemonList.vue";

const header = ref("Pokemon List");
</script>

<style></style>
