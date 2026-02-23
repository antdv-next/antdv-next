import type { Ref } from 'vue'
import type { TransferKey } from '../interface'
import { computed, ref, unref, watch } from 'vue'

type MaybeRef<T> = T | Ref<T>

const EMPTY_KEYS: TransferKey[] = []

function filterKeys(keys: TransferKey[], dataKeys: Set<TransferKey>) {
  const filteredKeys = keys.filter(key => dataKeys.has(key))
  return keys.length === filteredKeys.length ? keys : filteredKeys
}

function flattenKeys(keys: Set<TransferKey>) {
  return Array.from(keys).join(';')
}

function useSelection<T extends { key: TransferKey }>(
  leftDataSource: MaybeRef<T[]>,
  rightDataSource: MaybeRef<T[]>,
  selectedKeys?: MaybeRef<TransferKey[] | undefined>,
): [
    sourceSelectedKeys: Ref<TransferKey[]>,
    targetSelectedKeys: Ref<TransferKey[]>,
    setSourceSelectedKeys: (srcKeys: TransferKey[]) => void,
    setTargetSelectedKeys: (srcKeys: TransferKey[]) => void,
] {
  const mergedSelectedKeys = ref<TransferKey[]>(unref(selectedKeys) ?? EMPTY_KEYS)

  watch(
    () => unref(selectedKeys),
    (nextKeys) => {
      mergedSelectedKeys.value = nextKeys ?? EMPTY_KEYS
    },
  )

  const leftKeys = computed(() => new Set(unref(leftDataSource).map(src => src?.key)))
  const rightKeys = computed(() => new Set(unref(rightDataSource).map(src => src?.key)))

  const sourceSelectedKeys = computed(() => filterKeys(mergedSelectedKeys.value, leftKeys.value))
  const targetSelectedKeys = computed(() => filterKeys(mergedSelectedKeys.value, rightKeys.value))

  watch(
    () => [flattenKeys(leftKeys.value), flattenKeys(rightKeys.value)],
    () => {
      mergedSelectedKeys.value = [
        ...filterKeys(mergedSelectedKeys.value, leftKeys.value),
        ...filterKeys(mergedSelectedKeys.value, rightKeys.value),
      ]
    },
  )

  const setMergedSelectedKeys = (nextKeys: TransferKey[]) => {
    if (unref(selectedKeys) === undefined) {
      mergedSelectedKeys.value = nextKeys
    }
  }

  const setSourceSelectedKeys = (nextSrcKeys: TransferKey[]) => {
    setMergedSelectedKeys([...nextSrcKeys, ...targetSelectedKeys.value])
  }
  const setTargetSelectedKeys = (nextTargetKeys: TransferKey[]) => {
    setMergedSelectedKeys([...sourceSelectedKeys.value, ...nextTargetKeys])
  }

  return [
    sourceSelectedKeys,
    targetSelectedKeys,
    setSourceSelectedKeys,
    setTargetSelectedKeys,
  ]
}

export default useSelection
