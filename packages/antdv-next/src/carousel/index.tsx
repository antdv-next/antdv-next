import type { SlickProps as Settings } from '@v-c/slick'
import type { App, ButtonHTMLAttributes, CSSProperties, SlotsType } from 'vue'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import SlickCarousel from '@v-c/slick'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef, watch } from 'vue'
import { getAttrStyleAndClass } from '../_util/hooks'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { devUseWarning, isDev } from '../_util/warning.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import useStyle, { DotDuration } from './style'

export type CarouselEffect = 'scrollx' | 'fade'
export type DotPlacement = 'top' | 'bottom' | 'start' | 'end'
export interface CarouselProps extends
  Omit<Settings, 'prevArrow' | 'nextArrow' | 'dots' | 'className' | 'style' | 'dotsClass' | 'autoplay' | 'onInit' | 'onReInit' | 'onEdge' | 'onSwipe' | 'onLazyLoad' | 'onLazyLoadError'>, ComponentBaseProps {
  effect?: CarouselEffect
  id?: string
  slickGoTo?: number
  /** @deprecated Please use `dotPlacement` instead  */
  dotPosition?: DotPlacement | 'left' | 'right'
  dotPlacement?: DotPlacement
  dots?: boolean | { class?: string }
  waitForAnimate?: boolean
  autoplay?: boolean | { dotDuration?: boolean }
  prevArrow?: VueNode
  nextArrow?: VueNode
}

export interface CarouselSlots {
  default: () => any
  prevArrow: () => any
  nextArrow: () => any
}

export interface CarouselEmits {
  init: NonNullable<Settings['onInit']>
  reInit: NonNullable<Settings['onReInit']>
  edge: NonNullable<Settings['onEdge']>
  swipe: NonNullable<Settings['onSwipe']>
  lazyLoad: NonNullable<Settings['onLazyLoad']>
  lazyLoadError: NonNullable<Settings['onLazyLoadError']>
}

export interface CarouselRef {
  goTo: (slide: number, dontAnimate?: boolean) => void
  next: () => void
  prev: () => void
  autoPlay: (playType?: 'update' | 'leave' | 'blur') => void
  innerSlider: any
}

const omitKeys = [
  'dots',
  'arrows',
  'prevArrow',
  'nextArrow',
  'draggable',
  'waitForAnimate',
  'dotPosition',
  'dotPlacement',
  'vertical',
  'rootClass',
  'id',
  'autoplay',
  'autoplaySpeed',
  'rtl',
] as string[]

const dotsClass = 'slick-dots'

interface ArrowType extends
  /** @vue-ignore */ ButtonHTMLAttributes {
  currentSlide?: number
  slideCount?: number
}

const ArrowButton = defineComponent<ArrowType>(
  (_, { slots, attrs }) => {
    return () => {
      return (
        <button type="button" {...attrs}>
          {slots?.default?.()}
        </button>
      )
    }
  },
  {
    name: 'ArrowButton',
    inheritAttrs: false,
  },
)

const defaults = {
  dots: true,
  arrows: false,
  draggable: false,
  waitForAnimate: false,
  autoplay: false,
  autoplaySpeed: 3000,
  initialSlide: 0,
} as any

const Carousel = defineComponent<
  CarouselProps,
  CarouselEmits,
  string,
  SlotsType<CarouselSlots>
>(
  (props = defaults, { slots, emit, expose, attrs }) => {
    const mergedDotPlacement = computed(() => {
      const { dotPlacement, dotPosition } = props
      const placement: DotPlacement | 'left' | 'right' = dotPlacement ?? dotPosition ?? 'bottom'
      switch (placement) {
        case 'left':
          return 'start'
        case 'right':
          return 'end'
        default:
          return placement
      }
    })
    const mergedVertical = computed(() => props?.vertical ?? (mergedDotPlacement.value === 'start' || mergedDotPlacement.value === 'end'))
    const {
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
    } = useComponentBaseConfig('carousel', props)
    const slickRef = shallowRef()

    const goTo = (slide: number, dontAnimate = false) => {
      slickRef.value?.slickGoTo?.(slide, dontAnimate)
    }
    expose({
      goTo,
      autoPlay: playType => slickRef?.value?.innerSlider?.autoPlay?.(playType),
      next: () => slickRef?.value?.innerSlider?.slickNext?.(),
      prev: () => slickRef?.value?.innerSlider?.slickPrev?.(),
      innerSlider: computed(() => slickRef.value?.innerSlider),
    } as CarouselRef)

    const children = computed(() => slots?.default?.())
    const childNodes = computed(() => {
      return filterEmpty(children.value || []).filter(Boolean)
    })
    const count = computed(() => childNodes.value.length)
    const isRTL = computed(() => (props?.rtl ?? direction.value === 'rtl') && !props.vertical)

    watch([count, () => props?.initialSlide, isRTL], () => {
      const { initialSlide = 0 } = props
      if (count.value > 0) {
        const newIndex = isRTL.value ? count.value - initialSlide - 1 : initialSlide
        goTo(newIndex, false)
      }
    }, {
      immediate: true,
    })

    // ========================== Warn ==========================
    if (isDev) {
      const warning = devUseWarning('Carousel')

      warning.deprecated(!props?.dotPosition, 'dotPosition', 'dotPlacement')
    }
    const [hashId, cssVarCls] = useStyle(prefixCls)

    const onAttrs: Partial<Settings> = {
      onSwipe(...args) {
        emit('swipe', ...args)
      },
      onInit() {
        emit('init')
      },
      onEdge(...args) {
        emit('edge', ...args)
      },
      onReInit() {
        emit('reInit')
      },
      onLazyLoad(...args) {
        emit('lazyLoad', ...args)
      },
      onLazyLoadError() {
        emit('lazyLoadError')
      },
    }
    return () => {
      const {
        dots,
        rootClass,
        autoplay,
        autoplaySpeed,
        id,
        arrows,
        draggable,
        waitForAnimate,
      } = props
      const otherProps = omit(props, omitKeys)
      const enableDots = !!dots
      const dsClass = clsx(
        dotsClass,
        `${dotsClass}-${mergedDotPlacement.value}`,
        typeof dots === 'boolean' ? false : dots?.class,
      )
      const { className: customClassName, style, restAttrs } = getAttrStyleAndClass(attrs)
      const newProps = {
        vertical: mergedVertical.value,
        className: clsx(customClassName, contextClassName.value),
        style: { ...contextStyle.value, ...style },
        autoplay: !!autoplay,
        ...otherProps,
      }

      if (newProps.effect === 'fade') {
        newProps.fade = true
      }
      const className = clsx(
        prefixCls.value,
        {
          [`${prefixCls.value}-rtl`]: isRTL.value,
          [`${prefixCls.value}-vertical`]: newProps.vertical,
        },
        hashId.value,
        cssVarCls.value,
        rootClass,
      )

      const mergedShowDuration
        = autoplay && (typeof autoplay === 'object' ? autoplay.dotDuration : false)

      const dotDurationStyle: CSSProperties = mergedShowDuration
        ? { [DotDuration]: `${autoplaySpeed}ms` }
        : {}

      const prevArrow = getSlotPropsFnRun(slots, props, 'prevArrow')
      const nextArrow = getSlotPropsFnRun(slots, props, 'nextArrow')
      return (
        <div {...restAttrs} class={className} id={id} style={dotDurationStyle}>
          <SlickCarousel
            ref={slickRef}
            {...onAttrs}
            {...newProps as any}
            dots={enableDots}
            dotsClass={dsClass}
            arrows={arrows}
            prevArrow={prevArrow ?? <ArrowButton aria-label={isRTL.value ? 'next' : 'prev'} />}
            nextArrow={nextArrow ?? <ArrowButton aria-label={isRTL.value ? 'prev' : 'next'} />}
            draggable={draggable}
            verticalSwiping={mergedVertical.value}
            autoplaySpeed={autoplaySpeed}
            waitForAnimate={waitForAnimate}
            rtl={isRTL.value}
          >
            {slots?.default?.()}
          </SlickCarousel>
        </div>
      )
    }
  },
  {
    name: 'ACarousel',
    inheritAttrs: false,
  },
)
;(Carousel as any).install = (app: App) => {
  app.component(Carousel.name, Carousel)
}

export default Carousel
