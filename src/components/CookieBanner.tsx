'use client';

import React, { useState, useEffect } from 'react';
import { useCookies } from '@/contexts/CookieContext';
import { X, Settings, Shield, BarChart3, Target, Wrench, Cookie, Check } from 'lucide-react';

const CookieBanner: React.FC = () => {
  const { showBanner, acceptAll, rejectAll, updatePreferences, hideBanner, preferences } = useCookies();
  const [showDetails, setShowDetails] = useState(false);
  const [tempPreferences, setTempPreferences] = useState(preferences);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [showBanner]);

  // Atualiza as preferências temporárias quando as preferências reais mudam ou quando abre o modal
  useEffect(() => {
    setTempPreferences(preferences);
  }, [preferences, showDetails]);

  if (!showBanner) return null;

  const handleSavePreferences = () => {
    updatePreferences(tempPreferences);
    setShowDetails(false);
    setIsVisible(false);
    // Pequeno delay para permitir animação de saída antes de desmontar se necessário
    setTimeout(() => hideBanner(), 300);
  };

  const handleAcceptAll = () => {
    acceptAll();
    setIsVisible(false);
    setTimeout(() => hideBanner(), 300);
  };

  const handleRejectAll = () => {
    rejectAll();
    setIsVisible(false);
    setTimeout(() => hideBanner(), 300);
  };

  const cookieCategories = [
    {
      id: 'necessary',
      name: 'Necessários',
      description: 'Essenciais para o funcionamento do site.',
      icon: Shield,
      required: true,
    },
    {
      id: 'functional',
      name: 'Funcionais',
      description: 'Preferências e personalização.',
      icon: Wrench,
      required: false,
    },
    {
      id: 'analytics',
      name: 'Análise',
      description: 'Estatísticas de uso anônimas.',
      icon: BarChart3,
      required: false,
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Anúncios relevantes.',
      icon: Target,
      required: false,
    },
  ];

  return (
    <>
      {/* Banner Compacto (Barra Inferior) */}
      {!showDetails && (
        <div className={`fixed inset-x-0 bottom-0 z-50 p-4 transition-all duration-500 ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-4 md:gap-6">
            
            {/* Ícone e Texto */}
            <div className="flex items-start gap-4 flex-1">
              <div className="hidden sm:flex flex-shrink-0 w-10 h-10 bg-red-100 text-red-600 rounded-full items-center justify-center">
                <Cookie className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Usamos cookies para melhorar sua experiência e analisar nosso tráfego. 
                  <button 
                    onClick={() => setShowDetails(true)}
                    className="ml-1 text-red-600 hover:text-red-700 font-medium underline decoration-red-200 underline-offset-2 hover:decoration-red-500 transition-all"
                  >
                    Personalizar preferências
                  </button>
                </p>
              </div>
            </div>

            {/* Botões Compactos */}
            <div className="flex flex-row gap-2 w-full md:w-auto">
              <button
                onClick={handleRejectAll}
                className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
              >
                Recusar
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 md:flex-none px-6 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                Aceitar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Personalização (Sobreposição) */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">Preferências de Cookies</h3>
              </div>
              <button 
                onClick={() => setShowDetails(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lista de Categorias (Scrollável) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                Gerencie suas preferências de privacidade abaixo. Cookies necessários são essenciais para o site funcionar.
              </p>

              {cookieCategories.map((category) => {
                const Icon = category.icon;
                const isEnabled = tempPreferences[category.id as keyof typeof tempPreferences];
                
                return (
                  <div key={category.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className={`mt-1 p-2 rounded-lg ${isEnabled ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{category.name}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isEnabled}
                            disabled={category.required}
                            onChange={(e) => {
                              if (!category.required) {
                                setTempPreferences(prev => ({
                                  ...prev,
                                  [category.id]: e.target.checked
                                }));
                              }
                            }}
                          />
                          <div className={`w-11 h-6 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-100 transition-colors ${
                            category.required 
                              ? 'bg-red-200 cursor-not-allowed' 
                              : 'bg-gray-200 peer-checked:bg-red-600'
                          }`}></div>
                          <div className={`absolute top-0.5 left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-all peer-checked:translate-x-full peer-checked:border-white ${
                            category.required ? 'translate-x-full' : ''
                          }`}></div>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">{category.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer do Modal (Ações) */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-6 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Salvar Preferências
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
