import { EXPAND_COLUMN } from '@v-c/table'
import { describe, expect, it } from 'vitest'
import { computed, ref } from 'vue'
import useFilledColumns from '../hooks/useFilledColumns'
import { SELECTION_COLUMN } from '../hooks/useSelection'

describe('useFilledColumns', () => {
  it('returns the original columns when no column default is supplied', () => {
    const columns = computed(() => [{ title: 'Name', dataIndex: 'name' }])
    const column = computed(() => undefined)
    const filled = useFilledColumns(columns as any, column as any)
    expect(filled.value).toBe(columns.value)
  })

  it('fills default props into leaf columns', () => {
    const columns = computed(() => [
      { title: 'Name', dataIndex: 'name' },
      { title: 'Age', dataIndex: 'age', align: 'right' as const },
    ])
    const column = computed(() => ({ align: 'center' as const, ellipsis: true }))
    const filled = useFilledColumns(columns as any, column as any)

    // Defaults flow into the first column.
    expect(filled.value[0]).toMatchObject({ align: 'center', ellipsis: true, title: 'Name' })
    // Per-column props win over the default.
    expect(filled.value[1]).toMatchObject({ align: 'right', ellipsis: true, title: 'Age' })
  })

  it('recurses into column groups and never injects column.children into leaves', () => {
    const columns = computed(() => [
      {
        title: 'Group',
        children: [
          { title: 'Inner', dataIndex: 'inner' },
        ],
      },
    ])
    const column = computed(() => ({
      align: 'center' as const,
      // Should be stripped before merging into leaves.
      children: [{ title: 'should not appear' }] as any,
    }))
    const filled = useFilledColumns(columns as any, column as any) as any

    const group = filled.value[0]
    expect(group.title).toBe('Group')
    expect(group.children).toHaveLength(1)
    expect(group.children[0]).toMatchObject({ title: 'Inner', align: 'center' })
    expect(group.children[0].children).toBeUndefined()
  })

  it('skips SELECTION_COLUMN and EXPAND_COLUMN sentinels', () => {
    const columns = computed(() => [
      SELECTION_COLUMN,
      EXPAND_COLUMN,
      { title: 'Other' },
    ])
    const column = computed(() => ({ width: 100 }))
    const filled = useFilledColumns(columns as any, column as any) as any

    expect(filled.value[0]).toBe(SELECTION_COLUMN)
    expect(filled.value[1]).toBe(EXPAND_COLUMN)
    expect(filled.value[2]).toMatchObject({ title: 'Other', width: 100 })
  })

  it('reacts when column default changes', () => {
    const columns = computed(() => [{ title: 'X' }])
    const column = ref<any>({ align: 'left' as const })
    const filled = useFilledColumns(columns as any, column as any) as any
    expect(filled.value[0].align).toBe('left')

    column.value = { align: 'right' as const }
    expect(filled.value[0].align).toBe('right')

    column.value = undefined
    expect(filled.value).toBe(columns.value)
  })
})
