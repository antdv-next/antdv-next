import type { ConfigProviderProps } from 'antdv-next'
import { theme } from 'antdv-next'
import { computed } from 'vue'

/**
 * Ant Design V4 style approximation theme.
 *
 * Note: ant-design uses @ant-design/compatible (React-only) for true V4 compatibility.
 * Since antdv-next has no equivalent package, this theme approximates the V4 visual
 * style by hardcoding typical V4 token values.
 */
function useV4Theme() {
  return computed<ConfigProviderProps>(() => ({
    theme: {
      algorithm: theme.defaultAlgorithm,
      token: {
        // V4 primary color
        colorPrimary: '#1890ff',
        // V4 smaller border radius
        borderRadius: 2,
        borderRadiusLG: 2,
        borderRadiusSM: 2,
        borderRadiusXS: 2,
        // V4 box shadows
        boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        boxShadowSecondary: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        // V4 typical font size
        fontSize: 14,
        fontSizeLG: 16,
        fontSizeSM: 12,
        fontSizeXL: 20,
        // V4 control height
        controlHeight: 32,
        controlHeightLG: 40,
        controlHeightSM: 24,
        controlHeightXS: 16,
        // V4 padding
        paddingXS: 8,
        paddingSM: 12,
        padding: 16,
        paddingMD: 20,
        paddingLG: 24,
        paddingXL: 32,
        // V4 margin
        marginXS: 8,
        marginSM: 12,
        margin: 16,
        marginMD: 20,
        marginLG: 24,
        marginXL: 32,
        // V4 line type
        lineType: 'solid',
        lineWidth: 1,
        lineWidthBold: 2,
        // V4 link color
        colorLink: '#1890ff',
        colorLinkHover: '#40a9ff',
        colorLinkActive: '#096dd9',
      },
      components: {
        Layout: {
          bodyBg: '#f0f2f5',
          footerBg: '#f0f2f5',
          headerBg: '#001529',
          headerColor: '#ffffff',
          siderBg: '#ffffff',
          triggerBg: '#e6f4ff',
          triggerColor: '#000000d9',
        },
        Menu: {
          activeBarBorderWidth: 0,
          itemBg: 'transparent',
          subMenuItemBg: 'transparent',
        },
        Button: {},
        Alert: {},
        Modal: {},
        Card: {},
        Tooltip: {},
        Checkbox: {},
        Radio: {},
        Select: {},
        Input: {},
        Switch: {},
        Progress: {
          circleTextColor: '#000000d9',
          defaultColor: '#1890ff',
          remainingColor: '#f5f5f5',
        },
        Steps: {},
        Slider: {},
        ColorPicker: {},
        Notification: {},
      },
    },
    wave: {},
    app: {},
    card: {},
    modal: {},
    button: {},
    alert: {},
    colorPicker: {},
    checkbox: {},
    dropdown: {},
    select: {},
    datePicker: {},
    input: {},
    inputNumber: {},
    popover: {},
    tooltip: {},
    notification: {},
    switch: {},
    radio: {},
    segmented: {},
    progress: {},
  }))
}

export default useV4Theme
