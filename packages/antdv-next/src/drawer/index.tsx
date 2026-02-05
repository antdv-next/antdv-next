import type { DrawerProps as VcDrawerProps } from '@v-c/drawer'
import type { CSSMotionProps } from '@v-c/util/dist/utils/transition'
import type { App, SlotsType } from 'vue'
import type { MaskType } from '../_util/hooks'
import type { DrawerClassNamesType, DrawerPanelProps, DrawerStylesType } from './DrawerPanel'
import type { FocusableConfig, OmitFocusType } from './useFocusable.ts'
import VcDrawer from '@v-c/drawer'
import { clsx } from '@v-c/util'
import { getTransitionName } from '@v-c/util/dist/utils/transition'
import { computed, defineComponent, shallowRef, useId } from 'vue'
import { ContextIsolator } from '../_util/ContextIsolator.tsx'
import { getAttrStyleAndClass, useMergedMask, useMergeSemantic, useToArr, useToProps, useZIndex } from '../_util/hooks'
import { toPropsRefs } from '../_util/tools.ts'
import { devUseWarning, isDev } from '../_util/warning.ts'
import { ZIndexProvider } from '../_util/zindexContext.ts'
import { useComponentBaseConfig } from '../config-provider/context'
import { usePanelRef } from '../watermark/context.ts'
import DrawerPanel from './DrawerPanel'
import useStyle from './style'
import useFocusable from './useFocusable.ts'

const _SizeTypes = ['default', 'large'] as const

type sizeType = (typeof _SizeTypes)[number]

export interface PushState {
  distance: string | number
}

export interface DrawerResizableConfig {
  onResize?: (size: number) => void
  onResizeStart?: () => void
  onResizeEnd?: () => void
}

export interface DrawerProps
  extends Omit<
    VcDrawerProps,
'maskStyle' | 'destroyOnHidden' | 'rootClassName' | 'mask' | 'resizable' | 'classNames' | 'styles' | 'onClose' | 'onKeyUp' | 'onKeyDown' | 'onMouseEnter' | 'onMouseLeave' | 'onMouseOver' | 'onClick' | OmitFocusType
  >,
  Omit<DrawerPanelProps, 'prefixCls' | 'ariaId' | 'onClose'>
{
  size?: sizeType | number | string
  resizable?: boolean | DrawerResizableConfig
  rootClass?: string
  open?: boolean
  afterOpenChange?: (open: boolean) => void
  /** @deprecated Please use `destroyOnHidden` instead */
  destroyOnClose?: boolean
  /**
   * @since 5.25.0
   */
  destroyOnHidden?: boolean
  mask?: MaskType
  focusable?: FocusableConfig
}

export interface DrawerEmits {
  'update:open': (open: boolean) => void
  'afterOpenChange': (open: boolean) => void
  'close': (e: MouseEvent | KeyboardEvent) => void
  'keydown': (e: KeyboardEvent) => void
  'keyup': (e: KeyboardEvent) => void
  'mouseenter': (e: MouseEvent) => void
  'mouseleave': (e: MouseEvent) => void
  'mouseover': (e: MouseEvent) => void
  'click': (e: MouseEvent) => void
}

export interface DrawerSlots {
  title?: () => any
  footer?: () => any
  extra?: () => any
  default?: () => any
  closeIcon?: () => any
}

const defaultPushState: PushState = { distance: 180 }

const DEFAULT_SIZE = 378

const defaults = {
  defaultSize: DEFAULT_SIZE,
  push: defaultPushState,
  panelRef: null,
} as any

const Drawer = defineComponent<
  DrawerProps,
  DrawerEmits,
  string,
  SlotsType<DrawerSlots>
>(
  (props = defaults, { slots, emit, attrs }) => {
    const id = useId()

    const {
      getPopupContainer,
      direction,
      prefixCls,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      mask: contextMask,
    } = useComponentBaseConfig('drawer', props, ['mask'])
    const {
      zIndex: customZIndex,
      mask: drawerMask,
      classes,
      styles,
      focusable,
    } = toPropsRefs(
      props,
      'zIndex',
      'mask',
      'classes',
      'styles',
      'focusable',
    )

    const [hashId, cssVarCls] = useStyle(prefixCls)
    if (isDev) {
      const warning = devUseWarning('Drawer');

      [
        ['headerStyle', 'styles.header'],
        ['bodyStyle', 'styles.body'],
        ['footerStyle', 'styles.footer'],
        ['contentWrapperStyle', 'styles.wrapper'],
        ['maskStyle', 'styles.mask'],
        ['drawerStyle', 'styles.section'],
        ['destroyInactivePanel', 'destroyOnHidden'],
        ['width', 'size'],
        ['height', 'size'],
      ].forEach(([deprecatedName, newName]) => {
        warning.deprecated(!((props as any)[deprecatedName!] !== undefined), deprecatedName!, newName!)
      })
    }

    // ============================ Size ============================
    const drawerSize = computed(() => {
      const { size, placement, width, height } = props
      if (typeof size === 'number') {
        return size
      }
      if (size === 'large') {
        return 736
      }

      if (size === 'default') {
        return DEFAULT_SIZE
      }

      if (typeof size === 'string') {
        if (/^\d+(\.\d+)?$/.test(size)) {
          return Number(size)
        }
        return size
      }
      if (!placement || placement === 'left' || placement === 'right') {
        return width
      }

      return height
    })

    // ============================ Refs ============================
    // Select `ant-drawer-content` by `panelRef`
    const innerPanelRef = usePanelRef()
    const panelRef = shallowRef()

    // ============================ zIndex ============================
    const [zIndex, contextZIndex] = useZIndex('Drawer', customZIndex)

    // ============================ Mask ============================
    const [mergedMask, maskBlurClassName] = useMergedMask(drawerMask, contextMask, prefixCls)
    // ========================== Focusable =========================
    const mergedFocusable = useFocusable(focusable, computed(() => {
      return props?.getContainer !== false && mergedMask.value
    }))
    const mergedProps = computed(() => {
      return {
        ...props,
        zIndex: zIndex.value,
        mask: mergedMask.value,
        focusable: mergedFocusable.value,
      } as DrawerProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      DrawerClassNamesType,
      DrawerStylesType,
      DrawerProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(
      mergedProps,
    ))
    return () => {
      const {
        rootClass,
        maskStyle,
        drawerStyle,
        contentWrapperStyle,
        open,
        push,
        defaultSize,
        rootStyle,
        getContainer: customizeGetContainer,
        resizable,
        afterOpenChange,
        destroyOnClose,
        destroyOnHidden,
        size,
        ...rest
      } = props
      const { className, restAttrs, style } = getAttrStyleAndClass(attrs)
      // =========================== Motion ===========================
      const maskMotion: CSSMotionProps = {
        name: getTransitionName(prefixCls.value, 'mask-motion'),
        appear: true,
      }
      const panelMotion: VcDrawerProps['motion'] = motionPlacement => ({
        name: getTransitionName(prefixCls.value, `panel-motion-${motionPlacement}`),
        appear: true,
      })

      const drawerClassName = clsx(
        {
          'no-mask': !mergedMask.value,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        rootClass,
        hashId.value,
        cssVarCls.value,
        mergedClassNames.value.root,
      )

      const getContainer
      // 有可能为 false，所以不能直接判断
        = customizeGetContainer === undefined && getPopupContainer
          ? () => getPopupContainer(document.body)
          : customizeGetContainer
      const ariaLabelledby = restAttrs['aria-labelledby']
      const ariaId = rest.title ? id : undefined
      return (
        <ContextIsolator form space>
          <ZIndexProvider value={contextZIndex.value}>
            <VcDrawer
              {...restAttrs as any}
              {...rest as any}
              prefixCls={prefixCls.value}
              onClose={() => {
                emit('update:open', false)
                emit('close')
              }}
              onClick={(e) => {
                emit('click', e)
              }}
              onKeyUp={(e) => {
                emit('keyup', e)
              }}
              onKeyDown={(e) => {
                emit('keydown', e)
              }}
              onMouseEnter={(e) => {
                emit('mouseenter', e)
              }}
              onMouseLeave={(e) => {
                emit('mouseleave', e)
              }}
              onMouseOver={(e) => {
                emit('mouseover', e)
              }}
              maskMotion={maskMotion}
              motion={panelMotion}
              classNames={{
                mask: clsx(mergedClassNames.value.mask, maskBlurClassName.value.mask),
                section: mergedClassNames.value.section,
                wrapper: mergedClassNames.value.wrapper,
                dragger: mergedClassNames.value.dragger,
              }}
              styles={{
                mask: { ...mergedStyles.value.mask, ...maskStyle },
                section: { ...mergedStyles.value.section, ...drawerStyle },
                wrapper: { ...mergedStyles.value.wrapper, ...contentWrapperStyle },
                dragger: mergedStyles.value.dragger,
              }}
              open={open}
              mask={mergedMask.value}
              push={push}
              size={drawerSize.value}
              defaultSize={defaultSize}
              ref={(el: any) => {
                const panel = el?.panel
                panelRef.value = panel
                innerPanelRef(panel)
              }}
              style={{ ...contextStyle.value, ...style }}
              rootStyle={{ ...rootStyle, ...mergedStyles.value.root }}
              class={clsx(contextClassName.value, className)}
              rootClassName={drawerClassName}
              getContainer={getContainer}
              zIndex={zIndex.value}
              afterOpenChange={afterOpenChange}
              {...(resizable ? { resizable } : {})}
              aria-labelledby={ariaLabelledby ?? ariaId}
              destroyOnHidden={destroyOnHidden ?? destroyOnClose}
              // Focusable
              focusTriggerAfterClose={mergedFocusable.value.focusTriggerAfterClose}
              focusTrap={mergedFocusable.value.trap}
            >
              <DrawerPanel
                {...rest}
                prefixCls={prefixCls.value}
                size={size}
                ariaId={ariaId}
                v-slots={slots}
                onClose={() => {
                  emit('update:open', false)
                  emit('close')
                }}
              />
            </VcDrawer>
          </ZIndexProvider>
        </ContextIsolator>
      )
    }
  },
  {
    inheritAttrs: false,
    name: 'ADrawer',
  },
)

interface PurePanelInterface {
  prefixCls?: string
  placement?: DrawerProps['placement']
}

export const PurePanel = defineComponent<Omit<DrawerPanelProps, 'prefixCls'> & PurePanelInterface>(
  (props, { attrs, slots }) => {
    const { prefixCls } = useComponentBaseConfig('drawer', props)
    const [hashId, cssVarCls] = useStyle(prefixCls)

    return () => {
      const { restAttrs, className, style } = getAttrStyleAndClass(attrs)
      const {
        placement = 'right',
        ...restProps
      } = props
      const cls = clsx(
        prefixCls.value,
        `${prefixCls.value}-pure`,
        `${prefixCls.value}-${placement}`,
        hashId.value,
        cssVarCls.value,
        className,
      )
      return (
        <div class={cls} style={style}>
          <DrawerPanel {...restAttrs} v-slots={slots} {...restProps} prefixCls={prefixCls.value} />
        </div>
      )
    }
  },
)

;(Drawer as any)._InternalPanelDoNotUseOrYouWillBeFired = PurePanel
;(Drawer as any).install = (app: App) => {
  app.component(Drawer.name, Drawer)
}

export default Drawer
