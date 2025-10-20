import { defineStore } from 'pinia'
export const usePokemonStore = defineStore('pokemon', {
  state: () => ({ list: [] }),
  actions: {
    async preload() {
      const ids = Array.from({ length: 12 }, (_, i) => i + 1)
      const data = await Promise.all(ids.map(id =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json())
      ))
      this.list = data
    }
  }
})
