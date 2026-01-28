import type { DOMWindow } from 'jsdom'

import util from 'node:util'
import { vi } from 'vitest'
import { version } from 'vue'

console.log('Current Vue Version:', version)

const originConsoleErr = console.error

// Vue-specific warnings to suppress in tests
const ignoreWarns = [
  // Vue runtime warnings that are noisy in tests
  '[Vue warn]',
  'Extraneous non-props attributes',
  'Extraneous non-emits event listeners',
  'Missing required prop',
]

// Hack off Vue warning to avoid too large log in CI.
console.error = (...args: any[]) => {
  const str = args.join('').replace(/\n/g, '')
  if (ignoreWarns.every(warn => !str.includes(warn))) {
    originConsoleErr(...args)
  }
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] }

// This function can not move to external file since test setup not support
export function fillWindowEnv(window: Window | DOMWindow) {
  const win = window as Writeable<Window> & typeof globalThis

  win.resizeTo = (width, height) => {
    win.innerWidth = width || win.innerWidth
    win.innerHeight = height || win.innerHeight
    win.dispatchEvent(new Event('resize'))
  }
  win.scrollTo = () => {}

  // ref: https://github.com/ant-design/ant-design/issues/18774
  if (!win.matchMedia) {
    Object.defineProperty(win, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: query.includes('max-width'),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })
  }

  // Fix css-animation or @v-c/motion deps on these
  win.AnimationEvent = win.AnimationEvent || (win.Event as any)
  win.TransitionEvent = win.TransitionEvent || (win.Event as any)

  // ref: https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  // ref: https://github.com/jsdom/jsdom/issues/2524
  Object.defineProperty(win, 'TextEncoder', { writable: true, value: util.TextEncoder })
  Object.defineProperty(win, 'TextDecoder', { writable: true, value: util.TextDecoder })

  // Mock getComputedStyle to handle pseudoElt parameter
  const originalGetComputedStyle = win.getComputedStyle
  win.getComputedStyle = (elt: Element, pseudoElt?: string | null | undefined) => {
    if (pseudoElt) {
      // Return a mock style object for pseudo-elements
      return {
        getPropertyValue: (prop: string) => {
          const defaults: Record<string, string> = {
            'width': '0px',
            'height': '0px',
            'padding': '0px',
            'margin': '0px',
            'border': '0px',
            'background-color': 'transparent',
            'color': 'rgb(0, 0, 0)',
            'font-size': '16px',
            'line-height': 'normal',
            'display': 'block',
            'position': 'static',
            'overflow': 'visible',
            'overflow-x': 'visible',
            'overflow-y': 'visible',
          }
          return defaults[prop] || ''
        },
      } as CSSStyleDeclaration
    }
    return originalGetComputedStyle.call(win, elt, pseudoElt)
  }
}

if (typeof window !== 'undefined') {
  fillWindowEnv(window)
}

global.requestAnimationFrame = global.requestAnimationFrame || global.setTimeout
global.cancelAnimationFrame = global.cancelAnimationFrame || global.clearTimeout

if (typeof MessageChannel === 'undefined') {
  (global as any).MessageChannel = class {
    port1: any
    port2: any

    constructor() {
      const createPort = (): any => {
        const port: any = {
          onmessage: null,
          postMessage: (message: any) => {
            setTimeout(() => {
              port._target?.onmessage?.({ data: message })
            }, 0)
          },
          _target: null,
        }
        return port
      }

      const port1 = createPort()
      const port2 = createPort()
      port1._target = port2
      port2._target = port1
      this.port1 = port1
      this.port2 = port2
    }
  } as any
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (global.HTMLElement) {
  global.HTMLElement.prototype.scrollIntoView = () => {}
}
