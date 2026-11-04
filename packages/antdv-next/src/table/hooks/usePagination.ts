import type { Ref } from 'vue'
import type { PaginationEmits, PaginationOnChangeInfo } from '../../pagination'
import type { TablePaginationConfig } from '../interface.ts'
import { computed, shallowRef, unref } from 'vue'
import extendsObject from '../../_util/extendsObject.ts'

export const DEFAULT_PAGE_SIZE = 10

export function getPaginationParam(
  mergedPagination: TablePaginationConfig,
  pagination?: TablePaginationConfig | boolean,
) {
  const param: any = {
    current: mergedPagination.current,
    pageSize: mergedPagination.pageSize,
  }

  const paginationObj = pagination && typeof pagination === 'object' ? pagination : {}

  Object.keys(paginationObj).forEach((pageProp) => {
    const value = (mergedPagination as any)[pageProp]

    if (typeof value !== 'function') {
      param[pageProp] = value
    }
  })

  return param
}

type MaybeRef<T> = T | Ref<T>

export default function usePagination(
  total: MaybeRef<number>,
  onChange: (current: number, pageSize: number, info?: PaginationOnChangeInfo) => void,
  pagination?: MaybeRef<TablePaginationConfig | false>,
) {
  const paginationRef = computed(() => unref(pagination))
  const totalRef = computed(() => unref(total))
  const paginationObj = computed(() =>
    paginationRef.value && typeof paginationRef.value === 'object' ? paginationRef.value : {},
  )
  const paginationTotal = computed(() => (paginationObj.value as any)?.total ?? 0)

  const innerPagination = shallowRef<{ current?: number, pageSize?: number }>({
    current: 'defaultCurrent' in paginationObj.value ? (paginationObj.value as any).defaultCurrent : 1,
    pageSize: 'defaultPageSize' in paginationObj.value ? (paginationObj.value as any).defaultPageSize : DEFAULT_PAGE_SIZE,
  })

  const mergedPagination = computed<TablePaginationConfig>(() => {
    if (paginationRef.value === false) {
      return {} as TablePaginationConfig
    }

    const merged = extendsObject(innerPagination.value, paginationObj.value, {
      total: paginationTotal.value > 0 ? paginationTotal.value : totalRef.value,
    }) as TablePaginationConfig
    const maxPage = Math.ceil(((paginationTotal.value || totalRef.value) || 0) / (merged.pageSize || DEFAULT_PAGE_SIZE))
    if (merged.current && merged.current > maxPage) {
      merged.current = maxPage || 1
    }
    return merged
  })

  const refreshPagination = (current?: number, pageSize?: number) => {
    if (paginationRef.value === false) {
      return
    }
    innerPagination.value = {
      current: current ?? 1,
      pageSize: pageSize || mergedPagination.value.pageSize,
    }
  }

  const onInternalChange: PaginationEmits['change'] = (current, pageSize, info) => {
    if (paginationRef.value && typeof paginationRef.value === 'object') {
      if (info) {
        ;(paginationRef.value as any).onChange?.(current, pageSize, info)
      }
      else {
        ;(paginationRef.value as any).onChange?.(current, pageSize)
      }
    }
    refreshPagination(current, pageSize)
    const mergedPageSize = pageSize || mergedPagination.value.pageSize || DEFAULT_PAGE_SIZE
    if (info) {
      onChange(current, mergedPageSize, info)
    }
    else {
      onChange(current, mergedPageSize)
    }
  }

  const mergedPaginationConfig = computed<TablePaginationConfig>(() => {
    if (paginationRef.value === false) {
      return {} as TablePaginationConfig
    }
    return {
      ...mergedPagination.value,
      onChange: onInternalChange,
    } as TablePaginationConfig
  })

  return [mergedPaginationConfig, refreshPagination] as const
}
