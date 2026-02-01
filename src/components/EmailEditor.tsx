"use client";

import { useApp } from '@/context/AppContext';
import { EmailBlock, EmailBlockType } from '@/types';
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
import { Switch } from '@/components/ui/switch';
import {
  Type,
  Image as ImageIcon,
  Square,
  Minus,
  LayoutList,
  FileText,
  MousePointer2,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  GripVertical,
  Mail,
  Share2,
} from 'lucide-react';

const BLOCK_TYPES: { type: EmailBlockType; label: string; icon: React.ReactNode }[] = [
  { type: 'header', label: 'Header', icon: <LayoutList className="w-4 h-4" /> },
  { type: 'hero', label: 'Hero', icon: <Square className="w-4 h-4" /> },
  { type: 'text', label: 'Texto', icon: <Type className="w-4 h-4" /> },
  { type: 'image', label: 'Imagen', icon: <ImageIcon className="w-4 h-4" /> },
  { type: 'button', label: 'Botón', icon: <MousePointer2 className="w-4 h-4" /> },
  { type: 'divider', label: 'Divisor', icon: <Minus className="w-4 h-4" /> },
  { type: 'spacer', label: 'Espacio', icon: <Square className="w-4 h-4 opacity-30" /> },
  { type: 'card', label: 'Tarjeta', icon: <FileText className="w-4 h-4" /> },
  { type: 'social', label: 'Redes', icon: <Share2 className="w-4 h-4" /> },
  { type: 'footer', label: 'Footer', icon: <Mail className="w-4 h-4" /> },
];

function createDefaultBlock(type: EmailBlockType): EmailBlock {
  const base = { id: '', type };
  
  switch (type) {
    case 'header':
      return { ...base, type: 'header', alignment: 'center', padding: 20 };
    case 'hero':
      return { ...base, type: 'hero', title: 'Título Principal', subtitle: 'Subtítulo del hero', alignment: 'center' };
    case 'text':
      return { ...base, type: 'text', content: '<p>Escribe tu contenido aquí...</p>', alignment: 'left' };
    case 'image':
      return { ...base, type: 'image', src: 'https://placehold.co/560x280', alt: 'Descripción de la imagen', alignment: 'center' };
    case 'button':
      return { ...base, type: 'button', text: 'Clic aquí', url: 'https://example.com', alignment: 'center', borderRadius: 6 };
    case 'divider':
      return { ...base, type: 'divider', style: 'solid', thickness: 1 };
    case 'spacer':
      return { ...base, type: 'spacer', height: 30 };
    case 'card':
      return { ...base, type: 'card', title: 'Título de tarjeta', content: 'Contenido de la tarjeta...' };
    case 'social':
      return { ...base, type: 'social', networks: [{ type: 'twitter', url: '#' }], alignment: 'center', iconStyle: 'color' };
    case 'footer':
      return { ...base, type: 'footer', content: '© 2025 Tu Empresa', includeUnsubscribe: true };
    default:
      return base as EmailBlock;
  }
}

interface BlockEditorProps {
  block: EmailBlock;
  onUpdate: (updates: Partial<EmailBlock>) => void;
}

function BlockEditor({ block, onUpdate }: BlockEditorProps) {
  switch (block.type) {
    case 'header':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Tagline</Label>
            <Input
              value={block.tagline || ''}
              onChange={(e) => onUpdate({ tagline: e.target.value })}
              placeholder="Tagline opcional"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Alineación</Label>
            <Select
              value={block.alignment}
              onValueChange={(v) => onUpdate({ alignment: v as 'left' | 'center' | 'right' })}
            >
              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Izquierda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Derecha</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    
    case 'hero':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Título</Label>
            <Input
              value={block.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Subtítulo</Label>
            <Input
              value={block.subtitle || ''}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Color fondo</Label>
              <Input
                type="color"
                value={block.backgroundColor || '#2563eb'}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className="h-8 w-full"
              />
            </div>
            <div>
              <Label className="text-xs">Color texto</Label>
              <Input
                type="color"
                value={block.textColor || '#ffffff'}
                onChange={(e) => onUpdate({ textColor: e.target.value })}
                className="h-8 w-full"
              />
            </div>
          </div>
        </div>
      );
    
    case 'text':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Contenido (HTML)</Label>
            <Textarea
              value={block.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="text-sm min-h-[100px] font-mono text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Alineación</Label>
            <Select
              value={block.alignment}
              onValueChange={(v) => onUpdate({ alignment: v as 'left' | 'center' | 'right' })}
            >
              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Izquierda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Derecha</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    
    case 'image':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">URL de imagen</Label>
            <Input
              value={block.src}
              onChange={(e) => onUpdate({ src: e.target.value })}
              placeholder="https://..."
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Alt text</Label>
            <Input
              value={block.alt}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Link (opcional)</Label>
            <Input
              value={block.link || ''}
              onChange={(e) => onUpdate({ link: e.target.value })}
              placeholder="https://..."
              className="h-8 text-sm"
            />
          </div>
        </div>
      );
    
    case 'button':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Texto</Label>
            <Input
              value={block.text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">URL</Label>
            <Input
              value={block.url}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="https://..."
              className="h-8 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Color fondo</Label>
              <Input
                type="color"
                value={block.backgroundColor || '#2563eb'}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className="h-8 w-full"
              />
            </div>
            <div>
              <Label className="text-xs">Color texto</Label>
              <Input
                type="color"
                value={block.textColor || '#ffffff'}
                onChange={(e) => onUpdate({ textColor: e.target.value })}
                className="h-8 w-full"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Ancho completo</Label>
            <Switch
              checked={block.fullWidth || false}
              onCheckedChange={(checked) => onUpdate({ fullWidth: checked })}
            />
          </div>
        </div>
      );
    
    case 'divider':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Estilo</Label>
            <Select
              value={block.style}
              onValueChange={(v) => onUpdate({ style: v as 'solid' | 'dashed' | 'dotted' })}
            >
              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Sólido</SelectItem>
                <SelectItem value="dashed">Discontinuo</SelectItem>
                <SelectItem value="dotted">Punteado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Color</Label>
            <Input
              type="color"
              value={block.color || '#e2e8f0'}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="h-8 w-full"
            />
          </div>
        </div>
      );
    
    case 'spacer':
      return (
        <div>
          <Label className="text-xs">Altura (px)</Label>
          <Input
            type="number"
            value={block.height}
            onChange={(e) => onUpdate({ height: parseInt(e.target.value) || 20 })}
            min={10}
            max={100}
            className="h-8 text-sm"
          />
        </div>
      );
    
    case 'card':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Título</Label>
            <Input
              value={block.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Contenido</Label>
            <Textarea
              value={block.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="text-sm min-h-[60px]"
            />
          </div>
          <div>
            <Label className="text-xs">CTA Text</Label>
            <Input
              value={block.ctaText || ''}
              onChange={(e) => onUpdate({ ctaText: e.target.value })}
              placeholder="Ver más →"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">CTA URL</Label>
            <Input
              value={block.ctaUrl || ''}
              onChange={(e) => onUpdate({ ctaUrl: e.target.value })}
              placeholder="https://..."
              className="h-8 text-sm"
            />
          </div>
        </div>
      );
    
    case 'footer':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Contenido (HTML)</Label>
            <Textarea
              value={block.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="text-sm min-h-[80px] font-mono text-xs"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Incluir link de baja</Label>
            <Switch
              checked={block.includeUnsubscribe || false}
              onCheckedChange={(checked) => onUpdate({ includeUnsubscribe: checked })}
            />
          </div>
        </div>
      );
    
    default:
      return <p className="text-xs text-muted-foreground">Sin opciones de edición</p>;
  }
}

export function EmailEditor() {
  const { 
    currentEmail, 
    updateEmail, 
    updateBlock, 
    removeBlock, 
    moveBlock,
    addBlock,
  } = useApp();
  
  if (!currentEmail) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Selecciona o crea un email para editar
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Email metadata */}
      <div className="space-y-3">
        <div>
          <Label className="text-xs">Asunto</Label>
          <Input
            value={currentEmail.subject || ''}
            onChange={(e) => updateEmail({ ...currentEmail, subject: e.target.value })}
            placeholder="Asunto del email..."
            className="h-9"
          />
        </div>
        <div>
          <Label className="text-xs">Preheader</Label>
          <Input
            value={currentEmail.preheader || ''}
            onChange={(e) => updateEmail({ ...currentEmail, preheader: e.target.value })}
            placeholder="Texto de preview en inbox..."
            className="h-9"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {(currentEmail.preheader?.length || 0)}/100 caracteres
          </p>
        </div>
      </div>
      
      {/* Add block buttons */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Agregar bloque</Label>
        <div className="flex flex-wrap gap-1.5">
          {BLOCK_TYPES.map(({ type, label, icon }) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => addBlock(createDefaultBlock(type))}
              className="h-7 text-xs gap-1"
            >
              {icon}
              {label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Blocks list */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">
          Bloques ({currentEmail.blocks.length})
        </Label>
        
        {currentEmail.blocks.length === 0 && (
          <div className="p-4 border border-dashed border-border rounded-lg text-center text-sm text-muted-foreground">
            <Plus className="w-5 h-5 mx-auto mb-2 opacity-50" />
            Agrega bloques para construir tu email
          </div>
        )}
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
          {currentEmail.blocks.map((block, index) => {
            const blockType = BLOCK_TYPES.find(t => t.type === block.type);
            
            return (
              <div
                key={block.id}
                className="panel animate-fade-in"
              >
                <div className="panel-header py-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  {blockType?.icon}
                  <span className="flex-1 truncate">{blockType?.label || block.type}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveBlock(block.id, 'up')}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveBlock(block.id, 'down')}
                      disabled={index === currentEmail.blocks.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBlock(block.id)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <BlockEditor
                    block={block}
                    onUpdate={(updates) => updateBlock(block.id, updates)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
