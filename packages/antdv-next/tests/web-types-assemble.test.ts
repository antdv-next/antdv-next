import type { ComponentLangMap } from '../scripts/web-types/assemble'
import type { ComponentApiData } from '../scripts/web-types/types'
import { describe, expect, it } from 'vitest'
import { assembleTags } from '../scripts/web-types/assemble'
import { Registry } from '../scripts/web-types/registry'

function component(name: string, data: Partial<ComponentApiData> = {}): ComponentApiData {
  return {
    name,
    tagName: `a-${name.slice(1).toLowerCase()}`,
    componentName: name.slice(1),
    description: '',
    source: 'docs',
    attributes: [],
    events: [],
    slots: [],
    ...data,
  }
}

describe('web-types assemble', () => {
  it('emits every registry entry and merges zh/en docs', () => {
    const registry = Registry.fromNames(['AInput', 'ATextarea'])
    const map: ComponentLangMap = new Map([
      ['AInput', {
        zh: component('AInput', { description: '输入框', attributes: [{ name: 'value', description: '值', type: 'string' }] }),
        en: component('AInput', { description: 'Input', attributes: [{ name: 'value', description: 'Value', type: 'string' }] }),
      }],
    ])

    const tags = assembleTags(registry, map)
    expect(tags.map(tag => tag.tagName)).toEqual(['a-input', 'a-textarea'])
    expect(tags[0]?.description).toBe('(ZH) 输入框\n\n(EN) Input')
    expect(tags[0]?.attributes[0]?.description).toBe('(ZH) 值\n\n(EN) Value')
    expect(tags[1]?.description).toBe('Textarea component of antdv-next.')
    expect(tags[1]?.attributes).toEqual([])
  })

  it('applies supplements additively without overriding documented items', () => {
    const registry = Registry.fromNames(['AInput'])
    const map: ComponentLangMap = new Map([
      ['AInput', { en: component('AInput', { attributes: [{ name: 'value', description: 'Documented', type: 'string' }] }) }],
    ])
    const warnings: string[] = []

    const tags = assembleTags(registry, map, [
      {
        component: 'AInput',
        description: 'Curated',
        attributes: [
          { name: 'value', description: 'Supplement', type: 'any' },
          { name: 'placeholder', description: 'Placeholder', type: 'string' },
        ],
      },
      { component: 'AUnknown', description: 'Ignored' },
    ], { warn: message => warnings.push(message) })

    expect(tags[0]?.description).toBe('Curated')
    expect(tags[0]?.attributes).toEqual([
      { name: 'value', description: 'Documented', type: 'string', default: undefined, deprecated: undefined },
      { name: 'placeholder', description: 'Placeholder', type: 'string' },
    ])
    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toContain('AUnknown')
  })

  it('resolves extends transitively with own items taking precedence', () => {
    const registry = Registry.fromNames(['ADatePicker', 'ARangePicker', 'ATimeRangePicker'])
    const map: ComponentLangMap = new Map([
      ['ADatePicker', { en: component('ADatePicker', {
        attributes: [{ name: 'format', description: 'Date format', type: 'string' }],
        events: [{ name: 'change', description: 'Change', type: '() => void' }],
        slots: [{ name: 'suffixIcon', description: 'Suffix', type: '() => any' }],
      }) }],
      ['ARangePicker', { en: component('ARangePicker', {
        attributes: [{ name: 'separator', description: 'Separator', type: 'string' }],
      }) }],
      ['ATimeRangePicker', { en: component('ATimeRangePicker', {
        attributes: [{ name: 'format', description: 'Time format', type: 'string' }],
      }) }],
    ])

    const tags = assembleTags(registry, map, [
      { component: 'ARangePicker', extends: [{ component: 'ADatePicker', pick: ['events', 'slots'] }] },
      { component: 'ATimeRangePicker', extends: ['ARangePicker'] },
    ])

    const rangePicker = tags.find(tag => tag.name === 'ARangePicker')!
    expect(rangePicker.attributes.map(attr => attr.name)).toEqual(['separator'])
    expect(rangePicker.events.map(event => event.name)).toEqual(['change'])
    expect(rangePicker.slots.map(slot => slot.name)).toEqual(['suffixIcon'])

    const timeRangePicker = tags.find(tag => tag.name === 'ATimeRangePicker')!
    expect(timeRangePicker.attributes.map(attr => [attr.name, attr.description])).toEqual([
      ['format', 'Time format'],
      ['separator', 'Separator'],
    ])
    expect(timeRangePicker.events.map(event => event.name)).toEqual(['change'])
  })

  it('kebab-cases supplement attribute names', () => {
    const registry = Registry.fromNames(['ATabPane'])
    const tags = assembleTags(registry, new Map(), [
      { component: 'ATabPane', attributes: [{ name: 'forceRender', description: 'Force', type: 'boolean' }] },
    ])
    expect(tags[0]?.attributes.map(attr => attr.name)).toEqual(['force-render'])
  })
})

describe('web-types assemble omit', () => {
  it('skips omitted items when inheriting, matching camelCase or kebab-case', () => {
    const registry = Registry.fromNames(['AInput', 'ATextarea'])
    const map: ComponentLangMap = new Map([
      ['AInput', { en: component('AInput', {
        attributes: [
          { name: 'value', description: 'Value', type: 'string' },
          { name: 'addon-after', description: 'Addon', type: 'VueNode' },
          { name: 'type', description: 'Type', type: 'string' },
        ],
        events: [{ name: 'change', description: 'Change', type: '() => void' }, { name: 'clear', description: 'Clear', type: '() => void' }],
      }) }],
    ])

    const tags = assembleTags(registry, map, [
      { component: 'ATextarea', extends: [{ component: 'AInput', omit: ['addonAfter', 'type', 'clear'] }] },
    ])

    const textarea = tags.find(tag => tag.name === 'ATextarea')!
    expect(textarea.attributes.map(attr => attr.name)).toEqual(['value'])
    expect(textarea.events.map(event => event.name)).toEqual(['change'])
  })
})
