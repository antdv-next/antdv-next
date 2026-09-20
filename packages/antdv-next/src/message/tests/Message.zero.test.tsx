import { describe, expect, it } from 'vitest'
import { resolveMessageIcon } from '../PurePanel'

// https://github.com/ant-design/ant-design/pull/59153
describe('message numeric zero icon', () => {
  it('keeps `0` as a custom icon', () => {
    expect(resolveMessageIcon('ant-message', 0, 'info')).toBe(0)
  })

  it('falls back to the type icon for non-renderable values', () => {
    expect(resolveMessageIcon('ant-message', '', 'info')).not.toBe('')
    expect(resolveMessageIcon('ant-message', false, 'info')).not.toBe(false)
    expect(resolveMessageIcon('ant-message', undefined, undefined)).toBeNull()
  })
})
