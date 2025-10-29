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
 * Calculates three color tones from an image.
 * Only accepts imageSrc and sampleSize.
 * Always computes the medianLight color, then derives darker variants.
 * Returns an object: { medianLight, medianAverage, medianDark } in 'rgb(r,g,b)' format.
 *
 * @param {string} imageSrc - Image URL
 * @param {number} sampleSize - Size to which the image will be downscaled for faster processing
 * @returns {Promise<{medianLight:string, medianAverage:string, medianDark:string}>}
 */
export async function getDominantColors(imageSrc, sampleSize = 10) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    const getLum = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    const lighten = (color, blend) => ({
      r: Math.round(color.r + (255 - color.r) * blend),
      g: Math.round(color.g + (255 - color.g) * blend),
      b: Math.round(color.b + (255 - color.b) * blend),
    });

    const darken = (color, amount) => ({
      r: Math.max(0, Math.round(color.r * (1 - amount))),
      g: Math.max(0, Math.round(color.g * (1 - amount))),
      b: Math.max(0, Math.round(color.b * (1 - amount))),
    });

    const toRgbString = (c) => `rgb(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)})`;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const width = sampleSize;
        const height = sampleSize;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const data = ctx.getImageData(0, 0, width, height).data;
        const pixels = [];

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i],
            g = data[i + 1],
            b = data[i + 2];
          pixels.push([r, g, b]);
        }

        if (!pixels.length) {
          return resolve({
            plainDefaultColor: COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
            medianLight: COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
            medianAverage: COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
            medianDark: COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
          });
        }

        // --- Compute medianLight (the only heavy computation) ---
        let medianLightColor;
        const lightPixels = pixels.filter(([r, g, b]) => {
          const lum = getLum(r, g, b);
          return lum > 0.35 && lum < 0.95;
        });

        if (lightPixels.length) {
          const sum = lightPixels.reduce(
            (acc, [r, g, b]) => {
              acc.r += r;
              acc.g += g;
              acc.b += b;
              return acc;
            },
            { r: 0, g: 0, b: 0 }
          );
          medianLightColor = {
            r: sum.r / lightPixels.length,
            g: sum.g / lightPixels.length,
            b: sum.b / lightPixels.length,
          };
        } else {
          // Fallback: use average of all pixels
          const sumAll = pixels.reduce(
            (acc, [r, g, b]) => {
              acc.r += r;
              acc.g += g;
              acc.b += b;
              return acc;
            },
            { r: 0, g: 0, b: 0 }
          );
          medianLightColor = {
            r: sumAll.r / pixels.length,
            g: sumAll.g / pixels.length,
            b: sumAll.b / pixels.length,
          };
        }

        // Ensure the medianLight color is bright enough
        const lum = getLum(medianLightColor.r, medianLightColor.g, medianLightColor.b);
        const minAcceptLum = 0.4;
        if (lum < minAcceptLum) {
          const blend = Math.min(0.6, ((minAcceptLum - lum) / minAcceptLum) * 0.6);
          medianLightColor = lighten(medianLightColor, blend);
        }

        // --- Derive medianAverage and medianDark from medianLight ---
        // Adjustments: medianAverage slightly darker, medianDark much darker
        const MEDIAN_AVERAGE_DARKEN = 0.18; // 18% darker
        const MEDIAN_DARK_DARKEN = 0.36; // 36% darker

        const medianAverageColor = darken(medianLightColor, MEDIAN_AVERAGE_DARKEN);
        const medianDarkColor = darken(medianLightColor, MEDIAN_DARK_DARKEN);

        resolve({
          plainDefaultColor: COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
          medianLight: toRgbString(medianLightColor),
          medianAverage: toRgbString(medianAverageColor),
          medianDark: toRgbString(medianDarkColor),
        });
      } catch (e) {
        console.error('getDominantColors error:', e);
        resolve({
          plainDefaultColor: COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
          medianLight: COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
          medianAverage: COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
          medianDark: COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
        });
      }
    };
    img.onerror = () =>
      resolve({
        plainDefaultColor: COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
        medianLight: COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
        medianAverage: COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
        medianDark: COLOR_DEFAULT_POKEMON_BACKGROUND_FALLBACK,
      });
  });
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
