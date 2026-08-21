import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import Pagination from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import { expectSemanticRootStylePriority, semanticRootStylePriority } from '/@tests/shared/semanticStylePriority'
import { mount } from '/@tests/utils'

describe('pagination', () => {
  mountTest(Pagination)

  it('should render pagination', () => {
    const wrapper = mount(Pagination, {
      props: { total: 50 },
    })

    expect(wrapper.find('.ant-pagination').exists()).toBe(true)
  })

  it('should update current before change callback runs in controlled mode', async () => {
    const current = ref(1)
    const currentInChange: number[] = []
    const onChange = vi.fn(() => {
      currentInChange.push(current.value)
    })

    const wrapper = mount(() => (
      <Pagination
        total={50}
        v-model:current={current.value}
        onChange={onChange}
      />
    ))

    await wrapper.find('.ant-pagination-next .ant-pagination-item-link').trigger('click')
    await nextTick()

    expect(onChange).toHaveBeenCalledWith(2, 10)
    expect(current.value).toBe(2)
    expect(currentInChange).toEqual([2])
  })

  // https://github.com/ant-design/ant-design/pull/58831
  it('should support custom size changer component', async () => {
    const onChange = vi.fn()
    const onSizeChangerRender = vi.fn()

    const SizeChanger = defineComponent({
      props: {
        value: { type: Number, required: true },
        disabled: { type: Boolean, default: false },
      },
      emits: ['change'],
      setup(sizeChangerProps, { emit, attrs }) {
        onSizeChangerRender({
          value: sizeChangerProps.value,
          disabled: sizeChangerProps.disabled,
          class: attrs.class,
        })
        return () => (
          <button
            type="button"
            class="custom-size-changer"
            onClick={() => emit('change', 15)}
          >
            Custom size changer
          </button>
        )
      },
    })

    const wrapper = mount(() => (
      <Pagination
        defaultCurrent={1}
        total={500}
        showSizeChanger
        components={{ sizeChanger: SizeChanger }}
        onChange={onChange}
      />
    ), { attachTo: document.body })

    // Default Select based size changer is replaced
    expect(wrapper.find('.ant-pagination-options-size-changer .ant-select').exists()).toBe(false)
    expect(onSizeChangerRender).toHaveBeenLastCalledWith({
      value: 10,
      disabled: false,
      class: 'ant-pagination-options-size-changer',
    })

    const sizeChanger = wrapper.find('.ant-pagination-options-size-changer')
    expect(sizeChanger.classes()).toContain('custom-size-changer')

    await sizeChanger.trigger('click')
    await nextTick()

    expect(onChange).toHaveBeenCalledWith(1, 15)
    wrapper.unmount()
  })

  it('renders the default Select size changer without components', () => {
    const wrapper = mount(() => (
      <Pagination defaultCurrent={1} total={500} showSizeChanger />
    ), { attachTo: document.body })

    expect(wrapper.find('.ant-pagination-options-size-changer').exists()).toBe(true)
    expect(wrapper.find('.custom-size-changer').exists()).toBe(false)
    wrapper.unmount()
  })

  // https://github.com/ant-design/ant-design/pull/58474
  it('aligns root semantic style priority', () => {
    const wrapper = mount(() => (
      <ConfigProvider pagination={{ style: semanticRootStylePriority.contextStyle, styles: semanticRootStylePriority.contextStyles }}>
        <Pagination total={50} style={semanticRootStylePriority.style} styles={semanticRootStylePriority.styles} />
      </ConfigProvider>
    ), { attachTo: document.body })

    expectSemanticRootStylePriority(wrapper.find('.ant-pagination').element)
    wrapper.unmount()
  })
})
