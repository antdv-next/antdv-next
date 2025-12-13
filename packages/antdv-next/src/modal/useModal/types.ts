import type { ModalFunc, ModalStaticFunctions } from '../confirm.tsx'

// Add `then` field for `ModalFunc` return instance.
export type ModalFuncWithPromise = (...args: Parameters<ModalFunc>) => ReturnType<ModalFunc> & {
  then: <T>(resolve: (confirmed: boolean) => T, reject: VoidFunction) => Promise<T>
}

export type HookAPI = Omit<Record<keyof ModalStaticFunctions, ModalFuncWithPromise>, 'warn'>
