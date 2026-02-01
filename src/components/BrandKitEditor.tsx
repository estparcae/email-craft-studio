"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { useApp } from '@/context/AppContext';
import { BrandKit, DEFAULT_BRAND_KIT } from '@/types';
import {
  fileToBase64,
  generateId,
  SAFE_FONT_STACKS,
  DEFAULT_COLOR_ROLES,
  getContrastRatio,
  getContrastLevel,
} from '@/core/brandParser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Palette,
  ImageIcon,
  FileText,
  Plus,
  Trash2,
  Upload,
  Check,
  AlertTriangle,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';

export function BrandKitEditor() {
  const { 
    brandKits, 
    currentBrandKit, 
    setCurrentBrandKit, 
    addBrandKit, 
    updateBrandKit,
    deleteBrandKit,
  } = useApp();
  
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newKitName, setNewKitName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Handle brand document upload (PDF or TXT)
  const handleDocumentUpload = useCallback(async (file: File) => {
    if (!currentBrandKit) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/brand-manual/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to analyze brand manual');
      }

      const data = await response.json();
      const analysis = data.analysis;

      // Extract all colors from analysis
      const allColors = [
        ...(analysis.colors.primary || []),
        ...(analysis.colors.secondary || []),
        ...(analysis.colors.accent || []),
        ...(analysis.colors.neutral || []),
      ].filter(Boolean);

      setExtractedColors(allColors);

      // Build comprehensive brand notes from analysis
      const brandNotes = [
        '=== BRAND ANALYSIS ===\n',
        analysis.brandVoice ? `Brand Voice: ${analysis.brandVoice}\n` : '',
        analysis.keyGuidelines?.length ? `\nKey Guidelines:\n${analysis.keyGuidelines.map((g: string) => `• ${g}`).join('\n')}\n` : '',
        analysis.logoUsage ? `\nLogo Usage:\n${analysis.logoUsage}\n` : '',
        analysis.doAndDonts?.length ? `\nDo's and Don'ts:\n${analysis.doAndDonts.map((d: string) => `• ${d}`).join('\n')}\n` : '',
        analysis.spacing?.recommendations?.length ? `\nSpacing:\n${analysis.spacing.recommendations.map((r: string) => `• ${r}`).join('\n')}` : '',
      ].filter(Boolean).join('');

      // Update brand kit with all analyzed data
      const typography = analysis.typography || {};
      const colors = analysis.colors || {};

      updateBrandKit({
        ...currentBrandKit,
        brandNotes: brandNotes || data.preview,
        extractedColors: allColors,
        colors: {
          primary: colors.primary?.[0] || currentBrandKit.colors.primary,
          secondary: colors.secondary?.[0] || currentBrandKit.colors.secondary,
          accent: colors.accent?.[0] || currentBrandKit.colors.accent,
          background: colors.neutral?.[0] || '#ffffff',
          surface: colors.neutral?.[1] || currentBrandKit.colors.surface,
          text: '#1e293b',
          mutedText: '#64748b',
          border: '#e2e8f0',
          success: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
        typography: {
          heading: typography.headingFonts?.[0] || currentBrandKit.typography.heading,
          body: typography.bodyFonts?.[0] || currentBrandKit.typography.body,
          fontStack: typography.bodyFonts?.[0]
            ? `"${typography.bodyFonts[0]}", Arial, sans-serif`
            : currentBrandKit.typography.fontStack,
        },
      });

      // Show success toast with details
      toast.success('¡Manual de marca analizado!', {
        description: `Se encontraron ${allColors.length} colores${typography.headingFonts?.[0] ? ` y tipografía ${typography.headingFonts[0]}` : ''}. La configuración se ha aplicado automáticamente.`,
        duration: 5000,
        icon: <Sparkles className="w-4 h-4" />,
      });

      console.log('✅ Brand analysis applied successfully:', {
        colors: allColors.length,
        typography: typography.headingFonts?.[0],
        guidelines: analysis.keyGuidelines?.length || 0,
      });

    } catch (error) {
      console.error('Error analyzing document:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze brand manual';
      setAnalysisError(errorMessage);

      // Show error toast
      toast.error('Error al analizar el manual', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentBrandKit, updateBrandKit]);

  // Dropzone for brand manual upload
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors?.[0]?.code === 'file-too-large') {
        toast.error('Archivo demasiado grande', {
          description: 'Los archivos PDF deben ser menores a 32MB',
        });
      } else {
        toast.error('Archivo no válido', {
          description: 'Solo se permiten archivos PDF o TXT',
        });
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Client-side file size validation for PDFs
      const MAX_FILE_SIZE = 32 * 1024 * 1024; // 32MB
      if (file.type === 'application/pdf' && file.size > MAX_FILE_SIZE) {
        toast.error('Archivo demasiado grande', {
          description: `El archivo PDF (${(file.size / 1024 / 1024).toFixed(2)}MB) excede el límite de 32MB`,
        });
        return;
      }

      handleDocumentUpload(file);
    }
  }, [handleDocumentUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 32 * 1024 * 1024, // 32MB
    disabled: isAnalyzing,
  });
  
  // Handle logo upload
  const handleLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    type: 'primary' | 'dark' | 'icon'
  ) => {
    const file = e.target.files?.[0];
    if (!file || !currentBrandKit) return;
    
    try {
      const base64 = await fileToBase64(file);
      updateBrandKit({
        ...currentBrandKit,
        logos: {
          ...currentBrandKit.logos,
          [type]: base64,
        },
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
  };
  
  // Handle color change
  const handleColorChange = (role: keyof BrandKit['colors'], color: string) => {
    if (!currentBrandKit) return;
    updateBrandKit({
      ...currentBrandKit,
      colors: {
        ...currentBrandKit.colors,
        [role]: color,
      },
    });
  };
  
  // Handle font stack change
  const handleFontStackChange = (fontStack: string) => {
    if (!currentBrandKit) return;
    updateBrandKit({
      ...currentBrandKit,
      typography: {
        ...currentBrandKit.typography,
        fontStack,
      },
    });
  };
  
  // Create new brand kit
  const handleCreateKit = () => {
    if (!newKitName.trim()) return;
    
    const newKit: BrandKit = {
      ...DEFAULT_BRAND_KIT,
      id: generateId(),
      name: newKitName.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    addBrandKit(newKit);
    setCurrentBrandKit(newKit);
    setNewKitName('');
    setIsCreating(false);
  };
  
  // Apply extracted color
  const applyExtractedColor = (color: string, role: keyof BrandKit['colors']) => {
    handleColorChange(role, color);
  };
  
  // Remove logo
  const removeLogo = (type: 'primary' | 'dark' | 'icon') => {
    if (!currentBrandKit) return;
    const logos = { ...currentBrandKit.logos };
    delete logos[type];
    updateBrandKit({ ...currentBrandKit, logos });
  };
  
  return (
    <div className="space-y-6">
      {/* Brand Kit Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Brand Kit</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsCreating(true)}
            className="h-7 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Nuevo
          </Button>
        </div>
        
        {isCreating ? (
          <div className="flex gap-2">
            <Input
              placeholder="Nombre del Brand Kit"
              value={newKitName}
              onChange={(e) => setNewKitName(e.target.value)}
              className="h-9"
            />
            <Button size="sm" onClick={handleCreateKit} className="h-9">
              <Check className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setIsCreating(false)}
              className="h-9"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Select
            value={currentBrandKit?.id || ''}
            onValueChange={(id) => {
              const kit = brandKits.find(k => k.id === id);
              if (kit) setCurrentBrandKit(kit);
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Selecciona un Brand Kit" />
            </SelectTrigger>
            <SelectContent>
              {brandKits.map(kit => (
                <SelectItem key={kit.id} value={kit.id}>
                  {kit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      {currentBrandKit && (
        <>
          {/* Logos Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ImageIcon className="w-4 h-4" />
              Logos
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {/* Primary Logo */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Principal</Label>
                <div className="relative aspect-video bg-muted rounded-md border border-dashed border-border flex items-center justify-center overflow-hidden group">
                  {currentBrandKit.logos.primary ? (
                    <>
                      <img 
                        src={currentBrandKit.logos.primary} 
                        alt="Logo principal" 
                        className="max-w-full max-h-full object-contain p-2"
                      />
                      <button
                        onClick={() => removeLogo('primary')}
                        className="absolute top-1 right-1 p-1 bg-destructive/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-destructive-foreground" />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer p-2 text-center">
                      <Upload className="w-5 h-5 mx-auto text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(e, 'primary')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              
              {/* Dark Logo */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Dark Mode</Label>
                <div className="relative aspect-video bg-gray-800 rounded-md border border-dashed border-border flex items-center justify-center overflow-hidden group">
                  {currentBrandKit.logos.dark ? (
                    <>
                      <img 
                        src={currentBrandKit.logos.dark} 
                        alt="Logo dark" 
                        className="max-w-full max-h-full object-contain p-2"
                      />
                      <button
                        onClick={() => removeLogo('dark')}
                        className="absolute top-1 right-1 p-1 bg-destructive/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-destructive-foreground" />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer p-2 text-center">
                      <Upload className="w-5 h-5 mx-auto text-gray-400" />
                      <span className="text-xs text-gray-400">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(e, 'dark')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              
              {/* Icon */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Isotipo</Label>
                <div className="relative aspect-video bg-muted rounded-md border border-dashed border-border flex items-center justify-center overflow-hidden group">
                  {currentBrandKit.logos.icon ? (
                    <>
                      <img 
                        src={currentBrandKit.logos.icon} 
                        alt="Isotipo" 
                        className="max-w-full max-h-full object-contain p-2"
                      />
                      <button
                        onClick={() => removeLogo('icon')}
                        className="absolute top-1 right-1 p-1 bg-destructive/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-destructive-foreground" />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer p-2 text-center">
                      <Upload className="w-5 h-5 mx-auto text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(e, 'icon')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Document Upload - Dropzone */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText className="w-4 h-4" />
              Manual de Marca
            </div>

            <div
              {...getRootProps()}
              className={`
                relative flex flex-col items-center justify-center gap-3 p-6
                bg-muted/50 rounded-lg border-2 border-dashed
                transition-all cursor-pointer
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted'}
                ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} />

              {isAnalyzing ? (
                <>
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Analizando...</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Extrayendo información de marca con IA
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra tu manual de marca'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      o haz clic para seleccionar (PDF o TXT)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="w-3 h-3" />
                    <span>Soporta PDF y TXT</span>
                  </div>
                </>
              )}
            </div>

            {analysisError && (
              <div className="flex items-center gap-2 p-3 text-xs text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{analysisError}</span>
              </div>
            )}
            
            {currentBrandKit.brandNotes && (
              <Textarea
                value={currentBrandKit.brandNotes}
                onChange={(e) => updateBrandKit({
                  ...currentBrandKit,
                  brandNotes: e.target.value,
                })}
                placeholder="Notas del manual de marca..."
                className="text-xs h-20 resize-none"
              />
            )}
            
            {extractedColors.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Colores encontrados ({extractedColors.length})
                </Label>
                <div className="flex flex-wrap gap-2">
                  {extractedColors.slice(0, 12).map((color, i) => (
                    <div
                      key={i}
                      className="color-swatch group relative"
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                        <span className="text-[8px] text-white font-mono">
                          {color}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Colors Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Palette className="w-4 h-4" />
              Paleta de Colores
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {DEFAULT_COLOR_ROLES.map(({ role, label, description }) => {
                const color = currentBrandKit.colors[role];
                const contrastCheck = role === 'text' 
                  ? getContrastRatio(color, currentBrandKit.colors.background)
                  : role === 'mutedText'
                  ? getContrastRatio(color, currentBrandKit.colors.background)
                  : null;
                const contrastLevel = contrastCheck ? getContrastLevel(contrastCheck) : null;
                
                return (
                  <div key={role} className="space-y-1">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      {label}
                      {contrastLevel && contrastLevel !== 'fail' && (
                        <span className="badge-success text-[10px] py-0">
                          {contrastLevel}
                        </span>
                      )}
                      {contrastLevel === 'fail' && (
                        <span className="badge-warning text-[10px] py-0">
                          <AlertTriangle className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => handleColorChange(role, e.target.value)}
                        className="w-9 h-9 rounded-md border border-border cursor-pointer"
                      />
                      <Input
                        value={color}
                        onChange={(e) => handleColorChange(role, e.target.value)}
                        className="h-9 font-mono text-xs uppercase"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Typography */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tipografía</Label>
            <Select
              value={currentBrandKit.typography.fontStack}
              onValueChange={handleFontStackChange}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SAFE_FONT_STACKS).map(([name, stack]) => (
                  <SelectItem key={name} value={stack}>
                    <span style={{ fontFamily: stack }}>{name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Solo fuentes web-safe para máxima compatibilidad
            </p>
          </div>
          
          {/* Delete Button */}
          {brandKits.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteBrandKit(currentBrandKit.id)}
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar Brand Kit
            </Button>
          )}
        </>
      )}
    </div>
  );
}
