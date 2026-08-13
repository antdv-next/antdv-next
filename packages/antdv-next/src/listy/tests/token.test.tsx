import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import Listy from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

const { mockItemHeights } = vi.hoisted(() => ({ mockItemHeights: [] as number[] }))

vi.mock('@v-c/listy', async () => {
  const actual = await vi.importActual<any>('@v-c/listy')
  return {
    ...actual,
    default: defineComponent({
      name: 'ItemHeightSpy',
      inheritAttrs: false,
      setup(_props, { attrs, slots }) {
        return () => {
          mockItemHeights.push((attrs as any).itemHeight)
          return h(actual.default, attrs, slots)
        }
      },
    }),
  }
})

const items = [{ id: 1 }]

function renderListy() {
  return (
    <Listy
      height={200}
      items={items}
      rowKey={(item: any) => item.id}
      itemRender={(item: any) => String(item.id)}
    />
  )
}

describe('listy token', () => {
  beforeEach(() => {
    mockItemHeights.length = 0
  })

  it('derives the itemHeight estimate from fontHeight and the Listy component token', () => {
    mount(() => renderListy())
    const defaultItemHeight = mockItemHeights[0]!

    expect(defaultItemHeight).toBeGreaterThan(0)

    // `lineWidth` is not part of the estimate
    mockItemHeights.length = 0
    mount(() => (
      <ConfigProvider theme={{ token: { lineWidth: 5 } }}>
        {renderListy()}
      </ConfigProvider>
    ))
    expect(mockItemHeights[0]).toBe(defaultItemHeight)

    // Default itemPaddingBlock is paddingSM (12): the estimate grows by (20 - 12) * 2
    mockItemHeights.length = 0
    mount(() => (
      <ConfigProvider theme={{ components: { Listy: { itemPaddingBlock: 20 } } }}>
        {renderListy()}
      </ConfigProvider>
    ))
    expect(mockItemHeights[0]).toBe(defaultItemHeight + 16)
  })
})
