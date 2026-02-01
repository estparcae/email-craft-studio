import { useApp } from '@/context/AppContext';
import { BrandKitEditor } from './BrandKitEditor';
import { EmailEditor } from './EmailEditor';
import { TemplateSelector } from './TemplateSelector';
import { ExportPanel } from './ExportPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Palette,
  FileEdit,
  LayoutTemplate,
  Download,
} from 'lucide-react';

export function Sidebar() {
  const { sidebarTab, setSidebarTab } = useApp();
  
  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <Tabs 
        value={sidebarTab} 
        onValueChange={(v) => setSidebarTab(v as typeof sidebarTab)}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid grid-cols-4 gap-1 p-1 m-2 bg-muted rounded-lg">
          <TabsTrigger value="brand" className="text-xs gap-1 data-[state=active]:bg-background">
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Marca</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="text-xs gap-1 data-[state=active]:bg-background">
            <FileEdit className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Editor</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-xs gap-1 data-[state=active]:bg-background">
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="text-xs gap-1 data-[state=active]:bg-background">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <TabsContent value="brand" className="m-0 p-4">
            <BrandKitEditor />
          </TabsContent>
          
          <TabsContent value="content" className="m-0 p-4">
            <EmailEditor />
          </TabsContent>
          
          <TabsContent value="templates" className="m-0 p-4">
            <TemplateSelector />
          </TabsContent>
          
          <TabsContent value="export" className="m-0 p-4">
            <ExportPanel />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
