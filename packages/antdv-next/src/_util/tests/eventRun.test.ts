import { describe, expect, it, vi } from 'vitest'
import { runEvents, runSyncEvents } from '../eventRun.ts'

describe('eventRun', () => {
  it('should run single event handler', () => {
    const onClick = vi.fn(() => 'ok')
    const result = runEvents({ onClick }, 'onClick', 1, 2)

    expect(onClick).toHaveBeenCalledWith(1, 2)
    expect(result).toBe('ok')
  })

  it('should run all handlers when event is array', () => {
    const onClick1 = vi.fn(() => 'first')
    const onClick2 = vi.fn(() => 'second')
    const result = runEvents({ onClick: [onClick1, onClick2] }, 'onClick', 'event')

    expect(onClick1).toHaveBeenCalledWith('event')
    expect(onClick2).toHaveBeenCalledWith('event')
    expect(result).toBe('second')
  })

  it('should ignore non-function handlers in array', () => {
    const onClick = vi.fn()
    expect(() => runEvents({ onClick: [onClick, null, undefined, 1] as any }, 'onClick', 'event')).not.toThrow()
    expect(onClick).toHaveBeenCalledWith('event')
  })

  it('should resolve async handlers with runSyncEvents', async () => {
    const onSubmit1 = vi.fn(async (value: number) => value + 1)
    const onSubmit2 = vi.fn((value: number) => value + 2)
    const result = await runSyncEvents({ onSubmit: [onSubmit1, onSubmit2] }, 'onSubmit', 1)

    expect(onSubmit1).toHaveBeenCalledWith(1)
    expect(onSubmit2).toHaveBeenCalledWith(1)
    expect(result).toEqual([2, 3])
  })
})
