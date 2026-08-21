import type { ConfigProviderProps } from '../../config-provider'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Input from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

function mountWithConfig(config: ConfigProviderProps, children: () => any) {
  return mount(ConfigProvider, {
    props: config as any,
    slots: { default: children },
  })
}

describe('input subcomponents global variant config', () => {
  describe('input.Search', () => {
    it('falls back to the `input` global variant for the inner input', () => {
      const wrapper = mountWithConfig(
        { input: { variant: 'filled' } },
        () => h(Input.Search, { enterButton: true }),
      )

      expect(wrapper.find('.ant-input-filled').exists()).toBe(true)
      // `input` config must not leak into the search button variant
      expect(wrapper.find('.ant-input-search-btn-filled').exists()).toBe(false)
    })

    it('reads the `inputSearch` global variant for both input and button', () => {
      const wrapper = mountWithConfig(
        { inputSearch: { variant: 'filled' } },
        () => h(Input.Search, { enterButton: true }),
      )

      expect(wrapper.find('.ant-input-filled').exists()).toBe(true)
      expect(wrapper.find('.ant-input-search-btn-filled').exists()).toBe(true)
    })

    it('prefers the `inputSearch` config over the `input` config', () => {
      const wrapper = mountWithConfig(
        { input: { variant: 'underlined' }, inputSearch: { variant: 'filled' } },
        () => h(Input.Search),
      )

      expect(wrapper.find('.ant-input-filled').exists()).toBe(true)
      expect(wrapper.find('.ant-input-underlined').exists()).toBe(false)
    })

    it('prefers the component prop over any global config', () => {
      const wrapper = mountWithConfig(
        { inputSearch: { variant: 'filled' } },
        () => h(Input.Search, { variant: 'underlined', enterButton: true }),
      )

      expect(wrapper.find('.ant-input-underlined').exists()).toBe(true)
      expect(wrapper.find('.ant-input-search-btn-underlined').exists()).toBe(true)
    })

    it('prefers the `input` config over the global variant for the inner input', () => {
      const wrapper = mountWithConfig(
        { variant: 'filled', input: { variant: 'underlined' } },
        () => h(Input.Search, { enterButton: true }),
      )

      expect(wrapper.find('.ant-input-underlined').exists()).toBe(true)
      expect(wrapper.find('.ant-input-filled').exists()).toBe(false)
      // The button only knows about `inputSearch` / the global variant
      expect(wrapper.find('.ant-input-search-btn-filled').exists()).toBe(true)
    })

    it('keeps the button unstyled when no variant is configured anywhere', () => {
      const wrapper = mount(Input.Search, { props: { enterButton: true } })
      const btn = wrapper.find('.ant-input-search-btn')

      expect(btn.exists()).toBe(true)
      expect(btn.classes().some(cls => cls.startsWith('ant-input-search-btn-'))).toBe(false)
    })
  })

  describe('input.Password', () => {
    it('reads the `inputPassword` global variant', () => {
      const wrapper = mountWithConfig(
        { inputPassword: { variant: 'filled' } },
        () => h(Input.Password),
      )

      expect(wrapper.find('.ant-input-filled').exists()).toBe(true)
    })

    it('falls back to the `input` global variant', () => {
      const wrapper = mountWithConfig(
        { input: { variant: 'filled' } },
        () => h(Input.Password),
      )

      expect(wrapper.find('.ant-input-filled').exists()).toBe(true)
    })

    it('prefers the `inputPassword` config over the `input` config', () => {
      const wrapper = mountWithConfig(
        { input: { variant: 'underlined' }, inputPassword: { variant: 'filled' } },
        () => h(Input.Password),
      )

      expect(wrapper.find('.ant-input-filled').exists()).toBe(true)
      expect(wrapper.find('.ant-input-underlined').exists()).toBe(false)
    })
  })

  describe('input.OTP', () => {
    it('reads the `otp` global variant', () => {
      const wrapper = mountWithConfig(
        { otp: { variant: 'filled' } },
        () => h(Input.OTP, { length: 2 }),
      )

      expect(wrapper.findAll('.ant-otp-input.ant-input-filled').length).toBe(2)
    })

    it('falls back to the `input` global variant', () => {
      const wrapper = mountWithConfig(
        { input: { variant: 'filled' } },
        () => h(Input.OTP, { length: 2 }),
      )

      expect(wrapper.findAll('.ant-otp-input.ant-input-filled').length).toBe(2)
    })

    it('prefers the `otp` config over the `input` config', () => {
      const wrapper = mountWithConfig(
        { input: { variant: 'underlined' }, otp: { variant: 'filled' } },
        () => h(Input.OTP, { length: 2 }),
      )

      expect(wrapper.findAll('.ant-otp-input.ant-input-filled').length).toBe(2)
      expect(wrapper.find('.ant-input-underlined').exists()).toBe(false)
    })
  })
})
