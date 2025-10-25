<template>
  <div>
    <LoadingPokeball v-if="pokemonStore.loading && !localPokemon" />
    <PokemonDetails v-else-if="localPokemon" :pokemon="localPokemon" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePokemonStore } from "@/renderer/stores/pokemonStore";
import { showErrorPopup } from "@/renderer/helpers/errorHelper";
import PokemonDetails from "@/renderer/components/PokemonDetails/PokemonDetails.vue";
import LoadingPokeball from "@/renderer/components/LoadingPokeball/LoadingPokeball.vue";

const route = useRoute();
const router = useRouter();
const pokemonStore = usePokemonStore();

const id = computed(() => Number(route.params.id));
const localPokemon = ref(null);

const loadPokemon = async (pokemonId) => {
  try {
    localPokemon.value =
      (await pokemonStore.loadPokemonByIdFromStorage(pokemonId)) ||
      (await pokemonStore.fetchPokemonById(pokemonId));

    if (!localPokemon.value) {
      router.replace("/list");
    }
  } catch (e) {
    showErrorPopup(e);
    router.replace("/list");
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
