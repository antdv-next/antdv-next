import type { ComponentResolverObject } from 'unplugin-vue-components'
import { describe, expect, it } from 'vitest'

import { AntdvNextResolver } from '../src'

describe('antdvNextResolver exclude', () => {
  it('component name matching string rule should not be resolved', async () => {
    const resolver = AntdvNextResolver({ exclude: 'Radio' }) as ComponentResolverObject
    expect(resolver.resolve('Radio')).toBeFalsy()
  })

  it('component name matching RegExp rule should not be resolved', async () => {
    const resolver = AntdvNextResolver({ exclude: /^Radio[A-Z]/ }) as ComponentResolverObject
    expect(resolver.resolve('Radio')).toBeFalsy()
    expect(resolver.resolve('RadioGroup')).toBeFalsy()
    expect(resolver.resolve('RadioButton')).toBeFalsy()
  })

  it('component name matching Array<string | RegExp> rule should not be resolved', async () => {
    const resolver = AntdvNextResolver({ exclude: ['Button', /^Radio[A-Z]/] }) as ComponentResolverObject
    expect(resolver.resolve('Button')).toBeFalsy()
    expect(resolver.resolve('Radio')).toBeFalsy()
    expect(resolver.resolve('RadioGroup')).toBeFalsy()
    expect(resolver.resolve('RadioButton')).toBeFalsy()
  })

  it('icon name matching RegExp rule should not be resolved', async () => {
    const resolver = AntdvNextResolver({ resolveIcons: true, exclude: /^WeiboCircle[A-Z]/ }) as ComponentResolverObject
    expect(resolver.resolve('WeiboCircleFilled')).toBeFalsy()
    expect(resolver.resolve('WeiboCircleOutlined')).toBeFalsy()
    expect(resolver.resolve('WhatsAppOutlined')).toBeTruthy()
  })
})
