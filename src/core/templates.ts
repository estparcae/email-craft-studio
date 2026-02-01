// ============================================
// TEMPLATES - Base email templates
// ============================================

import { TemplateDefinition, EmailBlock } from '@/types';
import { generateId } from './brandParser';

// Newsletter template
const newsletterBlocks: EmailBlock[] = [
  {
    id: generateId(),
    type: 'header',
    alignment: 'center',
    tagline: 'Tu newsletter semanal',
    padding: 30,
  },
  {
    id: generateId(),
    type: 'hero',
    title: 'Título Principal del Newsletter',
    subtitle: 'Una breve descripción de lo que encontrarás en esta edición.',
    alignment: 'center',
  },
  {
    id: generateId(),
    type: 'spacer',
    height: 20,
  },
  {
    id: generateId(),
    type: 'text',
    content: '<p>Hola <strong>{{nombre}}</strong>,</p><p>Bienvenido a nuestra edición de esta semana. Hemos preparado contenido especial para ti.</p>',
    alignment: 'left',
  },
  {
    id: generateId(),
    type: 'divider',
    style: 'solid',
    thickness: 1,
  },
  {
    id: generateId(),
    type: 'text',
    content: '<h2 style="margin: 0 0 10px 0; font-size: 20px;">📌 Destacado de la semana</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
    alignment: 'left',
  },
  {
    id: generateId(),
    type: 'button',
    text: 'Leer más',
    url: '{{cta_url}}',
    alignment: 'left',
    borderRadius: 6,
  },
  {
    id: generateId(),
    type: 'spacer',
    height: 30,
  },
  {
    id: generateId(),
    type: 'text',
    content: '<h2 style="margin: 0 0 15px 0; font-size: 20px;">📚 Más contenido</h2>',
    alignment: 'left',
  },
  {
    id: generateId(),
    type: 'card',
    title: 'Artículo 1',
    content: 'Breve descripción del primer artículo o noticia destacada de la semana.',
    ctaText: 'Ver artículo →',
    ctaUrl: '#',
  },
  {
    id: generateId(),
    type: 'card',
    title: 'Artículo 2',
    content: 'Breve descripción del segundo artículo o recurso importante.',
    ctaText: 'Ver artículo →',
    ctaUrl: '#',
  },
  {
    id: generateId(),
    type: 'spacer',
    height: 20,
  },
  {
    id: generateId(),
    type: 'divider',
    style: 'solid',
    thickness: 1,
  },
  {
    id: generateId(),
    type: 'social',
    networks: [
      { type: 'twitter', url: '#' },
      { type: 'linkedin', url: '#' },
      { type: 'instagram', url: '#' },
    ],
    alignment: 'center',
    iconStyle: 'color',
  },
  {
    id: generateId(),
    type: 'footer',
    content: '© 2025 Tu Empresa. Todos los derechos reservados.<br/>Dirección: Calle Example 123, Ciudad',
    includeUnsubscribe: true,
  },
];

// Announcement template with cards
const announcementBlocks: EmailBlock[] = [
  {
    id: generateId(),
    type: 'header',
    alignment: 'center',
    padding: 25,
  },
  {
    id: generateId(),
    type: 'hero',
    title: '🎉 ¡Gran Anuncio!',
    subtitle: 'Tenemos noticias emocionantes que compartir contigo.',
    alignment: 'center',
  },
  {
    id: generateId(),
    type: 'spacer',
    height: 30,
  },
  {
    id: generateId(),
    type: 'text',
    content: '<p style="font-size: 18px; text-align: center;">Estamos emocionados de presentarte nuestras últimas novedades.</p>',
    alignment: 'center',
  },
  {
    id: generateId(),
    type: 'spacer',
    height: 20,
  },
  {
    id: generateId(),
    type: 'card',
    title: '✨ Nueva Funcionalidad',
    content: 'Descripción de la primera característica o producto nuevo que estás anunciando. Destaca los beneficios principales.',
  },
  {
    id: generateId(),
    type: 'card',
    title: '🚀 Mejoras de Rendimiento',
    content: 'Descripción de mejoras o actualizaciones. Explica cómo beneficia esto a tus usuarios.',
  },
  {
    id: generateId(),
    type: 'card',
    title: '🎁 Oferta Especial',
    content: 'Si hay una promoción asociada al anuncio, descríbela aquí con todos los detalles importantes.',
    ctaText: 'Aprovechar oferta',
    ctaUrl: '#',
  },
  {
    id: generateId(),
    type: 'spacer',
    height: 30,
  },
  {
    id: generateId(),
    type: 'button',
    text: 'Explorar Ahora',
    url: '{{cta_url}}',
    alignment: 'center',
    fullWidth: false,
    borderRadius: 8,
  },
  {
    id: generateId(),
    type: 'spacer',
    height: 30,
  },
  {
    id: generateId(),
    type: 'text',
    content: '<p style="text-align: center; color: #666;">¿Tienes preguntas? Responde a este correo o visita nuestro centro de ayuda.</p>',
    alignment: 'center',
  },
  {
    id: generateId(),
    type: 'divider',
    style: 'solid',
    thickness: 1,
  },
  {
    id: generateId(),
    type: 'footer',
    content: '© 2025 Tu Empresa<br/>Este email fue enviado a {{email}}',
    includeUnsubscribe: true,
  },
];

// Event invitation template
const eventBlocks: EmailBlock[] = [
  {
    id: generateId(),
    type: 'header',
    alignment: 'center',
    tagline: 'Estás invitado',
    padding: 30,
  },
  {
    id: generateId(),
    type: 'hero',
    title: 'Webinar: Título del Evento',
    subtitle: 'Aprende las mejores prácticas con nuestros expertos',
    alignment: 'center',
  },
  {
    id: generateId(),
    type: 'spacer',
    height: 20,
  },
  {
    id: generateId(),
    type: 'text',
    content: `
      <div style="text-align: center; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
        <p style="margin: 0 0 15px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Detalles del evento</p>
        <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">📅 Jueves, 15 de Febrero 2025</p>
        <p style="margin: 0 0 10px 0; font-size: 18px;">🕐 10:00 AM - 11:30 AM (GMT-5)</p>
        <p style="margin: 0; font-size: 18px;">💻 Online via Zoom</p>
      </div>
    `,
    alignment: 'center',
  },
  {
    id: generateId(),
    type: 'spacer',
    height: 20,
  },
  {
    id: generateId(),
    type: 'text',
    content: `
      <h3 style="margin: 0 0 15px 0;">¿Qué aprenderás?</h3>
      <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
        <li>Estrategias probadas para mejorar tu productividad</li>
        <li>Herramientas y recursos exclusivos</li>
        <li>Sesión de preguntas y respuestas en vivo</li>
        <li>Material descargable para asistentes</li>
      </ul>
    `,
    alignment: 'left',
  },
  {
    id: generateId(),
    type: 'spacer',
    height: 20,
  },
  {
    id: generateId(),
    type: 'button',
    text: 'Reservar Mi Lugar',
    url: '{{registration_url}}',
    alignment: 'center',
    borderRadius: 8,
  },
  {
    id: generateId(),
    type: 'spacer',
    height: 10,
  },
  {
    id: generateId(),
    type: 'text',
    content: '<p style="text-align: center; font-size: 14px; color: #64748b;">Cupos limitados. ¡No te lo pierdas!</p>',
    alignment: 'center',
  },
  {
    id: generateId(),
    type: 'divider',
    style: 'solid',
    thickness: 1,
  },
  {
    id: generateId(),
    type: 'text',
    content: `
      <h3 style="margin: 0 0 15px 0; text-align: center;">Speakers</h3>
      <table width="100%" cellpadding="10" cellspacing="0" border="0">
        <tr>
          <td width="50%" valign="top" style="text-align: center;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: #e2e8f0; margin: 0 auto 10px;"></div>
            <p style="margin: 0; font-weight: bold;">María García</p>
            <p style="margin: 5px 0 0; font-size: 14px; color: #64748b;">CEO, Empresa</p>
          </td>
          <td width="50%" valign="top" style="text-align: center;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: #e2e8f0; margin: 0 auto 10px;"></div>
            <p style="margin: 0; font-weight: bold;">Carlos López</p>
            <p style="margin: 5px 0 0; font-size: 14px; color: #64748b;">CTO, Startup</p>
          </td>
        </tr>
      </table>
    `,
    alignment: 'center',
  },
  {
    id: generateId(),
    type: 'spacer',
    height: 20,
  },
  {
    id: generateId(),
    type: 'social',
    networks: [
      { type: 'twitter', url: '#' },
      { type: 'linkedin', url: '#' },
    ],
    alignment: 'center',
    iconStyle: 'color',
  },
  {
    id: generateId(),
    type: 'footer',
    content: '© 2025 Tu Empresa. Todos los derechos reservados.',
    includeUnsubscribe: true,
  },
];

// Export templates
export const templates: TemplateDefinition[] = [
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Newsletter limpio y profesional con secciones de contenido destacado y tarjetas.',
    category: 'newsletter',
    preview: '',
    blocks: newsletterBlocks,
    defaultSubject: 'Tu newsletter semanal',
    defaultPreheader: 'Las últimas novedades y contenido destacado de esta semana',
  },
  {
    id: 'announcement',
    name: 'Anuncio',
    description: 'Perfecto para anuncios de productos, lanzamientos o actualizaciones importantes.',
    category: 'announcement',
    preview: '',
    blocks: announcementBlocks,
    defaultSubject: '🎉 ¡Gran anuncio!',
    defaultPreheader: 'Tenemos noticias emocionantes que compartir contigo',
  },
  {
    id: 'event',
    name: 'Invitación a Evento',
    description: 'Invitación para webinars, conferencias o eventos con agenda y detalles.',
    category: 'event',
    preview: '',
    blocks: eventBlocks,
    defaultSubject: '📅 Estás invitado: [Nombre del Evento]',
    defaultPreheader: 'Reserva tu lugar para este evento exclusivo',
  },
];

// Get template by ID
export function getTemplateById(id: string): TemplateDefinition | undefined {
  return templates.find(t => t.id === id);
}

// Clone template blocks with new IDs
export function cloneTemplateBlocks(blocks: EmailBlock[]): EmailBlock[] {
  return blocks.map(block => ({
    ...block,
    id: generateId(),
  }));
}
