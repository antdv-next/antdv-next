import type { VueNode } from '../../_util/type'
import type { AntTreeNodeProps, SwitcherIcon, TreeLeafIcon } from '../Tree'
import {
  CaretDownFilled,
  FileOutlined,
  LoadingOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from '@antdv-next/icons'
import { createVNode, defineComponent, isVNode } from 'vue'
import { getSlotPropsFnRun } from '../../_util/tools.ts'

interface SwitcherIconProps {
  prefixCls: string
  treeNodeProps: AntTreeNodeProps
  switcherIcon?: SwitcherIcon
  switcherLoadingIcon?: VueNode
  showLine?: boolean | { showLeafIcon: boolean | TreeLeafIcon }
}

const SwitcherIconCom = defineComponent<SwitcherIconProps>(
  (props, { slots }) => {
    return () => {
      const { prefixCls, switcherIcon, treeNodeProps, showLine } = props
      const switcherLoadingIcon = getSlotPropsFnRun(slots, props, 'switcherLoadingIcon')
      const { isLeaf, expanded, loading } = treeNodeProps
      if (loading) {
        if (isVNode(switcherLoadingIcon)) {
          return switcherLoadingIcon
        }
        return <LoadingOutlined class={`${prefixCls}-switcher-loading-icon`} />
      }
      let showLeafIcon: boolean | TreeLeafIcon
      if (showLine && typeof showLine === 'object') {
        showLeafIcon = showLine.showLeafIcon
      }
      if (isLeaf) {
        if (!showLine) {
          return null
        }
        if (typeof showLeafIcon !== 'boolean' && !!showLeafIcon) {
          const leafIcon = typeof showLeafIcon === 'function' ? showLeafIcon(treeNodeProps) : showLeafIcon
          const leafCls = `${prefixCls}-switcher-line-custom-icon`
          if (isVNode(showLeafIcon)) {
            return createVNode(showLeafIcon, {
              class: leafCls,
            })
          }
          return leafIcon
        }

        return showLeafIcon
          ? (
              <FileOutlined class={`${prefixCls}-switcher-line-icon`} />
            )
          : (
              <span class={`${prefixCls}-switcher-leaf-line`} />
            )
      }

      const switcherCls = `${prefixCls}-switcher-icon`
      let switcher = typeof switcherIcon === 'function' ? switcherIcon(treeNodeProps) : switcherIcon
      if (Array.isArray(switcher) && switcher.length === 1) {
        switcher = switcher[0]
      }
      if (isVNode(switcher)) {
        return createVNode(switcher, {
          class: [switcher.props?.classes, showLine ? `${prefixCls}-switcher-line-icon` : switcherCls],
        })
      }
      if (switcher !== undefined) {
        return switcher
      }

      if (showLine) {
        return expanded
          ? (
              <MinusSquareOutlined class={`${prefixCls}-switcher-line-icon`} />
            )
          : (
              <PlusSquareOutlined class={`${prefixCls}-switcher-line-icon`} />
            )
      }
      return <CaretDownFilled class={switcherCls} />
    }
  },
  {
    name: 'SwitcherIconCom',
    inheritAttrs: false,
  },
)

export default SwitcherIconCom
