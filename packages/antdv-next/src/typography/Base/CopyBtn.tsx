import type { App, CSSProperties, SlotsType } from 'vue'
import type { Locale } from '../../locale'
import type { CopyConfig } from '../interface'
import { CheckOutlined, CopyOutlined, LoadingOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { defineComponent } from 'vue'
import Tooltip from '../../tooltip'
import { getNode, toList } from './util'

export interface CopyBtnProps extends Omit<CopyConfig, 'onCopy'> {
  prefixCls: string
  copied: boolean
  locale: Locale['Text']
  iconOnly: boolean
  loading: boolean
  className?: string
  style?: CSSProperties
}

export interface CopyBtnEmits {
  copy: (e: MouseEvent) => void
}

const CopyBtn = defineComponent<
  CopyBtnProps,
  CopyBtnEmits,
  string,
  SlotsType<Record<string, never>>
>(
  (props, { emit }) => {
    const handleCopy = (e: MouseEvent) => {
      emit('copy', e)
    }

    return () => {
      const tooltipNodes = toList(props.tooltips as any)
      const iconNodes = toList(props.icon as any)
      const { copied: copiedText, copy: copyText } = props.locale ?? {}
      const systemStr = props.copied ? copiedText : copyText
      const copyTitle = getNode(tooltipNodes[props.copied ? 1 : 0], systemStr as any)
      const ariaLabel = typeof copyTitle === 'string' ? copyTitle : (systemStr as string)

      return (
        <Tooltip title={copyTitle}>
          <button
            type="button"
            class={classNames(
              `${props.prefixCls}-copy`,
              {
                [`${props.prefixCls}-copy-success`]: props.copied,
                [`${props.prefixCls}-copy-icon-only`]: props.iconOnly,
              },
              props.className,
            )}
            onClick={handleCopy}
            aria-label={ariaLabel}
            tabindex={props.tabIndex}
            style={props.style}
          >
            {props.copied
              ? getNode(iconNodes[1], <CheckOutlined />, true)
              : getNode(iconNodes[0], props.loading ? <LoadingOutlined /> : <CopyOutlined />, true)}
          </button>
        </Tooltip>
      )
    }
  },
  {
    name: 'TypographyCopyBtn',
    inheritAttrs: false,
  },
)

;(CopyBtn as any).install = (app: App) => {
  app.component(CopyBtn.name, CopyBtn)
}

export default CopyBtn
