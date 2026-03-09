'use client'

import { useRef, useEffect, useState } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Pipette,
  Highlighter,
  Lock
} from 'lucide-react'

type Props = {
  value: string
  onChange: (html: string) => void
}

const RichTextEditor = ({ value, onChange }: Props) => {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const fileInputImageRef = useRef<HTMLInputElement | null>(null)
  const fileInputAttachmentRef = useRef<HTMLInputElement | null>(null)
  const [showEmojiPanel, setShowEmojiPanel] = useState(false)
  const [emojiTab, setEmojiTab] = useState<'faces'|'gestos'|'simbolos'|'objetos'>('faces')
  const [emojiQuery, setEmojiQuery] = useState('')
  const [showColorPanel, setShowColorPanel] = useState(false)
  const [showHighlightPanel, setShowHighlightPanel] = useState(false)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  // Fecha painéis quando clicar fora da barra de ferramentas
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowEmojiPanel(false)
        setShowColorPanel(false)
        setShowHighlightPanel(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleLink = () => {
    const url = prompt('Insira o URL do link:')
    if (url) exec('createLink', url)
  }

  const handleUnlink = () => {
    exec('unlink')
  }

  const handleStrike = () => {
    exec('strikeThrough')
  }

  const handleTextColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    exec('foreColor', e.target.value)
  }

  const handleHighlightColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      exec('hiliteColor', e.target.value)
    } catch {
      exec('backColor', e.target.value)
    }
  }

  const handleEmojiInsert = (emoji: string) => {
    document.execCommand('insertText', false, emoji)
    setShowEmojiPanel(false)
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }

  // Dataset de emojis (curado, cobrindo categorias comuns)
  const EMOJIS = {
    faces: ['😀','😁','😂','🤣','😊','☺️','😍','😘','😗','😙','😚','😋','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','🙂','🙃','😉','😏','😣','😥','😮','🤧','🤒','🤕','🥵','🥶','😴','🤤','😭','😓','😪','😮‍💨','😌','😔','😕','🙁','☹️','😡','😠','🤬','😤','😳','🥱','😱','😨','😰','😧','😢','😇','🤩','🥳','😎','🤓','🧐','🤥','😵','🤯','🤠','🤡','👻','💀','🤖','👽'],
    gestos: ['🙌','👏','👍','👎','🙏','🤝','👌','🤌','🤏','✌️','🤟','🤘','👊','✊','✋','🖐️','🤚','👋','🤙','💪','🦵','🦶','🧠','🫶','🫰','🤲','🫳','🫴','🤦','🤷','💅'],
    simbolos: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','💖','💘','⭐','✨','🔥','💥','⚡','🌟','✅','✔️','❌','❗','❓','ℹ️','⚠️','🚫','🔞','♻️','🔁','🔄','⏰','⌛','⏳','💡','🔔','🔕','🔒','🔓','🔑','📌','📍','🔗','➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️'],
    objetos: ['📷','📹','🎥','🖼️','📎','🖇️','📁','📂','🗂️','🗄️','🗃️','📝','✏️','🖊️','🖋️','🖱️','⌨️','💻','🖥️','📱','☎️','📞','🎧','📺','📻','🎮','🕹️','🚗','🚕','🚌','🏍️','🚲','✈️','🛳️','🏠','🏢','🏬','🛠️','⚙️','🔧','🔨','🧰']
  }

  const filteredEmojis = () => {
    const q = emojiQuery.trim().toLowerCase()
    const list = EMOJIS[emojiTab]
    if (!q) return list
    // Filtro básico por descrição via fallback simples: mapeia alguns aliases
    const ALIASES: Record<string, string[]> = {
      coracao: ['❤️','💖','💘'],
      check: ['✅','✔️'],
      fogo: ['🔥'],
      estrela: ['⭐','🌟'],
      feliz: ['😀','😁','😊','🙂','😎','🤩','🥳'],
      triste: ['🙁','☹️','😢','😭'],
      bravo: ['😠','😡','🤬'],
      dinheiro: ['🤑'],
      ideia: ['💡'],
      camera: ['📷'],
      link: ['🔗'],
      ok: ['✅','👍']
    }
    const extra = Object.values(ALIASES)
      .flat()
      .filter(e => q && (ALIASES[q]?.includes(e) || e === q))
    const base = list.filter(e => e.includes(q))
    return [...new Set([...base, ...extra])]
  }

  const triggerImageSelect = () => {
    fileInputImageRef.current?.click()
  }

  const triggerAttachmentSelect = () => {
    fileInputAttachmentRef.current?.click()
  }

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = `<img src="${url}" alt="imagem" style="max-width:100%;height:auto;" />`
    document.execCommand('insertHTML', false, img)
    if (editorRef.current) onChange(editorRef.current.innerHTML)
    e.target.value = ''
  }

  const handleAttachmentFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${file.name}</a>`
    document.execCommand('insertHTML', false, link)
    if (editorRef.current) onChange(editorRef.current.innerHTML)
    e.target.value = ''
  }

  const handleImageUrl = () => {
    const url = prompt('Insira o URL da imagem:')
    if (url) {
      const img = `<img src="${url}" alt="imagem" style="max-width:100%;height:auto;" />`
      document.execCommand('insertHTML', false, img)
      if (editorRef.current) onChange(editorRef.current.innerHTML)
    }
  }

  const handleAttachmentUrl = () => {
    const url = prompt('Insira o URL do anexo:')
    if (url) {
      const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">Anexo</a>`
      document.execCommand('insertHTML', false, link)
      if (editorRef.current) onChange(editorRef.current.innerHTML)
    }
  }

  const setAlign = (type: 'left' | 'center' | 'right' | 'justify') => {
    const map = {
      left: 'justifyLeft',
      center: 'justifyCenter',
      right: 'justifyRight',
      justify: 'justifyFull'
    } as const
    exec(map[type])
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  return (
    <div className="space-y-2">
      <div ref={toolbarRef} className="flex flex-wrap items-center gap-2 text-gray-700">
        {/* Grupo: estilo básico */}
        <button type="button" title="Negrito" className="p-2 rounded hover:bg-gray-100" onClick={() => exec('bold')}><Bold className="h-5 w-5" /></button>
        <button type="button" title="Itálico" className="p-2 rounded hover:bg-gray-100" onClick={() => exec('italic')}><Italic className="h-5 w-5" /></button>
        <button type="button" title="Sublinhar" className="p-2 rounded hover:bg-gray-100" onClick={() => exec('underline')}><Underline className="h-5 w-5" /></button>
        <button type="button" title="Tachado" className="p-2 rounded hover:bg-gray-100" onClick={handleStrike}><Strikethrough className="h-5 w-5" /></button>
        <span className="h-6 w-px bg-gray-200 mx-1" />

        {/* Grupo: listas e citação */}
        <button type="button" title="Lista" className="p-2 rounded hover:bg-gray-100" onClick={() => exec('insertUnorderedList')}><List className="h-5 w-5" /></button>
        <button type="button" title="Lista numerada" className="p-2 rounded hover:bg-gray-100" onClick={() => exec('insertOrderedList')}><ListOrdered className="h-5 w-5" /></button>
        <button type="button" title="Citação" className="p-2 rounded hover:bg-gray-100" onClick={() => exec('formatBlock', 'blockquote')}><Quote className="h-5 w-5" /></button>
        <span className="h-6 w-px bg-gray-200 mx-1" />

        {/* Grupo: títulos/tamanho */}
        <div className="flex items-center gap-1">
          <Type className="h-5 w-5 text-gray-600" />
          <select className="px-2 py-1 border border-gray-300 rounded text-sm bg-white" aria-label="Tamanho do texto" onChange={(e) => {
            const val = e.target.value
            if (val === 'p') exec('formatBlock', 'p')
            else if (val === 'h2') exec('formatBlock', 'h2')
            else if (val === 'h3') exec('formatBlock', 'h3')
            else exec('fontSize', val)
          }}>
            <option value="p">Normal</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
            <option value="4">Grande</option>
            <option value="2">Pequeno</option>
          </select>
        </div>
        <span className="h-6 w-px bg-gray-200 mx-1" />

        {/* Grupo: alinhamento */}
        <button type="button" title="Alinhar à esquerda" className="p-2 rounded hover:bg-gray-100" onClick={() => setAlign('left')}><AlignLeft className="h-5 w-5" /></button>
        <button type="button" title="Centralizar" className="p-2 rounded hover:bg-gray-100" onClick={() => setAlign('center')}><AlignCenter className="h-5 w-5" /></button>
        <button type="button" title="Alinhar à direita" className="p-2 rounded hover:bg-gray-100" onClick={() => setAlign('right')}><AlignRight className="h-5 w-5" /></button>
        <button type="button" title="Justificar" className="p-2 rounded hover:bg-gray-100" onClick={() => setAlign('justify')}><AlignJustify className="h-5 w-5" /></button>
        <span className="h-6 w-px bg-gray-200 mx-1" />

        {/* Grupo: cores (pipeta) */}
        <div className="relative">
          <button type="button" title="Cor do texto" className="p-2 rounded hover:bg-gray-100" onClick={() => setShowColorPanel(v => !v)}><Pipette className="h-5 w-5" /></button>
          {showColorPanel && (
            <div className="absolute z-10 mt-1 p-2 bg-white border border-gray-200 rounded shadow-sm">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                Texto <input type="color" onChange={handleTextColor} aria-label="Cor do texto" />
              </label>
            </div>
          )}
        </div>

        {/* Grupo: marcador (highlight) */}
        <div className="relative">
          <button type="button" title="Marcador" className="p-2 rounded hover:bg-gray-100" onClick={() => setShowHighlightPanel(v => !v)}><Highlighter className="h-5 w-5" /></button>
          {showHighlightPanel && (
            <div className="absolute z-10 mt-1 p-2 bg-white border border-gray-200 rounded shadow-sm">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                Destaque <input type="color" onChange={handleHighlightColor} aria-label="Cor de destaque" />
              </label>
            </div>
          )}
        </div>
        <span className="h-6 w-px bg-gray-200 mx-1" />

        {/* Grupo: link */}
        <button type="button" title="Inserir link" className="p-2 rounded hover:bg-gray-100" onClick={handleLink}><LinkIcon className="h-5 w-5" /></button>
        <button type="button" title="Remover link" className="p-2 rounded hover:bg-gray-100" onClick={handleUnlink}>✕</button>
        <span className="h-6 w-px bg-gray-200 mx-1" />

        {/* Emoji */}
        <div className="relative">
          <button type="button" title="Emoji" className="p-2 rounded hover:bg-gray-100" onClick={() => setShowEmojiPanel(v => !v)}><Smile className="h-5 w-5" /></button>
          {showEmojiPanel && (
            <div className="absolute z-20 mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg w-56 sm:w-72 max-w-[90vw]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={emojiQuery}
                  onChange={(e) => setEmojiQuery(e.target.value)}
                  placeholder="Buscar emoji..."
                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                />
              </div>
              <div className="flex items-center gap-1 mb-2">
                {(
                  [
                    {k:'faces',label:'🙂'},
                    {k:'gestos',label:'✋'},
                    {k:'simbolos',label:'★'},
                    {k:'objetos',label:'📦'}
                  ] as {k: 'faces'|'gestos'|'simbolos'|'objetos', label: string}[]
                ).map(tab => (
                  <button
                    key={tab.k}
                    type="button"
                    className={`px-2 py-1 rounded text-sm ${emojiTab===tab.k?'bg-gray-100':'hover:bg-gray-100'}`}
                    onClick={() => setEmojiTab(tab.k)}
                  >{tab.label}</button>
                ))}
              </div>
              <div className="grid grid-cols-7 sm:grid-cols-8 gap-1 max-h-56 overflow-auto">
                {filteredEmojis().map(e => (
                  <button key={e} type="button" className="inline-flex items-center justify-center w-8 h-8 leading-none hover:bg-gray-100 rounded" onClick={() => handleEmojiInsert(e)}>{e}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Imagem */}
        <button type="button" title="Imagem (URL)" className="p-2 rounded hover:bg-gray-100" onClick={handleImageUrl}><ImageIcon className="h-5 w-5" /></button>
        <button type="button" title="Imagem (arquivo)" className="p-2 rounded hover:bg-gray-100" onClick={triggerImageSelect}><ImageIcon className="h-5 w-5" /></button>
        <input ref={fileInputImageRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />

        {/* Anexo */}
        <button type="button" title="Anexo (URL)" className="p-2 rounded hover:bg-gray-100" onClick={handleAttachmentUrl}><Paperclip className="h-5 w-5" /></button>
        <button type="button" title="Anexo (arquivo)" className="p-2 rounded hover:bg-gray-100" onClick={triggerAttachmentSelect}><Paperclip className="h-5 w-5" /></button>
        <input ref={fileInputAttachmentRef} type="file" className="hidden" onChange={handleAttachmentFile} />

        <span className="h-6 w-px bg-gray-200 mx-1" />

        {/* Bloquear edição */}
        <button type="button" title={locked ? 'Desbloquear edição' : 'Bloquear edição'} className="p-2 rounded hover:bg-gray-100" onClick={() => setLocked(v => !v)}>
          <Lock className={`h-5 w-5 ${locked ? 'text-red-500' : ''}`} />
        </button>

        {/* Limpar */}
        <button type="button" title="Limpar formatação" className="p-2 rounded hover:bg-gray-100" onClick={() => exec('removeFormat')}>🧹</button>
      </div>
      <div
        ref={editorRef}
        contentEditable={!locked}
        onInput={handleInput}
        className="w-full min-h-[160px] border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent whitespace-pre-wrap break-words shadow-sm bg-white"
        aria-label="Editor de texto rico"
      />
    </div>
  )
}

export default RichTextEditor