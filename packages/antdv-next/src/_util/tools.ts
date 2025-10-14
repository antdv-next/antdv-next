export function getSlotPropFn(slots: any, props: any, key: string) {
  // TODO: 需要考虑 function slot
  return slots[key] || props[key]
}
