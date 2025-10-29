<template>
  <h1 class="title capitalize">{{ pokemon.names[settingAppLanguage] }}</h1>

  <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    <!-- image -->
    <div
      class="h-44 sm:h-70 md:h-90 overflow-hidden flex items-center justify-center border rounded-md relative"
      :style="styles.container"
    >
      <img
        :src="pokemonImages[settingCardImageStyle]"
        :alt="pokemon.names[settingAppLanguage]"
        class="w-full h-full object-contain"
        crossorigin="anonymous"
        :style="styles.image"
      />
    </div>

    <!-- pokedex info -->
    <div>
      <h3 class="medium-title">Pokedex Info</h3>
      <span
        v-for="t in pokemon.types"
        :key="t"
        class="inline-block px-2 py-1 rounded text-white text-sm mr-2 capitalize"
        :style="{ backgroundColor: getPokemonTypeColor(t.type?.name ?? t) }"
      >
        {{ t }}
      </span>
    </div>

    <!-- base stats -->
    <div>
      <h3 class="medium-title">Base Stats</h3>
      <ul>
        <li v-for="s in pokemon.stats" :key="s.name" class="mb-2">
          <div>
            <span class="capitalize">{{ s.name }}: </span>
            <span class="small-title capitalize">{{ s.base }}</span>
          </div>

          <div class="relative">
            <div class="w-full bg-gray-200 rounded-sm h-4">
              <div
                class="h-full rounded-sm"
                :style="{
                  width: (s.base / 255) * 100 + '%',
                  backgroundColor: getPokemonStatColor(s.name),
                }"
              ></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAppSettingsStore } from '@/renderer/stores/appSettingsStore';
import { usePokemonStore } from '@/renderer/stores/pokemonStore';
import { getPokemonCardStyles } from '@/renderer/helpers/stylesHelper';
import { getPokemonStatColor, getPokemonTypeColor } from '@/renderer/helpers/stylesHelper';

const appSettingsStore = useAppSettingsStore();

const pokemonImages = computed(() => pokemon.sprites);
const pokemonId = computed(() => pokemon.pokemonId);

const settingAppLanguage = appSettingsStore.user.language;

const settingCardImageStyle = appSettingsStore.pokemonDetails.cardImageStyle;
const settingCardBackgroundStyle = appSettingsStore.pokemonDetails.cardBackgroundStyle;
const settingCardBackgroundColor = appSettingsStore.pokemonDetails.cardBackgroundColor;
const settingDetailsPageStyle = appSettingsStore.pokemonDetails.pageStyle;

const { pokemon } = defineProps({
  pokemon: { type: Object, required: true },
});

const styles = computed(() =>
  getPokemonCardStyles({
    pokemon,
    imageStyle: settingCardImageStyle,
    backgroundStyle: settingCardBackgroundStyle,
    backgroundColor: settingCardBackgroundColor,
  })
);
</script>

<style scoped lang="scss" src="./PokemonDetails.scss" />
