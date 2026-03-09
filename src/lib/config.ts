// Configurações específicas para Angola
export const ANGOLA_CONFIG = {
  // Informações do país
  country: {
    name: 'Angola',
    code: 'AO',
    phonePrefix: '+244',
    timezone: 'Africa/Luanda',
  },

  // Configurações de moeda
  currency: {
    code: 'AOA',
    symbol: 'Kz',
    name: 'Kwanza Angolano',
    position: 'after', // Símbolo após o valor (ex: 1000 Kz)
  },

  // Configurações de idioma
  locale: {
    primary: 'pt-AO',
    fallback: 'pt',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: ',',
      thousands: '.',
    },
  },

  // Informações da empresa
  company: {
    name: 'Auto Prestige Angola',
    fullName: 'Auto Prestige - Revista Digital Automotiva de Angola',
    domain: 'autoprestige.ao',
    email: 'contato@autoprestige.ao',
    phone: '+244 923 456 789',
    address: {
      street: 'Rua Rainha Ginga, 123',
      city: 'Luanda',
      province: 'Luanda',
      country: 'Angola',
      postalCode: '1000',
    },
  },

  // Configurações regionais
  regions: {
    provinces: [
      'Luanda',
      'Benguela',
      'Huíla',
      'Namibe',
      'Cabinda',
      'Zaire',
      'Uíge',
      'Malanje',
      'Lunda Norte',
      'Lunda Sul',
      'Moxico',
      'Cuando Cubango',
      'Cunene',
      'Huambo',
      'Bié',
      'Cuanza Norte',
      'Cuanza Sul',
      'Bengo',
    ],
    mainCities: [
      'Luanda',
      'Huambo',
      'Lobito',
      'Benguela',
      'Kuito',
      'Lubango',
      'Malanje',
      'Namibe',
      'Soyo',
      'Cabinda',
    ],
  },

  // Configurações de SEO
  seo: {
    defaultTitle: 'Auto Prestige - Revista Digital Automotiva de Angola',
    defaultDescription: 'A revista digital automotiva líder de Angola, trazendo as últimas novidades, análises e tendências do mercado automobilístico angolano e internacional.',
    keywords: [
      'angola',
      'automóveis',
      'carros',
      'revista digital',
      'mercado automobilístico',
      'luanda',
      'kwanza',
      'concessionárias angola',
      'notícias automotivas',
      'test drives',
    ],
  },
};

// Funções utilitárias para formatação
export const formatCurrency = (amount: number): string => {
  const formatted = new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: ANGOLA_CONFIG.currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  
  // Ajustar para o formato angolano (valor + símbolo)
  return formatted.replace('AOA', 'Kz').replace(/\s/g, ' ');
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: ANGOLA_CONFIG.country.timezone,
  }).format(date);
};

export const formatPhone = (phone: string): string => {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Se não começar com 244, adiciona o código do país
  if (!cleaned.startsWith('244')) {
    return `+244 ${cleaned}`;
  }
  
  // Formatar número angolano: +244 9XX XXX XXX
  const formatted = cleaned.replace(/^244(\d{3})(\d{3})(\d{3})$/, '+244 $1 $2 $3');
  return formatted;
};
