import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import BadgeRibbon from '../../badge/Ribbon'
import Drawer from '../../drawer'
import Image from '../../image'
import Steps from '../../steps'
import Tag from '../../tag'
import Timeline from '../../timeline'
import Upload from '../../upload'
import { mount } from '/@tests/utils'

const STYLE = 'max-width: 100px; color: red'

describe('string style across semantic components', () => {
  const cases: Array<[string, any, any, string]> = [
    ['BadgeRibbon', BadgeRibbon, { placement: 'start' }, '.ant-ribbon'],
    ['Image', Image, { src: 'x' }, 'img'],
    ['Steps', Steps, { items: [{ title: 'a' }] }, '.ant-steps'],
    ['Timeline', Timeline, { items: [{ children: 'a' }] }, '.ant-timeline'],
    ['Upload', Upload, { action: 'http://x' }, '.ant-upload'],
    ['Tag', Tag, {}, '.ant-tag'],
  ]
  for (const [name, C, props, sel] of cases) {
    it(name, () => {
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const wrapper = mount(C as any, { props: { ...props, style: STYLE } as any })
      const el = wrapper.find(sel)
      expect(el.exists()).toBe(true)
      const st = el.attributes('style') || ''
      expect(st).toContain('max-width: 100px')
      expect(st).toContain('color: red')
      expect(errSpy).not.toHaveBeenCalled()
      errSpy.mockRestore()
    })
  }

  it('Drawer (portal)', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(() => h(Drawer as any, { open: true, style: STYLE }), { attachTo: document.body })
    const el = document.querySelector('.ant-drawer-section')
    expect(el).not.toBeNull()
    const st = (el as HTMLElement).getAttribute('style') || ''
    expect(st).toContain('max-width: 100px')
    expect(st).toContain('color: red')
    expect(errSpy).not.toHaveBeenCalled()
    wrapper.unmount()
    errSpy.mockRestore()
  })
})
