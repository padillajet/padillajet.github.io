export function isPdfUrl(url?: string) {
  return Boolean(url?.toLowerCase().includes('.pdf'))
}

export function cloudinaryPdfPreview(url: string | undefined, transformations: string) {
  if (!url?.startsWith('https://res.cloudinary.com/') || !isPdfUrl(url)) return ''
  return url.replace('/upload/', `/upload/pg_1,${transformations}/`)
}

export function pixelCertificatePreview(url: string) {
  if (!isPdfUrl(url)) return url
  return cloudinaryPdfPreview(url, 'c_limit,w_48,h_34,f_png').replace(/\.pdf(?=$|[?#])/i, '.png')
}
