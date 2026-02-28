import type { App } from 'vue'
import Panel from './Panel'
import Splitter from './Splitter'

export type { SplitterEmits, SplitterSlots } from './interface'
export type { InternalSplitterProps as SplitterProps } from './Splitter'

(Splitter as any).Panel = Panel;
(Splitter as any).install = (app: App) => {
  app.component(Splitter.name, Splitter)
  app.component(Panel.name, Panel)
}

export const SplitterPanel = Panel
export default Splitter
