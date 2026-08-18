import type { UploadProps } from '../interface'

import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
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
