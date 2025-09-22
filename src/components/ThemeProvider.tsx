import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'dark' | 'light';
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  actualTheme: 'light',
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'motel-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Primeiro tenta carregar do localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(storageKey) as Theme;
      return savedTheme || defaultTheme;
    }
    return defaultTheme;
  });

  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      if (root.classList.contains('dark')) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Função para aplicar o tema
  const applyTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    
    // Remove todas as classes de tema existentes
    root.classList.remove('light', 'dark');
    
    let finalTheme: 'dark' | 'light' = 'light';
    
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      finalTheme = prefersDark ? 'dark' : 'light';
    } else {
      finalTheme = newTheme;
    }
    
    // Aplica a nova classe
    root.classList.add(finalTheme);
    
    // Força um reflow para garantir que as mudanças sejam aplicadas
    root.offsetHeight;
    
    setActualTheme(finalTheme);
    
    console.log('Theme applied:', {
      requestedTheme: newTheme,
      finalTheme,
      classList: Array.from(root.classList),
      hasClass: root.classList.contains(finalTheme)
    });
  };

  // Effect para aplicar o tema inicial e mudanças subsequentes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Effect para escutar mudanças na preferência do sistema
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      console.log('System theme changed:', e.matches ? 'dark' : 'light');
      applyTheme('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Effect para aplicar tema na inicialização
  useEffect(() => {
    // Garante que o tema seja aplicado na primeira renderização
    applyTheme(theme);
  }, []);

  const handleSetTheme = (newTheme: Theme) => {
    console.log('Setting theme:', newTheme);
    localStorage.setItem(storageKey, newTheme);
    setTheme(newTheme);
  };

  const value = {
    theme,
    setTheme: handleSetTheme,
    actualTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};