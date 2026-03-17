import type { ComponentBaseProps } from '../config-provider/context.ts'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { createVNode, defineComponent, ref } from 'vue'
import { useBaseConfig, useComponentConfig } from '../config-provider/context.ts'
import { useLayoutProvider } from './context.ts'
import useHasSider from './hooks/useHasSider.ts'
import useStyle from './style'

export interface GeneratorProps {
  suffixCls?: string
  tagName: 'header' | 'footer' | 'main' | 'div'
  displayName: string
}

export interface BasicProps extends ComponentBaseProps {
  suffixCls?: string
  hasSider?: boolean
}

interface BasicPropsWithTagName extends BasicProps {
  tagName: 'header' | 'footer' | 'main' | 'div'
}
const basicDefaultProps = {
  hasSider: undefined,
} as any
function generator({ suffixCls, tagName, displayName }: GeneratorProps) {
  return (BasicComponent: any) => {
    return defineComponent<BasicProps>(
      (props = basicDefaultProps, { attrs, slots }) => {
        return () => {
          return (
            <BasicComponent
              {...props}
              suffixCls={props?.suffixCls ?? suffixCls}
              tagName={tagName}
              {...attrs}
              v-slots={slots}
            />
          )
        }
      },
      {
        name: displayName,
        inheritAttrs: false,
      },
    )
  }
}

const Basic = defineComponent<BasicPropsWithTagName>(
  (props = basicDefaultProps, { attrs, slots }) => {
    const { prefixCls } = useBaseConfig('layout', props)
    const [hashId, cssVarCls] = useStyle(prefixCls)

    return () => {
      const {
        suffixCls,
        tagName,
        prefixCls: customizePrefixCls,
      } = props
      const prefixWithSuffixCls = suffixCls ? `${prefixCls.value}-${suffixCls}` : prefixCls.value
      const { class: _attrClass, ...restAttrs } = attrs as Record<string, any>

      return createVNode(tagName, {
        ...restAttrs,
        class: classNames(
          customizePrefixCls || prefixWithSuffixCls,
          hashId.value,
          cssVarCls.value,
        ),
      }, slots)
    }
  },
)

const BasicLayout = defineComponent<BasicPropsWithTagName>(
  (props = basicDefaultProps, { slots, attrs }) => {
    const { direction, prefixCls } = useBaseConfig('layout', props)
    const compCtx = useComponentConfig('layout')
    const siders = ref<string[]>([])
    const [hashId, cssVarCls] = useStyle(prefixCls)
    const addSider = (id: string) => {
      siders.value = [...siders.value, id]
    }

    const removeSider = (id: string) => {
      siders.value = siders.value.filter(currentId => currentId !== id)
    }

    useLayoutProvider({
      siderHook: {
        addSider,
        removeSider,
      },
    })

    return () => {
      const {
        hasSider,
        rootClass,
        tagName,
        suffixCls,
      } = props
      const children = filterEmpty(slots?.default?.() || [])
      const mergedHasSider = useHasSider(siders.value, children, hasSider)
      const {
        class: _attrClass,
        style: attrStyle,
        ...restAttrs
      } = attrs as Record<string, any>

      const classString = classNames(
        prefixCls.value,
        {
          [`${prefixCls.value}-has-sider`]: mergedHasSider,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        compCtx.value.class,
        rootClass,
        hashId.value,
        cssVarCls.value,
      )

      return createVNode(tagName, {
        ...restAttrs,
        suffixCls,
        class: classString,
        style: [compCtx.value.style, attrStyle],
      }, {
        default: () => children,
      })
    }
  },
)

const Layout = generator({
  tagName: 'div',
  displayName: 'ALayout',
})(BasicLayout)

const Header = generator({
  suffixCls: 'header',
  tagName: 'header',
  displayName: 'ALayoutHeader',
})(Basic)

const Footer = generator({
  suffixCls: 'footer',
  tagName: 'footer',
  displayName: 'ALayoutFooter',
})(Basic)

const Content = generator({
  suffixCls: 'content',
  tagName: 'main',
  displayName: 'ALayoutContent',
})(Basic)

export { Content, Footer, Header }

export default Layout
