import type { AnyObject } from '../_util/type'
import type { SizeType } from '../config-provider/SizeContext'
import type {
  ColumnTitle,
  ColumnTitleProps,
  ColumnType,
  Key,
  TablePaginationPlacement,
  TablePaginationPosition,
} from './interface'

export function getColumnKey<RecordType extends AnyObject = AnyObject>(column: ColumnType<RecordType>, defaultKey: string): Key {
  if ('key' in column && column.key !== undefined && column.key !== null) {
    return column.key as Key
  }
  if (column.dataIndex) {
    return Array.isArray(column.dataIndex)
      ? (column.dataIndex.join('.') as Key)
      : (column.dataIndex as Key)
  }
  return defaultKey
}

export function getColumnPos(index: number, pos?: string) {
  return pos ? `${pos}-${index}` : `${index}`
}

export function renderColumnTitle<RecordType extends AnyObject = AnyObject>(title: ColumnTitle<RecordType>, props: ColumnTitleProps<RecordType>) {
  if (typeof title === 'function') {
    return title(props)
  }
  return title
}

/**
 * Safe get column title
 *
 * Should filter [object Object]
 */
export function safeColumnTitle<RecordType extends AnyObject = AnyObject>(title: ColumnTitle<RecordType>, props: ColumnTitleProps<RecordType>) {
  const res = renderColumnTitle<RecordType>(title, props)
  if (Object.prototype.toString.call(res) === '[object Object]') {
    return ''
  }
  return res
}

export function normalizePlacement(pos: TablePaginationPlacement | TablePaginationPosition) {
  const lowerPos = pos.toLowerCase()
  if (lowerPos.includes('center')) {
    return 'center'
  }
  return lowerPos.includes('left') || lowerPos.includes('start') ? 'start' : 'end'
}

export function getPaginationSize(paginationSize: SizeType, mergedSize: SizeType): SizeType {
  if (paginationSize) {
    return paginationSize
  }
  if (mergedSize === 'small' || mergedSize === 'middle' || mergedSize === 'medium') {
    return 'small'
  }
  return undefined
}
