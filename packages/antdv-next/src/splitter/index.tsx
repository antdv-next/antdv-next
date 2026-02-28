import type { App } from 'vue'
import type { InternalSplitterProps } from './Splitter'
import Panel from './Panel'
import Splitter from './Splitter'

export type { SplitterEmits, SplitterSlots } from './interface'
export type SplitterProps = InternalSplitterProps

(Splitter as any).Panel = Panel;
(Splitter as any).install = (app: App) => {
  app.component(Splitter.name, Splitter)
  app.component(Panel.name, Panel)
}

export const SplitterPanel = Panel
export default Splitter
