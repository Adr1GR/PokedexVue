<template>
  <div>
    <LoadingPokeball v-if="pokemonStore.loading && !pokemon" />
    <PokemonDetails v-else-if="pokemon" :pokemon="pokemon" />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePokemonStore } from "@/renderer/stores/pokemonStore";
import { showErrorPopup } from "@/renderer/helpers/errorHelper";
import PokemonDetails from "@/renderer/components/PokemonDetails/PokemonDetails.vue";
import LoadingPokeball from "@/renderer/components/LoadingPokeball/LoadingPokeball.vue"

const route = useRoute();
const router = useRouter();
const pokemonStore = usePokemonStore();

const id = computed(() => Number(route.params.id));
const pokemon = computed(
  () => pokemonStore.pokemonDetails[id.value]?.data ?? null
);

onMounted(async () => {
  try {
    let p = await pokemonStore.loadPokemonByIdFromStorage(id.value);
    if (!p) {
      p = await pokemonStore.fetchPokemonById(id.value);
      if (!p) {
        router.replace("/list");
      }
    }
  } catch (e) {
    showErrorPopup(e);
    router.replace("/list");
  }
});
</script>

<style></style>
