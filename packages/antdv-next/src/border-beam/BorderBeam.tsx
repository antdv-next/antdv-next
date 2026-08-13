import type { App, CSSProperties, SlotsType, VNode } from 'vue'
import type { VueNode } from '../_util/type'
import type { BorderBeamColor } from './util'
import { unit } from '@antdv-next/cssinjs'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { unrefElement } from '@vueuse/core'
import { cloneVNode, computed, defineComponent, isVNode, shallowRef, Teleport } from 'vue'
import { isNonNullable, isNumber } from '../_util/is'
import { useComponentBaseConfig } from '../config-provider/context'
import { genCssVar } from '../theme/util/genStyleUtils'
import useBorderSize from './hooks/useBorderSize'
import useStyle from './style'
import { DEFAULT_BORDER_BEAM_DURATION, getBorderBeamGradient } from './util'

export type { BorderBeamColor, BorderBeamGradient } from './util'

export interface BorderBeamProps {
  prefixCls?: string
  rootClass?: string
  color?: BorderBeamColor
  count?: number
  duration?: number
  lineWidth?: number | string
  outset?: number | string
  size?: number | string
}

export interface BorderBeamSlots {
  default?: () => any
}

function getInset(width: number | string): string {
  return typeof width === 'string' ? `calc(-1 * ${width})` : `-${width}px`
}

const BorderBeam = defineComponent<
  BorderBeamProps,
  Record<string, never>,
  string,
  SlotsType<BorderBeamSlots>
>(
  (props, { attrs, slots }) => {
    const {
      class: contextClassName,
      style: contextStyle,
      getPrefixCls,
      rootPrefixCls,
    } = useComponentBaseConfig('borderBeam', props)

    const prefixCls = computed(() => getPrefixCls('border-beam', props.prefixCls))
    const rootCls = computed(() => rootPrefixCls.value ?? getPrefixCls())
    const [hashId, cssVarCls] = useStyle(prefixCls)

    const varName = computed(() => genCssVar(rootCls.value, 'border-beam')[0])

    const hostDom = shallowRef<HTMLElement | null>(null)
    const borderWidth = useBorderSize(hostDom)
    const beamGradient = computed(() => getBorderBeamGradient(props.color))

    const mergedCount = computed<number>(() => {
      const { count = 1 } = props
      return isNumber(count) && Number.isFinite(count) && count >= 1 ? Math.floor(count) : 1
    })

    const mergedDuration = computed<number>(() => {
      const { duration } = props
      return isNumber(duration) && duration > 0 ? duration : DEFAULT_BORDER_BEAM_DURATION
    })

    const insetOffset = computed<string>(() => {
      const { outset } = props
      if (isNonNullable(outset)) {
        return getInset(outset)
      }
      return borderWidth.value.map(getInset).join(' ')
    })

    const setHostDom = (el: unknown) => {
      hostDom.value = (unrefElement(el as any) as HTMLElement | null) ?? null
    }

    return () => {
      const { duration, lineWidth, size } = props
      const children = filterEmpty(slots.default?.() ?? [])
      const count = mergedCount.value
      const getBeamStyle = (index: number): CSSProperties & Record<`--${string}`, string> => ({
        ...(contextStyle?.value ?? {}),
        ...((attrs as any).style ?? {}),
        ...(beamGradient.value && { [varName.value('beam-gradient')]: beamGradient.value }),
        ...(isNumber(duration) && duration > 0 && { [varName.value('duration')]: `${duration}s` }),
        ...(isNonNullable(lineWidth) && { [varName.value('line-width')]: unit(lineWidth) }),
        ...(isNonNullable(size) && { [varName.value('size')]: unit(size) }),
        ...(index > 0 && {
          [varName.value('delay')]: `${(-mergedDuration.value * index) / count}s`,
        }),
        [varName.value('inset-offset')]: insetOffset.value,
      })

      const beamCls = clsx(
        prefixCls.value,
        contextClassName?.value,
        props.rootClass,
        (attrs as any).class,
        hashId.value,
        cssVarCls.value,
      )

      const beamNode: VueNode = hostDom.value
        ? (
            <Teleport to={hostDom.value}>
              {Array.from({ length: count }, (_, index) => (
                <div
                  key={index}
                  aria-hidden="true"
                  class={beamCls}
                  style={getBeamStyle(index)}
                />
              ))}
            </Teleport>
          )
        : null

      const renderChild = () => {
        if (children.length !== 1 || !isVNode(children[0])) {
          return children
        }
        const child = children[0] as VNode
        return cloneVNode(child, { ref: setHostDom }, true)
      }

      return (
        <>
          {renderChild()}
          {beamNode}
        </>
      )
    }
  },
  {
    name: 'ABorderBeam',
    inheritAttrs: false,
  },
)

export default BorderBeam

;(BorderBeam as any).install = (app: App) => {
  app.component(BorderBeam.name, BorderBeam)
}
