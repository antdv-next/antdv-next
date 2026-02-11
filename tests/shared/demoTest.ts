import { readdirSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { beforeAll, describe, expect, it } from 'vitest'
import { mount } from '../utils'

const testDir = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(testDir, '../..')

interface DemoTestOptions {
  /** Skip all demos or specific demo names (without .vue extension) */
  skip?: boolean | string[]
}

export default function demoTest(component: string, options: DemoTestOptions = {}) {
  const demoDir = resolve(rootDir, 'playground/src/pages/components', component, 'demo')

  let files: string[] = []
  try {
    files = readdirSync(demoDir).filter(f => f.endsWith('.vue')).sort()
  }
  catch {
    // No demo directory found
  }

  if (options.skip === true || files.length === 0) {
    describe.skip(`${component} demo`, () => {
      it('skipped', () => {})
    })
    return
  }

  describe(`${component} demo`, () => {
    let antd: any
    beforeAll(async () => {
      const mod = await import('../../packages/antdv-next/src/index')
      antd = mod.default
    }, 60000)

    files.forEach((file) => {
      const name = basename(file, '.vue')
      const shouldSkip = Array.isArray(options.skip) && options.skip.includes(name)
      const testFn = shouldSkip ? it.skip : it

      testFn(`renders ${name} correctly`, async () => {
        const { default: Demo } = await import(/* @vite-ignore */ resolve(demoDir, file))

        const wrapper = mount(Demo, {
          global: {
            plugins: [antd],
          },
          attachTo: document.body,
        })

        expect(wrapper.element).toMatchSnapshot()
        wrapper.unmount()
      }, 30000)
    })
  })
}
