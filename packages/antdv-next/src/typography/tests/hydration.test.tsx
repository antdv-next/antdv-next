import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Paragraph from '../Paragraph'

const styleSupportState = vi.hoisted(() => ({ value: false }))

vi.mock('../../_util/styleChecker', () => ({
  isStyleSupport: () => styleSupportState.value,
}))

describe('typography hydration', () => {
  it('should avoid ellipsis class mismatch during hydration', async () => {
    const demoPath = 'docs/src/pages/components/carousel/demo/basic.vue'
    const Demo = defineComponent({
      setup() {
        return () => h(
          Paragraph,
          {
            type: 'secondary',
            ellipsis: {
              rows: 2,
              expandable: false,
            },
          },
          {
            default: () => demoPath,
          },
        )
      },
    })

    styleSupportState.value = false

    const ssrHtml = await renderToString(createSSRApp(Demo))

    styleSupportState.value = true

    const container = document.createElement('div')
    container.innerHTML = ssrHtml
    document.body.appendChild(container)

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const app = createSSRApp(Demo)
    app.mount(container)
    await nextTick()
    await nextTick()

    const warningMessages = [
      ...warnSpy.mock.calls.map(args => args.join(' ')),
      ...errorSpy.mock.calls.map(args => args.join(' ')),
    ]

    expect(warningMessages.some(message => message.includes('Hydration class mismatch'))).toBe(false)
    expect(container.querySelector('.ant-typography')?.className).toContain('ant-typography-ellipsis-multiple-line')

    app.unmount()
    warnSpy.mockRestore()
    errorSpy.mockRestore()
    container.remove()
  })
})
