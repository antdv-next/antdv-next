import type { App, SlotsType } from 'vue'
import type { ListyClassNames, ListyProps, ListyRef, ListyScrollToConfig, ListyStyles } from './interface'
import VcListy from '@v-c/listy'
import { clsx } from '@v-c/util'
import { computed, defineComponent, shallowRef, useAttrs } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useSemanticRootStyle, useToArr, useToProps } from '../_util/hooks/useMergeSemantic'
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

const Listy = defineComponent<ListyProps, ListyEmits, string, SlotsType<ListySlots>>((props, { expose, slots }) => {
  const listyRef = shallowRef<InstanceType<typeof VcListy> & ListyRef>()
  const attrs = useAttrs()
  const { style, className, restAttrs } = getAttrStyleAndClass(attrs)
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
  const styleRoot = useSemanticRootStyle(computed(() => style))

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
    scrollTo: (config?: ListyScrollToConfig) => {
      listyRef.value?.scrollTo(config)
    },
  })
  return () => {
    const {
      classes,
      styles,
      rootClass,
      virtual,
      itemRender = slots.itemRender,
      ...restProps
    } = props

    const rootClassNames = clsx(
      contextClassName.value,
      mergedClassNames.value.root,
      rootClass,
      className,
      hashId.value,
      cssVarCls.value,
      rootCls.value,
    )

    const listyToken = { ...token.value, ...token.value.Listy }
    const itemHeight = listyToken.fontHeight + (listyToken.itemPaddingBlock ?? listyToken.paddingSM) * 2
    const mergedVirtual = virtual ?? contextVirtual.value ?? false
    return (
      <VcListy
        ref={listyRef}
        {...restProps}
        {...restAttrs}
        prefixCls={prefixCls.value}
        direction={direction.value}
        virtual={mergedVirtual}
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

;(Listy as any).install = (app: App) => {
  app.component(Listy.name, Listy)
  return app
}

export default Listy
