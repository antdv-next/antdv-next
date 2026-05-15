import type { CSSMotionProps } from '@v-c/util/dist/utils/transition'
import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type.ts'
import type { NotificationConfig as CPNotificationConfig } from '../config-provider/context'
import type { NotificationConfig, NotificationPlacement } from './interface'

/**
 * Mirror ant-design 6.4.0 getPlacementOffsetStyle: surface positioning via
 * the --notification-top / --notification-bottom CSS variables that the
 * new placement.ts style file consumes. Setting inline `top: Npx` would
 * defeat the holder's `inset` calc and force the holder to occupy the
 * full --notification-margin-edge gap, which manifests as a tall empty
 * strip at the top of the page when scrolled.
 */
export function getPlacementOffsetStyle(top?: number | string, bottom?: number | string): CSSProperties {
  const result: CSSProperties = {}
  if (top !== undefined && top !== null) {
    ;(result as any)['--notification-top'] = typeof top === 'number' ? `${top}px` : top
  }
  if (bottom !== undefined && bottom !== null) {
    ;(result as any)['--notification-bottom'] = typeof bottom === 'number' ? `${bottom}px` : bottom
  }
  return result
}

/** @deprecated kept for the message wrapper; routes through getPlacementOffsetStyle. */
export function getPlacementStyle(_placement: NotificationPlacement, top: number, bottom: number): CSSProperties {
  return getPlacementOffsetStyle(top, bottom)
}

export function getMotion(prefixCls: string): CSSMotionProps {
  return {
    name: `${prefixCls}-fade`,
  }
}

export function getCloseIconConfig(
  closeIcon: VueNode,
  notificationConfig?: NotificationConfig,
  notification?: CPNotificationConfig,
) {
  if (typeof closeIcon !== 'undefined') {
    return closeIcon
  }
  if (typeof notificationConfig?.closeIcon !== 'undefined') {
    return notificationConfig.closeIcon
  }
  return notification?.closeIcon
}
