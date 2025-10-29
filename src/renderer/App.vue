<template>
  <div class="main-container">
    <NavBar />
    <RouterView
      class="mx-auto md:max-w-screen-2xl mb-24 sm:mb-14 px-4 2xl:px-0 py-6"
    />
  </div>
</template>

<script setup>
import NavBar from "@/renderer/components/Navbar/Navbar.vue";
import { useAppSettingsStore } from "@/renderer/stores/appSettingsStore";

const appSettings = useAppSettingsStore()

appSettings.initDefaults(true)
</script>

<style scoped lang="scss" src="./App.scss" />
