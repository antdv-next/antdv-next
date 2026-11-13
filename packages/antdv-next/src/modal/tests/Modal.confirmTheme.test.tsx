import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Modal from '..'
import ConfigProvider from '../../config-provider'
import { waitFakeTimer } from '/@tests/utils'

function collectStyles() {
  return Array.from(document.querySelectorAll('style'))
    .map(style => style.innerHTML)
    .join('\n')
    .toLowerCase()
}

describe('modal static confirm theme', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    Modal.destroyAll()
    await waitFakeTimer(20, 20)
    ConfigProvider.config({ theme: {} })
    await waitFakeTimer(1, 5)
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('uses the global theme when opened', async () => {
    ConfigProvider.config({ theme: { token: { colorPrimary: '#a1b2c3' } } })

    Modal.confirm({ title: 'test' })
    await waitFakeTimer(20, 10)

    expect(collectStyles()).toContain('#a1b2c3')
  })

  it('picks up a new token when the global theme changes after open', async () => {
    Modal.confirm({ title: 'test' })
    await waitFakeTimer(20, 10)

    expect(collectStyles()).not.toContain('#123456')

    ConfigProvider.config({ theme: { token: { colorPrimary: '#123456' } } })
    await nextTick()
    await nextTick()
    await waitFakeTimer(20, 10)

    expect(collectStyles()).toContain('#123456')
  })

  it('keeps the latest updated content after a theme change', async () => {
    const modal = Modal.confirm({ title: 'initial-title', content: 'initial-content' })
    await waitFakeTimer(20, 10)

    modal.update({ title: 'updated-title', content: 'updated-content' })
    await nextTick()
    await waitFakeTimer(20, 5)

    expect(document.querySelector('.ant-modal-confirm-title')?.textContent).toBe('updated-title')
    expect(document.querySelector('.ant-modal-confirm-content')?.textContent).toBe('updated-content')

    ConfigProvider.config({ theme: { token: { colorPrimary: '#d4e5f6' } } })
    await nextTick()
    await nextTick()
    await waitFakeTimer(20, 10)

    expect(document.querySelector('.ant-modal-confirm-title')?.textContent).toBe('updated-title')
    expect(document.querySelector('.ant-modal-confirm-content')?.textContent).toBe('updated-content')
    expect(collectStyles()).toContain('#d4e5f6')
  })

  it('stops listening to theme changes after destroy', async () => {
    const afterClose = vi.fn()
    const modal = Modal.confirm({ title: 'test', afterClose })
    await waitFakeTimer(20, 10)

    modal.destroy()
    await waitFakeTimer(20, 20)
    expect(afterClose).toHaveBeenCalled()
    expect(document.querySelector('.ant-modal')).toBeNull()

    ConfigProvider.config({ theme: { token: { colorPrimary: '#c0ffee' } } })
    await nextTick()
    await nextTick()
    await waitFakeTimer(20, 10)

    expect(collectStyles()).not.toContain('#c0ffee')
  })
})
