import { URL_POKEAPI_BASE, URL_CHECK_INTERNET_CONNECTION } from '@/constants/appConstants';
import { showErrorPopup } from '@/renderer/helpers/errorsHelper';

const API_BASE = import.meta.env.VITE_POKEAPI_BASE_URL ?? URL_POKEAPI_BASE;
const API_PING_PATH = API_BASE + 'pokemon?limit=1';

export async function hasInternetConnection(timeout = 2500) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(URL_CHECK_INTERNET_CONNECTION, {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(id);
    return true;
  } catch (e) {
    console.error(e);
    showErrorPopup(`Connection error ${e}`);
    return false;
  }
}

export async function canFetchPokemon(timeout = 3000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(API_PING_PATH, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(id);

    if (!res.ok) {
      showErrorPopup(`PokeAPI error ${res.status}`);
      return false;
    }

    const data = await res.json();
    return Array.isArray(data.results) && data.results.length > 0;
  } catch (e) {
    console.error(e);
    clearTimeout(id);
    showErrorPopup(e);
    return false;
  }
}
