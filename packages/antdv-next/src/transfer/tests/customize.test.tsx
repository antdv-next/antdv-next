import type { TransferProps } from '..'
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'
import Transfer from '..'
import { mount } from '/@tests/utils'

describe('transfer.Customize', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  afterEach(() => {
    errorSpy.mockReset()
  })

  afterAll(() => {
    errorSpy.mockRestore()
  })

  it('props#body does not work anymore', () => {
    const body = vi.fn()
    const props = { body } as TransferProps<any>

    mount(Transfer, {
      props,
    })

    expect(errorSpy).not.toHaveBeenCalled()
    expect(body).not.toHaveBeenCalled()
  })

  describe('deprecated function', () => {
    const dataSource: Array<Record<'key', string>> = []
    for (let i = 0; i < 10; i += 1) {
      dataSource.push({ key: i.toString() })
    }

    const commonProps = {
      dataSource,
      selectedKeys: ['1'],
      targetKeys: ['2'],
    }

    it('should not exist in render props', () => {
      mount({
        render: () => (
          <Transfer {...commonProps}>
            {{
              default: (slotProps: Record<string, unknown>) => {
                expect('handleFilter' in slotProps).toBeFalsy()
                expect('handleSelect' in slotProps).toBeFalsy()
                expect('handleSelectAll' in slotProps).toBeFalsy()
                expect('handleClear' in slotProps).toBeFalsy()
                expect('body' in slotProps).toBeFalsy()
                expect('checkedKeys' in slotProps).toBeFalsy()
                return null
              },
            }}
          </Transfer>
        ),
      })
    })
  })

  it('warning if use `pagination`', () => {
    mount({
      render: () => (
        <Transfer dataSource={[]} pagination>
          {{
            default: () => null,
          }}
        </Transfer>
      ),
    })

    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antd: Transfer] `pagination` not support customize render list.',
    )
  })
})
