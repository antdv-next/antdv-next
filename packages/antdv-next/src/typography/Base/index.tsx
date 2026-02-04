import type { SlotsType } from 'vue'
import type { BlockProps, CopyConfig, EditConfig, EllipsisConfig, TypographyBaseEmits, TypographyClassNamesType, TypographySlots, TypographyStylesType } from '../interface'
import { EditOutlined } from '@antdv-next/icons'
import ResizeObserver from '@v-c/resize-observer'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import {
  computed,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  watch,
  watchEffect,
} from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../../_util/hooks'
import { isStyleSupport } from '../../_util/styleChecker'
import { toPropsRefs } from '../../_util/tools'
import { useComponentBaseConfig } from '../../config-provider/context'
import useLocale from '../../locale/useLocale'
import Tooltip from '../../tooltip'
import Editable from '../Editable'
import useCopyClick from '../hooks/useCopyClick'
import useMergedConfig from '../hooks/useMergedConfig'
import usePrevious from '../hooks/usePrevious'
import useTooltipProps from '../hooks/useTooltipProps'
import Typography from '../Typography'
import CopyBtn from './CopyBtn'
import Ellipsis from './Ellipsis'
import EllipsisTooltip from './EllipsisTooltip'
import { isEleEllipsis, isValidText, toList } from './util'

const ELLIPSIS_STR = '...'

const DECORATION_PROPS: (keyof BlockProps)[] = [
  'delete',
  'mark',
  'code',
  'underline',
  'strong',
  'keyboard',
  'italic',
]

function wrapperDecorations(props: BlockProps, content: any) {
  let currentContent = content

  function wrap(tag: string, needed?: boolean) {
    if (!needed)
      return

    currentContent = h(tag, null, currentContent)
  }

  wrap('strong', props.strong)
  wrap('u', props.underline)
  wrap('del', (props as any).delete)
  wrap('code', props.code)
  wrap('mark', props.mark)
  wrap('kbd', props.keyboard)
  wrap('i', props.italic)

  return currentContent
}

const Base = defineComponent<
  BlockProps,
  TypographyBaseEmits,
  string,
  SlotsType<TypographySlots>
>(
  (props, { slots, attrs, emit }) => {
    const typographyRef = shallowRef<HTMLElement | { el?: HTMLElement }>()
    const typographyDom = computed(() => {
      const val = typographyRef.value as any
      if (val && typeof val === 'object' && 'el' in val)
        return val.el as HTMLElement
      return val as HTMLElement
    })
    const editIconRef = shallowRef<HTMLButtonElement>()

    const {
      prefixCls,
      direction: contextDirection,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('typography', props)

    const mergedDirection = computed(() => props.direction ?? contextDirection.value)

    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')

    const mergedProps = computed(() => {
      return {
        ...props,
        direction: mergedDirection.value,
      }
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TypographyClassNamesType,
      TypographyStylesType,
      BlockProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    const [textLocale] = useLocale('Text')

    // ========================== Editable ==========================
    const [enableEdit, editConfig] = useMergedConfig<EditConfig>(computed(() => props.editable))
    const editing = shallowRef(editConfig.value.editing ?? false)
    watch(editConfig, (config) => {
      if (config.editing !== undefined)
        editing.value = !!config.editing
    })
    const triggerType = computed(() => editConfig.value.triggerType ?? ['icon'])

    const triggerEdit = (edit: boolean) => {
      if (edit)
        editConfig.value.onStart?.()

      editing.value = edit
      emit('update:editing', edit)
      if (edit)
        emit('edit:start')
    }

    const prevEditing = usePrevious(() => editing.value)
    watch(
      () => editing.value,
      (val) => {
        if (!val && prevEditing.value) {
          nextTick(() => {
            editIconRef.value?.focus()
          })
        }
      },
      { flush: 'post' },
    )

    const onEditClick = (e?: MouseEvent) => {
      e?.preventDefault()
      triggerEdit(true)
    }

    const onEditChange = (value: string) => {
      editConfig.value.onChange?.(value)
      emit('edit:change', value)
      triggerEdit(false)
    }

    const onEditCancel = () => {
      editConfig.value.onCancel?.()
      emit('edit:cancel')
      triggerEdit(false)
    }

    // ========================== Copyable ==========================
    const [enableCopy, copyConfig] = useMergedConfig<CopyConfig>(computed(() => props.copyable))

    const childrenNodes = shallowRef<any[]>([])

    const { copied, copyLoading, onClick: onCopyClick } = useCopyClick({
      copyConfig,
      getText: () => childrenNodes.value,
    })

    const handleCopyClick = async (e?: MouseEvent) => {
      await onCopyClick(e)
      emit('copy', e as any)
    }

    // ========================== Ellipsis ==========================
    const isLineClampSupport = shallowRef(false)
    const isTextOverflowSupport = shallowRef(false)

    const isJsEllipsis = shallowRef(false)
    const isNativeEllipsis = shallowRef(false)
    const isNativeVisible = shallowRef(true)
    const [enableEllipsis, rawEllipsisConfig] = useMergedConfig<EllipsisConfig>(computed(() => props.ellipsis))

    const ellipsisConfig = computed<EllipsisConfig>(() => ({
      expandable: false,
      symbol: (isExpanded: boolean) => (isExpanded ? textLocale?.value?.collapse : textLocale?.value?.expand),
      ...(rawEllipsisConfig.value as EllipsisConfig),
    }))

    const expanded = shallowRef(ellipsisConfig.value.defaultExpanded || false)
    watch(
      () => ellipsisConfig.value.expanded,
      (val) => {
        if (val !== undefined)
          expanded.value = val
      },
    )

    const mergedEnableEllipsis = computed(() => enableEllipsis.value && (!expanded.value || ellipsisConfig.value.expandable === 'collapsible'))

    const rows = computed(() => ellipsisConfig.value.rows ?? 1)

    const needMeasureEllipsis = computed(() => {
      return mergedEnableEllipsis.value && (
        ellipsisConfig.value.suffix !== undefined
        || ellipsisConfig.value.onEllipsis
        || ellipsisConfig.value.expandable
        || enableEdit.value
        || enableCopy.value
      )
    })

    watchEffect(() => {
      if (enableEllipsis.value && !needMeasureEllipsis.value) {
        isLineClampSupport.value = isStyleSupport('webkitLineClamp')
        isTextOverflowSupport.value = isStyleSupport('textOverflow')
      }
    })

    const cssEllipsis = shallowRef(mergedEnableEllipsis.value)

    const canUseCssEllipsis = computed(() => {
      if (needMeasureEllipsis.value) {
        return false
      }

      if (rows.value === 1)
        return isTextOverflowSupport.value

      return isLineClampSupport.value
    })

    watch(
      [canUseCssEllipsis, mergedEnableEllipsis],
      () => {
        cssEllipsis.value = canUseCssEllipsis.value && mergedEnableEllipsis.value
      },
      {
        immediate: true,
      },
    )

    const isMergedEllipsis = computed(() => mergedEnableEllipsis.value && (cssEllipsis.value ? isNativeEllipsis.value : isJsEllipsis.value))

    const cssTextOverflow = computed(() => mergedEnableEllipsis.value && rows.value === 1 && cssEllipsis.value)
    const cssLineClamp = computed(() => mergedEnableEllipsis.value && rows.value > 1 && cssEllipsis.value)

    const onExpandClick: EllipsisConfig['onExpand'] = (e, info) => {
      expanded.value = info.expanded
      emit('update:expanded', info.expanded)
      emit('expand', info.expanded, e as any)
      ellipsisConfig.value.onExpand?.(e, info)
    }

    const ellipsisWidth = shallowRef(0)
    const onResize = ({ offsetWidth }: { offsetWidth: number }) => {
      ellipsisWidth.value = offsetWidth
    }

    const onJsEllipsis = (jsEllipsis: boolean) => {
      const changed = isJsEllipsis.value !== jsEllipsis
      isJsEllipsis.value = jsEllipsis
      if (changed)
        ellipsisConfig.value.onEllipsis?.(jsEllipsis)
    }

    watch(
      () => [enableEllipsis.value, cssEllipsis.value, childrenNodes.value, cssLineClamp.value, isNativeVisible.value, ellipsisWidth.value],
      () => {
        const textEle = typographyDom.value

        if (enableEllipsis.value && cssEllipsis.value && textEle) {
          const currentEllipsis = isEleEllipsis(textEle)

          if (isNativeEllipsis.value !== currentEllipsis)
            isNativeEllipsis.value = currentEllipsis
        }
      },
      { flush: 'post' },
    )

    let observer: IntersectionObserver | null = null
    watch(
      () => [cssEllipsis.value, mergedEnableEllipsis.value],
      () => {
        observer?.disconnect()
        if (typeof IntersectionObserver === 'undefined' || !typographyDom.value || !cssEllipsis.value || !mergedEnableEllipsis.value)
          return

        observer = new IntersectionObserver(() => {
          if (typographyDom.value)
            isNativeVisible.value = !!typographyDom.value.offsetParent
        })
        if (typographyDom.value)
          observer.observe(typographyDom.value)
      },
      { flush: 'post', immediate: true },
    )

    onBeforeUnmount(() => {
      observer?.disconnect()
      observer = null
    })

    // ========================== Tooltip ===========================
    const tooltipProps = useTooltipProps(
      computed(() => ellipsisConfig.value.tooltip),
      computed(() => editConfig.value.text),
      childrenNodes,
    )

    const getChildrenText = computed(() => {
      for (const node of childrenNodes.value) {
        if (isValidText(node))
          return node
        if ((node as any)?.children && isValidText((node as any).children))
          return (node as any).children
      }
      return undefined
    })

    const topAriaLabel = computed(() => {
      if (!enableEllipsis.value || cssEllipsis.value)
        return undefined
      return [editConfig.value.text, getChildrenText.value, props.title, tooltipProps.value?.title].find(isValidText)
    })

    // Expand
    const renderExpand = () => {
      const { expandable, symbol } = ellipsisConfig.value
      return expandable
        ? (
            <button
              type="button"
              key="expand"
              class={classNames(`${prefixCls.value}-${expanded.value ? 'collapse' : 'expand'}`, mergedClassNames.value.expand)}
              onClick={(e: MouseEvent) => onExpandClick(e, { expanded: !expanded.value })}
              aria-label={expanded.value ? textLocale?.value?.collapse : textLocale?.value?.expand}
              style={mergedStyles.value.expand}
            >
              {typeof symbol === 'function' ? symbol(expanded.value) : symbol}
            </button>
          )
        : null
    }

    // Edit
    const renderEdit = () => {
      if (!enableEdit.value)
        return null

      const { icon, tooltip, tabIndex } = editConfig.value
      const tooltipNodes = toList(tooltip as any)

      const editTitle = tooltipNodes[0] || textLocale?.value?.edit
      const ariaLabel = typeof editTitle === 'string' ? editTitle : ''

      return triggerType.value.includes('icon')
        ? (
            <Tooltip key="edit" title={tooltip === false ? '' : editTitle}>
              <button
                type="button"
                ref={editIconRef}
                class={classNames(`${prefixCls.value}-edit`, mergedClassNames.value.edit)}
                onClick={onEditClick}
                aria-label={ariaLabel}
                tabindex={tabIndex}
                style={mergedStyles.value.edit}
              >
                {icon || <EditOutlined {...{ role: 'button' }} />}
              </button>
            </Tooltip>
          )
        : null
    }

    // Copy
    const renderCopy = () => {
      if (!enableCopy.value)
        return null

      return (
        <CopyBtn
          key="copy"
          {...copyConfig.value}
          prefixCls={prefixCls.value}
          copied={copied.value}
          locale={textLocale?.value}
          onCopy={handleCopyClick}
          loading={copyLoading.value}
          iconOnly={childrenNodes.value.length === 0}
          className={mergedClassNames.value.copy as any}
          style={mergedStyles.value.copy as any}
        />
      )
    }

    const renderOperations = (canEllipsis: boolean) => {
      return [
        canEllipsis && renderExpand(),
        renderEdit(),
        renderCopy(),
      ]
    }

    const renderEllipsis = (canEllipsis: boolean) => {
      return [
        canEllipsis && !expanded.value && (
          <span aria-hidden key="ellipsis">
            {ELLIPSIS_STR}
          </span>
        ),
        ellipsisConfig.value.suffix,
        renderOperations(canEllipsis),
      ]
    }

    const componentCls = computed(() => classNames(
      {
        [`${prefixCls.value}-${props.type}`]: props.type,
        [`${prefixCls.value}-disabled`]: props.disabled,
        [`${prefixCls.value}-ellipsis`]: enableEllipsis.value,
        [`${prefixCls.value}-ellipsis-single-line`]: cssTextOverflow.value,
        [`${prefixCls.value}-ellipsis-multiple-line`]: cssLineClamp.value,
        [`${prefixCls.value}-link`]: props.component === 'a',
      },
      mergedClassNames.value.root,
    ))

    return () => {
      const { className: attrClass, style: attrStyle, restAttrs } = getAttrStyleAndClass(attrs)
      const children = filterEmpty(slots?.default?.())
      childrenNodes.value = children
      const clickHandler = triggerType.value.includes('text')
        ? onEditClick
        : (e: MouseEvent) => emit('click', e)
      const mergedClassName = classNames(componentCls.value, attrClass)
      const mergedStyle = [
        mergedStyles.value.root,
        cssLineClamp.value ? { WebkitLineClamp: rows.value } : null,
        attrStyle,
      ]

      // =========================== Render ===========================
      if (editing.value) {
        return (
          <Editable
            value={editConfig.value.text ?? (getChildrenText.value != null ? String(getChildrenText.value) : '')}
            onSave={onEditChange}
            onCancel={onEditCancel}
            onEnd={() => {
              editConfig.value.onEnd?.()
              emit('edit:end')
            }}
            prefixCls={prefixCls.value}
            className={classNames(attrClass, mergedClassNames.value.root, props.rootClass, contextClassName.value)}
            style={[mergedStyles.value.root, contextStyle.value, attrStyle] as any}
            direction={mergedDirection.value}
            component={props.component as any}
            maxLength={editConfig.value.maxLength}
            autoSize={editConfig.value.autoSize}
            enterIcon={editConfig.value.enterIcon}
          />
        )
      }
      return (
        <ResizeObserver onResize={onResize} disabled={!mergedEnableEllipsis.value}>
          <EllipsisTooltip
            tooltipProps={tooltipProps.value}
            enableEllipsis={mergedEnableEllipsis.value}
            isEllipsis={isMergedEllipsis.value}
          >
            <Typography
              class={mergedClassName}
              prefixCls={prefixCls.value}
              style={mergedStyle as any}
              component={props.component as any}
              ref={typographyRef}
              direction={mergedDirection.value}
              onClick={clickHandler}
              title={props.title!}
              aria-label={topAriaLabel.value as any}
              rootClass={props.rootClass}
              {...restAttrs}
            >
              <Ellipsis
                enableMeasure={mergedEnableEllipsis.value && !cssEllipsis.value}
                text={children}
                rows={rows.value}
                width={ellipsisWidth.value}
                {
                  ...{
                    onEllipsis: onJsEllipsis,
                  } as any
                }
                expanded={expanded.value}
                miscDeps={[
                  copied.value,
                  expanded.value,
                  copyLoading.value,
                  enableEdit.value,
                  enableCopy.value,
                  textLocale?.value,
                  ...DECORATION_PROPS.map(key => (props as any)[key]),
                ]}
              >
                {(node: any, canEllipsis: any) => {
                  return wrapperDecorations(
                    props,
                    <>
                      {node.length > 0 && canEllipsis && !expanded.value && topAriaLabel.value
                        ? (
                            <span key="show-content" aria-hidden>
                              {node}
                            </span>
                          )
                        : node}
                      <>{renderEllipsis(canEllipsis)}</>
                    </>,
                  )
                }}
              </Ellipsis>
            </Typography>
          </EllipsisTooltip>
        </ResizeObserver>
      )
    }
  },
  {
    name: 'ATypographyBase',
    inheritAttrs: false,
  },
)

export default Base
