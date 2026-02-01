// ============================================
// EMAIL HTML GENERATOR - TYPE DEFINITIONS
// ============================================

// Design Tokens for email generation
export interface DesignTokens {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  radius: string;
  spacingScale: number;
  fontStack: string;
}

// Brand Kit - stored in localStorage
export interface BrandKit {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  
  // Logos
  logos: {
    primary?: string; // base64 or URL
    dark?: string;
    icon?: string;
  };
  
  // Colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    mutedText: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
  
  // Typography suggestion
  typography: {
    heading: string;
    body: string;
    fontStack: string;
  };
  
  // Extracted from brand manual
  brandNotes?: string;
  extractedColors?: string[];
}

// Email Block Types
export type EmailBlockType = 
  | 'header'
  | 'hero'
  | 'text'
  | 'image'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'columns'
  | 'card'
  | 'footer'
  | 'social';

// Base block
export interface EmailBlockBase {
  id: string;
  type: EmailBlockType;
}

// Header block
export interface HeaderBlock extends EmailBlockBase {
  type: 'header';
  logoUrl?: string;
  tagline?: string;
  alignment: 'left' | 'center' | 'right';
  backgroundColor?: string;
  padding?: number;
}

// Hero block
export interface HeroBlock extends EmailBlockBase {
  type: 'hero';
  title: string;
  subtitle?: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  alignment: 'left' | 'center' | 'right';
}

// Text block
export interface TextBlock extends EmailBlockBase {
  type: 'text';
  content: string; // HTML content
  alignment: 'left' | 'center' | 'right';
}

// Image block
export interface ImageBlock extends EmailBlockBase {
  type: 'image';
  src: string;
  alt: string;
  width?: number;
  alignment: 'left' | 'center' | 'right';
  link?: string;
}

// Button block
export interface ButtonBlock extends EmailBlockBase {
  type: 'button';
  text: string;
  url: string;
  backgroundColor?: string;
  textColor?: string;
  alignment: 'left' | 'center' | 'right';
  fullWidth?: boolean;
  borderRadius?: number;
}

// Divider block
export interface DividerBlock extends EmailBlockBase {
  type: 'divider';
  color?: string;
  thickness?: number;
  style: 'solid' | 'dashed' | 'dotted';
}

// Spacer block
export interface SpacerBlock extends EmailBlockBase {
  type: 'spacer';
  height: number;
}

// Columns block
export interface ColumnsBlock extends EmailBlockBase {
  type: 'columns';
  columns: {
    width: string; // percentage
    blocks: EmailBlock[];
  }[];
  gap?: number;
}

// Card block
export interface CardBlock extends EmailBlockBase {
  type: 'card';
  title?: string;
  content: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  backgroundColor?: string;
  borderColor?: string;
}

// Footer block
export interface FooterBlock extends EmailBlockBase {
  type: 'footer';
  content: string;
  includeUnsubscribe?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

// Social block
export interface SocialBlock extends EmailBlockBase {
  type: 'social';
  networks: {
    type: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube';
    url: string;
  }[];
  alignment: 'left' | 'center' | 'right';
  iconStyle: 'color' | 'mono' | 'outline';
}

// Union type for all blocks
export type EmailBlock = 
  | HeaderBlock
  | HeroBlock
  | TextBlock
  | ImageBlock
  | ButtonBlock
  | DividerBlock
  | SpacerBlock
  | ColumnsBlock
  | CardBlock
  | FooterBlock
  | SocialBlock;

// Email Document
export interface EmailDoc {
  id: string;
  name: string;
  subject?: string;
  preheader?: string;
  blocks: EmailBlock[];
  brandKitId?: string;
  theme: 'light' | 'dark';
  /** Ancho del contenido del email en px (p. ej. 600 para Gmail). Por defecto 600. */
  contentWidth?: number;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

// Template Definition
export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: 'newsletter' | 'announcement' | 'event' | 'promotional';
  preview: string; // thumbnail URL or base64
  blocks: EmailBlock[];
  defaultSubject?: string;
  defaultPreheader?: string;
}

// Compatibility Check Result
export interface CompatibilityCheck {
  id: string;
  name: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  suggestion?: string;
}

// Contrast Check Result
export interface ContrastCheck {
  foreground: string;
  background: string;
  ratio: number;
  level: 'AAA' | 'AA' | 'fail';
  suggestion?: string;
}

// Export Options
export interface ExportOptions {
  includeComments: boolean;
  inlineStyles: boolean;
  minify: boolean;
  includeDoctype: boolean;
  imageHandling: 'placeholder' | 'base64' | 'original';
}

// App State
export interface AppState {
  currentBrandKitId?: string;
  currentEmailId?: string;
  previewMode: 'desktop' | 'mobile';
  darkModePreview: boolean;
  sidebarTab: 'brand' | 'content' | 'templates' | 'export';
}

// Default design tokens
export const DEFAULT_DESIGN_TOKENS: DesignTokens = {
  primary: '#2563eb',
  secondary: '#64748b',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#1e293b',
  mutedText: '#64748b',
  border: '#e2e8f0',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  radius: '4px',
  spacingScale: 8,
  fontStack: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
};

// Default Brand Kit
export const DEFAULT_BRAND_KIT: BrandKit = {
  id: 'default',
  name: 'Default Brand',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  logos: {},
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#0891b2',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    mutedText: '#64748b',
    border: '#e2e8f0',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  typography: {
    heading: 'Arial',
    body: 'Arial',
    fontStack: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
  },
};
