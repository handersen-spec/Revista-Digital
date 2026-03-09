import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import {
  formatCurrency,
  formatDate,
  formatPhone,
  formatAddress,
  isValidAngolanPhone,
  convertToKwanza,
  formatLargeNumber,
  generateSlug,
  calculateReadingTime,
  cn
} from '../utils'

// Mock da configuração de Angola
jest.mock('../config', () => ({
  ANGOLA_CONFIG: {
    currency: {
      symbol: 'Kz'
    },
    country: {
      timezone: 'Africa/Luanda',
      phonePrefix: '+244'
    }
  }
}))

describe('Biblioteca de Utilitários', () => {
  describe('formatCurrency', () => {
    it('deve formatar valores monetários com símbolo', () => {
      expect(formatCurrency(1000)).toBe('1\u00A0000 Kz')
      expect(formatCurrency(1500.50)).toBe('1\u00A0500,5 Kz')
      expect(formatCurrency(1000000)).toBe('1\u00A0000\u00A0000 Kz')
    })

    it('deve formatar valores monetários sem símbolo', () => {
      expect(formatCurrency(1000, false)).toBe('1\u00A0000')
      expect(formatCurrency(1500.50, false)).toBe('1\u00A0500,5')
    })

    it('deve lidar com valores zero e negativos', () => {
      expect(formatCurrency(0)).toBe('0 Kz')
      expect(formatCurrency(-1000)).toBe('-1\u00A0000 Kz')
    })

    it('deve lidar com valores decimais', () => {
      expect(formatCurrency(1234.56)).toBe('1\u00A0234,56 Kz')
      expect(formatCurrency(999.99)).toBe('999,99 Kz')
    })
  })

  describe('formatDate', () => {
    const testDate = new Date('2024-03-15T14:30:00Z')

    it('deve formatar data sem horário', () => {
      const result = formatDate(testDate)
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    })

    it('deve formatar data com horário', () => {
      const result = formatDate(testDate, true)
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}.*\d{2}:\d{2}/)
    })

    it('deve lidar com datas diferentes', () => {
      const newYear = new Date('2024-01-01T00:00:00Z')
      const result = formatDate(newYear)
      expect(result).toMatch(/01\/01\/2024/)
    })
  })

  describe('formatPhone', () => {
    it('deve formatar números angolanos completos', () => {
      expect(formatPhone('244923456789')).toBe('+244 923 456 789')
      expect(formatPhone('244912345678')).toBe('+244 912 345 678')
    })

    it('deve adicionar código do país para números locais', () => {
      expect(formatPhone('923456789')).toBe('+244 923456789')
      expect(formatPhone('912345678')).toBe('+244 912345678')
    })

    it('deve remover caracteres não numéricos', () => {
      expect(formatPhone('+244 923 456 789')).toBe('+244 923 456 789')
      expect(formatPhone('(244) 923-456-789')).toBe('+244 923 456 789')
    })

    it('deve retornar original se não conseguir formatar', () => {
      expect(formatPhone('123')).toBe('+244 123')
      expect(formatPhone('')).toBe('+244 ')
    })
  })

  describe('formatAddress', () => {
    it('deve formatar endereço completo', () => {
      const address = {
        street: 'Rua da Independência, 123',
        city: 'Luanda',
        province: 'Luanda',
        country: 'Angola'
      }
      expect(formatAddress(address)).toBe('Rua da Independência, 123, Luanda, Angola')
    })

    it('deve omitir província se for igual à cidade', () => {
      const address = {
        street: 'Rua Principal',
        city: 'Luanda',
        province: 'Luanda'
      }
      expect(formatAddress(address)).toBe('Rua Principal, Luanda')
    })

    it('deve lidar com endereços parciais', () => {
      expect(formatAddress({ city: 'Benguela' })).toBe('Benguela')
      expect(formatAddress({ street: 'Rua A', city: 'Huambo' })).toBe('Rua A, Huambo')
    })

    it('deve lidar com endereço vazio', () => {
      expect(formatAddress({})).toBe('')
    })
  })

  describe('isValidAngolanPhone', () => {
    it('deve validar números angolanos completos', () => {
      expect(isValidAngolanPhone('244923456789')).toBe(true)
      expect(isValidAngolanPhone('244912345678')).toBe(true)
      expect(isValidAngolanPhone('+244 923 456 789')).toBe(true)
    })

    it('deve validar números locais', () => {
      expect(isValidAngolanPhone('923456789')).toBe(true)
      expect(isValidAngolanPhone('912345678')).toBe(true)
    })

    it('deve rejeitar números inválidos', () => {
      expect(isValidAngolanPhone('123456789')).toBe(false) // Não começa com 9
      expect(isValidAngolanPhone('9234567890')).toBe(false) // Muito longo
      expect(isValidAngolanPhone('92345678')).toBe(false) // Muito curto
      expect(isValidAngolanPhone('244823456789')).toBe(false) // Não começa com 9 após 244
    })

    it('deve lidar com formatação diferente', () => {
      expect(isValidAngolanPhone('(244) 923-456-789')).toBe(true)
      expect(isValidAngolanPhone('244.923.456.789')).toBe(true)
    })
  })

  describe('convertToKwanza', () => {
    it('deve converter USD para Kwanza', () => {
      expect(convertToKwanza(100, 'USD')).toBe(82500)
      expect(convertToKwanza(1, 'USD')).toBe(825)
    })

    it('deve converter EUR para Kwanza', () => {
      expect(convertToKwanza(100, 'EUR')).toBe(90000)
      expect(convertToKwanza(1, 'EUR')).toBe(900)
    })

    it('deve converter BRL para Kwanza', () => {
      expect(convertToKwanza(100, 'BRL')).toBe(16500)
      expect(convertToKwanza(1, 'BRL')).toBe(165)
    })

    it('deve converter ZAR para Kwanza', () => {
      expect(convertToKwanza(100, 'ZAR')).toBe(4500)
      expect(convertToKwanza(1, 'ZAR')).toBe(45)
    })

    it('deve ser case insensitive', () => {
      expect(convertToKwanza(100, 'usd')).toBe(82500)
      expect(convertToKwanza(100, 'eur')).toBe(90000)
    })

    it('deve retornar valor original para moeda desconhecida', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      
      expect(convertToKwanza(100, 'JPY')).toBe(100)
      expect(consoleSpy).toHaveBeenCalledWith('Taxa de câmbio não encontrada para JPY')
      
      consoleSpy.mockRestore()
    })
  })

  describe('formatLargeNumber', () => {
    it('deve formatar milhares', () => {
      expect(formatLargeNumber(1000)).toBe('1.0 mil')
      expect(formatLargeNumber(1500)).toBe('1.5 mil')
      expect(formatLargeNumber(999999)).toBe('1000.0 mil')
    })

    it('deve formatar milhões', () => {
      expect(formatLargeNumber(1000000)).toBe('1.0 milhões')
      expect(formatLargeNumber(2500000)).toBe('2.5 milhões')
      expect(formatLargeNumber(999999999)).toBe('1000.0 milhões')
    })

    it('deve formatar mil milhões', () => {
      expect(formatLargeNumber(1000000000)).toBe('1.0 mil milhões')
      expect(formatLargeNumber(2500000000)).toBe('2.5 mil milhões')
    })

    it('deve retornar números pequenos como string', () => {
      expect(formatLargeNumber(999)).toBe('999')
      expect(formatLargeNumber(500)).toBe('500')
      expect(formatLargeNumber(0)).toBe('0')
    })
  })

  describe('generateSlug', () => {
    it('deve gerar slug básico', () => {
      expect(generateSlug('Título do Artigo')).toBe('titulo-do-artigo')
      expect(generateSlug('Notícia Importante')).toBe('noticia-importante')
    })

    it('deve remover acentos', () => {
      expect(generateSlug('Ação de Graças')).toBe('acao-de-gracas')
      expect(generateSlug('Coração Português')).toBe('coracao-portugues')
    })

    it('deve remover caracteres especiais', () => {
      expect(generateSlug('Título com @#$% caracteres!')).toBe('titulo-com-caracteres')
      expect(generateSlug('100% Elétrico & Sustentável')).toBe('100-eletrico-sustentavel')
    })

    it('deve lidar com espaços múltiplos', () => {
      expect(generateSlug('Título   com    espaços')).toBe('titulo-com-espacos')
      expect(generateSlug('  Título com espaços  ')).toBe('titulo-com-espacos')
    })

    it('deve remover hífens duplicados', () => {
      expect(generateSlug('Título--com--hífens')).toBe('titulo-com-hifens')
    })

    it('deve lidar com strings vazias', () => {
      expect(generateSlug('')).toBe('')
      expect(generateSlug('   ')).toBe('')
    })
  })

  describe('calculateReadingTime', () => {
    it('deve calcular tempo de leitura padrão', () => {
      const text = 'Esta é uma frase de teste. '.repeat(50) // ~300 palavras (6 palavras x 50)
      expect(calculateReadingTime(text)).toBe('2 min de leitura')
    })

    it('deve calcular tempo para textos longos', () => {
      const text = 'palavra '.repeat(400) // 400 palavras
      expect(calculateReadingTime(text)).toBe('2 min de leitura')
    })

    it('deve usar velocidade personalizada', () => {
      const text = 'palavra '.repeat(100) // 100 palavras
      expect(calculateReadingTime(text, 100)).toBe('1 min de leitura') // 100 palavras/min
    })

    it('deve arredondar para cima', () => {
      const text = 'palavra '.repeat(250) // 250 palavras
      expect(calculateReadingTime(text, 200)).toBe('2 min de leitura') // 1.25 -> 2
    })

    it('deve lidar com textos vazios', () => {
      expect(calculateReadingTime('')).toBe('1 min de leitura')
      expect(calculateReadingTime('   ')).toBe('1 min de leitura')
    })

    it('deve lidar com uma palavra', () => {
      expect(calculateReadingTime('palavra')).toBe('1 min de leitura')
    })
  })

  describe('cn (className utility)', () => {
    it('deve combinar classes simples', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('deve lidar com condicionais', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
    })

    it('deve remover duplicatas com tailwind-merge', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2') // tailwind-merge deve manter apenas p-2
    })

    it('deve lidar com arrays', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
    })

    it('deve lidar com valores undefined/null', () => {
      expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2')
    })

    it('deve lidar com objetos condicionais', () => {
      expect(cn({
        'active': true,
        'disabled': false,
        'primary': true
      })).toBe('active primary')
    })
  })
})