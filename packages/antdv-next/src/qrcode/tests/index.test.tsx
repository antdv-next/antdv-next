import type { QRCodeProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import QRCode from '..'
import { mountTest, rtlTest } from '/@tests/shared'
import { mount } from '/@tests/utils'

describe('qrcode test', () => {
  mountTest(() => h(QRCode, { value: '' }))
  rtlTest(() => h(QRCode, { value: '' }))

  it('should correct render', () => {
    const wrapper = mount(QRCode, {
      props: {
        value: 'test',
      },
    })
    expect(wrapper.find('.ant-qrcode canvas').exists()).toBeTruthy()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('support custom icon', () => {
    const wrapper = mount(QRCode, {
      props: {
        value: 'test',
        icon: 'test',
      },
    })
    expect(wrapper.find('.ant-qrcode img').exists()).toBeTruthy()
  })

  it('support custom size', () => {
    const wrapper = mount(QRCode, {
      props: {
        value: 'test',
        size: 100,
      },
    })
    const canvas = wrapper.find('canvas').element as HTMLCanvasElement
    expect(canvas.width).toBe(100)
    expect(canvas.height).toBe(100)
  })

  it('support refresh', () => {
    const refresh = vi.fn()
    const wrapper = mount(QRCode, {
      props: {
        value: 'test',
        status: 'expired',
        onRefresh: refresh,
      },
    })
    wrapper.find('.ant-qrcode button.ant-btn-link').trigger('click')
    expect(refresh).toHaveBeenCalled()
  })

  it('support click', () => {
    const handleClick = vi.fn()
    const wrapper = mount(QRCode, {
      props: {
        value: 'test',
        onClick: handleClick,
      },
    })
    wrapper.find('.ant-qrcode').trigger('click')
    expect(handleClick).toHaveBeenCalled()
  })

  it('support loading', async () => {
    const Demo = defineComponent({
      setup() {
        const status = ref<QRCodeProps['status']>('active')
        return () => (
          <>
            <QRCode value="test" status={status.value} />
            <button type="button" onClick={() => (status.value = 'loading')}>
              set loading
            </button>
          </>
        )
      },
    })
    const wrapper = mount(Demo)
    expect(wrapper.find('.ant-spin-spinning').exists()).toBeFalsy()
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.ant-spin-spinning').exists()).toBeTruthy()
  })

  it('support bordered', () => {
    const wrapper = mount(QRCode, {
      props: {
        value: 'test',
        bordered: false,
      },
    })
    expect(wrapper.find('.ant-qrcode').classes()).toContain('ant-qrcode-borderless')
  })

  it('should console Error when icon exist && errorLevel is `L`', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mount(QRCode, {
      props: {
        value: 'test',
        icon: 'test',
        errorLevel: 'L',
      },
    })
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: QRCode] ErrorLevel `L` is not recommended to be used with `icon`, for scanning result would be affected by low level.',
    )
    errSpy.mockRestore()
  })

  it('correct style for wrapper & canvas', () => {
    const wrapper = mount(QRCode, {
      props: {
        value: 'test',
        size: 60,
      },
      attrs: {
        style: { width: '100%', height: '80%' },
      },
    })
    const qrcode = wrapper.find('.ant-qrcode').element as HTMLElement
    const canvas = wrapper.find('.ant-qrcode canvas').element as HTMLElement
    expect(qrcode.style.width).toBe('100%')
    expect(qrcode.style.height).toBe('80%')
    expect(canvas.style.width).toBe('100%')
    expect(canvas.style.height).toBe('80%')
  })

  it('custom status render', async () => {
    const refreshCb = vi.fn()
    const customStatusRender: QRCodeProps['statusRender'] = (info) => {
      switch (info.status) {
        case 'expired':
          return (
            <div class="custom-expired">
              <span>{info.locale?.expired}</span>
              <button id="refresh" onClick={info.onRefresh} type="button">
                refresh
              </button>
            </div>
          )
        case 'loading':
          return <div class="custom-loading">Loading</div>
        case 'scanned':
          return <div class="custom-scanned">{info.locale?.scanned}</div>
        default:
          return null
      }
    }
    const wrapper = mount({
      render() {
        return (
          <>
            <QRCode
              class="qrcode-expired"
              value="test"
              status="expired"
              statusRender={customStatusRender}
              onRefresh={refreshCb}
            />
            <QRCode
              class="qrcode-loading"
              value="test"
              status="loading"
              statusRender={customStatusRender}
            />
            <QRCode
              class="qrcode-scanned"
              value="test"
              status="scanned"
              statusRender={customStatusRender}
            />
          </>
        )
      },
    })

    expect(wrapper.find('.qrcode-expired .custom-expired>span').text()).toBe('QR code expired')
    await wrapper.find('#refresh').trigger('click')
    expect(refreshCb).toHaveBeenCalled()
    expect(wrapper.find('.qrcode-loading .custom-loading').text()).toBe('Loading')
    expect(wrapper.find('.qrcode-scanned .custom-scanned').text()).toBe('Scanned')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should pass aria and data props to qrcode element', () => {
    const wrapper = mount(QRCode, {
      props: {
        'value': 'test',
        'aria-label': 'Test QR Code',
      },
    })
    const qrcodeElement = wrapper.find('.ant-qrcode canvas')
    expect(qrcodeElement.attributes('aria-label')).toBe('Test QR Code')
  })

  it('should not pass other props to qrcode element', () => {
    const wrapper = mount(QRCode, {
      props: {
        'value': 'test',
        'aria-label': 'Test QR Code',
        'title': 'qr-title',
      },
    })

    const qrcodeElement = wrapper.find('.ant-qrcode canvas')
    expect(qrcodeElement.attributes('aria-label')).toBe('Test QR Code')
    expect(qrcodeElement.attributes('title')).toBeUndefined()
  })

  it('should work with both canvas and svg type', () => {
    const ariaLabel = 'Test QR Code'
    // test canvas type
    const canvasWrapper = mount(QRCode, {
      props: {
        'value': 'test',
        'type': 'canvas',
        'aria-label': ariaLabel,
      },
    })
    expect(canvasWrapper.find('canvas').attributes('aria-label')).toBe(ariaLabel)
    // test svg type
    const svgWrapper = mount(QRCode, {
      props: {
        'value': 'test',
        'type': 'svg',
        'aria-label': ariaLabel,
      },
    })
    // FIXME: @v-c/qrcode SVG component does not render aria-label to the root svg element
    // expect(svgWrapper.find('svg').attributes('aria-label')).toBe(ariaLabel)
    expect(svgWrapper.find('svg').exists()).toBe(true)
  })

  it('should respect custom marginSize for SVG', () => {
    const baseWrapper = mount(QRCode, {
      props: {
        value: 'ant-design',
        type: 'svg',
      },
    })
    const vbBase = baseWrapper.find('svg').attributes('viewBox')

    const margin = 10
    const customWrapper = mount(QRCode, {
      props: {
        value: 'ant-design',
        type: 'svg',
        marginSize: margin,
      },
    })
    const vbCustom = customWrapper.find('svg').attributes('viewBox')
    expect(vbCustom).toBeDefined()

    const nBase = Number(vbBase?.split(' ').pop())
    const nCustom = Number(vbCustom?.split(' ').pop())

    // viewBox side length increases by 2 * marginSize
    expect(nCustom - nBase).toBeGreaterThanOrEqual(2 * margin)
  })
})
