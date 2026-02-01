import type { UploadEmits, UploadFile, UploadProps } from '../interface'

import { mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Upload from '..'
import { setup, teardown } from './mock'
import { errorRequest, successRequest } from './requests'

const fileList: UploadProps['fileList'] = [
  {
    uid: '-1',
    name: 'xxx.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
  },
  {
    uid: '-2',
    name: 'yyy.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
]

describe('upload List', () => {
  // Mock for rc-component/util raf
  window.requestAnimationFrame = (callback: any) => window.setTimeout(callback, 16)
  window.cancelAnimationFrame = (id: any) => window.clearTimeout(id)

  // jsdom not support `createObjectURL` yet. Let's handle this.
  const originCreateObjectURL = window.URL.createObjectURL
  window.URL.createObjectURL = vi.fn(() => '')
  const originRevokeObjectURL = window.URL.revokeObjectURL
  window.URL.revokeObjectURL = vi.fn(() => '')

  // Mock dom
  let size = { width: 0, height: 0 }
  function setSize(width: number, height: number) {
    size = { width, height }
  }
  const mockWidthGet = vi.spyOn(Image.prototype, 'width', 'get')
  const mockHeightGet = vi.spyOn(Image.prototype, 'height', 'get')
  const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')
  const mockSrcSet = vi.spyOn(Image.prototype, 'src', 'set')

  let drawImageCallback: any = null
  function hookDrawImageCall(callback: any) {
    drawImageCallback = callback
  }
  const mockGetCanvasContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext')
  const mockToDataURL = vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL')

  // HTMLCanvasElement.prototype

  let open: any
  beforeAll(() => {
    open = vi.spyOn(window, 'open').mockImplementation(() => null)
    mockWidthGet.mockImplementation(() => size.width)
    mockHeightGet.mockImplementation(() => size.height)
    mockSrcSet.mockImplementation(function fn(this: any, val: string) {
      if (originalSrcDescriptor?.set) {
        originalSrcDescriptor.set.call(this, val)
      }
      this.onload?.()
    })

    mockGetCanvasContext.mockReturnValue({
      drawImage(...args: any[]) {
        if (drawImageCallback) {
          drawImageCallback(...args)
        }
      },
    } as any)
    mockToDataURL.mockReturnValue('data:image/png;base64,')
  })
  beforeEach(() => {
    vi.useFakeTimers()
    return setup()
  })
  afterEach(() => {
    teardown()
    drawImageCallback = null
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  afterAll(() => {
    window.URL.createObjectURL = originCreateObjectURL
    window.URL.revokeObjectURL = originRevokeObjectURL
    mockWidthGet.mockRestore()
    mockHeightGet.mockRestore()
    mockSrcSet.mockRestore()
    mockGetCanvasContext.mockRestore()
    mockToDataURL.mockRestore()
    open.mockRestore()
  })

  it('should use file.thumbUrl for <img /> in priority', () => {
    const wrapper = mount({
      render: () => (
        <Upload defaultFileList={fileList} listType="picture">
          <button type="button">upload</button>
        </Upload>
      ),
    })

    fileList.forEach((file, i) => {
      const linkNode = wrapper.findAll('.ant-upload-list-item-thumbnail')[i]
      const imgNode = wrapper.findAll('.ant-upload-list-item-thumbnail img')[i]
      expect(linkNode?.attributes('href')).toBe(file.url)
      expect(imgNode?.attributes('src')).toBe(file.thumbUrl)
    })
  })

  it('support classNames and styles', () => {
    const customClassNames = {
      root: 'custom-root',
      list: 'custom-list',
      item: 'custom-item',
    }
    const customStyles = {
      root: { color: 'rgba(40, 167, 69, 0.9)' },
      list: { color: 'rgba(255, 193, 7, 0.7)' },
      item: { color: 'rgb(255, 0, 0)' },
    }
    const wrapper = mount({
      render: () => (
        <Upload
          defaultFileList={fileList}
          classes={customClassNames}
          styles={customStyles}
        >
          <button type="button">upload</button>
        </Upload>
      ),
    })

    const list = wrapper.find('.ant-upload-list')
    const item = wrapper.find('.ant-upload-list-item')

    if (customClassNames.root)
      expect(wrapper.classes()).toContain(customClassNames.root)
    if (customClassNames.list)
      expect(list.classes()).toContain(customClassNames.list)
    if (customClassNames.item)
      expect(item.classes()).toContain(customClassNames.item)
  })

  it('should remove correct item when uid is 0', async () => {
    const list = [
      {
        uid: '0',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
      },
      {
        uid: '1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
      },
    ]
    const wrapper = mount({
      render: () => (
        <Upload defaultFileList={list as UploadProps['defaultFileList']}>
          <button type="button">upload</button>
        </Upload>
      ),
    })

    expect(wrapper.findAll('.ant-upload-list-item').length).toBe(2)

    const items = wrapper.findAll('.ant-upload-list-item')
    const firstItemActions = items[0]?.findAll('.ant-upload-list-item-action')

    await firstItemActions?.[firstItemActions.length - 1]?.trigger('click')

    await vi.runAllTimersAsync()

    await nextTick()

    expect(wrapper.findAll('.ant-upload-list-item-container')).toHaveLength(1)
  })

  it('should be uploading when upload a file', async () => {
    const done = vi.fn()
    let latestFileList: any = null
    let wrapper: any
    const onChange: UploadEmits['change'] = async ({ file, fileList }) => {
      const eventFileList = fileList
      if (latestFileList) {
        expect(eventFileList === latestFileList).toBeFalsy()
      }
      latestFileList = eventFileList

      if (file.status === 'uploading') {
        await Promise.resolve()
        expect(wrapper.element).toMatchSnapshot()
      }
      if (file.status === 'done') {
        done()
      }
    }

    wrapper = mount({
      render: () => (
        <Upload
          action="http://jsonplaceholder.typicode.com/posts/"
          onChange={onChange}
          customRequest={successRequest}
        >
          <button type="button">upload</button>
        </Upload>
      ),
    })

    // Simulate file upload
    const input = wrapper.find('input[type="file"]')
    const file = new File([''], 'foo.png', { type: 'image/png' })
    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: false,
    })
    await input.trigger('change')

    await vi.runAllTimersAsync()

    expect(done).toHaveBeenCalled()
  })

  it('handle error', async () => {
    const onChange = vi.fn()
    const wrapper = mount({
      render: () => (
        <Upload
          action="http://jsonplaceholder.typicode.com/posts/"
          onChange={onChange}
          customRequest={errorRequest}
        >
          <button type="button">upload</button>
        </Upload>
      ),
    })

    const input = wrapper.find('input[type="file"]')
    const file = new File([''], 'foo.png', { type: 'image/png' })
    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: false,
    })
    await input.trigger('change')

    await vi.runAllTimersAsync()

    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        file: expect.objectContaining({ status: 'error' }),
      }),
    )

    // Error message
    await wrapper.find('.ant-upload-list-item').trigger('mouseenter')

    await vi.runAllTimersAsync()
  })

  it('does concat fileList when beforeUpload returns false', async () => {
    const handleChange = vi.fn()
    const wrapper = mount({
      render: () => (
        <Upload
          listType="picture"
          defaultFileList={fileList}
          onChange={handleChange}
          beforeUpload={() => false}
        >
          <button type="button">upload</button>
        </Upload>
      ),
    })

    const input = wrapper.find('input[type="file"]')
    const file = new File([''], 'foo.png', { type: 'image/png' })
    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: false,
    })
    await input.trigger('change')

    await vi.runAllTimersAsync()

    expect(wrapper.findAll('.ant-upload-list-item').length).toBe(fileList.length + 1)
    expect(handleChange.mock.calls[0]![0].fileList).toHaveLength(3)
  })

  it('in the case of listType=picture, the error status does not show the download.', () => {
    const file = { status: 'error', uid: 'file', name: 'error.png' }
    const wrapper = mount({
      render: () => (
        <Upload
          listType="picture"
          fileList={[file] as UploadProps['fileList']}
          showUploadList={{ showDownloadIcon: true }}
        >
          <button type="button">upload</button>
        </Upload>
      ),
    })

    wrapper.find('.ant-upload-list-item-error').trigger('mouseenter')

    expect(wrapper.findAll('div.ant-upload-list-item .anticon-download').length).toBe(0)
  })

  it('in the case of listType=picture-card, the error status does not show the download.', () => {
    const file = { status: 'error', uid: 'file', name: 'error.png' }
    const wrapper = mount({
      render: () => (
        <Upload
          listType="picture-card"
          fileList={[file] as UploadProps['fileList']}
          showUploadList={{ showDownloadIcon: true }}
        >
          <button type="button">upload</button>
        </Upload>
      ),
    })
    expect(wrapper.findAll('div.ant-upload-list-item .anticon-download').length).toBe(0)
  })

  it('in the case of listType=text, the error status does not show the download.', () => {
    const file = { status: 'error', uid: 'file', name: 'error.png' }
    const wrapper = mount({
      render: () => (
        <Upload
          listType="text"
          fileList={[file] as UploadProps['fileList']}
          showUploadList={{ showDownloadIcon: true }}
        >
          <button type="button">upload</button>
        </Upload>
      ),
    })
    expect(wrapper.findAll('div.ant-upload-list-item .anticon-download').length).toBe(0)
  })

  it('should support onPreview', async () => {
    const handlePreview = vi.fn()
    const wrapper = mount({
      render: () => (
        <Upload
          listType="picture-card"
          defaultFileList={fileList}
          onPreview={handlePreview}
        >
          <button type="button">upload</button>
        </Upload>
      ),
    })
    await wrapper.findAll('.anticon-eye')[0]!.trigger('click')
    expect(handlePreview).toHaveBeenCalledWith(expect.objectContaining({ uid: fileList![0]!.uid }))
    await wrapper.findAll('.anticon-eye')[1]!.trigger('click')
    expect(handlePreview).toHaveBeenCalledWith(expect.objectContaining({ uid: fileList![1]!.uid }))
  })

  it('should support onRemove', async () => {
    const handleRemove = vi.fn()
    const handleChange = vi.fn()
    const wrapper = mount({
      render: () => (
        <Upload
          listType="picture-card"
          defaultFileList={fileList}
          onRemove={handleRemove}
          onChange={handleChange}
        >
          <button type="button">upload</button>
        </Upload>
      ),
    })
    const items = wrapper.findAll('.ant-upload-list-item')
    expect(items.length).toBe(2)

    const firstItemActions = items[0]!.findAll('.ant-upload-list-item-action')
    await firstItemActions[firstItemActions.length - 1]!.trigger('click')
    expect(handleRemove).toHaveBeenCalledWith(expect.objectContaining({ uid: fileList![0]!.uid }))

    const secondItemActions = items[1]!.findAll('.ant-upload-list-item-action')
    await secondItemActions[secondItemActions.length - 1]!.trigger('click')
    expect(handleRemove).toHaveBeenCalledWith(expect.objectContaining({ uid: fileList![1]!.uid }))

    await vi.runAllTimersAsync()
    expect(handleChange).toHaveBeenCalledTimes(2)
  })

  it('should support onDownload', async () => {
    const handleDownload = vi.fn()
    const wrapper = mount({
      render: () => (
        <Upload
          listType="picture-card"
          defaultFileList={[
            {
              uid: '0',
              name: 'xxx.png',
              status: 'done',
              url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
          ]}
          onDownload={handleDownload}
          showUploadList={{
            showDownloadIcon: true,
          }}
        >
          <button type="button">upload</button>
        </Upload>
      ),
    })
    const actions = wrapper.findAll('.ant-upload-list-item-action')
    await actions[0]!.trigger('click')
    expect(handleDownload).toHaveBeenCalled()
  })

  it('should support no onDownload', async () => {
    const wrapper = mount({
      render: () => (
        <Upload
          listType="picture-card"
          defaultFileList={[
            {
              uid: '0',
              name: 'xxx.png',
              status: 'done',
              url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
          ]}
          showUploadList={{
            showDownloadIcon: true,
          }}
        >
          <button type="button">upload</button>
        </Upload>
      ),
    })
    const actions = wrapper.findAll('.ant-upload-list-item-action')
    await actions[0]!.trigger('click')
  })

  // thumbUrl generation tests
  describe('should generate thumbUrl from file', () => {
    [
      { width: 100, height: 200, name: 'height large than width' },
      { width: 200, height: 100, name: 'width large than height' },
    ].forEach(({ width, height, name }) => {
      it(name, async () => {
        setSize(width, height)
        const onDrawImage = vi.fn()
        hookDrawImageCall(onDrawImage)

        const handlePreview = vi.fn()
        const newFileList: UploadProps['fileList'] = [...fileList]
        const newFile = {
          ...fileList[0],
          uid: '-3',
          originFileObj: new File([], 'xxx.png', { type: 'image/png' }),
        }

        delete newFile.thumbUrl
        newFileList.push(newFile as UploadFile)

        mount({
          render: () => (
            <Upload
              listType="picture-card"
              defaultFileList={newFileList}
              onPreview={handlePreview}
            >
              <button type="button">upload</button>
            </Upload>
          ),
        })

        await vi.runAllTimersAsync()
        await nextTick()

        expect(onDrawImage).toHaveBeenCalled()
        // Offset check
        const [, offsetX, offsetY] = onDrawImage.mock.calls[0]!
        expect((width > height ? offsetX : offsetY) === 0).toBeTruthy()
      })
    })
  })
})
