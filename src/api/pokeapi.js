import { get } from './http.js';

export const listPokemon = (offset = 0, limit = 20) =>
  get('/pokemon', { offset, limit });

export const getPokemon = (nameOrId) =>
  get(`/pokemon/${nameOrId}`);
