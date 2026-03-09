'use client';

import React, { useState } from 'react';
import { useCookies } from '@/contexts/CookieContext';
import { Shield, BarChart3, Target, Wrench, Save, RotateCcw, Info } from 'lucide-react';

const CookiePreferences: React.FC = () => {
  const { preferences, updatePreferences, resetConsent, hasConsented } = useCookies();
  const [tempPreferences, setTempPreferences] = useState(preferences);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    updatePreferences(tempPreferences);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja redefinir todas as preferências de cookies? Isso irá mostrar o banner de cookies novamente.')) {
      resetConsent();
    }
  };

  const cookieCategories = [
    {
      id: 'necessary',
      name: 'Cookies Necessários',
      description: 'Estes cookies são essenciais para o funcionamento básico do website. Eles permitem funcionalidades como navegação segura e acesso a áreas protegidas. Não podem ser desabilitados.',
      icon: Shield,
      required: true,
      examples: ['Sessão de usuário', 'Preferências de idioma', 'Carrinho de compras', 'Autenticação'],
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'functional',
      name: 'Cookies Funcionais',
      description: 'Estes cookies permitem que o website lembre de escolhas que você fez e forneça funcionalidades aprimoradas e mais personalizadas.',
      icon: Wrench,
      required: false,
      examples: ['Preferências de layout', 'Configurações de acessibilidade', 'Localização geográfica', 'Histórico de navegação'],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'analytics',
      name: 'Cookies de Análise',
      description: 'Estes cookies nos ajudam a entender como os visitantes interagem com o website, coletando e relatando informações anonimamente.',
      icon: BarChart3,
      required: false,
      examples: ['Google Analytics', 'Tempo de permanência', 'Páginas mais visitadas', 'Taxa de rejeição'],
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'marketing',
      name: 'Cookies de Marketing',
      description: 'Estes cookies são usados para rastrear visitantes em websites. A intenção é exibir anúncios relevantes e envolventes para o usuário individual.',
      icon: Target,
      required: false,
      examples: ['Google Ads', 'Facebook Pixel', 'Remarketing', 'Campanhas publicitárias'],
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  if (!hasConsented) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <Info className="h-6 w-6 text-yellow-600" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800">
              Consentimento de Cookies Necessário
            </h3>
            <p className="text-yellow-700 mt-1">
              Você precisa aceitar ou configurar suas preferências de cookies antes de poder gerenciá-las aqui.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Preferências de Cookies</h2>
            <p className="text-gray-600 mt-1">
              Gerencie suas preferências de cookies e controle quais dados são coletados.
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Redefinir</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Salvar</span>
            </button>
          </div>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-green-800 font-medium">
                Preferências salvas com sucesso!
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {cookieCategories.map((category) => {
            const Icon = category.icon;
            const isEnabled = tempPreferences[category.id as keyof typeof tempPreferences];
            
            return (
              <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className={`${category.bgColor} p-4`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Icon className={`h-6 w-6 ${category.color} mt-0.5`} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {category.name}
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      {category.required ? (
                        <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                          Obrigatório
                        </div>
                      ) : (
                        <label className="relative inline-flex items-center cursor-pointer">
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
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Exemplos de uso:</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.examples.map((example) => (
                      <span
                        key={typeof example === 'string' ? example : JSON.stringify(example)}
                        className="inline-block bg-white text-gray-700 text-xs px-2 py-1 rounded border"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Informações Importantes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Suas preferências são salvas localmente no seu navegador</li>
            <li>• Você pode alterar essas configurações a qualquer momento</li>
            <li>• Cookies necessários não podem ser desabilitados</li>
            <li>• Algumas funcionalidades podem não funcionar corretamente se você desabilitar certos cookies</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CookiePreferences;