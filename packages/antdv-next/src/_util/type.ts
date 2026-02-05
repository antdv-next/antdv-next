import type { VNode, VNodeChild } from 'vue'

export type AnyObject = Record<string, any>

export type EmptyObject = Record<never, never>

export type RenderNodeFn<Args extends any[] = any[]> = (...args: Args) => VNodeChild

export type VueNode<Args extends any[] = any[]> = RenderNodeFn<Args> | string | number | null | undefined | VNode | boolean

export type EmitsArrToEvent<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends any[] ? (...args: T[K]) => void : T[K]
}

export type EmitsType<T extends Record<string, any>> = EmitsArrToEvent<T>

export interface EmptyEmit {
}
export type SlotsDefineType<T extends Record<string, any> = Record<string, any>> = {
  default?: () => any
} & T

export type ValidChar
  = | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'g'
    | 'h'
    | 'i'
    | 'j'
    | 'k'
    | 'l'
    | 'm'
    | 'n'
    | 'o'
    | 'p'
    | 'q'
    | 'r'
    | 's'
    | 't'
    | 'u'
    | 'v'
    | 'w'
    | 'x'
    | 'y'
    | 'z'
