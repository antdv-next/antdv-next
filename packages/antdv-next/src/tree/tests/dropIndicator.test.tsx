import { describe, expect, it } from 'vitest'
import dropIndicatorRender, { offset } from '../utils/dropIndicator'
import { mount } from '/@tests/utils'

describe('dropIndicatorRender', () => {
  it('work with dropPosition before (1)', () => {
    const wrapper = mount({
      render: () => dropIndicatorRender({
        dropPosition: 1,
        dropLevelOffset: 0,
        indent: 24,
        prefixCls: 'ant',
        direction: 'ltr',
      }),
    })
    expect(wrapper.find('div').element).toHaveStyle({ bottom: '-3px' })
  })

  it('work with dropPosition inner (-0)', () => {
    const wrapper = mount({
      render: () => dropIndicatorRender({
        dropPosition: 0,
        dropLevelOffset: 0,
        indent: 24,
        prefixCls: 'ant',
        direction: 'ltr',
      }),
    })
    expect(wrapper.find('div').element).toHaveStyle({
      bottom: '-3px',
      left: `${24 + offset}px`,
    })
  })

  it('work with dropPosition after (-1)', () => {
    const wrapper = mount({
      render: () => dropIndicatorRender({
        dropPosition: -1,
        dropLevelOffset: 0,
        indent: 24,
        prefixCls: 'ant',
        direction: 'ltr',
      }),
    })
    expect(wrapper.find('div').element).toHaveStyle({ top: '-3px' })
  })

  it('work with drop level', () => {
    const wrapper = mount({
      render: () => dropIndicatorRender({
        dropPosition: -1,
        dropLevelOffset: 2,
        indent: 24,
        prefixCls: 'ant',
        direction: 'ltr',
      }),
    })
    expect(wrapper.find('div').element).toHaveStyle({
      left: `${-2 * 24 + offset}px`,
    })
  })

  it('work with drop level (rtl)', () => {
    const wrapper = mount({
      render: () => dropIndicatorRender({
        dropPosition: -1,
        dropLevelOffset: 2,
        indent: 24,
        prefixCls: 'ant',
        direction: 'rtl',
      }),
    })
    expect(wrapper.find('div').element).toHaveStyle({
      right: `${-2 * 24 + offset}px`,
    })
  })
})
