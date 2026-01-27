import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, defineComponent } from 'vue'
import { pureAttrs, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { useComponentBaseConfig, useComponentConfig } from '../config-provider/context.ts'
import useLocale from '../locale/useLocale.ts'
import DefaultEmptyImg from './empty'
import SimpleEmptyImg from './simple'
import useStyle from './style'

export interface TransferLocale {
  description: string
}

const defaultEmptyImg = <DefaultEmptyImg />
const simpleEmptyImg = <SimpleEmptyImg />

export type EmptySemanticName = keyof EmptySemanticClassNames & keyof EmptySemanticStyles

export interface EmptySemanticClassNames {
  root?: string
  image?: string
  description?: string
  footer?: string
}

export interface EmptySemanticStyles {
  root?: CSSProperties
  image?: CSSProperties
  description?: CSSProperties
  footer?: CSSProperties
}

export type EmptyClassNamesType = SemanticClassNamesType<EmptyProps, EmptySemanticClassNames>

export type EmptyStylesType = SemanticStylesType<EmptyProps, EmptySemanticStyles>

// For backward compatibility
export type SemanticName = EmptySemanticName

export interface EmptyProps extends ComponentBaseProps {
  classes?: EmptyClassNamesType
  styles?: EmptyStylesType
  image?: VueNode
  description?: VueNode
}

export interface EmptySlots {
  image: () => any
  description: () => any
  default: () => any
}

const defaultProps = {
  image: undefined,
  description: undefined,
}

const Empty = defineComponent<
  EmptyProps,
  EmptyEmit,
  string,
  SlotsType<EmptySlots>
>(
  (props = defaultProps, { slots, attrs }) => {
    const componentConfig = useComponentConfig('empty')
    const {
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('empty', props)
    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')
    const [hashId, cssVarCls] = useStyle(prefixCls)
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      EmptyClassNamesType,
      EmptyStylesType,
      EmptyProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(computed(() => props)),
    )

    const [locale] = useLocale('Empty')
    return () => {
      const description = getSlotPropsFnRun(slots, props, 'description')
      const des = description ?? locale?.value?.description
      const alt = typeof des === 'string' ? des : 'empty'
      const mergedImage = getSlotPropsFnRun(slots, props, 'image') ?? componentConfig.value?.image ?? defaultEmptyImg
      let imageNode: any = null
      if (typeof mergedImage === 'string') {
        imageNode = <img draggable={false} alt={alt} src={mergedImage} />
      }
      else {
        imageNode = mergedImage
      }
      const children = filterEmpty(slots?.default?.() ?? [])
      return (
        <div
          class={classNames(
            hashId.value,
            cssVarCls.value,
            prefixCls.value,
            contextClassName.value,
            {
              [`${prefixCls.value}-normal`]: mergedImage === simpleEmptyImg,
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
            },
            props.rootClass,
            mergedClassNames.value.root,
            (attrs as any).class,
          )}
          style={[
            mergedStyles.value.root,
            contextStyle.value,
            (attrs as any).style,
          ]}
          {...pureAttrs(attrs)}
        >
          <div
            class={classNames(
              `${prefixCls.value}-image`,
              mergedClassNames.value.image,
            )}
            style={mergedStyles.value.image}
          >
            {imageNode}
          </div>
          {des && (
            <div
              class={classNames(
                `${prefixCls.value}-description`,
                mergedClassNames.value.description,
              )}
              style={mergedStyles.value.description}
            >
              {des}
            </div>
          )}
          {!!children.length && (
            <div
              class={classNames(
                `${prefixCls.value}-footer`,
                mergedClassNames.value.footer,
              )}
              style={mergedStyles.value.footer}
            >
              {children}
            </div>
          )}
        </div>
      )
    }
  },
  {
    name: 'AEmpty',
  },
)

;(Empty as any).PRESENTED_IMAGE_DEFAULT = defaultEmptyImg
;(Empty as any).PRESENTED_IMAGE_SIMPLE = simpleEmptyImg

;(Empty as any).install = (app: App) => {
  app.component(Empty.name, Empty)
}

export default Empty as typeof Empty & {
  PRESENTED_IMAGE_DEFAULT: typeof defaultEmptyImg
  PRESENTED_IMAGE_SIMPLE: typeof simpleEmptyImg
}
