import type { CSSProperties, Ref } from 'vue'
import type { AnyObject, EmptyObject, ValidChar } from '../type'
import { classNames as clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, unref } from 'vue'

export type SemanticSchema = { _default?: string } & {
  [key: `${ValidChar}${string}`]: SemanticSchema
}

export type SemanticClassNames<Name extends string> = Partial<Record<Name, string>>

export type SemanticStyles<Name extends string> = Partial<Record<Name, CSSProperties>>

export type Resolvable<T, P extends AnyObject> = T | ((info: { props: P }) => T)

export type SemanticType<P = any, T = any> = T | ((info: { props: P }) => T)

export type SemanticClassNamesType<
  Props extends AnyObject,
  SemanticClassNames extends { [K in keyof SemanticClassNames]?: string },
  NestedStructure extends EmptyObject = EmptyObject,
> = Resolvable<Readonly<SemanticClassNames>, Props>
  & NestedStructure

export type SemanticStylesType<
  Props extends AnyObject,
  SemanticStyles extends { [K in keyof SemanticStyles]?: CSSProperties },
  NestedStructure extends EmptyObject = EmptyObject,
> = Resolvable<Readonly<SemanticStyles>, Props>
  & NestedStructure
// ========================= ClassNames =========================

// ========================= ClassNames =========================
export function mergeClassNames<
  Name extends string,
  SemanticClassNames extends Partial<Record<Name, any>>,
>(schema?: SemanticSchema, ...classNames: (SemanticClassNames | undefined)[]) {
  const mergedSchema = schema || {}

  return classNames.filter(Boolean).reduce<SemanticClassNames>((acc: any, cur) => {
    // Loop keys of the current classNames
    Object.keys(cur || {}).forEach((key) => {
      const keySchema = mergedSchema[key as keyof SemanticSchema] as SemanticSchema
      const curVal = (cur as SemanticClassNames)[key as keyof SemanticClassNames]
      if (keySchema && typeof keySchema === 'object') {
        if (curVal && typeof curVal === 'object') {
          // Loop fill
          acc[key] = mergeClassNames(keySchema, acc[key], curVal)
        }
        else {
          // Covert string to object structure
          const { _default: defaultField } = keySchema
          if (defaultField) {
            acc[key] = acc[key] || {}
            acc[key][defaultField] = clsx(acc[key][defaultField], curVal)
          }
        }
      }
      else {
        // Flatten fill
        acc[key] = clsx(acc[key], curVal)
      }
    })
    return acc
  }, {} as SemanticClassNames)
}

function useSemanticClassNames<ClassNamesType extends AnyObject>(schema?: SemanticSchema, ...classNames: (Partial<ClassNamesType> | undefined)[]) {
  return mergeClassNames(schema, ...classNames)
}

// =========================== Styles ===========================
export function mergeStyles<StylesType extends AnyObject>(...styles: (Partial<StylesType> | undefined)[]) {
  return styles
    .filter(Boolean)
    .reduce<Record<PropertyKey, CSSProperties>>((acc, cur = {}) => {
      Object.keys(cur).forEach((key) => {
        acc[key] = { ...acc[key], ...cur[key] }
      })
      return acc
    }, {})
}

function useSemanticStyles<StylesType extends AnyObject>(...styles: (Partial<StylesType> | undefined)[]) {
  return mergeStyles(...styles)
}

// =========================== Export ===========================
function fillObjectBySchema<T extends AnyObject>(obj: T, schema: SemanticSchema): T {
  const newObj: any = { ...obj }
  Object.keys(schema).forEach((key) => {
    if (key !== '_default') {
      const nestSchema = (schema as any)[key] as SemanticSchema
      const nextValue = newObj[key] || {}
      newObj[key] = nestSchema ? fillObjectBySchema(nextValue, nestSchema) : nextValue
    }
  })
  return newObj
}

export function resolveStyleOrClass<T extends AnyObject>(value: T | ((config: any) => T), info: { props: AnyObject }) {
  return typeof value === 'function' ? value(info) : value
}

type MaybeFn<T, P> = T | ((info: { props: P }) => T) | undefined

type ObjectOnly<T> = T extends (...args: any) => any ? never : T

/**
 * @desc Merge classNames and styles from multiple sources. When `schema` is provided, it **must** provide the nest object structure.
 * @descZH 合并来自多个来源的 classNames 和 styles，当提供了 `schema` 时，必须提供嵌套的对象结构。
 */
/**
 * @desc Merge classNames and styles from multiple sources. When `schema` is provided, it **must** provide the nest object structure.
 * @descZH 合并来自多个来源的 classNames 和 styles，当提供了 `schema` 时，必须提供嵌套的对象结构。
 */
export function useMergeSemantic<
  ClassNamesType extends AnyObject,
  StylesType extends AnyObject,
  Props extends AnyObject,
>(
  classNamesList: Ref<MaybeFn<ClassNamesType, Props>[]>,
  stylesList: Ref<MaybeFn<StylesType, Props>[]>,
  info: Ref<{ props: Props }>,
  schema?: Ref<SemanticSchema>,
) {
  const resolvedClassNamesList = computed(() => {
    return classNamesList.value.map(classNames => classNames ? resolveStyleOrClass(classNames, info.value) : undefined)
  })
  const resolvedStylesList = computed(() => {
    return stylesList.value.map(styles => styles ? resolveStyleOrClass(styles, info.value) : undefined)
  })

  const mergedClassNames = computed(() => useSemanticClassNames(schema?.value, ...resolvedClassNamesList.value) as ObjectOnly<ClassNamesType>)
  const mergedStyles = computed(() => useSemanticStyles(...resolvedStylesList.value) as ObjectOnly<StylesType>)
  const _merged = computed(() => {
    if (!schema?.value) {
      return [mergedClassNames.value, mergedStyles.value] as const
    }
    return [
      fillObjectBySchema<ObjectOnly<ClassNamesType>>(mergedClassNames.value, schema.value),
      fillObjectBySchema<ObjectOnly<StylesType>>(mergedStyles.value, schema.value),
    ] as const
  })
  return [computed(() => _merged.value[0]), computed(() => _merged.value[1])] as const
}

export function useMergeSemanticNoRef<
  ClassNamesType extends AnyObject,
  StylesType extends AnyObject,
  Props extends AnyObject,
>(
  classNamesList: MaybeFn<ClassNamesType, Props>[],
  stylesList: MaybeFn<StylesType, Props>[],
  info: { props: Props },
  schema?: SemanticSchema,
) {
  const resolvedClassNamesList = classNamesList.map(classNames =>
    classNames ? resolveStyleOrClass(classNames, info) : undefined,
  )

  const resolvedStylesList = stylesList.map(styles =>
    styles ? resolveStyleOrClass(styles, info) : undefined,
  )

  const mergedClassNames = useSemanticClassNames(
    schema,
    ...resolvedClassNamesList,
  ) as ObjectOnly<ClassNamesType>

  const mergedStyles = useSemanticStyles(...resolvedStylesList) as ObjectOnly<StylesType>
  const fn = () => {
    if (!schema) {
      return [mergedClassNames, mergedStyles] as const
    }
    return [
      fillObjectBySchema<ObjectOnly<ClassNamesType>>(mergedClassNames, schema),
      fillObjectBySchema<ObjectOnly<StylesType>>(mergedStyles, schema),
    ] as const
  }
  return fn()
}
export function useToArr<T = any>(...args: Ref<T | undefined>[]) {
  return computed(() => args.map(unref))
}

export function useToProps<T>(props: Ref<T>) {
  return computed(() => ({ props: props.value }))
}

interface RemoveBaseAttributesOptions {
  class?: boolean
  style?: boolean
  omit?: string[]
}
const defaultOptions = {
  class: true,
  style: true,
}

export function pureAttrs(attrs: Record<string, any>, options: RemoveBaseAttributesOptions = defaultOptions) {
  const newAttrs = { ...attrs }
  if (options.class) {
    delete newAttrs.class
  }
  if (options.style) {
    delete newAttrs.style
  }
  if (options.omit) {
    return omit(newAttrs, options.omit)
  }
  return newAttrs
}

export function getAttrStyleAndClass(attrs: Record<string, any>, options?: RemoveBaseAttributesOptions, props?: Record<string, any>) {
  return {
    className: attrs.class ?? props?.class,
    style: attrs.style ?? props?.style,
    restAttrs: pureAttrs(attrs, options),
  } as { className: any, style: any, restAttrs: Record<string, any> }
}
