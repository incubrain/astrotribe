export function extractPlainText(html?: string): string {
  if (!html) return ''

  // Create DOM element to parse
  const div = document.createElement('div')
  div.innerHTML = html

  // Remove unwanted elements
  const unwantedSelectors = ['img', 'script', 'style', 'iframe', 'noscript']
  unwantedSelectors.forEach((selector) => {
    div.querySelectorAll(selector).forEach((el) => el.remove())
  })

  // Get plain text
  let text = div.textContent || ''

  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim()

  return text
}
