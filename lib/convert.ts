// Simple converters for Markdown <-> Text/HTML

// Converts Markdown to plain text by stripping common Markdown syntax
export function markdownToText(markdown: string): string {
  if (!markdown) return ''

  let text = markdown
  // Remove code blocks ```lang\n...\n```
  text = text.replace(/```[\s\S]*?```/g, (block) => block.replace(/```.*\n?|```/g, ''))
  // Inline code `code`
  text = text.replace(/`([^`]+)`/g, '$1')
  // Images ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1')
  // Links [text](url)
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
  // Bold **text** or __text__
  text = text.replace(/\*\*([^*]+)\*\*|__([^_]+)__/g, (_, a, b) => a || b || '')
  // Italic *text* or _text_
  text = text.replace(/\*([^*]+)\*|_([^_]+)_/g, (_, a, b) => a || b || '')
  // Headings #### Title -> Title
  text = text.replace(/^#{1,6}\s+/gm, '')
  // Blockquotes > text
  text = text.replace(/^>\s?/gm, '')
  // Lists - item / * item / 1. item
  text = text.replace(/^\s*([-*+]\s+)/gm, '')
  text = text.replace(/^\s*\d+\.\s+/gm, '')
  // Horizontal rules
  text = text.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, '')
  // Remove remaining markdown artifacts
  text = text.replace(/\\([`*_{}\[\]()#+\-.!])/g, '$1')
  // Trim trailing spaces on lines
  text = text.replace(/[ \t]+$/gm, '')
  // Collapse multiple blank lines
  text = text.replace(/\n{3,}/g, '\n\n')
  return text.trim()
}

// Converts HTML to Markdown for common tags using DOMParser
export function htmlToMarkdown(html: string): string {
  if (!html) return ''
  if (typeof window === 'undefined') return html // fallback SSR safety

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  function escapeMd(text: string) {
    return text.replace(/[\\`*_{}\[\]()#+\-.!]/g, '\\$&')
  }

  function serialize(node: Node, listIndex = 0): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent || '').replace(/\s+/g, ' ')
    }
    if (!(node as HTMLElement).tagName) {
      return ''
    }
    const el = node as HTMLElement
    const tag = el.tagName.toLowerCase()
    const children = Array.from(el.childNodes).map((c) => serialize(c, listIndex)).join('')

    switch (tag) {
      case 'br':
        return '  \n'
      case 'p':
        return `\n\n${children.trim()}\n\n`
      case 'strong':
      case 'b':
        return `**${children.trim()}**`
      case 'em':
      case 'i':
        return `*${children.trim()}*`
      case 'code': {
        // inline code unless inside pre
        if (el.parentElement && el.parentElement.tagName.toLowerCase() === 'pre') return children
        return `\`${children.trim()}\``
      }
      case 'pre': {
        const code = el.textContent || ''
        return `\n\n\
\`\`\`\n${code.replace(/\n$/, '')}\n\
\`\`\`\n\n`
      }
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6': {
        const level = parseInt(tag[1])
        return `\n\n${'#'.repeat(level)} ${children.trim()}\n\n`
      }
      case 'a': {
        const href = el.getAttribute('href') || ''
        const text = children.trim() || href
        return `[${escapeMd(text)}](${href})`
      }
      case 'img': {
        const alt = el.getAttribute('alt') || ''
        const src = el.getAttribute('src') || ''
        return `![${escapeMd(alt)}](${src})`
      }
      case 'blockquote':
        return children
          .split(/\n/)
          .map((line) => (line.trim() ? `> ${line}` : '>'))
          .join('\n')
      case 'ul': {
        return (
          '\n' +
          Array.from(el.children)
            .map((li) => `- ${serialize(li).trim()}\n`)
            .join('') +
          '\n'
        )
      }
      case 'ol': {
        let i = 1
        return (
          '\n' +
          Array.from(el.children)
            .map((li) => `${i++}. ${serialize(li).trim()}\n`)
            .join('') +
          '\n'
        )
      }
      case 'li':
        return children.replace(/\n+/g, ' ').trim()
      case 'hr':
        return '\n\n---\n\n'
      default:
        return children
    }
  }

  const result = serialize(doc.body)
  // Cleanup excessive blank lines
  return result.replace(/\n{3,}/g, '\n\n').trim()
}
