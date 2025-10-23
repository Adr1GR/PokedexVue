<template>
  <div>
    <NavBar />
    <div v-if="pokemonStore.loading">Loading...</div>
    <div v-else>
      <RouterView class="mx-auto max-w-screen-xl w-full p-4 mb-8 sm:mb-0 mt-0 sm:mt-8"/>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { usePokemonStore } from "@/renderer/stores/pokemonStore";
import NavBar from "@/renderer/components/Navbar/Navbar.vue";

const pokemonStore = usePokemonStore();

onMounted(async () => {
  if (!pokemonStore.list.length) await pokemonStore.preload(36, 0)
})

</script>

<style scoped lang="scss" src="./App.scss" />
