import type { App } from 'vue'
import InternalDropdown from './dropdown'

const Dropdown = InternalDropdown as typeof InternalDropdown & {
  install: (app: App) => void
}

export default Dropdown

export type { DropdownArrowOptions, DropdownEmits, DropdownProps, DropdownSlots } from './dropdown'
