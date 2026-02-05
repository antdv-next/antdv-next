import type { CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNames, SemanticClassNamesType, SemanticSchema, SemanticStyles, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type'
import type { ButtonSemanticName } from '../button'
import type { ButtonSemanticClassNames, ButtonSemanticStyles } from '../button/Button.tsx'
import type { ComponentBaseProps } from '../config-provider/context'
import type { SizeType } from '../config-provider/SizeContext'
import type { InputClassNamesType as BaseInputClassNamesType, InputEmits as BaseInputEmits, InputProps as BaseInputProps, InputStylesType as BaseInputStylesType, InputRef } from './Input'
import { SearchOutlined } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import pickAttrs from '@v-c/util/dist/pickAttrs'
import { omit } from 'es-toolkit'
import { cloneVNode, computed, defineComponent, isVNode, shallowRef } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { toPropsRefs } from '../_util/tools'
import Button from '../button'
import { useComponentBaseConfig } from '../config-provider/context'
import { useSize } from '../config-provider/hooks/useSize'
import { SpaceCompact } from '../space'
import { useCompactItemContext } from '../space/Compact.tsx'
import Input from './Input'
import useStyle from './style/search'

const schema: SemanticSchema = {
  button: {
    _default: 'root',
  },
}

export type InputSearchSemanticName = keyof InputSearchSemanticClassNames
  & keyof InputSearchSemanticStyles

export interface InputSearchSemanticClassNames {
  root?: string
  input?: string
  prefix?: string
  suffix?: string
  count?: string
}

export interface InputSearchSemanticStyles {
  root?: CSSProperties
  input?: CSSProperties
  prefix?: CSSProperties
  suffix?: CSSProperties
  count?: CSSProperties
}

export type InputSearchClassNamesType = SemanticClassNamesType<
  SearchProps,
  InputSearchSemanticClassNames
> & {
  button?: ButtonSemanticClassNames
}

export type InputSearchStylesType = SemanticStylesType<SearchProps, InputSearchSemanticStyles> & {
  button?: ButtonSemanticStyles
}

export interface SearchProps extends Omit<BaseInputProps, 'class' | 'style' | 'rootClass'>, ComponentBaseProps {
  inputPrefixCls?: string
  on?: never
  enterButton?: boolean | VueNode
  loading?: boolean
  size?: SizeType
  hidden?: boolean
  classes?: InputSearchClassNamesType
  styles?: InputSearchStylesType
}

export interface SearchEmits extends BaseInputEmits {
  search: (value: string, event?: Event | MouseEvent | KeyboardEvent, info?: { source?: 'clear' | 'input' }) => void
}

const omitInputKeys: (keyof SearchProps)[] = [
  'enterButton',
  'loading',
  'classes',
  'styles',
  'rootClass',
  'prefixCls',
  'inputPrefixCls',
]

export interface SearchSlots {
  default?: () => any
  prefix?: () => any
  suffix?: () => any
  addonBefore: () => any
  addonAfter: () => any
  clearIcon: () => any
}

const InternalSearch = defineComponent<
  SearchProps,
  SearchEmits,
  string,
  SlotsType<SearchSlots>
>(
  (props, { slots, attrs, emit, expose }) => {
    const composedRef = shallowRef(false)
    const inputRef = shallowRef<InputRef>()

    const {
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      getPrefixCls,
    } = useComponentBaseConfig('inputSearch', props, undefined, 'input-search')

    const inputPrefixCls = computed(() => getPrefixCls('input', props.inputPrefixCls))

    const { classes, styles, size: customizeSize, disabled: customDisabled, variant } = toPropsRefs(
      props,
      'classes',
      'styles',
      'size',
      'disabled',
      'variant',
    )

    const [hashId, cssVarCls] = useStyle(prefixCls)
    const { compactSize } = useCompactItemContext(prefixCls, direction)
    const mergedSize = useSize<SizeType>(ctx => (customizeSize.value ?? compactSize.value ?? ctx) as SizeType)

    const mergedProps = computed(() => ({ ...props, enterButton: props.enterButton }))

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      InputSearchClassNamesType,
      InputSearchStylesType,
      SearchProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
      computed(() => schema),
    )

    const handleSearch = (
      event?: Event | MouseEvent | KeyboardEvent,
      info?: { source?: 'clear' | 'input' },
    ) => {
      const value = inputRef.value?.input?.value ?? ''
      emit('search', value, event, info ?? { source: 'input' })
    }

    const handleChange: BaseInputEmits['change'] = (e) => {
      if ((e as MouseEvent)?.type === 'click' && (e?.target as HTMLInputElement | undefined)?.value !== undefined) {
        handleSearch(e as MouseEvent, { source: 'clear' })
      }
      emit('change', e)
    }

    const handleCompositionStart: BaseInputEmits['compositionstart'] = (e) => {
      composedRef.value = true
      emit('compositionstart', e)
    }

    const handleCompositionEnd: BaseInputEmits['compositionend'] = (e) => {
      composedRef.value = false
      emit('compositionend', e)
    }

    const handlePressEnter: BaseInputEmits['pressEnter'] = (e) => {
      if (composedRef.value || props.loading) {
        return
      }
      emit('pressEnter', e)
      handleSearch(e)
    }

    const onMouseDown = (e: MouseEvent) => {
      if (document.activeElement === inputRef.value?.input) {
        e.preventDefault()
      }
    }

    const onSearchClick = (e: MouseEvent) => {
      handleSearch(e)
    }

    expose({
      focus: (...args: Parameters<NonNullable<InputRef['focus']>>) => inputRef.value?.focus?.(...args),
      blur: () => inputRef.value?.blur?.(),
      input: computed(() => inputRef.value?.input ?? null),
    })

    return () => {
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const rootAttrs = pickAttrs(restAttrs, { data: true })
      const inputAttrs = { ...restAttrs }
      Object.keys(rootAttrs).forEach((key) => {
        delete inputAttrs[key]
      })

      const restInputProps = omit(props, omitInputKeys)

      const mergedClassName = clsx(
        prefixCls.value,
        cssVarCls.value,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-${mergedSize.value}`]: mergedSize.value,
          [`${prefixCls.value}-with-button`]: !!props.enterButton,
        },
        className,
        props.rootClass,
        contextClassName.value,
        mergedClassNames.value.root,
        hashId.value,
      )

      const mergedRootStyle = {
        ...mergedStyles.value.root,
        ...contextStyle.value,
        ...style,
      }

      const btnPrefixCls = `${prefixCls.value}-btn`
      const btnClassName = clsx(btnPrefixCls, {
        [`${btnPrefixCls}-${variant.value}`]: variant.value,
      })

      const enterButtonValue = props.enterButton ?? false
      const isBooleanEnterButton = typeof enterButtonValue === 'boolean'
      const searchIcon = isBooleanEnterButton ? <SearchOutlined /> : null
      const buttonChildren = isBooleanEnterButton ? undefined : enterButtonValue

      let buttonNode: any
      const enterButtonNode = buttonChildren
      const isButtonVNode = isVNode(enterButtonNode)
      const isAntdButton = isButtonVNode && Boolean((enterButtonNode.type as any)?.__ANT_BUTTON)
      const isNativeButton = isButtonVNode && (enterButtonNode.type as any) === 'button'
      if (isAntdButton || isNativeButton) {
        buttonNode = cloneVNode(enterButtonNode as any, {
          onMousedown: onMouseDown,
          onClick: (e: MouseEvent) => {
            ;(enterButtonNode as any)?.props?.onClick?.(e)
            onSearchClick(e)
          },
          class: clsx((enterButtonNode as any)?.props?.class, btnClassName),
          ...(isAntdButton
            ? {
                loading: props.loading,
                size: mergedSize.value,
              }
            : {}),
        })
      }
      else {
        buttonNode = (
          <Button
            classes={mergedClassNames.value.button as SemanticClassNames<ButtonSemanticName>}
            styles={mergedStyles.value.button as SemanticStyles<ButtonSemanticName>}
            class={btnClassName}
            color={props.enterButton ? 'primary' : 'default'}
            size={mergedSize.value}
            disabled={customDisabled.value}
            loading={props.loading}
            icon={searchIcon}
            variant={
              variant.value === 'borderless'
              || variant.value === 'filled'
              || variant.value === 'underlined'
                ? 'text'
                : props.enterButton
                  ? 'solid'
                  : undefined
            }
            onMousedown={onMouseDown}
            onClick={onSearchClick}
          >
            {buttonChildren}
          </Button>
        )
      }

      const inputClassNames = omit(mergedClassNames.value, ['root', 'button']) as BaseInputClassNamesType
      const inputStyles = omit(mergedStyles.value, ['root', 'button']) as BaseInputStylesType

      return (
        <SpaceCompact
          class={mergedClassName}
          style={mergedRootStyle}
          {...{
            hidden: props.hidden,
          }}
          {...rootAttrs}
          size={mergedSize.value}
        >
          <Input
            {...inputAttrs}
            {...restInputProps}
            ref={inputRef as any}
            prefixCls={inputPrefixCls.value}
            size={mergedSize.value}
            disabled={customDisabled.value}
            classes={inputClassNames}
            styles={inputStyles}
            variant={variant.value}
            onChange={handleChange}
            onFocus={(e: any) => emit('focus', e)}
            onBlur={(e: any) => emit('blur', e)}
            onKeydown={(e: any) => emit('keydown', e)}
            onKeyup={(e: any) => emit('keyup', e)}
            onClear={() => {
              emit('clear')
              handleSearch(undefined, { source: 'clear' })
            }}
            onCompositionstart={handleCompositionStart}
            onCompositionend={handleCompositionEnd}
            onPressEnter={handlePressEnter}
            v-slots={slots}
            {...{
              'onUpdate:value': (value: any) => emit('update:value', value),
            }}
          />
          {buttonNode}
        </SpaceCompact>
      )
    }
  },
  {
    name: 'AInputSearch',
    inheritAttrs: false,
  },
)

export default InternalSearch
