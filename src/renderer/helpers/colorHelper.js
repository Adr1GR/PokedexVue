export function getPokemonStatColor(name) {
  const colors = {
    hp: '#EF4444', // red-500
    attack: '#F97316', // orange-500
    defense: '#EAB308', // yellow-500
    'special-attack': '#3B82F6', // blue-500
    'special-defense': '#22C55E', // green-500
    speed: '#EC4899', // pink-500
  };
  return colors[name] ?? '#9CA3AF'; // gray-400
}

export function getPokemonTypeColor(name) {
  const colors = {
    normal: '#9CA3AF', // gray-400
    fire: '#EF4444', // red-500
    water: '#3B82F6', // blue-500
    electric: '#FACC15', // yellow-400
    grass: '#22C55E', // green-500
    ice: '#22D3EE', // cyan-400
    fighting: '#C2410C', // orange-700
    poison: '#A855F7', // purple-500
    ground: '#D97706', // amber-600
    flying: '#38BDF8', // sky-400
    psychic: '#F472B6', // pink-400
    bug: '#84CC16', // lime-500
    rock: '#78716C', // stone-500
    ghost: '#4338CA', // indigo-700
    dragon: '#4F46E5', // indigo-600
    dark: '#262626', // neutral-800
    steel: '#6B7280', // gray-500
    fairy: '#F9A8D4', // pink-300
  };
  return colors[name] ?? '#D1D5DB'; // gray-300
}
