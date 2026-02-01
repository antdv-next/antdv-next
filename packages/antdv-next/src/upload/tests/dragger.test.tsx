// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Dragger from '../Dragger'
import { setup, teardown } from './mock'
import mountTest from '/@tests/shared/mountTest'

describe('upload.Dragger', () => {
  mountTest(Dragger)

  beforeEach(() => setup())
  afterEach(() => teardown())

  it('support drag file with over style', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Dragger, {
      props: { action: 'http://upload.com' },
      slots: { default: () => <div /> },
    })

    // .ant-upload-drag-container is inside VcUpload.
    // Events bubble up to .ant-upload-drag (handled by Upload.tsx)
    const container = wrapper.find('.ant-upload-drag-container')

    // Note: dataTransfer in event init might be tricky in some envs, but let's try
    const event = {
      dataTransfer: { files: [{ file: 'foo.png' }] },
    }
    await container.trigger('dragover', event)

    vi.runAllTimers()
    await wrapper.vm.$nextTick()

    const dragEl = wrapper.find('.ant-upload-drag')
    expect(dragEl.classes()).toContain('ant-upload-drag-hover')

    vi.useRealTimers()
  })

  it('support onDrop when files are dropped onto upload area', async () => {
    const onDrop = vi.fn()
    const wrapper = mount(Dragger, {
      props: { onDrop }, // Vue treats onDrop as listener for 'drop' event if defined in emits
      slots: { default: () => <div /> },
    })

    const container = wrapper.find('.ant-upload-drag-container')

    const event = {
      dataTransfer: {
        files: [new File(['foo'], 'foo.png', { type: 'image/png' })],
      },
    }

    await container.trigger('drop', event)

    expect(onDrop).toHaveBeenCalled()
  })
})
