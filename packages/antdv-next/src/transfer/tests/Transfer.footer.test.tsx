import type { TransferDirection } from '../interface'
import { describe, expect, it, vi } from 'vitest'
import Transfer from '..'
import { mount } from '/@tests/utils'

const dataSource = [
  { key: 'a', title: 'a' },
  { key: 'b', title: 'b' },
]

// https://github.com/ant-design/ant-design/pull/59303
describe('transfer footer direction', () => {
  it('passes direction to a single-argument footer callback', () => {
    const directions: (TransferDirection | undefined)[] = []
    const footer = vi.fn((_props: any, info?: { direction: TransferDirection }) => {
      directions.push(info?.direction)
      return info?.direction
    })

    const wrapper = mount({
      render: () => <Transfer dataSource={dataSource} targetKeys={['b']} footer={footer} />,
    })

    expect(directions).toEqual(['left', 'right'])
    const footers = wrapper.findAll('.ant-transfer-list-footer')
    expect(footers).toHaveLength(2)
    expect(footers[0].text()).toBe('left')
    expect(footers[1].text()).toBe('right')
  })

  it('passes direction through the footer slot', () => {
    const wrapper = mount({
      render: () => (
        <Transfer
          dataSource={dataSource}
          targetKeys={['b']}
          v-slots={{
            footer: ({ info }: { info?: { direction: TransferDirection } }) => info?.direction,
          }}
        />
      ),
    })

    const footers = wrapper.findAll('.ant-transfer-list-footer')
    expect(footers.map(f => f.text())).toEqual(['left', 'right'])
  })
})
