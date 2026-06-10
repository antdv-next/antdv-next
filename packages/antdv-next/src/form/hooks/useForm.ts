import type { InjectionKey, ShallowRef } from 'vue'
import type { FormInstance } from '../Form'
import type { NamePath } from '../types'
import { warning } from '@v-c/util/dist/warning'
import { getCurrentInstance, inject, provide, shallowRef } from 'vue'
import { toArray } from '../util'

export function toNamePathStr(name: NamePath) {
  const namePath = toArray(name)
  return namePath.join('_')
}

export interface FormHookEntry {
  name?: string
  instanceRef: ShallowRef<FormInstance | undefined>
  /** Current owner of this entry: a Form component uid, or 'explicit' for template ref binding */
  boundBy?: number | 'explicit'
}

export interface FormHookRegistry {
  entries: FormHookEntry[]
}

export const FormHookRegistryKey: InjectionKey<FormHookRegistry> = Symbol('AFormHookRegistry')

export const FormInstanceContextKey: InjectionKey<FormInstance> = Symbol('AFormInstance')

// `provide` from the same component overrides the previous value with the same key,
// and `inject` cannot read values provided by the current component. Cache the
// registry per component instance so multiple `useForm()` calls share one registry.
const registryMap = new WeakMap<object, FormHookRegistry>()

function useFormHookRegistry(): FormHookRegistry {
  const vm = getCurrentInstance()
  if (!vm) {
    // Called outside setup: auto inject is unavailable, explicit template ref binding still works.
    return { entries: [] }
  }
  let registry = registryMap.get(vm)
  if (!registry) {
    registry = { entries: [] }
    registryMap.set(vm, registry)
    provide(FormHookRegistryKey, registry)
  }
  return registry
}

export type FormHookInstance = FormInstance & ((instance: any) => void)

/**
 * Create a form instance proxy before the Form component mounts.
 *
 * Binding (priority order):
 * 1. Explicit: pass it as a template ref — `<Form :ref="form">`.
 * 2. By name: `useForm('login')` connects to `<Form name="login">`.
 * 3. Single/ordered fallback: unnamed instances connect to descendant Forms in declaration order.
 */
export function useForm(name?: string): FormHookInstance {
  const instanceRef = shallowRef<FormInstance>()
  const registry = useFormHookRegistry()
  const entry: FormHookEntry = { name, instanceRef }
  registry.entries.push(entry)

  // Function ref binding: `<Form :ref="form">`
  const bindTemplateRef = (exposed: any) => {
    if (exposed) {
      entry.boundBy = 'explicit'
      instanceRef.value = exposed
    }
    else if (entry.boundBy === 'explicit') {
      entry.boundBy = undefined
      instanceRef.value = undefined
    }
  }

  const proxy = new Proxy(bindTemplateRef, {
    get(_target, key) {
      if (key === '__instanceRef') {
        return instanceRef
      }
      // Silently ignore framework/promise probing on the proxy itself
      if (typeof key === 'symbol' || key === 'then' || key.startsWith('__v_')) {
        return undefined
      }
      const instance = instanceRef.value as any
      if (!instance) {
        warning(
          false,
          'Instance created by `useForm` is not connected to any Form element. Forget to bind it via template ref or a matching `name`?',
        )
        return () => undefined
      }
      const value = instance[key]
      return typeof value === 'function' ? value.bind(instance) : value
    },
  })

  return proxy as unknown as FormHookInstance
}

/**
 * Get the closest Form instance from context. Only usable inside a Form.
 */
export function useFormInstance(): FormInstance {
  return inject(FormInstanceContextKey, undefined as any)
}
