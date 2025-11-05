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

export function getPokemonTypeColor(nameOrId) {
  if (nameOrId === 'normal' || nameOrId === 1) {
    return COLOR_DEFAULT_POKEMON_TYPE_NORMAL;
  }
  if (nameOrId === 'fighting' || nameOrId === 2) {
    return COLOR_DEFAULT_POKEMON_TYPE_FIGHTING;
  }
  if (nameOrId === 'flying' || nameOrId === 3) {
    return COLOR_DEFAULT_POKEMON_TYPE_FLYING;
  }
  if (nameOrId === 'poison' || nameOrId === 4) {
    return COLOR_DEFAULT_POKEMON_TYPE_POISON;
  }
  if (nameOrId === 'ground' || nameOrId === 5) {
    return COLOR_DEFAULT_POKEMON_TYPE_GROUND;
  }
  if (nameOrId === 'rock' || nameOrId === 6) {
    return COLOR_DEFAULT_POKEMON_TYPE_ROCK;
  }
  if (nameOrId === 'bug' || nameOrId === 7) {
    return COLOR_DEFAULT_POKEMON_TYPE_BUG;
  }
  if (nameOrId === 'ghost' || nameOrId === 8) {
    return COLOR_DEFAULT_POKEMON_TYPE_GHOST;
  }
  if (nameOrId === 'steel' || nameOrId === 9) {
    return COLOR_DEFAULT_POKEMON_TYPE_STEEL;
  }
  if (nameOrId === 'fire' || nameOrId === 10) {
    return COLOR_DEFAULT_POKEMON_TYPE_FIRE;
  }
  if (nameOrId === 'water' || nameOrId === 11) {
    return COLOR_DEFAULT_POKEMON_TYPE_WATER;
  }
  if (nameOrId === 'grass' || nameOrId === 12) {
    return COLOR_DEFAULT_POKEMON_TYPE_GRASS;
  }
  if (nameOrId === 'electric' || nameOrId === 13) {
    return COLOR_DEFAULT_POKEMON_TYPE_ELECTRIC;
  }
  if (nameOrId === 'psychic' || nameOrId === 14) {
    return COLOR_DEFAULT_POKEMON_TYPE_PSYCHIC;
  }
  if (nameOrId === 'ice' || nameOrId === 15) {
    return COLOR_DEFAULT_POKEMON_TYPE_ICE;
  }
  if (nameOrId === 'dragon' || nameOrId === 16) {
    return COLOR_DEFAULT_POKEMON_TYPE_DRAGON;
  }
  if (nameOrId === 'dark' || nameOrId === 17) {
    return COLOR_DEFAULT_POKEMON_TYPE_DARK;
  }
  if (nameOrId === 'fairy' || nameOrId === 18) {
    return COLOR_DEFAULT_POKEMON_TYPE_FAIRY;
  }

  return '#D1D5DB';
}

export function getColorByPokemonColorId(pokemonColorId) {
  const colors = {
    0: COLOR_DEFAULT_POKEMON_COLOR_ID_RED,
    1: COLOR_DEFAULT_POKEMON_COLOR_ID_BLUE,
    2: COLOR_DEFAULT_POKEMON_COLOR_ID_YELLOW,
    3: COLOR_DEFAULT_POKEMON_COLOR_ID_GREEN,
    4: COLOR_DEFAULT_POKEMON_COLOR_ID_BLACK,
    5: COLOR_DEFAULT_POKEMON_COLOR_ID_BROWN,
    6: COLOR_DEFAULT_POKEMON_COLOR_ID_PURPLE,
    7: COLOR_DEFAULT_POKEMON_COLOR_ID_GRAY,
    8: COLOR_DEFAULT_POKEMON_COLOR_ID_WHITE,
    9: COLOR_DEFAULT_POKEMON_COLOR_ID_PINK,
  };
  return colors[pokemonColorId] ?? '#D1D5DB';
}

/**
 * Returns full CSS styles for a Pokémon card or details view
 * @param {Object} params
 * @param {string} params.imageStyle - image style (sprite, artwork, etc.)
 * @param {string} params.backgroundStyle - background style (plain, diagonal, etc.)
 * @param {string} params.backgroundKey - background color key
 * @returns {Object} { container, image, idColor, nameTextColor }
 */
export function getPokemonCardStyles({ imageStyle, backgroundStyle, backgroundKey, secondaryBackgroundKey = null }) {
  const bgColor = getPokemonTypeColor(backgroundKey);
  const isDiagonal = ['diagonal'].includes(backgroundStyle);
  const isPixelated = ['sprite', 'spriteBack', 'spriteShiny', 'spriteShinyBack', 'showdown'].includes(imageStyle);
  const primaryPokemonTypeColor = getPokemonTypeColor(backgroundKey);
  const secondaryPokemonTypeColor = secondaryBackgroundKey ? getPokemonTypeColor(backgroundKey) : null;
  return {
    container: {
      background: isDiagonal ? `linear-gradient(135deg, rgb(245,245,245) 50%, ${bgColor} 50%)` : bgColor,
      boxShadow: `0 0 3px 0.5px ${bgColor}`,
    },
    image: {
      imageRendering: isPixelated ? 'pixelated' : 'auto',
    },
    idColor: bgColor,
    typesColors: {
      primary: primaryPokemonTypeColor,
      secondary: secondaryPokemonTypeColor
    }
  };
}
