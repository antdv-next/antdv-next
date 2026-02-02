import type { PreviewGroupProps as VcPreviewGroupProps } from '@v-c/image'
import type { MaskType } from '../_util/hooks'
import type { DeprecatedPreviewConfig, ImageClassNamesType, ImageStylesType } from './index'
import {
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@antdv-next/icons'
import { PreviewGroup as VcPreviewGroup } from '@v-c/image'
import { clsx } from '@v-c/util'
import { getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent } from 'vue'
import { useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { toPropsRefs } from '../_util/tools'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import useMergedPreviewConfig from './hooks/useMergedPreviewConfig'
import usePreviewConfig from './hooks/usePreviewConfig'
import useStyle from './style'

export const icons = {
  rotateLeft: <RotateLeftOutlined />,
  rotateRight: <RotateRightOutlined />,
  zoomIn: <ZoomInOutlined />,
  zoomOut: <ZoomOutOutlined />,
  close: <CloseOutlined />,
  left: <LeftOutlined />,
  right: <RightOutlined />,
  flipX: <SwapOutlined />,
  flipY: <SwapOutlined rotate={90} />,
}

type OriginPreviewConfig = NonNullable<Exclude<VcPreviewGroupProps['preview'], boolean>>

export type GroupPreviewConfig = OriginPreviewConfig
  & DeprecatedPreviewConfig & {
    /** @deprecated Use `onOpenChange` instead */
    onVisibleChange?: (visible: boolean, prevVisible: boolean, current: number) => void
    mask?: MaskType
  }

export interface PreviewGroupProps extends
  Omit<VcPreviewGroupProps, 'preview' | 'styles'> {
  preview?: boolean | GroupPreviewConfig
  classes?: ImageClassNamesType
  styles?: ImageStylesType
}

const InternalPreviewGroup = defineComponent<PreviewGroupProps>(
  (props, { attrs, slots }) => {
    // =============================== MISC ===============================
    const {
      getPrefixCls,
      getPopupContainer: getContextPopupContainer,
      direction,
      preview: contextPreview,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('image', undefined, ['preview'])
    const { preview, classes, styles } = toPropsRefs(props, 'preview', 'classes', 'styles')

    const prefixCls = computed(() => getPrefixCls('image', props.previewPrefixCls))
    const previewPrefixCls = computed(() => `${prefixCls.value}-preview`)

    // ============================== Style ===============================
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const mergedRootClassName = computed(() => clsx(hashId.value, cssVarCls.value, rootCls.value))

    // ============================= Preview ==============================
    const previewConfigCtx = usePreviewConfig(preview)
    const previewConfig = computed(() => previewConfigCtx.value?.[0])
    const previewRootClassName = computed(() => previewConfigCtx.value?.[1])
    const previewMaskClassName = computed(() => previewConfigCtx.value?.[2])
    const contextPreviewConfigCtx = usePreviewConfig(contextPreview)
    const contextPreviewConfig = computed(() => contextPreviewConfigCtx.value?.[0])
    const contextPreviewRootClassName = computed(() => contextPreviewConfigCtx.value?.[1])
    const contextPreviewMaskClassName = computed(() => contextPreviewConfigCtx.value?.[2])

    // ============================ Semantics =============================
    const memoizedIcons = computed(() => {
      return {
        ...icons,
        left: direction.value === 'rtl' ? <RightOutlined /> : <LeftOutlined />,
        right: direction.value === 'rtl' ? <LeftOutlined /> : <RightOutlined />,
      }
    })

    const mergedPreview = useMergedPreviewConfig(
      // Preview config
      previewConfig as any,
      contextPreviewConfig as any,

      // MISC
      prefixCls,
      mergedRootClassName,
      getContextPopupContainer,
      computed(() => icons),
    )

    const mergedMask = computed(() => mergedPreview.value?.mask)
    const blurClassName = computed(() => mergedPreview.value?.blurClassName)

    // =========== Merged Props for Semantic ===========
    const mergedProps = computed(() => {
      return {
        ...props,
      } as PreviewGroupProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      ImageClassNamesType,
      ImageStylesType,
      PreviewGroupProps
    >(
      useToArr(
        contextClassNames,
        classes,
        computed(() => {
          return {
            cover: clsx(contextPreviewMaskClassName.value, previewMaskClassName.value),
            popup: {
              root: clsx(contextPreviewRootClassName.value, previewRootClassName.value),
              mask: clsx(
                {
                  [`${prefixCls.value}-preview-mask-hidden`]: !mergedMask.value,
                },
                blurClassName.value,
              ),
            },
          }
        }),
      ),
      useToArr(
        contextStyles,
        styles,
      ),
      useToProps(mergedProps),
      computed(() => {
        return {
          popup: {
            _default: 'root',
          },
        }
      }),
    )
    return () => {
      const otherProps = omit(props, ['previewPrefixCls', 'preview', 'classNames', 'classes', 'styles'])
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      return (
        <VcPreviewGroup
          {...restAttrs}
          class={className}
          style={style}
          preview={mergedPreview.value}
          previewPrefixCls={previewPrefixCls.value}
          icons={memoizedIcons.value}
          {...otherProps}
          classNames={mergedClassNames.value}
          styles={mergedStyles.value as any}
          v-slots={slots}
        />
      )
    }
  },
  {
    name: 'AImagePreviewGroup',
    inheritAttrs: false,
  },
)

export default InternalPreviewGroup
