// ============================================
// COMPATIBILITY CHECKER - Email best practices
// ============================================

import { EmailDoc, CompatibilityCheck, ContrastCheck, BrandKit } from '@/types';
import { getContrastRatio, getContrastLevel } from './brandParser';

// Check email compatibility
export function checkCompatibility(doc: EmailDoc, brandKit: BrandKit): CompatibilityCheck[] {
  const checks: CompatibilityCheck[] = [];
  
  // Check for preheader
  checks.push({
    id: 'preheader',
    name: 'Preheader',
    status: doc.preheader && doc.preheader.length > 0 ? 'pass' : 'warning',
    message: doc.preheader 
      ? `Preheader configurado (${doc.preheader.length} caracteres)`
      : 'Sin preheader definido',
    suggestion: !doc.preheader 
      ? 'Agrega un preheader de 40-100 caracteres para mejor preview en inbox'
      : undefined,
  });
  
  // Check for subject
  checks.push({
    id: 'subject',
    name: 'Asunto',
    status: doc.subject && doc.subject.length > 0 
      ? (doc.subject.length <= 60 ? 'pass' : 'warning')
      : 'warning',
    message: doc.subject 
      ? `Asunto: "${doc.subject}" (${doc.subject.length} caracteres)`
      : 'Sin asunto definido',
    suggestion: doc.subject && doc.subject.length > 60
      ? 'El asunto tiene más de 60 caracteres y puede truncarse en móvil'
      : undefined,
  });
  
  // Check for header/logo
  const hasHeader = doc.blocks.some(b => b.type === 'header');
  checks.push({
    id: 'header',
    name: 'Encabezado',
    status: hasHeader ? 'pass' : 'warning',
    message: hasHeader ? 'Email tiene encabezado' : 'Sin encabezado/logo',
    suggestion: !hasHeader ? 'Considera agregar un header con logo para reforzar la marca' : undefined,
  });
  
  // Check for CTA button
  const hasButton = doc.blocks.some(b => b.type === 'button');
  checks.push({
    id: 'cta',
    name: 'Call to Action',
    status: hasButton ? 'pass' : 'warning',
    message: hasButton ? 'CTA button presente' : 'Sin botón CTA',
    suggestion: !hasButton ? 'Un botón CTA claro mejora la tasa de conversión' : undefined,
  });
  
  // Check for images with alt text
  const imageBlocks = doc.blocks.filter(b => b.type === 'image');
  const imagesWithAlt = imageBlocks.filter(b => b.type === 'image' && b.alt && b.alt.length > 0);
  if (imageBlocks.length > 0) {
    checks.push({
      id: 'image-alt',
      name: 'Alt en imágenes',
      status: imagesWithAlt.length === imageBlocks.length ? 'pass' : 'warning',
      message: `${imagesWithAlt.length}/${imageBlocks.length} imágenes tienen alt text`,
      suggestion: imagesWithAlt.length < imageBlocks.length 
        ? 'Agrega alt text descriptivo a todas las imágenes'
        : undefined,
    });
  }
  
  // Check for footer
  const hasFooter = doc.blocks.some(b => b.type === 'footer');
  checks.push({
    id: 'footer',
    name: 'Footer',
    status: hasFooter ? 'pass' : 'warning',
    message: hasFooter ? 'Footer presente' : 'Sin footer',
    suggestion: !hasFooter ? 'Agrega un footer con información de contacto y unsubscribe' : undefined,
  });
  
  // Check for unsubscribe link
  const footerBlock = doc.blocks.find(b => b.type === 'footer');
  const hasUnsubscribe = footerBlock?.type === 'footer' && footerBlock.includeUnsubscribe;
  checks.push({
    id: 'unsubscribe',
    name: 'Link de baja',
    status: hasUnsubscribe ? 'pass' : 'warning',
    message: hasUnsubscribe ? 'Link de baja incluido' : 'Sin link de baja explícito',
    suggestion: !hasUnsubscribe 
      ? 'Los emails comerciales requieren un enlace de unsubscribe visible'
      : undefined,
  });
  
  // Table layout (always pass since we use tables)
  checks.push({
    id: 'table-layout',
    name: 'Layout con tablas',
    status: 'pass',
    message: 'HTML generado usa tablas para compatibilidad',
  });
  
  // Inline styles (always pass)
  checks.push({
    id: 'inline-styles',
    name: 'Estilos inline',
    status: 'pass',
    message: 'CSS inline aplicado automáticamente',
  });
  
  // Font stack
  checks.push({
    id: 'font-stack',
    name: 'Tipografía',
    status: 'pass',
    message: `Font stack: ${brandKit.typography.fontStack.split(',')[0]}`,
    suggestion: 'Usando fuentes web-safe con fallbacks',
  });
  
  // Email width
  checks.push({
    id: 'width',
    name: 'Ancho de email',
    status: 'pass',
    message: 'Ancho fijo 600px con responsive',
  });
  
  return checks;
}

// Check color contrasts
export function checkContrasts(brandKit: BrandKit): ContrastCheck[] {
  const checks: ContrastCheck[] = [];
  
  // Primary text on background
  const primaryOnBg = getContrastRatio(brandKit.colors.text, brandKit.colors.background);
  checks.push({
    foreground: brandKit.colors.text,
    background: brandKit.colors.background,
    ratio: Math.round(primaryOnBg * 100) / 100,
    level: getContrastLevel(primaryOnBg),
    suggestion: getContrastLevel(primaryOnBg) === 'fail' 
      ? 'El contraste entre texto y fondo es insuficiente'
      : undefined,
  });
  
  // Muted text on background
  const mutedOnBg = getContrastRatio(brandKit.colors.mutedText, brandKit.colors.background);
  checks.push({
    foreground: brandKit.colors.mutedText,
    background: brandKit.colors.background,
    ratio: Math.round(mutedOnBg * 100) / 100,
    level: getContrastLevel(mutedOnBg),
    suggestion: getContrastLevel(mutedOnBg) === 'fail'
      ? 'El texto secundario puede ser difícil de leer'
      : undefined,
  });
  
  // Text on surface
  const textOnSurface = getContrastRatio(brandKit.colors.text, brandKit.colors.surface);
  checks.push({
    foreground: brandKit.colors.text,
    background: brandKit.colors.surface,
    ratio: Math.round(textOnSurface * 100) / 100,
    level: getContrastLevel(textOnSurface),
  });
  
  // Button text (assumed white on primary)
  const buttonContrast = getContrastRatio('#ffffff', brandKit.colors.primary);
  checks.push({
    foreground: '#ffffff',
    background: brandKit.colors.primary,
    ratio: Math.round(buttonContrast * 100) / 100,
    level: getContrastLevel(buttonContrast),
    suggestion: getContrastLevel(buttonContrast) === 'fail'
      ? 'El texto del botón puede no ser legible; considera un color más oscuro'
      : undefined,
  });
  
  return checks;
}

// Dark mode defense recommendations
export interface DarkModeDefense {
  id: string;
  title: string;
  description: string;
  applied: boolean;
  recommendation: string;
}

export function getDarkModeDefenses(brandKit: BrandKit): DarkModeDefense[] {
  const isLightBg = brandKit.colors.background.toLowerCase() === '#ffffff' || 
                    brandKit.colors.background.toLowerCase() === '#fff';
  
  return [
    {
      id: 'solid-bg',
      title: 'Fondos sólidos',
      description: 'Usar colores de fondo sólidos en lugar de transparentes',
      applied: true,
      recommendation: 'Los fondos sólidos evitan que el dark mode invierta el contenido inesperadamente.',
    },
    {
      id: 'avoid-gray',
      title: 'Evitar grises puros',
      description: 'Usar tonos con matiz en lugar de grises neutros',
      applied: !['#808080', '#888', '#999', '#aaa', '#bbb'].some(
        g => brandKit.colors.mutedText.toLowerCase() === g
      ),
      recommendation: 'Los grises puros pueden volverse blancos en dark mode, perdiéndose contra el fondo.',
    },
    {
      id: 'border-visibility',
      title: 'Bordes visibles',
      description: 'Mantener bordes definidos en tarjetas y contenedores',
      applied: brandKit.colors.border !== brandKit.colors.background,
      recommendation: 'Los bordes ayudan a mantener la estructura visual en dark mode.',
    },
    {
      id: 'logo-version',
      title: 'Logo alternativo',
      description: 'Tener una versión del logo para fondos oscuros',
      applied: !!brandKit.logos.dark,
      recommendation: 'Un logo con colores invertidos o con fondo puede ser necesario en dark mode.',
    },
    {
      id: 'sufficient-contrast',
      title: 'Contraste suficiente',
      description: 'Mantener ratio mínimo de 4.5:1 para texto',
      applied: getContrastRatio(brandKit.colors.text, brandKit.colors.background) >= 4.5,
      recommendation: 'El alto contraste base sobrevive mejor las transformaciones de dark mode.',
    },
  ];
}

// Generate dark mode CSS (for debug view)
export function generateDarkModeCSS(): string {
  return `
/* Gmail Dark Mode Approximation */
/* NOTA: Esto es una aproximación. Gmail aplica transformaciones propietarias. */

/* Inversión básica de colores claros */
[data-ogsc] .email-body {
  background-color: #1a1a1a !important;
}

[data-ogsc] .email-content {
  background-color: #2d2d2d !important;
}

[data-ogsc] .text-primary {
  color: #ffffff !important;
}

[data-ogsc] .text-muted {
  color: #a0a0a0 !important;
}

/* Outlook.com Dark Mode */
[data-ogsb] .email-body {
  background-color: #1a1a1a !important;
}
`;
}
