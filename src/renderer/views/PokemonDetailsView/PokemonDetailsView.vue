<template>
  <div>
    <LoadingPokeball v-if="pokemonStore.loading && !localPokemon" />
    <PokemonDetails v-else-if="localPokemon" :pokemon="localPokemon" />
  </div>
</template>

<script setup>
import { computed, onMounted, onUpdated, ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePokemonStore } from '@/renderer/stores/pokemonStore';
import { showErrorPopup } from '@/renderer/helpers/errorsHelper';
import PokemonDetails from '@/renderer/components/PokemonDetails/PokemonDetails.vue';
import LoadingPokeball from '@/renderer/components/LoadingPokeball/LoadingPokeball.vue';

const route = useRoute();
const router = useRouter();
const pokemonStore = usePokemonStore();

const id = computed(() => Number(route.params.id));
const localPokemon = ref(null);

const loadPokemon = async (pokemonId) => {
  try {
    const pokemonExists = await pokemonStore.pokemonByIdHasDetails(pokemonId);

    if (pokemonExists == false) {
      await pokemonStore.fetchAndSavePokemonDetails(pokemonId);
    }
    localPokemon.value = pokemonStore.pokemons[pokemonId];
  } catch (e) {
    showErrorPopup(e);
    router.replace('/list');
  }
};

onMounted(() => {
  loadPokemon(id.value);
});

watch(id, (newId) => {
  loadPokemon(newId);
});
</script>

<style></style>
