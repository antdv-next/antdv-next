import type { Ref } from 'vue'
import type { AnyObject } from '../../_util/type.ts'
import type { GetRowKey, Key } from '../interface.ts'
import { shallowRef, unref } from 'vue'

interface MapCache<RecordType = AnyObject> {
  data?: readonly RecordType[]
  childrenColumnName?: string
  kvMap?: Map<Key, RecordType>
  getRowKey?: (record: RecordType, index: number) => Key
}

export default function useLazyKVMap<RecordType extends AnyObject = AnyObject>(
  data: readonly RecordType[] | Ref<RecordType[]>,
  childrenColumnName: string | Ref<string>,
  getRowKey: GetRowKey<RecordType> | Ref<GetRowKey<RecordType>>,
) {
  const mapCacheRef = shallowRef<MapCache<RecordType>>({})

  function getRecordByKey(key: Key): RecordType {
    const mergedData = unref(data)
    const mergedChildrenColumnName = unref(childrenColumnName)
    const mergedGetRowKey = unref(getRowKey)
    if (
      mapCacheRef.value.data !== mergedData
      || mapCacheRef.value.childrenColumnName !== mergedChildrenColumnName
      || mapCacheRef.value.getRowKey !== mergedGetRowKey
    ) {
      const kvMap = new Map<Key, RecordType>()

      function dig(records: readonly RecordType[]) {
        records.forEach((record, index) => {
          const rowKey = mergedGetRowKey(record, index)
          kvMap.set(rowKey, record)

          if (record && typeof record === 'object' && mergedChildrenColumnName in (record as any)) {
            dig((record as any)[mergedChildrenColumnName] || [])
          }
        })
      }

      dig(mergedData)

      mapCacheRef.value = {
        data: mergedData,
        childrenColumnName: mergedChildrenColumnName,
        kvMap,
        getRowKey: mergedGetRowKey,
      }
    }

    return mapCacheRef.value.kvMap?.get(key) as RecordType
  }

  return [getRecordByKey] as const
}
