import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Modal from '..'
import { mount } from '/@tests/utils'

const PurePanel = (Modal as any)._InternalPanelDoNotUseOrYouWillBeFired

describe('modal pure panel', () => {
  it('passes originNode and extra buttons to footer slot', () => {
    const wrapper = mount(() => (
      <PurePanel title="Title">
        {{
          default: () => 'Content',
          footer: ({ originNode, extra: { OkBtn, CancelBtn } }: any) => (
            <div>
              <div class="origin">{h(originNode)}</div>
              <div class="extra">
                <CancelBtn />
                <button class="custom-btn">Custom</button>
                <OkBtn />
              </div>
            </div>
          ),
        }}
      </PurePanel>
    ))

    expect(wrapper.findAll('.origin .ant-btn')).toHaveLength(2)
    const extraBtns = wrapper.findAll('.extra button')
    expect(extraBtns).toHaveLength(3)
    expect(extraBtns[0]!.text()).toBe('Cancel')
    expect(extraBtns[1]!.text()).toBe('Custom')
    expect(extraBtns[2]!.text()).toBe('OK')
  })

  it('passes originNode and extra buttons to footer prop function', () => {
    const wrapper = mount(PurePanel, {
      props: {
        title: 'Title',
        footer: ({ originNode, extra: { OkBtn } }: any) => [originNode, h('span', { class: 'extra' }, [h(OkBtn)])],
      },
    })

    expect(wrapper.findAll('.ant-modal-footer .ant-btn')).toHaveLength(3)
    expect(wrapper.find('.extra .ant-btn').text()).toBe('OK')
  })

  it('renders default footer and hides it when footer is null', () => {
    const wrapper = mount(PurePanel, { props: { title: 'Title' } })
    expect(wrapper.findAll('.ant-modal-footer .ant-btn')).toHaveLength(2)

    const noFooter = mount(PurePanel, { props: { title: 'Title', footer: null } })
    expect(noFooter.find('.ant-modal-footer').exists()).toBe(false)
  })
})
