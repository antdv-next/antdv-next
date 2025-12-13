import type { DefineComponent, VNode } from 'vue'
import type { ConfigUpdate } from '../confirm'
import type { ModalFuncProps } from '../interface.ts'
import type { HookModalRef } from './interface'
import type { HookAPI, ModalFuncWithPromise } from './types'
import { defineComponent, shallowRef, watch } from 'vue'
import { usePatchElement } from '../../_util/hooks/usePatchElement.ts'
import { withConfirm, withError, withInfo, withSuccess, withWarn } from '../confirm'
import destroyFns from '../destroyFns.ts'
import HookModal from './HookModal'

let uuid = 0

export { type HookModalRef } from './interface'

interface ElementsHolderRef {
  patchElement: (element: VNode) => () => void
}

const ElementsHolder = defineComponent(
  (_, { expose }) => {
    const [elements, patchElement] = usePatchElement()
    expose({
      patchElement,
    })
    return () => {
      return <>{elements.value}</>
    }
  },
  {
    name: 'ElementsHolder',
    inheritAttrs: false,
  },
)

export default function useModal(): readonly [instance: HookAPI, contextHolder: DefineComponent] {
  const holderRef = shallowRef<ElementsHolderRef>()

  // ========================== Effect ==========================
  const actionQueue = shallowRef<VoidFunction[]>([])

  watch(
    actionQueue,
    () => {
      if (actionQueue.value.length) {
        const cloneQueue = [...actionQueue.value]
        cloneQueue.forEach(action => action())
        actionQueue.value = []
      }
    },
    {
      immediate: true,
    },
  )

  // =========================== Hook ===========================
  const getConfirmFunc = (withFunc: (config: ModalFuncProps) => ModalFuncProps) =>
    function hookConfirm(config: ModalFuncProps) {
      uuid += 1
      const modalRef = shallowRef<HookModalRef>()

      let resolvePromise!: (confirmed: boolean) => void
      const promise = new Promise<boolean>((resolve) => {
        resolvePromise = resolve
      })
      let silent = false

      let closePatch: VoidFunction | undefined
      function closeFunc() {
        closePatch?.()
        const index = destroyFns.indexOf(closeFunc)
        if (index !== -1) {
          destroyFns.splice(index, 1)
        }
      }

      // 将 modal VNode 包装成组件，确保 ref 在正确的渲染上下文中
      const ModalWrapper = defineComponent({
        name: 'ModalWrapper',
        setup() {
          return () => (
            <HookModal
              config={withFunc(config)}
              ref={modalRef as any}
              afterClose={() => {
                closeFunc()
              }}
              isSilent={() => silent}
              onConfirm={(confirmed) => {
                resolvePromise(confirmed)
              }}
            />
          )
        },
      })

      const modal = <ModalWrapper key={`modal-${uuid}`} />
      closePatch = holderRef.value?.patchElement(modal as any)
      if (closePatch) {
        destroyFns.push(closeFunc)
      }

      const instance: ReturnType<ModalFuncWithPromise> = {
        destroy: () => {
          const destroyAction = () => modalRef.value?.destroy()
          if (modalRef.value) {
            destroyAction()
          }
          else {
            actionQueue.value = [...actionQueue.value, destroyAction]
          }
        },
        update: (newConfig: ConfigUpdate) => {
          const updateAction = () => modalRef.value?.update(newConfig)
          if (modalRef.value) {
            updateAction()
          }
          else {
            actionQueue.value = [...actionQueue.value, updateAction]
          }
        },
        then: (resolve) => {
          silent = true
          return promise.then(resolve)
        },
      }
      return instance
    }

  const fns = {
    info: getConfirmFunc(withInfo),
    success: getConfirmFunc(withSuccess),
    error: getConfirmFunc(withError),
    warning: getConfirmFunc(withWarn),
    confirm: getConfirmFunc(withConfirm),
  } as HookAPI

  const contextHolder = defineComponent(
    () => {
      return () => {
        return (
          <ElementsHolder key="modal-holder" ref={holderRef as any} />
        )
      }
    },
    {
      name: 'ContextHolder',
      inheritAttrs: false,
    },
  )
  return [fns, contextHolder as any] as const
}

export type { HookAPI, ModalFuncWithPromise }
