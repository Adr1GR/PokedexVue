import {
  COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
  COLOR_DEFAULT_POKEMON_ID_FALLBACK,
  COLOR_DEFAULT_POKEMON_STAT_HP,
  COLOR_DEFAULT_POKEMON_STAT_ATTACK,
  COLOR_DEFAULT_POKEMON_STAT_DEFENSE,
  COLOR_DEFAULT_POKEMON_STAT_SPECIAL_ATTACK,
  COLOR_DEFAULT_POKEMON_STAT_SPECIAL_DEFENSE,
  COLOR_DEFAULT_POKEMON_STAT_SPEED,
  COLOR_DEFAULT_POKEMON_TYPE_NORMAL,
  COLOR_DEFAULT_POKEMON_TYPE_FIRE,
  COLOR_DEFAULT_POKEMON_TYPE_WATER,
  COLOR_DEFAULT_POKEMON_TYPE_ELECTRIC,
  COLOR_DEFAULT_POKEMON_TYPE_GRASS,
  COLOR_DEFAULT_POKEMON_TYPE_ICE,
  COLOR_DEFAULT_POKEMON_TYPE_FIGHTING,
  COLOR_DEFAULT_POKEMON_TYPE_POISON,
  COLOR_DEFAULT_POKEMON_TYPE_GROUND,
  COLOR_DEFAULT_POKEMON_TYPE_FLYING,
  COLOR_DEFAULT_POKEMON_TYPE_PSYCHIC,
  COLOR_DEFAULT_POKEMON_TYPE_BUG,
  COLOR_DEFAULT_POKEMON_TYPE_ROCK,
  COLOR_DEFAULT_POKEMON_TYPE_GHOST,
  COLOR_DEFAULT_POKEMON_TYPE_DRAGON,
  COLOR_DEFAULT_POKEMON_TYPE_DARK,
  COLOR_DEFAULT_POKEMON_TYPE_STEEL,
  COLOR_DEFAULT_POKEMON_TYPE_FAIRY,
} from '@/constants/appConstants';

export function getPokemonStatColor(name) {
  const colors = {
    hp: COLOR_DEFAULT_POKEMON_STAT_HP,
    attack: COLOR_DEFAULT_POKEMON_STAT_ATTACK,
    defense: COLOR_DEFAULT_POKEMON_STAT_DEFENSE,
    'special-attack': COLOR_DEFAULT_POKEMON_STAT_SPECIAL_ATTACK,
    'special-defense': COLOR_DEFAULT_POKEMON_STAT_SPECIAL_DEFENSE,
    speed: COLOR_DEFAULT_POKEMON_STAT_SPEED,
  };
  return colors[name] ?? '#9CA3AF';
}

export function getPokemonTypeColor(name) {
  const colors = {
    normal: COLOR_DEFAULT_POKEMON_TYPE_NORMAL,
    fire: COLOR_DEFAULT_POKEMON_TYPE_FIRE,
    water: COLOR_DEFAULT_POKEMON_TYPE_WATER,
    electric: COLOR_DEFAULT_POKEMON_TYPE_ELECTRIC,
    grass: COLOR_DEFAULT_POKEMON_TYPE_GRASS,
    ice: COLOR_DEFAULT_POKEMON_TYPE_ICE,
    fighting: COLOR_DEFAULT_POKEMON_TYPE_FIGHTING,
    poison: COLOR_DEFAULT_POKEMON_TYPE_POISON,
    ground: COLOR_DEFAULT_POKEMON_TYPE_GROUND,
    flying: COLOR_DEFAULT_POKEMON_TYPE_FLYING,
    psychic: COLOR_DEFAULT_POKEMON_TYPE_PSYCHIC,
    bug: COLOR_DEFAULT_POKEMON_TYPE_BUG,
    rock: COLOR_DEFAULT_POKEMON_TYPE_ROCK,
    ghost: COLOR_DEFAULT_POKEMON_TYPE_GHOST,
    dragon: COLOR_DEFAULT_POKEMON_TYPE_DRAGON,
    dark: COLOR_DEFAULT_POKEMON_TYPE_DARK,
    steel: COLOR_DEFAULT_POKEMON_TYPE_STEEL,
    fairy: COLOR_DEFAULT_POKEMON_TYPE_FAIRY,
  };
  return colors[name] ?? '#D1D5DB';
}

/**
 * AI Generated
 *
 * Extracts only the medianLight color from an image.
 * Uses aggressive downsampling and stride sampling for speed.
 *
 * @param {string} imageSrc - Image URL
 * @param {number} sampleSize - Downscale target size
 * @param {number} stride - Pixel sampling stride
 * @returns {Promise<string>} - medianLight color in 'rgb(r,g,b)' format
 */
export async function getMedianLight(imageSrc, sampleSize = 6, stride = 2) {
  const getLum = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const lighten = (c, blend) => ({
    r: c.r + (255 - c.r) * blend,
    g: c.g + (255 - c.g) * blend,
    b: c.b + (255 - c.b) * blend,
  });
  const toRgb = (c) => `rgb(${c.r | 0},${c.g | 0},${c.b | 0})`;

  const fallback = COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK;

  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.crossOrigin = 'anonymous';
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = imageSrc;
    });

    const size = Math.max(2, Math.floor(sampleSize));
    const cvs = document.createElement('canvas');
    cvs.width = size;
    cvs.height = size;
    const ctx = cvs.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, size, size);

    const { data } = ctx.getImageData(0, 0, size, size);
    const s = Math.max(1, stride);

    let sumR = 0,
      sumG = 0,
      sumB = 0,
      count = 0;

    const LIGHT_MIN = 0.28,
      LIGHT_MAX = 0.95;

    for (let y = 0; y < size; y += s) {
      for (let x = 0; x < size; x += s) {
        const idx = (y * size + x) * 4;
        const r = data[idx],
          g = data[idx + 1],
          b = data[idx + 2],
          a = data[idx + 3];
        if (a === 0) continue;
        const lum = getLum(r, g, b);
        if (lum > LIGHT_MIN && lum < LIGHT_MAX) {
          sumR += r;
          sumG += g;
          sumB += b;
          count++;
        }
      }
    }

    if (count === 0) return fallback;

    let base = { r: sumR / count, g: sumG / count, b: sumB / count };
    const lumBase = getLum(base.r, base.g, base.b);
    const MIN_LUM = 0.4;
    if (lumBase < MIN_LUM) {
      const blend = Math.min(0.6, ((MIN_LUM - lumBase) / MIN_LUM) * 0.6);
      base = lighten(base, blend);
    }

    return toRgb(base);
  } catch {
    return fallback;
  }
}

/**
 * AI Generated
 *
 * Derives medianAverage and medianDark from a given medianLight color.
 *
 * @param {string} medianLight - Color in 'rgb(r,g,b)' format
 * @returns {{medianAverage:string, medianDark:string}}
 */
export function deriveDarkVariants(medianLight) {
  const parseRgb = (rgb) => {
    const m = rgb.match(/rgb\((\d+),(\d+),(\d+)\)/);
    if (!m) return { r: 200, g: 200, b: 200 };
    return { r: +m[1], g: +m[2], b: +m[3] };
  };

  const darken = (c, amount) => ({
    r: c.r * (1 - amount),
    g: c.g * (1 - amount),
    b: c.b * (1 - amount),
  });

  const toRgb = (c) => `rgb(${c.r | 0},${c.g | 0},${c.b | 0})`;

  const base = parseRgb(medianLight);
  const medianAverage = darken(base, 0.18);
  const medianDark = darken(base, 0.36);

  return {
    medianAverage: toRgb(medianAverage),
    medianDark: toRgb(medianDark),
  };
}

/**
 * AI Generated
 *
 * Returns true if the color requires light text for readability
 * @param {[number, number, number]} rgb - Array with red, green, blue values
 */
export function shouldUseLightText(color) {
  let r, g, b;

  if (Array.isArray(color)) {
    [r, g, b] = color;
  } else if (typeof color === 'string' && color.startsWith('#')) {
    const hex = color.replace('#', '');
    const bigint = parseInt(hex, 16);
    r = (bigint >> 16) & 255;
    g = (bigint >> 8) & 255;
    b = bigint & 255;
  } else if (typeof color === 'string' && color.startsWith('rgb')) {
    [r, g, b] = color.match(/\d+/g).map(Number);
  } else {
    return false; // fallback
  }

  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum < 0.6;
}

/**
 * Returns full CSS styles for a Pokémon card or details view
 * @param {Object} params
 * @param {Object} params.pokemon - Pokémon object
 * @param {string} params.imageStyle - image style (sprite, artwork, etc.)
 * @param {string} params.backgroundStyle - background style (plain, diagonal, etc.)
 * @param {string} params.backgroundColor - background color key
 * @returns {Object} { container, image, idColor, nameTextColor }
 */
export function getPokemonCardStyles({ pokemon, imageStyle, backgroundStyle, backgroundColor }) {
  const bgColor = pokemon.backgroundColors?.[backgroundColor] ?? COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK;
  const isDiagonal = ['diagonal'].includes(backgroundStyle);
  const isPlainDefault = ['plainDefaultColor'].includes(backgroundColor);
  const isPixelated = ['sprite', 'spriteBack', 'spriteShiny', 'spriteShinyBack', 'showdown'].includes(imageStyle);

  return {
    container: {
      background: isDiagonal ? `linear-gradient(135deg, rgb(245,245,245) 50%, ${bgColor} 50%)` : bgColor,
      boxShadow: isPlainDefault ? '0 0 12px 1.5px black' : `0 0 12px 1.5px ${bgColor}`,
      borderColor: isPlainDefault ? 'black' : bgColor,
    },
    image: {
      imageRendering: isPixelated ? 'pixelated' : 'auto',
    },
    idColor: isPlainDefault ? COLOR_DEFAULT_POKEMON_ID_FALLBACK : bgColor,
    nameTextColor: shouldUseLightText(bgColor) ? 'white' : 'black',
  };
}
