<template>
  <div class="hover:-translate-y-1 duration-300" ref="container">
    <div
      :style="styles.container"
      class="relative flex flex-col overflow-hidden hover:shadow-xl max-w-sm border rounded-md transition-all duration-200"
    >
      <RouterLink
        class="z-20 absolute h-full w-full top-0 left-0"
        :to="{ name: 'pokemon-details', params: { id: pokemon.pokemonId } }"
      />

      <!-- Image with name overlay -->
      <div class="relative h-44 overflow-hidden flex items-center justify-center">
        <img
          v-if="visible && pokemon"
          :src="pokemon.sprites[settingCardImageStyle]"
          :alt="pokemon.names[settingAppLanguage]"
          class="w-full h-full object-contain"
          loading="lazy"
          crossorigin="anonymous"
          :style="styles.image"
        />

        <!-- ID top-left -->
        <div class="pokemon-card-id absolute top-0 left-0 text-left pl-2 pt-1" :style="{ color: styles.idColor }">
          #{{ pokemon.pokemonId }}
        </div>

        <!-- Name bottom-right -->
        <div
          class="absolute bottom-0 right-0 text-right pr-2 py-1"
          :class="styles.nameTextColor === 'white' ? 'text-white' : 'text-black'"
        >
          <h3 class="pokemon-card-name capitalize">{{ pokemon.names[settingAppLanguage] }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAppSettingsStore } from '@/renderer/stores/appSettingsStore';
import { TIMER_POKEMON_IMAGE_LOAD_WAITING_TIME } from '@/constants/appConstants';
import { getPokemonCardStyles } from '@/renderer/helpers/stylesHelper';

const appSettingsStore = useAppSettingsStore();

const { pokemon } = defineProps({ pokemon: { type: Object, required: true } });
const container = ref(null);
const visible = ref(false);

let observer;
let timer = null;

const settingAppLanguage = appSettingsStore.user.language;
const settingCardImageStyle = appSettingsStore.pokemonList.cardImageStyle;
const settingCardBackgroundStyle = appSettingsStore.pokemonList.cardBackgroundStyle;
const settingCardBackgroundColor = appSettingsStore.pokemonList.cardBackgroundColor;

const styles = computed(() =>
  getPokemonCardStyles({
    pokemon,
    imageStyle: settingCardImageStyle,
    backgroundStyle: settingCardBackgroundStyle,
    backgroundColor: settingCardBackgroundColor,
  })
);

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!timer) {
          timer = setTimeout(() => {
            visible.value = true;
            timer = null;
            observer.disconnect();
          }, TIMER_POKEMON_IMAGE_LOAD_WAITING_TIME);
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
