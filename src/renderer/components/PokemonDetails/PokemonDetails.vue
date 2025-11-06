<template>
  <h1 class="title capitalize">{{ pokemon.species.names.find((e) => e.language.name === 'en')?.name }} / {{ pokemon.species.names.find((e) => e.language.name === 'ja')?.name }}</h1>
  <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    <div
      class="h-44 sm:h-70 md:h-90 overflow-hidden flex items-center justify-center border rounded-md relative"
      :style="styles.container"
    >
      <img
        :src="pokemon.sprites[settingCardImageStyle]"
        :alt="pokemon.name"
        class="w-full h-full object-contain"
        crossorigin="anonymous"
        :style="styles.image"
      />
    </div>

    <div>
      <h3 class="medium-title">Pokedex Info</h3>

      <table id="pokedex-info-table">
        <tbody>
          <tr>
            <th class="small-title">National Nº</th>
            <td>{{ String(pokemon.id).padStart(4, '0') }}</td>
          </tr>
          <tr>
            <th class="small-title">Types</th>
            <td>
              <span
                v-for="t in pokemon.types"
                :key="t"
                class="flex items-center justify-center h-6 w-16 px-2 py-1 rounded text-white text-sm text-center mr-2 capitalize"
                :style="{ backgroundColor: getPokemonTypeColor(t.type?.name ?? t) }"
              >
                {{ t }}
              </span>
            </td>
          </tr>
          <tr>
            <th class="small-title">Species</th>
            <td>{{ pokemon.species.genera.find((e) => e.language.name === 'en')?.genus }}</td>
          </tr>
          <tr>
            <th class="small-title">Height</th>
            <td>{{ pokemon.height / 10 }} m</td>
          </tr>
          <tr>
            <th class="small-title">Weight</th>
            <td>{{ pokemon.weight / 10 }} kg</td>
          </tr>
          <tr>
            <th class="small-title">Abilities</th>
            <!-- TODO: make link to ability -->
            <td>
              <span v-for="a in pokemon.abilities" :key="a.name" class="mr-4 capitalize">
                {{ a.name }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <h3 class="medium-title">Base Stats</h3>
      <ul>
        <li v-for="s in pokemon.stats" :key="s.name" class="mb-2">
          <div>
            <span class="small-title capitalize">{{ s.name }}: </span>
            <span class="capitalize">{{ s.base }}</span>
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
    <div>
      <h3 class="medium-title">Evolution Chart</h3>
      <ul>
        <li v-for="s in pokemon.stats" :key="s.name" class="mb-2"></li>
      </ul>
    </div>
    <div>
      <h3 class="medium-title">
        Where to find <span class="capitalize">{{ pokemon.names['en'] }}</span>
      </h3>
      <ul>
        <li v-for="s in pokemon.stats" :key="s.name" class="mb-2"></li>
      </ul>
    </div>
    <div>
      <h3 class="medium-title">Entries</h3>

      <table id="pokedex-info-table">
        <tbody>
          <tr v-for="lang in languages" :key="lang.key">
            <th class="small-title">{{ lang.name }}</th>
            <td class="small-title">{{ pokemon.species.flavorTextEntries[lang.key] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAppSettingsStore } from '@/renderer/stores/appSettingsStore';
import { getPokemonCardStyles } from '@/renderer/helpers/stylesHelper';
import { getPokemonStatColor, getPokemonTypeColor } from '@/renderer/helpers/stylesHelper';

const appSettingsStore = useAppSettingsStore();

const settingCardImageStyle = appSettingsStore.pokemonDetails.cardImageStyle;
const settingCardBackgroundStyle = appSettingsStore.pokemonDetails.cardBackgroundStyle;
//const settingDetailsPageStyle = appSettingsStore.pokemonDetails.pageStyle;

const props = defineProps({ pokemon: Object });
const pokemon = props.pokemon;

const styles = computed(() =>
  getPokemonCardStyles({
    imageStyle: settingCardImageStyle,
    backgroundStyle: settingCardBackgroundStyle,
    backgroundKey: pokemon.types[0],
  })
);

const languages = [
  { name: 'English', key: 'en' },
  { name: 'Spanish', key: 'es' },
  { name: 'German', key: 'de' },
  { name: 'French', key: 'fr' },
  { name: 'Italian', key: 'it' },
  { name: 'Japanese', key: 'ja' },
  { name: 'Japanese (Hrkt)', key: 'ja-Hrkt' },
  { name: 'Korean', key: 'ko' },
  { name: 'Chinese (Hans)', key: 'zh-Hans' },
  { name: 'Chinese (Hant)', key: 'zh-Hant' }
];
</script>

<style scoped lang="scss" src="./PokemonDetails.scss" />
