import 'vue'

declare module 'vue' {
  import type {
    ComponentObjectPropsOptions,
    ComponentOptions,
    DefineSetupFnComponent,
    RenderFunction,
    SetupContext,
    SlotsType,
  } from 'vue'

  export declare function defineComponent<Props extends Record<string, any>, E extends Record<string, any> = object, EE extends string = string, S extends SlotsType = object>(setup: (props: Props, ctx: SetupContext<E, S>) => RenderFunction | Promise<RenderFunction>, options?: Pick<ComponentOptions, 'name' | 'inheritAttrs'> & {
    props?: (keyof Props)[]
    emits?: E | EE[]
    slots?: S
  }): DefineSetupFnComponent<Props, E, S>
  export declare function defineComponent<Props extends Record<string, any>, E extends Record<string, any> = object, EE extends string = string, S extends SlotsType = object>(setup: (props: Props, ctx: SetupContext<E, S>) => RenderFunction | Promise<RenderFunction>, options?: Pick<ComponentOptions, 'name' | 'inheritAttrs'> & {
    props?: ComponentObjectPropsOptions<Props>
    emits?: E | EE[]
    slots?: S
  }): DefineSetupFnComponent<Props, E, S>
}
export {}
