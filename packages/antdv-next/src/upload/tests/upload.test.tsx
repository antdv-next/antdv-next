import type { PropType } from 'vue'
import type { UploadFile } from '../interface'

// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import Upload from '..'
import { setup, teardown } from './mock'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'

async function waitFakeTimer() {
  for (let i = 0; i < 10; i++) {
    vi.advanceTimersByTime(200)
    await nextTick()
  }
}

describe('upload', () => {
  mountTest(Upload)
  rtlTest(Upload)

  beforeAll(() => {
    vi.useFakeTimers()
  })
  beforeEach(() => setup())
  afterEach(() => {
    vi.clearAllTimers()
    return teardown()
  })
  afterAll(() => {
    vi.useRealTimers()
  })

  it('return promise in beforeUpload', async () => {
    const data = vi.fn()
    const done = vi.fn()
    const props = {
      action: 'http://upload.com',
      beforeUpload: () =>
        new Promise<string>((resolve) => {
          setTimeout(() => resolve('success'), 100)
        }),
      data,
      onChange: ({ file }: any) => {
        if (file.status !== 'uploading') {
          expect(data).toHaveBeenCalled()
          done()
        }
      },
    }

    const wrapper = mount({
      render: () => (
        <Upload {...props}>
          <button type="button">upload</button>
        </Upload>
      ),
    })

    const input = wrapper.find('input').element as HTMLInputElement
    Object.defineProperty(input, 'files', {
      value: [{ name: 'foo.png' }],
      writable: true,
    })

    await wrapper.find('input').trigger('change')

    await waitFakeTimer()
    expect(done).toHaveBeenCalled()
  })

  it('beforeUpload can be falsy', async () => {
    const done = vi.fn()
    const props = {
      action: 'http://upload.com',
      beforeUpload: () => false,
      onChange: ({ file }: any) => {
        if (file.status !== 'uploading') {
          done()
        }
      },
    }

    const wrapper = mount({
      render: () => (
        <Upload {...props}>
          <button type="button">upload</button>
        </Upload>
      ),
    })

    const input = wrapper.find('input').element as HTMLInputElement
    Object.defineProperty(input, 'files', {
      value: [{ name: 'foo.png' }],
      writable: true,
    })

    await wrapper.find('input').trigger('change')
    await waitFakeTimer()
    expect(done).toHaveBeenCalled()
  })

  it('upload promise return file in beforeUpload', async () => {
    const done = vi.fn()
    const data = vi.fn()
    const props = {
      action: 'http://upload.com',
      beforeUpload: (file: File) =>
        new Promise<File>((resolve) => {
          setTimeout(() => {
            const result = file
            // @ts-expect-error: result.name is readonly
            result.name = 'test.png'
            resolve(result)
          }, 100)
        }),
      data,
      onChange: ({ file }: { file: File & { status: string } }) => {
        if (file.status !== 'uploading') {
          expect(data).toHaveBeenCalled()
          expect(file.name).toEqual('test.png')
          done()
        }
      },
    }

    const wrapper = mount({
      render: () => (
        <Upload {...props}>
          <button type="button">upload</button>
        </Upload>
      ),
    })

    const input = wrapper.find('input').element as HTMLInputElement
    Object.defineProperty(input, 'files', {
      value: [{ name: 'foo.png' }],
      writable: true,
    })

    await wrapper.find('input').trigger('change')
    await waitFakeTimer()

    expect(done).toHaveBeenCalled()
  })

  it('should not stop upload when return value of beforeUpload is false', async () => {
    const done = vi.fn()
    const fileList = [
      {
        uid: 'bar',
        name: 'bar.png',
      },
    ]
    const mockFile = new File(['foo'], 'foo.png', {
      type: 'image/png',
    })
    const data = vi.fn()
    const props = {
      action: 'http://upload.com',
      fileList,
      beforeUpload: () => false,
      data,
      onChange: ({ file: _file, fileList: updatedFileList }: any) => {
        expect(updatedFileList.map((f: any) => f.name)).toEqual(['bar.png', 'foo.png'])
        expect(data).not.toHaveBeenCalled()
        done()
      },
    }

    const wrapper = mount({
      render: () => (
        <Upload {...props}>
          <button type="button">upload</button>
        </Upload>
      ),
    })

    const input = wrapper.find('input').element as HTMLInputElement
    Object.defineProperty(input, 'files', {
      value: [mockFile],
      writable: true,
    })

    await wrapper.find('input').trigger('change')
    await waitFakeTimer()
    expect(done).toHaveBeenCalled()
  })

  it('should not stop upload when return value of beforeUpload is not false', async () => {
    const done = vi.fn()
    const data = vi.fn()
    const props = {
      action: 'http://upload.com',
      beforeUpload() {},
      data,
      onChange: () => {
        expect(data).toHaveBeenCalled()
        done()
      },
    }

    const wrapper = mount({
      render: () => (
        <Upload {...props}>
          <button type="button">upload</button>
        </Upload>
      ),
    })

    const input = wrapper.find('input').element as HTMLInputElement
    Object.defineProperty(input, 'files', {
      value: [{ name: 'foo.png' }],
      writable: true,
    })

    await wrapper.find('input').trigger('change')
    await waitFakeTimer()
    expect(done).toHaveBeenCalled()
  })

  // https://github.com/ant-design/ant-design/issues/14779
  it('should contain input file control if upload button is hidden', async () => {
    const wrapper = mount({
      render: () => (
        <Upload action="http://upload.com">
          <button type="button">upload</button>
        </Upload>
      ),
    })

    expect(wrapper.findAll('input[type="file"]')).toHaveLength(1)

    // To test removal of children, we need a wrapper component or use setProps if possible (but slots can't be changed via setProps easily)
    // So we just mount a new one without children
    const wrapper2 = mount({
      render: () => (
        <Upload action="http://upload.com" />
      ),
    })
    expect(wrapper2.findAll('input[type="file"]')).toHaveLength(1)
  })

  // https://github.com/ant-design/ant-design/issues/14298
  it('should not have id if upload children is null, avoid being triggered by label', async () => {
    const Wrapper = defineComponent({
      props: {
        showChildren: {
          type: Boolean,
          default: undefined,
        },
      },
      setup(props: { showChildren: boolean }) {
        return () => (
          <Upload id="upload">
            {props.showChildren ? <div>upload</div> : null}
          </Upload>
        )
      },
    })

    const showChildren = ref(true)
    const wrapper = mount({
      render: () => (
        <Wrapper showChildren={showChildren.value} />
      ),
    })

    expect(wrapper.find('input#upload').exists()).toBe(true)
    showChildren.value = false
    await nextTick()
    expect(wrapper.find('input#upload').exists()).toBe(false)
  })

  // https://github.com/ant-design/ant-design/issues/16478
  it('should not have id if Upload is disabled, avoid being triggered by label', async () => {
    const Wrapper = defineComponent({
      props: {
        disabled: {
          type: Boolean,
          default: undefined,
        },
      },
      setup(props: { disabled: boolean }) {
        return () => (
          <Upload disabled={props.disabled} id="upload">
            <div>upload</div>
          </Upload>
        )
      },
    })

    const disabled = ref(false)
    const wrapper = mount({
      render: () => (
        <Wrapper disabled={disabled.value} />
      ),
    })
    expect(wrapper.findAll('input#upload').length).toBe(1)
    disabled.value = true
    await nextTick()
    expect(wrapper.findAll('input#upload').length).toBe(0)
  })

  it('should be controlled by fileList', async () => {
    const fileList = ref<UploadFile[]>([])

    const uploadRef = ref()
    const WrapperWithRef = defineComponent({
      props: {
        fileList: {
          type: Array as PropType<UploadFile[]>,
          default: () => [],
        },
      },
      setup(props: { fileList: UploadFile[] }) {
        return () => (
          <Upload ref={uploadRef} fileList={props.fileList} />
        )
      },
    })

    mount({
      render: () => (
        <WrapperWithRef fileList={fileList.value} />
      ),
    })

    expect(uploadRef.value.fileList).toEqual([])

    fileList.value = [
      {
        uid: '-1',
        name: 'foo.png',
        status: 'done',
        url: 'http://www.baidu.com/xxx.png',
      },
    ]
    await nextTick()
    await waitFakeTimer()
    expect(uploadRef.value.fileList).toEqual(fileList.value)
  })

  it('should be able to get uid at first', () => {
    const fileList = [
      {
        name: 'foo.png',
        status: 'done',
        url: 'http://www.baidu.com/xxx.png',
      },
    ] as UploadFile[]
    mount({
      render: () => (
        <Upload fileList={fileList} />
      ),
    })
    fileList.forEach((file) => {
      expect(file.uid).toBeDefined()
    })
  })

  it('should support linkProps as object', () => {
    const fileList = [
      {
        uid: '-1',
        name: 'foo.png',
        status: 'done',
        url: 'http://www.baidu.com/xxx.png',
        linkProps: {
          download: 'image',
          rel: 'noopener',
        },
      },
    ] as UploadFile[]
    const wrapper = mount({
      render: () => (
        <Upload fileList={fileList} />
      ),
    })
    const linkNode = wrapper.find('a.ant-upload-list-item-name')
    expect(linkNode.attributes('download')).toBe('image')
    expect(linkNode.attributes('rel')).toBe('noopener')
  })

  it('should support linkProps as json stringify', () => {
    const linkPropsString = JSON.stringify({
      download: 'image',
      rel: 'noopener',
    })
    const fileList = [
      {
        uid: '-1',
        name: 'foo.png',
        status: 'done',
        url: 'http://www.baidu.com/xxx.png',
        linkProps: linkPropsString,
      },
    ] as UploadFile[]
    const wrapper = mount({
      render: () => (
        <Upload fileList={fileList} />
      ),
    })
    const linkNode = wrapper.find('a.ant-upload-list-item-name')
    expect(linkNode.attributes('download')).toBe('image')
    expect(linkNode.attributes('rel')).toBe('noopener')
  })

  it('should stop remove when return value of onRemove is false', async () => {
    const mockRemove = vi.fn(() => false)
    const props = {
      onRemove: mockRemove,
      fileList: [
        {
          uid: '-1',
          name: 'foo.png',
          status: 'done',
          url: 'http://www.baidu.com/xxx.png',
        },
      ] as UploadFile[],
    }

    const wrapper = mount({
      render: () => (
        <Upload {...props} />
      ),
    })

    await wrapper.find('div.ant-upload-list-item .anticon-delete').trigger('click')

    await waitFakeTimer()

    expect(mockRemove).toHaveBeenCalled()
    expect(props.fileList).toHaveLength(1)
    expect(props.fileList?.[0]?.status).toBe('done')
  })

  it('should not abort uploading until return value of onRemove is resolved as true', async () => {
    const file = {
      uid: '-1',
      name: 'foo.png',
      status: 'uploading',
      url: 'http://www.baidu.com/xxx.png',
    } as UploadFile

    let removePromise: (value: boolean | Promise<undefined | boolean>) => void

    const onRemove = () =>
      new Promise<boolean | void>((resolve) => {
        expect(file.status).toBe('uploading')
        removePromise = resolve
      })
    const onChange = vi.fn()

    const wrapper = mount({
      render: () => (
        <Upload fileList={[file]} onChange={onChange} onRemove={onRemove} />
      ),
    })

    await wrapper.find('div.ant-upload-list-item .anticon-delete').trigger('click')

    // Delay return true for remove
    await waitFakeTimer()

    removePromise!(true)
    await nextTick()
    await waitFakeTimer()

    expect(onChange).toHaveBeenCalled()
    expect(file.status).toBe('removed')
  })

  it('should not stop download when return use onDownload', async () => {
    const mockRemove = vi.fn(() => false)
    const props = {
      onRemove: mockRemove,
      showUploadList: {
        showDownloadIcon: true,
      },
      fileList: [
        {
          uid: '-1',
          name: 'foo.png',
          status: 'done',
          url: 'http://www.baidu.com/xxx.png',
        },
      ] as UploadFile[],
    }

    const wrapper = mount({
      render: () => (
        <Upload {...props} onDownload={() => {}} />
      ),
    })

    await wrapper.find('div.ant-upload-list-item .anticon-download').trigger('click')

    await waitFakeTimer()
    expect(props.fileList).toHaveLength(1)
    expect(props.fileList?.[0]?.status).toBe('done')
  })

  it('should apply style to all types of Upload components', () => {
    // Normal type
    const normalWrapper = mount({
      render: () => (
        <Upload style={{ background: 'red' }}>
          <button>upload</button>
        </Upload>
      ),
    })
    const normalEl = normalWrapper.find('.ant-upload')
    expect(normalEl.exists()).toBeTruthy()
    expect(normalEl.attributes('style')).toContain('background: red')

    // Drag type
    const dragWrapper = mount({
      render: () => (
        <Upload type="drag" style={{ background: 'green' }}>
          <button>upload</button>
        </Upload>
      ),
    })
    const dragEl = dragWrapper.find('.ant-upload-drag')
    expect(dragEl.exists()).toBeTruthy()
    expect(dragEl.attributes('style')).toContain('background: green')

    // // Picture-card type
    const pictureCardWrapper = mount({
      render: () => (
        <Upload listType="picture-card" style={{ background: 'blue' }}>
          <button>upload</button>
        </Upload>
      ),
    })
    const pictureCardEl = pictureCardWrapper.find('.ant-upload')
    expect(pictureCardEl.exists()).toBeTruthy()
    expect(pictureCardEl.attributes('style')).toContain('background: blue')
  })

  // https://github.com/ant-design/ant-design/issues/25077
  it('should support events', async () => {
    const onClick = vi.fn()
    const onMouseenter = vi.fn()
    const onMouseleave = vi.fn()
    const props = { onClick, onMouseenter, onMouseleave }
    const wrapper = mount({
      render: () => (
        <Upload {...props}>
          <button>upload</button>
        </Upload>
      ),
    })

    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalled()

    await wrapper.trigger('mouseenter')
    expect(onMouseenter).toHaveBeenCalled()

    await wrapper.trigger('mouseleave')
    expect(onMouseleave).toHaveBeenCalled()
  })
})
