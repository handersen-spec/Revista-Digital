'use client';

import React, { useState, useEffect } from 'react';
import { useCookies } from '@/contexts/CookieContext';
import { X, Settings, Shield, BarChart3, Target, Wrench, Cookie, ChevronDown, ChevronUp } from 'lucide-react';

const CookieBanner: React.FC = () => {
  const { showBanner, acceptAll, rejectAll, updatePreferences, hideBanner, preferences } = useCookies();
  const [showDetails, setShowDetails] = useState(false);
  const [tempPreferences, setTempPreferences] = useState(preferences);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (showBanner) {
      // Pequeno delay para animação de entrada
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [showBanner]);

  if (!showBanner) return null;

  const handleSavePreferences = () => {
    updatePreferences(tempPreferences);
    setShowDetails(false);
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    acceptAll();
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => hideBanner(), 300);
  };

  const cookieCategories = [
    {
      id: 'necessary',
      name: 'Cookies Necessários',
      description: 'Essenciais para o funcionamento básico do site. Garantem funcionalidades como navegação segura e acesso a áreas protegidas.',
      details: 'Estes cookies são fundamentais para o funcionamento do site e não podem ser desabilitados. Incluem cookies de sessão, autenticação e preferências básicas.',
      icon: Shield,
      required: true,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      id: 'functional',
      name: 'Cookies Funcionais',
      description: 'Melhoram a funcionalidade e personalização do site, lembrando suas preferências e configurações.',
      details: 'Permitem funcionalidades aprimoradas como lembrar suas preferências de idioma, tema, configurações de acessibilidade e outras personalizações.',
      icon: Wrench,
      required: false,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      id: 'analytics',
      name: 'Cookies de Análise',
      description: 'Nos ajudam a entender como você usa o site para melhorar a experiência e o conteúdo.',
      details: 'Coletam informações sobre como os visitantes usam o site, quais páginas são mais visitadas e como navegam. Todos os dados são anônimos.',
      icon: BarChart3,
      required: false,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      id: 'marketing',
      name: 'Cookies de Marketing',
      description: 'Usados para exibir anúncios relevantes e medir a eficácia das campanhas publicitárias.',
      details: 'Permitem que mostremos anúncios mais relevantes para você e medimos a eficácia de nossas campanhas publicitárias em diferentes plataformas.',
      icon: Target,
      required: false,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ];

  return (
    <>
      {/* Backdrop com efeito glass */}
      <div 
        className={`fixed inset-0 z-50 transition-all duration-500 ease-out ${
          isVisible 
            ? 'backdrop-blur-md bg-black/20' 
            : 'backdrop-blur-0 bg-black/0 pointer-events-none'
        }`}
        onClick={handleClose}
      />
      
      {/* Banner Container */}
      <div className={`fixed inset-x-0 bottom-0 z-50 p-4 transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl">
            {/* Gradient decorativo */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-600"></div>
            
            {!showDetails ? (
              // Banner Principal
              <div className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Ícone e Título */}
                  <div className="flex items-center gap-4 lg:flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Cookie className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        🍪 Política de Cookies
                      </h3>
                      <p className="text-sm text-gray-500">
                        Personalize sua experiência
                      </p>
                    </div>
                  </div>
                  
                  {/* Conteúdo */}
                  <div className="flex-1 lg:px-6">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Utilizamos cookies para <span className="font-semibold text-red-600">melhorar sua experiência</span>, 
                      personalizar conteúdo e analisar nosso tráfego. Seus dados são tratados com total segurança e transparência.
                    </p>
                    
                    {/* Preview das categorias */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cookieCategories.map((category) => {
                        const Icon = category.icon;
                        const isEnabled = preferences[category.id as keyof typeof preferences];
                        return (
                          <div 
                            key={category.id}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                              category.required || isEnabled
                                ? `${category.bgColor} ${category.textColor} border border-current/20`
                                : 'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}
                          >
                            <Icon className="w-3 h-3" />
                            {category.name}
                            {category.required && <span className="text-xs">•</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Botões de Ação */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0 lg:w-auto">
                    <button
                      onClick={handleAcceptAll}
                      className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/30"
                    >
                      <span className="relative z-10">✨ Aceitar Todos</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    
                    <button
                      onClick={() => setShowDetails(true)}
                      className="group bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-red-300 hover:text-red-600 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500/20"
                    >
                      <span className="flex items-center gap-2">
                        <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                        Personalizar
                      </span>
                    </button>
                    
                    <button
                      onClick={handleRejectAll}
                      className="text-gray-500 hover:text-gray-700 px-4 py-3 rounded-xl font-medium transition-colors duration-300 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-500/20"
                    >
                      Apenas Necessários
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Configurações Detalhadas
              <div className="p-6 lg:p-8 max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Configurações de Cookies
                      </h3>
                      <p className="text-sm text-gray-500">
                        Escolha quais cookies você deseja permitir
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categorias de Cookies */}
                <div className="space-y-4 mb-8">
                  {cookieCategories.map((category) => {
                    const Icon = category.icon;
                    const isEnabled = tempPreferences[category.id as keyof typeof tempPreferences];
                    const isExpanded = expandedCategory === category.id;
                    
                    return (
                      <div key={category.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                        <div className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center shadow-sm`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-gray-900">
                                    {category.name}
                                  </h4>
                                  {category.required && (
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                      Obrigatório
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                  {category.description}
                                </p>
                                
                                {/* Botão para expandir detalhes */}
                                <button
                                  onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="w-4 h-4" />
                                      Menos detalhes
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-4 h-4" />
                                      Mais detalhes
                                    </>
                                  )}
                                </button>
                                
                                {/* Detalhes expandidos */}
                                {isExpanded && (
                                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                      {category.details}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Toggle Switch */}
                            <div className="ml-4">
                              {category.required ? (
                                <div className="flex items-center gap-2 text-emerald-600">
                                  <Shield className="w-4 h-4" />
                                  <span className="text-sm font-medium">Sempre ativo</span>
                                </div>
                              ) : (
                                <label className="relative inline-flex items-center cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    checked={isEnabled}
                                    onChange={(e) => {
                                      setTempPreferences(prev => ({
                                        ...prev,
                                        [category.id]: e.target.checked
                                      }));
                                    }}
                                    className="sr-only peer"
                                  />
                                  <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-blue-600 shadow-inner group-hover:shadow-lg transition-shadow"></div>
                                  <span className="ml-3 text-sm font-medium text-gray-700">
                                    {isEnabled ? 'Ativado' : 'Desativado'}
                                  </span>
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                  >
                    💾 Salvar Preferências
                  </button>
                  <button
                    onClick={() => {
                      setTempPreferences({
                        necessary: true,
                        analytics: true,
                        marketing: true,
                        functional: true,
                      });
                    }}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
                  >
                    ✨ Aceitar Todos
                  </button>
                  <button
                    onClick={() => {
                      setTempPreferences({
                        necessary: true,
                        analytics: false,
                        marketing: false,
                        functional: false,
                      });
                    }}
                    className="flex-1 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/20"
                  >
                    🛡️ Apenas Necessários
                  </button>
                </div>

                {/* Link para Política de Privacidade */}
                <div className="mt-6 text-center">
                  <a
                    href="/privacidade"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors group"
                  >
                    <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Leia nossa Política de Privacidade completa
                  </a>
                </div>
              </div>
            )}
            
            {/* Botão de fechar no canto */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieBanner;