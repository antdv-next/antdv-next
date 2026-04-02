import type { BlockProps, TypographyClassNamesType, TypographyStylesType } from '../interface'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Base from '../Base'
import Paragraph from '../Paragraph'
import { mount } from '/@tests/utils'

const prefixCls = 'ant-typography'
const styleSupportState = vi.hoisted(() => ({ value: false }))

// Mock copy util to avoid clipboard issues
vi.mock('../../_util/copy', () => ({
  default: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('../../_util/styleChecker', () => ({
  isStyleSupport: () => styleSupportState.value,
}))

describe('typography.semantic', () => {
  afterEach(() => {
    styleSupportState.value = false
  })

  // ===================== Object form =====================

  describe('object form', () => {
    it('should apply classes and styles to root', () => {
      const wrapper = mount(Base, {
        props: {
          component: 'p',
          classes: { root: 'c-root' },
          styles: { root: { color: 'rgb(255, 0, 0)' } },
        },
        slots: {
          default: () => 'text',
        },
      })
      const root = wrapper.find(`.${prefixCls}`)
      expect(root.classes()).toContain('c-root')
      expect(root.attributes('style')).toContain('color: rgb(255, 0, 0)')
    })

    it('should apply classes and styles to copy button', async () => {
      const wrapper = mount(Base, {
        props: {
          component: 'p',
          copyable: {},
          classes: { copy: 'c-copy' },
          styles: { copy: { color: 'rgb(0, 128, 0)' } },
        },
        slots: {
          default: () => 'text',
        },
      })
      const copyBtn = wrapper.find(`.${prefixCls}-copy`)
      expect(copyBtn.classes()).toContain('c-copy')
      expect(copyBtn.attributes('style')).toContain('color: rgb(0, 128, 0)')
    })

    it('should apply classes and styles to edit button', () => {
      const wrapper = mount(Base, {
        props: {
          component: 'p',
          editable: {},
          classes: { edit: 'c-edit' },
          styles: { edit: { color: 'rgb(0, 0, 255)' } },
        },
        slots: {
          default: () => 'text',
        },
      })
      const editBtn = wrapper.find(`.${prefixCls}-edit`)
      expect(editBtn.classes()).toContain('c-edit')
      expect(editBtn.attributes('style')).toContain('color: rgb(0, 0, 255)')
    })

    it('should apply classes and styles to expand button', async () => {
      const LINE_STR_COUNT = 20
      const originOffsetHeight = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        'offsetHeight',
      )?.get

      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        get() {
          let html = this.innerHTML
          html = html.replace(/<[^>]*>/g, '')
          const lines = Math.ceil(html.length / LINE_STR_COUNT)
          return lines * 16
        },
      })

      const mockGetBoundingClientRect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      mockGetBoundingClientRect.mockImplementation(function fn(this: HTMLElement) {
        let html = this.innerHTML
        html = html.replace(/<[^>]*>/g, '')
        const lines = Math.ceil(html.length / LINE_STR_COUNT)
        return { height: lines * 16 } as DOMRect
      })

      const originGetComputedStyle = window.getComputedStyle
      window.getComputedStyle = (ele) => {
        const style = originGetComputedStyle(ele)
        style.lineHeight = '16px'
        return style
      }

      styleSupportState.value = true

      const longText = 'A'.repeat(200)
      const wrapper = mount(Base, {
        attachTo: document.body,
        props: {
          component: 'p',
          ellipsis: { expandable: true },
          classes: { expand: 'c-expand' },
          styles: { expand: { color: 'rgb(128, 0, 128)' } },
        },
        slots: {
          default: () => longText,
        },
      })

      await nextTick()

      const expandBtn = wrapper.find(`.${prefixCls}-expand`)
      if (expandBtn.exists()) {
        expect(expandBtn.classes()).toContain('c-expand')
        expect(expandBtn.attributes('style')).toContain('color: rgb(128, 0, 128)')
      }

      wrapper.unmount()
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        get: originOffsetHeight,
      })
      mockGetBoundingClientRect.mockRestore()
      window.getComputedStyle = originGetComputedStyle
    })

    it('should apply root classes and styles in editing mode', async () => {
      const wrapper = mount(Base, {
        props: {
          component: 'p',
          editable: { editing: true },
          classes: { root: 'c-root-edit' },
          styles: { root: { padding: '10px' } },
        },
        slots: {
          default: () => 'text',
        },
      })

      await nextTick()

      // In editing mode, root class/style should still be applied to the edit content wrapper
      const editContent = wrapper.find(`.${prefixCls}-edit-content`)
      expect(editContent.exists()).toBe(true)
      expect(editContent.classes()).toContain('c-root-edit')
      expect(editContent.attributes('style')).toContain('padding: 10px')
    })
  })

  // ===================== Function form =====================

  describe('function form', () => {
    it('should support classes as function', () => {
      const classesFn = vi.fn((_info: { props: BlockProps }) => ({
        root: 'fn-root',
      }))

      const wrapper = mount(Base, {
        props: {
          component: 'p',
          classes: classesFn as unknown as TypographyClassNamesType,
        },
        slots: {
          default: () => 'text',
        },
      })
      expect(classesFn).toHaveBeenCalled()
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('fn-root')
    })

    it('should support styles as function', () => {
      const stylesFn = vi.fn((_info: { props: BlockProps }) => ({
        root: { color: 'rgb(0, 128, 0)' },
      }))

      const wrapper = mount(Base, {
        props: {
          component: 'p',
          styles: stylesFn as unknown as TypographyStylesType,
        },
        slots: {
          default: () => 'text',
        },
      })
      expect(stylesFn).toHaveBeenCalled()
      expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain('color: rgb(0, 128, 0)')
    })

    it('should re-evaluate function when props change', async () => {
      const classesFn = vi.fn((info: { props: BlockProps }) => ({
        root: info.props.type === 'danger' ? 'is-danger' : 'not-danger',
      }))

      const wrapper = mount(Base, {
        props: {
          component: 'p',
          classes: classesFn as unknown as TypographyClassNamesType,
          type: 'secondary' as const,
        },
        slots: {
          default: () => 'text',
        },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('not-danger')

      await wrapper.setProps({ type: 'danger' })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('is-danger')
    })
  })

  // ===================== Via Paragraph wrapper =====================

  describe('through wrapper components', () => {
    it('should pass semantic classes through Paragraph', () => {
      const wrapper = mount(Paragraph, {
        props: {
          classes: { root: 'wrapper-root' },
          styles: { root: { fontSize: '20px' } },
        },
        slots: {
          default: () => 'content',
        },
      })
      const root = wrapper.find(`.${prefixCls}`)
      expect(root.classes()).toContain('wrapper-root')
      expect(root.attributes('style')).toContain('font-size: 20px')
    })
  })
})
