import type { ImageProps as VcImageProps } from '@v-c/image'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { MaskType, SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type'
import type { PreviewGroupProps } from './PreviewGroup'
import VcImage from '@v-c/image'
import { clsx } from '@v-c/util'
import { getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, ref } from 'vue'
import { useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { devUseWarning, isDev } from '../_util/warning'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import useMergedPreviewConfig from './hooks/useMergedPreviewConfig'
import usePreviewConfig from './hooks/usePreviewConfig'
import PreviewGroup, { icons } from './PreviewGroup'

import useStyle from './style'

type OriginPreviewConfig = NonNullable<Exclude<VcImageProps['preview'], boolean>>

export interface DeprecatedPreviewConfig {
  /** @deprecated Use `open` instead */
  visible?: boolean
  /** @deprecated Use `classNames.root` instead */
  rootClass?: string
  /**
   * @deprecated This has been removed.
   * Preview will always be rendered after show.
   */
  forceRender?: boolean
  /**
   * @deprecated This has been removed.
   * Preview will always be rendered after show.
   */
  destroyOnClose?: boolean
  /** @deprecated Use `actionsRender` instead */
  toolbarRender?: OriginPreviewConfig['actionsRender']
}

export type ImageSemanticName = keyof ImageSemanticClassNames & keyof ImageSemanticStyles

export interface ImageSemanticClassNames {
  root?: string
  image?: string
  cover?: string
}

export interface ImageSemanticStyles {
  root?: CSSProperties
  image?: CSSProperties
  cover?: CSSProperties
}

export type ImagePopupSemanticName = keyof ImagePopupSemanticClassNames
  & keyof ImagePopupSemanticStyles

export interface ImagePopupSemanticClassNames {
  root?: string
  mask?: string
  body?: string
  footer?: string
  actions?: string
}

export interface ImagePopupSemanticStyles {
  root?: CSSProperties
  mask?: CSSProperties
  body?: CSSProperties
  footer?: CSSProperties
  actions?: CSSProperties
}

export type ImageClassNamesType = SemanticClassNamesType<
  ImageProps,
  ImageSemanticClassNames,
  { popup?: ImagePopupSemanticClassNames }
>

export type ImageStylesType = SemanticStylesType<
  ImageProps,
  ImageSemanticStyles,
  { popup?: ImagePopupSemanticStyles }
>
export type PreviewConfig = OriginPreviewConfig
  & DeprecatedPreviewConfig & {
    /** @deprecated Use `onOpenChange` instead */
    onVisibleChange?: (visible: boolean, prevVisible: boolean) => void
    /** @deprecated Use `classNames.cover` instead */
    maskClassName?: string
    mask?: MaskType | VueNode
  }
export interface ImageProps extends Omit<
  VcImageProps,
'preview' | 'classNames' | 'styles' | 'rootClassName' | 'onError' | 'onClick'
> {
  preview?: boolean | PreviewConfig
  /** @deprecated Use `styles.root` instead */
  wrapperStyle?: CSSProperties
  classes?: ImageClassNamesType
  styles?: ImageStylesType
  rootClass?: string
}

export interface ImageEmits {
  error: NonNullable<VcImageProps['onError']>
  click: NonNullable<VcImageProps['onClick']>
}

export interface ImageSlots {
  fallback: () => any
  placeholder: () => any
  imageRender: () => any
  cover: () => any
  actionsRender: () => OriginPreviewConfig['actionsRender']
}
const Image = defineComponent<
  ImageProps,
  ImageEmits,
  string,
  SlotsType<ImageSlots>
>(
  (props, { slots, emit, attrs }) => {
    const { preview, classes, styles } = toPropsRefs(props, 'preview', 'classes', 'styles')
    // =============================== MISC ===============================
    // Context
    const {
      getPopupContainer: getContextPopupContainer,
      class: contextClassName,
      style: contextStyle,
      preview: contextPreview,
      styles: contextStyles,
      classes: contextClassNames,
      fallback: contextFallback,
      prefixCls,
    } = useComponentBaseConfig(
      'image',
      props,
      ['preview', 'fallback'],
    )

    // ============================= Warning ==============================
    if (isDev) {
      const warning = devUseWarning('Image')
      warning.deprecated(!props.wrapperStyle, 'wrapperStyle', 'styles.root')
    }

    // ============================== Styles ==============================
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const mergedRootClassName = computed(() => clsx(props.rootClass, hashId.value, cssVarCls.value, rootCls.value))

    // ============================= Preview ==============================
    const usePreviewConfig_ = usePreviewConfig(preview)
    const useContextPreviewConfig_ = usePreviewConfig(contextPreview)
    const previewConfig = computed(() => usePreviewConfig_.value[0])
    const previewMaskClassName = computed(() => usePreviewConfig_.value[2])
    const previewRootClassName = computed(() => usePreviewConfig_.value[1])
    const contextPreviewConfig = computed(() => useContextPreviewConfig_.value[0])
    const contextPreviewMaskClassName = computed(() => useContextPreviewConfig_.value[2])
    const contextPreviewRootClassName = computed(() => useContextPreviewConfig_.value[1])

    const mergedPreviewConfig = useMergedPreviewConfig(
      // Preview config
      previewConfig as any,
      contextPreviewConfig as any,

      // MISC
      prefixCls,
      mergedRootClassName,
      getContextPopupContainer,
      computed(() => icons),

      ref(true),
    )

    // =========== Merged Props for Semantic ===========
    const mergedProps = computed(() => {
      return {
        ...props,
        preview: mergedPreviewConfig.value,
      } as ImageProps
    })
    // ============================= Semantic =============================
    const mergedLegacyClassNames = computed(() => {
      return {
        cover: clsx(contextPreviewMaskClassName.value, previewMaskClassName.value),
        popup: { root: clsx(contextPreviewRootClassName.value, previewRootClassName.value) },
      }
    })

    const mergedMask = computed(() => mergedPreviewConfig?.value?.mask)
    const blurClassName = computed(() => mergedPreviewConfig?.value?.blurClassName)
    const mergedPopupClassNames = computed(() => {
      return {
        mask: clsx(
          {
            [`${prefixCls.value}-preview-mask-hidden`]: !mergedMask.value,
          },
          blurClassName.value,
        ),
      }
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      ImageClassNamesType,
      ImageStylesType,
      ImageProps
    >(
      useToArr(contextClassNames, classes, mergedLegacyClassNames, computed(() => ({ popup: mergedPopupClassNames.value }))),
      useToArr(contextStyles, computed(() => ({ root: props.wrapperStyle })), styles),
      useToProps(mergedProps),
      computed(() => {
        return {
          popup: { _default: 'root' },
        }
      }),
    )
    return () => {
      const mergedFallback = getSlotPropsFnRun(slots, props, 'fallback') ?? contextFallback.value
      const placeholder = getSlotPropsFnRun(slots, props, 'placeholder', false)
      const { style, className, restAttrs } = getAttrStyleAndClass(attrs)
      const mergedClassName = clsx(className, hashId.value, contextClassName.value)

      const mergedStyle = {
        ...contextStyle.value,
        ...style,
      }
      const otherProps = omit(props, [
        'prefixCls',
        'preview',
        'styles',
        'classes',
        'rootClass',
        'wrapperStyle',
        'fallback',
      ])

      const onEvents = {
        onError: (e: Event) => {
          emit('error', e)
        },
        onClick: (e: Event) => {
          emit('click', e)
        },
      } as Pick<VcImageProps, 'onError' | 'onClick'>
      if (slots?.imageRender) {
        mergedPreviewConfig.value.imageRender = slots.imageRender
      }
      if ((mergedPreviewConfig.value?.mask || typeof mergedPreviewConfig.value?.mask === 'boolean') && !mergedPreviewConfig.value.cover) {
        mergedPreviewConfig.value.cover = slots?.cover?.()
      }
      // ============================== Render ==============================
      return (
        <VcImage
          {...restAttrs}
          prefixCls={prefixCls.value}
          preview={(mergedPreviewConfig.value || false) as any}
          rootClassName={mergedRootClassName.value}
          class={mergedClassName}
          style={mergedStyle}
          fallback={mergedFallback}
          {...omit(otherProps, ['placeholder'])}
          {...onEvents}
          placeholder={placeholder}
          classNames={mergedClassNames.value}
          styles={mergedStyles.value}
        />
      )
    }
  },
  {
    name: 'AImage',
    inheritAttrs: false,
  },
)

;(Image as any).install = (app: App) => {
  app.component(Image.name, Image)
  app.component(PreviewGroup.name, PreviewGroup)
}

;(Image as any).PreviewGroup = PreviewGroup

export default Image as typeof Image & {
  PreviewGroup: typeof PreviewGroup
}

export const ImagePreviewGroup = PreviewGroup

export type ImagePreviewGroupProps = PreviewGroupProps
