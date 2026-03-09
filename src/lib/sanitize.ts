// Sanitização básica de HTML para evitar XSS em renderizações com dangerouslySetInnerHTML
// Estratégia: whitelist de tags e atributos comuns, remoção de event handlers e URLs perigosas

const ALLOWED_TAGS = [
  'p','br','strong','em','b','i','u','span','div','blockquote','code','pre','ul','ol','li','h1','h2','h3','h4','h5','h6','a','img','table','thead','tbody','tr','th','td'
]
const ALLOWED_ATTRS = ['href','src','alt','title','class','style','target','rel']

function isSafeUrl(url: string): boolean {
  try {
    const u = new URL(url, 'http://localhost')
    const protocol = u.protocol.replace(':','')
    return ['http','https','data'].includes(protocol) && !url.trim().toLowerCase().startsWith('javascript:')
  } catch {
    // Para valores relativos (sem URL completa), considerar seguro
    return !url.trim().toLowerCase().startsWith('javascript:')
  }
}

export function sanitizeHtml(input: string): string {
  if (!input) return ''
  if (typeof window === 'undefined') {
    // Em ambientes server-side, retornar sem modificar para evitar depender de DOM
    // Idealmente, usar uma lib de sanitização server-side aqui.
    return input
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(input, 'text/html')

  const walk = (node: Element) => {
    // Remover tags não permitidas mantendo conteúdo texto interno
    if (!ALLOWED_TAGS.includes(node.tagName.toLowerCase())) {
      const text = document.createTextNode(node.textContent || '')
      node.replaceWith(text)
      return
    }

    // Remover atributos não permitidos e perigosos
    for (const attr of Array.from(node.attributes)) {
      const name = attr.name.toLowerCase()
      const value = attr.value
      const isEventHandler = name.startsWith('on')

      if (isEventHandler) {
        node.removeAttribute(attr.name)
        continue
      }

      if (!ALLOWED_ATTRS.includes(name)) {
        node.removeAttribute(attr.name)
        continue
      }

      if ((name === 'href' || name === 'src') && !isSafeUrl(value)) {
        node.removeAttribute(attr.name)
        continue
      }

      if (name === 'target' && value === '_blank') {
        // Garantir rel seguro para evitar tabnabbing
        node.setAttribute('rel', 'noopener noreferrer')
      }
    }

    for (const child of Array.from(node.children)) {
      walk(child)
    }
  }

  for (const el of Array.from(doc.body.children)) {
    walk(el)
  }

  return doc.body.innerHTML
}