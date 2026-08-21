import type { InjectionKey, Ref } from 'vue'
import type { ComponentBaseProps, DirectionType } from '../config-provider/context.ts'
import type { SizeType } from '../config-provider/SizeContext'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, defineComponent, inject, provide, ref, shallowRef, toRefs } from 'vue'
import { useOrientation } from '../_util/hooks/useOrientation.ts'
import { useConfig } from '../config-provider/context.ts'
import { useSize } from '../config-provider/hooks/useSize.ts'
import useStyle from './style/compact'

export interface SpaceCompactProps extends ComponentBaseProps {
  size?: SizeType
  direction?: 'horizontal' | 'vertical'
  block?: boolean
  orientation?: 'horizontal' | 'vertical'
  vertical?: boolean
}
export interface SpaceCompactRef {
  nativeElement: HTMLDivElement
}

export interface SpaceCompactItemContextType {
  compactSize?: SizeType
  compactDirection?: 'horizontal' | 'vertical'
  isFirstItem?: boolean
  isLastItem?: boolean
}

const SpaceCompactItemContext: InjectionKey<Ref<SpaceCompactItemContextType | null>> = Symbol('SpaceCompactItemContext')

export function useSpaceCompactItemContext() {
  return inject(SpaceCompactItemContext, ref(null))
}
export function useCompactItemContext(prefixCls: Ref<string>, direction: Ref<DirectionType>) {
  const compactItemContext = useSpaceCompactItemContext()

  const compactItemClassnames = computed<string>(() => {
    if (!compactItemContext.value) {
      return ''
    }
    const { compactDirection, isFirstItem, isLastItem } = compactItemContext.value
    const separator = compactDirection === 'vertical' ? '-vertical-' : '-'

    return classNames(`${prefixCls.value}-compact${separator}item`, {
      [`${prefixCls.value}-compact${separator}first-item`]: isFirstItem,
      [`${prefixCls.value}-compact${separator}last-item`]: isLastItem,
      [`${prefixCls.value}-compact${separator}item-rtl`]: direction.value === 'rtl',
    })
  })

  return {
    compactSize: computed(() => compactItemContext.value?.compactSize),
    compactDirection: computed(() => compactItemContext.value?.compactDirection),
    compactItemClassnames,
  }
}

export const NoCompactStyle = defineComponent(
  (_, { slots }) => {
    provide(SpaceCompactItemContext, ref(null))
    return () => {
      return slots?.default?.()
    }
  },
  {
    name: 'ASpaceNoCompactStyle',
    inheritAttrs: false,
  },
)

const CompactItem = defineComponent<SpaceCompactItemContextType>(
  (props, { slots }) => {
    provide(SpaceCompactItemContext, computed(() => props))
    return () => {
      return slots?.default?.()
    }
  },
)

const Compact = defineComponent<SpaceCompactProps>(
  (props, { slots, attrs, expose }) => {
    const mergedSize = useSize<SizeType>(ctx => (props?.size ?? ctx) as SizeType)
    const configContext = useConfig()
    const prefixCls = computed(() => configContext.value?.getPrefixCls?.('space-compact', props.prefixCls))
    const [hashId, cssVarCls] = useStyle(prefixCls)
    const compactItemContext = useSpaceCompactItemContext()

    const { direction, vertical, orientation } = toRefs(props)

    const [mergedOrientation, mergedVertical] = useOrientation(orientation, vertical, direction)

    const nativeElementRef = shallowRef<HTMLDivElement>()
    expose({
      nativeElement: nativeElementRef,
    })

    return () => {
      const { rootClass, block } = props

      const directionConfig = configContext.value?.direction
      const clx = classNames(
        prefixCls.value,
        hashId.value,
        cssVarCls.value,
        {
          [`${prefixCls.value}-rtl`]: directionConfig === 'rtl',
          [`${prefixCls.value}-block`]: block,
          [`${prefixCls.value}-vertical`]: mergedVertical.value,
        },
        rootClass,
      )

      const childNodes = filterEmpty(slots?.default?.())
      const nodes = childNodes.map((child, i) => {
        const key = child?.key || `${prefixCls.value}-item-${i}`
        return (
          <CompactItem
            compactSize={mergedSize.value}
            compactDirection={mergedOrientation.value}
            isFirstItem={i === 0 && (!compactItemContext.value || compactItemContext.value?.isFirstItem)}
            key={key}
            isLastItem={
              i === childNodes.length - 1 && (!compactItemContext.value || compactItemContext.value?.isLastItem)
            }
          >
            {child}
          </CompactItem>
        )
      })

      // =========================== Render ===========================
      if (childNodes.length === 0) {
        return null
      }

      return (
        <div ref={nativeElementRef} class={clx} {...attrs}>
          {nodes}
        </div>
      )
    }
  },
  {
    name: 'ASpaceCompact',
    inheritAttrs: false,
  },
)

export default Compact
