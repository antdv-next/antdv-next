import type { App, CSSProperties, SlotsType } from 'vue'
import type { Breakpoint } from '../_util/responsiveObserver'
import type { VueNode } from '../_util/type'
import type { ComponentBaseProps } from '../config-provider/context'
import type { AvatarSize } from './AvatarContext'
import ResizeObserver from '@v-c/resize-observer'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, defineComponent, isVNode, nextTick, onMounted, shallowRef, watch } from 'vue'
import { getAttrStyleAndClass } from '../_util/hooks'
import { responsiveArray } from '../_util/responsiveObserver'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { useSize } from '../config-provider/hooks/useSize'
import useBreakpoint from '../grid/hooks/useBreakpoint'
import { useAvatarContext } from './AvatarContext'
import useStyle from './style'

export interface AvatarProps extends ComponentBaseProps {
  /** Shape of avatar, options: `circle`, `square` */
  shape?: 'circle' | 'square'
  /**
   * Size of avatar, options: `large`, `small`, `default`
   * or a custom number size
   */
  size?: AvatarSize
  gap?: number

  /** Src of image avatar */
  src?: VueNode
  /** Srcset of image avatar */
  srcSet?: string

  draggable?: boolean | 'true' | 'false'
  /** Icon to be used in avatar */
  icon?: VueNode
  alt?: string
  crossOrigin?: '' | 'anonymous' | 'use-credentials'
  /* callback when img load error */
  /* return false to prevent Avatar show default fallback behavior, then you can do fallback by yourself */
  onError?: () => boolean
}

export interface AvatarEmits {
  click: (e: MouseEvent) => void

  // error: () => boolean
}

export interface AvatarSlots {
  icon: () => any
  src: () => any
  default: () => any
}

const defaults = {
  gap: 4,
} as any
const Avatar = defineComponent<
  AvatarProps,
  AvatarEmits,
  string,
  SlotsType<AvatarSlots>
>(
  (props = defaults, { slots, attrs }) => {
    const scale = shallowRef(1)
    const mounted = shallowRef(false)
    const isImgExist = shallowRef(true)

    const avatarNodeRef = shallowRef<HTMLSpanElement>()
    const avatarChildrenRef = shallowRef<HTMLSpanElement>()
    const {
      class: contextClassName,
      style: contextStyle,
      prefixCls,
    } = useComponentBaseConfig('avatar', props)
    const avatarCtx = useAvatarContext()

    const setScaleParam = () => {
      if (!avatarChildrenRef.value || !avatarNodeRef.value) {
        return
      }
      const childrenWidth = avatarChildrenRef.value.offsetWidth // offsetWidth avoid affecting be transform scale
      const nodeWidth = avatarNodeRef.value.offsetWidth
      // denominator is 0 is no meaning

      const gap = props.gap!
      if (childrenWidth !== 0 && nodeWidth !== 0) {
        if (gap! * 2 < nodeWidth) {
          scale.value = nodeWidth - gap * 2 < childrenWidth ? (nodeWidth - gap * 2) / childrenWidth : 1
        }
      }
    }

    onMounted(() => {
      mounted.value = true
    })

    watch(
      () => props.gap,
      async () => {
        await nextTick()
        setScaleParam()
      },
      {
        immediate: true,
      },
    )

    const handleImgLoadError = () => {
      const errorFlag = props.onError?.()
      if (errorFlag !== false) {
        isImgExist.value = false
      }
    }
    const size = useSize(
      ctxSize => props?.size ?? avatarCtx.value?.size ?? ctxSize ?? 'default',
    )
    const needResponsive = computed(() => {
      return Object.keys(typeof size.value === 'object' ? size.value || {} : {}).some(key => ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(key))
    })
    const screens = useBreakpoint(needResponsive)

    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    return () => {
      const children = filterEmpty(slots?.default?.() ?? [])
      const icon = getSlotPropsFnRun(slots, props, 'icon')
      const {
        shape,
        rootClass,
        draggable,
        srcSet,
        crossOrigin,
        alt,
      } = props

      const responsiveSizeStyleFn = () => {
        if (typeof size.value !== 'object') {
          return {}
        }

        const currentBreakpoint: Breakpoint = responsiveArray.find(screen => screens.value![screen])!
        const currentSize = (size.value as any)[currentBreakpoint] || size.value
        return currentSize
          ? {
              width: `${currentSize}px`,
              height: `${currentSize}px`,
              fontSize: currentSize && (icon || children.length) ? (`${currentSize / 2}px`) : '18px',
            }
          : {}
      }
      const responsiveSizeStyle = responsiveSizeStyleFn()

      const sizeCls = clsx({
        [`${prefixCls.value}-lg`]: size.value === 'large',
        [`${prefixCls.value}-sm`]: size.value === 'small',
      })
      const src = getSlotPropsFnRun(slots, props, 'src')

      if (src) {
        isImgExist.value = true
        scale.value = 1
      }
      const hasImageElement = isVNode(src)

      const mergedShape = shape || avatarCtx?.value?.shape || 'circle'
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const classString = clsx(
        prefixCls.value,
        sizeCls,
        contextClassName.value,
        `${prefixCls.value}-${mergedShape}`,
        {
          [`${prefixCls.value}-image`]: hasImageElement || (src && isImgExist.value),
          [`${prefixCls.value}-icon`]: !!icon,
        },
        cssVarCls.value,
        rootCls.value,
        className,
        rootClass,
        hashId.value,
      )

      const sizeStyle: CSSProperties
        = typeof size.value === 'number'
          ? {
              width: `${size.value}px`,
              height: `${size.value}px`,
              fontSize: icon ? (`${size.value / 2}px`) : '18px',
            }
          : {}

      let childrenToRender: any
      if (typeof src === 'string' && isImgExist.value) {
        childrenToRender = (
          <img
            src={src}
            draggable={draggable}
            srcset={srcSet}
            onError={handleImgLoadError}
            alt={alt}
            crossorigin={crossOrigin}
          />
        )
      }
      else if (hasImageElement) {
        childrenToRender = src
      }
      else if (icon) {
        childrenToRender = icon
      }
      else if (mounted.value || scale.value !== 1) {
        const transformString = `scale(${scale.value})`
        const childrenStyle: CSSProperties = {
          msTransform: transformString,
          WebkitTransform: transformString,
          transform: transformString,
        }

        childrenToRender = (
          <ResizeObserver onResize={setScaleParam}>
            <span class={`${prefixCls.value}-string`} ref={avatarChildrenRef} style={childrenStyle}>
              {children}
            </span>
          </ResizeObserver>
        )
      }
      else {
        childrenToRender = (
          <span class={`${prefixCls.value}-string`} style={{ opacity: 0 }} ref={avatarChildrenRef}>
            {children}
          </span>
        )
      }

      return (
        <span
          {...restAttrs}
          style={{ ...sizeStyle, ...responsiveSizeStyle, ...contextStyle.value, ...style }}
          class={classString}
          ref={avatarNodeRef}
        >
          {childrenToRender}
        </span>
      )
    }
  },
  {
    name: 'AAvatar',
    inheritAttrs: false,
  },
)

;(Avatar as any).install = (app: App) => {
  app.component(Avatar.name, Avatar)
}

export default Avatar
