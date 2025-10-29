<template>
  <!-- Navbar móvil -->
  <nav
    class="secondary-background-color fixed bottom-0 left-0 w-full h-14 sm:hidden z-[9999] flex items-center bg-primary/80 backdrop-blur-md font-bold"
  >
    <RouterLink
      class="flex-1 flex flex-col items-center justify-center"
      :to="{ name: 'pokemon-list' }"
    >
      <span class="navbar-links">Pokédex</span>
    </RouterLink>

    <RouterLink
      class="flex-1 flex flex-col items-center justify-center"
      :to="{ name: 'settings' }"
    >
      <span class="navbar-links">Settings</span>
    </RouterLink>
    <!-- <a
      class="flex-1 flex flex-col items-center justify-center"
      :href="URL_APP_DOWNLOADS"
      target="_blank"
    >
      <span class="navbar-links">Downloads</span>
    </a> -->
  </nav>

  <!-- Navbar escritorio -->
  <nav
    id="navbar"
    class="secondary-background-color hidden sm:flex w-full items-center justify-between px-4 py-2 font-bold"
  >
    <RouterLink class="navbar-links py-2 px-4" :to="{ name: 'pokemon-list' }">
      PokedexVue
    </RouterLink>
    <div class="flex space-x-4">
      <a
        class="navbar-links py-2 px-4"
        :href="URL_APP_REPOSITORY"
        target="_blank"
      >
        Source
      </a>
      <a
        class="navbar-links py-2 px-4"
        :href="URL_APP_DOWNLOADS"
        target="_blank"
      >
        Downloads
      </a>
      <RouterLink class="navbar-links py-2 px-4" :to="{ name: 'settings' }">
        Settings
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import {
  URL_APP_REPOSITORY,
  URL_APP_DOWNLOADS,
} from "@/constants/appConstants";
import { RouterLink } from "vue-router";
</script>

<style scoped lang="scss" src="./Navbar.scss" />
