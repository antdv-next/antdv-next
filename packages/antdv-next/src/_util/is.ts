export function isNonNullable<T>(val: T): val is NonNullable<T> {
  return val !== undefined && val !== null
}

export function isRenderable<T>(val: T): val is Exclude<NonNullable<T>, false | ''> {
  return isNonNullable(val) && (val as unknown) !== false && (val as unknown) !== ''
}

export function isNumber(val: any): val is number {
  return typeof val === 'number' && !Number.isNaN(val)
};

export function isString(val: any): val is string {
  return typeof val === 'string'
};

export function isPlainObject<T extends object = object>(val: any): val is T {
  return val !== null && typeof val === 'object'
}

export function isFunction<Value, Args extends unknown[], Result>(
  val: Value | ((...args: Args) => Result),
): val is (...args: Args) => Result {
  return typeof val === 'function'
}

export function isThenable<T>(val?: PromiseLike<T>): val is PromiseLike<T> {
  return isNonNullable(val) && isFunction(val.then)
}

export function isPrimitive(val: any) {
  return (typeof val !== 'object' && !isFunction(val)) || val === null
}

export function isTransitionEvent(event: Event): event is TransitionEvent {
  return isPlainObject(event) && 'propertyName' in event && isString(event.propertyName)
}
