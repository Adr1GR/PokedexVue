<template>
  <div>
    <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
    <NavBar />
    <div v-if="pokemonStore.loading">Loading...</div>
    <div v-else>
      <RouterView class="p-4"/>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { usePokemonStore } from "@/renderer/stores/pokemonStore";
import NavBar from "@/renderer/components/Navbar/Navbar.vue";

const pokemonStore = usePokemonStore();

onMounted(async () => {
  if (!pokemonStore.list.length) await pokemonStore.preload(60, 0)
})

</script>

<style scoped lang="scss" src="./App.scss" />
