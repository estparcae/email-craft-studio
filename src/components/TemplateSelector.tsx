"use client";

import { useApp } from '@/context/AppContext';
import { templates, cloneTemplateBlocks } from '@/core/templates';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Megaphone, 
  Calendar, 
  Check,
  Plus,
} from 'lucide-react';

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  newsletter: <FileText className="w-5 h-5" />,
  announcement: <Megaphone className="w-5 h-5" />,
  event: <Calendar className="w-5 h-5" />,
};

export function TemplateSelector() {
  const { currentEmail, updateEmail, createEmail } = useApp();
  
  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    if (currentEmail) {
      // Replace current email blocks
      updateEmail({
        ...currentEmail,
        blocks: cloneTemplateBlocks(template.blocks),
        templateId,
        subject: template.defaultSubject || currentEmail.subject,
        preheader: template.defaultPreheader || currentEmail.preheader,
      });
    } else {
      // Create new email with template
      createEmail('Nuevo Email', templateId);
    }
  };
  
  const handleCreateBlank = () => {
    if (currentEmail) {
      updateEmail({
        ...currentEmail,
        blocks: [],
        templateId: undefined,
      });
    } else {
      createEmail('Email en Blanco');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Plantillas Base</h3>
        <p className="text-xs text-muted-foreground">
          Selecciona una plantilla para empezar o crea un email en blanco.
        </p>
      </div>
      
      {/* Blank option */}
      <button
        onClick={handleCreateBlank}
        className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-colors text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10">
            <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Email en Blanco</p>
            <p className="text-xs text-muted-foreground">Comienza desde cero</p>
          </div>
        </div>
      </button>
      
      {/* Templates */}
      <div className="space-y-3">
        {templates.map((template) => {
          const isSelected = currentEmail?.templateId === template.id;
          
          return (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              className={`w-full p-4 border rounded-lg text-left transition-all ${
                isSelected 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {TEMPLATE_ICONS[template.id] || <FileText className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{template.name}</p>
                    {isSelected && (
                      <span className="badge-success">
                        <Check className="w-3 h-3" />
                        Activo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {template.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {template.blocks.length} bloques
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Template info */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Tip:</strong> Las plantillas se adaptan automáticamente 
          a los colores de tu Brand Kit activo.
        </p>
      </div>
    </div>
  );
}
