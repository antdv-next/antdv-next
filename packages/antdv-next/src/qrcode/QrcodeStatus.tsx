import type { Locale } from '../locale'
import type { QRCodeProps, StatusRenderInfo } from './interface.ts'
import { ReloadOutlined } from '@antdv-next/icons'
import { defineComponent } from 'vue'
import { cloneIfVNode } from '../_util/vueNode'
import Button from '../button'
import Spin from '../spin'

export interface QRcodeStatusProps {
  prefixCls: string
  locale?: Locale['QRCode']
  onRefresh?: () => void
  statusRender?: QRCodeProps['statusRender']
  status: StatusRenderInfo['status']
}
const defaultSpin = <Spin />

const QRcodeStatus = defineComponent<QRcodeStatusProps>(
  (props) => {
    return () => {
      const { prefixCls, locale, onRefresh, statusRender, status } = props

      const defaultExpiredNode = (
        <>
          <p class={`${prefixCls}-expired`}>{locale?.expired}</p>
          {onRefresh && (
            <Button type="link" icon={() => <ReloadOutlined />} onClick={onRefresh}>
              {locale?.refresh}
            </Button>
          )}
        </>
      )

      const defaultScannedNode = <p class={`${prefixCls}-scanned`}>{locale?.scanned}</p>

      const defaultNodes = {
        expired: defaultExpiredNode,
        loading: cloneIfVNode(defaultSpin),
        scanned: defaultScannedNode,
      }

      const defaultStatusRender: QRCodeProps['statusRender'] = info => defaultNodes[info.status]

      const mergedStatusRender = statusRender ?? defaultStatusRender

      return mergedStatusRender({
        status,
        locale,
        onRefresh,
      })
    }
  },
)

export default QRcodeStatus
