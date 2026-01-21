import type { Ref } from 'vue'
import type { MaskType } from '../../_util/hooks'
import type { PreviewConfig } from '../index.tsx'
import type { GroupPreviewConfig } from '../PreviewGroup.tsx'
import { clsx } from '@v-c/util'
import { getTransitionName } from '@v-c/util/dist/utils/transition'
import { computed } from 'vue'
import { useMergedMask, useZIndex } from '../../_util/hooks'

function useMergedPreviewConfig<T extends PreviewConfig | GroupPreviewConfig>(
  previewConfig: Ref<T>,
  contextPreviewConfig: Ref<T>,
  prefixCls: Ref<string>,
  mergedRootClassName: Ref<string>,
  getContextPopupContainer: PreviewConfig['getContainer'],
  icons: Ref<PreviewConfig['icons']>,
  defaultCover?: Ref<any>,
) {
  const [zIndex] = useZIndex('ImagePreview', computed(() => previewConfig.value?.zIndex))

  const [mergedPreviewMask, blurClassName] = useMergedMask(
    computed(() => previewConfig.value?.mask as MaskType),
    computed(() => contextPreviewConfig.value?.mask as MaskType),
    computed(() => `${prefixCls.value}-preview`),
  )

  return computed(() => {
    if (!previewConfig.value) {
      return previewConfig.value
    }
    const {
      cover,
      getContainer,
      closeIcon,
      rootClassName: previewRootClassName,
    } = previewConfig.value as PreviewConfig

    const { closeIcon: contextCloseIcon } = contextPreviewConfig.value ?? {}
    return {
      motionName: getTransitionName(`${prefixCls.value}-preview`, 'fade'),
      ...previewConfig.value,
      ...(defaultCover?.value ? { cover: cover ?? defaultCover.value } : {}),
      icons: icons.value,
      getContainer: getContainer ?? getContextPopupContainer,
      zIndex: zIndex.value,
      closeIcon: closeIcon ?? contextCloseIcon,
      rootClassName: clsx(mergedRootClassName.value, previewRootClassName),
      mask: mergedPreviewMask.value,
      blurClassName: blurClassName.value?.mask,
    }
  })
}

export default useMergedPreviewConfig
