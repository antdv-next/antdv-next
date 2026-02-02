export { default as Marker } from './marker.vue'
export { default as Markers } from './markers.vue'
export { default as SemanticPreview } from './semantic-preview.vue'

export interface RectType {
  left: number
  top: number
  width: number
  height: number
  visible: boolean
}

export interface SemanticItem {
  name: string
  desc: string
  version?: string
}
