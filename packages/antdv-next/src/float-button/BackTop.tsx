import type { SlotsType } from 'vue'
import type { ComponentBaseProps } from '../config-provider/context'
import type { FloatButtonProps, FloatButtonRef, FloatButtonShape } from './FloatButton'
import { VerticalAlignTopOutlined } from '@antdv-next/icons'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { getTransitionProps } from '@v-c/util/dist/utils/transition'
import { omit } from 'es-toolkit'
import { computed, defineComponent, onBeforeUnmount, onMounted, shallowRef, Transition, watch } from 'vue'
import getScroll from '../_util/getScroll'
import { getAttrStyleAndClass, pureAttrs } from '../_util/hooks'
import scrollTo from '../_util/scrollTo'
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame'
import { toPropsRefs } from '../_util/tools'
import { useComponentBaseConfig, useConfig } from '../config-provider/context'
import { useGroupContext } from './context'
import FloatButton, { floatButtonPrefixCls } from './FloatButton'

export interface BackTopProps extends Omit<FloatButtonProps, 'target'>, ComponentBaseProps {
  visibilityHeight?: number
  target?: () => HTMLElement | Window | Document
  duration?: number
}

export interface BackTopEmits {
  click: (e: MouseEvent) => void
}

export interface BackTopSlots {
  default?: () => any
  icon?: () => any
}

const defaultIcon = <VerticalAlignTopOutlined />

const BackTop = defineComponent<
  BackTopProps,
  BackTopEmits,
  string,
  SlotsType<BackTopSlots>
>(
  (props, { attrs, slots, emit, expose }) => {
    const { backTopIcon } = useComponentBaseConfig('floatButton', props, ['backTopIcon'], floatButtonPrefixCls)
    const globalConfig = useConfig()
    const groupContext = useGroupContext()
    const { target, visibilityHeight, duration } = toPropsRefs(props, 'target', 'visibilityHeight', 'duration')

    const visible = shallowRef((visibilityHeight.value ?? 400) === 0)
    const floatButtonRef = shallowRef<FloatButtonRef | null>(null)

    expose({
      nativeElement: computed(() => floatButtonRef.value?.nativeElement ?? null),
    })

    const getDefaultTarget = () => floatButtonRef.value?.nativeElement?.ownerDocument ?? (typeof window !== 'undefined' ? window : undefined)
    const container = shallowRef<HTMLElement | Window | Document | null>(null)

    const mergedVisibility = computed(() => visibilityHeight.value ?? 400)

    const handleScroll = throttleByAnimationFrame((event?: { target: any }) => {
      const node = event?.target ?? container.value ?? getDefaultTarget()
      const scrollTop = getScroll(node as any)
      visible.value = scrollTop >= mergedVisibility.value
    })

    const bindScroll = () => {
      const targetNode = target.value?.() ?? getDefaultTarget()
      if (targetNode) {
        container.value = targetNode
        ;(targetNode as any).addEventListener?.('scroll', handleScroll)
        handleScroll({ target: targetNode })
      }
    }

    const removeScroll = () => {
      const node = container.value as any
      node?.removeEventListener?.('scroll', handleScroll)
      container.value = null
    }

    onMounted(() => {
      bindScroll()
    })

    onBeforeUnmount(() => {
      handleScroll.cancel()
      removeScroll()
    })

    watch(target, () => {
      removeScroll()
      bindScroll()
    })

    const triggerCheck = () => {
      const node = container.value ?? getDefaultTarget()
      if (node) {
        handleScroll({ target: node })
      }
    }

    watch(mergedVisibility, () => {
      triggerCheck()
    })

    const mergedShape = computed<FloatButtonShape>(() => groupContext?.value?.shape ?? props.shape ?? 'circle')

    const mergedIcon = computed(() => {
      const slotIcon = slots.icon ? filterEmpty(slots.icon()) : []
      if (slotIcon.length) {
        return slotIcon
      }
      return props.icon ?? backTopIcon?.value ?? defaultIcon
    })

    const rootPrefixCls = computed(() => globalConfig.value?.getPrefixCls?.())
    const transitionProps = computed(() => getTransitionProps(`${rootPrefixCls.value}-fade`))

    const scrollToTop = (e: MouseEvent) => {
      scrollTo(0, {
        getContainer: (target.value || getDefaultTarget) as any,
        duration: duration.value ?? 450,
      })
      emit('click', e)
    }

    return () => {
      const { className, style } = getAttrStyleAndClass(attrs)

      return (
        <Transition {...transitionProps.value}>
          {{
            default: () => (
              visible.value
                ? (
                    <FloatButton
                      {...pureAttrs(attrs)}
                      {...omit(props, ['visibilityHeight', 'target', 'duration'])}
                      ref={floatButtonRef as any}
                      class={className}
                      style={style}
                      shape={mergedShape.value}
                      icon={mergedIcon.value as any}
                      onClick={scrollToTop}
                      v-slots={{ default: slots.default }}
                    />
                  )
                : null
            ),
          }}
        </Transition>
      )
    }
  },
  {
    name: 'AFloatBackTop',
    inheritAttrs: false,
  },
)

const BackTopWithInstall = BackTop as typeof BackTop

export default BackTopWithInstall
