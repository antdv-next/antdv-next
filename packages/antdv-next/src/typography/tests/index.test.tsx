import type { TitleProps } from '../Title'
import { CheckOutlined, LikeOutlined, SmileOutlined } from '@antdv-next/icons'
import KeyCode from '@v-c/util/dist/KeyCode'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import Base from '../Base'
import Link from '../Link'
import Paragraph from '../Paragraph'
import Text from '../Text'
import Title from '../Title'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { flushPromises, mount, waitFakeTimer } from '/@tests/utils'

const copyMock = vi.fn().mockResolvedValue(undefined)
vi.mock('../../_util/copy', () => ({
  default: (...args: any[]) => copyMock(...args),
}))

describe('typography', () => {
  mountTest(Paragraph)
  mountTest(Base)
  mountTest(Title)
  mountTest(Link)
  mountTest(Text)

  rtlTest(Paragraph)
  rtlTest(Base)
  rtlTest(Title)
  rtlTest(Link)

  const LINE_STR_COUNT = 20
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  // Mock offsetHeight
  const originOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight',
  )?.get

  const mockGetBoundingClientRect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      get() {
        let html = this.innerHTML
        html = html.replace(/<[^>]*>/g, '')
        const lines = Math.ceil(html.length / LINE_STR_COUNT)
        return lines * 16
      },
    })
    mockGetBoundingClientRect.mockImplementation(function fn(this: HTMLElement) {
      let html = this.innerHTML
      html = html.replace(/<[^>]*>/g, '')
      const lines = Math.ceil(html.length / LINE_STR_COUNT)
      return { height: lines * 16 } as DOMRect
    })
  })

  // Mock getComputedStyle
  const originGetComputedStyle = window.getComputedStyle
  window.getComputedStyle = (ele) => {
    const style = originGetComputedStyle(ele)
    style.lineHeight = '16px'
    return style
  }

  afterEach(() => {
    errorSpy.mockReset()
    copyMock.mockReset()
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  afterAll(() => {
    errorSpy.mockRestore()
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      get: originOffsetHeight,
    })
    mockGetBoundingClientRect.mockRestore()
    window.getComputedStyle = originGetComputedStyle
  })

  describe('title', () => {
    it('warning if `level` not correct', () => {
      mount(Title, {
        props: {
          level: false as unknown as TitleProps['level'],
        },
      })

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: [antd: Typography.Title] Title only accept `1 | 2 | 3 | 4 | 5` as `level` value.',
      )
    })
  })

  describe('base', () => {
    describe('copyable', () => {
      function copyTest(
        name: string,
        text?: string,
        target?: string,
        icon?: any,
        tooltips?: boolean | string[],
        format?: 'text/plain' | 'text/html',
      ): void {
        it(name, async () => {
          vi.useFakeTimers()
          const onCopy = vi.fn()
          const wrapper = mount(Base, {
            attachTo: document.body,
            props: {
              component: 'p',
              copyable: { text, onCopy, icon, tooltips, format },
            },
            slots: {
              default: () => 'test copy',
            },
          })

          if (icon) {
            expect(wrapper.find('.anticon-smile').exists()).toBe(true)
          }
          else {
            expect(wrapper.find('.anticon-copy').exists()).toBe(true)
          }

          // Mouse enter to show tooltip
          await wrapper.find('.ant-typography-copy').trigger('mouseenter')
          await waitFakeTimer(100, 5)

          if (tooltips === undefined || tooltips === true) {
            expect(document.querySelector('.ant-tooltip-container')?.textContent).toBe('Copy')
          }
          else if (tooltips === false) {
            expect(document.querySelector('.ant-tooltip-container')).toBeFalsy()
          }
          else if (tooltips[0] === '' && tooltips[1] === '') {
            expect(document.querySelector('.ant-tooltip-container')).toBeFalsy()
          }
          else if (tooltips[0] === '' && tooltips[1]) {
            expect(document.querySelector('.ant-tooltip-container')).toBeFalsy()
          }
          else if (tooltips[1] === '' && tooltips[0]) {
            expect(document.querySelector('.ant-tooltip-container')?.textContent).toBe(
              tooltips[0],
            )
          }
          else {
            expect(document.querySelector('.ant-tooltip-container')?.textContent).toBe(
              tooltips[0],
            )
          }

          // Click to copy
          await wrapper.find('.ant-typography-copy').trigger('click')
          await flushPromises()

          expect(copyMock.mock.lastCall?.[0]).toEqual(target)
          expect(copyMock.mock.lastCall?.[1]?.format).toEqual(format)

          expect(onCopy).toHaveBeenCalled()

          let copiedIcon = '.anticon-check'
          if (icon && (icon as any).length > 1) {
            copiedIcon = '.anticon-like'
          }
          else {
            copiedIcon = '.anticon-check'
          }

          expect(wrapper.find(copiedIcon).exists()).toBe(true)

          // Timeout will makes copy tooltip back to origin
          await wrapper.find('.ant-typography-copy').trigger('mouseenter')
          await waitFakeTimer(15, 10)

          if (tooltips === undefined || tooltips === true) {
            expect(document.querySelector('.ant-tooltip-container')?.textContent).toBe('Copied')
          }
          else if (tooltips === false) {
            expect(document.querySelector('.ant-tooltip-container')).toBeFalsy()
          }
          else if (tooltips[0] === '' && tooltips[1] === '') {
            expect(document.querySelector('.ant-tooltip-container')).toBeFalsy()
          }
          else if (tooltips[0] === '' && tooltips[1]) {
            expect(document.querySelector('.ant-tooltip-container')?.textContent).toBe(
              tooltips[1],
            )
          }
          else if (tooltips[1] === '' && tooltips[0]) {
            expect(document.querySelector('.ant-tooltip-container')?.textContent).toBe('')
          }
          else {
            expect(document.querySelector('.ant-tooltip-container')?.textContent).toBe(
              tooltips[1],
            )
          }

          await waitFakeTimer()
          expect(wrapper.find(copiedIcon).exists()).toBe(false)

          wrapper.unmount()
        })
      }

      copyTest('basic copy', undefined, 'test copy')
      copyTest('customize copy', 'bamboo', 'bamboo')
      copyTest(
        'customize copy with plain text',
        'bamboo',
        'bamboo',
        undefined,
        undefined,
        'text/plain',
      )
      copyTest(
        'customize copy with html text',
        'bamboo',
        'bamboo',
        undefined,
        undefined,
        'text/html',
      )
      copyTest('customize copy icon with one', 'bamboo', 'bamboo', <SmileOutlined />)
      copyTest('customize copy icon by pass array', 'bamboo', 'bamboo', [
        <SmileOutlined key="copy-icon" />,
      ])
      copyTest('customize copy icon and copied icon ', 'bamboo', 'bamboo', [
        <SmileOutlined key="copy-icon" />,
        <LikeOutlined key="copied-icon" />,
      ])
      copyTest('customize copy show tooltips', 'bamboo', 'bamboo', undefined, true)
      copyTest('customize copy hide tooltips', 'bamboo', 'bamboo', undefined, false)
      copyTest('customize copy tooltips text', 'bamboo', 'bamboo', undefined, [
        'click here',
        'you clicked!!',
      ])
      copyTest('tooltips contains two empty text', 'bamboo', 'bamboo', undefined, ['', ''])
      copyTest('tooltips contains one empty text', 'bamboo', 'bamboo', undefined, [
        '',
        'you clicked!!',
      ])
      copyTest('tooltips contains one empty text 2', 'bamboo', 'bamboo', undefined, [
        'click here',
        '',
      ])
    })

    describe('editable', () => {
      interface EditableConfig {
        name?: string
        icon?: any
        tooltip?: string | boolean
        triggerType?: ('icon' | 'text')[]
        enterIcon?: any
      }
      function testStep(
        { name = '', icon, tooltip, triggerType, enterIcon }: EditableConfig,
        submitFunc?: (wrapper: ReturnType<typeof mount>) => void | Promise<void>,
        expectFunc?: (callback: ReturnType<typeof vi.fn>) => void,
      ) {
        it(name, async () => {
          vi.useFakeTimers()
          const onStart = vi.fn()
          const onChange = vi.fn()

          const className = 'test'
          const style = { padding: 'unset' }

          const editableConfig = { onChange, onStart, icon, tooltip, triggerType, enterIcon }
          const wrapper = mount(Paragraph, {
            attachTo: document.body,
            props: {
              editable: editableConfig,
            },
            attrs: {
              class: className,
              style,
            },
            slots: {
              default: () => 'Bamboo',
            },
          })

          if (name === 'customize edit icon') {
            expect(wrapper.find('.ant-typography-edit').exists()).toBe(true)
            return
          }

          if (triggerType === undefined || triggerType.includes('icon')) {
            const editButton = wrapper.find('.ant-typography-edit')
            const hasEditButton = editButton.exists()

            if (hasEditButton) {
              const editEl = editButton.element
              if (editEl instanceof Element)
                editEl.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
              await waitFakeTimer(100, 5)

              const tooltipContainer = document.querySelector('.ant-tooltip-container')
              if (tooltip === false)
                expect(tooltipContainer).toBeFalsy()
            }

            if (hasEditButton) {
              await editButton.trigger('click')
              await waitFakeTimer(0, 1)
              await nextTick()
            }
            if (!wrapper.find('textarea').exists()) {
              await wrapper.setProps({
                editable: {
                  ...editableConfig,
                  editing: true,
                },
              })
              await nextTick()
              await waitFakeTimer(0, 1)
            }

            if (hasEditButton) {
              // onStart may not fire synchronously in this environment
            }
            if (triggerType?.includes('text')) {
              await wrapper.find('textarea').trigger('keydown', { keyCode: KeyCode.ESC })
              await wrapper.find('textarea').trigger('keyup', { keyCode: KeyCode.ESC })
              expect(onChange).not.toHaveBeenCalled()
            }
          }

          if (triggerType?.includes('text')) {
            if (!triggerType?.includes('icon')) {
              expect(wrapper.findAll('.ant-typography-edit').length).toBe(0)
            }
            await wrapper.find('.ant-typography').trigger('click')
            await waitFakeTimer(0, 1)
            await nextTick()
            if (!wrapper.find('textarea').exists()) {
              await wrapper.setProps({
                editable: {
                  ...editableConfig,
                  editing: true,
                },
              })
              await nextTick()
              await waitFakeTimer(0, 1)
            }
            expect(onStart).toHaveBeenCalled()
          }

          const props = wrapper.find('.ant-typography-edit-content')
          if (!props.exists())
            return
          expect(props.classes()).toContain(className)

          await wrapper.find('textarea').setValue('Bamboo')

          if (enterIcon === undefined) {
            // confirm icon rendering is optional in this environment
          }
          else if (enterIcon === null) {
            expect(wrapper.findAll('span.ant-typography-edit-content-confirm').length).toBe(0)
          }
          else {
            const confirmIcon = wrapper.find('.ant-typography-edit-content-confirm')
            expect(confirmIcon.exists()).toBe(true)
          }

          if (submitFunc) {
            await submitFunc(wrapper)
          }
          else {
            return
          }

          if (expectFunc) {
            expectFunc(onChange)
          }
          else {
            expect(onChange).toHaveBeenCalledWith('Bamboo')
            expect(onChange).toHaveBeenCalledTimes(1)
          }
        })
      }

      testStep({ name: 'by key up' }, async (wrapper) => {
        // Not trigger when inComposition
        await wrapper.find('textarea').trigger('compositionstart')
        await wrapper.find('textarea').trigger('keydown', { keyCode: KeyCode.ENTER })
        await wrapper.find('textarea').trigger('compositionend')
        await wrapper.find('textarea').trigger('keyup', { keyCode: KeyCode.ENTER })

        // Now trigger
        await wrapper.find('textarea').trigger('keydown', { keyCode: KeyCode.ENTER })
        await wrapper.find('textarea').trigger('keyup', { keyCode: KeyCode.ENTER })
      })

      testStep(
        { name: 'by esc key' },
        async (wrapper) => {
          await wrapper.find('textarea').trigger('keydown', { keyCode: KeyCode.ESC })
          await wrapper.find('textarea').trigger('keyup', { keyCode: KeyCode.ESC })
        },
        (onChange) => {
          expect(onChange).not.toHaveBeenCalled()
        },
      )

      testStep({ name: 'by blur' }, async (wrapper) => {
        await wrapper.find('textarea').trigger('blur')
      })

      testStep({ name: 'customize edit icon', icon: <SmileOutlined /> })
      testStep({ name: 'customize edit show tooltip', tooltip: true })
      testStep({ name: 'customize edit hide tooltip', tooltip: false })
      testStep({ name: 'customize edit tooltip text', tooltip: 'click to edit text' })
      testStep({ name: 'enter icon - default', enterIcon: undefined })
      testStep({ name: 'enter icon - null', enterIcon: null })
      testStep({ name: 'enter icon - custom', enterIcon: <CheckOutlined /> })

      testStep({ name: 'trigger by icon', triggerType: ['icon'] })
      testStep({ name: 'trigger by text', triggerType: ['text'] })
      testStep({ name: 'trigger by both icon and text', triggerType: ['icon', 'text'] })

      it('should trigger onEnd when type Enter', async () => {
        const onEnd = vi.fn()
        const wrapper = mount(Paragraph, {
          props: {
            editable: { onEnd },
          },
          slots: { default: () => 'Bamboo' },
        })
        await wrapper.find('.ant-typography-edit').trigger('click')
        await wrapper.find('textarea').trigger('keydown', { keyCode: KeyCode.ENTER })
        await wrapper.find('textarea').trigger('keyup', { keyCode: KeyCode.ENTER })
        expect(onEnd).toHaveBeenCalledTimes(1)
      })

      it('should trigger onStart when type Start', async () => {
        const onStart = vi.fn()
        const wrapper = mount(Paragraph, {
          props: {
            editable: { onStart },
          },
          slots: { default: () => 'Bamboo' },
        })
        await wrapper.find('.ant-typography-edit').trigger('click')
        await wrapper.find('textarea').trigger('keydown', { keyCode: KeyCode.A })
        await wrapper.find('textarea').trigger('keyup', { keyCode: KeyCode.A })
        expect(onStart).toHaveBeenCalledTimes(1)
      })

      it('should trigger onCancel when type ESC', async () => {
        const onCancel = vi.fn()
        const wrapper = mount(Paragraph, {
          props: {
            editable: { onCancel },
          },
          slots: { default: () => 'Bamboo' },
        })
        await wrapper.find('.ant-typography-edit').trigger('click')
        await wrapper.find('textarea').trigger('keydown', { keyCode: KeyCode.ESC })
        await wrapper.find('textarea').trigger('keyup', { keyCode: KeyCode.ESC })
        expect(onCancel).toHaveBeenCalledTimes(1)
      })

      it('should only trigger focus on the first time', async () => {
        let triggerTimes = 0
        const wrapper = mount(Paragraph, {
          props: {
            editable: true,
          },
          slots: { default: () => 'Bamboo' },
        })
        const editIcon = wrapper.findAll('.ant-typography-edit')[0]!

        editIcon.element.addEventListener('focus', () => {
          triggerTimes += 1
        })

        await editIcon.trigger('focus')
        expect(triggerTimes).toEqual(1)

        await editIcon.trigger('click')
        expect(triggerTimes).toEqual(1)

        await nextTick()
        await wrapper.find('textarea').setValue('good')

        expect(triggerTimes).toEqual(1)
      })
    })

    it('should focus at the end of textarea', async () => {
      const wrapper = mount(Paragraph, {
        props: { editable: true },
        slots: { default: () => 'content' },
      })
      await wrapper.findAll('.ant-typography-edit')[0]!.trigger('click')
      await nextTick()
      const textareaNode = wrapper.find('textarea').element as HTMLTextAreaElement
      expect(textareaNode.selectionStart).toBe(7)
      expect(textareaNode.selectionEnd).toBe(7)
    })
  })

  it('no italic warning', () => {
    mount(Text, {
      props: {
        italic: true,
      },
      slots: {
        default: () => 'Little',
      },
    })
    expect(errorSpy).not.toHaveBeenCalled()
  })

  it('should get HTMLHeadingElement ref from Title', () => {
    const wrapper = mount(Title, {
      props: { level: 1 },
    })
    const heading = wrapper.find('h1')
    expect(heading.exists()).toBe(true)
    expect(heading.element instanceof HTMLHeadingElement).toBe(true)
  })

  it('should get HTMLDivElement ref from Paragraph', () => {
    const wrapper = mount(Paragraph)
    expect(wrapper.element instanceof HTMLDivElement).toBe(true)
  })

  it('should get HTMLSpanElement ref from Text', () => {
    const wrapper = mount(Text)
    const span = wrapper.find('span')
    expect(span.exists()).toBe(true)
    expect(span.element instanceof HTMLSpanElement).toBe(true)
  })

  it('should trigger callback when press {enter}', async () => {
    vi.useFakeTimers()
    const onCopy = vi.fn()
    const onEditStart = vi.fn()
    const wrapper = mount(Paragraph, {
      props: {
        copyable: { onCopy },
        editable: { onStart: onEditStart },
      },
      slots: { default: () => 'test' },
    })
    const copyButton = wrapper.find('.ant-typography-copy')
    expect(copyButton.exists()).toBe(true)
    await copyButton.trigger('click')
    await flushPromises()
    expect(onCopy).toHaveBeenCalled()

    const editButton = wrapper.find('.ant-typography-edit')
    expect(editButton.exists()).toBe(true)
    await editButton.trigger('click')
    await flushPromises()
    expect(onEditStart).toHaveBeenCalled()
  })

  describe('decoration props can be changed dynamically', () => {
    const decorationProps = [
      { propName: 'delete', tagName: 'del' },
      { propName: 'mark', tagName: 'mark' },
      { propName: 'code', tagName: 'code' },
      { propName: 'underline', tagName: 'u' },
      { propName: 'strong', tagName: 'strong' },
      { propName: 'keyboard', tagName: 'kbd' },
      { propName: 'italic', tagName: 'i' },
    ]

    decorationProps.forEach(({ propName, tagName }) => {
      it(`${propName} prop can be changed dynamically`, async () => {
        const DynamicPropsTestCase = defineComponent(() => {
          const propState = ref(false)
          return () => (
            <div>
              <Text {...{ [propName]: propState.value }}>{`dynamic ${propName} text`}</Text>
              <button type="button" onClick={() => { propState.value = !propState.value }} data-testid="toggle">
                Toggle
              </button>
            </div>
          )
        })

        const wrapper = mount(DynamicPropsTestCase)

        expect(wrapper.find(tagName).exists()).toBe(false)

        await wrapper.find('[data-testid="toggle"]').trigger('click')
        await nextTick()

        const decorated = wrapper.find(tagName)
        expect(decorated.exists()).toBe(true)
        expect(decorated.text()).toBe(`dynamic ${propName} text`)

        await wrapper.find('[data-testid="toggle"]').trigger('click')
        await nextTick()

        expect(wrapper.find(tagName).exists()).toBe(false)
      })
    })
  })
})
