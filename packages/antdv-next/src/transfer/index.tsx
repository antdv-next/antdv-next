import type { App, PublicProps } from 'vue'
import type { TransferEmits, TransferSlots } from './interface'
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
export type TransferProps<RecordType = any> = InternalTransferProps<RecordType>

interface TransferInstance<RecordType = any> {
  $props: InternalTransferProps<RecordType> & PublicProps
  $emit: {
    (event: 'change', ...args: Parameters<TransferEmits['change']>): void
    (event: 'selectChange', ...args: Parameters<TransferEmits['selectChange']>): void
    (event: 'search', ...args: Parameters<TransferEmits['search']>): void
    (event: 'scroll', ...args: Parameters<TransferEmits['scroll']>): void
    (event: 'update:targetKeys', ...args: Parameters<TransferEmits['update:targetKeys']>): void
    (event: 'update:selectedKeys', ...args: Parameters<TransferEmits['update:selectedKeys']>): void
  }
  $slots: TransferSlots<RecordType>
}

export interface TransferConstructor {
  new<RecordType = any>(props: InternalTransferProps<RecordType>): TransferInstance<RecordType>
  /**
   * Non-generic fallback signature. TypeScript infers from the last overload,
   * so this keeps render-function usage like `h(Transfer, props)` resolvable
   * against Vue's `Constructor<P>` overload of `h` (see #634), while the
   * generic signature above still drives template/Volar inference.
   */
  new (props: InternalTransferProps<any>): TransferInstance<any>
  install: (app: App) => void
  List: typeof Section
  Search: typeof Search
  Operation: typeof Actions
}

const InternalTransfer = Transfer as unknown as TransferConstructor

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
