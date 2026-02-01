"use client";

import { useApp } from '@/context/AppContext';
import { checkCompatibility, checkContrasts, getDarkModeDefenses } from '@/core/compatibilityChecker';
import { renderEmail, minifyHtml } from '@/core/emailRenderer';
import { DEFAULT_BRAND_KIT } from '@/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Download,
  Copy,
  Check,
  AlertTriangle,
  Shield,
  Eye,
  Code,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';

export function ExportPanel() {
  const { currentEmail, currentBrandKit } = useApp();
  
  const [includeComments, setIncludeComments] = useState(false);
  const [showHtml, setShowHtml] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const brandKit = currentBrandKit || DEFAULT_BRAND_KIT;
  
  // Generate HTML
  const htmlOutput = useMemo(() => {
    if (!currentEmail) return '';
    return renderEmail(currentEmail, brandKit, {
      forPreview: false,
      darkMode: false,
      includeComments,
    });
  }, [currentEmail, brandKit, includeComments]);
  
  // Compatibility checks
  const compatibilityChecks = useMemo(() => {
    if (!currentEmail) return [];
    return checkCompatibility(currentEmail, brandKit);
  }, [currentEmail, brandKit]);
  
  // Contrast checks
  const contrastChecks = useMemo(() => {
    return checkContrasts(brandKit);
  }, [brandKit]);
  
  // Dark mode defenses
  const darkModeDefenses = useMemo(() => {
    return getDarkModeDefenses(brandKit);
  }, [brandKit]);
  
  // Stats
  const passCount = compatibilityChecks.filter(c => c.status === 'pass').length;
  const warnCount = compatibilityChecks.filter(c => c.status === 'warning').length;
  const failCount = compatibilityChecks.filter(c => c.status === 'fail').length;
  
  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlOutput);
      setCopied(true);
      toast.success('HTML copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Error al copiar');
    }
  };
  
  // Download HTML
  const handleDownload = () => {
    const blob = new Blob([htmlOutput], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentEmail?.name || 'email'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Archivo descargado');
  };
  
  if (!currentEmail) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        Selecciona un email para exportar
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Export Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Exportar HTML</h3>
        
        <div className="flex items-center justify-between">
          <Label className="text-xs">Incluir comentarios debug</Label>
          <Switch
            checked={includeComments}
            onCheckedChange={setIncludeComments}
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleCopy} className="flex-1" variant="outline">
            {copied ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            Copiar HTML
          </Button>
          <Button onClick={handleDownload} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Descargar
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHtml(!showHtml)}
          className="w-full"
        >
          <Code className="w-4 h-4 mr-2" />
          {showHtml ? 'Ocultar' : 'Ver'} HTML
        </Button>
        
        {showHtml && (
          <div className="code-block max-h-60 overflow-auto text-xs">
            <pre className="whitespace-pre-wrap break-all">
              {htmlOutput.slice(0, 3000)}
              {htmlOutput.length > 3000 && '...'}
            </pre>
          </div>
        )}
      </div>
      
      {/* Compatibility Panel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Compatibilidad
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="badge-success">{passCount} ok</span>
            {warnCount > 0 && <span className="badge-warning">{warnCount} warn</span>}
            {failCount > 0 && <span className="badge-danger">{failCount} fail</span>}
          </div>
        </div>
        
        <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
          {compatibilityChecks.map((check) => (
            <div
              key={check.id}
              className="flex items-start gap-2 p-2 rounded-md bg-muted/50"
            >
              {check.status === 'pass' && (
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              )}
              {check.status === 'warning' && (
                <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              )}
              {check.status === 'fail' && (
                <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">{check.name}</p>
                <p className="text-xs text-muted-foreground">{check.message}</p>
                {check.suggestion && (
                  <p className="text-xs text-primary mt-0.5">💡 {check.suggestion}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Contrast Checks */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Contraste (WCAG)
        </h3>
        
        <div className="space-y-2">
          {contrastChecks.map((check, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
            >
              <div
                className="w-5 h-5 rounded border border-border"
                style={{ backgroundColor: check.background }}
              />
              <div
                className="w-5 h-5 rounded border border-border"
                style={{ backgroundColor: check.foreground }}
              />
              <div className="flex-1">
                <p className="text-xs font-mono">
                  {check.foreground} / {check.background}
                </p>
              </div>
              <span className={`text-xs font-medium ${
                check.level === 'AAA' ? 'text-success' :
                check.level === 'AA' ? 'text-warning' :
                'text-destructive'
              }`}>
                {check.ratio}:1 ({check.level})
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dark Mode Defenses */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Defensa Dark Mode
        </h3>
        
        <p className="text-xs text-muted-foreground">
          Recomendaciones para mejorar la visualización en dark mode:
        </p>
        
        <div className="space-y-2">
          {darkModeDefenses.map((defense) => (
            <div
              key={defense.id}
              className={`p-2 rounded-md ${
                defense.applied ? 'bg-success/10' : 'bg-warning/10'
              }`}
            >
              <div className="flex items-center gap-2">
                {defense.applied ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-warning" />
                )}
                <p className="text-xs font-medium">{defense.title}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-6">
                {defense.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Notes */}
      <div className="p-3 bg-muted/50 rounded-lg space-y-2">
        <p className="text-xs font-medium">⚠️ Limitaciones conocidas:</p>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>Gmail puede bloquear imágenes externas por defecto</li>
          <li>El dark mode de Gmail aplica transformaciones automáticas no predecibles</li>
          <li>Outlook usa renderizador Word con limitaciones de CSS</li>
          <li>Prueba siempre en clientes reales antes de enviar</li>
        </ul>
      </div>
    </div>
  );
}
