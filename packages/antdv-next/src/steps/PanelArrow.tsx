import { defineComponent } from 'vue'

export interface PanelArrowProps {
  prefixCls: string
}
const PanelArrow = defineComponent<PanelArrowProps>(
  (props) => {
    return () => {
      const { prefixCls } = props
      return (
        <svg
          aria-hidden="true"
          class={`${prefixCls}-panel-arrow`}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path d="M 0 0 L 100 50 L 0 100" />
        </svg>
      )
    }
  },
  {
    name: 'PanelArrow',
  },
)

export default PanelArrow
