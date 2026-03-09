import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Newsletter from '../Newsletter'

// Mock do hook de analytics
jest.mock('@/components/GoogleAnalytics', () => ({
  useGoogleAnalytics: () => ({
    trackNewsletterSignup: jest.fn()
  })
}))

describe('Newsletter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar o formulário de newsletter', () => {
    render(<Newsletter />)
    
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('deve aceitar entrada de email', async () => {
    const user = userEvent.setup()
    render(<Newsletter />)
    
    const emailInput = screen.getByRole('textbox')
    await user.type(emailInput, 'test@example.com')
    
    expect(emailInput).toHaveValue('test@example.com')
  })

  it('deve validar formato de email', async () => {
    const user = userEvent.setup()
    render(<Newsletter />)
    
    const emailInput = screen.getByRole('textbox')
    const submitButton = screen.getByRole('button')
    
    // Tentar submeter email inválido
    await user.type(emailInput, 'email-invalido')
    await user.click(submitButton)
    
    // Verificar se há validação (pode ser através de atributos HTML5 ou mensagem de erro)
    expect(emailInput).toBeInvalid()
  })

  it('deve submeter email válido', async () => {
    const user = userEvent.setup()
    render(<Newsletter />)
    
    const emailInput = screen.getByRole('textbox')
    const submitButton = screen.getByRole('button')
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    // Verificar se o formulário foi submetido (pode mostrar mensagem de sucesso)
    await waitFor(() => {
      // Pode verificar se o input foi limpo ou se há mensagem de sucesso
      expect(emailInput).toHaveValue('')
    }, { timeout: 3000 })
  })

  it('deve mostrar estado de carregamento durante submissão', async () => {
    const user = userEvent.setup()
    render(<Newsletter />)
    
    const emailInput = screen.getByRole('textbox')
    const submitButton = screen.getByRole('button')
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    // Verificar se o botão mostra estado de carregamento
    expect(submitButton).toBeDisabled()
  })

  it('deve funcionar com diferentes variantes', () => {
    const { rerender } = render(<Newsletter variant="compact" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    
    rerender(<Newsletter variant="sidebar" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('deve funcionar com diferentes temas', () => {
    const { rerender } = render(<Newsletter theme="light" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    
    rerender(<Newsletter theme="dark" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('deve ter acessibilidade adequada', () => {
    render(<Newsletter variant="sidebar" />)
    
    const emailInput = screen.getByRole('textbox')
    const submitButton = screen.getByRole('button', { name: /subscrever/i })
    
    // Verificar se os elementos são acessíveis
    expect(emailInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('placeholder', 'Seu email')
  })

  it('deve simular inscrição com sucesso', async () => {
    const user = userEvent.setup()
    render(<Newsletter />)
    
    const emailInput = screen.getByRole('textbox')
    const submitButton = screen.getByRole('button')
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    // Verificar se o botão fica desabilitado durante o carregamento
    expect(submitButton).toBeDisabled()
    
    // Aguardar o processamento (simulação de 1 segundo)
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    }, { timeout: 2000 })
  })
})