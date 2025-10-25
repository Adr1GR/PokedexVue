<template>
  <!-- Navbar móvil -->
  <nav
    class="secondary-background-color fixed bottom-0 left-0 w-full h-14 sm:hidden z-[9999] flex items-center bg-primary/80 backdrop-blur-md font-bold"
  >
    <RouterLink
      class="flex-1 flex flex-col items-center justify-center"
      :to="{ name: 'pokemon-list' }"
    >
      <span class="navbar-links">Home</span>
    </RouterLink>

    <a
      class="flex-1 flex flex-col items-center justify-center"
      href="https://github.com/Adr1GR/PokedexVue"
      target="_blank"
    >
      <span class="navbar-links">Source</span>
    </a>

    <a
      class="flex-1 flex flex-col items-center justify-center"
      href="https://github.com/Adr1GR/PokedexVue/releases/latest"
      target="_blank"
    >
      <span class="navbar-links">Downloads</span>
    </a>
  </nav>

  <!-- Navbar escritorio -->
  <nav
    id="navbar"
    class="secondary-background-color hidden sm:flex w-full items-center justify-between px-4 py-2 font-bold"
  >
    <RouterLink
      class="navbar-links py-2 px-4"
      :to="{ name: 'pokemon-list' }"
    >
      PokedexVue
    </RouterLink>
    <div class="flex space-x-4">
      <a
        class="navbar-links py-2 px-4"
        href="https://github.com/Adr1GR/PokedexVue"
        target="_blank"
      >
        Source
      </a>
      <a
        class="navbar-links py-2 px-4"
        href="https://github.com/Adr1GR/PokedexVue/releases/latest"
        target="_blank"
      >
        Downloads
      </a>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped lang="scss" src="./Navbar.scss" />