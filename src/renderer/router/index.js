import { createRouter, createWebHashHistory } from "vue-router";

import PokemonListView from "@/renderer/views/PokemonListView/PokemonListView.vue";
import PokemonDetailsView from "@/renderer/views/PokemonDetailsView/PokemonDetailsView.vue";

const routes = [
  {
    path: "/",
    component: PokemonListView,
    name: "home",
  },
  {
    path: "/list",
    component: PokemonListView,
    name: "pokemon-list",
  },
  {
    path: "/pokemon/:id(\\d+)",
    component: PokemonDetailsView,
    name: "pokemon-details",
    props: (route) => ({ pokemonId: Number(route.params.id) }),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
