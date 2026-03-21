import type { Ref } from 'vue'
import type { MaskType } from '../../_util/hooks'
import type { VueNode } from '../../_util/type.ts'
import type { PreviewConfig } from '../index.tsx'
import type { GroupPreviewConfig } from '../PreviewGroup.tsx'
import { computed, isVNode } from 'vue'
import { getSlotPropsFnRun } from '../../_util/tools.ts'
import { devUseWarning, isDev } from '../../_util/warning.ts'

function normalizeMask(mask?: MaskType | VueNode) {
  mask = getSlotPropsFnRun({}, { mask }, 'mask')
  if (isVNode(mask)) {
    return [mask, undefined]
  }
  if (mask === true) {
    return [undefined, { blur: true }]
  }
  if (mask === false) {
    return [undefined, false]
  }
  if (mask && typeof mask === 'object') {
    return [undefined, { blur: true, ...mask }]
  }
  return [undefined, undefined]
}

export default function usePreviewConfig<T extends PreviewConfig | GroupPreviewConfig>(preview: Ref<T | boolean | undefined>) {
  // Get origin preview config
  const rawPreviewConfig = computed(() => {
    if (typeof preview.value === 'boolean') {
      return preview.value ? {} : null
    }
    return preview.value && typeof preview.value === 'object' ? preview.value : {}
  })

  const splittedPreviewConfig = computed(() => {
    if (!rawPreviewConfig.value) {
      return [rawPreviewConfig.value, '', '']
    }

    const {
      open,
      onOpenChange,
      cover,
      actionsRender,

      visible,
      onVisibleChange,
      rootClassName,
      maskClassName,
      mask,
      forceRender: _forceRender,
      destroyOnClose: _destroyOnClose,
      toolbarRender,

      ...restPreviewConfig
    } = rawPreviewConfig.value as GroupPreviewConfig
    & Pick<PreviewConfig, 'cover' | 'mask' | 'maskClassName'>

    let onInternalOpenChange: typeof onOpenChange
    if (onOpenChange) {
      onInternalOpenChange = onOpenChange
    }
    else if (onVisibleChange) {
      onInternalOpenChange = (nextOpen, info) => {
        const { current } = info || {}
        if (current !== undefined) {
          onVisibleChange(nextOpen, !nextOpen, current)
        }
        else {
          (onVisibleChange as NonNullable<PreviewConfig['onVisibleChange']>)(nextOpen, !nextOpen)
        }
      }
    }

    const [coverElement, maskConfig] = normalizeMask(mask)

    return [
      {
        ...restPreviewConfig,
        open: open ?? visible,
        onOpenChange: onInternalOpenChange,
        cover: cover ?? coverElement,
        mask: maskConfig,
        actionsRender: actionsRender ?? toolbarRender,
      },
      rootClassName,
      maskClassName,
    ] as const
  })

  if (isDev) {
    const warning = devUseWarning('Image')

    if (rawPreviewConfig.value) {
      [
        ['visible', 'open'],
        ['onVisibleChange', 'onOpenChange'],
        ['maskClassName', 'classNames.cover'],
        ['rootClassName', 'classNames.root'],
        ['toolbarRender', 'actionsRender'],
      ].forEach(([deprecatedName, newName]) => {
        // @ts-expect-error this is dev only
        warning.deprecated(!(deprecatedName! in rawPreviewConfig.value), deprecatedName!, newName!)
      })
      warning(
        // @ts-expect-error this is dev only
        !isVNode(rawPreviewConfig.value?.mask),
        'deprecated',
        '`mask` used as ReactNode is deprecated. Please use `cover` instead.',
      )
      warning(
        !('forceRender' in rawPreviewConfig.value),
        'breaking',
        '`forceRender` is no longer supported.',
      )
      warning(
        !('destroyOnClose' in rawPreviewConfig.value),
        'breaking',
        '`destroyOnClose` is no longer supported.',
      )
    }
  }

  return splittedPreviewConfig
}
