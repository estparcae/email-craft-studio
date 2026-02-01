// ============================================
// EMAIL RENDERER - Generates table-based HTML
// ============================================

import {
  EmailDoc,
  EmailBlock,
  BrandKit,
  HeaderBlock,
  HeroBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
  SpacerBlock,
  CardBlock,
  FooterBlock,
  SocialBlock,
  DesignTokens,
  DEFAULT_DESIGN_TOKENS,
} from '@/types';

// Convert brand kit to design tokens
export function brandKitToTokens(brandKit: BrandKit): DesignTokens {
  return {
    primary: brandKit.colors.primary,
    secondary: brandKit.colors.secondary,
    background: brandKit.colors.background,
    surface: brandKit.colors.surface,
    text: brandKit.colors.text,
    mutedText: brandKit.colors.mutedText,
    border: brandKit.colors.border,
    success: brandKit.colors.success,
    warning: brandKit.colors.warning,
    danger: brandKit.colors.danger,
    radius: '4px',
    spacingScale: 8,
    fontStack: brandKit.typography.fontStack,
  };
}

// Apply dark mode transformations to tokens
export function getDarkModeTokens(tokens: DesignTokens): DesignTokens {
  return {
    ...tokens,
    background: '#1a1a1a',
    surface: '#2d2d2d',
    text: '#ffffff',
    mutedText: '#a0a0a0',
    border: '#404040',
  };
}

// Inline style helper
function style(styles: Record<string, string | number | undefined>): string {
  return Object.entries(styles)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}: ${value}`;
    })
    .join('; ');
}

// Render header block
function renderHeader(block: HeaderBlock, tokens: DesignTokens): string {
  const bgColor = block.backgroundColor || tokens.background;
  const padding = block.padding || 20;
  
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${style({
      backgroundColor: bgColor,
    })}">
      <tr>
        <td style="${style({
          padding: `${padding}px`,
          textAlign: block.alignment,
        })}">
          ${block.logoUrl ? `
            <img 
              src="${block.logoUrl}" 
              alt="Logo" 
              style="${style({
                maxWidth: '180px',
                height: 'auto',
                display: 'inline-block',
              })}"
            />
          ` : ''}
          ${block.tagline ? `
            <p style="${style({
              margin: block.logoUrl ? '10px 0 0 0' : '0',
              fontFamily: tokens.fontStack,
              fontSize: '14px',
              color: tokens.mutedText,
            })}">${block.tagline}</p>
          ` : ''}
        </td>
      </tr>
    </table>
  `;
}

// Render hero block
function renderHero(block: HeroBlock, tokens: DesignTokens): string {
  const bgColor = block.backgroundColor || tokens.primary;
  const textColor = block.textColor || '#ffffff';
  
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${style({
      backgroundColor: bgColor,
    })}">
      <tr>
        <td style="${style({
          padding: '40px 30px',
          textAlign: block.alignment,
        })}">
          <h1 style="${style({
            margin: '0 0 10px 0',
            fontFamily: tokens.fontStack,
            fontSize: '28px',
            fontWeight: 'bold',
            color: textColor,
            lineHeight: '1.3',
          })}">${block.title}</h1>
          ${block.subtitle ? `
            <p style="${style({
              margin: '0',
              fontFamily: tokens.fontStack,
              fontSize: '16px',
              color: textColor,
              opacity: '0.9',
              lineHeight: '1.5',
            })}">${block.subtitle}</p>
          ` : ''}
        </td>
      </tr>
    </table>
  `;
}

// Render text block
function renderText(block: TextBlock, tokens: DesignTokens): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="${style({
          padding: '20px 30px',
          fontFamily: tokens.fontStack,
          fontSize: '16px',
          lineHeight: '1.6',
          color: tokens.text,
          textAlign: block.alignment,
        })}">
          ${block.content}
        </td>
      </tr>
    </table>
  `;
}

// Render image block
function renderImage(block: ImageBlock, tokens: DesignTokens): string {
  const width = block.width || 560;
  const img = `
    <img 
      src="${block.src}" 
      alt="${block.alt}" 
      width="${width}"
      style="${style({
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
        border: '0',
      })}"
    />
  `;
  
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="${style({
          padding: '20px 30px',
          textAlign: block.alignment,
        })}">
          ${block.link ? `<a href="${block.link}" target="_blank">${img}</a>` : img}
        </td>
      </tr>
    </table>
  `;
}

// Render button block
function renderButton(block: ButtonBlock, tokens: DesignTokens): string {
  const bgColor = block.backgroundColor || tokens.primary;
  const textColor = block.textColor || '#ffffff';
  const borderRadius = block.borderRadius || 4;
  
  // VML fallback for Outlook
  const buttonWidth = block.fullWidth ? '100%' : 'auto';
  
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="${style({
          padding: '20px 30px',
          textAlign: block.alignment,
        })}">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${block.url}" style="height:44px;v-text-anchor:middle;width:200px;" arcsize="10%" stroke="f" fillcolor="${bgColor}">
            <w:anchorlock/>
            <center>
          <![endif]-->
          <a 
            href="${block.url}" 
            target="_blank"
            style="${style({
              display: 'inline-block',
              width: buttonWidth,
              padding: '12px 30px',
              fontFamily: tokens.fontStack,
              fontSize: '16px',
              fontWeight: 'bold',
              color: textColor,
              backgroundColor: bgColor,
              textDecoration: 'none',
              textAlign: 'center',
              borderRadius: `${borderRadius}px`,
              msoHide: 'all',
            })}"
          >${block.text}</a>
          <!--[if mso]>
            </center>
          </v:roundrect>
          <![endif]-->
        </td>
      </tr>
    </table>
  `;
}

// Render divider block
function renderDivider(block: DividerBlock, tokens: DesignTokens): string {
  const color = block.color || tokens.border;
  const thickness = block.thickness || 1;
  
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="${style({
          padding: '20px 30px',
        })}">
          <div style="${style({
            borderTop: `${thickness}px ${block.style} ${color}`,
          })}"></div>
        </td>
      </tr>
    </table>
  `;
}

// Render spacer block
function renderSpacer(block: SpacerBlock): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="${style({
          height: `${block.height}px`,
          fontSize: '1px',
          lineHeight: '1px',
        })}">&nbsp;</td>
      </tr>
    </table>
  `;
}

// Render card block
function renderCard(block: CardBlock, tokens: DesignTokens): string {
  const bgColor = block.backgroundColor || tokens.surface;
  const borderColor = block.borderColor || tokens.border;
  
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="${style({
          padding: '20px 30px',
        })}">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${style({
            backgroundColor: bgColor,
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
          })}">
            ${block.imageUrl ? `
              <tr>
                <td>
                  <img 
                    src="${block.imageUrl}" 
                    alt="" 
                    width="100%"
                    style="${style({
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px 8px 0 0',
                    })}"
                  />
                </td>
              </tr>
            ` : ''}
            <tr>
              <td style="${style({
                padding: '20px',
              })}">
                ${block.title ? `
                  <h3 style="${style({
                    margin: '0 0 10px 0',
                    fontFamily: tokens.fontStack,
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: tokens.text,
                  })}">${block.title}</h3>
                ` : ''}
                <p style="${style({
                  margin: '0',
                  fontFamily: tokens.fontStack,
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: tokens.mutedText,
                })}">${block.content}</p>
                ${block.ctaText && block.ctaUrl ? `
                  <p style="${style({
                    margin: '15px 0 0 0',
                  })}">
                    <a href="${block.ctaUrl}" style="${style({
                      fontFamily: tokens.fontStack,
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: tokens.primary,
                      textDecoration: 'underline',
                    })}">${block.ctaText}</a>
                  </p>
                ` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

// Render footer block
function renderFooter(block: FooterBlock, tokens: DesignTokens): string {
  const bgColor = block.backgroundColor || tokens.surface;
  const textColor = block.textColor || tokens.mutedText;
  
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${style({
      backgroundColor: bgColor,
    })}">
      <tr>
        <td style="${style({
          padding: '30px',
          textAlign: 'center',
        })}">
          <p style="${style({
            margin: '0',
            fontFamily: tokens.fontStack,
            fontSize: '12px',
            lineHeight: '1.5',
            color: textColor,
          })}">${block.content}</p>
          ${block.includeUnsubscribe ? `
            <p style="${style({
              margin: '15px 0 0 0',
              fontFamily: tokens.fontStack,
              fontSize: '12px',
              color: textColor,
            })}">
              <a href="{{unsubscribe_url}}" style="${style({
                color: textColor,
                textDecoration: 'underline',
              })}">Darse de baja</a>
            </p>
          ` : ''}
        </td>
      </tr>
    </table>
  `;
}

// Render social block
function renderSocial(block: SocialBlock, tokens: DesignTokens): string {
  const iconColors: Record<string, string> = {
    facebook: '#1877F2',
    twitter: '#1DA1F2',
    instagram: '#E4405F',
    linkedin: '#0A66C2',
    youtube: '#FF0000',
  };
  
  const icons = block.networks.map(network => {
    const color = block.iconStyle === 'color' ? iconColors[network.type] : tokens.mutedText;
    return `
      <td style="${style({ padding: '0 8px' })}">
        <a href="${network.url}" target="_blank" style="${style({
          display: 'inline-block',
          width: '32px',
          height: '32px',
          backgroundColor: color,
          borderRadius: '50%',
          textDecoration: 'none',
        })}">
          <img 
            src="https://placehold.co/32x32/${color.replace('#', '')}/${block.iconStyle === 'color' ? 'fff' : 'fff'}?text=${network.type.charAt(0).toUpperCase()}" 
            alt="${network.type}" 
            width="32" 
            height="32"
            style="${style({
              display: 'block',
              borderRadius: '50%',
            })}"
          />
        </a>
      </td>
    `;
  }).join('');
  
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="${style({
          padding: '20px 30px',
          textAlign: block.alignment,
        })}">
          <table cellpadding="0" cellspacing="0" border="0" style="${style({
            display: 'inline-block',
          })}">
            <tr>
              ${icons}
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

// Render a single block
function renderBlock(block: EmailBlock, tokens: DesignTokens): string {
  switch (block.type) {
    case 'header':
      return renderHeader(block, tokens);
    case 'hero':
      return renderHero(block, tokens);
    case 'text':
      return renderText(block, tokens);
    case 'image':
      return renderImage(block, tokens);
    case 'button':
      return renderButton(block, tokens);
    case 'divider':
      return renderDivider(block, tokens);
    case 'spacer':
      return renderSpacer(block);
    case 'card':
      return renderCard(block, tokens);
    case 'footer':
      return renderFooter(block, tokens);
    case 'social':
      return renderSocial(block, tokens);
    default:
      return '';
  }
}

// Generate preheader HTML
function generatePreheader(preheader: string): string {
  if (!preheader) return '';
  
  return `
    <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
      ${preheader}
      ${'&nbsp;&zwnj;'.repeat(50)}
    </div>
  `;
}

// Main render function
export function renderEmail(
  doc: EmailDoc,
  brandKit: BrandKit,
  options: {
    forPreview?: boolean;
    darkMode?: boolean;
    includeComments?: boolean;
  } = {}
): string {
  let tokens = brandKitToTokens(brandKit);
  
  // Apply dark mode if requested
  if (options.darkMode || doc.theme === 'dark') {
    tokens = getDarkModeTokens(tokens);
  }
  
  const blocksHtml = doc.blocks.map(block => {
    const html = renderBlock(block, tokens);
    if (options.includeComments) {
      return `\n<!-- Block: ${block.type} (${block.id}) -->\n${html}`;
    }
    return html;
  }).join('\n');
  
  const contentWidthPx = doc.contentWidth ?? 600;
  const contentWidthStr = `${contentWidthPx}px`;
  // En preview: ancho fijo para que fondo y bloques se expandan al ancho del email
  const innerTableStyle = options.forPreview
    ? { backgroundColor: tokens.surface, width: contentWidthStr, minWidth: contentWidthStr }
    : { backgroundColor: tokens.surface, maxWidth: contentWidthStr, width: '100%' };
  
  const emailBody = `
    ${generatePreheader(doc.preheader || '')}
    
    <!-- Email Container -->
    <table 
      width="100%" 
      cellpadding="0" 
      cellspacing="0" 
      border="0" 
      style="${style({
        backgroundColor: tokens.background,
      })}"
    >
      <tr>
        <td align="center" style="${style({
          padding: '20px 10px',
        })}">
          <!-- Email Content -->
          <table 
            width="${contentWidthPx}" 
            cellpadding="0" 
            cellspacing="0" 
            border="0" 
            style="${style(innerTableStyle)}"
          >
            ${blocksHtml}
          </table>
        </td>
      </tr>
    </table>
  `;
  
  // For preview, return just the body
  if (options.forPreview) {
    return emailBody;
  }
  
  // Full HTML document
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  ${doc.subject ? `<title>${doc.subject}</title>` : ''}
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    
    /* Mobile styles */
    @media only screen and (max-width: ${contentWidthPx + 20}px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .responsive-table { width: 100% !important; }
      .mobile-padding { padding-left: 15px !important; padding-right: 15px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
    }
    
    /* Dark mode styles (best effort) */
    @media (prefers-color-scheme: dark) {
      .dark-mode-bg { background-color: #1a1a1a !important; }
      .dark-mode-text { color: #ffffff !important; }
    }
    
    [data-ogsc] .dark-mode-bg { background-color: #1a1a1a !important; }
    [data-ogsc] .dark-mode-text { color: #ffffff !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${tokens.background};">
  ${emailBody}
</body>
</html>`;
}

// Clean and minify HTML
export function minifyHtml(html: string): string {
  return html
    .replace(/\n\s*/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
