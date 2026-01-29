import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onUnmounted, ref, watch } from 'vue'

/**
 * 深入分析 watch onCleanup 的触发时机
 */
describe('watch cleanup timing analysis', () => {
  it('should analyze when watch onCleanup is triggered', async () => {
    const events: string[] = []

    const ComponentA = defineComponent({
      name: 'ComponentA',
      setup() {
        // 模拟 useGlobalCache 中的响应式数据
        const prefix = ref('style')
        const keyPath = ref(['ComponentA'])
        const fullPath = computed(() => [prefix.value, ...keyPath.value])
        const fullPathStr = computed(() => fullPath.value.join('|'))

        events.push(`1. fullPathStr computed: ${fullPathStr.value}`)

        // 模拟 useGlobalCache 中的 watch
        watch(
          fullPathStr,
          (newVal, oldVal, onCleanup) => {
            events.push(`2. watch effect - fullPathStr: ${newVal}`)

            onCleanup(() => {
              events.push(`5. watch onCleanup - fullPathStr was: ${newVal}`)
            })
          },
          { immediate: true },
        )

        onBeforeUnmount(() => {
          events.push(`3. onBeforeUnmount - fullPathStr: ${fullPathStr.value}`)
        })

        onUnmounted(() => {
          events.push(`4. onUnmounted - fullPathStr: ${fullPathStr.value}`)
        })

        return () => h('div', { class: 'component-a' }, 'Component A')
      },
    })

    const show = ref(true)

    const App = defineComponent({
      setup() {
        return () => show.value ? h(ComponentA) : h('div', 'Empty')
      },
    })

    const wrapper = mount(App, { attachTo: document.body })
    await nextTick()

    events.push('--- Unmounting ComponentA ---')

    show.value = false
    await nextTick()

    console.log('\n=== Event Order ===')
    events.forEach((e, i) => console.log(`${i + 1}. ${e}`))

    // 验证顺序
    const cleanupIndex = events.findIndex(e => e.includes('watch onCleanup'))
    const beforeUnmountIndex = events.findIndex(e => e.includes('onBeforeUnmount'))

    console.log('\n=== Key Finding ===')
    console.log(`onBeforeUnmount index: ${beforeUnmountIndex}`)
    console.log(`watch onCleanup index: ${cleanupIndex}`)
    console.log(`onCleanup happens ${cleanupIndex > beforeUnmountIndex ? 'after' : 'before'} onBeforeUnmount`)

    wrapper.unmount()
  })

  it('should show that fullPathStr does NOT change during unmount', async () => {
    const events: string[] = []
    let lastFullPathStr = ''

    const ComponentA = defineComponent({
      name: 'ComponentA',
      setup() {
        const prefix = ref('style')
        const keyPath = ref(['ComponentA'])
        const fullPath = computed(() => [prefix.value, ...keyPath.value])
        const fullPathStr = computed(() => fullPath.value.join('|'))

        lastFullPathStr = fullPathStr.value

        watch(
          fullPathStr,
          (newVal, oldVal, onCleanup) => {
            events.push(`watch effect - new: ${newVal}, old: ${oldVal}`)
            lastFullPathStr = newVal

            onCleanup(() => {
              events.push(`watch onCleanup - current fullPathStr: ${fullPathStr.value}`)
              events.push(`watch onCleanup - lastFullPathStr: ${lastFullPathStr}`)
              events.push(`fullPathStr changed: ${fullPathStr.value !== lastFullPathStr}`)
            })
          },
          { immediate: true },
        )

        return () => h('div', 'A')
      },
    })

    const show = ref(true)

    const App = defineComponent({
      setup() {
        return () => show.value ? h(ComponentA) : null
      },
    })

    const wrapper = mount(App)
    await nextTick()

    events.push('--- Unmounting ---')
    show.value = false
    await nextTick()

    console.log('\n=== Events ===')
    events.forEach(e => console.log(e))

    // 关键发现：fullPathStr 在卸载时并没有变化
    // onCleanup 是因为组件卸载而触发的，不是因为 fullPathStr 变化
    expect(events.some(e => e.includes('fullPathStr changed: false'))).toBe(true)

    wrapper.unmount()
  })

  it('should demonstrate the real issue: watch cleanup runs on component unmount', async () => {
    /**
     * 关键发现：
     *
     * Vue 的 watch 有两种触发 onCleanup 的情况：
     * 1. 监听的值变化时（在执行新的 effect 之前）
     * 2. 组件卸载时（effect scope 被销毁）
     *
     * 在 Transition 场景中：
     * - fullPathStr 并没有变化
     * - 但组件被卸载了，导致 watch 的 effect scope 被销毁
     * - Vue 会调用 onCleanup 来清理
     *
     * 这是 Vue 的设计行为，不是 bug。
     * 问题在于 Transition 延迟了 DOM 移除，但没有延迟组件实例的销毁。
     */

    const cleanupReason = { byValueChange: false, byUnmount: false }

    const ComponentA = defineComponent({
      setup() {
        const value = ref('initial')
        let previousValue = value.value

        watch(
          value,
          (newVal, oldVal, onCleanup) => {
            const isValueChange = oldVal !== undefined && oldVal !== newVal
            if (isValueChange) {
              cleanupReason.byValueChange = true
            }

            onCleanup(() => {
              // 如果这里被调用，但值没有变化，说明是组件卸载导致的
              if (value.value === previousValue) {
                cleanupReason.byUnmount = true
              }
            })

            previousValue = newVal
          },
          { immediate: true },
        )

        return () => h('div', 'A')
      },
    })

    const show = ref(true)
    const App = defineComponent({
      setup: () => () => show.value ? h(ComponentA) : null,
    })

    const wrapper = mount(App)
    await nextTick()

    // 卸载组件（不改变 value）
    show.value = false
    await nextTick()

    console.log('\n=== Cleanup Reason ===')
    console.log('By value change:', cleanupReason.byValueChange)
    console.log('By unmount:', cleanupReason.byUnmount)

    // 验证：cleanup 是因为卸载触发的，不是因为值变化
    expect(cleanupReason.byValueChange).toBe(false)
    expect(cleanupReason.byUnmount).toBe(true)

    wrapper.unmount()
  })
})
