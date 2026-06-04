import { readFileSync } from 'node:fs'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import demoTest from '/@tests/shared/demoTest'
import { resetMockDate, setMockDate } from '/@tests/utils'

beforeAll(() => {
  setMockDate('2017-09-18T03:30:07.795Z')
})

afterAll(() => {
  resetMockDate()
})

demoTest('calendar')

describe('calendar lunar demo', () => {
  it('keeps lunar demo selected and out-of-panel colors aligned with React demo semantics', () => {
    const source = readFileSync(
      'docs/src/pages/components/calendar/demo/lunar.vue',
      'utf-8',
    )

    expect(source).toContain('panelDate.value = value')
    expect(source).toContain('gray: !panelDate.isSame(date, \'month\')')
    expect(source).toMatch(/\.current\s+\.lunar,\s*\n\.current\s+\.weekend\s*\{\s*color:\s*v-bind\('token\.colorTextLightSolid'\);\s*\}/)
    expect(source).toContain('color: v-bind(\'token.colorError\');')
    expect(source).not.toContain('.current .lunar {\n  color: v-bind(\'token.colorText\');')
    expect(source).not.toContain('color: inherit;')
  })
})
