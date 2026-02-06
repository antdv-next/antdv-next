import type { PickerMode, PickerRef } from '@v-c/picker'
import type { GenerateConfig } from '@v-c/picker/generate'
import type { SlotsType } from 'vue'
import type { AnyObject, VueNode } from '../../_util/type'
import type { GenericTimePickerProps, PickerProps } from './interface'
import Picker from '@v-c/picker'
import { clsx } from '@v-c/util'
import { getTransitionName } from '@v-c/util/dist/utils/transition'
import { omit } from 'es-toolkit'
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
import { getPlaceholder, useIcons } from '../util'
import {
  MONTH,
  MONTHPICKER,
  QUARTER,
  QUARTERPICKER,
  TIME,
  TIMEPICKER,
  WEEK,
  WEEKPICKER,
  YEAR,
  YEARPICKER,
} from './constant'
import SuffixIcon from './SuffixIcon'
import useComponents from './useComponents'

export interface DatePickerEmits<DateType = AnyObject> {
  'change': (date: DateType | DateType[] | null, dateString: string | string[]) => void
  'update:value': (date: DateType | DateType[] | null) => void
  'calendarChange': (date: DateType | DateType[], dateString: string | string[], info: any) => void
  'panelChange': (date: DateType, mode: PickerMode) => void
  'openChange': (open: boolean) => void
  'ok': (date: DateType | DateType[]) => void
  'select': (date: DateType) => void
  'focus': (e: FocusEvent, info: any) => void
  'blur': (e: FocusEvent, info: any) => void
  'keydown': (e: KeyboardEvent, preventDefault: VoidFunction) => void
}

export interface DatePickerSlots {
  suffixIcon?: () => any
  renderExtraFooter?: (mode: PickerMode) => any
  panelRender?: (originPanel: VueNode) => any
  inputRender?: (props: Record<string, any>) => any
  cellRender?: (ctx: { current: AnyObject, info: any }) => any
  dateRender?: (ctx: { date: AnyObject, today: AnyObject }) => any
  monthCellRender?: (ctx: { date: AnyObject, locale: any }) => any
  [key: string]: any
}

function generatePicker<DateType extends AnyObject = AnyObject>(generateConfig: GenerateConfig<DateType>) {
  type DatePickerProps = PickerProps<DateType>
  type TimePickerProps = GenericTimePickerProps<DateType>

  const getPicker = <P extends DatePickerProps>(picker?: PickerMode, displayName?: string) => {
    const pickerType = displayName === TIMEPICKER ? 'timePicker' : 'datePicker'

    const name = displayName ? `A${displayName}` : 'ADatePicker'

    return defineComponent<
      PickerProps<DateType>,
      DatePickerEmits<DateType>,
      string,
      SlotsType<DatePickerSlots>
    >(
      (props, { slots, attrs, emit, expose }) => {
        const {
          getPopupContainer: customGetPopupContainer,
          size: customizeSize,
          disabled: customDisabled,
          status: customStatus,
          variant: customVariant,
          classes,
          styles,
          rootClass,
          bordered,
        } = toPropsRefs(
          props as P,
          'prefixCls',
          'getPopupContainer',
          'size',
          'disabled',
          'status',
          'variant',
          'classes',
          'styles',
          'rootClass',
          'bordered',
        )

        const {
          prefixCls,
          direction,
          getPopupContainer,
          rootPrefixCls,
          class: contextClassName,
          style: contextStyle,
        } = useComponentBaseConfig(pickerType as any, props as any, [], 'picker')

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
        } as P))

        const popupClassName = computed(() => props.popupClassName || props.dropdownClassName)
        const popupStyle = computed(() => props.popupStyle)

        const [mergedClassNames, mergedStyles] = useMergedPickerSemantic<P>(
          pickerType as any,
          classes as any,
          styles as any,
          popupClassName,
          popupStyle,
          mergedProps,
        )

        const innerRef = shallowRef<PickerRef>()

        const [variant, enableVariantCls] = useVariants('datePicker', customVariant, bordered)

        const rootCls = useCSSVarCls(prefixCls)
        const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

        const mergedRootClassName = computed(() => clsx(
          hashId.value,
          cssVarCls.value,
          rootCls.value,
          rootClass.value,
        ))

        const additionalProps = {
          showToday: true,
        }

        const mergedPicker = computed(() => props.picker || picker)

        const [contextLocale] = useLocale('DatePicker', enUS)
        const locale = computed(() => ({
          ...contextLocale?.value,
          ...(props.locale ?? {}),
        }))

        const [zIndex] = useZIndex('DatePicker', computed(() => mergedStyles.value?.popup?.root?.zIndex as number))

        const triggerChange = (date: DateType | DateType[] | null, dateStr: string | string[]) => {
          emit('update:value', date)
          emit('change', date, dateStr)
        }

        const handleCalendarChange = (date: DateType | DateType[], dateStr: string | string[], info: any) => {
          emit('calendarChange', date, dateStr, info)
          if ((props as any).multiple && !(props as any).needConfirm) {
            triggerChange(date as DateType[], dateStr as string[])
          }
          if (picker === TIME && !(props as any).multiple) {
            emit('select', (date as DateType[])[0] ?? (date as DateType))
          }
        }

        const handlePanelChange = (value: DateType, mode: PickerMode) => {
          emit('panelChange', value, mode)
        }

        const handleOpenChange = (open: boolean) => {
          emit('openChange', open)
        }

        const handleOk = (value: DateType | DateType[]) => {
          emit('ok', value)
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
          key: keyof DatePickerSlots,
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
          const warning = devUseWarning(displayName || 'DatePicker')
          if (picker && displayName) {
            warning(
              picker !== 'quarter',
              'deprecated',
              `DatePicker.${displayName} is legacy usage. Please use DatePicker[picker='${picker}'] directly.`,
            )
          }
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
          focus: (options?: FocusOptions) => innerRef.value?.focus?.(options),
          blur: () => innerRef.value?.blur?.(),
          nativeElement: computed(() => () => innerRef.value?.nativeElement),
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
          } = props as P

          const { className, style, restAttrs } = getAttrStyleAndClass(attrs, undefined, props)

          const mergedSuffixIcon = getSlotPropsFnRun(slots, { suffixIcon }, 'suffixIcon', false)

          const [mergedAllowClear, removeIcon] = useIcons({
            allowClear,
            removeIcon: (props as any).removeIcon,
          }, prefixCls.value)

          const mergedComponents = useComponents(components as any)

          const formItemContext = useFormItemInputContext()
          const { hasFeedback, status: contextStatus, feedbackIcon } = formItemContext.value

          const mergedStatus = getMergedStatus(contextStatus, customStatus.value)

          const suffixNode = (
            <SuffixIcon
              {...{
                picker: mergedPicker.value,
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
            ? (date: AnyObject, localeInfo: any) => resolveRender('monthCellRender', [date, localeInfo], {
                date,
                locale: localeInfo,
              })
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
              <Picker
                {...restAttrs}
                {...additionalProps}
                {...omit(restProps, ['onKeydown']) as any}
                ref={innerRef}
                placeholder={getPlaceholder(locale.value, mergedPicker.value, placeholder)}
                suffixIcon={suffixNode}
                placement={placement}
                prevIcon={<span class={`${prefixCls.value}-prev-icon`} />}
                nextIcon={<span class={`${prefixCls.value}-next-icon`} />}
                superPrevIcon={<span class={`${prefixCls.value}-super-prev-icon`} />}
                superNextIcon={<span class={`${prefixCls.value}-super-next-icon`} />}
                transitionName={getTransitionName(rootPrefixCls.value, 'slide-up')}
                picker={mergedPicker.value}
                onCalendarChange={handleCalendarChange}
                onChange={triggerChange}
                onPanelChange={handlePanelChange as any}
                onOpenChange={handleOpenChange}
                onOk={handleOk}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                locale={locale.value?.lang}
                getPopupContainer={customGetPopupContainer.value || getPopupContainer}
                generateConfig={generateConfig}
                components={mergedComponents}
                direction={direction.value}
                disabled={mergedDisabled.value}
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
                } as any}
                allowClear={mergedAllowClear as any}
                removeIcon={removeIcon}
                cellRender={cellRender}
                dateRender={dateRender}
                monthCellRender={monthCellRender}
                renderExtraFooter={renderExtraFooter}
                panelRender={panelRender}
                inputRender={inputRender}
              />
            </ContextIsolator>
          )
        }
      },
      {
        name,
        inheritAttrs: false,
      },
    )
  }

  const DatePicker = getPicker<DatePickerProps>()
  const WeekPicker = getPicker<Omit<DatePickerProps, 'picker'>>(WEEK, WEEKPICKER)
  const MonthPicker = getPicker<Omit<DatePickerProps, 'picker'>>(MONTH, MONTHPICKER)
  const YearPicker = getPicker<Omit<DatePickerProps, 'picker'>>(YEAR, YEARPICKER)
  const QuarterPicker = getPicker<Omit<DatePickerProps, 'picker'>>(QUARTER, QUARTERPICKER)
  const TimePicker = getPicker<Omit<TimePickerProps, 'picker'>>(TIME, TIMEPICKER)

  return { DatePicker, WeekPicker, MonthPicker, YearPicker, TimePicker, QuarterPicker }
}

export default generatePicker
