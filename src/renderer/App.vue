<template>
  <div class="main-container">
    <NavBar />
    <RouterView
      class="mx-auto max-w-screen-xl w-full p-4 mb-8 sm:mb-0 mt-0 sm:mt-8"
    />
  </div>
</template>

<script setup>
import NavBar from "@/renderer/components/Navbar/Navbar.vue";
</script>

<style scoped lang="scss" src="./App.scss" />
