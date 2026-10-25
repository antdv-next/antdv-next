import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import useIcons from '../hooks/useIcons'

function createIcon() {
  return h('span', { class: 'cascader-icon' })
}

describe('cascader useIcons shared vnode', () => {
  it('should clone a shared expandIcon instead of reusing it', () => {
    const sharedIcon = createIcon()
    const { expandIcon } = useIcons({
      isRtl: false,
      expandIcon: sharedIcon,
      loadingIcon: undefined,
      contextExpandIcon: undefined,
      contextLoadingIcon: undefined,
    })

    expect(expandIcon).not.toBe(sharedIcon)
    expect((expandIcon as any).el).toBeFalsy()
  })

  it('should clone a shared contextExpandIcon instead of reusing it', () => {
    const sharedIcon = createIcon()
    const { expandIcon } = useIcons({
      isRtl: false,
      expandIcon: undefined,
      loadingIcon: undefined,
      contextExpandIcon: sharedIcon,
      contextLoadingIcon: undefined,
    })

    expect(expandIcon).not.toBe(sharedIcon)
    expect((expandIcon as any).el).toBeFalsy()
  })

  it('should clone a shared loadingIcon instead of reusing it', () => {
    const sharedIcon = createIcon()
    const { loadingIcon } = useIcons({
      isRtl: false,
      expandIcon: undefined,
      loadingIcon: sharedIcon,
      contextExpandIcon: undefined,
      contextLoadingIcon: undefined,
    })

    expect(loadingIcon).not.toBe(sharedIcon)
    expect((loadingIcon as any).el).toBeFalsy()
  })

  it('should clone a shared contextLoadingIcon instead of reusing it', () => {
    const sharedIcon = createIcon()
    const { loadingIcon } = useIcons({
      isRtl: false,
      expandIcon: undefined,
      loadingIcon: undefined,
      contextExpandIcon: undefined,
      contextLoadingIcon: sharedIcon,
    })

    expect(loadingIcon).not.toBe(sharedIcon)
  })
})
