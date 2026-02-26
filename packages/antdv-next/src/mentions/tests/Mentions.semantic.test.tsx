import type { MentionsProps } from '..'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Mentions from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

const defaultOptions: MentionsProps['options'] = [
  { value: 'afc163', label: 'afc163' },
  { value: 'zombieJ', label: 'zombieJ' },
]

describe('mentions.Semantic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('supports static object classes on root', () => {
    mount(Mentions, {
      attachTo: document.body,
      props: {
        options: defaultOptions,
        classes: { root: 'custom-root' },
      },
    })
    const root = document.querySelector('.ant-mentions')
    expect(root?.classList.contains('custom-root')).toBe(true)
  })

  it('supports static object styles on root', () => {
    mount(Mentions, {
      attachTo: document.body,
      props: {
        options: defaultOptions,
        styles: { root: { backgroundColor: 'red' } },
      },
    })
    const root = document.querySelector<HTMLElement>('.ant-mentions')
    expect(root?.style.backgroundColor).toBe('red')
  })

  it('supports function-based classes', () => {
    const classes: MentionsProps['classes'] = (info) => {
      if (info.props.disabled) {
        return { root: 'disabled-root' }
      }
      return { root: 'enabled-root' }
    }

    mount(Mentions, {
      attachTo: document.body,
      props: {
        options: defaultOptions,
        disabled: false,
        classes,
      },
    })
    const root = document.querySelector('.ant-mentions')
    expect(root?.classList.contains('enabled-root')).toBe(true)
  })

  it('supports function-based styles', () => {
    const styles: MentionsProps['styles'] = (info) => {
      if (info.props.loading) {
        return { root: { opacity: '0.5' } }
      }
      return { root: { opacity: '1' } }
    }

    mount(Mentions, {
      attachTo: document.body,
      props: {
        options: defaultOptions,
        loading: false,
        styles,
      },
    })
    const root = document.querySelector<HTMLElement>('.ant-mentions')
    expect(root?.style.opacity).toBe('1')
  })

  it('configProvider classes merge with component classes', () => {
    mount({
      render() {
        return (
          <ConfigProvider
            mentions={{
              classes: { root: 'cp-root' },
            }}
          >
            <Mentions
              options={defaultOptions}
              classes={{ root: 'comp-root' }}
            />
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })

    const root = document.querySelector('.ant-mentions')
    expect(root?.classList.contains('cp-root')).toBe(true)
    expect(root?.classList.contains('comp-root')).toBe(true)
  })

  it('configProvider styles merge with component styles', () => {
    mount({
      render() {
        return (
          <ConfigProvider
            mentions={{
              styles: { root: { margin: '1px' } },
            }}
          >
            <Mentions
              options={defaultOptions}
              styles={{ root: { padding: '2px' } }}
            />
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })

    const root = document.querySelector<HTMLElement>('.ant-mentions')
    expect(root?.style.padding).toBe('2px')
  })
})
