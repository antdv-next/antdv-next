import type { FeedbackIcons, ValidateStatus } from '.'
import type { FormItemStatusContextProps } from '../context'
import type { Meta, NamePath } from '../types'
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled, LoadingOutlined } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import { computed, defineComponent } from 'vue'
import { useFormContext, useFormItemInputContext, useFormItemInputContextProvider } from '../context'
import { getStatus } from '../util'

const iconMap = {
  success: CheckCircleFilled,
  warning: ExclamationCircleFilled,
  error: CloseCircleFilled,
  validating: LoadingOutlined,
}

export interface StatusProviderProps {
  // children?: React.ReactNode;
  validateStatus?: ValidateStatus
  prefixCls: string
  meta: Meta
  errors: any[]
  warnings: any[]
  hasFeedback?: boolean | { icons?: FeedbackIcons }
  noStyle?: boolean
  name?: NamePath
}

const StatusProvider = defineComponent<StatusProviderProps>(
  (props, { slots }) => {
    const formContext = useFormContext()
    const formItemContext = useFormItemInputContext()
    const formItemInputNewContext = computed(() => {
      const {
        errors,
        warnings,
        hasFeedback,
        validateStatus,
        prefixCls,
        meta,
        noStyle,
        name,
      } = props
      const itemPrefixCls = `${prefixCls}-item`
      const { feedbackIcons } = formContext.value ?? {}

      const selfValidateStatus = getStatus(
        errors,
        warnings,
        meta,
        null,
        !!hasFeedback,
        validateStatus,
      )
      const {
        isFormItemInput: parentIsFormItemInput,
        status: parentStatus,
        hasFeedback: parentHasFeedback,
        feedbackIcon: parentFeedbackIcon,
        name: parentName,
      } = formItemContext.value

      // A touched `noStyle` field is implicitly `success`, so it follows the parent status instead
      const mergedValidateStatus
        = noStyle && parentStatus && validateStatus === undefined && selfValidateStatus === 'success'
          ? parentStatus
          : selfValidateStatus

      let feedbackIcon: any
      if (hasFeedback) {
        const customIcons = (hasFeedback !== true && hasFeedback.icons) || feedbackIcons
        const customIconNode
          = mergedValidateStatus
            && customIcons?.({ status: mergedValidateStatus, errors, warnings })?.[mergedValidateStatus]
        const IconNode = mergedValidateStatus ? iconMap[mergedValidateStatus] : null
        feedbackIcon
          = customIconNode !== false && IconNode
            ? (
                <span
                  class={clsx(
                    `${itemPrefixCls}-feedback-icon`,
                    `${itemPrefixCls}-feedback-icon-${mergedValidateStatus}`,
                  )}
                >
                  {customIconNode || <IconNode />}
                </span>
              )
            : null
      }

      const context: FormItemStatusContextProps = {
        status: mergedValidateStatus || '',
        errors,
        warnings,
        hasFeedback: !!hasFeedback,
        feedbackIcon,
        isFormItemInput: true,
        name,
      }

      // No style will follow parent context
      if (noStyle) {
        context.status = (mergedValidateStatus ?? parentStatus) || ''
        context.isFormItemInput = parentIsFormItemInput
        context.hasFeedback = !!(hasFeedback ?? parentHasFeedback)
        context.feedbackIcon = hasFeedback !== undefined ? context.feedbackIcon : parentFeedbackIcon
        context.name = name ?? parentName
      }

      return context
    })
    useFormItemInputContextProvider(formItemInputNewContext)
    return () => {
      return slots?.default?.()
    }
  },
  {
    name: 'StatusProvider',
    inheritAttrs: false,
  },
)

export default StatusProvider
