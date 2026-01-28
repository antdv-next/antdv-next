import type { ComponentApiData } from '../scripts/web-types/types'
import { describe, expect, it } from 'vitest'
import { applyDefaults } from '../scripts/web-types/apply-defaults'

describe('web-types defaults', () => {
  it('adds default components for missing docs', () => {
    const map = new Map<string, { zh?: ComponentApiData, en?: ComponentApiData }>()

    applyDefaults(map, [
      {
        componentName: 'Portal',
        description: 'Render into a container.',
        attributes: [{ name: 'getContainer', description: 'Container', type: '() => HTMLElement' }],
      },
    ])

    const entry = map.get('a-portal')
    expect(entry?.zh?.componentName).toBe('Portal')
    expect(entry?.en?.componentName).toBe('Portal')
    expect(entry?.zh?.attributes[0].name).toBe('get-container')
  })

  it('does not override existing entries', () => {
    const existing: ComponentApiData = {
      tagName: 'a-portal',
      componentName: 'Portal',
      description: 'Existing description',
      source: 'docs',
      attributes: [],
      events: [],
      slots: [],
    }

    const map = new Map<string, { zh?: ComponentApiData, en?: ComponentApiData }>([
      ['a-portal', { zh: existing }],
    ])

    applyDefaults(map, [
      {
        componentName: 'Portal',
        description: 'Default description',
        lang: 'zh',
      },
    ])

    expect(map.get('a-portal')?.zh?.description).toBe('Existing description')
  })
})
