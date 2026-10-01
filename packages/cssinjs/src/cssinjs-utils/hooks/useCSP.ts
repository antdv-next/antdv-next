import type { Ref } from 'vue'
import { ref } from 'vue'

export type UseCSP = () => Ref<{
  nonce?: string
}>

// Shared empty config: nothing ever writes to it, so one ref serves every caller.
const defaultCSP = ref({})

const useDefaultCSP: UseCSP = () => defaultCSP

export default useDefaultCSP
