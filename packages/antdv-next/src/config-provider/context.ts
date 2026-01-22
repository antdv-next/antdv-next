import type { DerivativeFunc } from '@antdv-next/cssinjs'
import type { CSSProperties, InjectionKey, Ref } from 'vue'
import type { MaskType } from '../_util/hooks'
import type { AnyObject, VueNode } from '../_util/type.ts'
import type { WarningContextProps } from '../_util/warning.ts'
import type { ShowWaveEffect } from '../_util/wave/interface.ts'
import type { AlertProps } from '../alert'
import type { AnchorProps } from '../anchor'
import type { BadgeProps } from '../badge'
import type { BreadcrumbProps } from '../breadcrumb/Breadcrumb.tsx'
import type { ButtonProps } from '../button'
import type { CardProps } from '../card/Card.tsx'
import type { CardMetaProps } from '../card/CardMeta.tsx'
import type { CascaderProps } from '../cascader'
import type { CheckboxProps } from '../checkbox'
import type { CollapseProps } from '../collapse'
import type { DatePickerProps, RangePickerProps } from '../date-picker'
import type { DescriptionsProps } from '../descriptions'
import type { DividerProps } from '../divider'
import type { DrawerProps } from '../drawer'
import type { EmptyProps } from '../empty'
import type { FlexProps } from '../flex'
import type { FloatButtonGroupProps, FloatButtonProps } from '../float-button'
import type { FormProps } from '../form/Form.tsx'
import type { ImageProps } from '../image/index.tsx'
import type { InputNumberProps } from '../input-number'
import type { InputProps } from '../input/Input.tsx'
import type { OTPProps } from '../input/OTP'
import type { SearchProps } from '../input/Search.tsx'
import type { TextAreaProps } from '../input/TextArea.tsx'
import type { Locale } from '../locale'
import type { MasonryProps } from '../masonry/Masonry.tsx'
import type { MenuProps } from '../menu'
import type { ModalProps } from '../modal/interface.ts'
import type { ArgsProps as NotificationProps } from '../notification'
import type { PaginationProps } from '../pagination/interface.ts'
import type { PopconfirmProps } from '../popconfirm'
import type { PopoverProps } from '../popover'
import type { QRCodeProps } from '../qrcode'
import type { RadioProps } from '../radio/interface.ts'
import type { ResultProps } from '../result'
import type { SegmentedProps } from '../segmented'
import type { SelectProps } from '../select'
import type { SkeletonProps } from '../skeleton'
import type { SliderProps } from '../slider'
import type { SpaceProps } from '../space'
import type { SpinProps } from '../spin'
import type { StatisticProps } from '../statistic'
import type { StepsProps } from '../steps'
import type { SwitchProps } from '../switch'
import type { TableProps } from '../table'
import type { TabsProps } from '../tabs'
import type { TagProps } from '../tag'
import type { AliasToken, MapToken, OverrideToken, SeedToken } from '../theme/interface'
import type { TimePickerProps } from '../time-picker'
import type { TooltipProps } from '../tooltip'
import type { TourProps } from '../tour'
import type { TransferProps } from '../transfer/interface'
import type { TreeSelectProps } from '../tree-select'
import type { TreeProps } from '../tree/Tree.tsx'
import type { BlockProps as TypographyBaseProps } from '../typography/interface'
import type { UploadProps } from '../upload/interface.ts'
import type { RenderEmptyHandler } from './defaultRenderEmpty'
import type { ConfigProviderProps } from './index.tsx'
import { computed, inject, provide, ref } from 'vue'

export const defaultPrefixCls = 'ant'
export const defaultIconPrefixCls = 'anticon'
const EMPTY_OBJECT = {}

type GetClassNamesOrEmptyObject<Config extends { classes?: any }> = Config extends {
  classes?: infer ClassNames
}
  ? ClassNames
  : object

type GetStylesOrEmptyObject<Config extends { styles?: any }> = Config extends {
  styles?: infer Styles
}
  ? Styles
  : object

type ComponentReturnType<T extends keyof ConfigComponentProps> = Omit<
  NonNullable<ConfigComponentProps[T]>,
    'classes' | 'styles'
> & {
  classes: GetClassNamesOrEmptyObject<NonNullable<ConfigComponentProps[T]>>
  styles: GetStylesOrEmptyObject<NonNullable<ConfigComponentProps[T]>>
  getPrefixCls: ConfigConsumerProps['getPrefixCls']
  direction: ConfigConsumerProps['direction']
  getPopupContainer: ConfigConsumerProps['getPopupContainer']
}
export interface Theme {
  primaryColor?: string
  infoColor?: string
  successColor?: string
  processingColor?: string
  errorColor?: string
  warningColor?: string
}

export interface CSPConfig {
  nonce?: string
}

export type DirectionType = 'ltr' | 'rtl' | undefined

export type MappingAlgorithm = DerivativeFunc<SeedToken, MapToken>

export interface ComponentBaseProps {
  rootClass?: string
  prefixCls?: string
}

type ComponentsConfig = {
  [key in keyof OverrideToken]?: OverrideToken[key] & {
    algorithm?: boolean | MappingAlgorithm | MappingAlgorithm[]
  };
}

export interface ThemeConfig {
  /**
   * @descCN 用于修改 Design Token。
   * @descEN Modify Design Token.
   */
  token?: Partial<AliasToken>
  /**
   * @descCN 用于修改各个组件的 Component Token 以及覆盖该组件消费的 Alias Token。
   * @descEN Modify Component Token and Alias Token applied to components.
   */
  components?: ComponentsConfig
  /**
   * @descCN 用于修改 Seed Token 到 Map Token 的算法。
   * @descEN Modify the algorithms of theme.
   * @default defaultAlgorithm
   */
  algorithm?: MappingAlgorithm | MappingAlgorithm[]
  /**
   * @descCN 是否继承外层 `ConfigProvider` 中配置的主题。
   * @descEN Whether to inherit the theme configured in the outer layer `ConfigProvider`.
   * @default true
   */
  inherit?: boolean
  /**
   * @descCN 是否开启 `hashed` 属性。如果你的应用中只存在一个版本的 antd，你可以设置为 `false` 来进一步减小样式体积。
   * @descEN Whether to enable the `hashed` attribute. If there is only one version of antd in your application, you can set `false` to reduce the bundle size.
   * @default true
   * @since 5.0.0
   */
  hashed?: boolean
  /**
   * @descCN 通过 `cssVar` 配置来开启 CSS 变量模式，这个配置会被继承。
   * @descEN Enable CSS variable mode through `cssVar` configuration, This configuration will be inherited.
   * @default false
   * @since 5.12.0
   */
  cssVar?: {
    /**
     * @descCN css 变量的前缀
     * @descEN Prefix for css variable.
     * @default ant
     */
    prefix?: string
    /**
     * @descCN 主题的唯一 key，版本低于 react@18 时需要手动设置。
     * @descEN Unique key for theme, should be set manually < react@18.
     */
    key?: string
  }
  /**
   * @descCN 开启零运行时模式，不会在运行时产生样式，需要手动引入 CSS 文件。
   * @descEN Enable zero-runtime mode, which will not generate style at runtime, need to import additional CSS file.
   * @default true
   * @since 6.0.0
   * @example
   * ```tsx
   * import { ConfigProvider } from 'antd';
   * import 'antdv-next/dist/antd.css';
   *
   * const Demo = () => (
   *   <ConfigProvider theme={{ zeroRuntime: true }}>
   *     <App />
   *   </ConfigProvider>
   *);
   * ```
   */
  zeroRuntime?: boolean
}

export interface ComponentStyleConfig {
  class?: string
  style?: CSSProperties
  classes?: any
  styles?: any
}

export type PopupOverflow = 'viewport' | 'scroll'

export const Variants = ['outlined', 'borderless', 'filled', 'underlined'] as const

export type Variant = (typeof Variants)[number]

export interface WaveConfig {
  /**
   * @descCN 是否禁用水波纹效果。
   * @descEN Whether to disable wave effect.
   * @default false
   */
  disabled?: boolean
  /**
   * @descCN 自定义水波纹效果。
   * @descEN Customized wave effect.
   */
  showEffect?: ShowWaveEffect
}

export type SpaceConfig = ComponentStyleConfig & Pick<SpaceProps, 'size' | 'classes' | 'styles'>

export type ButtonConfig = ComponentStyleConfig
  & Pick<ButtonProps, 'classes' | 'styles' | 'autoInsertSpace' | 'variant' | 'color' | 'shape'>

export type FlexConfig = ComponentStyleConfig & Pick<FlexProps, 'vertical'>

export type AlertConfig = ComponentStyleConfig & Pick<AlertProps, 'closable' | 'closeIcon' | 'classes' | 'styles'>

export type BadgeConfig = ComponentStyleConfig & Pick<BadgeProps, 'classes' | 'styles'>

export type TagConfig = ComponentStyleConfig & Pick<TagProps, 'variant' | 'closeIcon' | 'closable' | 'classes' | 'styles'>

export type EmptyConfig = ComponentStyleConfig & Pick<EmptyProps, 'classes' | 'styles' | 'image'>

export type SpinConfig = ComponentStyleConfig & Pick<SpinProps, 'indicator'>

export type DescriptionsConfig = ComponentStyleConfig & Pick<DescriptionsProps, 'styles' | 'classes'>

export type CollapseConfig = ComponentStyleConfig & Pick<CollapseProps, 'expandIcon'>

export type QRcodeConfig = ComponentStyleConfig & Pick<QRCodeProps, 'classes' | 'styles'>

export type ResultConfig = ComponentStyleConfig & Pick<ResultProps, 'classes' | 'styles'>

export type AnchorStyleConfig = ComponentStyleConfig & Pick<AnchorProps, 'classes' | 'styles'>

export type PaginationConfig = ComponentStyleConfig & Pick<PaginationProps, 'showSizeChanger'>

export type DividerConfig = ComponentStyleConfig & Pick<DividerProps, 'classes' | 'styles'>

export type SkeletonConfig = ComponentStyleConfig & Pick<SkeletonProps, 'styles' | 'classes'>

export type StatisticConfig = ComponentStyleConfig & Pick<StatisticProps, 'classes' | 'styles'>

export type TypographyConfig = ComponentStyleConfig & Pick<TypographyBaseProps, 'classes' | 'styles'>

export type FloatButtonConfig = ComponentStyleConfig & Pick<FloatButtonProps, 'classes' | 'styles'> & {
  backTopIcon?: VueNode
}

export type FloatButtonGroupConfig = ComponentStyleConfig & Pick<FloatButtonGroupProps, 'classes' | 'styles'> & {
  closeIcon?: VueNode
}

export type TooltipConfig = ComponentStyleConfig & Pick<TooltipProps, 'styles' | 'classes' | 'arrow'> & {
  /**
   * @descCN 是否开启 Tooltip 流畅过渡动画
   * @descEN Whether to enable smooth transition for tooltips
   * @default false
   */
  unique?: boolean
}

export type PopoverConfig = ComponentStyleConfig & Pick<PopoverProps, 'classes' | 'styles' | 'arrow'>

export type PopconfirmConfig = ComponentStyleConfig & Pick<PopconfirmProps, 'classes' | 'styles' | 'arrow'>

export type SegmentedConfig = ComponentStyleConfig & Pick<SegmentedProps, 'classes' | 'styles'>

export type MenuConfig = ComponentStyleConfig & Pick<MenuProps, 'expandIcon' | 'classes' | 'styles'>

export type TourConfig = ComponentStyleConfig & Pick<TourProps, 'closeIcon' | 'classes' | 'styles'>

export type NotificationConfig = ComponentStyleConfig & Pick<NotificationProps, 'closeIcon' | 'classes' | 'styles'>

export type BreadcrumbConfig = ComponentStyleConfig & Pick<BreadcrumbProps, 'classes' | 'styles' | 'separator'>

export type MasonryConfig = ComponentStyleConfig & Pick<MasonryProps, 'classes' | 'styles'>

export type FormConfig = ComponentStyleConfig
  & Pick<
    FormProps,
    | 'requiredMark'
    | 'colon'
    | 'scrollToFirstError'
    | 'validateMessages'
    | 'variant'
    | 'classes'
    | 'styles'
  >
export type RadioConfig = ComponentStyleConfig & Pick<RadioProps, 'classes' | 'styles'>

export type CheckboxConfig = ComponentStyleConfig & Pick<CheckboxProps, 'classes' | 'styles'>

export type SwitchStyleConfig = ComponentStyleConfig & Pick<SwitchProps, 'classes' | 'styles'>

export type TransferConfig = ComponentStyleConfig & Pick<TransferProps, 'selectionsIcon' | 'classes' | 'styles'>

export type InputConfig = ComponentStyleConfig
  & Pick<InputProps, 'autoComplete' | 'classes' | 'styles' | 'allowClear' | 'variant'>

export type InputNumberConfig = ComponentStyleConfig
  & Pick<InputNumberProps, 'classes' | 'styles' | 'variant'>

export type TextAreaConfig = ComponentStyleConfig
  & Pick<TextAreaProps, 'classes' | 'styles' | 'allowClear' | 'variant'>

export type MentionsConfig = ComponentStyleConfig
  & Pick<TextAreaProps, 'classes' | 'styles' | 'allowClear' | 'variant'>

export type InputSearchConfig = ComponentStyleConfig & Pick<SearchProps, 'classes' | 'styles'>

export type OTPConfig = ComponentStyleConfig & Pick<OTPProps, 'classes' | 'styles' | 'variant'>

export type SliderConfig = ComponentStyleConfig & Pick<SliderProps, 'styles' | 'classes'>

export type TabsConfig = ComponentStyleConfig
  & Pick<
    TabsProps,
    | 'indicator'
    | 'indicatorSize'
    | 'more'
    | 'moreIcon'
    | 'addIcon'
    | 'removeIcon'
    | 'classes'
    | 'styles'
  >

export type SelectConfig = ComponentStyleConfig
  & Pick<SelectProps, 'showSearch' | 'variant' | 'classes' | 'styles'>

export type CascaderConfig = ComponentStyleConfig
  & Pick<CascaderProps, 'variant' | 'classes' | 'styles'>

export type CardMetaConfig = ComponentStyleConfig & Pick<CardMetaProps, 'classes' | 'styles'>

export type CardConfig = ComponentStyleConfig
  & Pick<CardProps, 'classes' | 'styles' | 'variant'>

export type DrawerConfig = ComponentStyleConfig
  & Pick<DrawerProps, 'classes' | 'styles' | 'closeIcon' | 'closable' | 'mask'>

export type ModalConfig = ComponentStyleConfig
  & Pick<
    ModalProps,
    | 'classes'
    | 'styles'
    | 'closeIcon'
    | 'closable'
    | 'centered'
    | 'okButtonProps'
    | 'cancelButtonProps'
    | 'mask'
  >

export type StepsConfig = ComponentStyleConfig & Pick<StepsProps, 'classes' | 'styles'>

export type ImageConfig = ComponentStyleConfig
  & Pick<ImageProps, 'classes' | 'styles'> & {
    preview?: Partial<Record<'closeIcon', any>>
      & Pick<ImageProps, 'classes' | 'styles'> & { mask?: MaskType }
    fallback?: string
  }

export type TreeConfig = ComponentStyleConfig & Pick<TreeProps, 'classes' | 'styles'>

export type TreeSelectConfig = ComponentStyleConfig
  & Pick<TreeSelectProps, 'variant' | 'classes' | 'styles' | 'switcherIcon'>

export type UploadConfig = ComponentStyleConfig
  & Pick<UploadProps, 'classes' | 'styles' | 'customRequest'>

export type DatePickerConfig = ComponentStyleConfig
  & Pick<DatePickerProps, 'classes' | 'styles' | 'variant'>

export type RangePickerConfig = ComponentStyleConfig
  & Pick<RangePickerProps, 'classes' | 'styles' | 'variant'>

export type TimePickerConfig = ComponentStyleConfig
  & Pick<TimePickerProps, 'classes' | 'styles' | 'variant'>

export interface TableConfig<RecordType extends AnyObject = AnyObject>
  extends ComponentStyleConfig {
  expandable?: {
    expandIcon?: NonNullable<TableProps['expandable']>['expandIcon']
  }
  rowKey?: TableProps<RecordType>['rowKey']
  classes?: TableProps['classes']
  styles?: TableProps['styles']
  bodyCell?: TableProps['bodyCell']
  headerCell?: TableProps['headerCell']
}
export interface ConfigComponentProps {
  input?: InputConfig
  inputNumber?: InputNumberConfig
  textArea?: TextAreaConfig
  mentions?: MentionsConfig
  pagination?: PaginationConfig
  inputSearch?: InputSearchConfig
  otp?: OTPConfig
  space?: SpaceConfig
  splitter?: ComponentStyleConfig
  form?: FormConfig
  select?: SelectConfig
  alert?: AlertConfig
  anchor?: AnchorStyleConfig
  button?: ButtonConfig
  divider?: DividerConfig
  drawer?: DrawerConfig
  calendar?: ComponentStyleConfig
  carousel?: ComponentStyleConfig
  cascader?: CascaderConfig
  treeSelect?: TreeSelectConfig
  collapse?: CollapseConfig
  floatButton?: FloatButtonConfig
  floatButtonGroup?: FloatButtonGroupConfig
  typography?: TypographyConfig
  skeleton?: SkeletonConfig
  spin?: SpinConfig
  segmented?: SegmentedConfig
  steps?: StepsConfig
  statistic?: StatisticConfig
  image?: ImageConfig
  layout?: ComponentStyleConfig
  // list?: ListConfig;
  modal?: ModalConfig
  progress?: ComponentStyleConfig
  result?: ResultConfig
  slider?: SliderConfig
  breadcrumb?: BreadcrumbConfig
  masonry?: MasonryConfig
  menu?: MenuConfig
  checkbox?: CheckboxConfig
  descriptions?: DescriptionsConfig
  empty?: EmptyConfig
  badge?: BadgeConfig
  radio?: RadioConfig
  rate?: ComponentStyleConfig
  switch?: SwitchStyleConfig
  transfer?: TransferConfig
  avatar?: ComponentStyleConfig
  message?: ComponentStyleConfig
  tag?: TagConfig
  table?: TableConfig
  card?: CardConfig
  cardMeta?: CardMetaConfig
  tabs?: TabsConfig
  timeline?: ComponentStyleConfig
  timePicker?: TimePickerConfig
  tour?: TourConfig
  tooltip?: TooltipConfig
  popover?: PopoverConfig
  popconfirm?: PopconfirmConfig
  upload?: UploadConfig
  notification?: NotificationConfig
  tree?: TreeConfig
  colorPicker?: ComponentStyleConfig
  datePicker?: DatePickerConfig
  rangePicker?: RangePickerConfig
  dropdown?: ComponentStyleConfig
  flex?: FlexConfig
  qrcode?: QRcodeConfig
  wave?: WaveConfig
}

export interface ConfigConsumerProps extends ConfigComponentProps {
  getTargetContainer?: () => HTMLElement
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement
  rootPrefixCls?: string
  iconPrefixCls: string
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string
  renderEmpty?: RenderEmptyHandler
  transformCellText?: ConfigProviderProps['transformCellText']
  /**
   * @descCN 设置 [Content Security Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP) 配置。
   * @descEN Set the [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) config.
   */
  csp?: CSPConfig
  /** @deprecated Please use `{ button: { autoInsertSpace: boolean }}` instead */
  autoInsertSpaceInButton?: boolean
  variant?: Variant
  virtual?: boolean
  locale?: Locale
  direction?: DirectionType
  popupMatchSelectWidth?: boolean
  popupOverflow?: PopupOverflow
  theme?: ThemeConfig
  warning?: WarningContextProps
  wave?: WaveConfig
}

const ConfigConsumerKey: InjectionKey<Ref<ConfigConsumerProps>> = Symbol('ConfigConsumerContext')

export function useConfigProvider(props: Ref<ConfigConsumerProps>) {
  provide(ConfigConsumerKey, props)
}

function defaultGetPrefixCls(suffixCls?: string, customizePrefixCls?: string) {
  if (customizePrefixCls) {
    return customizePrefixCls
  }
  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls
}

export function useConfig() {
  return inject(ConfigConsumerKey, ref({
    // We provide a default function for Context without provider
    getPrefixCls: defaultGetPrefixCls,
    iconPrefixCls: defaultIconPrefixCls,
  }) as Ref<ConfigConsumerProps>)
}

/**
 * Utility type to convert ConfigConsumerProps to a reactive refs structure.
 * Functions remain as-is, other values are wrapped in Ref.
 */
export type ConfigRefs<R extends ConfigConsumerProps = ConfigConsumerProps> = {
  [K in keyof R]?: R[K] extends (...args: any[]) => any
    ? R[K]
    : R[K] extends object | undefined
      ? Ref<R[K]>
      : Ref<R[K]>
}

export function useBaseConfig<K extends string>(suffixCls?: K, props?: ComponentBaseProps) {
  const config = useConfig()
  return {
    result: computed(() => config.value?.result),
    modal: computed(() => config.value?.modal),
    timeline: computed(() => config.value?.timeline),
    notification: computed(() => config.value?.notification),
    getPrefixCls: (suffixCls?: string, prefixCls?: string) => config.value?.getPrefixCls(suffixCls, prefixCls),
    prefixCls: computed(() => {
      return config.value?.getPrefixCls(suffixCls, props?.prefixCls)
    }),
    direction: computed(() => {
      return config.value?.direction
    }),
    getPopupContainer: config?.value.getPopupContainer,
  }
}

/**
 * Get ConfigProvider configured component props.
 * This help to reduce bundle size for saving `?.` operator.
 * Do not use as `useMemo` deps since we do not cache the object here.
 *
 * NOTE: not refactor this with `useMemo` since memo will cost another memory space,
 * which will waste both compare calculation & memory.
 */
export function useComponentConfig<T extends keyof ConfigComponentProps>(propName: T) {
  const context = useConfig()
  return computed(() => {
    const { getPrefixCls, direction, getPopupContainer } = context.value
    const propValue: ConfigConsumerProps[T] = context.value[propName]

    return {
      classes: EMPTY_OBJECT,
      styles: EMPTY_OBJECT,
      ...propValue,
      getPrefixCls,
      direction,
      getPopupContainer,
    } as ComponentReturnType<T>
  })
}

export function useComponentBaseConfig<
  T extends keyof ConfigComponentProps,
  K extends keyof NonNullable<ConfigComponentProps[T]> = keyof NonNullable<ConfigComponentProps[T]>,
>(propName: T, props?: ComponentBaseProps, keys?: readonly K[], suffixCls?: string) {
  const context = useConfig()
  const propValue = computed(() => {
    return context.value[propName] as { classes?: any, styles?: any } & ConfigComponentProps[T]
  })
  const toRefs = <TValue>(propValues: Ref<TValue>) => {
    const result: any = {
      classes: computed(() => EMPTY_OBJECT),
      styles: computed(() => EMPTY_OBJECT),
      class: computed(() => undefined),
      style: computed(() => undefined),
    }
    const __keys = Object.keys(result)
    for (const key in propValues.value) {
      if (__keys.includes(key)) {
        result[key] = computed(() => propValues.value[key] ?? EMPTY_OBJECT)
      }
      else {
        result[key] = computed(() => propValues.value[key])
      }
    }
    if (keys && keys.length) {
      keys.forEach((key) => {
        if (!result[key]) {
          result[key] = computed(() => propValues.value?.[key])
        }
      })
    }
    return result as { [Key in keyof TValue]-?: Ref<TValue[Key]> }
  }
  const refsData = toRefs(propValue)
  return {
    ...refsData,
    direction: computed(() => context.value.direction),
    prefixCls: computed(() => {
      return context.value?.getPrefixCls(suffixCls ?? propName, props?.prefixCls)
    }),
    rootPrefixCls: computed(() => context.value?.getPrefixCls()),
    getPopupContainer: context.value.getPopupContainer,
    getPrefixCls: context.value.getPrefixCls,
    getTargetContainer: context.value.getTargetContainer,
    virtual: computed(() => context.value.virtual),
    renderEmpty: computed(() => context.value.renderEmpty),
    popupMatchSelectWidth: computed(() => context.value.popupMatchSelectWidth),
    popupOverflow: computed(() => context.value.popupOverflow),
  }
}
