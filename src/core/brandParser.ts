// ============================================
// BRAND PARSER - Extract colors and parse brand documents
// ============================================

import { BrandKit, DEFAULT_BRAND_KIT } from '@/types';

// Regex patterns for color extraction
const HEX_PATTERN = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;
const RGB_PATTERN = /rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/gi;
const HSL_PATTERN = /hsl\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)/gi;

// Extract hex colors from text
export function extractHexColors(text: string): string[] {
  const matches = text.match(HEX_PATTERN);
  if (!matches) return [];
  
  // Normalize to 6-digit hex
  const normalized = matches.map(color => {
    if (color.length === 4) {
      const r = color[1];
      const g = color[2];
      const b = color[3];
      return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
    }
    return color.toUpperCase();
  });
  
  // Remove duplicates
  return [...new Set(normalized)];
}

// Extract RGB colors and convert to hex
export function extractRgbColors(text: string): string[] {
  const colors: string[] = [];
  let match;
  
  while ((match = RGB_PATTERN.exec(text)) !== null) {
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    
    if (r <= 255 && g <= 255 && b <= 255) {
      colors.push(rgbToHex(r, g, b));
    }
  }
  
  return [...new Set(colors)];
}

// RGB to Hex conversion
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

// Hex to RGB conversion
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Check WCAG contrast level
export function getContrastLevel(ratio: number): 'AAA' | 'AA' | 'fail' {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'fail';
}

// Determine if a color is light or dark
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  return luminance > 0.5;
}

// Get suggested text color for a background
export function getSuggestedTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#1e293b' : '#ffffff';
}

// Parse text content and extract all colors
export function extractAllColors(text: string): string[] {
  const hexColors = extractHexColors(text);
  const rgbColors = extractRgbColors(text);
  return [...new Set([...hexColors, ...rgbColors])];
}

// Categorize colors by brightness
export function categorizeColors(colors: string[]): {
  light: string[];
  dark: string[];
  neutral: string[];
} {
  const light: string[] = [];
  const dark: string[] = [];
  const neutral: string[] = [];
  
  colors.forEach(color => {
    const rgb = hexToRgb(color);
    if (!rgb) return;
    
    const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
    
    if (luminance > 0.7) {
      light.push(color);
    } else if (luminance < 0.3) {
      dark.push(color);
    } else {
      neutral.push(color);
    }
  });
  
  return { light, dark, neutral };
}

// Convert file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// Read text file
export function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Create a new brand kit with defaults
export function createBrandKit(name: string, overrides?: Partial<BrandKit>): BrandKit {
  const now = new Date().toISOString();
  return {
    ...DEFAULT_BRAND_KIT,
    id: generateId(),
    name,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

// Safe font stacks for email
export const SAFE_FONT_STACKS: Record<string, string> = {
  'System': "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  'Inter': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  'Poppins': "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  'Roboto': "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
  'Arial': "Arial, 'Helvetica Neue', Helvetica, sans-serif",
  'Georgia': "Georgia, 'Times New Roman', Times, serif",
  'Verdana': "Verdana, Geneva, sans-serif",
  'Tahoma': "Tahoma, Geneva, sans-serif",
  'Trebuchet': "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', sans-serif",
  'Courier': "'Courier New', Courier, monospace",
};

// Default color suggestions
export const DEFAULT_COLOR_ROLES: Array<{
  role: keyof BrandKit['colors'];
  label: string;
  description: string;
}> = [
  { role: 'primary', label: 'Primario', description: 'Color principal de marca' },
  { role: 'secondary', label: 'Secundario', description: 'Color de apoyo' },
  { role: 'accent', label: 'Acento', description: 'Highlights y CTAs' },
  { role: 'background', label: 'Fondo', description: 'Color de fondo del email' },
  { role: 'surface', label: 'Superficie', description: 'Tarjetas y contenedores' },
  { role: 'text', label: 'Texto', description: 'Color principal de texto' },
  { role: 'mutedText', label: 'Texto Muted', description: 'Texto secundario' },
  { role: 'border', label: 'Borde', description: 'Bordes y divisores' },
];
