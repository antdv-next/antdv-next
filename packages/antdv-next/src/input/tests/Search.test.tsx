import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Input from '..'
import Button from '../../button'
import ConfigProvider from '../../config-provider'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

const { Search } = Input as any

describe('search', () => {
  rtlTest(() => h(Search))

  it('should render correctly', () => {
    const wrapper = mount(Search)
    expect(wrapper.find('.ant-input-search').exists()).toBe(true)
  })

  it('should support v-model:value', async () => {
    const value = ref('')
    const wrapper = mount(() => (
      <Search v-model:value={value.value} />
    ))

    const input = wrapper.find('input')
    await input.setValue('search text')
    expect(value.value).toBe('search text')
  })

  it('should support defaultValue', () => {
    const wrapper = mount(Search, {
      props: {
        defaultValue: 'default search',
      },
    })
    expect(wrapper.find('input').element.value).toBe('default search')
  })

  it('should support placeholder', () => {
    const wrapper = mount(Search, {
      props: {
        placeholder: 'Search...',
      },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Search...')
  })

  it('should support disabled', () => {
    const wrapper = mount(Search, {
      props: {
        disabled: true,
      },
    })
    expect(wrapper.find('.ant-input-disabled').exists()).toBe(true)
  })

  it('should support enterButton', () => {
    const wrapper = mount(Search, {
      props: {
        enterButton: true,
      },
    })
    expect(wrapper.find('.ant-input-search-with-button').exists()).toBe(true)
    expect(wrapper.find('.ant-btn').exists()).toBe(true)
  })

  it('should support enterButton with custom text', () => {
    const wrapper = mount(Search, {
      props: {
        enterButton: 'Search',
      },
    })
    expect(wrapper.find('.ant-btn').text()).toBe('Search')
  })

  it('should support onSearch event', async () => {
    const onSearch = vi.fn()
    const wrapper = mount(Search, {
      props: {
        value: 'test',
        onSearch,
      },
    })

    await wrapper.find('.ant-btn').trigger('click')
    expect(onSearch).toHaveBeenCalledWith('test', expect.anything(), expect.anything())
  })

  it('should trigger onSearch on Enter key', async () => {
    const onSearch = vi.fn()
    const wrapper = mount(Search, {
      props: {
        value: 'test',
        onSearch,
      },
    })

    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    expect(onSearch).toHaveBeenCalled()
  })

  it('should support loading', () => {
    const wrapper = mount(Search, {
      props: {
        loading: true,
        enterButton: true,
      },
    })
    expect(wrapper.find('.ant-btn-loading').exists()).toBe(true)
  })

  describe('custom enterButton disabled/loading', () => {
    it('should disable custom Button when disabled prop is true', async () => {
      const onSearch = vi.fn()
      const wrapper = mount(() => (
        <Search disabled enterButton={<Button>ok</Button>} onSearch={onSearch} />
      ))

      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeDefined()
      await button.trigger('click')
      expect(onSearch).not.toHaveBeenCalled()
    })

    it('should disable custom native button when disabled prop is true', async () => {
      const onSearch = vi.fn()
      const wrapper = mount(() => (
        <Search disabled enterButton={<button type="button">ok</button>} onSearch={onSearch} />
      ))

      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeDefined()
      await button.trigger('click')
      expect(onSearch).not.toHaveBeenCalled()
    })

    it('should preserve disabled context for custom Button', async () => {
      const onSearch = vi.fn()
      const wrapper = mount(() => (
        <ConfigProvider componentDisabled>
          <Search enterButton={<Button>ok</Button>} onSearch={onSearch} />
        </ConfigProvider>
      ))

      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeDefined()
      await button.trigger('click')
      expect(onSearch).not.toHaveBeenCalled()
    })

    it('should disable custom native button with disabled context', async () => {
      const onSearch = vi.fn()
      const wrapper = mount(() => (
        <ConfigProvider componentDisabled>
          <Search enterButton={<button type="button">ok</button>} onSearch={onSearch} />
        </ConfigProvider>
      ))

      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeDefined()
      await button.trigger('click')
      expect(onSearch).not.toHaveBeenCalled()
    })

    it('should set custom Button to loading when loading prop is true', () => {
      const onSearch = vi.fn()
      const wrapper = mount(() => (
        <Search loading enterButton={<Button>ok</Button>} onSearch={onSearch} />
      ))

      expect(wrapper.find('.ant-btn-loading').exists()).toBe(true)
    })

    it('should keep custom Button loading when its own loading is true', () => {
      const wrapper = mount(() => (
        <Search enterButton={<Button loading>ok</Button>} />
      ))

      expect(wrapper.find('.ant-btn-loading').exists()).toBe(true)
    })

    it('should keep custom Button disabled when its own disabled is true', () => {
      const wrapper = mount(() => (
        <Search enterButton={<Button disabled>ok</Button>} />
      ))

      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })

    it('should disable custom native button when loading prop is true', async () => {
      const onSearch = vi.fn()
      const wrapper = mount(() => (
        <Search loading enterButton={<button type="button">ok</button>} onSearch={onSearch} />
      ))

      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeDefined()
      await button.trigger('click')
      expect(onSearch).not.toHaveBeenCalled()
    })
  })

  it('should support size prop', () => {
    const wrapperLarge = mount(Search, {
      props: { size: 'large' },
    })
    expect(wrapperLarge.find('.ant-input-search-large').exists()).toBe(true)

    const wrapperSmall = mount(Search, {
      props: { size: 'small' },
    })
    expect(wrapperSmall.find('.ant-input-search-small').exists()).toBe(true)
  })

  it('should support allowClear', async () => {
    const wrapper = mount(Search, {
      props: {
        allowClear: true,
        value: 'test',
      },
    })
    expect(wrapper.find('.ant-input-clear-icon').exists()).toBe(true)
  })

  it('should trigger onSearch with source=clear when cleared', async () => {
    const onSearch = vi.fn()
    const onClear = vi.fn()
    const value = ref('test')
    const wrapper = mount(() => (
      <Search
        v-model:value={value.value}
        allowClear
        onSearch={onSearch}
        onClear={onClear}
      />
    ))

    await wrapper.find('.ant-input-clear-icon').trigger('click')
    expect(onClear).toHaveBeenCalled()
    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith('', expect.anything(), { source: 'clear' })
    expect(value.value).toBe('')
  })

  it('should support onChange event', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Search, {
      props: {
        onChange,
      },
    })

    const input = wrapper.find('input')
    await input.setValue('test')
    expect(onChange).toHaveBeenCalled()
  })

  it('should support onBlur and onFocus', async () => {
    const onBlur = vi.fn()
    const onFocus = vi.fn()
    const wrapper = mount(Search, {
      props: {
        onBlur,
        onFocus,
      },
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    input.element.focus()
    await nextTick()
    expect(onFocus).toHaveBeenCalled()

    input.element.blur()
    await nextTick()
    expect(onBlur).toHaveBeenCalled()
    wrapper.unmount()
  })
})
