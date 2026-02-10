import type { BasicDataNode, DataNode, EventDataNode, Key } from '@v-c/tree'
import type { SlotsType } from 'vue'
import type { AntdTreeNodeAttribute, TreeEmits, TreeProps, TreeSlots } from './Tree.tsx'
import { FileOutlined, FolderOpenOutlined, FolderOutlined } from '@antdv-next/icons'
import { conductExpandParent, convertDataToEntities, convertTreeToData } from '@v-c/tree'
import { clsx } from '@v-c/util'
import { filterEmpty, getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef, watch } from 'vue'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import Tree from './Tree.tsx'
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

function getTreeData({ treeData, children }: DirectoryTreeProps & { children: any[] }) {
  return treeData || convertTreeToData(children)
}

const DirectoryTree = defineComponent<
  DirectoryTreeProps,
  DirectoryTreeEmits,
  string,
  SlotsType<DirectoryTreeSlots>
>(
  (props, { slots, emit, expose, attrs }) => {
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
      emit('update:expandedKeys', keys)
      emit('expand', keys, info)
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
      emit('update:selectedKeys', newSelectedKeys)
      emit('select', newSelectedKeys, newEvent)
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
          emit('check', checked, info)
          emit('update:checkedKeys', checked)
        },
        onClick(...args) {
          emit('click', ...args)
        },
        onBlur(e) {
          emit('blur', e)
        },
        onLoad(loadKeys, info) {
          emit('load', loadKeys, info)
        },
        onFocus(e) {
          emit('focus', e)
        },
        onActiveChange(key) {
          emit('activeChange', key)
          emit('update:activeKey', key!)
        },
        onDrop(info) {
          emit('drop', info)
        },
        onDragend(info) {
          emit('dragend', info)
        },
        onDragenter(info) {
          emit('dragenter', info)
        },
        onDragleave(info) {
          emit('dragleave', info)
        },
        onDragover(info) {
          emit('dragover', info)
        },
        onDoubleClick(...args) {
          emit('doubleClick', ...args)
          emit('dblclick', ...args)
        },
        onContextmenu(e) {
          emit('contextmenu', e)
        },
        onKeydown(e) {
          emit('keydown', e)
        },
        onScroll(e) {
          emit('scroll', e)
        },
        onRightClick(info) {
          emit('rightClick', info)
        },
        onDragstart(info) {
          emit('dragstart', info)
        },
        onMouseenter(e) {
          emit('mouseenter', e)
        },
        onMouseleave(e) {
          emit('mouseleave', e)
        },
      }

      return (
        <Tree
          ref={treeRef}
          {...restAttrs}
          {...omit(otherProps, ['prefixCls'])}
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
