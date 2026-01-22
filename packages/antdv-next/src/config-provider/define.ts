import type { WarningContextProps } from '../_util/warning.ts'
import type { Locale } from '../locale'
import type { ColumnType } from '../table'
import type {
  AlertConfig,
  BadgeConfig,
  ButtonConfig,
  CardConfig,
  CascaderConfig,
  CollapseConfig,
  ComponentStyleConfig,
  CSPConfig,
  DatePickerConfig,
  DirectionType,
  DrawerConfig,
  EmptyConfig,
  FlexConfig,
  FloatButtonConfig,
  FloatButtonGroupConfig,
  ImageConfig,
  InputConfig,
  InputNumberConfig,
  InputSearchConfig,
  MentionsConfig,
  MenuConfig,
  ModalConfig,
  NotificationConfig,
  OTPConfig,
  PaginationConfig,
  PopconfirmConfig,
  PopoverConfig,
  PopupOverflow,
  RangePickerConfig,
  SelectConfig,
  SpaceConfig,
  SpinConfig,
  TableConfig,
  TabsConfig,
  TagConfig,
  TextAreaConfig,
  ThemeConfig,
  TimePickerConfig,
  TooltipConfig,
  TourConfig,
  TransferConfig,
  TreeSelectConfig,
  UploadConfig,
  Variant,
  WaveConfig,
} from './context.ts'
import type { RenderEmptyHandler } from './defaultRenderEmpty'
import type { SizeType } from './SizeContext'

export interface ConfigProviderProps {
  getTargetContainer?: () => HTMLElement | Window
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement
  prefixCls?: string
  iconPrefixCls?: string
  renderEmpty?: RenderEmptyHandler
  transformCellText?: (ctx: { text: any, column: ColumnType<any>, record: Record<string, any>, index: number }) => any
  csp?: CSPConfig
  variant?: Variant
  input?: InputConfig
  inputNumber?: InputNumberConfig
  textArea?: TextAreaConfig
  mentions?: MentionsConfig
  inputSearch?: InputSearchConfig
  otp?: OTPConfig
  select?: SelectConfig
  pagination?: PaginationConfig
  /**
   * @descCN 语言包配置，语言包可到 `antd/locale` 目录下寻找。
   * @descEN Language package setting, you can find the packages in `antd/locale`.
   */
  locale?: Locale
  componentSize?: SizeType
  componentDisabled?: boolean
  /**
   * @descCN 设置布局展示方向。
   * @descEN Set direction of layout.
   * @default ltr
   */
  direction?: DirectionType
  space?: SpaceConfig
  splitter?: ComponentStyleConfig
  /**
   * @descCN 设置 `false` 时关闭虚拟滚动。
   * @descEN Close the virtual scrolling when setting `false`.
   * @default true
   */
  virtual?: boolean
  popupMatchSelectWidth?: boolean
  popupOverflow?: PopupOverflow
  theme?: ThemeConfig
  warning?: WarningContextProps
  alert?: AlertConfig
  anchor?: ComponentStyleConfig
  button?: ButtonConfig
  calendar?: ComponentStyleConfig
  carousel?: ComponentStyleConfig
  cascader?: CascaderConfig
  treeSelect?: TreeSelectConfig
  collapse?: CollapseConfig
  divider?: ComponentStyleConfig
  drawer?: DrawerConfig
  typography?: ComponentStyleConfig
  skeleton?: ComponentStyleConfig
  spin?: SpinConfig
  segmented?: ComponentStyleConfig
  statistic?: ComponentStyleConfig
  steps?: ComponentStyleConfig
  image?: ImageConfig
  layout?: ComponentStyleConfig
  // list?: ListConfig;
  modal?: ModalConfig
  progress?: ComponentStyleConfig
  result?: ComponentStyleConfig
  slider?: ComponentStyleConfig
  breadcrumb?: ComponentStyleConfig
  menu?: MenuConfig
  floatButton?: FloatButtonConfig
  floatButtonGroup?: FloatButtonGroupConfig
  checkbox?: ComponentStyleConfig
  descriptions?: ComponentStyleConfig
  empty?: EmptyConfig
  badge?: BadgeConfig
  radio?: ComponentStyleConfig
  rate?: ComponentStyleConfig
  switch?: ComponentStyleConfig
  transfer?: TransferConfig
  avatar?: ComponentStyleConfig
  message?: ComponentStyleConfig
  tag?: TagConfig
  table?: TableConfig
  card?: CardConfig
  tabs?: TabsConfig
  timeline?: ComponentStyleConfig
  timePicker?: TimePickerConfig
  upload?: UploadConfig
  notification?: NotificationConfig
  tree?: ComponentStyleConfig
  colorPicker?: ComponentStyleConfig
  datePicker?: DatePickerConfig
  rangePicker?: RangePickerConfig
  dropdown?: ComponentStyleConfig
  flex?: FlexConfig
  // /**
  //  * Wave is special component which only patch on the effect of component interaction.
  //  */
  wave?: WaveConfig
  tour?: TourConfig
  tooltip?: TooltipConfig
  popover?: PopoverConfig
  popconfirm?: PopconfirmConfig
}

export interface ConfigProviderSlots {
  renderEmpty?: (componentName?: string) => any
  transformCellText?: (ctx: { text: any, column: ColumnType<any>, record: Record<string, any>, index: number }) => any
  [key: string]: any
}

export interface ConfigProviderEmits {
  [key: string]: any
}
