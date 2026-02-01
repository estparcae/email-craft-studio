"use client";

import { useApp } from '@/context/AppContext';
import { renderEmail } from '@/core/emailRenderer';
import { DEFAULT_BRAND_KIT } from '@/types';
import { Monitor, Smartphone, Moon, Sun, RefreshCw, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemo, useState, useCallback, useRef, useEffect } from 'react';

// Viewport limits por modo (px). Recomendado = vista típica Gmail/Outlook/Apple Mail.
const VIEWPORT = {
  desktop: { min: 480, recommended: 600, max: 800, label: 'Gmail/Outlook ~600px' },
  mobile: { min: 320, recommended: 375, max: 428, label: 'iPhone/Android ~375px' },
} as const;

export function EmailPreview() {
  const { 
    currentEmail, 
    currentBrandKit, 
    previewMode, 
    setPreviewMode,
    darkModePreview,
    setDarkModePreview,
  } = useApp();
  
  const [refreshKey, setRefreshKey] = useState(0);
  const limits = VIEWPORT[previewMode];
  const [previewWidth, setPreviewWidth] = useState(limits.recommended);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  
  // Al cambiar modo, resetear ancho al recomendado del modo
  useEffect(() => {
    setPreviewWidth(limits.recommended);
  }, [previewMode, limits.recommended]);
  
  const brandKit = currentBrandKit || DEFAULT_BRAND_KIT;
  
  const emailHtml = useMemo(() => {
    if (!currentEmail) return '';
    return renderEmail(currentEmail, brandKit, {
      forPreview: true,
      darkMode: darkModePreview,
    });
  }, [currentEmail, brandKit, darkModePreview, refreshKey]);
  
  const isOverflowingViewport = previewWidth > limits.recommended;
  
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    startX.current = e.clientX;
    startWidth.current = previewWidth;
    setIsDragging(true);
  }, [previewWidth]);
  
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - startX.current;
      const next = Math.round(Math.min(limits.max, Math.max(limits.min, startWidth.current + delta)));
      setPreviewWidth(next);
    };
    const onUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, limits.min, limits.max]);
  
  // Apply dark mode simulation styles
  const darkModeStyles = darkModePreview ? `
    <style>
      body { background-color: #1a1a1a !important; }
      table[style*="background"] { background-color: #2d2d2d !important; }
    </style>
  ` : '';
  
  const iframeContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { box-sizing: border-box; }
        body { 
          margin: 0; 
          padding: 0; 
          font-family: Arial, sans-serif;
        }
      </style>
      ${darkModeStyles}
    </head>
    <body>
      ${emailHtml}
    </body>
    </html>
  `;
  
  return (
    <div className="h-full flex flex-col">
      {/* Preview Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Preview</span>
          {currentEmail && (
            <span className="text-xs text-muted-foreground">
              {currentEmail.name}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {/* Device toggle */}
          <div className="flex items-center bg-muted rounded-md p-0.5">
            <Button
              variant={previewMode === 'desktop' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
              className="h-7 px-2"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
              className="h-7 px-2"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Dark mode toggle */}
          <Button
            variant={darkModePreview ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setDarkModePreview(!darkModePreview)}
            className="h-7 px-2 gap-1"
            title="Simular Dark Mode (aproximado)"
          >
            {darkModePreview ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
            <span className="text-xs hidden sm:inline">
              {darkModePreview ? 'Dark' : 'Light'}
            </span>
          </Button>
          
          {/* Refresh */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRefreshKey(k => k + 1)}
            className="h-7 px-2"
            title="Refrescar preview"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Gmail-like frame */}
      <div className="flex-1 overflow-auto p-4 md:p-8 gmail-body">
        {!currentEmail ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Selecciona un email para previsualizar</p>
          </div>
        ) : (
          <div className="mx-auto relative flex flex-col items-center" style={{ width: previewWidth + 24 }}>
            {/* Contenedor redimensionable con guía de viewport */}
            <div 
              className="gmail-frame relative flex flex-col"
              style={{ width: previewWidth }}
            >
              {/* Gmail toolbar simulation */}
              <div className="gmail-toolbar">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">TU</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-none">
                      {currentEmail.subject || 'Sin asunto'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      tu-empresa@example.com
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Email content + guía de desborde */}
              <div className="gmail-email-card overflow-hidden relative" style={{ maxWidth: previewWidth }}>
                {/* Línea/margen de aviso: viewport típico del cliente (cuando el ancho actual lo supera) */}
                {isOverflowingViewport && (
                  <>
                    <div
                      className="absolute top-0 bottom-0 w-px z-10 pointer-events-none"
                      style={{
                        left: limits.recommended,
                        background: 'repeating-linear-gradient(to bottom, hsl(var(--warning)) 0, hsl(var(--warning)) 4px, transparent 4px, transparent 8px)',
                        boxShadow: '0 0 0 1px hsl(var(--warning) / 0.5)',
                      }}
                      title={limits.label}
                    />
                    <div
                      className="absolute top-0 right-0 bottom-0 left-0 z-[5] pointer-events-none bg-warning/5"
                      style={{ marginLeft: limits.recommended }}
                      title="Zona que puede desbordar en clientes de correo"
                    />
                    <div
                      className="absolute z-20 pointer-events-none text-[10px] font-medium text-warning whitespace-nowrap"
                      style={{ left: limits.recommended + 6, top: 6 }}
                    >
                      {limits.label} — puede desbordar
                    </div>
                  </>
                )}
                <iframe
                  key={`${refreshKey}-${darkModePreview}`}
                  srcDoc={iframeContent}
                  title="Email Preview"
                  className="w-full border-0 relative z-0"
                  style={{ 
                    height: '600px',
                    minHeight: '400px',
                  }}
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
            
            {/* Handle para redimensionar (arrastrar) */}
            <div
              role="separator"
              aria-label="Redimensionar vista previa"
              onMouseDown={handleResizeStart}
              className="absolute top-0 bottom-0 w-6 flex items-center justify-center cursor-col-resize hover:bg-primary/10 rounded-r transition-colors group"
              style={{ left: previewWidth - 2 }}
            >
              <div className="w-1 h-12 rounded-full bg-border group-hover:bg-primary/50 transition-colors flex items-center justify-center">
                <GripVertical className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
              </div>
            </div>
            
            {/* Indicador de ancho actual */}
            <p className="text-xs text-muted-foreground mt-2">
              {previewWidth}px
              {isOverflowingViewport && (
                <span className="text-warning ml-1"> · Más ancho que {limits.label}</span>
              )}
            </p>
          </div>
        )}
        
        {/* Dark mode warning */}
        {darkModePreview && (
          <div className="mt-4 mx-auto max-w-lg p-3 bg-warning/10 border border-warning/30 rounded-lg">
            <p className="text-xs text-center text-warning">
              ⚠️ Esta es una simulación aproximada del dark mode. Gmail y Outlook 
              aplican transformaciones propietarias que pueden variar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
