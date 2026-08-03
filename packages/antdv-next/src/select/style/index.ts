import type { CSSObject } from '@antdv-next/cssinjs'

import type { GenerateStyle } from '../../theme/internal'
import type { ComponentToken, SelectToken } from './token'
import { genFocusOutline, resetComponent, textEllipsis } from '../../style'
import { genCompactItemStyle } from '../../style/compact-item'
import { genStyleHooks, mergeToken } from '../../theme/internal'
import genDropdownStyle from './dropdown'
import genSelectInputStyle from './select-input'
import { prepareComponentToken } from './token'

export type { ComponentToken }

// =============================== Base ===============================
const genBaseStyle: GenerateStyle<SelectToken, CSSObject> = (token) => {
  const { antCls, componentCls, motionDurationMid, inputPaddingHorizontalBase } = token

  const hoverShowClearStyle: CSSObject = {
    [`${componentCls}-clear`]: {
      opacity: 1,
    },
    // Hide the suffix so it does not sit under the clear button — but never a
    // suffix that holds keyboard focus. A custom suffix may be focusable, and
    // `pointer-events: none` does not take it out of the tab order, so hiding
    // it would strand focus on an invisible control.
    [`${componentCls}-suffix:not(:last-child):not(:focus-within)`]: {
      opacity: 0,
      pointerEvents: 'none',
    },
    [`&${componentCls}-allow-clear:not(${componentCls}-show-arrow) ${componentCls}-content`]: {
      marginInlineEnd: token.showArrowPaddingInlineEnd,
    },
  }

  return {
    [componentCls]: {
      ...resetComponent(token),

      // ======================== Selection ========================
      [`${componentCls}-selection-item`]: {
        flex: 1,
        fontWeight: 'normal',
        position: 'relative',
        userSelect: 'none',
        ...textEllipsis,

        // https://github.com/ant-design/ant-design/issues/40421
        [`> ${antCls}-typography`]: {
          display: 'inline',
        },
      },

      // ========================= Prefix ==========================
      [`${componentCls}-prefix`]: {
        flex: 'none',
        marginInlineEnd: token.selectAffixPadding,
      },

      // ========================== Clear ==========================
      [`${componentCls}-clear`]: {
        position: 'absolute',
        top: '50%',
        insetInlineStart: 'auto',
        insetInlineEnd: inputPaddingHorizontalBase,
        zIndex: 1,
        display: 'inline-block',
        width: token.fontSizeIcon,
        height: token.fontSizeIcon,
        marginTop: token.calc(token.fontSizeIcon).mul(-1).div(2).equal(),
        color: token.colorTextQuaternary,
        fontSize: token.fontSizeIcon,
        fontStyle: 'normal',
        lineHeight: 1,
        textAlign: 'center',
        textTransform: 'none',
        // The clear affordance is a real `<button>` for keyboard access, so
        // the browser's default control chrome has to be reset away.
        // antd still renders a `<span>` here (rc-select ~1.8.2), so this reset
        // has no React counterpart yet — it mirrors the DatePicker one.
        padding: 0,
        fontFamily: 'inherit',
        background: 'transparent',
        border: 0,
        appearance: 'none',
        cursor: 'pointer',
        opacity: 0,
        transition: ['color', 'opacity']
          .map(prop => `${prop} ${motionDurationMid} ease`)
          .join(', '),
        textRendering: 'auto',
        // https://github.com/ant-design/ant-design/issues/54205
        // Force GPU compositing on Safari to prevent flickering on opacity/transform transitions
        transform: 'translateZ(0)',

        '&:before': {
          display: 'block',
        },

        '&:hover': {
          color: token.colorIcon,
        },

        // The clear affordance is a focusable `<button>`, so it must become
        // visible and outlined when reached by keyboard — otherwise Tab lands
        // on an invisible control. Mirrors the DatePicker rules.
        '&:focus-visible': {
          color: token.colorIcon,
          borderRadius: token.borderRadiusSM,
          ...genFocusOutline(token),
        },
      },

      '@media(hover:none)': hoverShowClearStyle,
      '&:hover, &:focus-within': hoverShowClearStyle,
    },

    // ========================= Feedback ==========================
    [`${componentCls}-status`]: {
      '&-error, &-warning, &-success, &-validating': {
        [`&${componentCls}-has-feedback`]: {
          [`${componentCls}-clear`]: {
            insetInlineEnd: token
              .calc(inputPaddingHorizontalBase)
              .add(token.fontSize)
              .add(token.paddingXS)
              .equal(),
          },
        },
      },
    },
  }
}

// ============================== Styles ==============================
const genSelectStyle: GenerateStyle<SelectToken> = (token) => {
  const { componentCls } = token

  return [
    {
      [componentCls]: {
        // ==================== In Form ====================
        [`&${componentCls}-in-form-item`]: {
          width: '100%',
        },
      },
    },

    // =====================================================
    // ==                       LTR                       ==
    // =====================================================
    // Base
    genBaseStyle(token),

    // Dropdown
    genDropdownStyle(token),

    // =====================================================
    // ==                       RTL                       ==
    // =====================================================
    {
      [`${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },

    // =====================================================
    // ==             Space Compact                       ==
    // =====================================================
    genCompactItemStyle(token, {
      focusElCls: `${componentCls}-focused`,
    }),
  ]
}

// ============================== Export ==============================
export default genStyleHooks(
  'Select',
  (token, { rootPrefixCls }) => {
    const selectToken: SelectToken = mergeToken<SelectToken>(token, {
      rootPrefixCls,
      inputPaddingHorizontalBase: token.calc(token.paddingSM).sub(token.lineWidth).equal(),
      multipleSelectItemHeight: token.multipleItemHeight,
      selectHeight: token.controlHeight,
    })

    return [genSelectStyle(selectToken), genSelectInputStyle(selectToken)]
  },
  prepareComponentToken,
  {
    unitless: {
      optionLineHeight: true,
      optionSelectedFontWeight: true,
    },
  },
)
