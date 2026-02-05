import type { DraggerProps } from '../Dragger'
import type { UploadFile, UploadListProps, UploadProps } from '../interface'

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Upload from '..'
import Dragger from '../Dragger'
import UploadList from '../UploadList'

describe('upload.typescript', () => {
  it('upload', () => {
    const wrapper = mount({
      render: () => (
        <Upload>
          <span>click to upload</span>
        </Upload>
      ),
    })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('onChange', () => {
    const wrapper = mount({
      render: () => (
        <Upload onChange={({ file }: any) => file}>
          <span>click to upload</span>
        </Upload>
      ),

    })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('onChange params', () => {
    const wrapper = mount({
      render: () => (
        <Upload onChange={({ file }: any) => file.response?.customFile}>
          <span>click to upload</span>
        </Upload>
      ),
    })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('onChange fileList', () => {
    const wrapper = mount({
      render: () => (
        <Upload
          onChange={({ fileList }: { fileList: UploadFile[] }) => fileList.map(file => file.response?.customFile)}
        >
          <span>click to upload</span>
        </Upload>
      ),
    })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('onChange in UploadProps', () => {
    const uploadProps: UploadProps<File> = { }

    const wrapper = mount({
      render: () => (
        <Upload {...uploadProps} onChange={({ file }: { file: UploadFile<File>[] }) => file}>
          <span>click to upload</span>
        </Upload>
      ),
    })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('showUploadList', () => {
    const wrapper = mount({
      render: () => (
        <Upload
          showUploadList={{
            showPreviewIcon: true,
            showRemoveIcon: true,
            showDownloadIcon: true,
            removeIcon: 'Remove',
            downloadIcon: 'Download',
          }}
        >
          <span>click to upload</span>
        </Upload>
      ),
    })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('beforeUpload', () => {
    const wrapper = mount({
      render: () => (
        <Upload
          beforeUpload={(file) => {
            const { name: returnType } = file
            if (returnType === 'boolean') {
              return true
            }
            if (returnType === 'Promise<boolean>') {
              return Promise.resolve(false)
            }
            if (returnType === 'file') {
              return file
            }
            if (returnType === 'Promise<file>') {
              return Promise.resolve(file)
            }
            if (returnType === 'string') {
              return Upload.LIST_IGNORE
            }
            if (returnType === 'Promise<string>') {
              return Promise.resolve(Upload.LIST_IGNORE)
            }
            if (returnType === 'Promise<void>') {
              return Promise.resolve()
            }
          }}
        >
          <span>click to upload</span>
        </Upload>
      ),
    })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('beforeUpload async', () => {
    const wrapper = mount({
      render: () => (
        <Upload
          beforeUpload={async (file) => {
            const { name: returnType } = file
            if (returnType === 'boolean') {
              return true
            }
            if (returnType === 'file') {
              return file
            }
            if (returnType === 'string') {
              return Upload.LIST_IGNORE
            }
          }}
        >
          <span>click to upload</span>
        </Upload>
      ),
    })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('defaultFileList/fileList', () => {
    const fileList = [
      {
        uid: '-1',
        name: 'xxx.png',
        status: 'done' as const,
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '-2',
        name: 'yyy.png',
        status: 'error' as const,
      },
    ]
    const wrapper = mount({
      render: () => (
        <Upload fileList={fileList} defaultFileList={fileList} />
      ),
    })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('itemRender', () => {
    const wrapper = mount({
      render: () => (
        <Upload
          itemRender={(node, file, list, actions) => (
            <div>
              {node}
              {file.name}
              {list.length}
              <span onClick={actions.remove}>remove</span>
              <span onClick={actions.download}>download</span>
              <span onClick={actions.preview}>preview</span>
            </div>
          )}
        >
          <span>click to upload</span>
        </Upload>
      ),
    })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('data', () => {
    const upload1 = (
      <Upload
        data={() => ({
          url: '',
        })}
      >
        <span>click to upload</span>
      </Upload>
    )
    const upload2 = (
      <Upload
        data={() =>
          Promise.resolve({
            url: '',
          })}
      >
        <span>click to upload</span>
      </Upload>
    )
    const upload3 = (
      <Upload
        data={{
          url: '',
        }}
      >
        <span>click to upload</span>
      </Upload>
    )
    expect(mount({ render: () => upload1 }).exists()).toBeTruthy()
    expect(mount({ render: () => upload2 }).exists()).toBeTruthy()
    expect(mount({ render: () => upload3 }).exists()).toBeTruthy()
  })

  it('uploadProps type', () => {
    const uploadProps: UploadProps<number | string> = {
      customRequest({ onSuccess }) {
        onSuccess?.(1234)
        onSuccess?.('test')
      },
    }
    const wrapper = mount({
      render: () => <Upload {...uploadProps} />,
    })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('uploadListProps type', () => {
    const uploadListProps: UploadListProps<number | string> = {
      locale: {},
      removeIcon: file => <div>{JSON.stringify(file.response)}</div>,
      downloadIcon: file => <div>{JSON.stringify(file.response)}</div>,
      previewIcon: file => <div>{JSON.stringify(file.response)}</div>,
    }
    const wrapper = mount({
      render: () => <UploadList {...uploadListProps} />,
    })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('draggerProps type', () => {
    const draggerProps: DraggerProps<number | string> = {
      customRequest({ onSuccess }) {
        onSuccess?.(1234)
        onSuccess?.('test')
      },
    }
    const wrapper = mount({
      render: () => <Dragger {...draggerProps} />,
    })
    expect(wrapper.exists()).toBeTruthy()
  })
})
