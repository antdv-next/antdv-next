import type { VueNode } from '../_util/type.ts'
import type { ColProps } from '../grid'
import type { TooltipProps } from '../tooltip'
import type { RequiredMark } from './Form'
import type { FormLabelAlign } from './interface'
import { QuestionCircleFilled } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { defineComponent } from 'vue'
import convertToTooltipProps from '../_util/convertToTooltipProps.ts'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { Col } from '../grid'
import defaultLocale from '../locale/en_US'
import useLocale from '../locale/useLocale.ts'
import Tooltip from '../tooltip'
import { useFormContext } from './context.tsx'

export type FormTooltipProps = TooltipProps & {
  icon?: VueNode
}

export type FormItemTooltipType = FormTooltipProps | VueNode

export type ColPropsWithClass = ColProps & { class?: string }

export interface FormItemLabelProps {
  colon?: boolean
  htmlFor?: string
  label?: VueNode
  labelAlign?: FormLabelAlign
  labelCol?: ColPropsWithClass
  /**
   * @internal Used for pass `requiredMark` from `<Form />`
   */
  requiredMark?: RequiredMark
  tooltip?: FormItemTooltipType
  vertical?: boolean
}

const FormItemLabel = defineComponent<
  FormItemLabelProps & { required?: boolean, prefixCls: string }
>(
  (props, { slots }) => {
    const [formLocale] = useLocale('Form')
    const formContext = useFormContext()
    return () => {
      const {
        labelCol,
        labelAlign,
        prefixCls,
        required,
        colon,
        vertical,
        tooltip,
        requiredMark,
        htmlFor,
      } = props
      const {
        labelAlign: contextLabelAlign,
        labelCol: contextLabelCol,
        labelWrap,
        colon: contextColon,
        classes: contextClassNames,
        styles: contextStyles,
        tooltip: contextTooltip,
      } = formContext.value
      const label = getSlotPropsFnRun(slots, props, 'label')
      if (!label) {
        return null
      }
      const mergedLabelCol: ColPropsWithClass = labelCol || contextLabelCol || {} as ColPropsWithClass
      const mergedLabelAlign: FormLabelAlign = (labelAlign || contextLabelAlign) as FormLabelAlign
      const labelClsBasic = `${prefixCls}-item-label`
      const labelColClassName = clsx(
        labelClsBasic,
        mergedLabelAlign === 'left' && `${labelClsBasic}-left`,
        mergedLabelCol.class,
        {
          [`${labelClsBasic}-wrap`]: !!labelWrap,
        },
      )
      let labelChildren = label
      // Keep label is original where there should have no colon
      const computedColon = colon === true || (contextColon !== false && colon !== false)
      const haveColon = computedColon && !vertical

      // Remove duplicated user input colon
      if (haveColon && typeof label === 'string' && label.trim()) {
        labelChildren = label.replace(/[:|：]\s*$/, '')
      }

      // Tooltip
      const tooltipProps = convertToTooltipProps(tooltip, contextTooltip)
      if (tooltipProps) {
        const { ...restTooltipProps } = tooltipProps
        const icon = getSlotPropsFnRun({}, tooltipProps, 'icon') ?? <QuestionCircleFilled />
        const tooltipNode = (
          <Tooltip {...omit(restTooltipProps, ['icon'])}>
            <span
              class={`${prefixCls}-item-tooltip`}
              onClick={(e) => {
                e.preventDefault()
              }}
              tabindex={-1}
            >
              {icon}
            </span>
          </Tooltip>
        )
        labelChildren = (
          <>
            {labelChildren}
            {tooltipNode}
          </>
        )
      }

      // Required Mark
      const isOptionalMark = requiredMark === 'optional'
      const isRenderMark = typeof requiredMark === 'function'
      const hideRequiredMark = requiredMark === false

      if (isRenderMark) {
        labelChildren = requiredMark(labelChildren, { required: !!required })
      }
      else if (isOptionalMark && !required) {
        labelChildren = (
          <>
            {labelChildren}
            <span class={`${prefixCls}-item-optional`} title="">
              {formLocale?.value?.optional || defaultLocale.Form?.optional}
            </span>
          </>
        )
      }

      // https://github.com/ant-design/ant-design/pull/52950#discussion_r1980880316
      let markType: string | undefined
      if (hideRequiredMark) {
        markType = 'hidden'
      }
      else if (isOptionalMark || isRenderMark) {
        markType = 'optional'
      }

      const labelClassName = clsx(contextClassNames?.label, {
        [`${prefixCls}-item-required`]: required,
        [`${prefixCls}-item-required-mark-${markType}`]: markType,
        [`${prefixCls}-item-no-colon`]: !computedColon,
      })

      return (
        <Col {...mergedLabelCol} class={labelColClassName}>
          <label
            for={htmlFor}
            class={labelClassName}
            style={contextStyles?.label}
            title={typeof label === 'string' ? label : ''}
          >
            {labelChildren}
          </label>
        </Col>
      )
    }
  },
  {
    name: 'FormItemLabel',
    inheritAttrs: false,
  },
)

export default FormItemLabel
