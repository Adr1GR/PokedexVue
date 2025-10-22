<template>
  <div>
    <h2 class="mb-4 font-bold text-xl text-gray-600">{{ header }}</h2>
    <PokemonList />
  </div>
</template>

<script setup>
import { ref } from "vue";
import PokemonList from "@/renderer/components/PokemonList/PokemonList.vue";

const header = ref("Pokemon List");
</script>

<style></style>
