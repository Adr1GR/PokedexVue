export function getPokemonStatColor(name) {
  const colors = {
    hp: "#EF4444",
    attack: "#F97316",
    defense: "#EAB308",
    "special-attack": "#3B82F6",
    "special-defense": "#22C55E",
    speed: "#EC4899",
  };
  return colors[name] ?? "#9CA3AF";
}

export function getPokemonTypeColor(name) {
  const colors = {
    normal: "#9CA3AF",
    fire: "#EF4444",
    water: "#3B82F6",
    electric: "#FACC15",
    grass: "#22C55E",
    ice: "#22D3EE",
    fighting: "#C2410C",
    poison: "#A855F7",
    ground: "#D97706",
    flying: "#38BDF8",
    psychic: "#F472B6",
    bug: "#84CC16",
    rock: "#78716C",
    ghost: "#4338CA",
    dragon: "#4F46E5",
    dark: "#262626",
    steel: "#6B7280",
    fairy: "#F9A8D4",
  };
  return colors[name] ?? "#D1D5DB";
}

/**
 * AI Generated
 *
 * Calculates the dominant color of an image using native canvas.
 * Works only in the browser.
 *
 * @param {string} imageSrc - The URL of the image
 * @param {"light"|"dark"|"average"} tone - Choose which tone to return:
 *        "light"  -> returns the lightest pixel color
 *        "dark"   -> returns the darkest pixel color
 *        "average"-> returns the average color (default)
 * @param {number} sampleSize - The size to which the image will be downscaled for faster calculation
 * @returns {Promise<string>} - The dominant color in 'rgb(r,g,b)' format
 */
export function getDominantColor(imageSrc, tone = "average", sampleSize = 10) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    const getLum = (r, g, b) =>
      (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    const lighten = (color, blend) => ({
      r: Math.round(color.r + (255 - color.r) * blend),
      g: Math.round(color.g + (255 - color.g) * blend),
      b: Math.round(color.b + (255 - color.b) * blend),
    });

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const width = sampleSize;
        const height = sampleSize;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const data = ctx.getImageData(0, 0, width, height).data;
        const pixels = [];

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          pixels.push([r, g, b]);
        }

        if (!pixels.length) return resolve("rgb(245,245,245)");

        let color;
        switch (tone) {
          case "light": {
            const lightPixels = pixels.filter(([r, g, b]) => {
              const lum = getLum(r, g, b);
              return lum > 0.35 && lum < 0.95;
            });
            if (lightPixels.length) {
              const sum = lightPixels.reduce(
                (acc, [r, g, b]) => { acc.r += r; acc.g += g; acc.b += b; return acc; },
                { r: 0, g: 0, b: 0 }
              );
              color = { r: sum.r / lightPixels.length, g: sum.g / lightPixels.length, b: sum.b / lightPixels.length };
            } else {
              const sumAll = pixels.reduce(
                (acc, [r, g, b]) => { acc.r += r; acc.g += g; acc.b += b; return acc; },
                { r: 0, g: 0, b: 0 }
              );
              color = { r: sumAll.r / pixels.length, g: sumAll.g / pixels.length, b: sumAll.b / pixels.length };
            }

            const lum = getLum(color.r, color.g, color.b);
            const minAcceptLum = 0.40; // umbral
            if (lum < minAcceptLum) {
              const blend = Math.min(0.6, (minAcceptLum - lum) / minAcceptLum * 0.6);
              color = lighten(color, blend);
            }
            break;
          }

          case "dark": {
            const darkPixels = pixels.filter(([r, g, b]) => {
              const lum = getLum(r, g, b);
              return lum >= 0.00 && lum < 0.45;
            });
            if (darkPixels.length) {
              const sum = darkPixels.reduce(
                (acc, [r, g, b]) => { acc.r += r; acc.g += g; acc.b += b; return acc; },
                { r: 0, g: 0, b: 0 }
              );
              color = { r: sum.r / darkPixels.length, g: sum.g / darkPixels.length, b: sum.b / darkPixels.length };
            } else {
              color = { r: 50, g: 50, b: 50 };
            }
            break;
          }

          case "average":
          default: {
            const sum = pixels.reduce(
              (acc, [r, g, b]) => { acc.r += r; acc.g += g; acc.b += b; return acc; },
              { r: 0, g: 0, b: 0 }
            );
            color = { r: sum.r / pixels.length, g: sum.g / pixels.length, b: sum.b / pixels.length };
            break;
          }
        }

        resolve(`rgb(${Math.round(color.r)},${Math.round(color.g)},${Math.round(color.b)})`);
      } catch (e) {
        console.error("getDominantColor error:", e);
        resolve("rgb(245,245,245)");
      }
    };

    img.onerror = () => resolve("rgb(245,245,245)");
  });
}


/**
 * AI Generated
 *
 * Returns true if the color requires light text for readability
 * @param {[number, number, number]} rgb - Array with red, green, blue values
 */
export function shouldUseLightText([r, g, b]) {
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum < 0.6;
}
