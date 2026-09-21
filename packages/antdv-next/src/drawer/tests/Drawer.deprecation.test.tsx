import { describe, expect, it, vi } from 'vitest'
import Drawer from '..'
import { resetWarned } from '../../_util/warning'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59299
describe('drawer deprecation warnings', () => {
  it('warns about destroyOnClose instead of the non-existent destroyInactivePanel', () => {
    resetWarned()
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    mount({
      render: () => <Drawer open destroyOnClose />,
    }, { attachTo: document.body })

    expect(errSpy).toHaveBeenCalledWith(
      expect.stringContaining('`destroyOnClose` is deprecated. Please use `destroyOnHidden` instead.'),
    )
    errSpy.mockRestore()
  })
})
