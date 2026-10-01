import type { Ref } from 'vue'
import type { StyleTokenResult } from '../../theme/util/genStyleUtils'
import type { WaveProps } from './index.tsx'
import type { ShowWave, WaveComponent } from './interface'
import raf from '@v-c/util/dist/raf'
import { onBeforeUnmount, ref, unref } from 'vue'
import { useConfig } from '../../config-provider/context.ts'
import { useStyleToken } from '../../theme/util/genStyleUtils'
import { TARGET_CLS } from './interface'
import showWaveEffect from './WaveEffect'

export default function useWave(
  nodeRef: Ref<HTMLElement | null | undefined>,
  className: string | Ref<string>,
  component?: WaveComponent | Ref<WaveComponent | undefined>,
  colorSource?: Ref<WaveProps['colorSource']>,
  tokenResult: StyleTokenResult = useStyleToken(),
) {
  const configCtx = useConfig()
  // Both are always present in antdv-next's token result; the cssinjs type keeps them optional.
  const token = tokenResult.realToken!
  const hashId = tokenResult.hashId!

  const showWave: ShowWave = (event) => {
    const node = nodeRef.value
    if (!node) {
      return
    }
    const waveConfig = configCtx.value.wave
    if (waveConfig?.disabled) {
      return
    }

    const targetNode = node.querySelector<HTMLElement>(`.${TARGET_CLS}`) || node
    const { showEffect } = waveConfig ?? {} as any

    (showEffect || showWaveEffect)(targetNode, {
      className: unref(className),
      token: token.value,
      component: unref(component) ?? undefined,
      event,
      hashId: hashId.value,
      colorSource: colorSource ? unref(colorSource) : undefined,
    })
  }

  const rafId = ref<number>()

  const showDebounceWave: ShowWave = (event) => {
    if (rafId.value !== undefined) {
      raf.cancel(rafId.value)
    }
    rafId.value = raf(() => {
      showWave(event)
    })
  }

  onBeforeUnmount(() => {
    if (rafId.value !== undefined) {
      raf.cancel(rafId.value)
    }
  })

  return showDebounceWave
}
