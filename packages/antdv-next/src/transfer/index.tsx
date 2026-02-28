import type { App } from 'vue'
import type { InternalTransferProps } from './Transfer'
import Actions from './Actions'
import Search from './search'
import Section from './Section'
import Transfer from './Transfer'

export type { TransferOperationProps } from './Actions'
export type {
  KeyWise,
  KeyWiseTransferItem,
  ListStyle,
  PaginationType,
  RenderResult,
  RenderResultObject,
  SelectAllLabel,
  TransferClassNamesType,
  TransferCustomListBodyProps,
  TransferDirection,
  TransferEmits,
  TransferItem,
  TransferKey,
  TransferListBodyProps,
  TransferListProps,
  TransferLocale,
  TransferRender,
  TransferSearchOption,
  TransferSlots,
  TransferStylesType,
} from './interface'
export type { TransferSearchEmits, TransferSearchProps, TransferSearchSlots } from './search'
export type TransferProps = InternalTransferProps

const InternalTransfer = Transfer as typeof Transfer & {
  install: (app: App) => void
  List: typeof Section
  Search: typeof Search
  Operation: typeof Actions
}

InternalTransfer.List = Section
InternalTransfer.Search = Search
InternalTransfer.Operation = Actions

InternalTransfer.install = (app: App) => {
  app.component(Transfer.name, Transfer)
  app.component(Section.name, Section)
  app.component(Search.name, Search)
  app.component(Actions.name, Actions)
  return app
}

export default InternalTransfer
