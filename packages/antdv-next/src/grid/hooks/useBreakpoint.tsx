import type { Ref } from 'vue'
import type { ScreenMap } from '../../_util/responsiveObserver'
import canUseDom from '@v-c/util/dist/Dom/canUseDom'
import { nextTick, ref, unref, watchEffect } from 'vue'
import useResponsiveObserver from '../../_util/responsiveObserver'

export function useBreakpoint(
  refreshOnChange: boolean | Ref<boolean> = true,
  defaultScreens: ScreenMap | null | Ref<ScreenMap | null> = {} as ScreenMap,
) {
  const screensRef = ref<ScreenMap | null>(unref(defaultScreens))
  const responsiveObserver = useResponsiveObserver()

  watchEffect((onCleanup) => {
    if (!canUseDom()) {
      return
    }
    // observer 在这里同步读取（主题断点变化时会重新订阅），cleanup 只用普通值：
    // 卸载时 onCleanup 在父组件的渲染 effect 中执行，若在其中读 computed，
    // 父组件会订阅到已卸载组件的 computed，导致其无法回收。
    const observer = responsiveObserver.value
    let token: number | undefined
    let cancelled = false
    nextTick(() => {
      // 等待期间已被清理（如挂载后同一轮就卸载），不再订阅，避免订阅永远无法注销
      if (cancelled) {
        return
      }
      token = observer.subscribe(
        (supportScreens) => {
          screensRef.value = unref(supportScreens)
          if (unref(refreshOnChange)) {
            // TODO: trigger component update
          }
        },
      )
    })
    onCleanup(() => {
      cancelled = true
      if (token !== undefined) {
        observer.unsubscribe(token)
      }
    })
  })

  return screensRef
}

export default useBreakpoint
