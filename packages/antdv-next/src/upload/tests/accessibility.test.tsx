import type { UploadProps } from '../interface'

import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import Upload from '..'
import ConfigProvider from '../../config-provider'
import zhTW from '../../locale/zh_TW'
import { setup, teardown } from './mock'

const fileList: UploadProps['fileList'] = [
  {
    uid: 'report',
    name: 'report.pdf',
    status: 'done',
    url: '/report.pdf',
  },
]

describe('upload accessibility', () => {
  beforeEach(() => setup())
  afterEach(() => teardown())

  it('does not make a file without a preview focusable', () => {
    const wrapper = mount({
      render: () => (
        <Upload
          defaultFileList={[{ uid: 'report', name: 'report.txt', status: 'done' }]}
          showUploadList={{ showRemoveIcon: false }}
        />
      ),
    })

    const fileName = wrapper.find('.ant-upload-list-item-name')
    expect(fileName.attributes('role')).toBeUndefined()
    expect(fileName.attributes('tabindex')).toBeUndefined()
  })

  it('keeps the file name focusable when a preview handler exists', () => {
    const wrapper = mount({
      render: () => (
        <Upload
          defaultFileList={[{ uid: 'report', name: 'report.txt', status: 'done' }]}
          showUploadList={{ showRemoveIcon: false }}
          onPreview={() => {}}
        />
      ),
    })

    const fileName = wrapper.find('.ant-upload-list-item-name')
    expect(fileName.attributes('role')).toBe('button')
    expect(fileName.attributes('tabindex')).toBe('0')
  })

  it('updates focusable state when the preview handler is toggled', async () => {
    const withPreview = ref(false)
    const wrapper = mount({
      setup() {
        return () => (
          <Upload
            defaultFileList={[{ uid: 'report', name: 'report.txt', status: 'done' }]}
            showUploadList={{ showRemoveIcon: false }}
            onPreview={withPreview.value ? () => {} : undefined}
          />
        )
      },
    })

    const fileName = () => wrapper.find('.ant-upload-list-item-name')
    expect(fileName().attributes('role')).toBeUndefined()

    withPreview.value = true
    await nextTick()
    expect(fileName().attributes('role')).toBe('button')

    withPreview.value = false
    await nextTick()
    expect(fileName().attributes('role')).toBeUndefined()
  })

  it('uses the merged locale for default file actions', () => {
    const wrapper = mount({
      render: () => (
        <Upload
          fileList={fileList}
          listType="picture-card"
          locale={{ removeFile: 'Localized remove' }}
          showUploadList={{ showDownloadIcon: true }}
        />
      ),
    })

    expect(wrapper.find('a[title="Preview file"]').attributes('aria-label')).toBe('Preview file')
    expect(wrapper.find('button[title="Download file"]').attributes('aria-label')).toBe('Download file')
    expect(wrapper.find('button[title="Localized remove"]').attributes('aria-label')).toBe('Localized remove')
  })

  it('keeps localized action names when custom icons have their own names', () => {
    const wrapper = mount({
      render: () => (
        <ConfigProvider locale={zhTW}>
          <Upload
            fileList={fileList}
            listType="picture-card"
            showUploadList={{
              showDownloadIcon: true,
              removeIcon: () => <span role="img" aria-label="Remove icon" />,
              previewIcon: () => <span role="img" aria-label="Preview icon" />,
              downloadIcon: () => <span role="img" aria-label="Download icon" />,
            }}
          />
        </ConfigProvider>
      ),
    })

    expect(wrapper.find('button[aria-label="移除檔案"]').attributes('title')).toBe('移除檔案')
    expect(wrapper.find('a[aria-label="預覽檔案"]').attributes('title')).toBe('預覽檔案')
    expect(wrapper.find('button[aria-label="下載檔案"]').attributes('title')).toBe('下載檔案')
  })

  it('keeps the icon fallback when an action locale is empty', () => {
    const wrapper = mount({
      render: () => (
        <Upload
          fileList={fileList}
          listType="picture-card"
          locale={{ removeFile: '', previewFile: '' }}
        />
      ),
    })

    const removeButton = wrapper.find('.ant-upload-list-item-actions button')
    const previewLink = wrapper.find('.ant-upload-list-item-actions a')
    expect(removeButton.exists()).toBe(true)
    expect(previewLink.exists()).toBe(true)
    expect(removeButton.attributes('aria-label')).toBeUndefined()
    expect(previewLink.attributes('aria-label')).toBeUndefined()
    expect(removeButton.find('.anticon-delete').exists()).toBe(true)
    expect(previewLink.find('.anticon-eye').exists()).toBe(true)
  })
})
