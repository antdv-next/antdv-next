import { describe, expect, it } from 'vitest'
import { cleanText, normalizeHeadingText } from '../scripts/web-types/utils'

describe('web-types cleanText', () => {
  it('decodes entities and markdown escapes used in doc tables', () => {
    expect(cleanText('boolean \\| &#123; delay: number &#125;')).toBe('boolean | { delay: number }')
    expect(cleanText('\\[number, number\\]')).toBe('[number, number]')
    expect(cleanText('string\\[] | number\\[]')).toBe('string[] | number[]')
    expect(cleanText('boolean | \\{ closeIcon?: VueNode \\}')).toBe('boolean | { closeIcon?: VueNode }')
  })

  it('strips links while keeping their text, including bracketed text', () => {
    expect(cleanText('[ItemType\\[\\]](#itemtype)')).toBe('ItemType[]')
    expect(cleanText('(file: VcFile, fileList: [VcFile[]](#vcfile)) => boolean')).toBe('(file: VcFile, fileList: VcFile[]) => boolean')
    expect(cleanText('&#123; key, href &#125;\\[] [see](#anchoritem)')).toBe('{ key, href }[] see')
  })

  it('keeps TypeScript generics but removes real HTML tags', () => {
    expect(cleanText('Record&lt;[SemanticDOM](#semantic-dom), string&gt; \\| (info: &#123; props &#125;) =&gt; Record&lt;SemanticDOM, string&gt;'))
      .toBe('Record<SemanticDOM, string> | (info: { props }) => Record<SemanticDOM, string>')
    expect(cleanText('Array<string> | Promise<void>')).toBe('Array<string> | Promise<void>')
    expect(cleanText('line one<br />line two <a href="#x">link</a>')).toBe('line one line two link')
  })

  it('removes code ticks and collapses whitespace', () => {
    expect(cleanText('`start` \\| `end`')).toBe('start | end')
    expect(cleanText('&#123;     count?: number     style?: CSSProperties   &#125;')).toBe('{ count?: number style?: CSSProperties }')
    expect(cleanText('&amp;lt;')).toBe('&lt;')
  })

  it('normalizes headings', () => {
    expect(normalizeHeadingText('CollapsePanel {#collapsepanel}')).toBe('CollapsePanel')
    expect(normalizeHeadingText('`type="line"` {#type-line}')).toBe('type="line"')
    expect(normalizeHeadingText('属性：')).toBe('属性')
  })
})
