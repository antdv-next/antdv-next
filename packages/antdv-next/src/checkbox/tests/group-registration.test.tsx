import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import Checkbox, { CheckboxGroup } from '..'
import { mount } from '/@tests/utils'

describe('checkboxGroup registration', () => {
  describe.each(['options', 'slots'] as const)('%s', (source) => {
    it.each([false, true])('excludes removed values from the next change (controlled: %s)', async (controlled) => {
      const showFirst = ref(true)
      const selected = ref(['A'])
      const onChange = vi.fn()
      const onUpdateValue = vi.fn((value: string[]) => {
        selected.value = value
      })
      const wrapper = mount(() => (
        <CheckboxGroup
          defaultValue={['A']}
          value={controlled ? selected.value : undefined}
          options={source === 'options' ? (showFirst.value ? ['A', 'B'] : ['B']) : undefined}
          onChange={onChange}
          {...{ 'onUpdate:value': onUpdateValue }}
        >
          {source === 'slots' && (
            <>
              {showFirst.value && <Checkbox value="A">A</Checkbox>}
              <Checkbox value="B">B</Checkbox>
            </>
          )}
        </CheckboxGroup>
      ))

      expect(wrapper.findAll('input')).toHaveLength(2)
      showFirst.value = false
      await nextTick()
      expect(wrapper.findAll('input')).toHaveLength(1)
      expect(onChange).not.toHaveBeenCalled()
      expect(onUpdateValue).not.toHaveBeenCalled()

      await wrapper.get('input').setValue(true)
      expect(onChange).toHaveBeenLastCalledWith(['B'])
      expect(onUpdateValue).toHaveBeenLastCalledWith(['B'])
      expect(selected.value).toEqual(['B'])
      wrapper.unmount()
    })
  })

  it('replaces the registered value when a checkbox value changes', async () => {
    const value = ref('A')
    const showFirst = ref(true)
    const onChange = vi.fn()
    const wrapper = mount(() => (
      <CheckboxGroup defaultValue={['A']} onChange={onChange}>
        {showFirst.value && <Checkbox value={value.value}>{value.value}</Checkbox>}
        <Checkbox value="B">B</Checkbox>
      </CheckboxGroup>
    ))

    value.value = 'C'
    await nextTick()
    await wrapper.findAll('input')[0]!.setValue(true)
    expect(onChange).toHaveBeenLastCalledWith(['C'])

    await wrapper.findAll('input')[1]!.setValue(true)
    expect(onChange).toHaveBeenLastCalledWith(['C', 'B'])

    showFirst.value = false
    await nextTick()
    await wrapper.get('input').setValue(false)
    expect(onChange).toHaveBeenLastCalledWith([])
    wrapper.unmount()
  })

  it.each([false, true])('respects skipGroup on mount and after toggling (initial: %s)', async (initialSkipGroup) => {
    const skipGroup = ref(initialSkipGroup)
    const onChange = vi.fn()
    const wrapper = mount(() => (
      <CheckboxGroup value={['A']} onChange={onChange}>
        <Checkbox value="A" skipGroup={skipGroup.value}>A</Checkbox>
        <Checkbox value="B">B</Checkbox>
      </CheckboxGroup>
    ))

    for (const skip of [initialSkipGroup, !initialSkipGroup, initialSkipGroup]) {
      skipGroup.value = skip
      await nextTick()
      await wrapper.findAll('input')[1]!.trigger('change')
      expect(onChange).toHaveBeenLastCalledWith(skip ? ['B'] : ['A', 'B'])
    }
    wrapper.unmount()
  })

  it('registers an option again when it is remounted', async () => {
    const showFirst = ref(true)
    const onChange = vi.fn()
    const wrapper = mount(() => (
      <CheckboxGroup defaultValue={['A']} onChange={onChange}>
        {showFirst.value && <Checkbox value="A">A</Checkbox>}
        <Checkbox value="B">B</Checkbox>
      </CheckboxGroup>
    ))

    showFirst.value = false
    await nextTick()
    showFirst.value = true
    await nextTick()
    await wrapper.findAll('input')[1]!.setValue(true)
    expect(onChange).toHaveBeenLastCalledWith(['A', 'B'])
    wrapper.unmount()
  })
})
