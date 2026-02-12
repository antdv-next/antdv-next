import type { CSSProperties, InjectionKey, Ref, SlotsType } from 'vue'
import type { Breakpoint } from '../_util/responsiveObserver'
import { BarsOutlined, LeftOutlined, RightOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import canUseDom from '@v-c/util/dist/Dom/canUseDom'
import { omit } from 'es-toolkit'
import { computed, defineComponent, inject, onBeforeUnmount, provide, ref, shallowRef, watch, watchEffect } from 'vue'
import { addMediaQueryListener, removeMediaQueryListener } from '../_util/mediaQueryUtil.ts'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { useBaseConfig } from '../config-provider/context.ts'
import { useLayoutCtx } from './context.ts'
import useStyle from './style/sider'

const dimensionMaxMap: Record<Breakpoint, string> = {
  xs: '479.98px',
  sm: '575.98px',
  md: '767.98px',
  lg: '991.98px',
  xl: '1199.98px',
  xxl: '1599.98px',
  xxxl: `1839.98px`,
}

function isNumeric(val: any) {
  return !Number.isNaN(Number.parseFloat(val)) && Number.isFinite(Number(val))
}

export interface SiderContextProps {
  siderCollapsed?: Ref<boolean>
}

const SiderContextKey: InjectionKey<SiderContextProps> = Symbol('SiderContext')

function useSiderProvider(props: SiderContextProps) {
  provide(SiderContextKey, props)
}

export function useSiderCtx() {
  return inject(SiderContextKey, {
    siderCollapsed: ref(false),
  })
}

export type CollapseType = 'clickTrigger' | 'responsive'

export type SiderTheme = 'light' | 'dark'

export interface SiderProps {
  prefixCls?: string
  collapsible?: boolean
  collapsed?: boolean
  defaultCollapsed?: boolean
  reverseArrow?: boolean
  zeroWidthTriggerStyle?: CSSProperties
  width?: number | string
  collapsedWidth?: number | string
  breakpoint?: Breakpoint
  theme?: SiderTheme
}

export interface SiderEmits {
  'collapse': (collapsed: boolean, type: CollapseType) => void
  'update:collapsed': (collapsed: boolean) => void
  'breakpoint': (broken: boolean) => void
}

export interface SiderSlots {
  trigger: () => any
  default: () => any
}

export interface SiderState {
  collapsed?: boolean
  below: boolean
}

const generateId = (() => {
  let i = 0
  return (prefix = '') => {
    i += 1
    return `${prefix}${i}`
  }
})()

const defaultProps = {
  theme: 'dark',
  width: 200,
  collapsedWidth: 80,
  collapsed: undefined,
} as any

const Sider = defineComponent<
  SiderProps,
  SiderEmits,
  string,
  SlotsType<SiderSlots>
>((props = defaultProps, { emit, slots, attrs }) => {
  const { siderHook } = useLayoutCtx()
  const collapsed = shallowRef(false)
  watchEffect(() => {
    collapsed.value = !!(props.collapsed === undefined ? props.defaultCollapsed : props.collapsed)
  })
  const below = shallowRef(false)

  const handleSetCollapsed = (value: boolean, type: CollapseType) => {
    if (props.collapsed === undefined) {
      collapsed.value = value
    }
    emit('collapse', value, type)
    emit('update:collapsed', value)
  }
  // =========================== Prefix ===========================
  const { prefixCls, direction } = useBaseConfig('layout-sider', props)

  const [hashId, cssVarCls] = useStyle(prefixCls)

  // ========================= Responsive =========================
  const responsiveHandler: (mql: MediaQueryListEvent | MediaQueryList) => void = (mql) => {
    below.value = mql.matches
    emit('breakpoint', mql.matches)
    if (collapsed.value !== mql.matches) {
      handleSetCollapsed(mql.matches, 'responsive')
    }
  }

  watch(
    () => props.breakpoint,
    (_n, _ol, onCleanup) => {
      if (!canUseDom()) {
        return
      }
      let mql: MediaQueryList
      const breakpoint = props.breakpoint
      if (typeof window?.matchMedia !== 'undefined' && breakpoint && breakpoint in dimensionMaxMap) {
        mql = window.matchMedia(`screen and (max-width: ${dimensionMaxMap[breakpoint]})`)
        addMediaQueryListener(mql, responsiveHandler)
        responsiveHandler(mql)
      }
      onCleanup(() => {
        removeMediaQueryListener(mql, responsiveHandler)
      })
    },
    {
      immediate: true,
    },
  )

  const uniqueId = generateId('ant-sider-')
  siderHook.addSider(uniqueId)
  onBeforeUnmount(() => {
    siderHook.removeSider(uniqueId)
  })

  const toggle = () => {
    handleSetCollapsed(!collapsed.value, 'clickTrigger')
  }
  const rawWidth = computed(() => {
    return collapsed.value ? props.collapsedWidth : props.width
  })

  // use "px" as fallback unit for width
  const siderWidth = computed(() => isNumeric(rawWidth.value) ? `${rawWidth.value}px` : String(rawWidth.value))
  useSiderProvider({
    siderCollapsed: collapsed,
  })
  return () => {
    const {
      collapsedWidth,
      reverseArrow,
      zeroWidthTriggerStyle,
      theme,
      collapsible,
    } = props
    const trigger = getSlotPropsFnRun(slots, props, 'trigger')
    // special trigger when collapsedWidth == 0
    const zeroWidthTrigger = Number.parseFloat(String(collapsedWidth || 0)) === 0
      ? (
          <span
            onClick={toggle}
            class={classNames(
              `${prefixCls.value}-zero-width-trigger`,
              `${prefixCls.value}-zero-width-trigger-${reverseArrow ? 'right' : 'left'}`,
            )}
            style={zeroWidthTriggerStyle}
          >
            {trigger || <BarsOutlined />}
          </span>
        )
      : null

    const reverseIcon = (direction.value === 'rtl') === !reverseArrow
    const iconObj = {
      expanded: reverseIcon ? <RightOutlined /> : <LeftOutlined />,
      collapsed: reverseIcon ? <LeftOutlined /> : <RightOutlined />,
    }

    const status = collapsed.value ? 'collapsed' : 'expanded'
    const defaultTrigger = iconObj[status]

    const triggerDom
      = trigger != null
        ? zeroWidthTrigger || (
          <div class={`${prefixCls.value}-trigger`} onClick={toggle} style={{ width: `${siderWidth.value}` }}>
            {trigger || defaultTrigger}
          </div>
        )
        : null

    const divStyle: CSSProperties = {
      flex: `0 0 ${siderWidth.value}`,
      maxWidth: `${siderWidth.value}`, // Fix width transition bug in IE11
      minWidth: `${siderWidth.value}`, // https://github.com/ant-design/ant-design/issues/6349
      width: `${siderWidth.value}`,
    }

    const siderCls = classNames(
      prefixCls.value,
      `${prefixCls.value}-${theme}`,
      {
        [`${prefixCls.value}-collapsed`]: collapsed.value,
        [`${prefixCls.value}-has-trigger`]: collapsible && trigger !== null && !zeroWidthTrigger,
        [`${prefixCls.value}-below`]: !!below.value,
        [`${prefixCls.value}-zero-width`]: Number.parseFloat(siderWidth.value) === 0,
      },
      (attrs as any).class,
      hashId.value,
      cssVarCls.value,
    )

    return (
      <aside class={siderCls} {...omit(attrs, ['style', 'class'])} style={[(attrs as any).style, divStyle]}>
        <div class={`${prefixCls.value}-children`}>{slots?.default?.()}</div>
        {collapsible || (below.value && zeroWidthTrigger) ? triggerDom : null}
      </aside>
    )
  }
}, {
  name: 'ALayoutSider',
  inheritAttrs: false,
})

export default Sider
