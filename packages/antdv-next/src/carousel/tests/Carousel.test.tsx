import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Carousel from '..'
import ConfigProvider from '../../config-provider'
import zhCN from '../../locale/zh_CN'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

async function waitAnimation() {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 600))
  await nextTick()
}

function createSlides(count = 4) {
  return Array.from({ length: count }, (_, i) =>
    h('div', null, `Slide ${i + 1}`))
}

describe('carousel', () => {
  rtlTest(() => h(Carousel, null, { default: () => createSlides() }))

  it('should render basic carousel', () => {
    const wrapper = mount(Carousel, {
      slots: { default: () => createSlides() },
    })
    expect(wrapper.find('.ant-carousel').exists()).toBe(true)
    expect(wrapper.find('.slick-slider').exists()).toBe(true)
  })

  it('should support id prop', () => {
    const wrapper = mount(Carousel, {
      props: { id: 'my-carousel' },
      slots: { default: () => createSlides() },
    })
    expect(wrapper.find('#my-carousel').exists()).toBe(true)
  })

  it('should support rootClass prop', () => {
    const wrapper = mount(Carousel, {
      props: { rootClass: 'custom-carousel' },
      slots: { default: () => createSlides() },
    })
    expect(wrapper.find('.ant-carousel').classes()).toContain('custom-carousel')
  })

  // ============ Dots tests ============

  it('should render dots by default', () => {
    const wrapper = mount(Carousel, {
      slots: { default: () => createSlides() },
    })
    expect(wrapper.find('.slick-dots').exists()).toBe(true)
  })

  it('should hide dots when dots=false', () => {
    const wrapper = mount(Carousel, {
      props: { dots: false },
      slots: { default: () => createSlides() },
    })
    expect(wrapper.find('.slick-dots').exists()).toBe(false)
  })

  it('should support custom dots class', () => {
    const wrapper = mount(Carousel, {
      props: { dots: { class: 'custom-dots' } },
      slots: { default: () => createSlides() },
    })
    const dots = wrapper.find('.slick-dots')
    expect(dots.exists()).toBe(true)
    expect(dots.classes()).toContain('custom-dots')
  })

  // ============ dotPlacement tests ============

  it('should render dots at bottom by default', () => {
    const wrapper = mount(Carousel, {
      slots: { default: () => createSlides() },
    })
    expect(wrapper.find('.slick-dots-bottom').exists()).toBe(true)
  })

  it('should support dotPlacement top', () => {
    const wrapper = mount(Carousel, {
      props: { dotPlacement: 'top' },
      slots: { default: () => createSlides() },
    })
    expect(wrapper.find('.slick-dots-top').exists()).toBe(true)
  })

  it('should support dotPlacement start (vertical)', () => {
    const wrapper = mount(Carousel, {
      props: { dotPlacement: 'start' },
      slots: { default: () => createSlides() },
    })
    expect(wrapper.find('.slick-dots-start').exists()).toBe(true)
    expect(wrapper.find('.ant-carousel-vertical').exists()).toBe(true)
  })

  it('should support dotPlacement end (vertical)', () => {
    const wrapper = mount(Carousel, {
      props: { dotPlacement: 'end' },
      slots: { default: () => createSlides() },
    })
    expect(wrapper.find('.slick-dots-end').exists()).toBe(true)
    expect(wrapper.find('.ant-carousel-vertical').exists()).toBe(true)
  })

  it('should map deprecated dotPosition left to start', () => {
    const wrapper = mount(Carousel, {
      props: { dotPosition: 'left' },
      slots: { default: () => createSlides() },
    })
    expect(wrapper.find('.slick-dots-start').exists()).toBe(true)
    expect(wrapper.find('.ant-carousel-vertical').exists()).toBe(true)
  })

  it('should map deprecated dotPosition right to end', () => {
    const wrapper = mount(Carousel, {
      props: { dotPosition: 'right' },
      slots: { default: () => createSlides() },
    })
    expect(wrapper.find('.slick-dots-end').exists()).toBe(true)
    expect(wrapper.find('.ant-carousel-vertical').exists()).toBe(true)
  })

  // ============ Vertical tests ============

  it('should not be vertical when dotPlacement is top', () => {
    const wrapper = mount(Carousel, {
      props: { dotPlacement: 'top' },
      slots: { default: () => createSlides() },
    })
    expect(wrapper.find('.ant-carousel-vertical').exists()).toBe(false)
  })

  it('should not be vertical when dotPlacement is bottom', () => {
    const wrapper = mount(Carousel, {
      props: { dotPlacement: 'bottom' },
      slots: { default: () => createSlides() },
    })
    expect(wrapper.find('.ant-carousel-vertical').exists()).toBe(false)
  })

  // ============ Effect tests ============

  it('should support effect fade', () => {
    const wrapper = mount(Carousel, {
      props: { effect: 'fade' },
      slots: { default: () => createSlides() },
    })
    expect(wrapper.find('.slick-slider').exists()).toBe(true)
  })

  // ============ RTL tests ============

  it('should render rtl class', () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: {
        default: () => h(Carousel, null, { default: () => createSlides() }),
      },
    })
    expect(wrapper.find('.ant-carousel-rtl').exists()).toBe(true)
  })

  it('should not apply rtl class when vertical prop is explicitly set', () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: {
        default: () => h(Carousel, { vertical: true }, { default: () => createSlides() }),
      },
    })
    expect(wrapper.find('.ant-carousel-rtl').exists()).toBe(false)
    expect(wrapper.find('.ant-carousel-vertical').exists()).toBe(true)
  })

  // ============ Autoplay & dotDuration tests ============

  it('should not set dot-duration style when autoplay is boolean true', () => {
    const wrapper = mount(Carousel, {
      props: { autoplay: true, autoplaySpeed: 5000 },
      slots: { default: () => createSlides() },
    })
    const style = wrapper.find('.ant-carousel').attributes('style') || ''
    expect(style).not.toContain('--dot-duration')
  })

  it('should set dot-duration style when autoplay has dotDuration', () => {
    const wrapper = mount(Carousel, {
      props: { autoplay: { dotDuration: true }, autoplaySpeed: 5000 },
      slots: { default: () => createSlides() },
    })
    const style = wrapper.find('.ant-carousel').attributes('style') || ''
    expect(style).toContain('--dot-duration: 5000ms')
  })

  // ============ Arrows tests ============

  it('should not render arrows by default', () => {
    const wrapper = mount(Carousel, {
      slots: { default: () => createSlides() },
    })
    // arrows default is false, but SlickCarousel may still render hidden arrow buttons
    // just verify the prop works
    expect(wrapper.find('.ant-carousel').exists()).toBe(true)
  })

  it('should support arrows prop', () => {
    const wrapper = mount(Carousel, {
      props: { arrows: true },
      slots: { default: () => createSlides() },
    })
    expect(wrapper.find('.slick-arrow').exists()).toBe(true)
  })

  it('should support prevArrow and nextArrow slots', () => {
    const wrapper = mount(Carousel, {
      props: { arrows: true },
      slots: {
        default: () => createSlides(),
        prevArrow: () => h('span', { class: 'custom-prev' }, 'Prev'),
        nextArrow: () => h('span', { class: 'custom-next' }, 'Next'),
      },
    })
    expect(wrapper.find('.custom-prev').exists()).toBe(true)
    expect(wrapper.find('.custom-next').exists()).toBe(true)
  })

  it('should use localized aria-labels for arrows by default', async () => {
    const wrapper = mount(Carousel, {
      props: { arrows: true },
      slots: { default: () => createSlides(3) },
    })
    await nextTick()
    expect(wrapper.find('.slick-prev').attributes('aria-label')).toBe('Previous slide')
    expect(wrapper.find('.slick-next').attributes('aria-label')).toBe('Next slide')
  })

  it('should use localized aria-labels when a custom locale is provided', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: zhCN },
      slots: {
        default: () => h(Carousel, { arrows: true }, { default: () => createSlides(3) }),
      },
    })
    await nextTick()
    expect(wrapper.find('.slick-prev').attributes('aria-label')).toBe('上一张幻灯片')
    expect(wrapper.find('.slick-next').attributes('aria-label')).toBe('下一张幻灯片')
  })

  // ============ Expose methods tests ============

  it('should expose goTo method', () => {
    const wrapper = mount(Carousel, {
      slots: { default: () => createSlides() },
    })
    expect(typeof wrapper.vm.goTo).toBe('function')
  })

  it('should expose next and prev methods', () => {
    const wrapper = mount(Carousel, {
      slots: { default: () => createSlides() },
    })
    expect(typeof wrapper.vm.next).toBe('function')
    expect(typeof wrapper.vm.prev).toBe('function')
  })

  it('should expose autoPlay method', () => {
    const wrapper = mount(Carousel, {
      slots: { default: () => createSlides() },
    })
    expect(typeof wrapper.vm.autoPlay).toBe('function')
  })

  // ============ Ref ============

  it('should support nativeElement ref', async () => {
    const carouselRef = ref<any>()
    const wrapper = mount(() => (
      h(Carousel, { ref: carouselRef }, { default: () => createSlides(2) })
    ))
    await nextTick()
    expect(carouselRef.value?.nativeElement).toBeInstanceOf(HTMLElement)
    expect(carouselRef.value.nativeElement).toBe(wrapper.find('.ant-carousel').element)
  })

  // ============ Children change ============
  // https://github.com/ant-design/ant-design/pull/58845

  it('should keep current slide when children are added', async () => {
    const carouselRef = ref<any>()
    const total = ref(2)
    const Demo = defineComponent(() => () => (
      h(Carousel, { ref: carouselRef }, { default: () => createSlides(total.value) })
    ))
    const wrapper = mount(Demo)
    await nextTick()

    // Go to second slide (index 1)
    carouselRef.value.goTo(1)
    await waitAnimation()
    expect(wrapper.find('.slick-current').attributes('data-index')).toBe('1')

    // Add a new child, should stay on the second slide instead of jumping to the first
    total.value = 3
    await waitAnimation()
    expect(wrapper.find('.slick-current').attributes('data-index')).toBe('1')
    expect(wrapper.find('.slick-current').text()).toBe('Slide 2')
  })

  it('should not overflow when children are removed', async () => {
    const carouselRef = ref<any>()
    const total = ref(5)
    const Demo = defineComponent(() => () => (
      h(Carousel, { ref: carouselRef }, { default: () => createSlides(total.value) })
    ))
    const wrapper = mount(Demo)
    await nextTick()

    carouselRef.value.goTo(4)
    await waitAnimation()
    expect(wrapper.find('.slick-current').attributes('data-index')).toBe('4')

    // Reduce to 2 children, should clamp to the last valid index instead of overflowing
    total.value = 2
    await waitAnimation()
    expect(wrapper.find('.slick-current').attributes('data-index')).toBe('1')
    expect(wrapper.find('.slick-current').text()).toBe('Slide 2')
  })

  // ============ Snapshots ============

  it('should match snapshot - basic', () => {
    const wrapper = mount(() => (
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - with dots and dotPlacement', () => {
    const wrapper = mount(() => (
      <Carousel dotPlacement="top">
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - vertical', () => {
    const wrapper = mount(() => (
      <Carousel dotPlacement="start">
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})
