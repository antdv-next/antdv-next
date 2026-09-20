import type { UploadFile } from '../interface'
import { describe, expect, it, vi } from 'vitest'
import UploadList from '../UploadList'
import { mount } from '/@tests/utils'

const items: UploadFile[] = [{ uid: '1', name: 'foo.png', status: 'done' }]

// https://github.com/ant-design/ant-design/pull/59295
describe('uploadList file name focusability', () => {
  it('is not focusable when no preview handler is registered', () => {
    const wrapper = mount({
      render: () => <UploadList items={items} />,
    })
    const name = wrapper.find('.ant-upload-list-item-name')
    expect(name.exists()).toBe(true)
    expect(name.attributes('role')).toBeUndefined()
    expect(name.attributes('tabindex')).toBeUndefined()
  })

  it('stays focusable and previewable when a preview handler is registered', async () => {
    const onPreview = vi.fn()
    const wrapper = mount({
      render: () => <UploadList items={items} onPreview={onPreview} />,
    })
    const name = wrapper.find('.ant-upload-list-item-name')
    expect(name.attributes('role')).toBe('button')
    expect(name.attributes('tabindex')).toBe('0')

    await name.trigger('click')
    expect(onPreview).toHaveBeenCalledWith(items[0])

    await name.trigger('keydown', { key: 'Enter' })
    expect(onPreview).toHaveBeenCalledTimes(2)
  })

  it('keeps the anchor interactive for files with a url', () => {
    const wrapper = mount({
      render: () => <UploadList items={[{ ...items[0], url: 'https://example.com/foo.png' }]} />,
    })
    const link = wrapper.find('a.ant-upload-list-item-name')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com/foo.png')
  })
})
