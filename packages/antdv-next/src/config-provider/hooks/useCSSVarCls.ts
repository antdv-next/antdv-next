import type { Ref } from 'vue'
import { computed } from 'vue'

/**
 * This hook is only for cssVar to add root className for components.
 * If root ClassName is needed, this hook could be refactored with `-root`
 *
 * antd 6 always runs with CSS variables enabled (`useToken()` always yields a
 * cssVar config), so the class is unconditional and no token lookup is needed.
 * @param prefixCls
 */
function useCSSVarCls(prefixCls: Ref<string>) {
  return computed(() => `${prefixCls.value}-css-var`)
}

export default useCSSVarCls
