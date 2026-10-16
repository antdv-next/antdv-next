import type { VNode } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import Form, { FormItem } from '..'
import Cascader from '../../cascader'
import Input from '../../input'
import Select from '../../select'
import TreeSelect from '../../tree-select'
import { flushPromises, mount } from '/@tests/utils'

describe('form popupRender isolation', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  // https://github.com/ant-design/ant-design/issues/52581
  it('should not affect popupRender children style of Select-like components', async () => {
    const renderPopup = (className: string) => (menu: VNode) => (
      <>
        {menu}
        <Input class={className} />
      </>
    )

    const wrapper = mount(defineComponent(() => () => (
      <Form>
        <FormItem validateStatus="error" hasFeedback>
          <Select open options={[]} popupRender={renderPopup('select-popup-input')} />
        </FormItem>
        <FormItem validateStatus="error" hasFeedback>
          <TreeSelect open treeData={[]} popupRender={renderPopup('tree-select-popup-input')} />
        </FormItem>
        <FormItem validateStatus="error" hasFeedback>
          <Cascader open options={[]} popupRender={renderPopup('cascader-popup-input')} />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await nextTick()
    await flushPromises()
    await nextTick()

    ;['select-popup-input', 'tree-select-popup-input', 'cascader-popup-input'].forEach((cls) => {
      const input = document.body.querySelector(`.${cls}`)
      expect(input).toBeTruthy()
      expect(input!.classList.contains('ant-input-status-error')).toBe(false)
      expect(input!.parentElement?.querySelector('.ant-form-item-feedback-icon')).toBeFalsy()
    })

    wrapper.unmount()
  })

  it('should isolate Form.Item status from Input addon content', async () => {
    const wrapper = mount(defineComponent(() => () => (
      <Form>
        <FormItem validateStatus="error" hasFeedback>
          <Input class="outer-input" addonAfter={<Select class="addon-select" options={[]} />} />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await nextTick()
    await flushPromises()
    await nextTick()

    expect(document.body.querySelector('.ant-form-item-feedback-icon')).toBeTruthy()
    expect(document.body.querySelector('.addon-select')!.classList.contains('ant-select-status-error')).toBe(false)

    wrapper.unmount()
  })
})
