<template>
  <div>
    <div v-if="pokemonStore.loading && !pokemon">Loading...</div>
    <PokemonDetails v-else-if="pokemon" :pokemon="pokemon"/>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePokemonStore } from "@/renderer/stores/pokemonStore";
import { showErrorPopup } from "@/renderer/helpers/errorHelper";
import PokemonDetails from "@/renderer/components/PokemonDetails/PokemonDetails.vue";

const route = useRoute();
const router = useRouter();
const pokemonStore = usePokemonStore();

const id = computed(() => Number(route.params.id));
const pokemon = computed(() => pokemonStore.cache[id.value]?.data ?? null);

pokemonStore.loadPokemonById(id.value);

watch(
  () => pokemonStore.error,
  (e) => {
    if (e) {
      showErrorPopup(e);
      pokemonStore.clearError();
      pokemonStore.resetStates();
      router.replace("/list");
    }
  },
  { immediate: true }
);
</script>

<style></style>
