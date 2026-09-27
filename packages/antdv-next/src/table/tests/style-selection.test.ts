import { genCalc } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import genSelectionStyle from '../style/selection'

const calc = genCalc('js', new Set<string>())

const mockToken = {
  componentCls: '.ant-table',
  antCls: '.ant',
  iconCls: '.anticon',
  fontSizeIcon: 12,
  padding: 16,
  paddingXS: 8,
  headerIconColor: '#000',
  headerIconHoverColor: '#000',
  tableSelectionColumnWidth: 32,
  tableSelectedRowBg: '#fafafa',
  tableSelectedRowHoverBg: '#f5f5f5',
  tableRowHoverBg: '#f5f5f5',
  tablePaddingHorizontal: 16,
  calc,
  zIndexTableFixed: 2,
  motionDurationSlow: '0.3s',
} as any

describe('table selection style', () => {
  it('raises the fixed selection header above fixed cells', () => {
    const style = genSelectionStyle(mockToken) as Record<string, any>
    const selector = 'table tr th.ant-table-selection-column.ant-table-cell-fix-start'

    expect(style['.ant-table-wrapper'][selector]).toEqual({
      zIndex: 'calc(var(--z-offset, 0) + 2)',
    })
  })
})
