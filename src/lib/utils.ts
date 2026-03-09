import { ANGOLA_CONFIG } from './config';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utilitários para formatação específica de Angola

/**
 * Formata valores monetários para o padrão angolano (Kwanza)
 * @param amount - Valor a ser formatado
 * @param showSymbol - Se deve mostrar o símbolo da moeda
 * @returns String formatada (ex: "1.000 Kz" ou "1.000")
 */
export function formatCurrency(amount: number, showSymbol: boolean = true): string {
  // Formatar número com separadores angolanos
  const formatted = new Intl.NumberFormat('pt-AO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return showSymbol ? `${formatted} ${ANGOLA_CONFIG.currency.symbol}` : formatted;
}

/**
 * Formata datas para o padrão angolano
 * @param date - Data a ser formatada
 * @param includeTime - Se deve incluir horário
 * @returns String formatada (ex: "15/03/2024" ou "15/03/2024 14:30")
 */
export function formatDate(date: Date, includeTime: boolean = false): string {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: ANGOLA_CONFIG.country.timezone,
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return new Intl.DateTimeFormat('pt-AO', options).format(date);
}

/**
 * Formata números de telefone para o padrão angolano
 * @param phone - Número de telefone
 * @returns String formatada (ex: "+244 923 456 789")
 */
export function formatPhone(phone: string): string {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Se não começar com 244, adiciona o código do país
  if (!cleaned.startsWith('244')) {
    return `${ANGOLA_CONFIG.country.phonePrefix} ${cleaned}`;
  }
  
  // Formatar número angolano: +244 9XX XXX XXX
  const formatted = cleaned.replace(/^244(\d{3})(\d{3})(\d{3})$/, '+244 $1 $2 $3');
  return formatted || phone; // Retorna original se não conseguir formatar
}

/**
 * Formata endereços para o padrão angolano
 * @param address - Objeto com dados do endereço
 * @returns String formatada
 */
export function formatAddress(address: {
  street?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
}): string {
  const parts = [];
  
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.province && address.province !== address.city) parts.push(address.province);
  if (address.country) parts.push(address.country);
  
  return parts.join(', ');
}

/**
 * Valida se um número de telefone é válido para Angola
 * @param phone - Número de telefone
 * @returns Boolean indicando se é válido
 */
export function isValidAngolanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  
  // Números angolanos têm 9 dígitos após o código do país (244)
  // Formato: +244 9XX XXX XXX
  const angolanPhoneRegex = /^244[9][0-9]{8}$/;
  const localPhoneRegex = /^[9][0-9]{8}$/;
  
  return angolanPhoneRegex.test(cleaned) || localPhoneRegex.test(cleaned);
}

/**
 * Converte valores de outras moedas para Kwanza (simulado)
 * @param amount - Valor a ser convertido
 * @param fromCurrency - Moeda de origem
 * @returns Valor convertido em Kwanza
 */
export function convertToKwanza(amount: number, fromCurrency: string): number {
  // Taxas de câmbio simuladas (em produção, usar API real)
  const exchangeRates: Record<string, number> = {
    'USD': 825, // 1 USD = 825 AOA (aproximado)
    'EUR': 900, // 1 EUR = 900 AOA (aproximado)
    'BRL': 165, // 1 BRL = 165 AOA (aproximado)
    'ZAR': 45,  // 1 ZAR = 45 AOA (aproximado)
  };

  const rate = exchangeRates[fromCurrency.toUpperCase()];
  if (!rate) {
    console.warn(`Taxa de câmbio não encontrada para ${fromCurrency}`);
    return amount;
  }

  return amount * rate;
}

/**
 * Formata números grandes com abreviações em português
 * @param num - Número a ser formatado
 * @returns String formatada (ex: "1,2 mil", "3,5 milhões")
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)} mil milhões`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)} milhões`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)} mil`;
  }
  return num.toString();
}

/**
 * Gera slug para URLs a partir de texto em português
 * @param text - Texto a ser convertido
 * @returns Slug formatado
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-'); // Remove hífens duplicados
}

/**
 * Calcula tempo de leitura estimado em português
 * @param text - Texto a ser analisado
 * @param wordsPerMinute - Palavras por minuto (padrão: 200)
 * @returns String com tempo estimado
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min de leitura`;
}

// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}