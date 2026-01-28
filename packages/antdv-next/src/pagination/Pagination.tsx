import type { PaginationProps as VcPaginationProps } from '@v-c/pagination'
import type { App, SlotsType } from 'vue'
import type { VueNode } from '../_util/type'
import type {
  PaginationClassNamesType,
  PaginationEmits,
  PaginationProps,
  PaginationSlots,
  PaginationStylesType,
} from './interface'
import { DoubleLeftOutlined, DoubleRightOutlined, LeftOutlined, RightOutlined } from '@antdv-next/icons'
import VcPagination from '@v-c/pagination'
import enUS from '@v-c/pagination/locale/zh_CN'
import { clsx } from '@v-c/util'
import { getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent } from 'vue'
import { useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { devUseWarning, isDev } from '../_util/warning'
import { useComponentBaseConfig } from '../config-provider/context'
import { useSize } from '../config-provider/hooks/useSize'
import useBreakpoint from '../grid/hooks/useBreakpoint'
import useLocale from '../locale/useLocale'
import Select from '../select'
import { useToken } from '../theme/internal'
import useStyle from './style'
import BorderedStyle from './style/bordered'
import resolveShowSizeChanger from './useShowSizeChanger'

const omitKeys = [
  'size',
  'responsive',
  'rootClass',
  'classes',
  'styles',
  'showSizeChanger',
  'pageSizeOptions',
  'selectComponentClass',
] as const

const Pagination = defineComponent<
  PaginationProps,
  PaginationEmits,
  string,
  SlotsType<PaginationSlots>
>(
  (props, { slots, attrs, emit }) => {
    const {
      getPrefixCls,
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      showSizeChanger: contextShowSizeChangerConfig,
    } = useComponentBaseConfig('pagination', props, ['showSizeChanger'])

    const {
      size,
      responsive,
      classes,
      styles,
      showSizeChanger,
    } = toPropsRefs(props, 'size', 'responsive', 'classes', 'styles', 'showSizeChanger')

    const [hashId, cssVarCls] = useStyle(prefixCls, prefixCls)
    const [, token] = useToken()

    // ============================== Size ==============================
    const mergedSize = useSize(size)
    const screens = useBreakpoint(responsive as any)
    const isSmall = computed(() => mergedSize.value === 'small' || (!!screens.value?.xs && !mergedSize.value && responsive.value))

    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => {
      return {
        ...props,
        size: mergedSize.value,
      } as PaginationProps
    })

    // ========================= Style ==========================
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      PaginationClassNamesType,
      PaginationStylesType,
      PaginationProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    // ============================= Locale =============================
    const [contextLocale] = useLocale('Pagination', enUS)
    const mergedLocale = computed(() => ({
      ...contextLocale?.value,
      ...(props.locale ?? {}),
    }))

    // ========================== Size Changer ==========================
    const propShowSizeChanger = computed(() => resolveShowSizeChanger(showSizeChanger.value))
    const contextShowSizeChanger = computed(() => resolveShowSizeChanger(contextShowSizeChangerConfig.value))
    const mergedShowSizeChanger = computed(() => propShowSizeChanger.value.show ?? contextShowSizeChanger.value.show)
    const mergedShowSizeChangerSelectProps = computed(() => propShowSizeChanger.value.selectProps ?? contextShowSizeChanger.value.selectProps)

    const SizeChanger = computed(() => props.selectComponentClass || Select)

    const mergedPageSizeOptions = computed(() => props.pageSizeOptions?.map(option => Number(option)))

    const sizeChangerRender: NonNullable<VcPaginationProps['sizeChangerRender']> = (info) => {
      const {
        disabled,
        size: pageSize,
        onSizeChange,
        'aria-label': ariaLabel,
        className: sizeChangerClassName,
        options,
      } = info

      const selectProps = mergedShowSizeChangerSelectProps.value ?? {}
      const propSelectClass = (selectProps as any).class ?? (selectProps as any).className
      const propSelectOnChange = (selectProps as any).onChange

      const selectedValue = options.find(option => String(option.value) === String(pageSize))?.value
      const SizeChangerComp = SizeChanger.value
      return (
        <SizeChangerComp
          disabled={disabled}
          showSearch
          popupMatchSelectWidth={false}
          getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}
          aria-label={ariaLabel}
          options={options}
          {...selectProps}
          value={selectedValue}
          onChange={(nextSize: string | number, option: any) => {
            onSizeChange?.(nextSize)
            propSelectOnChange?.(nextSize, option)
          }}
          size={mergedSize.value}
          class={clsx(sizeChangerClassName, propSelectClass)}
        />
      )
    }

    if (isDev) {
      const warning = devUseWarning('Pagination')
      warning(
        !props.selectComponentClass,
        'usage',
        '`selectComponentClass` is not official api which will be removed.',
      )
    }

    const selectPrefixCls = computed(() => getPrefixCls('select', props.selectPrefixCls))

    // ============================= Render =============================
    const defaultEllipsis = computed(() => (
      <span class={`${prefixCls.value}-item-ellipsis`}>
        •••
      </span>
    ))

    const defaultPrevIcon = computed(() => (
      <button class={`${prefixCls.value}-item-link`} type="button" tabindex={-1}>
        {direction.value === 'rtl' ? <RightOutlined /> : <LeftOutlined />}
      </button>
    ))

    const defaultNextIcon = computed(() => (
      <button class={`${prefixCls.value}-item-link`} type="button" tabindex={-1}>
        {direction.value === 'rtl' ? <LeftOutlined /> : <RightOutlined />}
      </button>
    ))

    const defaultJumpPrevIcon = computed(() => (
      <a class={`${prefixCls.value}-item-link`}>
        <div class={`${prefixCls.value}-item-container`}>
          {direction.value === 'rtl'
            ? <DoubleRightOutlined class={`${prefixCls.value}-item-link-icon`} />
            : <DoubleLeftOutlined class={`${prefixCls.value}-item-link-icon`} />}
          {defaultEllipsis.value}
        </div>
      </a>
    ))

    const defaultJumpNextIcon = computed(() => (
      <a class={`${prefixCls.value}-item-link`}>
        <div class={`${prefixCls.value}-item-container`}>
          {direction.value === 'rtl'
            ? <DoubleLeftOutlined class={`${prefixCls.value}-item-link-icon`} />
            : <DoubleRightOutlined class={`${prefixCls.value}-item-link-icon`} />}
          {defaultEllipsis.value}
        </div>
      </a>
    ))

    const mergedPrevIcon = computed(() => getSlotPropsFnRun(slots, props, 'prevIcon', false) ?? defaultPrevIcon.value)
    const mergedNextIcon = computed(() => getSlotPropsFnRun(slots, props, 'nextIcon', false) ?? defaultNextIcon.value)
    const mergedJumpPrevIcon = computed(() => getSlotPropsFnRun(slots, props, 'jumpPrevIcon', false) ?? defaultJumpPrevIcon.value)
    const mergedJumpNextIcon = computed(() => getSlotPropsFnRun(slots, props, 'jumpNextIcon', false) ?? defaultJumpNextIcon.value)

    const mergedItemRender = computed<VcPaginationProps['itemRender']>(() => {
      if (slots.itemRender) {
        return (page, type, element) => {
          return getSlotPropsFnRun(slots, {}, 'itemRender', true, { page, type, element })
        }
      }
      return props.itemRender
    })

    const mergedShowTotal = computed<VcPaginationProps['showTotal']>(() => {
      if (slots.showTotal) {
        return (total, range) => {
          return getSlotPropsFnRun(slots, {}, 'showTotal', true, { total, range })
        }
      }
      return props.showTotal
    })

    const handleChange: NonNullable<VcPaginationProps['onChange']> = (page, pageSize) => {
      emit('change', page, pageSize)
      if (props.current !== page) {
        emit('update:current', page)
      }
      else if (props.pageSize !== pageSize) {
        emit('update:pageSize', pageSize)
      }
    }

    const handleShowSizeChange: NonNullable<VcPaginationProps['onShowSizeChange']> = (current, size) => {
      emit('showSizeChange', current, size)
    }

    return () => {
      const { rootClass, align } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)

      const extendedClassName = clsx(
        {
          [`${prefixCls.value}-${align}`]: !!align,
          [`${prefixCls.value}-${mergedSize.value}`]: mergedSize.value,
          /** @deprecated Should be removed in v2 */
          [`${prefixCls.value}-mini`]: isSmall.value,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-bordered`]: token.value.wireframe,
        },
        contextClassName.value,
        className,
        rootClass,
        mergedClassNames.value.root,
        hashId.value,
        cssVarCls.value,
      )

      const mergedStyle = {
        ...mergedStyles.value?.root,
        ...contextStyle.value,
        ...style,
      }

      const restProps = omit(props, omitKeys)

      return (
        <>
          {token.value.wireframe && <BorderedStyle prefixCls={prefixCls.value} />}
          <VcPagination
            {...restProps}
            {...restAttrs}
            prefixCls={prefixCls.value}
            selectPrefixCls={selectPrefixCls.value}
            class={extendedClassName}
            style={mergedStyle}
            classNames={mergedClassNames.value}
            styles={mergedStyles.value as any}
            locale={mergedLocale.value}
            pageSizeOptions={mergedPageSizeOptions.value}
            showSizeChanger={mergedShowSizeChanger.value}
            sizeChangerRender={sizeChangerRender}
            prevIcon={mergedPrevIcon.value as VueNode}
            nextIcon={mergedNextIcon.value as VueNode}
            jumpPrevIcon={mergedJumpPrevIcon.value as VueNode}
            jumpNextIcon={mergedJumpNextIcon.value as VueNode}
            itemRender={mergedItemRender.value}
            showTotal={mergedShowTotal.value}
            onChange={handleChange}
            onShowSizeChange={handleShowSizeChange}
          />
        </>
      )
    }
  },
  {
    name: 'APagination',
    inheritAttrs: false,
  },
)

;(Pagination as any).install = (app: App) => {
  app.component(Pagination.name, Pagination)
}

export default Pagination
