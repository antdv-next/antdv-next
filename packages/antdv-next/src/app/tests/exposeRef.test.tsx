import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import App from '..'
import { mount } from '/@tests/utils'

describe('app exposed ref', () => {
  it('exposes message / notification / modal APIs via template ref', async () => {
    const Page = defineComponent({
      setup(_, { expose }) {
        const appRef = ref<any>()
        expose({ appRef })
        return () => h(App, { ref: appRef })
      },
    })

    const wrapper = mount(Page)
    await nextTick()

    const appRef = (wrapper.vm as any).appRef
    expect(appRef).toBeTruthy()

    // message API
    expect(appRef.message).toBeTruthy()
    expect(typeof appRef.message.open).toBe('function')
    expect(typeof appRef.message.success).toBe('function')
    expect(typeof appRef.message.info).toBe('function')
    expect(typeof appRef.message.warning).toBe('function')
    expect(typeof appRef.message.error).toBe('function')

    // notification API
    expect(appRef.notification).toBeTruthy()
    expect(typeof appRef.notification.open).toBe('function')
    expect(typeof appRef.notification.success).toBe('function')

    // modal API
    expect(appRef.modal).toBeTruthy()
    expect(typeof appRef.modal.confirm).toBe('function')
    expect(typeof appRef.modal.info).toBe('function')

    wrapper.unmount()
  })
})
