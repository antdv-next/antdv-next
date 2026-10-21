import type { Components } from '@v-c/picker'
import type { DefineComponent } from 'vue'
import PickerButton from '../PickerButton'

export default function useComponents(components?: Components): Components {
  return {
    // `Components['button']` from @v-c/picker is typed as the bare `DefineComponent`,
    // which a typed setup-function component is not assignable to (library typing gap).
    button: PickerButton as unknown as DefineComponent,
    ...(components ?? {}),
  }
}
