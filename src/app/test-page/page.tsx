import { generateArtigoFromSlug } from '@/lib/data'

export default function TestPage() {
  try {
    const artigo = generateArtigoFromSlug('test-slug')
    
    if (!artigo) {
      return (
        <div className="p-8">
          <h1>Artigo não encontrado</h1>
          <p>O artigo com slug 'test-slug' não foi encontrado.</p>
        </div>
      )
    }
    
    return (
      <div className="p-8">
        <h1>Teste de Geração Dinâmica</h1>
        <h2>{artigo.titulo}</h2>
        <p>{artigo.resumo}</p>
        <p>Categoria: {artigo.categoria}</p>
        <p>Autor: {artigo.autor}</p>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8">
        <h1>Erro na Geração</h1>
        <p>Erro: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>
      </div>
    )
  }
}