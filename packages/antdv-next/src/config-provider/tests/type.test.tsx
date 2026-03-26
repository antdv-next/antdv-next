import type { ConfigProviderProps } from '..'
import { describe, expect, it } from 'vitest'

type IsAny<T> = 0 extends (1 & T) ? true : false
type ExpectFalse<T extends false> = T

type ClassesOf<K extends keyof ConfigProviderProps> = NonNullable<ConfigProviderProps[K]> extends {
  classes?: infer T
}
  ? T
  : never

type StylesOf<K extends keyof ConfigProviderProps> = NonNullable<ConfigProviderProps[K]> extends {
  styles?: infer T
}
  ? T
  : never

const classAssertions: [
  ExpectFalse<IsAny<ClassesOf<'anchor'>>>,
  ExpectFalse<IsAny<ClassesOf<'breadcrumb'>>>,
  ExpectFalse<IsAny<ClassesOf<'calendar'>>>,
  ExpectFalse<IsAny<ClassesOf<'checkbox'>>>,
  ExpectFalse<IsAny<ClassesOf<'descriptions'>>>,
  ExpectFalse<IsAny<ClassesOf<'divider'>>>,
  ExpectFalse<IsAny<ClassesOf<'dropdown'>>>,
  ExpectFalse<IsAny<ClassesOf<'progress'>>>,
  ExpectFalse<IsAny<ClassesOf<'radio'>>>,
  ExpectFalse<IsAny<ClassesOf<'result'>>>,
  ExpectFalse<IsAny<ClassesOf<'segmented'>>>,
  ExpectFalse<IsAny<ClassesOf<'skeleton'>>>,
  ExpectFalse<IsAny<ClassesOf<'slider'>>>,
  ExpectFalse<IsAny<ClassesOf<'splitter'>>>,
  ExpectFalse<IsAny<ClassesOf<'statistic'>>>,
  ExpectFalse<IsAny<ClassesOf<'steps'>>>,
  ExpectFalse<IsAny<ClassesOf<'timeline'>>>,
  ExpectFalse<IsAny<ClassesOf<'tree'>>>,
] = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
]

const styleAssertions: [
  ExpectFalse<IsAny<StylesOf<'anchor'>>>,
  ExpectFalse<IsAny<StylesOf<'breadcrumb'>>>,
  ExpectFalse<IsAny<StylesOf<'calendar'>>>,
  ExpectFalse<IsAny<StylesOf<'checkbox'>>>,
  ExpectFalse<IsAny<StylesOf<'descriptions'>>>,
  ExpectFalse<IsAny<StylesOf<'divider'>>>,
  ExpectFalse<IsAny<StylesOf<'dropdown'>>>,
  ExpectFalse<IsAny<StylesOf<'progress'>>>,
  ExpectFalse<IsAny<StylesOf<'radio'>>>,
  ExpectFalse<IsAny<StylesOf<'result'>>>,
  ExpectFalse<IsAny<StylesOf<'segmented'>>>,
  ExpectFalse<IsAny<StylesOf<'skeleton'>>>,
  ExpectFalse<IsAny<StylesOf<'slider'>>>,
  ExpectFalse<IsAny<StylesOf<'splitter'>>>,
  ExpectFalse<IsAny<StylesOf<'statistic'>>>,
  ExpectFalse<IsAny<StylesOf<'steps'>>>,
  ExpectFalse<IsAny<StylesOf<'timeline'>>>,
  ExpectFalse<IsAny<StylesOf<'tree'>>>,
] = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
]

describe('config-provider.TypeScript', () => {
  it('semantic config entries should expose typed classes and styles', () => {
    expect(classAssertions).toHaveLength(18)
    expect(styleAssertions).toHaveLength(18)
  })
})
