<template>
  <div ref="container" :style="styles.container" class="pokemon-card-container">
    <RouterLink class="pokemon-card-details-link" :to="{ name: 'pokemon-details', params: { id: pokemon.pokemon_list_format.id } }" />
    <div class="image-wrapper">
      <img
        v-if="visible && pokemon"
        :src="pokemonImage"
        :alt="pokemon.identifier"
        :class="[
          'pokemon-image transition-all duration-50 ease-in-out',
          imageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md',
        ]"
        loading="lazy"
        crossorigin="anonymous"
        :style="styles.image"
        style="will-change: opacity, filter"
        @load="imageLoaded = true"
      />
      <div class="pokemon-card-id" :style="{ color: styles.idColor }">#{{ pokemon.pokemon_list_format.id }}</div>
      <div>
        <span class="pokemon-card-name">
          {{ pokemon.pokemon_list_format.identifier }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TIMER_POKEMON_IMAGE_LOAD_WAITING_TIME } from '@/constants/appConstants';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAppSettingsStore } from '@/renderer/stores/appSettingsStore';
import { getPokemonCardStyles } from '@/renderer/helpers/stylesHelper';
import { usePokemonStore } from '@/renderer/stores/pokemonStore';

const pokemonStore = usePokemonStore();
const appSettingsStore = useAppSettingsStore();

const settingCardImageStyle = appSettingsStore.pokemonList.cardImageStyle;
const settingCardBackgroundStyle = appSettingsStore.pokemonList.cardBackgroundStyle;

const props = defineProps({ pokemon: Object });
const pokemon = ref(props.pokemon);

const pokemonImage = ref(pokemon.value.sprites[settingCardImageStyle]);


const container = ref(null);
const visible = ref(false);
const imageLoaded = ref(false);

let observer;
let timer = null;

const styles = computed(() =>
  getPokemonCardStyles({
    imageStyle: settingCardImageStyle,
    backgroundStyle: settingCardBackgroundStyle,
    backgroundKey: pokemon.value.pokemon_list_format.type_id_1,
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
