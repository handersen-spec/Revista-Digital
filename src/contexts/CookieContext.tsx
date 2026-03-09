'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface CookieContextType {
  preferences: CookiePreferences;
  hasConsented: boolean;
  showBanner: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  updatePreferences: (prefs: Partial<CookiePreferences>) => void;
  hideBanner: () => void;
  resetConsent: () => void;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Sempre true, não pode ser desabilitado
  analytics: false,
  marketing: false,
  functional: false,
};

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const useCookies = () => {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookies must be used within a CookieProvider');
  }
  return context;
};

interface CookieProviderProps {
  children: ReactNode;
}

export const CookieProvider: React.FC<CookieProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [hasConsented, setHasConsented] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Carregar preferências do localStorage na inicialização
  useEffect(() => {
    const savedPreferences = localStorage.getItem('cookie-preferences');
    const savedConsent = localStorage.getItem('cookie-consent');
    
    if (savedPreferences && savedConsent) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        setPreferences(parsedPreferences);
        setHasConsented(true);
        setShowBanner(false);
      } catch (error) {
        console.error('Erro ao carregar preferências de cookies:', error);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  // Salvar preferências no localStorage
  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent', 'true');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
    setHasConsented(true);
    setShowBanner(false);
    
    // Disparar evento personalizado para componentes que precisam reagir
    window.dispatchEvent(new CustomEvent('cookiePreferencesUpdated', { 
      detail: allAccepted 
    }));
  };

  const rejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(onlyNecessary);
    savePreferences(onlyNecessary);
    setHasConsented(true);
    setShowBanner(false);
    
    window.dispatchEvent(new CustomEvent('cookiePreferencesUpdated', { 
      detail: onlyNecessary 
    }));
  };

  const updatePreferences = (prefs: Partial<CookiePreferences>) => {
    const newPreferences = { 
      ...preferences, 
      ...prefs,
      necessary: true // Sempre manter necessários como true
    };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
    setHasConsented(true);
    
    // Emitir evento para notificar outros componentes sobre a mudança
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookiePreferencesUpdated', { 
        detail: newPreferences 
      }));
    }
  };

  const hideBanner = () => {
    setShowBanner(false);
  };

  const resetConsent = () => {
    localStorage.removeItem('cookie-preferences');
    localStorage.removeItem('cookie-consent');
    localStorage.removeItem('cookie-consent-date');
    setPreferences(defaultPreferences);
    setHasConsented(false);
    setShowBanner(true);
  };

  const value: CookieContextType = {
    preferences,
    hasConsented,
    showBanner,
    acceptAll,
    rejectAll,
    updatePreferences,
    hideBanner,
    resetConsent,
  };

  return (
    <CookieContext.Provider value={value}>
      {children}
    </CookieContext.Provider>
  );
};

export default CookieProvider;