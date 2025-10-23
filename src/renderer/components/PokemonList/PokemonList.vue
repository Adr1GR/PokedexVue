<template>
  <div
    id="pokemon-grid"
    class="relative min-h-screen flex-col justify-center overflow-hidden py-6 sm:py-12"
  >
    <div class="">
      <div
        class="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
      >
        <div v-if="pokemonStore.loading">Cargando…</div>
        <div v-else-if="pokemonStore.error">Error: {{ String(pokemonStore.error) }}</div>
        <PokemonCard
          v-for="pokemon in pokemonStore.list"
          :key="pokemon.id"
          :id="pokemon.id"
          :pokemon="pokemon"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { usePokemonStore } from "@/renderer/stores/pokemonStore";
import PokemonCard from "@/renderer/components/PokemonCard/PokemonCard.vue";

const pokemonStore = usePokemonStore();

onMounted(async () => {
  if (!pokemonStore.list.length && !pokemonStore.loading) {
    await pokemonStore.preload(60, 0)
  }
})

</script>

<style scoped lang="scss" src="./PokemonList.scss" />
