import type { ButtonProps, ConfigProviderProps } from 'antdv-next'
import { clsx } from '@v-c/util'
import { theme } from 'antdv-next'
import { createStyles } from 'antdv-style'
import { computed } from 'vue'

const useStyles = createStyles(({ css, cssVar }) => {
  const glassBorder = {
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

  return {
    glassBorder: css({
      ...glassBorder,
    }),
    glassBox: css({
      ...glassBox,
    }),
    notBackdropFilter: css({
      backdropFilter: 'none',
    }),
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
    dropdownRoot: css({
      ...glassBox,
      borderRadius: cssVar.borderRadiusLG,

      ul: {
        background: 'transparent',
      },
    }),
    switchRoot: css({
      ...glassBorder,
      border: 'none',
    }),
    segmentedRoot: css({
      ...glassBorder,
      background: 'transparent',
      backdropFilter: 'none',

      '& .ant-segmented-thumb': {
        ...glassBox,
      },

      '& .ant-segmented-item-selected': {
        ...glassBox,
      },
    }),
    radioButtonRoot: css({
      '&.ant-radio-button-wrapper': {
        ...glassBorder,
        background: 'transparent',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        color: cssVar.colorText,

        '&:hover': {
          borderColor: 'rgba(255, 255, 255, 0.24)',
          color: cssVar.colorText,
        },

        '&.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)': {
          ...glassBox,
          borderColor: 'rgba(255, 255, 255, 0.28)',
          color: cssVar.colorText,

          '&::before': {
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
          },

          '&:hover': {
            color: cssVar.colorText,
          },
        },
      },
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
      class: styles.app,
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
        root: clsx(
          styles.buttonRoot,
          (props.variant !== 'solid' || props.color === 'default' || props.type === 'default') && styles.buttonRootDefaultColor,
        ),
      }),
    },
    alert: {
      class: clsx(styles.glassBox, styles.notBackdropFilter),
    },
    colorPicker: {
      arrow: false,
      classes: {
        root: clsx(styles.glassBox, styles.notBackdropFilter),
      },
    },
    dropdown: {
      classes: {
        root: styles.dropdownRoot,
      },
    },
    select: {
      classes: {
        root: clsx(styles.glassBox, styles.notBackdropFilter),
        popup: {
          root: styles.glassBox,
        },
      },
    },
    datePicker: {
      classes: {
        root: clsx(styles.glassBox, styles.notBackdropFilter),
        popup: {
          container: styles.glassBox,
        },
      },
    },
    input: {
      classes: {
        root: clsx(styles.glassBox, styles.notBackdropFilter),
      },
    },
    inputNumber: {
      classes: {
        root: clsx(styles.glassBox, styles.notBackdropFilter),
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
    radio: {
      classes: {
        root: styles.radioButtonRoot,
      },
    },
    segmented: {
      class: styles.segmentedRoot,
    },
    progress: {
      classes: {
        track: styles.glassBorder,
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
