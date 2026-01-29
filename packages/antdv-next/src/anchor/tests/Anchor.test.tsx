import type { AnchorDirection } from '../Anchor'
import scrollIntoView from 'scroll-into-view-if-needed'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import Anchor from '..'
import { mount, waitFakeTimer } from '../../../../../tests/utils'

vi.mock('scroll-into-view-if-needed', () => ({
  default: vi.fn(),
}))

const scrollIntoViewMock = vi.mocked(scrollIntoView)

function createDiv() {
  const root = document.createElement('div')
  document.body.appendChild(root)
  return root
}

let idCounter = 0
const getHashUrl = () => `Anchor-API-${idCounter++}`

describe('anchor Render', () => {
  const getBoundingClientRectMock = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
  const getClientRectsMock = vi.spyOn(HTMLElement.prototype, 'getClientRects')

  beforeAll(() => {
    getBoundingClientRectMock.mockReturnValue({
      width: 100,
      height: 100,
      top: 1000,
    } as DOMRect)
    getClientRectsMock.mockReturnValue([1] as unknown as DOMRectList)
  })

  beforeEach(() => {
    vi.useFakeTimers()
    scrollIntoViewMock.mockReset()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  afterAll(() => {
    getBoundingClientRectMock.mockRestore()
    getClientRectsMock.mockRestore()
  })

  it('renders items correctly', async () => {
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        items: [
          {
            key: '1',
            href: '#anchor-demo-basic',
            title: 'Item Basic Demo',
          },
          {
            key: '2',
            href: '#anchor-demo-static',
            title: 'Static demo',
          },
          {
            key: '3',
            href: '#api',
            title: 'API',
            children: [
              {
                key: '4',
                href: '#anchor-props',
                title: 'Anchor Props',
                children: [
                  {
                    key: '5',
                    href: '#link-props',
                    title: 'Link Props',
                  },
                ],
              },
            ],
          },
        ],
      },
      attachTo: document.body,
    })
    await waitFakeTimer()

    expect(wrapper.element.querySelectorAll('.ant-anchor .ant-anchor-link')).toHaveLength(5)
    const linkTitles = Array.from(
      wrapper.element.querySelectorAll('.ant-anchor-link-title'),
    ) as HTMLAnchorElement[]
    expect(linkTitles[0]?.href).toContain('#anchor-demo-basic')
    expect(linkTitles[1]?.href).toContain('#anchor-demo-static')
    expect(linkTitles[2]?.href).toContain('#api')
    expect(
      wrapper.element.querySelector(
        '.ant-anchor .ant-anchor-link .ant-anchor-link .ant-anchor-link-title',
      )?.href,
    ).toContain('#anchor-props')
    expect(
      wrapper.element.querySelector(
        '.ant-anchor .ant-anchor-link .ant-anchor-link .ant-anchor-link .ant-anchor-link-title',
      )?.href,
    ).toContain('#link-props')
    wrapper.unmount()
  })

  it('renders items correctly#horizontal', async () => {
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        direction: 'horizontal',
        items: [
          { key: '1', href: '#anchor-demo-basic', title: 'Item Basic Demo' },
          { key: '2', href: '#anchor-demo-static', title: 'Static demo' },
          { key: '3', href: '#api', title: 'API' },
        ],
      },
      attachTo: document.body,
    })
    await waitFakeTimer()

    expect(wrapper.element.querySelectorAll('.ant-anchor .ant-anchor-link')).toHaveLength(3)
    const linkTitles = Array.from(wrapper.element.querySelectorAll('.ant-anchor-link-title')) as HTMLAnchorElement[]
    expect(linkTitles[0]?.href).toContain('#anchor-demo-basic')
    expect(linkTitles[1]?.href).toContain('#anchor-demo-static')
    expect(linkTitles[2]?.href).toContain('#api')
    wrapper.unmount()
  })

  it('actives the target when clicking a link', async () => {
    const hash = getHashUrl()
    const href = `http://www.example.com/#${hash}`
    const pushStateSpy = vi.spyOn(window.history, 'pushState').mockImplementation(() => {})
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        direction: 'horizontal',
        items: [
          {
            key: hash,
            title: hash,
            href,
          },
        ],
      },
      attachTo: document.body,
    })
    await waitFakeTimer()
    expect(wrapper.element.querySelector(`a[href="${href}"]`)).toBeTruthy()
    await wrapper.find(`a[href="${href}"]`).trigger('click')
    await waitFakeTimer()
    const activeLink = wrapper.element.querySelector('.ant-anchor-link-title-active')
    expect(activeLink).toBeTruthy()
    expect(activeLink?.getAttribute('href')).toBe(href)
    pushStateSpy.mockRestore()
    wrapper.unmount()
  })

  it('scrolls the page when clicking a link', async () => {
    const root = createDiv()
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const hash = 'Q1'
    root.innerHTML = `<div id="${hash}">Q1</div>`
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        items: [{ key: hash, title: hash, href: `#${hash}` }],
      },
      attachTo: document.body,
    })
    await wrapper.find(`a[href="#${hash}"]`).trigger('click')
    await waitFakeTimer()
    expect(scrollToSpy).toHaveBeenCalled()
    scrollToSpy.mockRestore()
    wrapper.unmount()
    root.remove()
  })

  it('handleScroll should not be triggered when scrolling caused by clicking a link', async () => {
    const hash1 = getHashUrl()
    const hash2 = getHashUrl()
    const root = createDiv()
    root.innerHTML = `<div id="${hash1}">Hello</div><div id="${hash2}">World</div>`
    const onChange = vi.fn()
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        onChange,
        items: [
          { key: hash1, href: `#${hash1}`, title: hash1 },
          { key: hash2, href: `#${hash2}`, title: hash2 },
        ],
      },
      attachTo: document.body,
    })
    await waitFakeTimer()
    onChange.mockClear()

    await wrapper.find(`a[href="#${hash2}"]`).trigger('click')
    window.dispatchEvent(new Event('scroll'))
    await waitFakeTimer()

    expect(onChange).toHaveBeenCalledTimes(1)
    wrapper.unmount()
    root.remove()
  })

  it('should update DOM when items are unmounted', async () => {
    const hash = getHashUrl()
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        items: [{ key: hash, href: `#${hash}`, title: hash }],
      },
      attachTo: document.body,
    })
    await waitFakeTimer()

    expect(wrapper.element.querySelectorAll('.ant-anchor-link-title')).toHaveLength(1)
    expect(wrapper.element.querySelector('.ant-anchor-link-title')).toHaveAttribute('href', `#${hash}`)

    await wrapper.setProps({ items: [] })
    expect(wrapper.element.querySelector('.ant-anchor-link-title')).toBeFalsy()
    wrapper.unmount()
  })

  it('should update DOM when link href is changed', async () => {
    const hash = getHashUrl()
    const AnchorUpdate = defineComponent<{ href: string }>({
      props: {
        href: {
          type: String,
          required: true,
        },
      },
      setup(props) {
        return () => (
          <Anchor
            affix={false}
            items={[{ key: hash, href: props.href, title: hash }]}
          />
        )
      },
    })
    const wrapper = mount(AnchorUpdate, {
      props: { href: `#${hash}` },
      attachTo: document.body,
    })
    await waitFakeTimer()

    expect(wrapper.element.querySelector(`a[href="#${hash}"]`)).toBeTruthy()
    await wrapper.setProps({ href: `#${hash}_1` })
    expect(wrapper.element.querySelector(`a[href="#${hash}_1"]`)).toBeTruthy()
    wrapper.unmount()
  })

  it('should not proceed when event is default prevented', async () => {
    const hash = getHashUrl()
    const root = createDiv()
    root.innerHTML = `<div id="${hash}">Section</div>`
    const handleClick = (e: MouseEvent) => {
      e.preventDefault()
    }
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const pushStateSpy = vi.spyOn(window.history, 'pushState').mockImplementation(() => {})
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {})
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        onClick: handleClick,
        items: [{ key: hash, href: `#${hash}`, title: hash }],
      },
      attachTo: document.body,
    })

    await wrapper.find(`a[href="#${hash}"]`).trigger('click')
    await waitFakeTimer()

    expect(scrollToSpy).toHaveBeenCalled()
    expect(pushStateSpy).not.toHaveBeenCalled()
    expect(replaceStateSpy).not.toHaveBeenCalled()

    scrollToSpy.mockRestore()
    pushStateSpy.mockRestore()
    replaceStateSpy.mockRestore()
    wrapper.unmount()
    root.remove()
  })

  it('targetOffset prop', async () => {
    const hash = getHashUrl()
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const root = createDiv()
    root.innerHTML = `<h1 id="${hash}">Hello</h1>`
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        items: [{ key: hash, href: `#${hash}`, title: hash }],
      },
      attachTo: document.body,
    })

    await wrapper.find(`a[href="#${hash}"]`).trigger('click')
    await waitFakeTimer()
    expect(scrollToSpy).toHaveBeenLastCalledWith(0, 1000)

    await wrapper.setProps({ offsetTop: 100 })
    await wrapper.find(`a[href="#${hash}"]`).trigger('click')
    await waitFakeTimer()
    expect(scrollToSpy).toHaveBeenLastCalledWith(0, 900)

    await wrapper.setProps({ targetOffset: 200 })
    await wrapper.find(`a[href="#${hash}"]`).trigger('click')
    await waitFakeTimer()
    expect(scrollToSpy).toHaveBeenLastCalledWith(0, 800)

    scrollToSpy.mockRestore()
    wrapper.unmount()
    root.remove()
  })

  it('targetOffset prop when contain spaces', async () => {
    const hash = `${getHashUrl()} s p a c e s`
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const root = createDiv()
    root.innerHTML = `<h1 id="${hash}">Hello</h1>`
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        items: [{ key: hash, href: `#${hash}`, title: hash }],
      },
      attachTo: document.body,
    })

    await wrapper.find(`a[href="#${hash}"]`).trigger('click')
    await waitFakeTimer()
    expect(scrollToSpy).toHaveBeenLastCalledWith(0, 1000)

    await wrapper.setProps({ offsetTop: 100 })
    await wrapper.find(`a[href="#${hash}"]`).trigger('click')
    await waitFakeTimer()
    expect(scrollToSpy).toHaveBeenLastCalledWith(0, 900)

    await wrapper.setProps({ targetOffset: 200 })
    await wrapper.find(`a[href="#${hash}"]`).trigger('click')
    await waitFakeTimer()
    expect(scrollToSpy).toHaveBeenLastCalledWith(0, 800)

    scrollToSpy.mockRestore()
    wrapper.unmount()
    root.remove()
  })

  it('onClick event', async () => {
    const hash = getHashUrl()
    let event: MouseEvent | undefined
    let link: { title: any, href: string } | undefined
    const handleClick = (e: MouseEvent, _link: { title: any, href: string }) => {
      event = e
      link = _link
    }

    const href = `#${hash}`
    const title = hash
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        onClick: handleClick,
        items: [{ key: hash, href, title }],
      },
      attachTo: document.body,
    })

    await wrapper.find(`a[href="${href}"]`).trigger('click')
    expect(event).not.toBeUndefined()
    expect(link).toEqual({ href, title })
    wrapper.unmount()
  })

  it('replaces item href in browser history (hash href)', async () => {
    const hash = getHashUrl()
    const href = `#${hash}`
    const title = hash
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        replace: true,
        items: [{ key: hash, href, title }],
      },
      attachTo: document.body,
    })
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {})
    await wrapper.find(`a[href="${href}"]`).trigger('click')
    expect(window.history.replaceState).toHaveBeenCalledWith(null, '', href)
    replaceStateSpy.mockRestore()
    wrapper.unmount()
  })

  it('onChange event', async () => {
    const hash1 = getHashUrl()
    const hash2 = getHashUrl()
    const onChange = vi.fn()
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        onChange,
        items: [
          {
            key: hash1,
            href: `#${hash1}`,
            title: hash1,
          },
          {
            key: hash2,
            href: `#${hash2}`,
            title: hash2,
          },
        ],
      },
      attachTo: document.body,
    })
    await waitFakeTimer()
    expect(onChange).toHaveBeenCalledTimes(1)
    await wrapper.find(`a[href="#${hash2}"]`).trigger('click')
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenLastCalledWith(`#${hash2}`)
    wrapper.unmount()
  })

  it('should be used the latest onChange method', async () => {
    const hash1 = getHashUrl()
    const hash2 = getHashUrl()

    const beforeFn = vi.fn()
    const afterFn = vi.fn()

    const Demo = defineComponent(() => {
      const trigger = ref(false)
      const toggle = () => {
        trigger.value = true
      }
      return () => (
        <div>
          <button class="test-button" type="button" onClick={toggle}>
            toggle
          </button>
          <Anchor
            affix={false}
            onChange={trigger.value ? afterFn : beforeFn}
            items={[
              { key: hash1, href: `#${hash1}`, title: hash1 },
              { key: hash2, href: `#${hash2}`, title: hash2 },
            ]}
          />
        </div>
      )
    })

    const wrapper = mount(Demo, { attachTo: document.body })
    await waitFakeTimer()
    expect(beforeFn).toHaveBeenCalled()
    expect(afterFn).not.toHaveBeenCalled()

    beforeFn.mockClear()
    afterFn.mockClear()

    await wrapper.find('.test-button').trigger('click')
    await wrapper.find(`a[href="#${hash2}"]`).trigger('click')

    expect(beforeFn).not.toHaveBeenCalled()
    expect(afterFn).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('handles invalid hash correctly', async () => {
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        items: [{ key: 'title', href: 'nonexistent', title: 'title' }],
      },
      attachTo: document.body,
    })
    await waitFakeTimer()

    await wrapper.find(`a[href="nonexistent"]`).trigger('click')
    await waitFakeTimer()
    // Check that the link with href "nonexistent" has the active class
    const link = wrapper.element.querySelector(`a[href="nonexistent"]`)
    expect(link).toHaveClass('ant-anchor-link-title-active')
    wrapper.unmount()
  })

  describe('getCurrentAnchor', () => {
    it('getCurrentAnchor prop', async () => {
      const hash1 = getHashUrl()
      const hash2 = getHashUrl()
      const getCurrentAnchor = () => `#${hash2}`
      const wrapper = mount(Anchor, {
        props: {
          affix: false,
          getCurrentAnchor,
          items: [
            { key: hash1, href: `#${hash1}`, title: hash1 },
            { key: hash2, href: `#${hash2}`, title: hash2 },
          ],
        },
        attachTo: document.body,
      })
      await waitFakeTimer()

      expect(wrapper.element.querySelector(`.ant-anchor-link-title-active`)?.textContent).toBe(hash2)
      wrapper.unmount()
    })

    it('should trigger onChange when have getCurrentAnchor', async () => {
      const hash1 = getHashUrl()
      const hash2 = getHashUrl()
      const onChange = vi.fn()
      const wrapper = mount(Anchor, {
        props: {
          affix: false,
          onChange,
          getCurrentAnchor: () => hash1,
          items: [
            { key: hash1, href: `#${hash1}`, title: hash1 },
            { key: hash2, href: `#${hash2}`, title: hash2 },
          ],
        },
        attachTo: document.body,
      })

      await waitFakeTimer()
      const calledTimes = onChange.mock.calls.length
      await wrapper.find(`a[href="#${hash2}"]`).trigger('click')
      expect(onChange).toHaveBeenCalledTimes(calledTimes + 1)
      expect(onChange).toHaveBeenLastCalledWith(`#${hash2}`)
      wrapper.unmount()
    })

    it('getCurrentAnchor have default link as argument', async () => {
      const hash1 = getHashUrl()
      const hash2 = getHashUrl()
      const getCurrentAnchor = vi.fn()
      const wrapper = mount(Anchor, {
        props: {
          affix: false,
          getCurrentAnchor,
          items: [
            { key: hash1, href: `#${hash1}`, title: hash1 },
            { key: hash2, href: `#${hash2}`, title: hash2 },
          ],
        },
        attachTo: document.body,
      })

      await waitFakeTimer()
      getCurrentAnchor.mockClear()
      await wrapper.find(`a[href="#${hash1}"]`).trigger('click')
      await wrapper.find(`a[href="#${hash2}"]`).trigger('click')
      expect(getCurrentAnchor).toHaveBeenCalledWith(`#${hash1}`)
      expect(getCurrentAnchor).toHaveBeenCalledWith(`#${hash2}`)
      wrapper.unmount()
    })

    it('should update active link when getCurrentAnchor changes', async () => {
      const hash1 = getHashUrl()
      const hash2 = getHashUrl()
      const Demo = defineComponent<{ current: string }>({
        props: {
          current: {
            type: String,
            required: true,
          },
        },
        setup(props) {
          return () => (
            <Anchor
              affix={false}
              getCurrentAnchor={() => `#${props.current}`}
              items={[
                { key: hash1, href: `#${hash1}`, title: hash1 },
                { key: hash2, href: `#${hash2}`, title: hash2 },
              ]}
            />
          )
        },
      })
      const wrapper = mount(Demo, {
        props: { current: hash1 },
        attachTo: document.body,
      })
      await waitFakeTimer()
      expect(wrapper.element.querySelector(`.ant-anchor-link-title-active`)?.textContent).toBe(hash1)
      await wrapper.setProps({ current: hash2 })
      await waitFakeTimer()
      expect(wrapper.element.querySelector(`.ant-anchor-link-title-active`)?.textContent).toBe(hash2)
      wrapper.unmount()
    })

    it('should render correctly when href is null', () => {
      expect(() => {
        const wrapper = mount(Anchor, {
          props: {
            affix: false,
            items: [{ key: 'test', href: null as unknown as string, title: 'test' }],
          },
          attachTo: document.body,
        })
        window.dispatchEvent(new Event('scroll'))
        wrapper.unmount()
      }).not.toThrow()
    })

    it('should repeat trigger when scrolling', async () => {
      const getCurrentAnchor = vi.fn()
      const wrapper = mount(Anchor, {
        props: {
          affix: false,
          getCurrentAnchor,
          items: [{ key: 'test', href: null as unknown as string, title: 'test' }],
        },
        attachTo: document.body,
      })

      await waitFakeTimer()
      for (let i = 0; i < 5; i += 1) {
        getCurrentAnchor.mockReset()
        window.dispatchEvent(new Event('scroll'))
        await waitFakeTimer()
        expect(getCurrentAnchor).toHaveBeenCalled()
      }
      wrapper.unmount()
    })
  })

  describe('horizontal anchor', () => {
    it('targetOffset horizontal', async () => {
      const hash = getHashUrl()
      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
      const root = createDiv()
      root.innerHTML = `<h1 id="${hash}">Hello</h1>`
      const wrapper = mount(Anchor, {
        props: {
          affix: false,
          direction: 'horizontal',
          items: [{ key: hash, href: `#${hash}`, title: hash }],
        },
        attachTo: document.body,
      })

      await wrapper.find(`a[href="#${hash}"]`).trigger('click')
      await waitFakeTimer()

      expect(scrollIntoViewMock).toHaveBeenCalled()
      expect(scrollToSpy).toHaveBeenLastCalledWith(0, 1000)

      await wrapper.setProps({ offsetTop: 100 })
      await wrapper.find(`a[href="#${hash}"]`).trigger('click')
      await waitFakeTimer()
      expect(scrollToSpy).toHaveBeenLastCalledWith(0, 900)

      await wrapper.setProps({ targetOffset: 200 })
      await wrapper.find(`a[href="#${hash}"]`).trigger('click')
      await waitFakeTimer()
      expect(scrollToSpy).toHaveBeenLastCalledWith(0, 800)

      scrollToSpy.mockRestore()
      wrapper.unmount()
      root.remove()
    })

    it('test direction prop', async () => {
      const wrapper = mount(Anchor, {
        props: {
          affix: false,
          direction: 'horizontal',
          items: [
            { key: '1', href: '#anchor-demo-basic', title: 'Item Basic Demo' },
            { key: '2', href: '#anchor-demo-static', title: 'Static demo' },
            { key: '3', href: '#api', title: 'API' },
          ],
        },
        attachTo: document.body,
      })
      await waitFakeTimer()
      expect(wrapper.element.querySelectorAll('.ant-anchor-ink')).toHaveLength(1)
      expect(wrapper.element.querySelector('.ant-anchor-wrapper')).toHaveClass(
        'ant-anchor-wrapper-horizontal',
      )
      wrapper.unmount()
    })

    it('nested children via items should be filtered out when direction is horizontal', async () => {
      const wrapper = mount(Anchor, {
        props: {
          affix: false,
          direction: 'horizontal',
          items: [
            { key: '1', href: '#anchor-demo-basic', title: 'Item Basic Demo' },
            { key: '2', href: '#anchor-demo-static', title: 'Static demo' },
            {
              key: '3',
              href: '#api',
              title: 'API',
              children: [
                { key: '4', href: '#anchor-props', title: 'Anchor Props' },
                { key: '5', href: '#link-props', title: 'Link Props' },
              ],
            },
          ],
        },
        attachTo: document.body,
      })
      await waitFakeTimer()
      expect(wrapper.element.querySelectorAll('.ant-anchor-link')).toHaveLength(3)
      wrapper.unmount()
    })
  })

  it('switch direction', async () => {
    const Foo = defineComponent(() => {
      const direction = ref<AnchorDirection>('vertical')
      const toggle = () => {
        direction.value = direction.value === 'vertical' ? 'horizontal' : 'vertical'
      }
      return () => (
        <div>
          <button type="button" onClick={toggle}>
            toggle
          </button>
          <Anchor
            affix={false}
            direction={direction.value}
            items={[
              { title: 'part-1', href: 'part-1', key: 'part-1' },
              { title: 'part-2', href: 'part-2', key: 'part-2' },
            ]}
          />
        </div>
      )
    })
    const wrapper = mount(Foo, { attachTo: document.body })
    await waitFakeTimer()
    await wrapper.find('a[href="part-1"]').trigger('click')
    await waitFakeTimer()
    const inkElement = wrapper.element.querySelector('.ant-anchor-ink')
    const toggleButton = wrapper.element.querySelector('button')

    expect(toggleButton).toBeInTheDocument()

    await wrapper.find('button').trigger('click')
    await waitFakeTimer()

    expect(inkElement).toHaveStyle({
      left: '0px',
      width: '0px',
    })

    await wrapper.find('button').trigger('click')
    await waitFakeTimer()

    expect(inkElement).toHaveStyle({
      top: '0px',
      height: '0px',
    })
    wrapper.unmount()
  })
})
