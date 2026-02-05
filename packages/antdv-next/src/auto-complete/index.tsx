import type { SelectProps as VcSelectProps } from '@v-c/select'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { InputStatus } from '../_util/statusUtils'
import type { VueNode } from '../_util/type'
import type {
  InternalSelectProps,
  SelectPopupSemanticClassNames,
  SelectPopupSemanticStyles,
  SelectProps,
} from '../select'
import { Option } from '@v-c/select'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { toArray } from 'es-toolkit/compat'
import { computed, defineComponent, isVNode, Text } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import genPurePanel from '../_util/PurePanel.tsx'
import { toPropsRefs } from '../_util/tools'
import { devUseWarning, isDev } from '../_util/warning'
import { useComponentBaseConfig } from '../config-provider/context'
import Select from '../select'

export type AutoCompleteSemanticName = 'root' | 'prefix' | 'input' | 'placeholder' | 'content'

export interface AutoCompleteSemanticClassNames {
  root?: string
  prefix?: string
  input?: string
  placeholder?: string
  content?: string
}

export interface AutoCompleteSemanticStyles {
  root?: CSSProperties
  prefix?: CSSProperties
  input?: CSSProperties
  placeholder?: CSSProperties
  content?: CSSProperties
}

export interface DataSourceItemObject {
  value: string
  text: string
}

export type DataSourceItemType = DataSourceItemObject | VueNode

export type AutoCompleteClassNamesType = SemanticClassNamesType<
  AutoCompleteProps,
  AutoCompleteSemanticClassNames,
  { popup?: SelectPopupSemanticClassNames }
>

export type AutoCompleteStylesType = SemanticStylesType<
  AutoCompleteProps,
  AutoCompleteSemanticStyles,
  { popup?: SelectPopupSemanticStyles }
>

type RcEventKeys
  = | 'onClear'
    | 'onKeyUp'
    | 'onKeyDown'
    | 'onBlur'
    | 'onClick'
    | 'onActive'
    | 'onChange'
    | 'onDeselect'
    | 'onInputKeyDown'
    | 'onMouseDown'
    | 'onMouseLeave'
    | 'onMouseEnter'
    | 'onFocus'
    | 'onPopupScroll'
    | 'onPopupVisibleChange'
    | 'onSelect'
    | 'onSearch'

export interface AutoCompleteProps extends
  Omit<
    InternalSelectProps,
    | 'loading'
    | 'mode'
    | 'optionLabelProp'
    | 'labelInValue'
    | 'classes'
    | 'styles'
    | 'getInputElement'
    | 'getRawInputElement'
    | RcEventKeys
  > {
  /** @deprecated Please use `options` instead */
  dataSource?: DataSourceItemType[]
  status?: InputStatus
  /** @deprecated Please use `classes.popup.root` instead */
  popupClassName?: string
  /** @deprecated Please use `classes.popup.root` instead */
  dropdownClassName?: string
  /** @deprecated Please use `popupMatchSelectWidth` instead */
  dropdownMatchSelectWidth?: boolean | number
  popupMatchSelectWidth?: boolean | number
  styles?: AutoCompleteStylesType
  classes?: AutoCompleteClassNamesType
  /** @deprecated Please use `popupRender` instead */
  dropdownRender?: (menu: VueNode) => any
  popupRender?: (menu: VueNode) => any
  /** @deprecated Please use `styles.popup.root` instead */
  dropdownStyle?: CSSProperties
}

export interface AutoCompleteEmits {
  'openChange': (open: boolean) => void
  'dropdownVisibleChange': (open: boolean) => void
  'clear': NonNullable<VcSelectProps['onClear']>
  'keydown': NonNullable<VcSelectProps['onKeyDown']>
  'keyup': NonNullable<VcSelectProps['onKeyUp']>
  'blur': NonNullable<VcSelectProps['onBlur']>
  'update:value': (value: any) => void
  'click': NonNullable<VcSelectProps['onClick']>
  'active': NonNullable<VcSelectProps['onActive']>
  'change': NonNullable<VcSelectProps['onChange']>
  'deselect': NonNullable<VcSelectProps['onDeselect']>
  'inputKeydown': NonNullable<VcSelectProps['onInputKeyDown']>
  'mousedown': NonNullable<VcSelectProps['onMouseDown']>
  'mouseleave': NonNullable<VcSelectProps['onMouseLeave']>
  'mouseenter': NonNullable<VcSelectProps['onMouseEnter']>
  'focus': NonNullable<VcSelectProps['onFocus']>
  'popupScroll': NonNullable<VcSelectProps['onPopupScroll']>
  'select': NonNullable<VcSelectProps['onSelect']>
  'search': NonNullable<VcSelectProps['onSearch']>
}

export interface AutoCompleteSlots {
  default?: () => any
}

function isSelectOptionOrSelectOptGroup(child: any): boolean {
  return child?.type && (child.type.isSelectOption || child.type.isSelectOptGroup)
}

const omitKeys: (keyof AutoCompleteProps)[] = [
  'dataSource',
  'dropdownClassName',
  'popupClassName',
  'dropdownMatchSelectWidth',
  'dropdownRender',
  'dropdownStyle',
  'classes',
  'styles',
  'popupRender',
]

const InternalAutoComplete = defineComponent<
  AutoCompleteProps,
  AutoCompleteEmits,
  string,
  SlotsType<AutoCompleteSlots>
>(
  (props, { slots, emit, attrs }) => {
    const { prefixCls } = useComponentBaseConfig('select', props)
    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')

    const mergedProps = computed(() => {
      return {
        ...props,
        popupMatchSelectWidth: props.popupMatchSelectWidth ?? props.dropdownMatchSelectWidth,
        popupRender: props.popupRender ?? props.dropdownRender,
      } as AutoCompleteProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      AutoCompleteClassNamesType,
      AutoCompleteStylesType,
      AutoCompleteProps
    >(
      useToArr(classes),
      useToArr(styles),
      useToProps(mergedProps),
      computed(() => ({
        popup: {
          _default: 'root',
        },
      })),
    )

    return () => {
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const childNodes = toArray(filterEmpty(slots.default?.() ?? []))
      const hasSelectOptions = !!childNodes.length && isSelectOptionOrSelectOptGroup(childNodes[0])

      let customizeInput: any
      if (
        childNodes.length === 1
        && isVNode(childNodes[0])
        && childNodes[0].type !== Text
        && !isSelectOptionOrSelectOptGroup(childNodes[0])
      ) {
        [customizeInput] = childNodes
      }

      const getInputElement = customizeInput ? () => customizeInput : undefined

      let optionChildren: any = []
      if (hasSelectOptions) {
        optionChildren = childNodes
      }
      else if (props.dataSource) {
        optionChildren = props.dataSource.map((item) => {
          if (isVNode(item)) {
            return item
          }
          switch (typeof item) {
            case 'string':
              return (
                <Option key={item} value={item}>
                  {item}
                </Option>
              )
            case 'object': {
              const { value: optionValue, text } = item as DataSourceItemObject
              return (
                <Option key={optionValue} value={optionValue}>
                  {text}
                </Option>
              )
            }
            default:
              return null
          }
        })
      }
      optionChildren = filterEmpty(optionChildren)

      if (isDev) {
        const warning = devUseWarning('AutoComplete')
        warning(
          !(customizeInput && props.size !== undefined),
          'usage',
          'You need to control style self instead of setting `size` when using customize input.',
        )

        const deprecatedProps = {
          dropdownMatchSelectWidth: 'popupMatchSelectWidth',
          dropdownStyle: 'styles.popup.root',
          dropdownClassName: 'classes.popup.root',
          popupClassName: 'classes.popup.root',
          dropdownRender: 'popupRender',
          dataSource: 'options',
        }

        Object.entries(deprecatedProps).forEach(([oldProp, newProp]) => {
          warning.deprecated(!((props as any)[oldProp]), oldProp, newProp)
        })
      }

      const mergedPopupRender = props.popupRender ?? props.dropdownRender
      const mergedPopupMatchSelectWidth = props.popupMatchSelectWidth ?? props.dropdownMatchSelectWidth

      const finalClassNames = {
        root: clsx(
          `${prefixCls.value}-auto-complete`,
          mergedClassNames.value.root,
          {
            [`${prefixCls.value}-customize`]: customizeInput,
          },
          className,
        ),
        prefix: mergedClassNames.value.prefix,
        input: mergedClassNames.value.input,
        placeholder: mergedClassNames.value.placeholder,
        content: mergedClassNames.value.content,
        popup: {
          root: clsx(
            props.popupClassName,
            props.dropdownClassName,
            mergedClassNames.value.popup?.root,
          ),
          list: mergedClassNames.value.popup?.list,
          listItem: mergedClassNames.value.popup?.listItem,
        },
      }

      const finalStyles = {
        root: mergedStyles.value.root,
        prefix: mergedStyles.value.prefix,
        input: mergedStyles.value.input,
        placeholder: mergedStyles.value.placeholder,
        content: mergedStyles.value.content,
        popup: {
          root: {
            ...props.dropdownStyle,
            ...mergedStyles?.value?.popup?.root,
          },
          list: mergedStyles.value.popup?.list,
          listItem: mergedStyles.value.popup?.listItem,
        },
      }

      const selectProps: Record<string, any> = omit(props, omitKeys)
      const onAttrs = {
        onSelect: (...args: any[]) => {
          emit('select', ...args)
        },
        onClear: (...args: any[]) => {
          emit('clear', ...args)
        },
        onKeydown: (...args: any[]) => {
          emit('keydown', ...args)
        },
        onKeyup: (...args: any[]) => {
          emit('keyup', ...args)
        },
        onBlur: (...args: any[]) => {
          emit('blur', ...args)
        },
        onFocus: (...args: any[]) => {
          emit('focus', ...args)
        },
        onClick: (...args: any[]) => {
          emit('click', ...args)
        },
        onActive: (...args: any[]) => {
          emit('active', ...args)
        },
        onChange: (...args: any[]) => {
          emit('change', ...args)
        },
        onDeselect: (...args: any[]) => {
          emit('deselect', ...args)
        },
        onInputKeydown: (...args: any[]) => {
          emit('inputKeydown', ...args)
        },
        onMousedown: (...args: any[]) => {
          emit('mousedown', ...args)
        },
        onMouseleave: (...args: any[]) => {
          emit('mouseleave', ...args)
        },
        onMouseenter: (...args: any[]) => {
          emit('mouseenter', ...args)
        },
        onPopupScroll: (...args: any[]) => {
          emit('popupScroll', ...args)
        },
        onSearch: (...args: any[]) => {
          emit('search', ...args)
        },
        onOpenChange: (open: boolean) => {
          emit('openChange', open)
        },
        onDropdownVisibleChange: (open: boolean) => {
          emit('dropdownVisibleChange', open)
        },
      }

      const inputProps = getInputElement ? ({ getInputElement } as any) : {}
      return (
        <Select
          {...restAttrs}
          {...selectProps}
          {...onAttrs}
          {...inputProps}
          prefixCls={prefixCls.value}
          classes={finalClassNames as any}
          styles={finalStyles as any}
          style={style}
          popupRender={mergedPopupRender}
          popupMatchSelectWidth={mergedPopupMatchSelectWidth}
          mode={(Select as any).SECRET_COMBOBOX_MODE_DO_NOT_USE as SelectProps['mode']}
          suffixIcon={null}
          {...{
            'onUpdate:value': (value: any) => emit('update:value', value),
          }}
        >
          {optionChildren}
        </Select>
      )
    }
  },
  {
    name: 'AAutoComplete',
    inheritAttrs: false,
  },
)

const AutoComplete = InternalAutoComplete as typeof InternalAutoComplete & {
  Option: typeof Option
  install: (app: App) => void
  _InternalPanelDoNotUseOrYouWillBeFired: any
}

// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(InternalAutoComplete, 'popupAlign', (props: any) => {
  return omit(props, ['visible'])
})

AutoComplete.Option = Option

AutoComplete._InternalPanelDoNotUseOrYouWillBeFired = PurePanel

AutoComplete.install = (app: App): void => {
  app.component(AutoComplete.name, AutoComplete)
  app.component('AAutoCompleteOption', Option as any)
}

export { Option }
export default AutoComplete
