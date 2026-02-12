import { describe, expect, it } from 'vitest'
import Transfer from '..'
import { mount } from '/@tests/utils'

describe('transfer.Semantic', () => {
  it('semantic structure', () => {
    const mockData = Array.from({ length: 20 }).map((_, index) => ({
      key: index,
      title: `content ${index + 1}`,
    }))

    const classes = {
      root: 'custom-root',
      section: 'custom-section',
      header: 'custom-header',
      title: 'custom-title',
      body: 'custom-body',
      list: 'custom-list',
      item: 'custom-item',
      itemIcon: 'custom-item-icon',
      itemContent: 'custom-item-content',
      footer: 'custom-footer',
      actions: 'custom-actions',
    }

    const semanticStructure: Record<string, [selector: string, count: number]> = {
      root: ['.ant-transfer', 1],
      section: ['.ant-transfer-section', 2],
      header: ['.ant-transfer-list-header', 2],
      title: ['.ant-transfer-list-header-title', 2],
      body: ['.ant-transfer-list-body', 2],
      list: ['.ant-transfer-list-content', 2],
      item: ['.ant-transfer-list-content-item', mockData.length],
      itemIcon: ['.ant-transfer-checkbox', mockData.length],
      itemContent: ['.ant-transfer-list-content-item-text', mockData.length],
      footer: ['.ant-transfer-list-footer', 2],
      actions: ['.ant-transfer-actions', 1],
    }

    const styles = {
      root: { backgroundColor: 'rgb(255, 0, 0)' },
      section: { backgroundColor: 'rgb(0, 0, 255)' },
      header: { backgroundColor: 'rgb(0, 128, 0)' },
      title: { backgroundColor: 'rgb(128, 128, 128)' },
      body: { backgroundColor: 'rgb(255, 255, 0)' },
      list: { backgroundColor: 'rgb(128, 0, 128)' },
      item: { backgroundColor: 'rgb(255, 165, 0)' },
      itemIcon: { backgroundColor: 'rgb(173, 216, 230)' },
      itemContent: { backgroundColor: 'rgb(144, 238, 144)' },
      footer: { backgroundColor: 'rgb(255, 192, 203)' },
      actions: { backgroundColor: 'rgb(255, 0, 0)' },
    }

    const wrapper = mount(Transfer, {
      props: {
        showSearch: true,
        dataSource: mockData,
        selectedKeys: [],
        targetKeys: [3, 9],
        render: item => item.title,
        classes,
        styles,
        footer: () => <div style={{ padding: '8px' }}>Custom Footer</div>,
      },
    })

    Object.keys(classes).forEach((key) => {
      const className = classes[key as keyof typeof classes]
      const elementList = wrapper.findAll(`.${className}`)
      expect(elementList.length).toBeGreaterThan(0)
      expect(elementList[0]?.element).toHaveStyle(styles[key as keyof typeof styles])

      const structureInfo = semanticStructure[key]
      expect(elementList).toHaveLength(structureInfo![1])
    })
  })
})
