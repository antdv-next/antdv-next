import type { ButtonProps, ConfigProviderProps } from 'antdv-next'
import { clsx } from '@v-c/util'
import { theme } from 'antdv-next'
import { createStyles } from 'antdv-style'
import { computed } from 'vue'

const useStyles = createStyles(({ css, cssVar }) => {
  const glassBorder = {
    border: `${cssVar.lineWidth}px solid rgba(255,255,255,0.3)`,
    boxShadow: [
      `${cssVar.boxShadowSecondary}`,
      `inset 0 0 5px 2px rgba(255, 255, 255, 0.3)`,
      `inset 0 5px 2px rgba(255, 255, 255, 0.2)`,
    ].join(','),
  }

  const glassBox = {
    ...glassBorder,
    background: `color-mix(in srgb, ${cssVar.colorBgContainer} 15%, transparent)`,
    backdropFilter: 'blur(12px)',
  }

  const glassBoxNoBackdrop = {
    ...glassBox,
    backdropFilter: 'none',
  }

  return {
    app: css({
      textShadow: '0 1px rgba(0,0,0,0.1)',
    }),
    cardRoot: css({
      ...glassBox,
      backgroundColor: `color-mix(in srgb, ${cssVar.colorBgContainer} 40%, transparent)`,
    }),
    modalContainer: css({
      ...glassBox,
      backdropFilter: 'none',
    }),
    buttonRoot: css({
      ...glassBorder,
    }),
    buttonRootDefaultColor: css({
      background: 'transparent',
      color: cssVar.colorText,

      '&:hover': {
        background: 'rgba(255,255,255,0.2)',
        color: `color-mix(in srgb, ${cssVar.colorText} 90%, transparent)`,
      },

      '&:active': {
        background: 'rgba(255,255,255,0.1)',
        color: `color-mix(in srgb, ${cssVar.colorText} 80%, transparent)`,
      },
    }),
    glassBoxNoBackdrop: css({
      ...glassBoxNoBackdrop,
    }),
    glassBox: css({
      ...glassBox,
    }),
    dropdownRoot: css({
      ...glassBox,
      borderRadius: cssVar.borderRadiusLG,
    }),
    colorPickerPopupRoot: css({
      '& .ant-popover-container': {
        background: cssVar.colorBgElevated,
        border: `${cssVar.lineWidth}px solid ${cssVar.colorBorderSecondary}`,
        boxShadow: cssVar.boxShadowSecondary,
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
      },
    }),
    switchRoot: css({
      ...glassBorder,
      border: 'none',
    }),
    progressTrack: css({
      ...glassBorder,
      height: '12px',
    }),
    progressRail: css({
      height: '12px',
    }),
  }
})

function useGlassTheme() {
  const { styles } = useStyles()

  return computed<ConfigProviderProps>(() => ({
    theme: {
      algorithm: theme.defaultAlgorithm,
      token: {
        borderRadius: 12,
        borderRadiusLG: 12,
        borderRadiusSM: 12,
        borderRadiusXS: 12,
        motionDurationSlow: '0.2s',
        motionDurationMid: '0.1s',
        motionDurationFast: '0.05s',
      },
    },
    app: {
      classes: {
        root: styles.app,
      },
    },
    wave: {
      showEffect: () => {},
    },
    card: {
      classes: {
        root: styles.cardRoot,
      },
    },
    modal: {
      classes: {
        container: styles.modalContainer,
      },
    },
    button: {
      classes: ({ props }: { props: ButtonProps }) => ({
        root: clsx(styles.buttonRoot, props.color === 'default' && styles.buttonRootDefaultColor),
      }),
    },
    alert: {
      classes: {
        root: styles.glassBoxNoBackdrop,
      },
    },
    colorPicker: {
      arrow: false,
      classes: {
        popup: {
          root: styles.colorPickerPopupRoot,
        },
      },
    },
    dropdown: {
      classes: {
        root: styles.dropdownRoot,
      },
    },
    select: {
      classes: {
        root: styles.glassBoxNoBackdrop,
        popup: {
          root: styles.glassBox,
        },
      },
    },
    popover: {
      classes: {
        container: styles.glassBox,
      },
    },
    switch: {
      classes: {
        root: styles.switchRoot,
      },
    },
    progress: {
      classes: {
        track: styles.progressTrack,
        rail: styles.progressRail,
      },
      styles: {
        rail: {
          height: '12px',
        },
        track: {
          height: '12px',
        },
      },
    },
  }))
}

export default useGlassTheme
