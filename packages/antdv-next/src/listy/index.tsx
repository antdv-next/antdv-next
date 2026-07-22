import type { App } from 'vue'
import type { ListyClassNames, ListyProps, ListyStyles } from './interface'
import VcListy from '@v-c/listy'
import { clsx } from '@v-c/util'
import { computed, defineComponent, shallowRef, useAttrs } from 'vue'
import { useMergeSemantic, useSemanticRootStyle, useToArr, useToProps } from '../_util/hooks/useMergeSemantic'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { useToken } from '../theme/internal'
import useStyle from './style'

export type {
  ListyClassNames,
  ListyProps,
  ListyRef,
  ListyScrollToConfig,
  ListyStyles,
  ScrollAlign,
} from './interface'

interface ListyEmits {
  scroll: [event: Event]
}
interface ListySlots {
  itemRender: (item: any) => any
}

const Listy = defineComponent<ListyProps, ListyEmits, string, ListySlots>((props, { expose, slots }) => {
  const listyRef = shallowRef<InstanceType<typeof VcListy>>()
  const attrs = useAttrs()
  const {
    getPrefixCls,
    direction,
    class: contextClassName,
    style: contextStyle,
    classes: contextClassNames,
    styles: contextStyles,
    virtual: contextVirtual,
  } = useComponentBaseConfig('listy')
  const prefixCls = computed(() => getPrefixCls('listy', props.prefixCls))
  const rootCls = useCSSVarCls(prefixCls)
  const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
  const [, token] = useToken()

  const contextStyleRoot = useSemanticRootStyle(contextStyle)
  const styleRoot = useSemanticRootStyle(computed(() => attrs.style))

  const [mergedClassNames, mergedStyles] = useMergeSemantic<
    ListyClassNames,
    ListyStyles,
    ListyProps
  >(
    useToArr(contextClassNames, computed(() => props.classes)),
    useToArr(contextStyles, contextStyleRoot, computed(() => props.styles), styleRoot),
    useToProps(computed(() => props)),
  )
  expose({
    scrollTo: (config?: number | { key?: number, groupKey?: string, align?: 'top' | 'bottom' | 'auto' }) => {
      listyRef.value?.scrollTo(config)
    },
  })
  return () => {
    const {
      classes,
      styles,
      rootClassName,
      virtual,
      itemRender = slots.itemRender,
      ...restProps
    } = props

    const rootClassNames = clsx(
      contextClassName.value,
      mergedClassNames.value.root,
      rootClassName,
      attrs.class,
      hashId.value,
      cssVarCls.value,
      rootCls.value,
    )

    const listyToken = { ...token.value, ...token.value.Listy }
    const itemHeight = Math.round(
      listyToken.fontSize * listyToken.lineHeight + (listyToken.itemPaddingBlock ?? listyToken.paddingSM) * 2 + listyToken.lineWidth,
    )
    return (
      <VcListy
        ref={listyRef}
        {...restProps}
        prefixCls={prefixCls.value}
        direction={direction.value}
        virtual={virtual ?? contextVirtual.value ?? true}
        itemHeight={itemHeight}
        itemRender={itemRender}
        classNames={{ ...mergedClassNames.value, root: rootClassNames }}
        styles={mergedStyles.value}
      />
    )
  }
}, {
  name: 'AListy',
  inheritAttrs: false,
})

Listy.install = (app: App) => {
  app.component(Listy.name, Listy)
  return app
}

export default Listy
