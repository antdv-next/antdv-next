import type { BasicDataNode, DataNode, TreeRef, TreeProps as VcTreeProps } from '@v-c/tree'
import type { Key } from '@v-c/util/dist/type'
import type { CSSProperties, EmitFn, PublicProps, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type.ts'
import { HolderOutlined } from '@antdv-next/icons'
import VcTree from '@v-c/tree'
import { clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useSemanticRootStyle, useToArr, useToProps } from '../_util/hooks'
import initCollapseMotion from '../_util/motion.ts'
import { normalizeStyle } from '../_util/styleUtils'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { devUseWarning, isDev } from '../_util/warning'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import { useDisabledContext } from '../config-provider/DisabledContext.tsx'
import { useToken } from '../theme/internal'
import useStyle from './style'
import dropIndicatorRender from './utils/dropIndicator.tsx'
import SwitcherIconCom from './utils/iconUtil.tsx'

export type SwitcherIcon = any | ((props: AntTreeNodeProps) => any)
export type TreeLeafIcon = any | ((props: AntTreeNodeProps) => any)
type TreeIcon = any | ((props: AntdTreeNodeAttribute) => any)

export type {
  TreeRef,
}
export interface AntdTreeNodeAttribute {
  eventKey: string
  prefixCls: string
  className: string
  expanded: boolean
  selected: boolean
  checked: boolean
  halfChecked: boolean
  title: VueNode
  children: VueNode
  pos: string
  dragOver: boolean
  dragOverGapTop: boolean
  dragOverGapBottom: boolean
  isLeaf: boolean
  selectable: boolean
  disabled: boolean
  disableCheckbox: boolean
}

export interface AntTreeNodeProps {
  className?: string
  checkable?: boolean
  disabled?: boolean
  disableCheckbox?: boolean
  title?: any | ((data: DataNode) => any)
  key?: Key
  eventKey?: Key
  isLeaf?: boolean
  checked?: boolean
  expanded?: boolean
  loading?: boolean
  selected?: boolean
  selectable?: boolean
  icon?: TreeIcon
  children?: VueNode
  [customProp: string]: any
}

export type AntTreeNode = AntTreeNodeProps

export interface AntTreeNodeBaseEvent {
  node: any
  nativeEvent: MouseEvent
}

export interface AntTreeNodeCheckedEvent extends AntTreeNodeBaseEvent {
  event: 'check'
  checked?: boolean
  checkedNodes?: AntTreeNode[]
}

export interface AntTreeNodeSelectedEvent extends AntTreeNodeBaseEvent {
  event: 'select'
  selected?: boolean
  selectedNodes?: DataNode[]
}

export interface AntTreeNodeExpandedEvent extends AntTreeNodeBaseEvent {
  expanded?: boolean
}

export interface AntTreeNodeMouseEvent {
  node: AntTreeNode
  event: (e: DragEvent) => void
}

export interface AntTreeNodeDragEnterEvent extends AntTreeNodeMouseEvent {
  expandedKeys: Key[]
}

export interface AntTreeNodeDropEvent {
  node: AntTreeNode
  dragNode: AntTreeNode
  dragNodesKeys: Key[]
  dropPosition: number
  dropToGap?: boolean
  event: (e: MouseEvent) => void
}

// [Legacy] Compatible for v3
export type TreeNodeNormal = DataNode
type DraggableFn = (node: DataNode) => boolean

interface DraggableConfig {
  icon?: VueNode
  nodeDraggable?: DraggableFn
}

export type TreeSemanticName = keyof TreeSemanticClassNames & keyof TreeSemanticStyles

export interface TreeSemanticClassNames {
  root?: string
  item?: string
  itemIcon?: string
  itemTitle?: string
  itemSwitcher?: string
}

export interface TreeSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  itemIcon?: CSSProperties
  itemTitle?: CSSProperties
  itemSwitcher?: CSSProperties
}

export type TreeClassNamesType = SemanticClassNamesType<TreeProps, TreeSemanticClassNames>

export type TreeStylesType = SemanticStylesType<TreeProps, TreeSemanticStyles>

export interface TreeProps<T extends BasicDataNode = DataNode>
  extends Omit<
    VcTreeProps<T>,
    | 'prefixCls'
    | 'showLine'
    | 'direction'
    | 'draggable'
    | 'className'
    | 'icon'
    | 'switcherIcon'
    | 'classNames'
    | 'rootClassName'
    | 'rootStyle'
    | 'styles'
    | 'onCheck'
    | 'onClick'
    | 'onBlur'
    | 'onDrop'
    | 'onLoad'
    | 'onActiveChange'
    | 'onContextMenu'
    | 'onDoubleClick'
    | 'onExpand'
    | 'onKeyDown'
    | 'onDragEnd'
    | 'onDragOver'
    | 'onDragStart'
    | 'onDragLeave'
    | 'onDragEnter'
    | 'tabIndex'
    | 'onSelect'
    | 'onFocus'
    | 'onMouseEnter'
    | 'onMouseLeave'
    | 'onRightClick'
    | 'onScroll'
    | 'style'
  >,
  /* @vue-ignore */
  TreeEmitsProps<T> {
  rootClass?: string
  showLine?: boolean | { showLeafIcon: boolean | TreeLeafIcon }
  classes?: TreeClassNamesType
  styles?: TreeStylesType
  /** @deprecated Please use `styles.root` instead */
  rootStyle?: CSSProperties

  /** Whether to support multiple selection */
  multiple?: boolean
  /** Whether to automatically expand the parent node */
  autoExpandParent?: boolean
  /** Node selection in Checkable state is fully controlled (the selected state of parent and child nodes is no longer associated) */
  checkStrictly?: boolean
  /** Whether to support selection */
  checkable?: boolean
  /** whether to disable the tree */
  disabled?: boolean
  /** Expand all tree nodes by default */
  defaultExpandAll?: boolean
  /** Expand the corresponding tree node by default */
  defaultExpandParent?: boolean
  /** Expand the specified tree node by default */
  defaultExpandedKeys?: Key[]
  /** (Controlled) Expand the specified tree node */
  expandedKeys?: Key[]
  /** (Controlled) Tree node with checked checkbox */
  checkedKeys?: Key[] | { checked: Key[], halfChecked: Key[] }
  /** Tree node with checkbox checked by default */
  defaultCheckedKeys?: Key[]
  /** (Controlled) Set the selected tree node */
  selectedKeys?: Key[]
  /** Tree node selected by default */
  defaultSelectedKeys?: Key[]
  selectable?: boolean
  /** Click on the tree node to trigger */
  filterAntTreeNode?: (node: AntTreeNode) => boolean
  loadedKeys?: Key[]
  /** Set the node to be draggable (IE>8) */
  draggable?: DraggableFn | boolean | DraggableConfig

  showIcon?: boolean
  icon?: TreeIcon
  switcherIcon?: SwitcherIcon
  switcherLoadingIcon?: VueNode
  prefixCls?: string
  blockNode?: boolean
  tabindex?: number
}

export interface TreeEmits<T extends BasicDataNode = DataNode> {
  'click': NonNullable<VcTreeProps<T>['onClick']>
  'check': NonNullable<VcTreeProps<T>['onCheck']>
  'expand': NonNullable<VcTreeProps<T>['onExpand']>
  'select': NonNullable<VcTreeProps<T>['onSelect']>
  'blur': NonNullable<VcTreeProps<T>['onBlur']>
  'focus': NonNullable<VcTreeProps<T>['onFocus']>
  'rightClick': NonNullable<VcTreeProps<T>['onRightClick']>
  'dblclick': NonNullable<VcTreeProps<T>['onDoubleClick']>
  'doubleClick': NonNullable<VcTreeProps<T>['onDoubleClick']>
  'contextmenu': NonNullable<VcTreeProps<T>['onContextMenu']>
  'dragstart': NonNullable<VcTreeProps<T>['onDragStart']>
  'dragenter': NonNullable<VcTreeProps<T>['onDragEnter']>
  'dragover': NonNullable<VcTreeProps<T>['onDragOver']>
  'dragleave': NonNullable<VcTreeProps<T>['onDragLeave']>
  'drop': NonNullable<VcTreeProps<T>['onDrop']>
  'dragend': NonNullable<VcTreeProps<T>['onDragEnd']>
  'load': NonNullable<VcTreeProps<T>['onLoad']>
  'mouseleave': NonNullable<VcTreeProps<T>['onMouseLeave']>
  'mouseenter': NonNullable<VcTreeProps<T>['onMouseEnter']>
  'scroll': NonNullable<VcTreeProps<T>['onScroll']>
  'activeChange': NonNullable<VcTreeProps<T>['onActiveChange']>
  'keydown': NonNullable<VcTreeProps<T>['onKeyDown']>
  'update:expandedKeys': (keys: Key[]) => void
  'update:checkedKeys': (keys: Key[]) => void
  'update:selectedKeys': (keys: Key[]) => void
  'update:activeKey': (key: Key) => void
}
export interface TreeEmitsProps<T extends BasicDataNode = DataNode> {
  onClick?: TreeEmits<T>['click']
  onCheck?: TreeEmits<T>['check']
  onExpand?: TreeEmits<T>['expand']
  onSelect?: TreeEmits<T>['select']
  onBlur?: TreeEmits<T>['blur']
  onFocus?: TreeEmits<T>['focus']
  onRightClick?: TreeEmits<T>['rightClick']
  onDblclick?: TreeEmits<T>['dblclick']
  onDoubleClick?: TreeEmits<T>['doubleClick']
  onContextmenu?: TreeEmits<T>['contextmenu']
  onDragstart?: TreeEmits<T>['dragstart']
  onDragenter?: TreeEmits<T>['dragenter']
  onDragover?: TreeEmits<T>['dragover']
  onDragleave?: TreeEmits<T>['dragleave']
  onDrop?: TreeEmits<T>['drop']
  onDragend?: TreeEmits<T>['dragend']
  onLoad?: TreeEmits<T>['load']
  onMouseleave?: TreeEmits<T>['mouseleave']
  onMouseenter?: TreeEmits<T>['mouseenter']
  onScroll?: TreeEmits<T>['scroll']
  onActiveChange?: TreeEmits<T>['activeChange']
  onKeydown?: TreeEmits<T>['keydown']
  'onUpdate:expandedKeys'?: TreeEmits<T>['update:expandedKeys']
  'onUpdate:checkedKeys'?: TreeEmits<T>['update:checkedKeys']
  'onUpdate:selectedKeys'?: TreeEmits<T>['update:selectedKeys']
  'onUpdate:activeKey'?: TreeEmits<T>['update:activeKey']
}

export interface TreeSlots<T extends BasicDataNode = DataNode> {
  switcherLoadingIcon: () => any
  switcherIcon: (props: AntTreeNodeProps) => any
  default: () => any
  draggableIcon: () => any
  icon: (props: AntdTreeNodeAttribute) => any
  titleRender: VcTreeProps<T>['titleRender']
}

interface TreeInstance<T extends BasicDataNode = DataNode> {
  $props: TreeProps<T> & PublicProps
  $emit: EmitFn<TreeEmits<T>>
  $slots: TreeSlots<T>
}

export interface TreeConstructor {
  new<T extends BasicDataNode = DataNode>(props: TreeProps<T>): TreeInstance<T>
  /**
   * Non-generic fallback signature. TypeScript infers from the last overload,
   * so this keeps render-function usage like `h(Tree, props)` resolvable
   * against Vue's `Constructor<P>` overload of `h` (see #634), while the
   * generic signature above still drives template/Volar inference.
   */
  new (props: TreeProps<any>): TreeInstance<any>
}

const defaults = {
  showIcon: false,
  blockNode: false,
  checkable: false,
  selectable: true,
} as any

const Tree = defineComponent<
  TreeProps<BasicDataNode>,
  TreeEmits,
  string,
  SlotsType<TreeSlots>
>(
  (props = defaults, { slots, emit, expose, attrs }) => {
    const {
      virtual,
      prefixCls,
      rootPrefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('tree', props)
    const treeRef = shallowRef()
    const { classes, styles, motion: customMotion, rootStyle } = toPropsRefs(props, 'classes', 'styles', 'motion', 'rootStyle')

    // =================Warning===================
    if (isDev) {
      const warning = devUseWarning('Tree')
      warning.deprecated(!rootStyle.value, 'rootStyle', 'styles.root')
    }

    const contextDisabled = useDisabledContext()
    const mergedDisabled = computed(() => props?.disabled ?? contextDisabled.value)
    const motion = computed(() => customMotion.value ?? {
      ...initCollapseMotion(rootPrefixCls.value),
      appear: false,
    })

    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => {
      return {
        ...props,
        disabled: mergedDisabled.value,
        motion: motion.value,
      } as TreeProps
    })

    const rootStyleRoot = useSemanticRootStyle(rootStyle)
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TreeClassNamesType,
      TreeStylesType,
      TreeProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, rootStyleRoot as any, styles),
      useToProps(mergedProps),
    )
    const [hashId, cssVarCls] = useStyle(prefixCls)
    const [, token] = useToken()

    const itemHeight = computed(() => token.value.paddingXS / 2 + (token.value.Tree?.titleHeight || token.value.controlHeightSM))
    expose({
      scrollTo(...args: any[]) {
        treeRef.value?.scrollTo?.(...args)
      },
    })
    return () => {
      const {
        draggable,
        showLine,
        selectable,
        blockNode,
        showIcon,
        checkable,
        rootClass,
        tabindex,
      } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const draggableIcon = getSlotPropsFnRun(slots, props, 'draggableIcon')
      const draggableConfigFn = () => {
        if (!draggable) {
          return false
        }

        let mergedDraggable: DraggableConfig = {}
        switch (typeof draggable) {
          case 'function':
            mergedDraggable.nodeDraggable = draggable
            break
          case 'object':
            mergedDraggable = { ...draggable }
            break
          default:
            break
            // Do nothing
        }

        if (mergedDraggable.icon !== false) {
          mergedDraggable.icon = draggableIcon || mergedDraggable.icon || <HolderOutlined />
        }

        return mergedDraggable
      }
      const draggableConfig = draggableConfigFn()
      const switcherIcon = slots?.switcherIcon ?? props?.switcherIcon
      const switcherLoadingIcon = getSlotPropsFnRun(slots, props, 'switcherLoadingIcon')
      const renderSwitcherIcon = (nodeProps: AntTreeNodeProps) => (
        <SwitcherIconCom
          prefixCls={prefixCls.value}
          switcherIcon={switcherIcon}
          switcherLoadingIcon={switcherLoadingIcon}
          treeNodeProps={nodeProps}
          showLine={showLine}
        />
      )
      const newProps = {
        ...omit(props, ['icon']),
        disabled: mergedDisabled.value,
        showLine: Boolean(showLine),
        dropIndicatorRender,
      }
      const onAttrs: Partial<VcTreeProps> = {
        onCheck(checked, info) {
          emit('check', checked, info)
          if (Array.isArray(checked)) {
            emit('update:checkedKeys', checked)
          }
          else {
            emit('update:checkedKeys', checked?.checked ?? [])
          }
        },
        onClick(...args) {
          emit('click', ...args)
        },
        onExpand(expandKeys, info) {
          emit('expand', expandKeys, info)
          emit('update:expandedKeys', expandKeys)
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
        onDragEnd(info) {
          emit('dragend', info)
        },
        onDragEnter(info) {
          emit('dragenter', info)
        },
        onDragLeave(info) {
          emit('dragleave', info)
        },
        onDragOver(info) {
          emit('dragover', info)
        },
        onDoubleClick(...args) {
          emit('doubleClick', ...args)
          emit('dblclick', ...args)
        },
        onContextMenu(e) {
          emit('contextmenu', e)
        },
        onKeyDown(e) {
          emit('keydown', e)
        },
        onScroll(e) {
          emit('scroll', e)
        },
        onRightClick(info) {
          emit('rightClick', info)
        },
        onSelect(keys, info) {
          emit('select', keys, info)
          emit('update:selectedKeys', keys)
        },
        onDragStart(info) {
          emit('dragstart', info)
        },
        onMouseEnter(e) {
          emit('mouseenter', e)
        },
        onMouseLeave(e) {
          emit('mouseleave', e)
        },
      }

      const icon = slots?.icon ?? props?.icon
      const titleRender = slots?.titleRender ?? props?.titleRender
      return (
        <VcTree
          {...restAttrs}
          ref={treeRef}
          {...newProps as any}
          virtual={props?.virtual ?? virtual.value}
          itemHeight={props?.itemHeight ?? itemHeight.value}
          {...onAttrs}
          icon={icon}
          titleRender={titleRender}
          motion={motion.value}
          prefixCls={prefixCls.value}
          className={clsx(
            {
              [`${prefixCls.value}-icon-hide`]: !showIcon,
              [`${prefixCls.value}-block-node`]: blockNode,
              [`${prefixCls.value}-unselectable`]: !selectable,
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
              [`${prefixCls.value}-disabled`]: mergedDisabled.value,
            },
            contextClassName.value,
            className,
            hashId.value,
            cssVarCls.value,
          )}
          tabIndex={tabindex}
          style={{ ...(normalizeStyle(contextStyle.value) || {}), ...(normalizeStyle(style) || {}) }}
          rootClassName={clsx(mergedClassNames.value?.root, rootClass)}
          rootStyle={mergedStyles.value?.root}
          classNames={mergedClassNames.value}
          styles={mergedStyles.value}
          direction={direction.value}
          checkable={checkable ? <span class={`${prefixCls.value}-checkbox-inner`} /> : checkable}
          selectable={selectable}
          switcherIcon={renderSwitcherIcon}
          draggable={draggableConfig}
          v-slots={{
            default: slots?.default,
          }}
        />
      )
    }
  },
  {
    name: 'ATree',
    inheritAttrs: false,
  },
)

export default Tree
