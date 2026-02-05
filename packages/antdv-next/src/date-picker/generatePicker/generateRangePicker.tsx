import type { PickerMode, PickerRef } from '@v-c/picker'
import type { GenerateConfig } from '@v-c/picker/generate'
import type { SlotsType } from 'vue'
import type { AnyObject, VueNode } from '../../_util/type'
import type { RangePickerProps } from './interface'
import { SwapRightOutlined } from '@antdv-next/icons'
import { RangePicker } from '@v-c/picker'
import { clsx } from '@v-c/util'
import { getTransitionName } from '@v-c/util/dist/utils/transition'
import { computed, defineComponent, shallowRef } from 'vue'
import { ContextIsolator } from '../../_util/ContextIsolator'
import { getAttrStyleAndClass, useZIndex } from '../../_util/hooks'
import { getMergedStatus, getStatusClassNames } from '../../_util/statusUtils'
import { getSlotPropsFnRun, toPropsRefs } from '../../_util/tools'
import { devUseWarning, isDev } from '../../_util/warning'
import { useComponentBaseConfig } from '../../config-provider/context'
import { useDisabledContext } from '../../config-provider/DisabledContext'
import useCSSVarCls from '../../config-provider/hooks/useCSSVarCls'
import { useSize } from '../../config-provider/hooks/useSize'
import { useFormItemInputContext } from '../../form/context'
import { useVariants } from '../../form/hooks/useVariant'
import useLocale from '../../locale/useLocale'
import { useCompactItemContext } from '../../space/Compact'
import useMergedPickerSemantic from '../hooks/useMergedPickerSemantic'
import enUS from '../locale/en_US'
import useStyle from '../style'
import { getRangePlaceholder, useIcons } from '../util'
import { TIME } from './constant'
import SuffixIcon from './SuffixIcon'
import useComponents from './useComponents'

export interface RangePickerEmits<DateType = AnyObject> {
  'change': (dates: DateType[] | null, dateStrings: [string, string]) => void
  'update:value': (dates: DateType[] | null) => void
  'calendarChange': (dates: DateType[], dateStrings: [string, string], info: any) => void
  'panelChange': (dates: DateType[], modes: [PickerMode, PickerMode]) => void
  'openChange': (open: boolean) => void
  'ok': (dates: DateType[]) => void
  'focus': (e: FocusEvent, info: any) => void
  'blur': (e: FocusEvent, info: any) => void
  'keydown': (e: KeyboardEvent, preventDefault: VoidFunction) => void
}

export interface RangePickerSlots {
  suffixIcon?: () => any
  renderExtraFooter?: (mode: PickerMode) => any
  panelRender?: (originPanel: VueNode) => any
  inputRender?: (props: Record<string, any>) => any
  cellRender?: (ctx: { current: AnyObject, info: any }) => any
  dateRender?: (ctx: { date: AnyObject, today: AnyObject }) => any
  monthCellRender?: (ctx: { date: AnyObject, locale: any }) => any
  [key: string]: any
}

function generateRangePicker<DateType extends AnyObject = AnyObject>(generateConfig: GenerateConfig<DateType>) {
  type DateRangePickerProps = RangePickerProps<DateType>

  const RangePickerComponent = defineComponent<
    RangePickerProps<DateType>,
    RangePickerEmits<DateType>,
    string,
    SlotsType<RangePickerSlots>
  >(
    (props = {
      'bordered': undefined,
      'disabled': undefined,
      'allowEmpty': undefined,
      'showTime': undefined,
      'showWeek': undefined,
      'allowClear': undefined,
      'inputReadOnly': undefined,
      'order': undefined,
      'defaultOpen': undefined,
      'open': undefined,
      'needConfirm': undefined,
      'changeOnBlur': undefined,
      'preserveInvalidOnBlur': undefined,
      'previewValue': undefined,
      'showNow': undefined,
      'showToday': undefined,
      'contenteditable': undefined,
      'draggable': undefined,
      'hidden': undefined,
      'inert': undefined,
      'spellcheck': undefined,
      'itemscope': undefined,
      'aria-atomic': undefined,
      'aria-busy': undefined,
      'aria-checked': undefined,
      'aria-current': undefined,
      'aria-disabled': undefined,
      'aria-expanded': undefined,
      'aria-grabbed': undefined,
      'aria-haspopup': undefined,
      'aria-hidden': undefined,
      'aria-invalid': undefined,
      'aria-modal': undefined,
      'aria-multiline': undefined,
      'aria-multiselectable': undefined,
      'aria-pressed': undefined,
      'aria-readonly': undefined,
      'aria-required': undefined,
      'aria-selected': undefined,
      'showHour': undefined,
      'showMinute': undefined,
      'showSecond': undefined,
      'showMillisecond': undefined,
      'use12Hours': undefined,
      'hideDisabledOptions': undefined,
      'changeOnScroll': undefined,
    }, { slots, attrs, emit, expose }) => {
      const {
        size: customizeSize,
        disabled: customDisabled,
        status: customStatus,
        variant: customVariant,
        classes,
        styles,
        rootClass,
        bordered,
      } = toPropsRefs(
        props,
        'size',
        'disabled',
        'status',
        'variant',
        'classes',
        'styles',
        'rootClass',
        'bordered',
      )

      const pickerType = computed(() => (props.picker === TIME ? 'timePicker' : 'datePicker'))

      const {
        prefixCls,
        direction,
        getPopupContainer,
        rootPrefixCls,
        class: contextClassName,
        style: contextStyle,
      } = useComponentBaseConfig('rangePicker' as any, props as any, [], 'picker')

      const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction)
      const mergedSize = useSize(ctx => customizeSize.value ?? compactSize.value ?? ctx)

      const disabled = useDisabledContext()
      const mergedDisabled = computed(() => customDisabled.value ?? disabled.value)

      const mergedProps = computed(() => ({
        ...props,
        size: mergedSize.value,
        disabled: mergedDisabled.value,
        status: customStatus.value,
        variant: customVariant.value,
      } as DateRangePickerProps))

      const popupClassName = computed(() => props.popupClassName || props.dropdownClassName)
      const popupStyle = computed(() => props.popupStyle)

      const [mergedClassNames, mergedStyles] = useMergedPickerSemantic<DateRangePickerProps>(
        pickerType.value as any,
        classes as any,
        styles as any,
        popupClassName,
        popupStyle,
        mergedProps,
      )

      const innerRef = shallowRef<PickerRef>()

      const [variant, enableVariantCls] = useVariants('rangePicker', customVariant, bordered)

      const rootCls = useCSSVarCls(prefixCls)
      const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

      const mergedRootClassName = computed(() => clsx(
        hashId.value,
        cssVarCls.value,
        rootCls.value,
        rootClass.value,
      ))

      const [contextLocale] = useLocale('Calendar', enUS)
      const locale = computed(() => ({
        ...contextLocale?.value,
        ...(props.locale ?? {}),
      }))

      const [zIndex] = useZIndex('DatePicker', computed(() => mergedStyles.value?.popup?.root?.zIndex as number))

      const triggerChange = (dates: DateType[] | null, dateStrings: [string, string]) => {
        emit('update:value', dates)
        emit('change', dates, dateStrings)
      }

      const handleCalendarChange = (dates: DateType[], dateStrings: [string, string], info: any) => {
        emit('calendarChange', dates, dateStrings, info)
      }

      const handlePanelChange = (values: DateType[], modes: [PickerMode, PickerMode]) => {
        emit('panelChange', values, modes)
      }

      const handleOpenChange = (open: boolean) => {
        emit('openChange', open)
      }

      const handleOk = (values: DateType[]) => {
        emit('ok', values)
      }

      const handleFocus = (e: FocusEvent, info: any) => {
        emit('focus', e, info)
      }

      const handleBlur = (e: FocusEvent, info: any) => {
        emit('blur', e, info)
      }

      const handleKeyDown = (e: KeyboardEvent, preventDefault: VoidFunction) => {
        emit('keydown', e, preventDefault)
      }

      const resolveRender = (
        key: keyof RangePickerSlots,
        args: any[],
        slotParams: any,
      ) => {
        const slot = (slots as any)?.[key]
        if (slot) {
          return slot(slotParams)
        }
        const propValue = (props as any)[key]
        if (typeof propValue === 'function') {
          return propValue(...args)
        }
        return propValue
      }

      if (isDev) {
        const warning = devUseWarning('DatePicker.RangePicker')
        const deprecatedProps = {
          dropdownClassName: 'classes.popup.root',
          popupClassName: 'classes.popup.root',
          popupStyle: 'styles.popup.root',
          bordered: 'variant',
        }
        Object.entries(deprecatedProps).forEach(([oldProp, newProp]) => {
          warning.deprecated(!((props as any)[oldProp]), oldProp, newProp)
        })
      }

      expose({
        focus: (options?: FocusOptions) => innerRef.value?.focus?.(options as any),
        blur: () => innerRef.value?.blur?.(),
        nativeElement: computed(() => innerRef.value?.nativeElement),
      })

      return () => {
        const {
          placeholder,
          components,
          placement,
          suffixIcon,
          allowClear,
          popupClassName: _popupClassName,
          dropdownClassName: _dropdownClassName,
          popupStyle: _popupStyle,
          rootClass: _rootClass,
          classes: _classes,
          styles: _styles,
          status: _status,
          variant: _variant,
          bordered: _bordered,
          size: _size,
          disabled: _disabled,
          locale: _locale,
          getPopupContainer: _getPopupContainer,
          ...restProps
        } = props as DateRangePickerProps

        const { className, style, restAttrs } = getAttrStyleAndClass(attrs, undefined, props)

        const mergedSuffixIcon = getSlotPropsFnRun(slots, { suffixIcon }, 'suffixIcon', false)

        const [mergedAllowClear] = useIcons({ allowClear }, prefixCls.value)

        const mergedComponents = useComponents(components as any)

        const formItemContext = useFormItemInputContext()
        const { hasFeedback, status: contextStatus, feedbackIcon } = formItemContext.value

        const mergedStatus = getMergedStatus(contextStatus, customStatus.value)

        const suffixNode = (
          <SuffixIcon
            {...{
              picker: props.picker,
              hasFeedback,
              feedbackIcon,
              suffixIcon: mergedSuffixIcon,
            }}
          />
        )

        const mergedClassName = clsx(
          {
            [`${prefixCls.value}-${mergedSize.value}`]: mergedSize.value,
            [`${prefixCls.value}-${variant.value}`]: enableVariantCls.value,
          },
          getStatusClassNames(prefixCls.value, mergedStatus, hasFeedback),
          compactItemClassnames.value,
          contextClassName?.value,
          className,
        )

        const mergedStyle = {
          ...contextStyle?.value,
          ...style,
        }

        const cellRender = slots.cellRender || (props as any).cellRender
          ? (current: AnyObject, info: any) => resolveRender('cellRender', [current, info], { current, info })
          : undefined

        const dateRender = slots.dateRender || (props as any).dateRender
          ? (date: AnyObject, today: AnyObject) => resolveRender('dateRender', [date, today], { date, today })
          : undefined

        const monthCellRender = slots.monthCellRender || (props as any).monthCellRender
          ? (date: AnyObject, localeInfo: any) => resolveRender('monthCellRender', [date, localeInfo], { date, locale: localeInfo })
          : undefined

        const renderExtraFooter = slots.renderExtraFooter || (props as any).renderExtraFooter
          ? (mode: PickerMode) => resolveRender('renderExtraFooter', [mode], mode)
          : undefined

        const panelRender = slots.panelRender || (props as any).panelRender
          ? (panel: VueNode) => resolveRender('panelRender', [panel], panel)
          : undefined

        const inputRender = slots.inputRender || (props as any).inputRender
          ? (inputProps: Record<string, any>) => resolveRender('inputRender', [inputProps], inputProps)
          : undefined

        return (
          <ContextIsolator space>
            <RangePicker
              {...restAttrs}
              {...restProps}
              ref={innerRef as any}
              separator={(
                <span aria-label="to" class={`${prefixCls.value}-separator`}>
                  <SwapRightOutlined />
                </span>
              )}
              disabled={mergedDisabled.value}
              placement={placement}
              placeholder={getRangePlaceholder(locale.value, props.picker, placeholder)}
              suffixIcon={suffixNode}
              prevIcon={<span class={`${prefixCls.value}-prev-icon`} />}
              nextIcon={<span class={`${prefixCls.value}-next-icon`} />}
              superPrevIcon={<span class={`${prefixCls.value}-super-prev-icon`} />}
              superNextIcon={<span class={`${prefixCls.value}-super-next-icon`} />}
              transitionName={getTransitionName(rootPrefixCls.value, 'slide-up')}
              picker={props.picker}
              onCalendarChange={handleCalendarChange}
              onChange={triggerChange}
              onPanelChange={handlePanelChange as any}
              onOpenChange={handleOpenChange}
              onOk={handleOk}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              locale={locale.value?.lang}
              getPopupContainer={props.getPopupContainer || getPopupContainer}
              generateConfig={generateConfig}
              components={mergedComponents as any}
              direction={direction.value}
              // Style
              prefixCls={prefixCls.value}
              rootClassName={mergedRootClassName.value}
              className={mergedClassName}
              style={mergedStyle}
              // Semantic Style
              classNames={mergedClassNames.value}
              styles={{
                ...mergedStyles.value,
                popup: {
                  ...mergedStyles.value.popup,
                  root: {
                    ...mergedStyles.value.popup?.root,
                    zIndex: zIndex.value,
                  },
                },
              }}
              allowClear={mergedAllowClear as any}
              cellRender={cellRender}
              dateRender={dateRender}
              monthCellRender={monthCellRender}
              renderExtraFooter={renderExtraFooter as any}
              panelRender={panelRender as any}
              inputRender={inputRender}
            />
          </ContextIsolator>
        )
      }
    },
    {
      name: 'ARangePicker',
      inheritAttrs: false,
    },
  )

  return RangePickerComponent
}

export default generateRangePicker
