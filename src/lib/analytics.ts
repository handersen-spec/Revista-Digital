// Configuração do Google Analytics para Auto Prestige Angola

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

// Verificar se o Analytics está habilitado
export const isAnalyticsEnabled = () => {
  return GA_MEASUREMENT_ID && typeof window !== 'undefined'
}

// Eventos customizados para o mercado angolano
export const AnalyticsEvents = {
  // Eventos de conteúdo
  ARTICLE_VIEW: 'article_view',
  ARTICLE_SHARE: 'article_share',
  VIDEO_PLAY: 'video_play',
  VIDEO_COMPLETE: 'video_complete',
  NEWS_VIEW: 'news_view',
  
  // Eventos de ferramentas
  CALCULATOR_IPTT: 'calculator_iptt_use',
  CALCULATOR_SEGURO: 'calculator_seguro_use',
  CALCULATOR_FINANCIAMENTO: 'calculator_financiamento_use',
  AVALIADOR_VEICULO: 'avaliador_veiculo_use',
  PLANEJADOR_MANUTENCAO: 'planejador_manutencao_use',
  SIMULADOR_TROCA: 'simulador_troca_use',
  CONVERSOR_MOEDA: 'conversor_moeda_use',
  
  // Eventos de concessionárias
  DEALERSHIP_VIEW: 'dealership_view',
  DEALERSHIP_CONTACT: 'dealership_contact',
  DEALERSHIP_WHATSAPP: 'dealership_whatsapp',
  DEALERSHIP_CALL: 'dealership_call',
  DEALERSHIP_EMAIL: 'dealership_email',
  
  // Eventos de engajamento
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  CHATBOT_OPEN: 'chatbot_open',
  CHATBOT_MESSAGE: 'chatbot_message',
  SEARCH_PERFORMED: 'search_performed',
  
  // Eventos de navegação
  PAGE_VIEW: 'page_view',
  EXTERNAL_LINK_CLICK: 'external_link_click',
  DOWNLOAD_START: 'download_start',
  
  // Eventos específicos para Angola
  PROVINCE_FILTER: 'province_filter_use',
  CURRENCY_CONVERSION: 'currency_conversion_aoa',
  LOCAL_DEALER_SEARCH: 'local_dealer_search',
} as const

// Categorias de eventos
export const AnalyticsCategories = {
  CONTENT: 'content',
  TOOLS: 'tools',
  DEALERSHIPS: 'dealerships',
  ENGAGEMENT: 'engagement',
  NAVIGATION: 'navigation',
  CONVERSION: 'conversion',
  USER_INTERACTION: 'user_interaction',
} as const

// Parâmetros customizados para Angola
export const AnalyticsParameters = {
  PROVINCE: 'province',
  VEHICLE_BRAND: 'vehicle_brand',
  VEHICLE_MODEL: 'vehicle_model',
  PRICE_RANGE: 'price_range',
  CURRENCY: 'currency',
  LANGUAGE: 'language',
  USER_TYPE: 'user_type',
} as const

// Função para rastrear eventos específicos do mercado angolano
export const trackAngolanEvent = (
  eventName: string,
  category: string,
  parameters?: Record<string, any>
) => {
  if (!isAnalyticsEnabled() || !window.gtag) return

  const defaultParameters = {
    country: 'Angola',
    currency: 'AOA',
    language: 'pt-AO',
    ...parameters,
  }

  window.gtag('event', eventName, {
    event_category: category,
    ...defaultParameters,
  })
}

// Rastrear visualizações de veículos por província
export const trackVehicleViewByProvince = (
  vehicleBrand: string,
  vehicleModel: string,
  province: string,
  priceRange?: string
) => {
  trackAngolanEvent(AnalyticsEvents.DEALERSHIP_VIEW, AnalyticsCategories.DEALERSHIPS, {
    [AnalyticsParameters.VEHICLE_BRAND]: vehicleBrand,
    [AnalyticsParameters.VEHICLE_MODEL]: vehicleModel,
    [AnalyticsParameters.PROVINCE]: province,
    [AnalyticsParameters.PRICE_RANGE]: priceRange,
  })
}

// Rastrear uso de calculadoras com valores em AOA
export const trackCalculatorUseAOA = (
  calculatorType: string,
  inputValue: number,
  resultValue: number
) => {
  trackAngolanEvent(calculatorType, AnalyticsCategories.TOOLS, {
    input_value_aoa: inputValue,
    result_value_aoa: resultValue,
    [AnalyticsParameters.CURRENCY]: 'AOA',
  })
}

// Rastrear conversões de moeda
export const trackCurrencyConversion = (
  fromCurrency: string,
  toCurrency: string,
  amount: number
) => {
  trackAngolanEvent(AnalyticsEvents.CURRENCY_CONVERSION, AnalyticsCategories.TOOLS, {
    from_currency: fromCurrency,
    to_currency: toCurrency,
    amount: amount,
  })
}

// Rastrear busca por concessionárias locais
export const trackLocalDealerSearch = (
  province: string,
  brand?: string,
  service?: string
) => {
  trackAngolanEvent(AnalyticsEvents.LOCAL_DEALER_SEARCH, AnalyticsCategories.DEALERSHIPS, {
    [AnalyticsParameters.PROVINCE]: province,
    [AnalyticsParameters.VEHICLE_BRAND]: brand,
    service_type: service,
  })
}

// Configuração de Enhanced Ecommerce para Angola
export const trackPurchaseAOA = (
  transactionId: string,
  value: number,
  items: Array<{
    item_id: string
    item_name: string
    category: string
    quantity: number
    price: number
  }>
) => {
  if (!isAnalyticsEnabled() || !window.gtag) return

  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: 'AOA',
    items: items.map(item => ({
      ...item,
      currency: 'AOA',
    })),
  })
}

// Rastrear performance de conteúdo
export const trackContentPerformance = (
  contentType: 'article' | 'video' | 'news',
  contentTitle: string,
  category: string,
  timeSpent?: number
) => {
  trackAngolanEvent(`${contentType}_engagement`, AnalyticsCategories.CONTENT, {
    content_title: contentTitle,
    content_category: category,
    time_spent_seconds: timeSpent,
  })
}
