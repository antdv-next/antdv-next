import type { VNodeChild } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import ConfigProvider from '..'
import message, { actDestroy as destroyMessageInstance } from '../../message'
import Modal from '../../modal'
import notification, { actDestroy as destroyNotificationInstance } from '../../notification'
import { useBaseConfig } from '../context'
import { waitFakeTimer } from '/@tests/utils'

const ContextProbe = defineComponent(() => {
  const { getPrefixCls } = useBaseConfig()
  return () => h('span', { class: 'holder-context-probe' }, getPrefixCls('probe'))
})

function withHolderProvider(children: VNodeChild): VNodeChild {
  return h('div', [
    h(ContextProbe),
    h(ConfigProvider, { prefixCls: 'prefix-2' }, { default: () => children }),
  ])
}

describe('config-provider holderRender priority', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    message.destroy()
    notification.destroy()
    Modal.destroyAll()
    ConfigProvider.config({ prefixCls: '', holderRender: undefined })
    destroyMessageInstance()
    destroyNotificationInstance()
    await waitFakeTimer(1, 5)
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  it('applies holderRender prefix over the global prefix for message, notification and Modal.confirm', async () => {
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

    Modal.confirm({ title: 'holder modal', content: 'holder content' })
    await waitFakeTimer(1, 10)

    // Modal.confirm derives its prefix from the static root prefix; the
    // holderRender Provider cannot override it, matching Ant Design.
    expect(document.querySelectorAll('.prefix-1-modal')).toHaveLength(1)
    expect(document.querySelectorAll('.prefix-2-modal')).toHaveLength(0)

    // holderRender output renders inside the static ConfigProvider.
    const probes = Array.from(document.querySelectorAll('.holder-context-probe'))
    expect(probes.length).toBeGreaterThan(0)
    probes.forEach(probe => expect(probe.textContent).toBe('prefix-1-probe'))
  })
})
