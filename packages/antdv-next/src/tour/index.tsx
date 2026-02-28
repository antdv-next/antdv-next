import type { TourProps as VcTourProps } from '@v-c/tour'
import type { App, SlotsType } from 'vue'
import type { TourProps as BaseTourProps, TourClassNamesType, TourEmits, TourSlots, TourStepProps, TourStylesType } from './interface'
import VcTour from '@v-c/tour'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent } from 'vue'
import { pureAttrs, useMergeSemantic, useToArr, useToProps, useZIndex } from '../_util/hooks'
import getPlacements from '../_util/placements'
import { toPropsRefs } from '../_util/tools'
import { checkRenderNode } from '../_util/vueNode.ts'
import { ZIndexProvider } from '../_util/zindexContext'
import { useComponentBaseConfig } from '../config-provider/context'
import { useToken } from '../theme/internal'
import TourPanel from './panelRender'
import PurePanel from './PurePanel.tsx'

import useStyle from './style'

export interface InternalTourProps extends BaseTourProps,
  /* @vue-ignore */
  TourEmitsProps {}

export interface TourEmitsProps {
  onChange?: TourEmits['change']
  onClose?: TourEmits['close']
  onFinish?: TourEmits['finish']
  'onUpdate:open'?: TourEmits['update:open']
  'onUpdate:current'?: TourEmits['update:current']
  onPopupAlign?: TourEmits['popupAlign']
}

const Tour = defineComponent<
  InternalTourProps,
  TourEmits,
  string,
  SlotsType<TourSlots>
>(
  (props, { slots, emit, attrs }) => {
    const {
      prefixCls,
      direction,
      closeIcon: contextCloseIcon,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('tour', props, ['closeIcon'])
    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')

    const [hashId, cssVarCls] = useStyle(prefixCls)
    const [,token] = useToken()
    const mergedSteps = computed(() => {
      return (props?.steps ?? []).map((step, index) => {
        const _cover = filterEmpty(slots?.coverRender?.({ step, index })).filter(Boolean)
        const _title = filterEmpty(slots?.titleRender?.({ step, index })).filter(Boolean)
        const _description = filterEmpty(slots?.descriptionRender?.({ step, index })).filter(Boolean)

        return {
          ...step,
          cover: step?.cover ?? checkRenderNode(_cover),
          title: step?.title ?? checkRenderNode(_title),
          description: step?.description ?? checkRenderNode(_description),
          class: clsx(
            step.class,
            {
              [`${prefixCls.value}-primary`]: (step.type ?? props.type) === 'primary',
            },
          ),
        }
      })
    })
    const vcSteps = computed<VcTourProps['steps']>(() => {
      return mergedSteps.value.map((step) => {
        const {
          class: stepClass,
          ...restStep
        } = step ?? {}
        return {
          ...restStep,
          className: stepClass,
        } as any
      })
    })

    // =========== Merged Props for Semantic ===========
    const mergedProps = computed(() => {
      return {
        ...props,
        steps: mergedSteps.value,
      } as BaseTourProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TourClassNamesType,
      TourStylesType,
      BaseTourProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    const builtinPlacements: BaseTourProps['builtinPlacements'] = config => getPlacements({
      arrowPointAtCenter: config?.arrowPointAtCenter ?? true,
      autoAdjustOverflow: true,
      offset: token.value.marginXXS,
      arrowWidth: token.value.sizePopupArrow,
      borderRadius: token.value.borderRadius,
    })

    // ============================ zIndex ============================
    const [zIndex, contextZIndex] = useZIndex('Tour', computed(() => props.zIndex))
    return () => {
      const {
        rootClass,
        type,
        closeIcon,
      } = props
      const mergedRootClassName = clsx(
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        hashId.value,
        cssVarCls.value,
        rootClass,
        contextClassName.value,
        mergedClassNames.value?.root,
        (attrs as any).class,
      )

      const semanticStyles = {
        ...mergedStyles.value,
        mask: {
          ...mergedStyles.value?.root,
          ...mergedStyles.value?.mask,
          ...contextStyle.value,
          ...(attrs as any).style,
        },
      }
      const indicatorsRender = slots?.indicatorsRender ?? props?.indicatorsRender
      const actionsRender = slots?.actionsRender ?? props?.actionsRender

      const mergedRenderPanel: VcTourProps['renderPanel'] = (stepProps, stepCurrent) => {
        return (
          <TourPanel
            styles={semanticStyles}
            classes={mergedClassNames.value}
            type={type}
            stepProps={{
              ...stepProps,
              classes: stepProps?.classNames,
            } as any}
            current={stepCurrent}
            indicatorsRender={indicatorsRender}
            actionsRender={actionsRender}
            prevButtonProps={slots?.prevButton}
            nextButtonProps={slots?.nextButton}
          />
        )
      }
      const restProps = omit(props, [
        'prefixCls',
        'type',
        'indicatorsRender',
        'actionsRender',
        'steps',
        'closeIcon',
        'styles',
      ])
      return (
        <ZIndexProvider value={contextZIndex.value}>
          <VcTour
            {...pureAttrs(attrs)}
            {...restProps}
            styles={semanticStyles}
            classNames={mergedClassNames.value}
            closeIcon={closeIcon ?? contextCloseIcon.value}
            zIndex={zIndex.value}
            rootClassName={mergedRootClassName}
            prefixCls={prefixCls.value}
            animated
            renderPanel={mergedRenderPanel}
            builtinPlacements={builtinPlacements}
            steps={vcSteps.value}
            onClose={(current) => {
              emit('close', current)
              emit('update:open', false)
            }}
            onChange={(current) => {
              emit('update:current', current)
              emit('change', current)
            }}
            onFinish={() => {
              emit('finish')
              emit('update:open', false)
            }}
            onPopupAlign={(el, info) => {
              emit('popupAlign', el, info)
            }}
          />
        </ZIndexProvider>
      )
    }
  },
  {
    name: 'ATour',
    inheritAttrs: false,
  },
)

;(Tour as any).install = (app: App) => {
  app.component(Tour.name, Tour)
}

export type {
  TourEmits,
  TourLocale,
  TourSemanticName,
  TourSlots,
  TourStylesType,
} from './interface'
export type TourProps = InternalTourProps

;(Tour as any)._InternalPanelDoNotUseOrYouWillBeFired = PurePanel

export default Tour

export type TourStepItem = TourStepProps
