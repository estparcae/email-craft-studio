import { useApp } from '@/context/AppContext';
import { renderEmail } from '@/core/emailRenderer';
import { DEFAULT_BRAND_KIT } from '@/types';
import { Monitor, Smartphone, Moon, Sun, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';

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
  
  const brandKit = currentBrandKit || DEFAULT_BRAND_KIT;
  
  const emailHtml = useMemo(() => {
    if (!currentEmail) return '';
    return renderEmail(currentEmail, brandKit, {
      forPreview: true,
      darkMode: darkModePreview,
    });
  }, [currentEmail, brandKit, darkModePreview, refreshKey]);
  
  const previewWidth = previewMode === 'desktop' ? 620 : 375;
  
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
          <div className="gmail-frame mx-auto" style={{ maxWidth: previewWidth }}>
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
            
            {/* Email content */}
            <div className="gmail-email-card overflow-hidden">
              <iframe
                key={`${refreshKey}-${darkModePreview}`}
                srcDoc={iframeContent}
                title="Email Preview"
                className="w-full border-0"
                style={{ 
                  height: '600px',
                  minHeight: '400px',
                }}
                sandbox="allow-same-origin"
              />
            </div>
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
