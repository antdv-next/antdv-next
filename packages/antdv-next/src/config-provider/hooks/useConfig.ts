import { useDisabledContext } from '../DisabledContext.tsx'
import { useSizeContext } from '../SizeContext.tsx'

export function useExportConfig() {
  const componentDisabled = useDisabledContext()
  const componentSize = useSizeContext()
  return {
    componentDisabled,
    componentSize,
  }
}
