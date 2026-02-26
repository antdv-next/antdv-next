import type { BasicDataNode, DataNode, EventDataNode, Key } from '@v-c/tree'
import type { SlotsType } from 'vue'
import type { AntdTreeNodeAttribute, TreeEmits, TreeProps, TreeSlots } from './Tree.tsx'
import { FileOutlined, FolderOpenOutlined, FolderOutlined } from '@antdv-next/icons'
import { conductExpandParent, convertDataToEntities, convertTreeToData } from '@v-c/tree'
import { clsx } from '@v-c/util'
import { filterEmpty, getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, getCurrentInstance, shallowRef, watch } from 'vue'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import Tree, { treeCallbackPropKeys } from './Tree.tsx'
import { calcRangeKeys, convertDirectoryKeysToNodes } from './utils/dictUtil.ts'

export type ExpandAction = false | 'click' | 'doubleClick'

export interface DirectoryTreeProps<T extends BasicDataNode = DataNode> extends TreeProps<T> {
  expandAction?: ExpandAction
}

export interface DirectoryTreeEmits extends TreeEmits {

}

export type DirectoryTreeEmitsMap<T extends Record<string, any>> = {
  [K in keyof T as `on${Capitalize<K & string>}`]: T[K]
}

export type DirectoryTreeEmitsType = DirectoryTreeEmitsMap<DirectoryTreeEmits>
export interface DirectoryTreeSlots extends TreeSlots {}

function getIcon(props: AntdTreeNodeAttribute) {
  const { isLeaf, expanded } = props
  if (isLeaf) {
    return <FileOutlined />
  }
  return expanded ? <FolderOpenOutlined /> : <FolderOutlined />
}

function getTreeData<T extends BasicDataNode>({ treeData, children }: DirectoryTreeProps<T> & { children: any[] }): DataNode[] {
  return (treeData as DataNode[] | undefined) || convertTreeToData(children)
}

const DirectoryTree = defineComponent<
  DirectoryTreeProps<BasicDataNode>,
  DirectoryTreeEmits,
  string,
  SlotsType<DirectoryTreeSlots>
>(
  (props, { slots, expose, attrs }) => {
    const instance = getCurrentInstance()
    const getCallbackProps = () => (instance?.vnode.props ?? {}) as any
    // Shift click usage
    const lastSelectedKey = shallowRef<Key>()
    const cachedSelectedKeys = shallowRef<Key[]>()

    const children = computed(() => filterEmpty(slots?.default?.()))

    const getInitExpandedKeys = () => {
      const { defaultExpandAll, defaultExpandParent } = props
      let _children: any = children.value
      if (_children.length < 1) {
        _children = undefined
      }
      const { keyEntities } = convertDataToEntities(getTreeData({ ...props, children: _children }), {
        fieldNames: props.fieldNames,
      })

      let initExpandedKeys: Key[]
      if (defaultExpandAll) {
        initExpandedKeys = Object.keys(keyEntities)
      }
      else if (defaultExpandParent) {
        initExpandedKeys = conductExpandParent(
          props.expandedKeys || props?.defaultExpandedKeys || [],
          keyEntities,
        )
      }
      else {
        initExpandedKeys = props?.expandedKeys || props?.defaultExpandedKeys || []
      }
      return initExpandedKeys
    }

    const selectedKeys = shallowRef<Key[]>(props?.selectedKeys || props?.defaultSelectedKeys || [])

    const expandedKeys = shallowRef<Key[]>(getInitExpandedKeys())

    watch(
      () => props.selectedKeys,
      () => {
        if (props.selectedKeys !== selectedKeys.value) {
          selectedKeys.value = props?.selectedKeys || []
        }
      },
    )

    watch(() => props.expandedKeys, () => {
      if (props.expandedKeys !== expandedKeys.value) {
        expandedKeys.value = props?.expandedKeys || []
      }
    })

    const onExpand = (
      keys: Key[],
      info: {
        node: EventDataNode<any>
        expanded: boolean
        nativeEvent: MouseEvent
      },
    ) => {
      const callbackProps = getCallbackProps()
      callbackProps?.['onUpdate:expandedKeys']?.(keys)
      callbackProps?.onExpand?.(keys, info)
    }

    const onSelect = (keys: Key[], event: {
      event: 'select'
      selected: boolean
      node: any
      selectedNodes: DataNode[]
      nativeEvent: MouseEvent
    }) => {
      const { multiple, fieldNames } = props
      const { node, nativeEvent } = event
      const { key = '' } = node
      let _children: any = children.value
      if (_children.length < 1) {
        _children = undefined
      }
      const treeData = getTreeData({ ...props, children: _children })
      // const newState: DirectoryTreeState = {};

      // We need wrap this event since some value is not same
      const newEvent = {
        ...event,
        selected: true, // Directory selected always true
      }
      // Windows / Mac single pick
      const ctrlPick: boolean = nativeEvent?.ctrlKey || nativeEvent?.metaKey
      const shiftPick: boolean = nativeEvent?.shiftKey

      // Generate new selected keys
      let newSelectedKeys: Key[]
      if (multiple && ctrlPick) {
        // Control click
        newSelectedKeys = keys
        lastSelectedKey.value = key
        cachedSelectedKeys.value = newSelectedKeys
        newEvent.selectedNodes = convertDirectoryKeysToNodes(treeData, newSelectedKeys, fieldNames)
      }
      else if (multiple && shiftPick) {
        // Shift click
        newSelectedKeys = Array.from(
          new Set([
            ...(cachedSelectedKeys.value || []),
            ...calcRangeKeys({
              treeData,
              expandedKeys: expandedKeys.value,
              startKey: key,
              endKey: lastSelectedKey.value!,
              fieldNames,
            }),
          ]),
        )
        newEvent.selectedNodes = convertDirectoryKeysToNodes(treeData, newSelectedKeys, fieldNames)
      }
      else {
        // Single click
        newSelectedKeys = [key]
        lastSelectedKey.value = key
        cachedSelectedKeys.value = newSelectedKeys
        newEvent.selectedNodes = convertDirectoryKeysToNodes(treeData, newSelectedKeys, fieldNames)
      }
      selectedKeys.value = newSelectedKeys
      const callbackProps = getCallbackProps()
      callbackProps?.['onUpdate:selectedKeys']?.(newSelectedKeys)
      callbackProps?.onSelect?.(newSelectedKeys, newEvent)
    }
    const { prefixCls, direction } = useComponentBaseConfig('tree', props)
    const treeRef = shallowRef()

    expose({
      scrollTo(...args: any[]) {
        return treeRef.value?.scrollTo?.(...args)
      },
    })
    return () => {
      const {
        showIcon = true,
        expandAction = 'click',
        ...otherProps
      } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)

      const connectClassName = clsx(
        `${prefixCls.value}-directory`,
        {
          [`${prefixCls.value}-directory-rtl`]: direction.value === 'rtl',
        },
        className,
      )
      const onAttrs: Partial<DirectoryTreeEmitsType> = {
        onCheck(checked, info) {
          const callbackProps = getCallbackProps()
          callbackProps?.onCheck?.(checked, info)
          callbackProps?.['onUpdate:checkedKeys']?.(checked)
        },
        onClick(...args) {
          const callbackProps = getCallbackProps()
          callbackProps?.onClick?.(...args)
        },
        onBlur(e) {
          const callbackProps = getCallbackProps()
          callbackProps?.onBlur?.(e)
        },
        onLoad(loadKeys, info) {
          const callbackProps = getCallbackProps()
          callbackProps?.onLoad?.(loadKeys, info)
        },
        onFocus(e) {
          const callbackProps = getCallbackProps()
          callbackProps?.onFocus?.(e)
        },
        onActiveChange(key) {
          const callbackProps = getCallbackProps()
          callbackProps?.onActiveChange?.(key)
          callbackProps?.['onUpdate:activeKey']?.(key!)
        },
        onDrop(info) {
          const callbackProps = getCallbackProps()
          callbackProps?.onDrop?.(info)
        },
        onDragend(info) {
          const callbackProps = getCallbackProps()
          callbackProps?.onDragend?.(info)
        },
        onDragenter(info) {
          const callbackProps = getCallbackProps()
          callbackProps?.onDragenter?.(info)
        },
        onDragleave(info) {
          const callbackProps = getCallbackProps()
          callbackProps?.onDragleave?.(info)
        },
        onDragover(info) {
          const callbackProps = getCallbackProps()
          callbackProps?.onDragover?.(info)
        },
        onDoubleClick(...args) {
          const callbackProps = getCallbackProps()
          callbackProps?.onDoubleClick?.(...args)
          callbackProps?.onDblclick?.(...args)
        },
        onContextmenu(e) {
          const callbackProps = getCallbackProps()
          callbackProps?.onContextmenu?.(e)
        },
        onKeydown(e) {
          const callbackProps = getCallbackProps()
          callbackProps?.onKeydown?.(e)
        },
        onScroll(e) {
          const callbackProps = getCallbackProps()
          callbackProps?.onScroll?.(e)
        },
        onRightClick(info) {
          const callbackProps = getCallbackProps()
          callbackProps?.onRightClick?.(info)
        },
        onDragstart(info) {
          const callbackProps = getCallbackProps()
          callbackProps?.onDragstart?.(info)
        },
        onMouseenter(e) {
          const callbackProps = getCallbackProps()
          callbackProps?.onMouseenter?.(e)
        },
        onMouseleave(e) {
          const callbackProps = getCallbackProps()
          callbackProps?.onMouseleave?.(e)
        },
      }

      return (
        <Tree
          ref={treeRef}
          {...restAttrs}
          {...omit(otherProps, ['prefixCls', ...treeCallbackPropKeys])}
          {...onAttrs as any}
          icon={props?.icon ?? getIcon}
          blockNode={props?.blockNode ?? true}
          showIcon={showIcon}
          expandAction={expandAction}
          prefixCls={prefixCls.value}
          class={connectClassName}
          style={style}
          expandedKeys={expandedKeys.value}
          selectedKeys={selectedKeys.value}
          onSelect={onSelect}
          onExpand={onExpand}
          v-slots={slots}
        />
      )
    }
  },
  {
    name: 'ADirectoryTree',
    inheritAttrs: false,
  },
)

export default DirectoryTree
