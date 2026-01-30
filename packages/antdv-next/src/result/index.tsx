import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled, WarningFilled } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import pickAttrs from '@v-c/util/dist/pickAttrs'
import { filterEmpty, getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { computed, createVNode, defineComponent } from 'vue'
import {
  useMergeSemantic,
  useToArr,
  useToProps,
} from '../_util/hooks'
import { clsx, getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import noFound from './noFound'
import serverError from './serverError'
import useStyle from './style'
import unauthorized from './unauthorized'

export const IconMap: Record<string, any> = {
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  info: ExclamationCircleFilled,
  warning: WarningFilled,
}

export const ExceptionMap = {
  404: noFound,
  500: serverError,
  403: unauthorized,
}

export type ExceptionStatusType = 403 | 404 | 500 | '403' | '404' | '500'
export type ResultStatusType = ExceptionStatusType | keyof typeof IconMap

export type ResultSemanticName = keyof ResultSemanticClassNames & keyof ResultSemanticStyles

export interface ResultSemanticClassNames {
  root?: string
  title?: string
  subTitle?: string
  body?: string
  extra?: string
  icon?: string
}

export interface ResultSemanticStyles {
  root?: CSSProperties
  title?: CSSProperties
  subTitle?: CSSProperties
  body?: CSSProperties
  extra?: CSSProperties
  icon?: CSSProperties
}

export type ResultClassNamesType = SemanticClassNamesType<ResultProps, ResultSemanticClassNames>

export type ResultStylesType = SemanticStylesType<ResultProps, ResultSemanticStyles>

export interface ResultProps extends ComponentBaseProps {
  icon?: VueNode
  status?: ResultStatusType
  title?: VueNode
  subTitle?: VueNode
  extra?: VueNode
  classes?: ResultClassNamesType
  styles?: ResultStylesType
}

// ExceptionImageMap keys
const ExceptionStatus = Object.keys(ExceptionMap)

/**
 * Render icon if ExceptionStatus includes ,render svg image else render iconNode
 *
 * @param prefixCls
 * @param {status, icon}
 */

interface IconProps {
  icon?: VueNode
  status: ResultStatusType
}
const defaultIconProps = {
  icon: undefined,
} as any

const Icon = defineComponent<IconProps>(
  (props = defaultIconProps, { slots, attrs }) => {
    return () => {
      const { status } = props
      const icon = getSlotPropsFnRun(slots, props, 'icon', false)
      if (ExceptionStatus.includes(`${status}`)) {
        const SVGComponent = ExceptionMap[status as ExceptionStatusType]
        return (
          <div {...attrs}>
            <SVGComponent />
          </div>
        )
      }
      const iconNode = createVNode(
        IconMap[status as Exclude<ResultStatusType, ExceptionStatusType>],
      )
      if (icon === null || icon === false) {
        return null
      }

      return <div {...attrs}>{icon || iconNode}</div>
    }
  },
  {
    inheritAttrs: false,
  },
)

interface ExtraProps {
  extra: VueNode
}

const defaultExtraProps = {
  extra: undefined,
} as any

const Extra = defineComponent<ExtraProps>(
  (props = defaultExtraProps, { slots, attrs }) => {
    return () => {
      const extra = getSlotPropsFnRun(slots, props, 'extra')
      if (!extra) {
        return null
      }
      return <div {...attrs}>{extra}</div>
    }
  },
  {
    inheritAttrs: false,
  },
)

export interface ResultSlots {
  icon?: () => any
  title?: () => any
  subTitle?: () => any
  extra?: () => any
  default?: () => any
}

const defaultResultProps = {
  icon: undefined,
  status: 'info',
  title: undefined,
  subTitle: undefined,
  extra: undefined,
} as any

const Result = defineComponent<
  ResultProps,
  EmptyEmit,
  string,
  SlotsType<ResultSlots>
>(
  (props = defaultResultProps, { slots, attrs }) => {
    const {
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('result', props)
    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')
    const [hashId, cssVarCls] = useStyle(prefixCls)

    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => props)

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      ResultClassNamesType,
      ResultStylesType,
      ResultProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    return () => {
      const { status, rootClass } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const rootClassNames = classNames(
        prefixCls.value,
        `${prefixCls.value}-${status}`,
        className,
        contextClassName.value,
        rootClass,
        { [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
        hashId.value,
        cssVarCls.value,
        mergedClassNames.value.root,
      )
      const subTitle = getSlotPropsFnRun(slots, props, 'subTitle')
      const title = getSlotPropsFnRun(slots, props, 'title')
      const extra = getSlotPropsFnRun(slots, props, 'extra')
      const icon = getSlotPropsFnRun(slots, props, 'icon', false)
      const children = filterEmpty(slots?.default?.())
      const rootStyles = [mergedStyles.value.root, contextStyle.value, style]

      const titleClassNames = clsx(`${prefixCls.value}-title`, mergedClassNames.value.title)

      const subTitleClassNames = clsx(`${prefixCls.value}-subtitle`, mergedClassNames.value.subTitle)

      const extraClassNames = clsx(`${prefixCls.value}-extra`, mergedClassNames.value.extra)

      const bodyClassNames = clsx(`${prefixCls.value}-body`, mergedClassNames.value.body)

      const iconClassNames = clsx(
        `${prefixCls.value}-icon`,
        { [`${prefixCls.value}-image`]: ExceptionStatus.includes(`${status}`) },
        mergedClassNames.value.icon,
      )

      const restProps = pickAttrs(restAttrs, { aria: true, data: true })

      return (
        <div {...restProps} class={rootClassNames} style={rootStyles}>
          <Icon class={iconClassNames} status={status!} icon={icon} style={mergedStyles.value.icon} />
          <div class={titleClassNames} style={mergedStyles.value.title}>{title}</div>
          {!!subTitle && <div class={subTitleClassNames} style={mergedStyles.value.subTitle}>{subTitle}</div>}
          <Extra class={extraClassNames} extra={extra} style={mergedStyles.value.extra} />
          {!!children.length && <div class={bodyClassNames} style={mergedStyles.value.body}>{children}</div>}
        </div>
      )
    }
  },
  {
    name: 'AResult',
    inheritAttrs: false,
  },
)

;(Result as any).PRESENTED_IMAGE_403 = ExceptionMap['403']
;(Result as any).PRESENTED_IMAGE_404 = ExceptionMap['404']
;(Result as any).PRESENTED_IMAGE_500 = ExceptionMap['500']
;(Result as any).install = (app: App) => {
  app.component(Result.name, Result)
}

export default Result as typeof Result & {
  PRESENTED_IMAGE_403: typeof ExceptionMap['403']
  PRESENTED_IMAGE_404: typeof ExceptionMap['404']
  PRESENTED_IMAGE_500: typeof ExceptionMap['500']
}
