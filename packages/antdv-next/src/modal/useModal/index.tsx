import type { VNode } from 'vue'
import type { ConfigUpdate } from '../confirm'
import type { ModalFuncProps } from '../interface.ts'
import type { HookModalRef } from './interface'
import type { HookAPI, ModalFuncWithPromise } from './types'
import { defineComponent, shallowRef, watchEffect } from 'vue'
import { withConfirm, withError, withInfo, withSuccess, withWarn } from '../confirm'
import destroyFns from '../destroyFns.ts'
import HookModal from './HookModal'

let uuid = 0

export { type HookModalRef } from './interface'

interface ElementsHolderRef {
  patchElement: (element: VNode) => () => void
}

const ElementsHolder = defineComponent(
  (_, { expose, slots }) => {
    const elements = shallowRef<VNode[]>([])
    const patchElement = (element: VNode) => {
      elements.value = [...elements.value, element]
      return () => {
        elements.value = elements.value.filter(ele => ele !== element)
      }
    }
    expose({
      patchElement,
    })
    return () => slots.default?.(elements.value)
  },
  {
    name: 'ElementsHolder',
  },
)

export default function useModal(): readonly [instance: HookAPI, contextHolder: () => VNode] {
  const holderRef = shallowRef<ElementsHolderRef>()
  const actionQueue = shallowRef<VoidFunction[]>([])

  watchEffect(() => {
    if (actionQueue.value.length) {
      const cloneQueue = [...actionQueue.value]
      cloneQueue.forEach(action => action())
      actionQueue.value = []
    }
  })

  const getConfirmFunc = (withFunc: (config: ModalFuncProps) => ModalFuncProps) =>
    function hookConfirm(config: ModalFuncProps) {
      uuid += 1
      const modalRef = shallowRef<HookModalRef>()

      let resolvePromise!: (confirmed: boolean) => void
      const promise = new Promise<boolean>((resolve) => {
        resolvePromise = resolve
      })
      let silent = false

      const modal = (
        <HookModal
          key={`modal-${uuid}`}
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

      const closePatch = holderRef.value?.patchElement(modal as any)
      function closeFunc() {
        closePatch?.()
        const index = destroyFns.indexOf(closeFunc)
        if (index !== -1) {
          destroyFns.splice(index, 1)
        }
      }
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

  const contextHolder = () => {
    return (
      <ElementsHolder ref={holderRef as any}>
        {(elements: VNode[]) => elements}
      </ElementsHolder>
    )
  }
  return [fns, contextHolder] as const
}

export type { HookAPI, ModalFuncWithPromise }
