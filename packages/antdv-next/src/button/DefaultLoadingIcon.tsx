import { LoadingOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { getTransitionProps } from '@v-c/util/dist/utils/transition'
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
  (props, { attrs }) => {
    const scheduleMotionFrame = (cb: () => void) => {
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(cb)
      }
      else {
        setTimeout(cb, 0)
      }
    }

    function resetStyle(el: Element) {
      const element = el as HTMLElement
      element.style.width = ''
      element.style.opacity = ''
      element.style.transform = ''
    }

    function onBeforeEnter(el: Element) {
      const element = el as HTMLElement
      element.style.width = '0px'
      element.style.opacity = '0'
      element.style.transform = 'scale(0)'
    }

    function onEnter(el: Element) {
      const element = el as HTMLElement
      void element.offsetWidth
      scheduleMotionFrame(() => {
        element.style.width = `${element.scrollWidth}px`
        element.style.opacity = '1'
        element.style.transform = 'scale(1)'
      })
    }

    function onBeforeLeave(el: Element) {
      const element = el as HTMLElement
      element.style.width = `${element.scrollWidth}px`
      element.style.opacity = '1'
      element.style.transform = 'scale(1)'
    }

    function onLeave(el: Element) {
      const element = el as HTMLElement
      void element.offsetWidth
      scheduleMotionFrame(() => {
        element.style.width = '0px'
        element.style.opacity = '0'
        element.style.transform = 'scale(0)'
      })
    }
    return () => {
      const { prefixCls, loading, existIcon, mount } = props
      const visible = !!loading

      if (existIcon) {
        return <InnerLoadingIcon prefixCls={prefixCls} {...attrs} />
      }
      return (
        <Transition
          {...getTransitionProps(`${prefixCls}-loading-icon-motion`, { appear: !mount })}
          onBeforeEnter={onBeforeEnter}
          onEnter={onEnter}
          onAfterEnter={resetStyle}
          onBeforeLeave={onBeforeLeave}
          onLeave={onLeave}
        >
          {visible ? <InnerLoadingIcon prefixCls={prefixCls} {...attrs} /> : null}
        </Transition>

      )
    }
  },
)
export default DefaultLoadingIcon
