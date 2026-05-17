import type { ButtonProps } from '../button'
import type { TourProps, TourStepProps } from './interface.ts'
import { CloseOutlined } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import pickAttrs from '@v-c/util/dist/pickAttrs'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { defineComponent } from 'vue'
import isNonNullable from '../_util/isNonNullable.ts'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import Button from '../button'
import defaultLocale from '../locale/en_US'
import useLocale from '../locale/useLocale'

interface TourPanelProps {
  stepProps: Omit<TourStepProps, 'closable' | 'classNames'> & {
    closable?: Exclude<TourStepProps['closable'], boolean>
  }
  current: number
  type?: TourProps['type']
  indicatorsRender?: TourProps['indicatorsRender']
  classes?: TourProps['classes']
  styles?: TourProps['styles']
  actionsRender?: TourProps['actionsRender']
  prevButtonProps?: (params: { current: number, isFirst: boolean, isLast: boolean }) => any
  nextButtonProps?: (params: { current: number, isFirst: boolean, isLast: boolean }) => any
}

// Due to the independent design of Panel, it will be too coupled to put in rc-tour,
// so a set of Panel logic is implemented separately in antd.

const TourPanel = defineComponent<
  TourPanelProps
>(
  (props) => {
    const [contextLocaleGlobal] = useLocale('global', defaultLocale.global)
    const [contextLocaleTour] = useLocale('Tour', defaultLocale.Tour)

    return () => {
      const { stepProps, current, type, indicatorsRender, actionsRender } = props

      const {
        prefixCls,
        total = 1,
        title,
        onClose,
        onPrev,
        onNext,
        onFinish,
        cover,
        description,
        nextButtonProps,
        prevButtonProps,
        type: stepType,
        closable,
        classes = {},
        styles = {},
      } = stepProps
      const ariaProps = pickAttrs(closable ?? {}, true)

      const mergedType = stepType ?? type

      const mergedCloseIcon = (
        <button
          type="button"
          onClick={onClose}
          class={clsx(`${prefixCls}-close`, classes.close)}
          style={styles.close}
          aria-label={contextLocaleGlobal?.value.close}
          {...ariaProps}
        >
          {closable?.closeIcon || <CloseOutlined class={`${prefixCls}-close-icon`} />}
        </button>
      )

      const isLastStep = current === total - 1

      const prevBtnClick = () => {
        onPrev?.()
        prevButtonProps?.onClick?.()
      }

      const nextBtnClick = () => {
        if (isLastStep) {
          onFinish?.()
        }
        else {
          onNext?.()
        }
        nextButtonProps?.onClick?.()
      }

      const _title = getSlotPropsFnRun({}, { title }, 'title')
      const headerNode = isNonNullable(_title)
        ? (
            <div class={clsx(`${prefixCls}-header`, classes.header)} style={styles.header}>
              <div class={clsx(`${prefixCls}-title`, classes.title)} style={styles.title}>
                {_title}
              </div>
            </div>
          )
        : null

      const _description = getSlotPropsFnRun({}, { description }, 'description')
      const descriptionNode = isNonNullable(_description)
        ? (
            <div
              class={clsx(`${prefixCls}-description`, classes.description)}
              style={styles.description}
            >
              {_description}
            </div>
          )
        : null

      const _cover = getSlotPropsFnRun({}, { cover }, 'cover')
      const coverNode = isNonNullable(_cover)
        ? (
            <div class={clsx(`${prefixCls}-cover`, classes.cover)} style={styles.cover}>
              {_cover}
            </div>
          )
        : null

      let mergedIndicatorNode: any
      if (indicatorsRender) {
        mergedIndicatorNode = indicatorsRender(current, total)
      }
      else {
        mergedIndicatorNode = [...Array.from({ length: total }).keys()].map<any>(
          (stepItem, index) => (
            <span
              key={stepItem}
              class={clsx(
                index === current && `${prefixCls}-indicator-active`,
                `${prefixCls}-indicator`,
                classes.indicator,
              )}
              style={styles.indicator}
            />
          ),
        )
      }
      const mainBtnType = mergedType === 'primary' ? 'default' : 'primary'
      const secondaryBtnProps: ButtonProps = {
        type: 'default',
        ghost: mergedType === 'primary',
      }

      const prevButtonPropsChild = getSlotPropsFnRun({}, prevButtonProps ?? {}, 'children')
      let _prevBtn = props?.prevButtonProps?.({ current, isFirst: current === 0, isLast: isLastStep })
      _prevBtn = Array.isArray(_prevBtn) ? _prevBtn : [_prevBtn]
      _prevBtn = filterEmpty(_prevBtn).filter(Boolean)
      if (!_prevBtn.length) {
        _prevBtn = prevButtonPropsChild
      }

      const nextButtonPropsChild = getSlotPropsFnRun({}, nextButtonProps ?? {}, 'children')
      let _nextBtn = props?.nextButtonProps?.({ current, isFirst: current === 0, isLast: isLastStep })
      _nextBtn = Array.isArray(_nextBtn) ? _nextBtn : [_nextBtn]
      _nextBtn = filterEmpty(_nextBtn).filter(Boolean)
      if (!_nextBtn.length) {
        _nextBtn = nextButtonPropsChild
      }

      const defaultActionsNode = (
        <>
          {current !== 0
            ? (
                <Button
                  size="small"
                  {...secondaryBtnProps}
                  {...prevButtonProps}
                  onClick={prevBtnClick}
                  class={clsx(`${prefixCls}-prev-btn`, prevButtonProps?.class)}
                >
                  {_prevBtn ?? contextLocaleTour?.value?.Previous}
                </Button>
              )
            : null}
          <Button
            size="small"
            type={mainBtnType}
            {...nextButtonProps}
            onClick={nextBtnClick}
            class={clsx(`${prefixCls}-next-btn`, nextButtonProps?.class)}
          >
            { _nextBtn ?? (isLastStep ? contextLocaleTour?.value?.Finish : contextLocaleTour?.value?.Next)}
          </Button>
        </>
      )
      return (
        <div class={`${prefixCls}-panel`}>
          <div class={clsx(`${prefixCls}-section`, classes.section)} style={styles.section}>
            {closable && mergedCloseIcon}
            {coverNode}
            {headerNode}
            {descriptionNode}
            <div class={clsx(`${prefixCls}-footer`, classes.footer)} style={styles.footer}>
              {total > 1 && (
                <div
                  class={clsx(`${prefixCls}-indicators`, classes.indicators)}
                  style={styles.indicators}
                >
                  {mergedIndicatorNode}
                </div>
              )}
              <div class={clsx(`${prefixCls}-actions`, classes.actions)} style={styles.actions}>
                {actionsRender
                  ? actionsRender(defaultActionsNode, { current, total })
                  : defaultActionsNode}
              </div>
            </div>
          </div>
        </div>
      )
    }
  },
  {
    name: 'TourPanel',
    inheritAttrs: false,
  },
)

export default TourPanel
