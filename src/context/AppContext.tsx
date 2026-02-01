import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { BrandKit, EmailDoc, EmailBlock } from '@/types';
import { 
  loadBrandKits, 
  saveBrandKit, 
  deleteBrandKit as deleteKitFromStorage,
  loadEmailDrafts,
  saveEmailDraft,
  deleteEmailDraft as deleteDraftFromStorage,
  getCurrentBrandKitId,
  setCurrentBrandKitId,
  createNewEmail,
} from '@/core/storage';
import { templates, cloneTemplateBlocks } from '@/core/templates';
import { generateId } from '@/core/brandParser';

interface AppContextType {
  // Brand Kits
  brandKits: BrandKit[];
  currentBrandKit: BrandKit | null;
  setCurrentBrandKit: (kit: BrandKit | null) => void;
  addBrandKit: (kit: BrandKit) => void;
  updateBrandKit: (kit: BrandKit) => void;
  deleteBrandKit: (id: string) => void;
  
  // Email Documents
  emailDrafts: EmailDoc[];
  currentEmail: EmailDoc | null;
  setCurrentEmail: (doc: EmailDoc | null) => void;
  createEmail: (name: string, templateId?: string) => EmailDoc;
  updateEmail: (doc: EmailDoc) => void;
  deleteEmail: (id: string) => void;
  
  // Email blocks
  addBlock: (block: EmailBlock) => void;
  updateBlock: (blockId: string, updates: Partial<EmailBlock>) => void;
  removeBlock: (blockId: string) => void;
  moveBlock: (blockId: string, direction: 'up' | 'down') => void;
  
  // UI State
  previewMode: 'desktop' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  darkModePreview: boolean;
  setDarkModePreview: (enabled: boolean) => void;
  sidebarTab: 'brand' | 'content' | 'templates' | 'export';
  setSidebarTab: (tab: 'brand' | 'content' | 'templates' | 'export') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Brand Kits state
  const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
  const [currentBrandKit, setCurrentBrandKitState] = useState<BrandKit | null>(null);
  
  // Email Drafts state
  const [emailDrafts, setEmailDrafts] = useState<EmailDoc[]>([]);
  const [currentEmail, setCurrentEmailState] = useState<EmailDoc | null>(null);
  
  // UI State
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [darkModePreview, setDarkModePreview] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'brand' | 'content' | 'templates' | 'export'>('content');
  
  // Load initial data
  useEffect(() => {
    const kits = loadBrandKits();
    setBrandKits(kits);
    
    const currentKitId = getCurrentBrandKitId();
    if (currentKitId) {
      const kit = kits.find(k => k.id === currentKitId);
      if (kit) setCurrentBrandKitState(kit);
    } else if (kits.length > 0) {
      setCurrentBrandKitState(kits[0]);
      setCurrentBrandKitId(kits[0].id);
    }
    
    const drafts = loadEmailDrafts();
    setEmailDrafts(drafts);
    
    // Create default email if none exists
    if (drafts.length === 0 && kits.length > 0) {
      const template = templates[0];
      const newEmail = createNewEmail('Mi Primer Email', kits[0].id, template.id);
      newEmail.blocks = cloneTemplateBlocks(template.blocks);
      newEmail.subject = template.defaultSubject || '';
      newEmail.preheader = template.defaultPreheader || '';
      saveEmailDraft(newEmail);
      setEmailDrafts([newEmail]);
      setCurrentEmailState(newEmail);
    } else if (drafts.length > 0) {
      setCurrentEmailState(drafts[0]);
    }
  }, []);
  
  // Brand Kit functions
  const setCurrentBrandKit = useCallback((kit: BrandKit | null) => {
    setCurrentBrandKitState(kit);
    if (kit) {
      setCurrentBrandKitId(kit.id);
    }
  }, []);
  
  const addBrandKit = useCallback((kit: BrandKit) => {
    saveBrandKit(kit);
    setBrandKits(prev => [...prev, kit]);
  }, []);
  
  const updateBrandKit = useCallback((kit: BrandKit) => {
    saveBrandKit(kit);
    setBrandKits(prev => prev.map(k => k.id === kit.id ? kit : k));
    if (currentBrandKit?.id === kit.id) {
      setCurrentBrandKitState(kit);
    }
  }, [currentBrandKit]);
  
  const deleteBrandKit = useCallback((id: string) => {
    deleteKitFromStorage(id);
    setBrandKits(prev => prev.filter(k => k.id !== id));
    if (currentBrandKit?.id === id) {
      const remaining = brandKits.filter(k => k.id !== id);
      setCurrentBrandKitState(remaining[0] || null);
    }
  }, [currentBrandKit, brandKits]);
  
  // Email functions
  const setCurrentEmail = useCallback((doc: EmailDoc | null) => {
    setCurrentEmailState(doc);
  }, []);
  
  const createEmail = useCallback((name: string, templateId?: string) => {
    const newEmail = createNewEmail(name, currentBrandKit?.id, templateId);
    
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        newEmail.blocks = cloneTemplateBlocks(template.blocks);
        newEmail.subject = template.defaultSubject || '';
        newEmail.preheader = template.defaultPreheader || '';
      }
    }
    
    saveEmailDraft(newEmail);
    setEmailDrafts(prev => [...prev, newEmail]);
    setCurrentEmailState(newEmail);
    return newEmail;
  }, [currentBrandKit]);
  
  const updateEmail = useCallback((doc: EmailDoc) => {
    saveEmailDraft(doc);
    setEmailDrafts(prev => prev.map(d => d.id === doc.id ? doc : d));
    if (currentEmail?.id === doc.id) {
      setCurrentEmailState(doc);
    }
  }, [currentEmail]);
  
  const deleteEmail = useCallback((id: string) => {
    deleteDraftFromStorage(id);
    setEmailDrafts(prev => prev.filter(d => d.id !== id));
    if (currentEmail?.id === id) {
      const remaining = emailDrafts.filter(d => d.id !== id);
      setCurrentEmailState(remaining[0] || null);
    }
  }, [currentEmail, emailDrafts]);
  
  // Block functions
  const addBlock = useCallback((block: EmailBlock) => {
    if (!currentEmail) return;
    const updated = {
      ...currentEmail,
      blocks: [...currentEmail.blocks, { ...block, id: generateId() }],
    };
    updateEmail(updated);
  }, [currentEmail, updateEmail]);
  
  const updateBlock = useCallback((blockId: string, updates: Partial<EmailBlock>) => {
    if (!currentEmail) return;
    const updated = {
      ...currentEmail,
      blocks: currentEmail.blocks.map(b => 
        b.id === blockId ? { ...b, ...updates } as EmailBlock : b
      ),
    };
    updateEmail(updated);
  }, [currentEmail, updateEmail]);
  
  const removeBlock = useCallback((blockId: string) => {
    if (!currentEmail) return;
    const updated = {
      ...currentEmail,
      blocks: currentEmail.blocks.filter(b => b.id !== blockId),
    };
    updateEmail(updated);
  }, [currentEmail, updateEmail]);
  
  const moveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    if (!currentEmail) return;
    const blocks = [...currentEmail.blocks];
    const index = blocks.findIndex(b => b.id === blockId);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    
    [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
    
    const updated = { ...currentEmail, blocks };
    updateEmail(updated);
  }, [currentEmail, updateEmail]);
  
  const value: AppContextType = {
    brandKits,
    currentBrandKit,
    setCurrentBrandKit,
    addBrandKit,
    updateBrandKit,
    deleteBrandKit,
    emailDrafts,
    currentEmail,
    setCurrentEmail,
    createEmail,
    updateEmail,
    deleteEmail,
    addBlock,
    updateBlock,
    removeBlock,
    moveBlock,
    previewMode,
    setPreviewMode,
    darkModePreview,
    setDarkModePreview,
    sidebarTab,
    setSidebarTab,
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
