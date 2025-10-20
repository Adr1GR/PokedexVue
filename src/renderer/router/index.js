import { createRouter, createWebHashHistory } from 'vue-router'
import PokemonList from '../components/PokemonList/PokemonList.vue'
import PokemonDetails from '../components/PokemonDetails/PokemonDetails.vue'

const routes = [
  { path: '/', name: 'default', meta: { title: 'Pokémon List' }, component: PokemonList },
  { path: '/list', name: 'pokemon-list', meta: { title: 'Pokémon List' }, component: PokemonList },
  { path: '/pokemon/:id', name: 'pokemon-details', meta: { title: 'Pokémon' }, component: PokemonDetails },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// evitar navegación a la misma ruta+query
const originalPush = router.push.bind(router)
router.push = (location) => {
  const current = router.currentRoute.value
  const currentQueryUSP = new URLSearchParams(current.query)
  let newPath = ''
  let newQueryUSP = new URLSearchParams()

  if (typeof location === 'string') {
    const [path, q] = location.split('?')
    newPath = path
    if (q) newQueryUSP = new URLSearchParams(q)
  } else {
    newPath = location.path ?? current.path
    newQueryUSP = new URLSearchParams(location.query ?? {})
  }

  const pathsAreDiff = current.path !== newPath
  const queriesAreDiff = newQueryUSP.toString() !== currentQueryUSP.toString()
  if (pathsAreDiff || queriesAreDiff) return originalPush(location)
}

export default router
