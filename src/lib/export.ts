export type Row = Record<string, any>

export function downloadFile(content: string, mime: string, ext: string, baseName: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const date = new Date().toISOString().slice(0,10)
  a.download = `${baseName}-${date}.${ext}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function generateCSV(headers: string[], rows: any[][]) {
  const escape = (val: any) => {
    const s = val === undefined || val === null ? '' : String(val)
    const needsQuote = s.includes(',') || s.includes('\n') || s.includes('"')
    const escaped = s.replace(/"/g, '""')
    return needsQuote ? `"${escaped}"` : escaped
  }
  const csvRows = rows.map(r => r.map(escape).join(','))
  const csv = [headers.join(','), ...csvRows].join('\n')
  return '\ufeff' + csv
}

export function generateExcel(headers: string[], rows: any[][]) {
  let table = '<table>'
  table += '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>'
  table += rows.map(r => '<tr>' + r.map(c => `<td>${c ?? ''}</td>`).join('') + '</tr>').join('')
  table += '</table>'
  return table
}

export function generateJSON<T>(data: T) {
  return JSON.stringify(data, null, 2)
}