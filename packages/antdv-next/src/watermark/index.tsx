import type { App, CSSProperties } from 'vue'
import type { WatermarkContextProps } from './context.ts'
import { useMutateObserver } from '@v-c/mutate-observer'
import canUseDom from '@v-c/util/dist/Dom/canUseDom'
import { omit } from 'es-toolkit'
import { computed, defineComponent, ref, shallowRef, watch } from 'vue'
import toList from '../_util/toList.ts'
import { useToken } from '../theme/internal.ts'
import { WatermarkContextProvider } from './context.ts'
import useClips, { FontGap } from './useClips.ts'
import useRafDebounce from './useRafDebounce.ts'
import useSingletonCache from './useSingletonCache.ts'
import useWatermark from './useWatermark.ts'
import { getPixelRatio, reRendering } from './utils.ts'

export interface WatermarkProps {
  zIndex?: number
  rotate?: number
  width?: number
  height?: number
  image?: string
  content?: string | string[]
  font?: {
    color?: CanvasFillStrokeStyles['fillStyle']
    fontSize?: number | string
    fontWeight?: 'normal' | 'light' | 'weight' | number
    fontStyle?: 'none' | 'normal' | 'italic' | 'oblique'
    fontFamily?: string
    textAlign?: CanvasTextAlign
  }
  rootClass?: string
  gap?: [number, number]
  offset?: [number, number]
  inherit?: boolean
  onRemove?: (() => void) | undefined
}

/**
 * Only return `next` when size changed.
 * This is only used for elements compare, not a shallow equal!
 */
function getSizeDiff<T>(prev: Set<T>, next: Set<T>) {
  return prev.size === next.size ? prev : next
}

const DEFAULT_GAP_X = 100
const DEFAULT_GAP_Y = 100

const fixedStyle: CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
}

const defaults = {
  /**
   * The antd content layer zIndex is basically below 10
   * https://github.com/ant-design/ant-design/blob/6192403b2ce517c017f9e58a32d58774921c10cd/components/style/themes/default.less#L335
   */
  zIndex: 9,
  rotate: -22,
  inherit: true,
  gap: [DEFAULT_GAP_X, DEFAULT_GAP_Y],
  font: {},
} as any

const Watermark = defineComponent<WatermarkProps>(
  (props = defaults, { slots, attrs }) => {
    const [,token] = useToken()
    const onRemove = computed(() => props.onRemove)
    const color = computed(() => props.font?.color ?? token.value.colorFill)
    const fontSize = computed(() => props?.font?.fontSize ?? token.value?.fontSizeLG)
    const fontWeight = computed(() => props?.font?.fontWeight ?? 'normal')
    const fontStyle = computed(() => props?.font?.fontStyle ?? 'normal')
    const fontFamily = computed(() => props?.font?.fontFamily ?? 'sans-serif')
    const textAlign = computed(() => props?.font?.textAlign ?? 'center')
    const gap = computed(() => props.gap!)
    const gapXCenter = computed(() => gap.value[0] / 2)
    const gapYCenter = computed(() => gap.value[1] / 2)
    const offsetLeft = computed(() => props.offset?.[0] ?? gapXCenter.value)
    const offsetTop = computed(() => props.offset?.[1] ?? gapYCenter.value)
    const mergedStyle = computed<CSSProperties>(() => {
      return {
        ...fixedStyle,
        ...(attrs as any).style,
      }
    })

    const markStyle = computed(() => {
      const mergedMarkStyle: CSSProperties = {
        zIndex: props.zIndex,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        backgroundRepeat: 'repeat',
      }

      /** Calculate the style of the offset */
      let positionLeft = offsetLeft.value - gapXCenter.value
      let positionTop = offsetTop.value - gapYCenter.value
      if (positionLeft > 0) {
        mergedMarkStyle.left = `${positionLeft}px`
        mergedMarkStyle.width = `calc(100% - ${positionLeft}px)`
        positionLeft = 0
      }
      if (positionTop > 0) {
        mergedMarkStyle.top = `${positionTop}px`
        mergedMarkStyle.height = `calc(100% - ${positionTop}px)`
        positionTop = 0
      }
      mergedMarkStyle.backgroundPosition = `${positionLeft}px ${positionTop}px`
      return mergedMarkStyle
    })
    const container = shallowRef<HTMLElement | null>(null)

    // Used for nest case like Modal, Drawer
    const subElements = ref(new Set<HTMLElement>())

    const targetElements = computed(() => {
      const list = container.value ? [container.value] : []
      return [...list, ...Array.from(subElements.value)]
    })

    // ============================ Content =============================
    /**
     * Get the width and height of the watermark. The default values are as follows
     * Image: [120, 64]; Content: It's calculated by content;
     */
    const getMarkSize = (ctx: CanvasRenderingContext2D) => {
      let defaultWidth = 120
      let defaultHeight = 64
      if (!props.image && ctx.measureText) {
        ctx.font = `${Number(fontSize.value)}px ${fontFamily.value}`
        const contents = toList(props.content)
        const sizes = contents.map((item) => {
          const metrics = ctx.measureText(item!)

          return [metrics.width, metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent]
        })

        defaultWidth = Math.ceil(Math.max(...sizes.map(size => size[0]!)))
        defaultHeight = Math.ceil(Math.max(...sizes.map(size => size[1]!))) * contents.length
          + (contents.length - 1) * FontGap
      }
      const width = props.width
      const height = props.height
      return [width ?? defaultWidth, height ?? defaultHeight] as const
    }

    const getClips = useClips()
    type ClipParams = Parameters<typeof getClips>
    const getClipsCache = useSingletonCache<ClipParams, ReturnType<typeof getClips>>()
    const watermarkInfo = ref<[base64: string, contentWidth: number] | null>(null)

    // Generate new Watermark content
    const renderWatermark = () => {
      if (!canUseDom()) {
        return
      }
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const ratio = getPixelRatio()
        const [markWidth, markHeight] = getMarkSize(ctx)

        const drawCanvas = (
          drawContent?: NonNullable<WatermarkProps['content']> | HTMLImageElement,
        ) => {
          const params: ClipParams = [
            drawContent || '',
            props.rotate!,
            ratio,
            markWidth,
            markHeight,
            {
              color: color.value,
              fontSize: fontSize.value,
              fontStyle: fontStyle.value,
              fontWeight: fontWeight.value,
              fontFamily: fontFamily.value,
              textAlign: textAlign.value,
            },
            gap.value[0],
            gap.value[1],
          ] as const

          const [nextClips, clipWidth] = getClipsCache(params, () => getClips(...params))
          watermarkInfo.value = [nextClips, clipWidth]
        }

        if (props.image) {
          const img = new Image()
          img.onload = () => {
            drawCanvas(img)
          }
          img.onerror = () => {
            drawCanvas(props.content)
          }
          img.crossOrigin = 'anonymous'
          img.referrerPolicy = 'no-referrer'
          img.src = props.image
        }
        else {
          drawCanvas(props.content)
        }
      }
    }

    const syncWatermark = useRafDebounce(renderWatermark)
    // ============================= Effect =============================
    // Append watermark to the container
    const [appendWatermark, removeWatermark, isWatermarkEle] = useWatermark(markStyle, onRemove)

    watch([watermarkInfo, targetElements], ([watermarkInfo, targetElements]) => {
      if (watermarkInfo) {
        targetElements.forEach((holder) => {
          appendWatermark(watermarkInfo[0], watermarkInfo[1], holder)
        })
      }
    })

    // ============================ Observe =============================
    const onMutate = (mutations: MutationRecord[]) => {
      mutations.forEach((mutation) => {
        if (reRendering(mutation, isWatermarkEle)) {
          syncWatermark()
        }
        else if (mutation.target === container.value && mutation.attributeName === 'style') {
          // We've only force container not modify.
          // Not consider nest case.
          const keyStyles = Object.keys(fixedStyle)
          for (let i = 0; i < keyStyles.length; i += 1) {
            const key = keyStyles[i]!
            const oriValue = (mergedStyle.value as any)[key]
            const currentValue = (container.value.style as any)[key]

            if (oriValue && oriValue !== currentValue) {
              (container.value.style as any)[key] = oriValue
            }
          }
        }
      })
    }
    useMutateObserver(targetElements, onMutate)

    watch([
      () => props.offset,
      () => props.zIndex,
      () => props.width,
      () => props.height,
      () => props.rotate,
      () => props.image,
      () => props.content,
      fontSize,
      fontWeight,
      fontStyle,
      fontFamily,
      textAlign,
      gap,
      offsetLeft,
      offsetTop,
    ], syncWatermark, {
      immediate: true,
    })
    // ============================ Context =============================
    const watermarkContext: WatermarkContextProps = {
      add: (ele) => {
        const clone = new Set(subElements.value)
        clone.add(ele)
        subElements.value = getSizeDiff(subElements.value, clone)
      },
      remove: (ele) => {
        removeWatermark(ele)
        const clone = new Set(subElements.value)
        clone.delete(ele)
        subElements.value = getSizeDiff(subElements.value, clone)
      },
    }
    return () => {
      const children = slots?.default?.()
      // ============================= Render =============================
      const childNode = props.inherit ? (<WatermarkContextProvider {...watermarkContext}>{children}</WatermarkContextProvider>) : children

      return (
        <div ref={container} class={[props.rootClass, (attrs as any).class]} {...omit(attrs, ['style', 'class'])} style={mergedStyle.value}>
          {childNode}
        </div>
      )
    }
  },
  {
    name: 'AWatermark',
    inheritAttrs: false,
  },
)

;(Watermark as any).install = (app: App) => {
  app.component(Watermark.name, Watermark)
}

export default Watermark
