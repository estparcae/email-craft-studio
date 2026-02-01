// ============================================
// STORAGE - LocalStorage persistence
// ============================================

import { BrandKit, EmailDoc, DEFAULT_BRAND_KIT } from '@/types';
import { generateId } from './brandParser';

const STORAGE_KEYS = {
  BRAND_KITS: 'email-gen-brand-kits',
  EMAIL_DRAFTS: 'email-gen-drafts',
  CURRENT_BRAND_KIT: 'email-gen-current-brand-kit',
  CURRENT_EMAIL: 'email-gen-current-email',
  APP_STATE: 'email-gen-app-state',
};

// Brand Kits
export function saveBrandKits(kits: BrandKit[]): void {
  localStorage.setItem(STORAGE_KEYS.BRAND_KITS, JSON.stringify(kits));
}

export function loadBrandKits(): BrandKit[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BRAND_KITS);
    if (!data) {
      // Initialize with default
      const defaultKits = [{ ...DEFAULT_BRAND_KIT, id: 'default', name: 'Mi Primera Marca' }];
      saveBrandKits(defaultKits);
      return defaultKits;
    }
    return JSON.parse(data);
  } catch {
    return [{ ...DEFAULT_BRAND_KIT, id: 'default', name: 'Mi Primera Marca' }];
  }
}

export function saveBrandKit(kit: BrandKit): void {
  const kits = loadBrandKits();
  const index = kits.findIndex(k => k.id === kit.id);
  
  kit.updatedAt = new Date().toISOString();
  
  if (index >= 0) {
    kits[index] = kit;
  } else {
    kits.push(kit);
  }
  
  saveBrandKits(kits);
}

export function deleteBrandKit(id: string): void {
  const kits = loadBrandKits().filter(k => k.id !== id);
  saveBrandKits(kits);
}

export function getBrandKitById(id: string): BrandKit | undefined {
  return loadBrandKits().find(k => k.id === id);
}

// Email Drafts
export function saveEmailDrafts(drafts: EmailDoc[]): void {
  localStorage.setItem(STORAGE_KEYS.EMAIL_DRAFTS, JSON.stringify(drafts));
}

export function loadEmailDrafts(): EmailDoc[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EMAIL_DRAFTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveEmailDraft(draft: EmailDoc): void {
  const drafts = loadEmailDrafts();
  const index = drafts.findIndex(d => d.id === draft.id);
  
  draft.updatedAt = new Date().toISOString();
  
  if (index >= 0) {
    drafts[index] = draft;
  } else {
    drafts.push(draft);
  }
  
  saveEmailDrafts(drafts);
}

export function deleteEmailDraft(id: string): void {
  const drafts = loadEmailDrafts().filter(d => d.id !== id);
  saveEmailDrafts(drafts);
}

export function getEmailDraftById(id: string): EmailDoc | undefined {
  return loadEmailDrafts().find(d => d.id === id);
}

// Current selections
export function setCurrentBrandKitId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_BRAND_KIT, id);
}

export function getCurrentBrandKitId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_BRAND_KIT);
}

export function setCurrentEmailId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_EMAIL, id);
}

export function getCurrentEmailId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_EMAIL);
}

// Create new email document
export function createNewEmail(name: string, brandKitId?: string, templateId?: string): EmailDoc {
  return {
    id: generateId(),
    name,
    subject: '',
    preheader: '',
    blocks: [],
    brandKitId,
    theme: 'light',
    templateId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
