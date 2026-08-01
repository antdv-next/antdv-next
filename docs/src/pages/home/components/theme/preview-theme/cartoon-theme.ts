import type { ConfigProviderProps } from 'antdv-next'
import { theme } from 'antdv-next'
import { createStyles } from 'antdv-style'
import { computed } from 'vue'

const useStyles = createStyles(({ css, cssVar }) => {
  const sharedBorder = {
    border: `${cssVar.lineWidth} ${cssVar.lineType} ${cssVar.colorBorder}`,
  }

  return {
    sharedBorder,
    notificationRoot: css({
      '&.ant-notification-notice, & .ant-notification-notice': {
        ...sharedBorder,
        boxShadow: 'none',
      },
    }),
    progressTrack: css({
      ...sharedBorder,
      marginInlineStart: `calc(-1 * ${cssVar.lineWidth})`,
      marginBlockStart: `calc(-1 * ${cssVar.lineWidth})`,
    }),
  }
})

function useCartoonTheme() {
  const { styles } = useStyles()

  return computed<ConfigProviderProps>(() => ({
    theme: {
      algorithm: theme.defaultAlgorithm,
      token: {
        colorText: '#51463B',
        colorPrimary: '#225555',
        colorError: '#DA8787',
        colorInfo: '#9CD3D3',
        colorInfoBorder: '#225555',
        colorBorder: '#225555',
        colorBorderSecondary: '#88BBBB',
        lineWidth: 2,
        lineWidthBold: 2,
        borderRadius: 18,
        borderRadiusLG: 18,
        borderRadiusSM: 18,
        controlHeightSM: 28,
        controlHeight: 36,
        colorBgBase: '#FAFAEE',
      },
      components: {
        Button: {
          primaryShadow: 'none',
          dangerShadow: 'none',
          defaultShadow: 'none',
        },
        Modal: {
          boxShadow: 'none',
        },
        Card: {
          colorBgContainer: '#BBAA99',
        },
        Tooltip: {
          borderRadius: 6,
          colorBorder: '#225555',
          algorithm: true,
        },
        Select: {
          optionSelectedBg: '#CBC4AF',
        },
        Notification: {
          colorSuccessBg: '#E0EECF',
          colorErrorBg: '#F3D0C8',
          colorInfoBg: '#D9EEEE',
          colorWarningBg: '#FFF1B8',
        },
        Layout: {
          bodyBg: '#FAFAEE',
          footerBg: '#FAFAEE',
          headerBg: '#F6D878',
          headerColor: '#51463B',
          siderBg: '#F5E8C0',
          triggerBg: '#E8D29A',
          triggerColor: '#51463B',
        },
        Menu: {
          activeBarBorderWidth: 0,
          itemBg: 'transparent',
          subMenuItemBg: 'transparent',
        },
        Alert: {},
        Checkbox: {},
        Radio: {},
        Input: {},
        Switch: {},
        Progress: {
          circleTextColor: '#51463B',
          defaultColor: '#225555',
          remainingColor: '#CBC4AF',
        },
        Steps: {},
        Slider: {},
        ColorPicker: {},
      },
    },
    modal: {
      classes: {
        container: styles.sharedBorder,
      },
    },
    colorPicker: {
      arrow: false,
    },
    popover: {
      classes: {
        container: styles.sharedBorder,
      },
    },
    notification: {
      classes: {
        root: styles.notificationRoot,
      },
    },
    progress: {
      classes: {
        rail: styles.sharedBorder,
        track: styles.progressTrack,
      },
      styles: {
        rail: {
          height: '16px',
        },
        track: {
          height: '16px',
        },
      },
    },
    wave: {},
    app: {},
    card: {},
    button: {},
    alert: {},
    checkbox: {},
    dropdown: {},
    select: {},
    datePicker: {},
    input: {},
    inputNumber: {},
    tooltip: {},
    switch: {},
    radio: {},
    segmented: {},
  }))
}

export default useCartoonTheme
