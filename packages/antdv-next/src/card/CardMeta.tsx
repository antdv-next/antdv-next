import type { CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import { clsx } from '@v-c/util'
import { computed, defineComponent } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'

export type CardMetaSemanticName = keyof CardMetaSemanticClassNames & keyof CardMetaSemanticStyles

export interface CardMetaSemanticClassNames {
  root?: string
  section?: string
  avatar?: string
  title?: string
  description?: string
}

export interface CardMetaSemanticStyles {
  root?: CSSProperties
  section?: CSSProperties
  avatar?: CSSProperties
  title?: CSSProperties
  description?: CSSProperties
}

export type CardMetaClassNamesType = SemanticClassNamesType<
  CardMetaProps,
  CardMetaSemanticClassNames
>

export type CardMetaStylesType = SemanticStylesType<CardMetaProps, CardMetaSemanticStyles>

export interface CardMetaProps {
  prefixCls?: string
  avatar?: VueNode
  title?: VueNode
  description?: VueNode
  classes?: CardMetaClassNamesType
  styles?: CardMetaStylesType
}

export interface CardMetaSlots {
  avatar?: () => any
  title?: () => any
  description?: () => any
  default?: () => any
}

const CardMeta = defineComponent<
  CardMetaProps,
  EmptyEmit,
  string,
  SlotsType<CardMetaSlots>
>(
  (props, { slots, attrs }) => {
    const {
      prefixCls,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('cardMeta', props, [], 'card')
    const { classes: cardMetaClassNames, styles } = toPropsRefs(props, 'classes', 'styles')
    const metaPrefixCls = computed(() => `${prefixCls.value}-meta`)
    const mergedProps = computed(() => props)

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      CardMetaClassNamesType,
      CardMetaStylesType,
      CardMetaProps
    >(useToArr(contextClassNames, cardMetaClassNames), useToArr(contextStyles, styles), useToProps(mergedProps))
    return () => {
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const rootClassNames = clsx(
        metaPrefixCls.value,
        className,
        contextClassName.value,
        mergedClassNames.value?.root,
      )
      const rootStyles = {
        ...contextStyle.value,
        ...mergedStyles.value?.root,
        ...style,
      }

      const avatarClassNames = clsx(`${metaPrefixCls.value}-avatar`, mergedClassNames.value?.avatar)

      const titleClassNames = clsx(`${metaPrefixCls.value}-title`, mergedClassNames.value?.title)

      const descriptionClassNames = clsx(`${metaPrefixCls.value}-description`, mergedClassNames.value?.description)

      const sectionClassNames = clsx(`${metaPrefixCls.value}-section`, mergedClassNames.value?.section)
      const avatar = getSlotPropsFnRun(slots, props, 'avatar')
      const title = getSlotPropsFnRun(slots, props, 'title')
      const description = getSlotPropsFnRun(slots, props, 'description')
      const avatarDom = avatar
        ? (
            <div class={avatarClassNames} style={mergedStyles.value.avatar}>{avatar}</div>
          )
        : null

      const titleDom = title
        ? (
            <div class={titleClassNames} style={mergedStyles.value.title}>{title}</div>
          )
        : null

      const descriptionDom = description
        ? (
            <div class={descriptionClassNames} style={mergedStyles.value.description}>{description}</div>
          )
        : null

      const metaDetail = titleDom || descriptionDom
        ? (
            <div class={sectionClassNames} style={mergedStyles.value.section}>
              {titleDom}
              {descriptionDom}
            </div>
          )
        : null
      return (
        <div {...restAttrs} class={rootClassNames} style={rootStyles}>
          {avatarDom}
          {metaDetail}
        </div>
      )
    }
  },
  {
    name: 'ACardMeta',
    inheritAttrs: false,
  },
)

export default CardMeta
