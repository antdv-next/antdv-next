import type { VNodeChild } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import ConfigProvider from '..'
import message, { actDestroy as destroyMessageInstance } from '../../message'
import notification, { actDestroy as destroyNotificationInstance } from '../../notification'
import { waitFakeTimer } from '/@tests/utils'

function withHolderProvider(children: VNodeChild): VNodeChild {
  return h(ConfigProvider, { prefixCls: 'prefix-2' }, { default: () => children })
}

describe('config-provider holderRender priority', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    message.destroy()
    notification.destroy()
    ConfigProvider.config({ prefixCls: '', holderRender: undefined })
    destroyMessageInstance()
    destroyNotificationInstance()
    await waitFakeTimer(1, 5)
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  it('applies holderRender prefix over the global prefix for message and notification', async () => {
    ConfigProvider.config({
      prefixCls: 'prefix-1',
      holderRender: withHolderProvider,
    })

    message.info({ content: 'holder message', duration: 0 })
    await waitFakeTimer(1, 5)

    expect(document.querySelectorAll('.prefix-2-message')).toHaveLength(1)
    expect(document.querySelectorAll('.prefix-1-message')).toHaveLength(0)

    notification.open({ title: 'holder notification', duration: 0 })
    await waitFakeTimer(1, 5)

    expect(document.querySelectorAll('.prefix-2-notification')).toHaveLength(1)
    expect(document.querySelectorAll('.prefix-1-notification')).toHaveLength(0)
  })
})
