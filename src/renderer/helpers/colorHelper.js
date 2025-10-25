export function getPokemonStatColor(name) {
  const colors = {
    hp: '#EF4444',
    attack: '#F97316',
    defense: '#EAB308',
    'special-attack': '#3B82F6',
    'special-defense': '#22C55E',
    speed: '#EC4899',
  };
  return colors[name] ?? '#9CA3AF';
}

export function getPokemonTypeColor(name) {
  const colors = {
    normal: '#9CA3AF',
    fire: '#EF4444',
    water: '#3B82F6',
    electric: '#FACC15',
    grass: '#22C55E',
    ice: '#22D3EE',
    fighting: '#C2410C',
    poison: '#A855F7',
    ground: '#D97706',
    flying: '#38BDF8',
    psychic: '#F472B6',
    bug: '#84CC16',
    rock: '#78716C',
    ghost: '#4338CA',
    dragon: '#4F46E5',
    dark: '#262626',
    steel: '#6B7280',
    fairy: '#F9A8D4',
  };
  return colors[name] ?? '#D1D5DB';
}

/**
 * 
 * @param {string} imageSrc - Image url
 * @param {"Vibrant"|"LightVibrant"|"DarkVibrant"|"Muted"|"LightMuted"|"DarkMuted"} tone
 */
export function getDominantColor(imageSrc, tone = "LightVibrant") {
  return new Promise(async (resolve) => {
    try {
      const mod = await import("node-vibrant/browser").catch(() => import("node-vibrant"));
      const Vibrant = mod?.default || mod?.Vibrant || mod;
      const palette = await Vibrant.from(imageSrc).getPalette();
      const rgb = palette?.[tone]?.rgb || palette?.Vibrant?.rgb || [245, 245, 245];
      resolve(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
    } catch (e) {
      console.error("Vibrant error:", e);
      resolve("rgb(245,245,245)");
    }
  });
}

export function shouldUseLightText([r, g, b]) {
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum < 0.6;
}
