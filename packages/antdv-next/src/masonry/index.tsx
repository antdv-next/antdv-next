import type { App } from 'vue'
import type { MasonryConstructor } from './Masonry'
import _Masonry from './Masonry'

export type { MasonryConstructor, MasonryEmits, MasonryProps, MasonryRef, MasonrySlots } from './Masonry'

;(_Masonry as any).install = (app: App) => {
  app.component(_Masonry.name, _Masonry)
}

export default _Masonry as unknown as MasonryConstructor
