import type { App, CSSProperties, SlotsType } from 'vue'
import type {
  QRCodeProps as BaseQRCodeProps,
  ImageSettings,
  QRCodeClassNamesType,
  QRCodeEmits,
  QRCodeSlots,
  QRCodeStylesType,
} from './interface'
import { QRCodeCanvas, QRCodeSVG } from '@v-c/qrcode'
import { classNames } from '@v-c/util'
import pickAttrs from '@v-c/util/dist/pickAttrs'
import { omit } from 'es-toolkit'
import { computed, defineComponent } from 'vue'
import { useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { toPropsRefs } from '../_util/tools.ts'
import { devUseWarning, isDev } from '../_util/warning.ts'
import { useComponentBaseConfig } from '../config-provider/context'
import useLocale from '../locale/useLocale.ts'
import { useToken } from '../theme/internal.ts'
import QRcodeStatus from './QrcodeStatus.tsx'

import useStyle from './style/index'

export type {
  QRCodeEmits,
}

const defaults = {
  type: 'canvas',
  icon: '',
  size: 160,
  bordered: true,
  errorLevel: 'M',
  status: 'active',
  bgColor: 'transparent',
} as any

export interface InternalQRCodeProps extends BaseQRCodeProps,
  /* @vue-ignore */
  QRCodeEmitsProps {}

export interface QRCodeEmitsProps {
  onRefresh?: QRCodeEmits['refresh']
}

const QRCode = defineComponent<
  InternalQRCodeProps,
  QRCodeEmits,
  string,
  SlotsType<QRCodeSlots>
>(
  (props = defaults, { emit, attrs, slots }) => {
    const {
      prefixCls,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('qrcode', props)
    const { styles, classes } = toPropsRefs(props, 'styles', 'classes')
    const [hashId, cssVarCls] = useStyle(prefixCls)
    const [locale] = useLocale('QRCode')
    const [,token] = useToken()
    const color = computed(() => props.color ?? token.value.colorText)

    const imageSettings = computed(() => {
      const { icon, iconSize } = props
      return {
        src: icon,
        x: undefined,
        y: undefined,
        height: typeof iconSize === 'number' ? iconSize : (iconSize?.height ?? 40),
        width: typeof iconSize === 'number' ? iconSize : (iconSize?.width ?? 40),
        excavate: true,
        crossOrigin: 'anonymous',
      } as ImageSettings
    })

    // =========== Merged Props for Semantic ===========
    const mergedProps = computed(() => {
      return props
    })
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      QRCodeClassNamesType,
      QRCodeStylesType,
      BaseQRCodeProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    return () => {
      const {
        type,
        value,
        size,
        errorLevel,
        bgColor,
        icon,
        boostLevel,
        bordered,
        rootClass,
        status,
        marginSize,
      } = props
      const statusRender = slots?.statusRender ?? props?.statusRender
      const a11yProps = pickAttrs(attrs, true)
      const restProps = omit(attrs, Object.keys(a11yProps))
      const style = (attrs as any).style
      const cls = (attrs as any).class

      const qrCodeProps = {
        value,
        size,
        level: errorLevel,
        bgColor,
        fgColor: color.value,
        style: { width: style?.width, height: style?.height },
        imageSettings: icon ? imageSettings.value : undefined,
        boostLevel,
        marginSize,
        ...a11yProps,
      }
      if (isDev) {
        const warning = devUseWarning('QRCode')
        warning(!!value, 'usage', 'need to receive `value` props')

        warning(
          !(icon && errorLevel === 'L'),
          'usage',
          'ErrorLevel `L` is not recommended to be used with `icon`, for scanning result would be affected by low level.',
        )
      }
      if (!value) {
        return null
      }

      const mergedCls = classNames(
        prefixCls.value,
        cls,
        rootClass,
        hashId.value,
        cssVarCls.value,
        contextClassName.value,
        mergedClassNames.value.root,
        {
          [`${prefixCls.value}-borderless`]: !bordered,
        },
      )

      let _width = style?.width ?? size
      let _height = style?.height ?? size
      if (typeof _width === 'number') {
        _width = `${_width}px`
      }
      if (typeof _height === 'number') {
        _height = `${_height}px`
      }

      const rootStyle: CSSProperties = {
        backgroundColor: bgColor,
        ...mergedStyles.value?.root,
        ...contextStyle.value,
        ...style,
        width: _width,
        height: _height,
      }
      return (
        <div {...restProps} class={mergedCls} style={rootStyle}>
          {status !== 'active' && (
            <div
              class={[`${prefixCls.value}-cover`, mergedClassNames.value.cover]}
              style={mergedStyles.value.cover}
            >
              <QRcodeStatus
                prefixCls={prefixCls.value}
                locale={locale!.value!}
                status={status!}
                onRefresh={() => {
                  emit('refresh')
                }}
                statusRender={statusRender}
              />
            </div>
          )}
          {type === 'canvas' ? <QRCodeCanvas {...qrCodeProps as any} /> : <QRCodeSVG {...qrCodeProps as any} />}
        </div>
      )
    }
  },
  {
    name: 'AQrcode',
    inheritAttrs: false,
  },
)
;(QRCode as any).install = (app: App) => {
  app.component(QRCode.name, QRCode)
}

export type QRCodeProps = InternalQRCodeProps

export default QRCode
