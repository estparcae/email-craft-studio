import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { BrandKit, DEFAULT_BRAND_KIT } from '@/types';
import { 
  extractAllColors, 
  fileToBase64, 
  readTextFile, 
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
  
  // Handle brand document upload (TXT only for now)
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentBrandKit) return;
    
    try {
      const text = await readTextFile(file);
      const colors = extractAllColors(text);
      setExtractedColors(colors);
      
      // Update brand notes
      updateBrandKit({
        ...currentBrandKit,
        brandNotes: text.slice(0, 5000), // Limit to 5000 chars
        extractedColors: colors,
      });
    } catch (error) {
      console.error('Error reading document:', error);
    }
  };
  
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
          
          {/* Document Upload */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText className="w-4 h-4" />
              Manual de Marca
            </div>
            
            <label className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-dashed border-border cursor-pointer hover:bg-muted transition-colors">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Cargar documento (TXT)
              </span>
              <input
                type="file"
                accept=".txt"
                onChange={handleDocumentUpload}
                className="hidden"
              />
            </label>
            
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
