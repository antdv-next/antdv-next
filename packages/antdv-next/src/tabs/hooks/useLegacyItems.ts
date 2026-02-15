import type { Tab as VcTab } from '@v-c/tabs'
import type { Tab, TabPaneProps, TabsProps } from '..'
import { filterEmpty, flattenChildren } from '@v-c/util/dist/props-util'
import { computed, isVNode } from 'vue'
import { getSlotPropsFnRun } from '../../_util/tools.ts'
import TabPane from '../TabPane'

function convertItem(item: Tab, index: number, slots?: any): VcTab {
  const { ...rest } = item
  const labelRender = filterEmpty(slots?.labelRender?.({ item, index }) ?? [])
  const label = labelRender.length ? labelRender : getSlotPropsFnRun(item, {}, 'label')
  const childrenRender = () => {
    if (slots?.contentRender) {
      const vnode = filterEmpty(slots?.contentRender?.({ item, index }) ?? [])
      if (vnode.length) {
        return vnode
      }
    }
    return getSlotPropsFnRun(item, {}, 'content')
  }
  return {
    ...rest,
    children: childrenRender,
    label,
    className: rest.class,
    destroyOnHidden: rest.destroyOnHidden,
  } as VcTab
}

function isTabPaneNode(node: any) {
  if (!isVNode(node)) {
    return false
  }
  const type: any = node.type
  return type === TabPane || type?.name === 'ATabPane'
}

export default function useLegacyItems(items: () => TabsProps['items'] | undefined, slots: any) {
  return computed<VcTab[]>(() => {
    const itemsValue = items()
    if (itemsValue && itemsValue.length) {
      return itemsValue.map((item, index) => convertItem(item, index, slots)) as VcTab[]
    }

    const children = flattenChildren(slots?.default?.() ?? [])
    const childrenItems = children.map((node: any, index: number) => {
      if (!isTabPaneNode(node)) {
        return null
      }

      const props = (node.props || {}) as TabPaneProps & { destroyInactiveTabPane?: boolean, tabKey?: string | number }
      const {
        tab,
        closeIcon,
        icon,
        destroyInactiveTabPane,
        destroyOnHidden,
        children: childrenProp,
        class: className,
        className: _className,
        tabKey,
        ...restProps
      } = props

      const key = tabKey != null ? String(tabKey) : (node.key != null ? String(node.key) : `${index}`)

      return convertItem({
        key,
        label: (node.children as any)?.tab ?? tab,
        closeIcon: (node.children as any)?.closeIcon ?? closeIcon,
        icon: (node.children as any)?.icon ?? icon,
        content: (node.children as any)?.default ?? childrenProp,
        class: className ?? _className as any,
        destroyOnHidden: destroyOnHidden ?? destroyInactiveTabPane,
        ...restProps,
      }, index, slots) as VcTab
    })

    return childrenItems.filter(Boolean) as Tab[]
  })
}
