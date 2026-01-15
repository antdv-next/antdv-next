import type { CSSProperties } from 'vue'
import { classNames, warning } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { createVNode, defineComponent, shallowRef } from 'vue'
import { svgBaseProps, useInsertStyles } from '../utils.ts'
import { useIconContext } from './Context.tsx'

export interface IconBaseProps {
  spin?: boolean
  rotate?: number
}

export interface CustomIconComponentProps {
  width: string | number
  height: string | number
  fill?: string
  viewBox?: string
}

export interface IconComponentProps extends IconBaseProps {
  viewBox?: string
  component?: any
  ariaLabel?: any
  tabIndex?: number
  onClick?: (e: MouseEvent) => void
}

const Icon = defineComponent<IconComponentProps>(
  (props, { slots, attrs }) => {
    const iconRef = shallowRef()
    useInsertStyles(iconRef)
    const iconContext = useIconContext()
    return () => {
      const { rootClass, prefixCls = 'anticon' } = iconContext.value
      const { spin, component, rotate, viewBox, tabIndex, onClick } = props
      const classString = classNames(
        rootClass,
        prefixCls,
        {
          [`${prefixCls}-spin`]: !!spin && !!component,
        },
      )

      const svgClassString = classNames({
        [`${prefixCls}-spin`]: !!spin,
      })
      const svgStyle: CSSProperties | undefined = rotate
        ? {
            msTransform: `rotate(${rotate}deg)`,
            transform: `rotate(${rotate}deg)`,
          }
        : undefined

      const innerSvgProps: any = {
        ...svgBaseProps,
        class: svgClassString,
        style: svgStyle,
        viewBox,
      }
      if (!viewBox) {
        delete innerSvgProps.viewBox
      }
      const children = filterEmpty(slots?.default?.())

      warning(Boolean(component || children.length), 'Should have `component` prop or `children`.')

      const renderInnerNode = () => {
        if (slots?.component) {
          return slots.component()
        }
        if (component) {
          return createVNode(component, innerSvgProps, slots)
        }
        if (children.length) {
          warning(
            Boolean(viewBox) || (children.length === 1 && (children[0] as any)?.props?.type === 'use'),
            'Make sure that you provide correct `viewBox`'
            + ' prop (default `0 0 1024 1024`) to the icon.',
          )
          return <svg {...innerSvgProps} viewBox={viewBox}>{slots?.default?.()}</svg>
        }
        return null
      }

      let iconTabIndex = tabIndex
      if (iconTabIndex === undefined && onClick) {
        iconTabIndex = -1
      }
      return (
        <span
          role="img"
          {...attrs}
          tabindex={iconTabIndex}
          onClick={onClick}
          class={classString}
        >
          {renderInnerNode()}
        </span>
      )
    }
  },
  {
    name: 'AntdIcon',
    inheritAttrs: false,
  },
)

export default Icon
