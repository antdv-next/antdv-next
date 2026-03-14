import type { CollapsePanelProps, CollapsePanelSlots } from './CollapsePanel'
import Collapse from './Collapse'
import CollapsePanel from './CollapsePanel'

;

(Collapse as any).Panel = CollapsePanel

export default Collapse
export {
  CollapsePanel,
}

export type { CollapseProps } from './Collapse'
export type { CollapsePanelProps, CollapsePanelSlots }
