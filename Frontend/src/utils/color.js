// src/utils/colorUtils.js

/**
 * Color mapping utility for converting color names to hex values
 * Supports various color names used in the product catalog
 */

export const COLOR_MAP = {
  // Basic colors
  'red': '#dc2626',
  'blue': '#2563eb',
  'yellow': '#eab308',
  'black': '#000000',
  'white': '#ffffff',
  'gray': '#6b7280',
  'grey': '#6b7280',
  'green': '#16a34a',
  'pink': '#ec4899',
  'purple': '#9333ea',
  'orange': '#ea580c',
  'brown': '#92400e',
  
  // Navy variations
  'navy': '#1e3a8a',
  'navy blue': '#1e3a8a',
  'dark blue': '#1e40af',
  'light blue': '#60a5fa',
  
  // Gray variations
  'charcoal': '#374151',
  'dark green': '#166534',
  'heather gray': '#9ca3af',
  
  // Specialized colors
  'burgundy': '#7c2d12',
  'dark wash': '#374151',
  'beige': '#f5f5dc',
  'olive': '#6b7280',
  'lavender': '#c084fc',
  'khaki': '#d4a574',
  
  // Pattern/Print fallbacks
  'tropical print': '#10b981',
  'navy palms': '#1e3a8a',
};

/**
 * Get hex color code from color name
 * @param {string} colorName - The color name to convert
 * @returns {string} - Hex color code
 */
export const getColorHex = (colorName) => {
  if (!colorName || typeof colorName !== 'string') {
    return '#6b7280'; // Default gray
  }
  
  const normalizedColor = colorName.toLowerCase().trim();
  return COLOR_MAP[normalizedColor] || '#6b7280';
};

/**
 * Check if a color is light (for determining text contrast)
 * @param {string} colorHex - Hex color code
 * @returns {boolean} - True if color is light
 */
export const isLightColor = (colorHex) => {
  // Remove # if present
  const hex = colorHex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.6;
};

/**
 * Get appropriate text color for a given background color
 * @param {string} backgroundColor - Hex color code
 * @returns {string} - Either 'text-white' or 'text-gray-800'
 */
export const getContrastTextColor = (backgroundColor) => {
  return isLightColor(backgroundColor) ? 'text-gray-800' : 'text-white';
};

/**
 * Get appropriate border color for color buttons
 * @param {string} colorHex - Hex color code
 * @param {boolean} isSelected - Whether the color is selected
 * @returns {string} - CSS border class
 */
export const getColorButtonBorder = (colorHex, isSelected = false) => {
  const isWhite = colorHex === '#ffffff';
  
  if (isSelected) {
    return "border-black shadow-lg ring-2 ring-black ring-offset-2";
  }
  
  if (isWhite) {
    return "border-gray-300 hover:border-gray-400";
  }
  
  return "border-gray-200 hover:border-gray-300";
};

/**
 * Validate if a color name exists in our color map
 * @param {string} colorName - Color name to validate
 * @returns {boolean} - True if color exists
 */
export const isValidColor = (colorName) => {
  if (!colorName || typeof colorName !== 'string') {
    return false;
  }
  
  const normalizedColor = colorName.toLowerCase().trim();
  return normalizedColor in COLOR_MAP;
};

/**
 * Get all available colors
 * @returns {Array} - Array of color names
 */
export const getAvailableColors = () => {
  return Object.keys(COLOR_MAP);
};