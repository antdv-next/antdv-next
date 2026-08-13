import type { SlotsType } from 'vue'
import type { ComponentBaseProps } from '../config-provider/context'
import type { FloatButtonProps, FloatButtonRef, FloatButtonShape } from './FloatButton'
import { VerticalAlignTopOutlined } from '@antdv-next/icons'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { getTransitionProps } from '@v-c/util/dist/utils/transition'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef, Transition } from 'vue'
import { getAttrStyleAndClass, pureAttrs } from '../_util/hooks'
import scrollTo from '../_util/scrollTo'
import { toPropsRefs } from '../_util/tools'
import { useComponentBaseConfig, useConfig } from '../config-provider/context'
import { genCssVar } from '../theme/util/genStyleUtils'
import { useGroupContext } from './context'

import FloatButton, { floatButtonPrefixCls } from './FloatButton'
import useScroll from './hooks/useScroll'

export interface BackTopProps extends Omit<FloatButtonProps, 'target'>, ComponentBaseProps,
  /* @vue-ignore */
  BackTopEmitsProps {
  visibilityHeight?: number
  target?: () => HTMLElement | Window | Document
  duration?: number
  /** @default false */
  showProgress?: boolean
}

export interface BackTopEmits {
  click: (e: MouseEvent) => void
}
export interface BackTopEmitsProps {
  onClick?: BackTopEmits['click']
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
    const { prefixCls, backTopIcon } = useComponentBaseConfig('floatButton', props, ['backTopIcon'], floatButtonPrefixCls)
    const globalConfig = useConfig()
    const groupContext = useGroupContext()
    const { target, visibilityHeight, duration } = toPropsRefs(props, 'target', 'visibilityHeight', 'duration')

    const floatButtonRef = shallowRef<FloatButtonRef | null>(null)

    expose({
      nativeElement: computed(() => floatButtonRef.value?.nativeElement ?? null),
    })

    const getDefaultTarget = () => floatButtonRef.value?.nativeElement?.ownerDocument ?? (typeof window !== 'undefined' ? window : undefined)

    const mergedVisibility = computed(() => visibilityHeight.value ?? 400)
    const showProgress = computed(() => props.showProgress ?? false)
    const getTarget = computed(() => target.value || getDefaultTarget)

    const { scrollProgress, visible } = useScroll({
      getTarget,
      showProgress,
      visibilityHeight: mergedVisibility,
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

    const progressStyle = computed(() => {
      if (!showProgress.value) {
        return undefined
      }
      const [varName] = genCssVar(rootPrefixCls.value ?? 'ant', floatButtonPrefixCls)
      return { [varName('progress')]: `${scrollProgress.value}turn` }
    })

    const scrollToTop = (e: MouseEvent) => {
      const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')
      scrollTo(0, {
        getContainer: getTarget.value as any,
        duration: prefersReducedMotion?.matches ? 0 : duration.value ?? 450,
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
                      {...omit(props, ['visibilityHeight', 'target', 'duration', 'showProgress'])}
                      ref={floatButtonRef as any}
                      class={[
                        className,
                        { [`${prefixCls.value}-progress`]: showProgress.value },
                      ]}
                      style={[progressStyle.value, style]}
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
