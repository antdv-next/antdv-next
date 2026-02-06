import type { DefaultOptionType, CascaderProps as VcCascaderProps } from '@v-c/cascader'
import type { SlotsType } from 'vue'
import type { CascaderProps } from './index'
import { Panel as VcCascaderPanel } from '@v-c/cascader'
import { clsx } from '@v-c/util'
import { computed, defineComponent } from 'vue'
import { getAttrStyleAndClass } from '../_util/hooks'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { DefaultRenderEmpty } from '../config-provider/defaultRenderEmpty'
import { useDisabledContext } from '../config-provider/DisabledContext'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import useBase from './hooks/useBase'
import useCheckable from './hooks/useCheckable'
import useColumnIcons from './hooks/useColumnIcons'
import useStyle from './style'
import usePanelStyle from './style/panel'

export type PanelPickType
  = | 'value'
    | 'defaultValue'
    | 'changeOnSelect'
    | 'options'
    | 'prefixCls'
    | 'fieldNames'
    | 'showCheckedStrategy'
    | 'loadData'
    | 'expandTrigger'
    | 'expandIcon'
    | 'loadingIcon'
    | 'direction'
    | 'notFoundContent'
    | 'disabled'
    | 'optionRender'
    | 'multiple'
    | 'rootClass'

export interface CascaderPanelProps<
  OptionType extends DefaultOptionType = DefaultOptionType,
  ValueField extends keyof OptionType = keyof OptionType,
  Multiple extends boolean = boolean,
> extends Pick<CascaderProps<OptionType, ValueField, Multiple>, PanelPickType> {}

export interface CascaderPanelEmits {
  'change': NonNullable<VcCascaderProps['onChange']>
  'update:value': (value: any) => void
}

export interface CascaderPanelSlots {
  expandIcon?: () => any
  notFoundContent?: () => any
  optionRender?: (option: DefaultOptionType) => any
}

const CascaderPanel = defineComponent<
  CascaderPanelProps,
  CascaderPanelEmits,
  string,
  SlotsType<CascaderPanelSlots>
>(
  (props, { attrs, emit, slots }) => {
    const {
      prefixCls: customizePrefixCls,
      direction: propDirection,
    } = toPropsRefs(props, 'prefixCls', 'direction')
    const { cascaderPrefixCls, direction: mergedDirection, renderEmpty } = useBase(
      customizePrefixCls,
      propDirection,
    )
    const isRtl = computed(() => mergedDirection.value === 'rtl')

    const rootCls = useCSSVarCls(cascaderPrefixCls)
    const [hashId, cssVarCls] = useStyle(cascaderPrefixCls, rootCls)
    usePanelStyle(cascaderPrefixCls)

    const disabled = useDisabledContext()
    const mergedDisabled = computed(() => props.disabled ?? disabled.value)

    const onChange: VcCascaderProps['onChange'] = (value, selectedOptions) => {
      emit('change', value, selectedOptions)
      emit('update:value', value)
    }

    return () => {
      const {
        rootClass,
        multiple,
        optionRender,
        expandIcon,
        prefixCls: _prefixCls,
        direction: _direction,
        loadingIcon: _loadingIcon,
        ...rest
      } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const customExpandIcon = getSlotPropsFnRun(slots, props, 'expandIcon', false) ?? expandIcon
      const [mergedExpandIcon, loadingIcon] = useColumnIcons(isRtl.value, customExpandIcon)
      const checkable = useCheckable(cascaderPrefixCls.value, multiple)

      const slotNotFound = getSlotPropsFnRun(slots, props, 'notFoundContent', false)
      let mergedNotFoundContent = slotNotFound
      if (slotNotFound === undefined) {
        mergedNotFoundContent = renderEmpty.value?.('Cascader') || <DefaultRenderEmpty componentName="Cascader" />
      }

      const mergedOptionRender = slots.optionRender
        ? (option: DefaultOptionType) => slots.optionRender?.(option)
        : optionRender

      return (
        <VcCascaderPanel
          {...restAttrs}
          {...rest as any}
          checkable={checkable}
          prefixCls={cascaderPrefixCls.value}
          className={clsx(
            rootClass,
            cssVarCls.value,
            rootCls.value,
            hashId.value,
            className,
          )}
          style={style}
          notFoundContent={mergedNotFoundContent}
          direction={mergedDirection.value}
          expandIcon={mergedExpandIcon}
          loadingIcon={loadingIcon}
          disabled={mergedDisabled.value}
          optionRender={mergedOptionRender}
          onChange={onChange}
        />
      )
    }
  },
  {
    name: 'ACascaderPanel',
    inheritAttrs: false,
  },
)

export default CascaderPanel
