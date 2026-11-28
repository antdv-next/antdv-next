import type { ValidateStatus } from '../form/FormItem'

import { clsx } from '@v-c/util'

const _InputStatuses = ['warning', 'error', '', 'success', 'validating'] as const

export type InputStatus = (typeof _InputStatuses)[number]

export function getStatusClassNames(prefixCls: string, status?: ValidateStatus, hasFeedback?: boolean) {
  return clsx({
    [`${prefixCls}-status-success`]: status === 'success',
    [`${prefixCls}-status-warning`]: status === 'warning',
    [`${prefixCls}-status-error`]: status === 'error',
    [`${prefixCls}-status-validating`]: status === 'validating',
    [`${prefixCls}-has-feedback`]: hasFeedback,
  })
}

export function getMergedStatus(contextStatus?: ValidateStatus, customStatus?: InputStatus) {
  return customStatus ?? contextStatus
}
