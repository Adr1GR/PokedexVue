<template>
  <!-- Navbar móvil -->
  <nav
    class="fixed bottom-0 left-0 w-full h-14 sm:hidden z-9999 bg-red-600 text-white flex items-center justify-around"
  >
    <a
      class="flex flex-col items-center"
      href="https://github.com/Adr1GR/PokedexVue"
      target="_blank"
    >
      <span class="text-sm">Source</span>
    </a>
    <RouterLink
      :to="{ name: 'pokemon-list' }"
      class="flex flex-col items-center"
    >
      <span class="text-sm">PokedexVue</span>
    </RouterLink>
    <RouterLink
      :to="{ name: 'pokemon-list' }"
      class="flex flex-col items-center"
    >
      <span class="text-sm">About</span>
    </RouterLink>
  </nav>

  <!-- Navbar escritorio -->
  <nav
    id="navbar"
    class="hidden sm:flex bg-red-600 w-full items-center justify-between px-4 py-2 text-white shadow-xs shadow-red-950"
  >
    <RouterLink
      class="py-2 px-4 leading-normal no-underline hover:bg-red-500"
      :to="{ name: 'pokemon-list' }"
      >PokedexVue</RouterLink
    >
    <div class="flex space-x-4">
      <a
        class="py-2 px-4 leading-normal no-underline hover:bg-red-500"
        href="https://github.com/Adr1GR/PokedexVue"
        target="_blank"
        >Source</a
      >
      <RouterLink
        class="py-2 px-4 leading-normal no-underline hover:bg-red-500"
        :to="{ name: 'pokemon-list' }"
        >About</RouterLink
      >
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
