<template>
  <div class="hover:-translate-y-1 duration-300" ref="container">
    <div
      :style="{
        background: `linear-gradient(135deg, rgb(245,245,245) 50%, ${pokemon.dominantColor} 50%)`,
        boxShadow: `0 0 12px 1.5px ${pokemon.dominantColor}`,
        borderColor: pokemon.dominantColor,
      }"
      class="relative flex flex-col overflow-hidden hover:shadow-xl max-w-sm border rounded-md transition-all duration-200"
    >
      <RouterLink
        class="z-20 absolute h-full w-full top-0 left-0"
        :to="{ name: 'pokemon-details', params: { id: pokemon.id } }"
      />

      <!-- Imagen con overlay de nombre -->
      <div
        class="relative h-44 overflow-hidden flex items-center justify-center"
      >
        <img
          v-if="visible && pokemon"
          :src="pokemon.artwork.officialArtwork"
          :alt="pokemon.name"
          class="w-full h-full object-contain"
          loading="lazy"
          crossorigin="anonymous"
        />

        <!-- ID arriba a la izquierda -->
        <div
          class="pokemon-card-id absolute top-0 left-0 text-left pl-2 pt-1"
          :style="{ color: pokemon.dominantColor || '#1f1f20' }"
        >
          #{{ pokemon.id }}
        </div>

        <!-- Nombre abajo a la derecha -->
        <div
          class="absolute bottom-0 right-0 text-right pr-2 py-1"
          :class="
            shouldUseLightText(pokemon.dominantColor)
              ? 'text-white'
              : 'text-black'
          "
        >
          <h3 class="pokemon-card-name capitalize">{{ pokemon.name }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { shouldUseLightText } from "@/renderer/helpers/colorHelper";
import { ref, onMounted, onBeforeUnmount } from "vue";

const { pokemon } = defineProps({ pokemon: { type: Object, required: true } });
const container = ref(null);
const visible = ref(false);
let observer;
let timer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!timer) {
          timer = setTimeout(() => {
            visible.value = true;
            timer = null;
            observer.disconnect();
          }, 200); // 0.20s
        }
      } else {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      }
    },
    { threshold: 0.1 }
  );

  if (container.value) observer.observe(container.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  if (timer) clearTimeout(timer);
});
</script>

<style scoped lang="scss" src="./PokemonCard.scss" />
