import type { TooltipProps } from '../tooltip'
import raf from '@v-c/util/dist/raf'
import { computed, defineComponent, nextTick, onUnmounted, shallowRef, watch } from 'vue'
import Tooltip from '../tooltip'

export type SliderTooltipProps = TooltipProps & {
  draggingDelete?: boolean
  value?: number
}

const SliderTooltip = defineComponent<
  SliderTooltipProps
>(
  (props, { slots }) => {
    const innerRef = shallowRef()
    const mergedOpen = computed(() => props?.open && !props?.draggingDelete)

    const rafRef = shallowRef<number | null>(null)

    function cancelKeepAlign() {
      raf.cancel(rafRef.value!)
      rafRef.value = null
    }

    function keepAlign() {
      rafRef.value = raf(() => {
        innerRef.value?.forceAlign()
        rafRef.value = null
      })
    }

    watch(
      [mergedOpen, () => props.title, () => props.value],
      async (_n, _o, onCleanup) => {
        await nextTick()
        if (mergedOpen.value) {
          keepAlign()
        }
        onCleanup(() => {
          cancelKeepAlign()
        })
      },
    )
    onUnmounted(() => {
      cancelKeepAlign()
    })
    return () => {
      return (
        <Tooltip {...props} open={mergedOpen.value} ref={innerRef}>
          {slots?.default?.()}
        </Tooltip>
      )
    }
  },
  {
    name: 'SliderTooltip',
    inheritAttrs: false,
  },
)

export default SliderTooltip
