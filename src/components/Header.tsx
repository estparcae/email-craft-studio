"use client";

import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mail,
  Plus,
  Trash2,
  Sun,
  Moon,
} from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { 
    emailDrafts, 
    currentEmail, 
    setCurrentEmail, 
    createEmail,
    deleteEmail,
    currentBrandKit,
  } = useApp();
  
  const [isDark, setIsDark] = useState(false);
  
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };
  
  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Mail className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-none">Email HTML Generator</h1>
            <p className="text-xs text-muted-foreground">
              {currentBrandKit?.name || 'Sin marca'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Email selector */}
        <Select
          value={currentEmail?.id || ''}
          onValueChange={(id) => {
            const email = emailDrafts.find(e => e.id === id);
            if (email) setCurrentEmail(email);
          }}
        >
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Selecciona email" />
          </SelectTrigger>
          <SelectContent>
            {emailDrafts.map(email => (
              <SelectItem key={email.id} value={email.id}>
                {email.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* New email button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => createEmail(`Email ${emailDrafts.length + 1}`)}
          className="h-9"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nuevo
        </Button>
        
        {/* Delete current email */}
        {emailDrafts.length > 1 && currentEmail && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteEmail(currentEmail.id)}
            className="h-9 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
        
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="h-9 w-9 p-0"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </header>
  );
}
