import type { ConfigProviderProps } from 'antdv-next'
import type { UseTheme } from '.'
import { clsx } from '@v-c/util'
import { theme } from 'antdv-next'
import { computed } from 'vue'
import { createStyles } from '../hooks'

const useStyles = createStyles(({ css, cssVar }) => {
  console.log(cssVar, 'cssVar')

  return {
    boxBorder: css({
      border: `${cssVar.lineWidth} ${cssVar.lineType} color-mix(in srgb,${cssVar.colorBorder} 80%, #000)`,
    }),
    alertRoot: css({
      color: cssVar.colorInfoText,
      textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)',
    }),

    modalContainer: css({
      padding: 0,
      borderRadius: cssVar.borderRadiusLG,
    }),
    modalHeader: css({
      borderBottom: `${cssVar.lineWidth} ${cssVar.lineType} ${cssVar.colorSplit}`,
      padding: `${cssVar.padding} ${cssVar.paddingLG}`,
    }),
    modalBody: css({
      padding: `${cssVar.padding} ${cssVar.paddingLG}`,
    }),
    modalFooter: css({
      borderTop: `${cssVar.lineWidth} ${cssVar.lineType} ${cssVar.colorSplit}`,
      padding: `${cssVar.padding} ${cssVar.paddingLG}`,
      backgroundColor: cssVar.colorBgContainerDisabled,
      boxShadow: `inset 0 1px 0 ${cssVar.colorBgContainer}`,
    }),
    buttonRoot: css({
      backgroundImage: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.2))',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      transition: 'none',
      borderColor: 'rgba(0, 0, 0, 0.3)',
      textShadow: '0 -1px 0 rgba(0, 0, 0, 0.2)',
      '&:hover, &:active': {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15) 100%)`,
      },

      '&:active': {
        boxShadow: `inset 0 1px 3px rgba(0, 0, 0, 0.15)`,
      },
    }),
    buttonColorDefault: css({
      textShadow: 'none',
      color: cssVar.colorText,
      borderBottomColor: 'rgba(0, 0, 0, 0.5)',
    }),
    popupBox: css({
      borderRadius: cssVar.borderRadiusLG,
      backgroundColor: cssVar.colorBgContainer,

      ul: {
        paddingInline: 0,
      },
    }),
    dropdownItem: css({
      borderRadius: 0,
      transition: 'none',
      paddingBlock: cssVar.paddingXXS,
      paddingInline: cssVar.padding,

      '&:hover, &:active, &:focus': {
        backgroundImage: `linear-gradient(to bottom, ${cssVar.colorPrimaryHover}, ${cssVar.colorPrimary})`,
        color: cssVar.colorTextLightSolid,
      },
    }),
    selectPopupRoot: css({
      paddingInline: 0,
    }),
    switchRoot: css({
      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.4)',
    }),
    progressTrack: css({
      backgroundImage: `linear-gradient(to bottom, ${cssVar.colorPrimaryHover}, ${cssVar.colorPrimary})`,
      borderRadius: cssVar.borderRadiusSM,
    }),
    progressRail: css({
      borderRadius: cssVar.borderRadiusSM,
    }),
  }
})

const useBootstrapTheme: UseTheme = () => {
  const { styles } = useStyles()

  return computed<ConfigProviderProps>(() => ({
    theme: {
      algorithm: theme.defaultAlgorithm,
      token: {
        borderRadius: 4,
        borderRadiusLG: 6,
        colorInfo: '#3a87ad',
      },
      components: {
        Tooltip: {
          fontSize: 12,
        },
        Checkbox: {
          colorBorder: '#666',
          borderRadius: 2,
          algorithm: true,
        },
        Radio: {
          colorBorder: '#666',
          borderRadius: 2,
          algorithm: true,
        },
      },
    },
    wave: {
      showEffect: () => {},
    },

    modal: {
      classes: {
        container: clsx(styles.boxBorder, styles.modalContainer),
        header: styles.modalHeader,
        body: styles.modalBody,
        footer: styles.modalFooter,
      },
    },
    button: {
      classes: ({ props }) => ({
        root: clsx(styles.buttonRoot, props.color === 'default' && styles.buttonColorDefault),
      }),
    },

    alert: {
      classes: styles.alertRoot,
    },
    colorPicker: {
      classes: {
        root: styles.boxBorder,
        popup: {
          root: clsx(styles.boxBorder, styles.popupBox),
        },
      },
      arrow: false,
    },
    checkbox: {
      classes: {},
    },
    dropdown: {
      classes: {
        root: clsx(styles.boxBorder, styles.popupBox),
        item: styles.dropdownItem,
      },
    },
    select: {
      classes: {
        root: styles.boxBorder,
        popup: {
          root: clsx(styles.boxBorder, styles.selectPopupRoot),
          listItem: styles.dropdownItem,
        },
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
          height: '20px',
        },
        track: { height: '20px' },
      },
    },
  }))
}
export default useBootstrapTheme
