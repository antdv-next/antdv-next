import Breadcrumb, { BreadcrumbItem, BreadcrumbSeparator } from './Breadcrumb'

type CompoundedBreadcrumb = typeof Breadcrumb & {
  Item: typeof BreadcrumbItem
  Separator: typeof BreadcrumbSeparator
}

export type {
  BreadcrumbEmits,
  BreadcrumbItemRenderContext,
  ItemType as BreadcrumbItemType,
  BreadcrumbProps,
  BreadcrumbRef,
  BreadcrumbSlots,
} from './Breadcrumb'
export {
  BreadcrumbItem,
  BreadcrumbSeparator,
}

export default Breadcrumb as CompoundedBreadcrumb

export type { BreadcrumbItemProps, SeparatorType } from './BreadcrumbItem'
