import type { ConfigProviderProps } from 'antdv-next'
import { theme } from 'antdv-next'
import { createStyles } from 'antdv-style'
import { computed } from 'vue'

const useStyles = createStyles(({ cssVar, css }) => {
  const sharedBorder = {
    border: `${cssVar.lineWidth}px ${cssVar.lineType} ${cssVar.colorBorder}`,
  }

  return {
    sharedBorder: css(sharedBorder),
    progressTrack: css({
      ...sharedBorder,
      marginInlineStart: `calc(-1 * ${cssVar.lineWidth}px)`,
      marginBlockStart: `calc(-1 * ${cssVar.lineWidth}px)`,
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
    colorPicker: {
      arrow: false,
    },
    popover: {
      arrow: false,
      classes: {
        root: styles.sharedBorder,
      },
    },
    progress: {
      classes: {
        rail: styles.sharedBorder,
      },
      styles: {
        rail: {
          border: '2px solid #225555',
          boxSizing: 'border-box',
          height: '16px',
        },
        track: {
          border: '2px solid #225555',
          boxSizing: 'border-box',
          height: '16px',
          marginInlineStart: '-2px',
          marginBlockStart: '-2px',
        },
      },
    },
  }))
}

export default useCartoonTheme
