import type { Ref } from 'vue'

import type { CSPConfig } from '../../config-provider'
import { useStyleRegister } from '@antdv-next/cssinjs'
import { computed } from 'vue'
import { genIconStyle } from '../../style'
import useToken from '../useToken'

function useResetIconStyle(iconPrefixCls: Ref<string>, csp?: Ref<CSPConfig | undefined>) {
  const [theme, token] = useToken()

  // Generate style for icons
  return useStyleRegister(
    computed(() => ({
      theme: theme.value!,
      token: token.value,
      hashId: '',
      path: ['ant-design-icons', iconPrefixCls.value],
      nonce: () => csp!.value!.nonce!,
      layer: {
        name: 'antd',
      },
    })),
    () => genIconStyle(iconPrefixCls.value),
  )
}

export default useResetIconStyle
