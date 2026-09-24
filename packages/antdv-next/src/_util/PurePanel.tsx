import type { CSSProperties } from 'vue'
import { defineComponent, shallowRef, useAttrs, useSlots, watch } from 'vue'
import ConfigProvider from '../config-provider'
import { useBaseConfig } from '../config-provider/context.ts'
import { normalizeStyle } from './styleUtils'

export interface BaseProps {
  prefixCls?: string
  style?: CSSProperties
  open?: boolean
}

export function withPureRenderTheme(Component: any) {
  return (props: any) => {
    const slots = useSlots()
    const attrs = useAttrs()
    return (
      <ConfigProvider theme={{ token: { motion: false, zIndexPopupBase: 0 } }}>
        <Component {...{ ...props, ...attrs }} v-slots={slots} />
      </ConfigProvider>
    )
  }
}

/* istanbul ignore next */

function genPurePanel(
  Component: any,
  alignPropName?: 'align' | 'dropdownAlign' | 'popupAlign',
  postProps?: (props: any) => any,
  defaultPrefixCls?: string,
  getDropdownCls?: (prefixCls: string) => string,
) {
  const PurePanel = defineComponent<BaseProps>(
    (props, { slots, attrs }) => {
      const holderRef = shallowRef()
      const popupHeight = shallowRef(0)
      const popupWidth = shallowRef(0)
      const open = shallowRef(props?.open ?? false)
      const setOpen = (value: boolean) => {
        if (props.open !== undefined) {
          return
        }
        open.value = value
      }

      watch(
        () => props.open,
        () => {
          open.value = props.open ?? false
        },
      )
      const { prefixCls } = useBaseConfig(defaultPrefixCls ?? 'select', props)
      watch(
        prefixCls,
        (_, _o, onCleanup) => {
        // We do not care about ssr
          setOpen(true)
          if (typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver((entries) => {
              const element = entries![0]!.target as HTMLDivElement
              popupHeight.value = element.offsetHeight + 8
              popupWidth.value = element.offsetWidth
            })
            const interval = setInterval(() => {
              const dropdownCls = getDropdownCls
                ? `.${getDropdownCls(prefixCls.value)}`
                : `.${prefixCls.value}-dropdown`
              const popup = holderRef.value?.querySelector(dropdownCls)
              if (popup) {
                clearInterval(interval)
                resizeObserver.observe(popup)
              }
            }, 10)
            onCleanup(() => {
              clearInterval(interval)
              resizeObserver.disconnect()
            })
          }
        },
        {
          immediate: true,
          flush: 'post',
        },
      )
      return () => {
        const { style } = props
        let mergedProps: any = {
          ...props,
          style: {
            ...(normalizeStyle(style) || {}),
            margin: 0,
          },
          open: open.value,
          getPopupContainer: () => holderRef.value!,
        }

        if (postProps) {
          mergedProps = postProps(mergedProps)
        }

        if (alignPropName) {
          Object.assign(mergedProps, {
            [alignPropName]: {
              overflow: {
                adjustX: false,
                adjustY: false,
              },
            },
          })
        }

        const mergedStyle: CSSProperties = {
          paddingBottom: `${popupHeight.value}px`,
          position: 'relative',
          minWidth: `${popupWidth.value}px`,
        }
        return (
          <div ref={holderRef} style={mergedStyle}>
            <Component {...attrs} {...mergedProps} v-slots={slots} />
          </div>
        )
      }
    },
  )

  return withPureRenderTheme(PurePanel)
}

export default genPurePanel
