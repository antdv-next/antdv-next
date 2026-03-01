import { describe, expect, it } from 'vitest'
import { createVNode, defineComponent, h } from 'vue'
import { resolveSlotsNode, resolveVNodeProps } from '..'

describe('vnode resolve helpers', () => {
  it('resolves props close to Vue componentProps behavior', () => {
    const TestComp = defineComponent({
      name: 'TestComp',
      props: {
        fooBar: Number,
        bool: Boolean,
        boolOrString: [Boolean, String],
        stringOrBool: [String, Boolean],
        withDefault: {
          type: Number,
          default: 5,
        },
        fromFactory: {
          type: Object,
          default: (props: Record<string, any>) => ({
            foo: props.fooBar ?? 0,
          }),
        },
      },
      setup() {
        return () => null
      },
    })

    const vnode = createVNode(TestComp, {
      'foo-bar': 3,
      boolOrString: '',
      stringOrBool: '',
      'data-id': 'demo',
    })

    const resolved = resolveVNodeProps(vnode)

    expect(resolved.fooBar).toBe(3)
    expect(resolved.bool).toBe(false)
    expect(resolved.boolOrString).toBe(true)
    expect(resolved.stringOrBool).toBe('')
    expect(resolved.withDefault).toBe(5)
    expect(resolved.fromFactory).toEqual({ foo: 3 })
    expect(resolved['data-id']).toBe('demo')
  })

  it('casts boolean with hyphenated prop name like Vue', () => {
    const TestComp = defineComponent({
      name: 'TestComp',
      props: {
        boolOrString: [Boolean, String],
      },
      setup() {
        return () => null
      },
    })

    const vnode = createVNode(TestComp, {
      boolOrString: 'bool-or-string',
    })

    const resolved = resolveVNodeProps(vnode)
    expect(resolved.boolOrString).toBe(true)
  })

  it('prefers slot content and maps class/style children', () => {
    const SlotComp = defineComponent({
      name: 'SlotComp',
      props: {
        title: String,
        content: String,
      },
      setup() {
        return () => null
      },
    })

    const vnode = createVNode(
      SlotComp,
      {
        title: 'title-from-prop',
        content: 'content-from-prop',
        class: 'slot-host',
        style: { color: 'red' },
      },
      {
        default: () => [h('em', { class: 'default-slot' }, 'default')],
        title: () => [h('span', { class: 'title-slot' }, 'title')],
        content: () => [h('span', { class: 'content-slot' }, 'content')],
      },
    )

    const resolved = resolveVNodeProps(vnode)

    expect((resolved.title as any).props.class).toBe('title-slot')
    expect((resolved.content as any).props.class).toBe('content-slot')
    expect((resolved.children as any).props.class).toBe('default-slot')
    expect(resolved.class).toBe('slot-host')
    expect(resolved.className).toBe('slot-host')
    expect(resolved.style).toEqual({ color: 'red' })
  })

  it('resolves named component nodes from slots', () => {
    const ItemComp = defineComponent({
      name: 'ATestItem',
      props: {
        checked: Boolean,
      },
      setup() {
        return () => null
      },
    })

    const slots = {
      default: () => [
        createVNode(ItemComp, { key: 'k1', checked: '' }, {
          default: () => [h('span', { class: 'item-default' }, 'item')],
        }),
        createVNode('div', { class: 'ignore' }, 'ignore'),
      ],
    }

    const items = resolveSlotsNode<Record<string, any>>(slots, 'default', 'ATestItem')

    expect(items).toHaveLength(1)
    expect(items[0]!.key).toBe('k1')
    expect(items[0]!.checked).toBe(true)
    expect((items[0]!.children as any).props.class).toBe('item-default')
  })

  it('keeps empty component node when matched by name', () => {
    const ItemComp = defineComponent({
      name: 'ATestItem',
      setup() {
        return () => null
      },
    })

    const items = resolveSlotsNode<Record<string, any>>(
      {
        default: () => [createVNode(ItemComp)],
      },
      'default',
      'ATestItem',
    )

    expect(items).toHaveLength(1)
    expect(items[0]).toEqual({})
  })

  it('keeps native attrs in kebab-case on native elements', () => {
    const vnode = createVNode('button', {
      'aria-disabled': 'true',
      'data-testid': 'native-btn',
    })

    const resolved = resolveVNodeProps(vnode)

    expect(resolved['aria-disabled']).toBe('true')
    expect(resolved['data-testid']).toBe('native-btn')
    expect(resolved.ariaDisabled).toBeUndefined()
  })

  it('keeps non-declared attrs kebab-case on components', () => {
    const TestComp = defineComponent({
      name: 'AttrComp',
      props: {
        checked: Boolean,
      },
      setup() {
        return () => null
      },
    })

    const vnode = createVNode(TestComp, {
      checked: '',
      'aria-disabled': 'true',
    })

    const resolved = resolveVNodeProps(vnode)

    expect(resolved.checked).toBe(true)
    expect(resolved['aria-disabled']).toBe('true')
    expect(resolved.ariaDisabled).toBeUndefined()
  })

  it('matches target component by private marker instead of name', () => {
    const markerKey = '_ANTDV_NEXT_TIMELINE_ITEM'
    const MarkedComp = defineComponent({
      name: 'ChangedNameAfterUserCustom',
      setup() {
        return () => null
      },
    })
    ;(MarkedComp as any)[markerKey] = true

    const slots = {
      default: () => [
        createVNode(MarkedComp, { 'data-id': 'marked' }, {
          default: () => 'content',
        }),
        createVNode('div', { 'data-id': 'plain' }, 'plain'),
      ],
    }

    const items = resolveSlotsNode<Record<string, any>>(slots, 'default', 'ATimelineItem', markerKey)

    expect(items).toHaveLength(1)
    expect(items[0]!['data-id']).toBe('marked')
    expect(items[0]!.children).toBe('content')
  })
})
