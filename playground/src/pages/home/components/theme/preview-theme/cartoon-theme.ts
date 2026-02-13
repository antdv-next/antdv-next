import type { ConfigProviderProps } from 'antdv-next'
import type { UseTheme } from '.'
import { theme } from 'antdv-next'
import { computed } from 'vue'
import { createStyles } from '../hooks'

const useStyles = createStyles(({ css, cssVar }) => {
  const sharedBorder = {
    border: `${cssVar.lineWidth}px ${cssVar.lineType} ${cssVar.colorBorder}`,
  }

  return {
    sharedBorder: css(sharedBorder),
    progressTrack: css({
      border: `${cssVar.lineWidth} ${cssVar.lineType} ${cssVar.colorBorder}`,
      marginInlineStart: `calc(-1 * ${cssVar.lineWidth})`,
      marginBlockStart: `calc(-1 * ${cssVar.lineWidth})`,
    }),
  }
})

const useCartoonTheme: UseTheme = () => {
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
        colorBorderSecondary: '#225555',
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
          colorText: '#51463B',
          colorPrimary: '#225555',
          colorError: '#DA8787',
          colorInfo: '#9CD3D3',
          colorInfoBorder: '#225555',
          colorBorder: '#225555',
          colorBorderSecondary: '#225555',
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
      },
    },
    modal: {
      classes: {
        container: styles.sharedBorder,
      },
    },
    // colorPicker: {
    //   arrow: false,
    // },
    popover: {
      classes: {
        root: styles.sharedBorder,
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
  }))
}

export default useCartoonTheme
