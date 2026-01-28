import type { ComponentApiData, MarkdownHooks } from '../scripts/web-types/types'
import { describe, expect, it } from 'vitest'
import { applyMarkdownHooks } from '../scripts/web-types/hooks'

describe('web-types hooks', () => {
  it('applies props/events/slots hooks', () => {
    const component: ComponentApiData = {
      tagName: 'a-demo',
      componentName: 'Demo',
      description: 'Demo component',
      source: 'demo.md',
      attributes: [{ name: 'size', description: 'Size' }],
      events: [{ name: 'change', description: 'Change' }],
      slots: [{ name: 'default', description: 'Default slot' }],
    }

    const hooks: MarkdownHooks = {
      props: items => items.filter(item => item.name !== 'size'),
      events: items => items.concat({ name: 'open', description: 'Open' }),
      slots: items => items.map(item => ({ ...item, name: `slot-${item.name}` })),
    }

    applyMarkdownHooks(component, 'en', hooks)

    expect(component.attributes).toHaveLength(0)
    expect(component.events.map(item => item.name)).toEqual(['change', 'open'])
    expect(component.slots.map(item => item.name)).toEqual(['slot-default'])
  })
})
