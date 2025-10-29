<template>
  <div>
    <h1 class="title">{{ header }}</h1>
    <AppSettings/>
  </div>
</template>

<script setup>
import AppSettings from '@/renderer/components/AppSettings/AppSettings.vue';
import { ref } from 'vue';

const header = ref("Settings (Working on)")
</script>

<style></style>
