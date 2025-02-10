import { LOG } from './logger.js';
const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;

const GAMMA = 2.4;

function luminance(r, g, b) {
  try {
    var a = [r, g, b].map((v) => {
      if (typeof v !== 'number') {
        LOG.error(`Invalid color value: ${v}`);
        throw new Error('Color values must be numbers');
      }
      v /= 255;
      return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, GAMMA);
    });
    return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
  } catch (error) {
    LOG.fatal(`Error calculating luminance: ${error.message}`);
    throw error;
  }
}

export function contrast(rgb1, rgb2) {
  try {
    var lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
    var lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
    var brightest = Math.max(lum1, lum2);
    var darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  } catch (error) {
    LOG.error(`Error calculating contrast: ${error.message}`);
    throw error;
  }
}