import type { QRCodeProps } from '..'
import { describe, expect, it } from 'vitest'
import QRCode from '..'
import { mount } from '/@tests/utils'

describe('qrcode.Semantic', () => {
  it('should apply custom styles to QRCode', () => {
    const customClassNames = {
      root: 'custom-root',
      cover: 'custom-cover',
    }

    const customStyles = {
      root: { color: 'rgb(255, 0, 0)' },
      cover: { color: 'rgb(0, 0, 255)' },
    }

    const wrapper = mount(QRCode, {
      props: {
        classes: customClassNames,
        styles: customStyles,
        value: 'antd',
        status: 'loading',
      },
    })

    const QRCodeElement = wrapper.find('.ant-qrcode')
    const QRCodeCoverElement = wrapper.find('.ant-qrcode-cover')

    // check classNames
    expect(QRCodeElement.classes()).toContain('custom-root')
    expect(QRCodeCoverElement.classes()).toContain('custom-cover')

    // check styles
    expect((QRCodeElement.element as HTMLElement).style.color).toBe('rgb(255, 0, 0)')
    expect((QRCodeCoverElement.element as HTMLElement).style.color).toBe('rgb(0, 0, 255)')
  })

  it('support classNames and styles as functions', () => {
    const wrapper = mount(QRCode, {
      props: {
        value: 'test',
        size: 160,
        type: 'svg',
        bordered: true,
        status: 'expired',
        onRefresh: () => {},
        classes: (info: { props: QRCodeProps }) => ({
          root: info.props.type === 'svg' ? 'svg-qrcode' : 'canvas-qrcode',
          cover: `cover-${info.props.status}`,
        }),
        styles: (info: { props: QRCodeProps }) => ({
          root: {
            backgroundColor: info.props.type === 'svg' ? 'lightgreen' : 'lightcoral',
            borderRadius: info.props.size && info.props.size > 120 ? '8px' : '4px',
          },
          cover: {
            backgroundColor:
              info.props.status === 'expired' ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 255, 0, 0.8)',
            color: 'white',
          },
        }),
      },
    })

    const qrcode = wrapper.find('.ant-qrcode')
    const cover = wrapper.find('.ant-qrcode-cover')

    expect(qrcode.classes()).toContain('svg-qrcode')
    expect(cover.classes()).toContain('cover-expired')

    const rootStyle = (qrcode.element as HTMLElement).style
    expect(rootStyle.backgroundColor).toBe('lightgreen')
    expect(rootStyle.borderRadius).toBe('8px')

    const coverStyle = (cover.element as HTMLElement).style
    // Note: color format might differ in different browsers/environments (e.g. spaces), but we check value
    expect(coverStyle.backgroundColor).toBe('rgba(255, 0, 0, 0.8)')
    expect(coverStyle.color).toBe('white')
  })
})
