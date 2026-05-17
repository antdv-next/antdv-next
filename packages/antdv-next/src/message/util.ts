import type { CSSMotionProps } from '@v-c/util/dist/utils/transition'
import type { MessageType } from './interface'

export function getMotion(prefixCls: string, transitionName?: string): CSSMotionProps {
  return {
    name: transitionName ?? `${prefixCls}-fade`,
  }
}

/** Wrap message open with promise like function */
export function wrapPromiseFn(openFn: (resolve: VoidFunction) => VoidFunction): MessageType {
  let closeFn: VoidFunction | undefined

  const closePromise = new Promise<boolean>((resolve) => {
    closeFn = openFn(() => {
      resolve(true)
    })
  })

  const result: any = () => {
    closeFn?.()
  }

  result.then = (filled: VoidFunction, rejected: VoidFunction) => closePromise.then(filled, rejected)
  result.promise = closePromise

  return result as MessageType
}
