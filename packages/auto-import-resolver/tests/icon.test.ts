import type { ComponentResolverObject } from 'unplugin-vue-components'
import { describe, expect, it } from 'vitest'

import { AntdvNextResolver } from '../src'

describe('antdvNextResolver icons', () => {
  it('icon name matching', async () => {
    const resolver = AntdvNextResolver({ resolveIcons: true }) as ComponentResolverObject
    expect(resolver.resolve('TrophyFilled')).toStrictEqual({ name: 'TrophyFilled', from: '@antdv-next/icons' })
    expect(resolver.resolve('TrophyFilled2')).toBeFalsy()
  })
})
