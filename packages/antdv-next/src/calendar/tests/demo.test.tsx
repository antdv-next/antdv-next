import { afterAll, beforeAll } from 'vitest'
import demoTest from '/@tests/shared/demoTest'
import { resetMockDate, setMockDate } from '/@tests/utils'

beforeAll(() => {
  setMockDate('2017-09-18T03:30:07.795Z')
})

afterAll(() => {
  resetMockDate()
})

demoTest('calendar')
