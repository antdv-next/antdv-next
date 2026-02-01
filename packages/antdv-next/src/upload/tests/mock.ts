import { vi } from 'vitest'

const originalXHR = globalThis.XMLHttpRequest

export function setup() {
  const mockXHR = {
    open: vi.fn(),
    send: vi.fn(function () {
      // @ts-expect-error: XMLHttpRequest.send is a method
      // eslint-disable-next-line ts/no-this-alias
      const self = this
      setTimeout(() => {
        if (self.onreadystatechange) {
          self.readyState = 4
          self.status = 200
          self.responseText = '{"success": true}'
          self.onreadystatechange()
        }
        if (self.onload) {
          self.onload()
        }
      }, 100)
    }),
    setRequestHeader: vi.fn(),
    readyState: 0,
    status: 0,
    responseText: '',
    upload: {
      onprogress: null,
    },
    onreadystatechange: null,
    onload: null,
    onerror: null,
  }

  // @ts-expect-error: XMLHttpRequest is a constructor
  globalThis.XMLHttpRequest = function () {
    return mockXHR
  }
}

export function teardown() {
  globalThis.XMLHttpRequest = originalXHR
}
