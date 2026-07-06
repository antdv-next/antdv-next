import type { ConfigProviderProps } from 'antdv-next'
import { theme } from 'antdv-next'
import { computed } from 'vue'

function useBlossomTheme() {
  return computed<ConfigProviderProps>(() => ({
    theme: {
      algorithm: theme.defaultAlgorithm,
      token: {
        colorPrimary: '#ED4192',
        borderRadius: 16,
      },
      components: {
        Layout: {
          bodyBg: '#fff4fa',
          footerBg: '#fff4fa',
          headerBg: '#ffffff',
          headerColor: '#3f2330',
          siderBg: '#fff7fb',
          triggerBg: '#ffe4f0',
          triggerColor: '#ED4192',
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
          circleTextColor: '#3f2330',
          defaultColor: '#ED4192',
          remainingColor: 'rgba(237, 65, 146, 0.14)',
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

export default useBlossomTheme
