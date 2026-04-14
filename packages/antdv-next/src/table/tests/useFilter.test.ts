import { describe, expect, it, vi } from 'vitest'

import { getFilterData } from '../hooks/useFilter'

const { flattenKeys } = vi.hoisted(() => ({
  flattenKeys: vi.fn((filters?: { value: unknown, children?: any[] }[]) => {
    const keys: unknown[] = []
    ;(filters || []).forEach(({ value, children }) => {
      keys.push(value)
      if (children)
        keys.push(...flattenKeys(children))
    })
    return keys
  }),
}))

vi.mock('../hooks/useFilter/FilterDropdown', () => ({
  default: () => null,
  flattenKeys,
}))

describe('table useFilter', () => {
  it('precomputes flattened filter keys once per filter state', () => {
    flattenKeys.mockClear()

    const filters = [
      {
        text: 'Group',
        value: 'group',
        children: [
          { text: 'One', value: 1 },
          { text: 'Two', value: 2 },
        ],
      },
    ]

    const result = getFilterData(
      [
        { key: '1', value: 1 },
        { key: '2', value: 2 },
        { key: '3', value: 3 },
      ],
      [
        {
          column: {
            filters,
            onFilter: (value, record) => record.value === value,
          },
          key: 'value',
          filteredKeys: [1, 2],
        },
      ],
      'children',
    )

    expect(result).toHaveLength(2)
    expect(flattenKeys).toHaveBeenCalledTimes(2)
  })
})
