import type { ReportMetaChange } from '../context'
import type { Meta } from '../types'
import type { FormItemProps } from './index'
import { clsx } from '@v-c/util'
import isVisible from '@v-c/util/dist/Dom/isVisible'
import { computed, defineComponent, nextTick, shallowRef, watch } from 'vue'
import { getAttrStyleAndClass } from '../../_util/hooks'
import isNonNullable from '../../_util/isNonNullable.ts'
import { Row } from '../../grid'
import { NoStyleItemContextProvider, useFormContext } from '../context'
import FormItemInput from '../FormItemInput.tsx'
import FormItemLabel from '../FormItemLabel.tsx'
import { getStatus } from '../util.ts'
import StatusProvider from './StatusProvider.tsx'

export type ItemHolderProps = FormItemProps & {
  errors: any[]
  warnings: any[]
  meta: Meta
  fieldId?: string
  isRequired?: boolean
  onSubItemMetaChange: ReportMetaChange
}

const ItemHolder = defineComponent<ItemHolderProps>(
  (props, { attrs, slots }) => {
    const itemPrefixCls = computed(() => `${props.prefixCls}-item`)
    const formContext = useFormContext()
    const layout = computed(() => props?.layout ?? formContext.value?.layout)
    const vertical = computed(() => layout.value === 'vertical')
    // ======================== Margin ========================
    const itemRef = shallowRef<HTMLDivElement>()
    const hasHelp = computed(() => isNonNullable(props.help))
    const hasError = computed(() => !!(hasHelp.value || props?.errors?.length || props?.warnings?.length))
    const isOnScreen = computed(() => !!itemRef.value && isVisible(itemRef.value))
    const marginBottom = shallowRef()
    watch([hasError, isOnScreen], async () => {
      await nextTick()
      if (hasError.value && itemRef.value) {
        // The element must be part of the DOMTree to use getComputedStyle
        // https://stackoverflow.com/questions/35360711/getcomputedstyle-returns-a-cssstyledeclaration-but-all-properties-are-empty-on-a
        const itemStyle = getComputedStyle(itemRef.value)
        marginBottom.value = Number.parseInt(itemStyle.marginBottom, 10)
      }
    }, {
      immediate: true,
    })
    const onErrorVisibleChanged = (visible: boolean) => {
      if (!visible) {
        marginBottom.value = null
      }
    }

    // ======================== Status ========================
    function getValidateState(isDebounce = false) {
      const _errors = isDebounce ? props?.errors : props?.meta?.errors
      const _warnings = isDebounce ? props?.warnings : props?.meta?.warnings
      return getStatus(_errors, _warnings, props?.meta, '', !!props?.hasFeedback, props?.validateStatus)
    }

    return () => {
      const mergedValidateStatus = getValidateState()
      const {
        prefixCls,
        rootClass,
        hasFeedback,
        hidden,
        fieldId,
        required,
        isRequired,
        meta,
        help,
        onSubItemMetaChange,
        name,
      } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const debounceErrors = props?.errors
      const debounceWarnings = props?.warnings

      // ======================== Render ========================
      const itemClassName = clsx(
        itemPrefixCls.value,
        className,
        rootClass,
        {
          [`${itemPrefixCls.value}-with-help`]: hasHelp.value || debounceErrors.length || debounceWarnings.length,

          // Status
          [`${itemPrefixCls.value}-has-feedback`]: mergedValidateStatus && hasFeedback,
          [`${itemPrefixCls.value}-has-success`]: mergedValidateStatus === 'success',
          [`${itemPrefixCls.value}-has-warning`]: mergedValidateStatus === 'warning',
          [`${itemPrefixCls.value}-has-error`]: mergedValidateStatus === 'error',
          [`${itemPrefixCls.value}-is-validating`]: mergedValidateStatus === 'validating',
          [`${itemPrefixCls.value}-hidden`]: hidden,

          // Layout
          [`${itemPrefixCls.value}-${layout.value}`]: layout.value,
        },
      )
      return (
        <div class={itemClassName} style={style} ref={itemRef}>
          <Row class={`${itemPrefixCls.value}-row`} {...restAttrs}>
            {/* Label */}
            <FormItemLabel
              {...props}
              htmlFor={props.htmlFor ?? fieldId}
              requiredMark={formContext.value?.requiredMark}
              required={required ?? isRequired}
              prefixCls={prefixCls!}
              vertical={vertical.value!}
            />
            {/* Input Group */}

            <FormItemInput
              {...props}
              {...meta}
              errors={debounceErrors}
              warnings={debounceWarnings}
              prefixCls={prefixCls!}
              status={mergedValidateStatus}
              help={help}
              marginBottom={marginBottom.value}
              onErrorVisibleChanged={onErrorVisibleChanged}
            >
              <NoStyleItemContextProvider value={onSubItemMetaChange}>
                <StatusProvider
                  prefixCls={prefixCls!}
                  meta={meta}
                  errors={meta.errors}
                  warnings={meta.warnings}
                  hasFeedback={hasFeedback}
                  // Already calculated
                  validateStatus={mergedValidateStatus}
                  name={name}
                >
                  {slots?.default?.()}
                </StatusProvider>
              </NoStyleItemContextProvider>
            </FormItemInput>
          </Row>
          {!!marginBottom.value && (
            <div
              class={`${itemPrefixCls.value}-margin-offset`}
              style={{
                marginBottom: `${-marginBottom.value}px`,
              }}
            />
          )}
        </div>
      )
    }
  },
  {
    name: 'FormItemHolder',
    inheritAttrs: false,
  },
)

export default ItemHolder
