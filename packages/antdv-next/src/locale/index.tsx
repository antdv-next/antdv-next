import type { InjectionKey, Ref } from 'vue'
import type { PickerLocale as DatePickerLocale } from '../date-picker'
import type { TransferLocale as TransferLocaleForEmpty } from '../empty'
import type { ValidateMessages } from '../form/types.ts'
import type { ModalLocale } from '../modal/interface.ts'
import type { PaginationLocale } from '../pagination'
import type { PopconfirmLocale } from '../popconfirm/PurePanel'
import type { TableLocale } from '../table'
import type { TimePickerLocale } from '../time-picker'
import type { TourLocale } from '../tour'
import type { TransferLocale } from '../transfer'
import type { UploadLocale } from '../upload/interface.ts'
import { computed, defineComponent, inject, provide, ref } from 'vue'

export type LocaleContextProps = Locale & { exist?: boolean }

export interface LocaleContext {
  locale: Ref<LocaleContextProps>
}

const LocaleContextKey: InjectionKey<LocaleContext> = Symbol('LocaleContext')
export const ANT_MARK = 'internalMark'
export interface LocaleProviderProps {
  locale: Locale
  /** @internal */
  _ANT_MARK__?: string
}
export interface Locale {
  locale: string
  Pagination?: PaginationLocale
  DatePicker?: DatePickerLocale
  TimePicker?: TimePickerLocale
  Calendar?: DatePickerLocale
  Table?: TableLocale
  Modal?: ModalLocale
  Tour?: TourLocale
  Popconfirm?: PopconfirmLocale
  Transfer?: TransferLocale
  Select?: Record<string, any>
  Upload?: UploadLocale
  Empty?: TransferLocaleForEmpty
  global?: {
    placeholder?: string
    close?: string
    sortable?: string
  }
  Icon?: Record<string, any>
  Text?: {
    edit?: any
    copy?: any
    copied?: any
    expand?: any
    collapse?: any
  }
  Form?: {
    optional?: string
    defaultValidateMessages: ValidateMessages
  }
  Image?: {
    preview: string
  }
  QRCode?: {
    expired?: string
    refresh?: string
    scanned?: string
  }
  Carousel?: {
    prevSlide: string
    nextSlide: string
  }
  ColorPicker?: {
    presetEmpty: string
    transparent: string
    singleColor: string
    gradientColor: string
  }
}
export function useLocaleProvider(props: LocaleContext) {
  provide(LocaleContextKey, props)
}

export const LocaleProvider = defineComponent<LocaleProviderProps>(
  (props, { slots }) => {
    const locale = computed<LocaleContextProps>(() => ({ ...props.locale, exist: true }))
    useLocaleProvider({ locale })
    return () => {
      return slots?.default?.()
    }
  },
  {
    name: 'LocaleProvider',
  },
)

export function useLocaleContext() {
  return inject(LocaleContextKey, { locale: ref(undefined) } as unknown as LocaleContext)
}
