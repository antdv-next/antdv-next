import type {
  AllowedComponentProps,
  ComponentCustomProps,
  ComponentObjectPropsOptions,
  ComponentOptions,
  ComponentPublicInstance,
  DefineSetupFnComponent,
  EmitsOptions,
  RenderFunction,
  SetupContext,
  SlotsType,
  VNodeProps,
} from 'vue'

type PublicProps = VNodeProps & AllowedComponentProps & ComponentCustomProps

// 从你们的 interface emits 里提取精确 emit 调用
type EmitFnFromRecord<E> = <
  K extends Extract<keyof E, string>,
>(
  event: K,
  ...args: E[K] extends (...a: infer A) => any ? A : never
) => void

// 把 emits record 映射成 onXxx props（给 TSX/工具链用）
type EmitsToPropsLoose<E> = {
  [K in Extract<keyof E, string> as `on${Capitalize<K>}`]?: (
    ...args: E[K] extends (...a: infer A) => any ? A : any[]
  ) => any
}

// 给返回组件“补”精确的 $emit + $props（不引入 string 索引签名）
interface WithTypedEmits<Props, E> {
  new (): ComponentPublicInstance & {
    $emit: EmitFnFromRecord<E>
    $props: Props & EmitsToPropsLoose<E> & PublicProps
  }
}

// setup ctx：不要再走 Vue 的 E extends EmitsOptions 约束链，直接替换 emit
type SetupContextLoose<E, S extends SlotsType>
  = Omit<SetupContext<EmitsOptions, S>, 'emit'> & { emit: EmitFnFromRecord<E> }

declare module 'vue' {
  /**
   * 你们子集专用 overload：
   * - E 不要求 EmitsOptions（无需索引签名）
   * - 用 __typeEmits 把“真实事件类型”喂给 language-tools
   * - 返回仍保持 DefineSetupFnComponent<Props, EmitsOptions, S>，不破坏既有提示
   */
  export function defineComponent<
    Props extends Record<string, any>,
    E extends Record<string, any> = any,
    EE extends string = string,
    S extends SlotsType = any,
  >(
    setup: (props: Props, ctx: SetupContextLoose<E, S>) => RenderFunction | Promise<RenderFunction>,
    options?: Pick<ComponentOptions, 'name' | 'inheritAttrs'> & {
      props?: (keyof Props)[]
      emits?: EE[] // runtime emits 用字符串数组就好
      slots?: S
      /**
       * @private for language-tools use only
       */
      __typeEmits?: E
    },
  ): DefineSetupFnComponent<Props, EmitsOptions, S> & WithTypedEmits<Props, E>

  export function defineComponent<
    Props extends Record<string, any>,
    E extends Record<string, any> = any,
    EE extends string = string,
    S extends SlotsType = any,
  >(
    setup: (props: Props, ctx: SetupContextLoose<E, S>) => RenderFunction | Promise<RenderFunction>,
    options?: Pick<ComponentOptions, 'name' | 'inheritAttrs'> & {
      props?: ComponentObjectPropsOptions<Props>
      emits?: EE[]
      slots?: S
      /**
       * @private for language-tools use only
       */
      __typeEmits?: E
    },
  ): DefineSetupFnComponent<Props, EmitsOptions, S> & WithTypedEmits<Props, E>
}

export {}
