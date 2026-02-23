import type { CSSProperties, PropType } from 'vue'
import type { WaveProps } from './index.tsx'
import type { ShowWaveEffect, WaveComponent } from './interface'
import { classNames } from '@v-c/util'
import raf from '@v-c/util/dist/raf'
import { computed, createVNode, defineComponent, nextTick, onBeforeUnmount, ref, render, shallowRef, watch } from 'vue'
import { useConfig } from '../../config-provider/context.ts'
import { genCssVar } from '../../theme/util/genStyleUtils'
import { TARGET_CLS } from './interface'
import { getTargetWaveColor } from './util'

function validateNum(value: number) {
  return Number.isNaN(value) ? 0 : value
}

export const WaveEffect = defineComponent({
  name: 'WaveEffect',
  inheritAttrs: false,
  props: {
    className: {
      type: String,
      required: true,
    },
    target: {
      type: Object as PropType<HTMLElement>,
      required: true,
    },
    component: {
      type: String as PropType<WaveComponent>,
      required: false,
    },
    colorSource: {
      type: String as PropType<WaveProps['colorSource']>,
      required: false,
    },
  },
  emits: ['finish'],
  setup(props, { emit }) {
    const configCtx = useConfig()
    const rootPrefixCls = computed(() => configCtx.value.getPrefixCls())
    const waveVarName = computed(() => genCssVar(rootPrefixCls.value, 'wave')[0])
    const divRef = shallowRef<HTMLDivElement>()
    const waveColor = ref<string | null>(null)
    const borderRadius = ref<number[]>([])
    const left = ref(0)
    const top = ref(0)
    const width = ref(0)
    const height = ref(0)
    const enabled = ref(false)
    const finished = ref(false)

    const waveStyle = computed<CSSProperties>(() => {
      const style: CSSProperties = {
        left: `${left.value}px`,
        top: `${top.value}px`,
        width: `${width.value}px`,
        height: `${height.value}px`,
        borderRadius: borderRadius.value.map(radius => `${radius}px`).join(' '),
      }
      if (waveColor.value) {
        style[waveVarName.value('color')] = waveColor.value
      }
      return style
    })

    const isSmallComponent = computed(() => {
      return (
        (props.component === 'Checkbox' || props.component === 'Radio')
        && props.target?.classList.contains(TARGET_CLS)
      )
    })

    const classes = computed(() => {
      return classNames(props.className, { 'wave-quick': isSmallComponent.value })
    })

    function emitFinish() {
      if (finished.value) {
        return
      }
      finished.value = true
      emit('finish')
    }

    function syncPos(target = props.target) {
      if (!target) {
        return
      }
      const nodeStyle = getComputedStyle(target)
      waveColor.value = getTargetWaveColor(target, props.colorSource)

      const isStatic = nodeStyle.position === 'static'
      const { borderLeftWidth, borderTopWidth } = nodeStyle
      left.value = isStatic ? target.offsetLeft : validateNum(-Number.parseFloat(borderLeftWidth))
      top.value = isStatic ? target.offsetTop : validateNum(-Number.parseFloat(borderTopWidth))
      width.value = target.offsetWidth
      height.value = target.offsetHeight

      const {
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomRightRadius,
        borderBottomLeftRadius,
      } = nodeStyle

      borderRadius.value = [
        validateNum(Number.parseFloat(borderTopLeftRadius)),
        validateNum(Number.parseFloat(borderTopRightRadius)),
        validateNum(Number.parseFloat(borderBottomRightRadius)),
        validateNum(Number.parseFloat(borderBottomLeftRadius)),
      ]
    }

    function triggerEffect() {
      const element = divRef.value
      if (!element) {
        return
      }
      element.classList.remove('wave-motion-appear')
      element.classList.remove('wave-motion-appear-active')
      // Force reflow to ensure transition runs each time
      void element.offsetHeight
      element.classList.add('wave-motion-appear')
      element.classList.add('wave-motion-appear-active')
    }

    const rafId = ref<number>()
    let resizeObserver: ResizeObserver | undefined
    let deadlineId: number | undefined

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== divRef.value) {
        return
      }
      if (event.propertyName === 'opacity') {
        emitFinish()
      }
    }

    watch(
      () => divRef.value,
      (newEl, oldEl) => {
        oldEl?.removeEventListener('transitionend', handleTransitionEnd)
        newEl?.addEventListener('transitionend', handleTransitionEnd)
      },
      { immediate: true },
    )

    function stopEffectSync() {
      if (rafId.value !== undefined) {
        raf.cancel(rafId.value)
        rafId.value = undefined
      }
      resizeObserver?.disconnect()
      resizeObserver = undefined
      if (deadlineId !== undefined) {
        window.clearTimeout(deadlineId)
        deadlineId = undefined
      }
    }

    watch(
      () => props.target,
      (target, _, onCleanup) => {
        if (!target) {
          return
        }
        let active = true

        rafId.value = raf(() => {
          if (!active) {
            return
          }
          syncPos(target)
          enabled.value = true

          nextTick(() => {
            if (!active) {
              return
            }
            triggerEffect()
            deadlineId = window.setTimeout(() => {
              emitFinish()
            }, 5000)
          })
        })

        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => {
            syncPos(target)
          })
          resizeObserver.observe(target)
        }

        onCleanup(() => {
          active = false
          stopEffectSync()
        })
      },
      { immediate: true },
    )

    onBeforeUnmount(() => {
      stopEffectSync()
      emitFinish()
    })

    return () => {
      if (!enabled.value) {
        return null
      }

      return <div ref={divRef} class={classes.value} style={waveStyle.value} />
    }
  },
})

const showWaveEffect: ShowWaveEffect = (target, info) => {
  const { component } = info

  if (component === 'Checkbox' && !target.querySelector<HTMLInputElement>('input')?.checked) {
    return
  }

  const holder = (target.ownerDocument ?? document).createElement('div')
  holder.style.position = 'absolute'
  holder.style.left = '0px'
  holder.style.top = '0px'
  target.insertBefore(holder, target.firstChild)

  let unmounted = false

  const destroy = () => {
    if (unmounted) {
      return
    }
    unmounted = true
    render(null, holder)
    holder.remove()
  }

  const vnode = createVNode(WaveEffect, {
    className: info.className,
    target,
    component,
    colorSource: info.colorSource,
    onFinish: destroy,
  })

  render(vnode, holder)
}

export default showWaveEffect
