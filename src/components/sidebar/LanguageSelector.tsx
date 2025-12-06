'use client';

import { useState, useMemo } from 'react';
import { Language, languages } from '@/lib/languages';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  selectedLanguage: Language | null;
  onLanguageSelect: (language: Language) => void;
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageSelect,
}: LanguageSelectorProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredLanguages = useMemo(() => {
    if (!search) return languages;
    const searchLower = search.toLowerCase();
    return languages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(searchLower) ||
        lang.code.toLowerCase().includes(searchLower)
    );
  }, [search]);

  return (
    <div className="relative">
      {/* Selected Language / Search Input */}
      <div
        className={cn(
          'flex items-center gap-2 border-2 rounded-lg p-3 cursor-pointer transition-colors',
          isOpen ? 'border-primary' : 'border-border hover:border-primary/50'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedLanguage ? (
          <>
            <span className="text-xl">{selectedLanguage.flag}</span>
            <span className="text-sm font-medium flex-1">{selectedLanguage.name}</span>
            <span className="text-xs text-muted-foreground">▼</span>
          </>
        ) : (
          <>
            <span className="text-xl">🌐</span>
            <span className="text-sm text-muted-foreground flex-1">Select language...</span>
            <span className="text-xs text-muted-foreground">▼</span>
          </>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-border">
            <Input
              placeholder="Search languages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
              autoFocus
            />
          </div>

          {/* Language List */}
          <ScrollArea className="h-48">
            <div className="p-1">
              {filteredLanguages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No languages found
                </p>
              ) : (
                filteredLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      onLanguageSelect(language);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors',
                      selectedLanguage?.code === language.code
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted'
                    )}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-sm">{language.name}</span>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setSearch('');
          }}
        />
      )}
    </div>
  );
}

