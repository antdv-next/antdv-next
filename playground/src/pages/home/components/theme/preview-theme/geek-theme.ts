import type { ConfigProviderProps } from 'antdv-next'
import type { UseTheme } from '.'
import { clsx } from '@v-c/util'
import { theme } from 'antdv-next'
import { computed } from 'vue'
import { createStyles } from '../hooks'

const useStyles = createStyles(({ css, cssVar }) => {
  const lightBorder = {
    border: `${cssVar.lineWidth} solid ${cssVar.colorPrimary}`,
    boxShadow: `0 0 3px ${cssVar.colorPrimary}, inset 0 0 10px ${cssVar.colorPrimary}`,
  }

  return {
    lightBorder: css(lightBorder),
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
        left: 0,
        right: 0,
        bottom: 0,
        border: 0,
        height: `${cssVar.lineWidth}px`,
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
      ...lightBorder,
      // border: undefined, // Not supported in this object spread context directly to unset
      borderWidth: `${cssVar.lineWidth}`,
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
      padding: `${cssVar.padding}`,
    }),
    tooltipContainer: css({
      ...lightBorder,
      color: cssVar.colorPrimary,
    }),
    progressTrack: css({
      backgroundColor: cssVar.colorPrimary,
    }),
  }
})

const useGeekTheme: UseTheme = () => {
  const { styles } = useStyles()

  return computed<ConfigProviderProps>(() => ({
    theme: {
      algorithm: theme.darkAlgorithm,
      token: {
        borderRadius: 0,
        lineWidth: 2,
        colorPrimary: '#39ff14',
        colorText: '#39ff14',
        controlHeightSM: 26,
        controlHeight: 34,
      },
    },
    app: {
      classes: {
        root: styles.app,
      },
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
      classes: ({ props }) => ({
        root: clsx(
          styles.buttonRoot,
          props.variant === 'solid' && styles.buttonRootSolid,
          props.variant === 'solid' && props.danger && styles.buttonRootSolidDanger,
        ),
      }),
    },

    alert: {
      classes: {
        root: styles.lightBorder,
      },
    },
    colorPicker: {
      classes: {
        root: styles.lightBorder,
        body: styles.colorPickerBody,
      },
      arrow: false,
    },
    select: {
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
        popup: styles.tooltipContainer,
      },
    },
    progress: {
      classes: {
        track: styles.progressTrack,
      },
    },
  }))
}

export default useGeekTheme
