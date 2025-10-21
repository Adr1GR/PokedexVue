import { createRouter, createWebHashHistory } from 'vue-router'

import PokemonListView from '@/renderer/views/PokemonListView/PokemonListView.vue'

const routes = [
  { 
    path: '/', 
    component: PokemonListView,
    name: 'home',
  },
  { 
    path: '/list',
    component: PokemonListView,
    name: 'pokemon-list',
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
