import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import * as matchers from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'

declare module 'vitest' {
  interface Assertion<T = any>
    extends jest.Matchers<void, T>,
    TestingLibraryMatchers<T, void> {}
}
const _matchers = matchers?.default || matchers

expect.extend(_matchers)
