import { LeftOutlined, LoadingOutlined, RightOutlined } from '@antdv-next/icons'

const defaultLoadingIcon = <LoadingOutlined spin />
const defaultExpandIcon = <RightOutlined />
const defaultRtlExpandIcon = <LeftOutlined />

export interface UseIconsOptions {
  isRtl: boolean
  expandIcon: any | undefined
  loadingIcon: any | undefined
  contextExpandIcon: any | undefined
  contextLoadingIcon: any | undefined
}

export default function useIcons({
  contextExpandIcon,
  contextLoadingIcon,
  expandIcon,
  loadingIcon,
  isRtl,
}: UseIconsOptions) {
  return {
    expandIcon: expandIcon ?? contextExpandIcon ?? (isRtl ? defaultRtlExpandIcon : defaultExpandIcon),
    loadingIcon: loadingIcon ?? contextLoadingIcon ?? defaultLoadingIcon,
  }
}
