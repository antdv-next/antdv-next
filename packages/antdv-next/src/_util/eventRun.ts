type EventHandler = (...args: any[]) => any

function getEventHandlers<T extends Record<string, any>, K extends keyof T>(props: T, key: K): EventHandler[] {
  const targetEvent = props[key]
  if (!targetEvent) {
    return []
  }

  const handlers = (Array.isArray(targetEvent) ? targetEvent : [targetEvent]) as unknown[]
  return handlers.filter((handler): handler is EventHandler => typeof handler === 'function')
}

export function runEvents<T extends Record<string, any>, K extends keyof T>(props: T, key: K, ...events: any[]) {
  const handlers = getEventHandlers(props, key)
  let result: any
  handlers.forEach((handler) => {
    result = handler(...events)
  })

  return result
}

export async function runSyncEvents<T extends Record<string, any>, K extends keyof T>(
  props: T,
  key: K,
  ...events: any[]
) {
  const handlers = getEventHandlers(props, key)
  return Promise.all(handlers.map(handler => Promise.resolve(handler(...events))))
}

export type EventProp<K> = K | K[]
