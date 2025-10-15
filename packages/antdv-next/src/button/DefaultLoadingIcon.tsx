import { LoadingOutlined } from '@ant-design/icons-vue'
import { classNames } from '@v-c/util'
import { defineComponent, Transition } from 'vue'
import IconWrapper from './IconWrapper.tsx'

interface InnerLoadingIconProps {
  prefixCls: string
  iconClassName?: string
}
const InnerLoadingIcon = defineComponent<InnerLoadingIconProps>(
  (props) => {
    return () => {
      const { prefixCls, iconClassName } = props
      const mergedIconCls = classNames(`${prefixCls}-loading-icon`)
      return (
        <IconWrapper prefixCls={prefixCls} class={mergedIconCls}>
          <LoadingOutlined class={iconClassName} />
        </IconWrapper>
      )
    }
  },
  {
    name: 'InnerLoadingIcon',
  },
)

export interface DefaultLoadingIconProps {
  prefixCls: string
  existIcon: boolean
  loading?: boolean | object
  mount: boolean
}

const DefaultLoadingIcon = defineComponent<DefaultLoadingIconProps>(
  (props) => {
    function onBeforeEnter(el: Element) {
      const element = el as HTMLElement
      element.style.width = '0px'
      element.style.opacity = '0'
      element.style.transform = 'scale(0)'
    }

    function onEnter(el: Element, done: () => void) {
      const element = el as HTMLElement
      // Force reflow
      element.style.width = `${element.scrollWidth}px`
      element.style.opacity = '1'
      element.style.transform = 'scale(1)'
      done()
    }

    function onBeforeLeave(el: Element) {
      const element = el as HTMLElement
      element.style.width = `${element.scrollWidth}px`
      element.style.opacity = '1'
      element.style.transform = 'scale(1)'
    }

    function onLeave(el: Element, done: () => void) {
      const element = el as HTMLElement
      // Force reflow
      void element.offsetHeight
      element.style.width = '0px'
      element.style.opacity = '0'
      element.style.transform = 'scale(0)'
      done()
    }
    return () => {
      const { prefixCls, loading, existIcon, mount } = props
      const visible = !!loading

      if (existIcon) {
        return <InnerLoadingIcon prefixCls={prefixCls} />
      }
      return (
        <Transition
          name={`${prefixCls}-loading-icon-motion`}
          appear={!mount}
          onBeforeEnter={onBeforeEnter}
          onEnter={onEnter}
          onBeforeLeave={onBeforeLeave}
          onLeave={onLeave}
        >
          {visible ? <InnerLoadingIcon prefixCls={prefixCls} /> : null}
        </Transition>

      )
    }
  },
)
export default DefaultLoadingIcon
