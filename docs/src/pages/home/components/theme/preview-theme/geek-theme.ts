import type { ButtonProps, ConfigProviderProps } from 'antdv-next'
import { theme } from 'antdv-next'
import { createStyles, cx } from 'antdv-style'
import { computed } from 'vue'

const useStyles = createStyles(({ css, cssVar }) => {
  const lightBorder = {
    border: `${cssVar.lineWidth} solid ${cssVar.colorPrimary}`,
    boxShadow: `0 0 3px ${cssVar.colorPrimary}, inset 0 0 10px ${cssVar.colorPrimary}`,
  }

  return {
    lightBorder,
    app: css({
      textShadow: '0 0 5px color-mix(in srgb, currentColor 50%, transparent)',
    }),
    modalContainer: css({
      ...lightBorder,
      padding: 0,
    }),
    modalHeader: css({
      padding: `${cssVar.padding} ${cssVar.paddingLG}`,
      margin: 0,
      position: 'relative',

      '&:after': {
        ...lightBorder,
        content: '""',
        position: 'absolute',
        insetInline: 0,
        bottom: 0,
        border: 0,
        height: cssVar.lineWidth,
        background: cssVar.colorPrimary,
      },
    }),
    modalBody: css({
      padding: `${cssVar.padding} ${cssVar.paddingLG}`,
    }),
    modalFooter: css({
      padding: `${cssVar.padding} ${cssVar.paddingLG}`,
    }),

    buttonRoot: css({
      boxShadow: lightBorder.boxShadow,
      borderWidth: cssVar.lineWidth,
      borderColor: cssVar.colorPrimary,
    }),
    buttonRootSolid: css({
      color: cssVar.colorBgContainer,
      border: 'none',
      fontWeight: 'bolder',
    }),
    buttonRootSolidDanger: css({
      boxShadow: `0 0 5px ${cssVar.colorError}`,
    }),

    colorPickerBody: css({
      pointerEvents: 'none',
    }),
    tooltipRoot: css({
      padding: cssVar.padding,
    }),
    tooltipContainer: css({
      ...lightBorder,
      color: cssVar.colorPrimary,
    }),
    notificationRoot: css({
      '&.ant-notification-notice, & .ant-notification-notice': {
        ...lightBorder,
        background: cssVar.colorBgContainer,
        color: cssVar.colorPrimary,
      },
    }),
    notificationText: css({
      color: cssVar.colorPrimary,
    }),
    notificationClose: css({
      color: cssVar.colorPrimary,
    }),
    progressTrack: css({
      backgroundColor: cssVar.colorPrimary,
    }),
    menuRoot: css({
      '&.ant-menu.ant-menu-dark .ant-menu-submenu-selected > .ant-menu-submenu-title': {
        color: cssVar.colorPrimary,
      },
      '&.ant-menu.ant-menu-dark .ant-menu-item-selected': {
        color: '#000',
      },
    }),
  }
})

function useGeekTheme() {
  const { styles } = useStyles()

  return computed<ConfigProviderProps>(() => ({
    theme: {
      algorithm: theme.darkAlgorithm,
      token: {
        borderRadius: 0,
        lineWidth: 2,
        colorPrimary: '#39ff14',
        colorText: '#39ff14',
        colorInfo: '#39ff14',
        controlHeightSM: 26,
        controlHeight: 34,
      },
      components: {
        Notification: {
          colorSuccessBg: 'rgba(57, 255, 20, 0.08)',
          colorErrorBg: 'rgba(255, 77, 79, 0.12)',
          colorInfoBg: 'rgba(57, 255, 20, 0.08)',
          colorWarningBg: 'rgba(250, 219, 20, 0.12)',
        },
        Layout: {
          bodyBg: '#030603',
          footerBg: '#030603',
          headerBg: '#051105',
          headerColor: '#39ff14',
          siderBg: '#030603',
          triggerBg: '#051105',
          triggerColor: '#39ff14',
        },
        Menu: {
          darkGroupTitleColor: 'rgba(57, 255, 20, 0.45)',
          darkItemBg: 'transparent',
          darkItemColor: 'rgba(57, 255, 20, 0.72)',
          darkItemHoverBg: 'rgba(57, 255, 20, 0.12)',
          darkItemHoverColor: '#39ff14',
          darkItemSelectedBg: '#39ff14',
          darkItemSelectedColor: '#39ff14',
          darkPopupBg: '#030603',
          darkSubMenuItemBg: 'transparent',
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
          circleTextColor: '#39ff14',
          defaultColor: '#39ff14',
          remainingColor: 'rgba(57, 255, 20, 0.18)',
        },
        Steps: {},
        Slider: {},
        ColorPicker: {},
      },
    },
    app: {
      class: styles.app,
    },
    modal: {
      classes: {
        container: styles.modalContainer,
        header: styles.modalHeader,
        body: styles.modalBody,
        footer: styles.modalFooter,
      },
    },
    button: {
      classes: ({ props }: { props: ButtonProps }) => ({
        root: cx(
          styles.buttonRoot,
          props.variant === 'solid' && styles.buttonRootSolid,
          props.variant === 'solid' && props.danger && styles.buttonRootSolidDanger,
        ),
      }),
    },

    alert: {
      class: styles.lightBorder,
    },
    colorPicker: {
      arrow: false,
      classes: {
        root: styles.lightBorder,
        body: styles.colorPickerBody,
      },
    },
    select: {
      classes: {
        root: styles.lightBorder,
      },
    },
    datePicker: {
      classes: {
        root: styles.lightBorder,
      },
    },
    input: {
      classes: {
        root: styles.lightBorder,
      },
    },
    inputNumber: {
      classes: {
        root: styles.lightBorder,
      },
    },
    tooltip: {
      arrow: false,
      classes: {
        root: styles.tooltipRoot,
        container: styles.tooltipContainer,
      },
    },
    notification: {
      classes: {
        root: styles.notificationRoot,
        title: styles.notificationText,
        description: styles.notificationText,
        close: styles.notificationClose,
      },
    },
    progress: {
      classes: {
        track: styles.progressTrack,
      },
    },
    wave: {},
    card: {},
    checkbox: {},
    dropdown: {},
    popover: {},
    menu: {
      classes: {
        root: styles.menuRoot,
      },
    },
    switch: {},
    radio: {},
    segmented: {},
  }))
}

export default useGeekTheme
