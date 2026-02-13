import type { ConfigProviderProps } from 'antdv-next'
import type { UseTheme } from '.'
import { theme } from 'antdv-next'
import { computed } from 'vue'
import { createStyles } from '../hooks'

const useStyles = createStyles(({ css, cssVar }) => {
  const illustrationBorder = {
    border: `${cssVar.lineWidth} solid ${cssVar.colorBorder}`,
  }

  const illustrationBox = {
    ...illustrationBorder,
    boxShadow: `4px 4px 0 ${cssVar.colorBorder}`,
  }

  return {
    illustrationBorder: css(illustrationBorder),
    illustrationBox: css(illustrationBox),
    buttonRoot: css({
      ...illustrationBox,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }),
    modalContainer: css({
      ...illustrationBox,
    }),
    tooltipRoot: css({
      padding: cssVar.padding,
    }),
    popupBox: css({
      ...illustrationBox,
      borderRadius: cssVar.borderRadiusLG,
      backgroundColor: cssVar.colorBgContainer,
    }),
    progressRail: css({
      border: `${cssVar.lineWidth} solid ${cssVar.colorBorder}`,
      boxShadow: `2px 2px 0 ${cssVar.colorBorder}`,
    }),
    progressTrack: css({
      border: 'none',
    }),
    inputNumberActions: css({
      width: '12px',
    }),
  }
})

const useIllustrationTheme: UseTheme = () => {
  const { styles } = useStyles()

  return computed<ConfigProviderProps>(() => ({
    theme: {
      algorithm: theme.defaultAlgorithm,
      token: {
        colorText: '#2C2C2C',
        colorPrimary: '#52C41A',
        colorSuccess: '#51CF66',
        colorWarning: '#FFD93D',
        colorError: '#FA5252',
        colorInfo: '#4DABF7',
        colorBorder: '#2C2C2C',
        colorBorderSecondary: '#2C2C2C',
        lineWidth: 3,
        lineWidthBold: 3,
        borderRadius: 12,
        borderRadiusLG: 16,
        borderRadiusSM: 8,
        controlHeight: 40,
        controlHeightSM: 34,
        controlHeightLG: 48,
        fontSize: 15,
        fontWeightStrong: 600,
        colorBgBase: '#FFF9F0',
        colorBgContainer: '#FFFFFF',
      },
      components: {
        Button: {
          primaryShadow: 'none',
          dangerShadow: 'none',
          defaultShadow: 'none',
          fontWeight: 600,
        },
        Modal: {
          boxShadow: 'none',
        },
        Card: {
          boxShadow: '4px 4px 0 #2C2C2C',
          colorBgContainer: '#FFF0F6',
        },
        Tooltip: {
          colorBorder: '#2C2C2C',
          colorBgSpotlight: 'rgba(100, 100, 100, 0.95)',
          borderRadius: 8,
        },
        Select: {
          optionSelectedBg: 'transparent',
        },
        Slider: {
          dotBorderColor: '#237804',
          dotActiveBorderColor: '#237804',
          colorPrimaryBorder: '#237804',
          colorPrimaryBorderHover: '#237804',
        },
      },
    },
    button: {
      classes: {
        root: styles.buttonRoot,
      },
    },
    modal: {
      classes: {
        container: styles.modalContainer,
      },
    },
    alert: {
      classes: {
        root: styles.illustrationBorder,
      },
    },
    colorPicker: {
      classes: {
        root: styles.illustrationBox,
      },
    },
    popover: {
      classes: {
        root: styles.illustrationBox,
      },
    },
    tooltip: {
      classes: {
        root: styles.tooltipRoot,
        inner: styles.illustrationBox,
      },
    },
    dropdown: {
      classes: {
        root: styles.popupBox,
      },
    },
    select: {
      classes: {
        root: styles.illustrationBox,
        popup: {
          root: styles.popupBox,
        },
      },
    },
    input: {
      classes: {
        root: styles.illustrationBox,
      },
    },
    inputNumber: {
      classes: {
        root: styles.illustrationBox,
        actions: styles.inputNumberActions,
      },
    },
    progress: {
      classes: {
        rail: styles.progressRail,
        track: styles.progressTrack,
      },
      styles: {
        rail: {
          height: '16px',
        },
        track: {
          height: '10px',
        },
      },
    },
  }))
}

export default useIllustrationTheme
