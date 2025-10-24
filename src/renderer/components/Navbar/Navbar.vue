<template>
  <!-- Navbar móvil -->
  <nav
    class="fixed bottom-0 left-0 w-full h-14 sm:hidden z-[9999] bg-red-600 text-white flex items-center"
  >
    <RouterLink
      class="flex-1 flex flex-col items-center justify-center"
      :to="{ name: 'pokemon-list' }"
    >
      <span class="text-sm">Home</span>
    </RouterLink>

    <a
      class="flex-1 flex flex-col items-center justify-center"
      href="https://github.com/Adr1GR/PokedexVue"
      target="_blank"
    >
      <span class="text-sm">Source</span>
    </a>

    <a
      class="flex-1 flex flex-col items-center justify-center"
      href="https://github.com/Adr1GR/PokedexVue/releases/latest"
      target="_blank"
    >
      <span class="text-sm">Downloads</span>
    </a>
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
      <a
        class="py-2 px-4 leading-normal no-underline hover:bg-red-500"
        href="https://github.com/Adr1GR/PokedexVue/releases/latest"
        target="_blank"
        >Downloads</a
      >
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
