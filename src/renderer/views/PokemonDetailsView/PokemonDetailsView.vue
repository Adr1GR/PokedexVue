<template>
  <div>
    <div v-if="store.loading && !pokemon">Cargando…</div>
    <div v-else-if="store.error && !pokemon">
      Error: {{ String(store.error) }}
    </div>
    <PokemonDetails v-else :pokemon="pokemon" />
  </div>
</template>

<script setup>
import { computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { usePokemonStore } from "@/renderer/stores/pokemonStore";
import PokemonDetails from "@/renderer/components/PokemonDetails/PokemonDetails.vue";

const route = useRoute();
const store = usePokemonStore();

const id = computed(() => Number(route.params.id));
const pokemon = computed(() => store.cache[id.value]?.data ?? null);

watchEffect(async () => {
  if (!Number.isFinite(id.value)) return;
  if (!pokemon.value) {
    await store.loadPokemonById(id.value);
  }
});
</script>

<style></style>
