import { defineComponent } from 'vue'

export interface IconWrapperProps {
  prefixCls: string
}

const IconWrapper = defineComponent<IconWrapperProps>(
  (props, { slots }) => {
    return () => {
      const { prefixCls } = props
      const iconWrapperCls = `${prefixCls}-icon`
      return (
        <span class={[iconWrapperCls]}>
          {slots?.default?.()}
        </span>
      )
    }
  },
  {
    name: 'IconWrapper',
  },
)

export default IconWrapper
