import { renderHook } from '@testing-library/react'
import { useGoogleAnalytics } from '@/components/GoogleAnalytics'

describe('useGoogleAnalytics', () => {
  it('deve inicializar corretamente', () => {
    const { result } = renderHook(() => useGoogleAnalytics())
    
    expect(result.current).toHaveProperty('trackPageView')
    expect(result.current).toHaveProperty('trackEvent')
    expect(result.current).toHaveProperty('trackNewsletterSignup')
    expect(result.current).toHaveProperty('trackCalculatorUse')
  })

  it('deve ter todas as funções de tracking', () => {
    const { result } = renderHook(() => useGoogleAnalytics())
    
    expect(typeof result.current.trackPageView).toBe('function')
    expect(typeof result.current.trackEvent).toBe('function')
    expect(typeof result.current.trackPurchase).toBe('function')
    expect(typeof result.current.trackSearch).toBe('function')
    expect(typeof result.current.trackVideoPlay).toBe('function')
    expect(typeof result.current.trackArticleRead).toBe('function')
    expect(typeof result.current.trackCalculatorUse).toBe('function')
    expect(typeof result.current.trackDealershipContact).toBe('function')
    expect(typeof result.current.trackNewsletterSignup).toBe('function')
    expect(typeof result.current.trackChatbotInteraction).toBe('function')
  })

})