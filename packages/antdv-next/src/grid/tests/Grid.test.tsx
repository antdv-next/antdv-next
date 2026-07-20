import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { Col, Row } from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('grid', () => {
  // ======================== Row ========================
  describe('row', () => {
    mountTest(Row)
    rtlTest(() => h(Row))

    it('should render correctly', () => {
      const wrapper = mount(Row)
      expect(wrapper.find('.ant-row').exists()).toBe(true)
    })

    it('should render children via default slot', () => {
      const wrapper = mount(Row, {
        slots: { default: () => h('div', 'content') },
      })
      expect(wrapper.text()).toBe('content')
    })

    // ==================== gutter ====================
    describe('gutter', () => {
      it('should apply horizontal gutter as negative margin', () => {
        const wrapper = mount(() => (
          <Row gutter={16}>
            <Col span={12}>col</Col>
          </Row>
        ))
        const row = wrapper.find('.ant-row')
        expect(row.attributes('style')).toContain('margin-left: -8px')
        expect(row.attributes('style')).toContain('margin-right: -8px')
      })

      it('should not apply negative margin when gutter is 0', () => {
        const wrapper = mount(() => <Row gutter={0}><Col /></Row>)
        const style = wrapper.find('.ant-row').attributes('style') ?? ''
        expect(style).not.toContain('margin-left')
        expect(style).not.toContain('margin-right')
      })

      it('should apply vertical gutter as rowGap', () => {
        const wrapper = mount(() => (
          <Row gutter={[0, 20]}>
            <Col span={12}>col</Col>
          </Row>
        ))
        expect(wrapper.find('.ant-row').attributes('style')).toContain('row-gap: 20px')
      })

      it('should apply both horizontal and vertical gutter', () => {
        const wrapper = mount(() => (
          <Row gutter={[16, 24]}>
            <Col span={12}>col</Col>
          </Row>
        ))
        const style = wrapper.find('.ant-row').attributes('style')!
        expect(style).toContain('margin-left: -8px')
        expect(style).toContain('margin-right: -8px')
        expect(style).toContain('row-gap: 24px')
      })

      it('should not have row-gap when vertical gutter is 0', () => {
        const wrapper = mount(() => (
          <Row gutter={[16, 0]}>
            <Col span={12}>col</Col>
          </Row>
        ))
        const style = wrapper.find('.ant-row').attributes('style') ?? ''
        expect(style).not.toContain('row-gap')
      })

      it('should handle responsive gutter object', () => {
        // By default all breakpoints are true in test env (useGutter mergedScreens fallback)
        // So the first matching breakpoint in responsiveArray order (xxxl > xxl > ... > xs) wins
        const wrapper = mount(() => (
          <Row gutter={{ xs: 8, sm: 16 }}>
            <Col>col</Col>
          </Row>
        ))
        // In test env, screens fallback to all true, responsiveArray starts from xxxl
        // xs: 8 and sm: 16 → iterates from xxxl down, first match with value is sm: 16
        const style = wrapper.find('.ant-row').attributes('style') ?? ''
        // At minimum, some margin should be applied since gutter > 0
        expect(style).toContain('margin-left')
        expect(style).toContain('margin-right')
      })

      it('should handle responsive gutter array of objects', () => {
        const wrapper = mount(() => (
          <Row gutter={[{ xs: 8 }, { xs: 16 }]}>
            <Col>col</Col>
          </Row>
        ))
        const style = wrapper.find('.ant-row').attributes('style') ?? ''
        expect(style).toContain('margin-left')
        expect(style).toContain('row-gap')
      })
    })

    // ==================== align ====================
    describe('align', () => {
      it.each(['top', 'middle', 'bottom', 'stretch'] as const)(
        'should apply align class for "%s"',
        (align) => {
          const wrapper = mount(Row, { props: { align } })
          expect(wrapper.find(`.ant-row-${align}`).exists()).toBe(true)
        },
      )

      it('should not have align class when align is not set', () => {
        const wrapper = mount(Row)
        const classes = wrapper.find('.ant-row').classes()
        expect(classes.some(c => /ant-row-(top|middle|bottom|stretch)/.test(c))).toBe(false)
      })
    })

    // ==================== justify ====================
    describe('justify', () => {
      it.each([
        'start',
        'end',
        'center',
        'space-around',
        'space-between',
        'space-evenly',
      ] as const)(
        'should apply justify class for "%s"',
        (justify) => {
          const wrapper = mount(Row, { props: { justify } })
          expect(wrapper.find(`.ant-row-${justify}`).exists()).toBe(true)
        },
      )

      it('should not have justify class when justify is not set', () => {
        const wrapper = mount(Row)
        const classes = wrapper.find('.ant-row').classes()
        expect(classes.some(c => /ant-row-(start|end|center|space-)/.test(c))).toBe(false)
      })
    })

    // ==================== wrap ====================
    describe('wrap', () => {
      it('should add no-wrap class when wrap is false', () => {
        const wrapper = mount(Row, { props: { wrap: false } })
        expect(wrapper.find('.ant-row-no-wrap').exists()).toBe(true)
      })

      it('should not have no-wrap class by default', () => {
        const wrapper = mount(Row)
        expect(wrapper.find('.ant-row-no-wrap').exists()).toBe(false)
      })

      it('should not have no-wrap class when wrap is true', () => {
        const wrapper = mount(Row, { props: { wrap: true } })
        expect(wrapper.find('.ant-row-no-wrap').exists()).toBe(false)
      })
    })

    // ==================== RTL ====================
    it('should add rtl class in RTL direction', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <Row>content</Row>
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-row-rtl').exists()).toBe(true)
    })

    // ==================== attrs passthrough ====================
    describe('attrs passthrough', () => {
      it('should pass style through', () => {
        const wrapper = mount(() => <Row style={{ color: 'red' }} />)
        expect(wrapper.find('.ant-row').attributes('style')).toContain('color: red')
      })

      it('should pass class through', () => {
        const wrapper = mount(() => <Row class="custom-row" />)
        expect(wrapper.find('.ant-row').classes()).toContain('custom-row')
      })

      it('should pass data attributes through', () => {
        const wrapper = mount(() => <Row data-testid="my-row" />)
        expect(wrapper.find('[data-testid="my-row"]').exists()).toBe(true)
      })

      it('should pass role attribute through', () => {
        const wrapper = mount(Row, { attrs: { role: 'row' } })
        expect(wrapper.find('.ant-row').attributes('role')).toBe('row')
      })
    })

    // ==================== dynamic props ====================
    describe('dynamic props', () => {
      it('should update justify class reactively', async () => {
        const justify = ref<'start' | 'end'>('start')
        const wrapper = mount(() => <Row justify={justify.value}>content</Row>)
        expect(wrapper.find('.ant-row-start').exists()).toBe(true)

        justify.value = 'end'
        await nextTick()
        expect(wrapper.find('.ant-row-end').exists()).toBe(true)
        expect(wrapper.find('.ant-row-start').exists()).toBe(false)
      })

      it('should update align class reactively', async () => {
        const align = ref<'top' | 'middle'>('top')
        const wrapper = mount(() => <Row align={align.value}>content</Row>)
        expect(wrapper.find('.ant-row-top').exists()).toBe(true)

        align.value = 'middle'
        await nextTick()
        expect(wrapper.find('.ant-row-middle').exists()).toBe(true)
        expect(wrapper.find('.ant-row-top').exists()).toBe(false)
      })
    })

    // ==================== prefixCls ====================
    it('should support custom prefixCls', () => {
      const wrapper = mount(Row, { props: { prefixCls: 'my-row' } })
      expect(wrapper.find('.my-row').exists()).toBe(true)
    })

    // ==================== snapshot ====================
    it('should match snapshot', () => {
      const wrapper = mount(() => (
        <Row gutter={[16, 24]} justify="center" align="middle">
          <Col span={6}>col-6</Col>
          <Col span={6}>col-6</Col>
          <Col span={6}>col-6</Col>
          <Col span={6}>col-6</Col>
        </Row>
      ))
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  // ======================== Col ========================
  describe('col', () => {
    mountTest(Col)
    rtlTest(() => h(Col))

    it('should render correctly', () => {
      const wrapper = mount(Col)
      expect(wrapper.find('.ant-col').exists()).toBe(true)
    })

    it('should render children via default slot', () => {
      const wrapper = mount(Col, {
        slots: { default: () => 'col-content' },
      })
      expect(wrapper.text()).toBe('col-content')
    })

    // ==================== span ====================
    describe('span', () => {
      it('should apply span class', () => {
        const wrapper = mount(Col, { props: { span: 8 } })
        expect(wrapper.find('.ant-col-8').exists()).toBe(true)
      })

      it('should apply span 0', () => {
        const wrapper = mount(Col, { props: { span: 0 } })
        expect(wrapper.find('.ant-col-0').exists()).toBe(true)
      })

      it('should apply string span', () => {
        const wrapper = mount(Col, { props: { span: '12' } })
        expect(wrapper.find('.ant-col-12').exists()).toBe(true)
      })
    })

    // ==================== offset ====================
    describe('offset', () => {
      it('should apply offset class', () => {
        const wrapper = mount(Col, { props: { offset: 4 } })
        expect(wrapper.find('.ant-col-offset-4').exists()).toBe(true)
      })

      it('should not apply offset class when offset is 0 (falsy)', () => {
        const wrapper = mount(Col, { props: { offset: 0 } })
        expect(wrapper.find('.ant-col-offset-0').exists()).toBe(false)
      })
    })

    // ==================== push / pull ====================
    describe('push and pull', () => {
      it('should apply push class', () => {
        const wrapper = mount(Col, { props: { push: 4 } })
        expect(wrapper.find('.ant-col-push-4').exists()).toBe(true)
      })

      it('should apply pull class', () => {
        const wrapper = mount(Col, { props: { pull: 4 } })
        expect(wrapper.find('.ant-col-pull-4').exists()).toBe(true)
      })

      it('should not apply push/pull class when value is 0 (falsy)', () => {
        const wrapper = mount(Col, { props: { push: 0, pull: 0 } })
        expect(wrapper.find('.ant-col-push-0').exists()).toBe(false)
        expect(wrapper.find('.ant-col-pull-0').exists()).toBe(false)
      })
    })

    // ==================== order ====================
    describe('order', () => {
      it('should apply order class', () => {
        const wrapper = mount(Col, { props: { order: 2 } })
        expect(wrapper.find('.ant-col-order-2').exists()).toBe(true)
      })

      it('should not apply order class when order is 0 (falsy)', () => {
        const wrapper = mount(Col, { props: { order: 0 } })
        expect(wrapper.find('.ant-col-order-0').exists()).toBe(false)
      })
    })

    // ==================== flex ====================
    describe('flex', () => {
      it('should apply flex style for number', () => {
        const wrapper = mount(Col, { props: { flex: 2 } })
        expect(wrapper.find('.ant-col').attributes('style')).toContain('flex: 2 2 auto')
      })

      it('should apply flex style for string "auto" (expanded by jsdom)', () => {
        const wrapper = mount(Col, { props: { flex: 'auto' } })
        // parseFlex('auto') returns 'auto', jsdom expands shorthand to '1 1 auto'
        expect(wrapper.find('.ant-col').attributes('style')).toContain('flex: 1 1 auto')
      })

      it('should apply flex style for string "none" (expanded by jsdom)', () => {
        const wrapper = mount(Col, { props: { flex: 'none' } })
        // parseFlex('none') returns 'none', jsdom expands shorthand to '0 0 auto'
        expect(wrapper.find('.ant-col').attributes('style')).toContain('flex: 0 0 auto')
      })

      it('should apply flex style for px value', () => {
        const wrapper = mount(Col, { props: { flex: '200px' } })
        expect(wrapper.find('.ant-col').attributes('style')).toContain('flex: 0 0 200px')
      })

      it('should apply flex style for percentage', () => {
        const wrapper = mount(Col, { props: { flex: '50%' } })
        expect(wrapper.find('.ant-col').attributes('style')).toContain('flex: 0 0 50%')
      })

      it('should apply flex style for em value', () => {
        const wrapper = mount(Col, { props: { flex: '10em' } })
        expect(wrapper.find('.ant-col').attributes('style')).toContain('flex: 0 0 10em')
      })

      it('should apply flex style for rem value', () => {
        const wrapper = mount(Col, { props: { flex: '5rem' } })
        expect(wrapper.find('.ant-col').attributes('style')).toContain('flex: 0 0 5rem')
      })

      it('should apply flex style for custom string (e.g. "1 0 auto")', () => {
        const wrapper = mount(Col, { props: { flex: '1 0 auto' } })
        expect(wrapper.find('.ant-col').attributes('style')).toContain('flex: 1 0 auto')
      })

      it('should support zero flex', () => {
        const wrapper = mount(Col, { props: { flex: 0 } })
        expect(wrapper.find('.ant-col').attributes('style')).toContain('flex: 0 0 auto')
      })

      it('should support zero flex as string', () => {
        const wrapper = mount(Col, { props: { flex: '0' } })
        // jsdom expands the shorthand `flex: 0` to `0 1 0%`
        expect(wrapper.find('.ant-col').attributes('style')).toContain('flex: 0 1 0%')
      })

      it('should set minWidth 0 when flex is set and Row wrap is false', () => {
        const wrapper = mount(() => (
          <Row wrap={false}>
            <Col flex={1}>col</Col>
          </Row>
        ))
        const colStyle = wrapper.find('.ant-col').attributes('style')!
        expect(colStyle).toContain('min-width: 0')
      })

      it('should not set minWidth when Row wrap is not false', () => {
        const wrapper = mount(() => (
          <Row>
            <Col flex={1}>col</Col>
          </Row>
        ))
        const colStyle = wrapper.find('.ant-col').attributes('style') ?? ''
        expect(colStyle).not.toContain('min-width: 0')
      })
    })

    // ==================== responsive ====================
    describe('responsive', () => {
      it('should apply responsive span as number', () => {
        const wrapper = mount(Col, { props: { xs: 24, sm: 12, md: 8 } })
        const classes = wrapper.find('.ant-col').classes()
        expect(classes).toContain('ant-col-xs-24')
        expect(classes).toContain('ant-col-sm-12')
        expect(classes).toContain('ant-col-md-8')
      })

      it('should apply responsive span as object', () => {
        const wrapper = mount(Col, {
          props: {
            xs: { span: 24, offset: 0 },
            sm: { span: 12, offset: 6 },
          },
        })
        const classes = wrapper.find('.ant-col').classes()
        expect(classes).toContain('ant-col-xs-24')
        expect(classes).toContain('ant-col-xs-offset-0')
        expect(classes).toContain('ant-col-sm-12')
        expect(classes).toContain('ant-col-sm-offset-6')
      })

      it('should apply responsive order/push/pull', () => {
        const wrapper = mount(Col, {
          props: {
            xs: { span: 24, order: 1, push: 2, pull: 3 },
          },
        })
        const classes = wrapper.find('.ant-col').classes()
        expect(classes).toContain('ant-col-xs-24')
        expect(classes).toContain('ant-col-xs-order-1')
        expect(classes).toContain('ant-col-xs-push-2')
        expect(classes).toContain('ant-col-xs-pull-3')
      })

      it('should apply responsive flex', () => {
        const wrapper = mount(Col, {
          props: { xs: { flex: '100px' } },
        })
        const classes = wrapper.find('.ant-col').classes()
        expect(classes).toContain('ant-col-xs-flex')
      })

      it('should support responsive zero flex', () => {
        const wrapper = mount(Col, {
          props: { xs: { flex: 0 } },
        })
        const col = wrapper.find('.ant-col')
        expect(col.classes()).toContain('ant-col-xs-flex')
        expect(col.attributes('style')).toContain('--ant-col-xs-flex: 0 0 auto')
      })

      it('should support all breakpoints', () => {
        const wrapper = mount(Col, {
          props: { xs: 24, sm: 20, md: 16, lg: 12, xl: 8, xxl: 4, xxxl: 2 },
        })
        const classes = wrapper.find('.ant-col').classes()
        expect(classes).toContain('ant-col-xs-24')
        expect(classes).toContain('ant-col-sm-20')
        expect(classes).toContain('ant-col-md-16')
        expect(classes).toContain('ant-col-lg-12')
        expect(classes).toContain('ant-col-xl-8')
        expect(classes).toContain('ant-col-xxl-4')
        expect(classes).toContain('ant-col-xxxl-2')
      })
    })

    // ==================== gutter from Row context ====================
    describe('gutter from Row context', () => {
      it('should apply horizontal padding from Row gutter', () => {
        const wrapper = mount(() => (
          <Row gutter={16}>
            <Col span={12}>col</Col>
          </Row>
        ))
        const colStyle = wrapper.find('.ant-col').attributes('style')!
        expect(colStyle).toContain('padding-left: 8px')
        expect(colStyle).toContain('padding-right: 8px')
      })

      it('should not apply padding when gutter is 0', () => {
        const wrapper = mount(() => (
          <Row gutter={0}>
            <Col span={12}>col</Col>
          </Row>
        ))
        const colStyle = wrapper.find('.ant-col').attributes('style') ?? ''
        expect(colStyle).not.toContain('padding-left')
        expect(colStyle).not.toContain('padding-right')
      })
    })

    // ==================== RTL ====================
    it('should add rtl class in RTL direction', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <Col span={12}>col</Col>
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-col-rtl').exists()).toBe(true)
    })

    // ==================== attrs passthrough ====================
    describe('attrs passthrough', () => {
      it('should pass style through', () => {
        const wrapper = mount(() => <Col style={{ color: 'blue' }} />)
        expect(wrapper.find('.ant-col').attributes('style')).toContain('color: blue')
      })

      it('should pass class through', () => {
        const wrapper = mount(() => <Col class="custom-col" />)
        expect(wrapper.find('.ant-col').classes()).toContain('custom-col')
      })

      it('should pass data attributes through', () => {
        const wrapper = mount(() => <Col data-testid="my-col" />)
        expect(wrapper.find('[data-testid="my-col"]').exists()).toBe(true)
      })
    })

    // ==================== prefixCls ====================
    it('should support custom prefixCls', () => {
      const wrapper = mount(Col, { props: { prefixCls: 'my-col' } })
      expect(wrapper.find('.my-col').exists()).toBe(true)
    })

    // ==================== snapshot ====================
    it('should match snapshot', () => {
      const wrapper = mount(() => (
        <Col span={12} offset={6} push={2} pull={1} order={3} flex="auto">
          col content
        </Col>
      ))
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  // ======================== Row + Col integration ========================
  describe('row + Col integration', () => {
    it('should render basic 3-column layout', () => {
      const wrapper = mount(() => (
        <Row>
          <Col span={8}>col-8</Col>
          <Col span={8}>col-8</Col>
          <Col span={8}>col-8</Col>
        </Row>
      ))
      const cols = wrapper.findAll('.ant-col')
      expect(cols).toHaveLength(3)
      cols.forEach((col) => {
        expect(col.classes()).toContain('ant-col-8')
      })
    })

    it('should apply gutter to both Row and Col', () => {
      const wrapper = mount(() => (
        <Row gutter={24}>
          <Col span={12}>left</Col>
          <Col span={12}>right</Col>
        </Row>
      ))
      // Row: negative margin
      const rowStyle = wrapper.find('.ant-row').attributes('style')!
      expect(rowStyle).toContain('margin-left: -12px')
      expect(rowStyle).toContain('margin-right: -12px')
      // Col: padding
      const cols = wrapper.findAll('.ant-col')
      cols.forEach((col) => {
        const colStyle = col.attributes('style')!
        expect(colStyle).toContain('padding-left: 12px')
        expect(colStyle).toContain('padding-right: 12px')
      })
    })

    it('should render complex layout with offset', () => {
      const wrapper = mount(() => (
        <Row>
          <Col span={6} offset={6}>col-6 offset-6</Col>
          <Col span={6} offset={6}>col-6 offset-6</Col>
        </Row>
      ))
      const cols = wrapper.findAll('.ant-col')
      expect(cols).toHaveLength(2)
      cols.forEach((col) => {
        expect(col.classes()).toContain('ant-col-6')
        expect(col.classes()).toContain('ant-col-offset-6')
      })
    })

    it('should match integration snapshot', () => {
      const wrapper = mount(() => (
        <Row gutter={[16, 24]} justify="space-between" align="top">
          <Col xs={24} sm={12} md={8}>responsive col</Col>
          <Col xs={24} sm={12} md={8} offset={8}>responsive col with offset</Col>
        </Row>
      ))
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
