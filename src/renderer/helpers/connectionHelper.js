import { showErrorPopup } from "@/renderer/helpers/errorHelper";

const API_PING_PATH = import.meta.env.VITE_POKEAPI_BASE_URL + "pokemon?limit=1";

/**
 * @param {string} url
 * @param {number} timeout
 * @returns {Promise<boolean>}
 */
export async function isUrlReachable(url = API_PING_PATH, timeout = 2500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(id);

    if (!res.ok) {
      showErrorPopup(
        `Fetch failed with status ${res.status}`
      );
      return false;
    }
    return true;
  } catch (e){
    clearTimeout(id);
    showErrorPopup(e);
    return false;
  }
}
