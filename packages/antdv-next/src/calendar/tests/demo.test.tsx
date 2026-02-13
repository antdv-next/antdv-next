import { afterAll, beforeAll } from 'vitest'
import demoTest from '/@tests/shared/demoTest'
import { resetMockDate, setMockDate } from '/@tests/utils'

beforeAll(() => {
  setMockDate()
})

afterAll(() => {
  resetMockDate()
})

demoTest('calendar')
