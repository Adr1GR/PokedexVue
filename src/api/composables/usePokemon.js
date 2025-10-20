import { ref } from 'vue';
import { listPokemon, getPokemon } from '../api/pokeapi.js';

export function usePokemons() {
  const items = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchPage(page = 0, size = 20) {
    loading.value = true; error.value = null;
    try {
      const offset = page * size;
      const data = await listPokemon(offset, size);
      items.value = data.results;
    } catch (e) {
      error.value = e;
    } finally { loading.value = false; }
  }

  const fetchOne = (idOrName) => getPokemon(idOrName);

  return { items, loading, error, fetchPage, fetchOne };
}
