import useDelayState from '@v-c/util/dist/hooks/useDelayState'
import { shallowRef, unref } from 'vue'
import copy from '../../_util/copy'
import toList from '../../_util/toList'
import { getTextByNode } from '../../_util/vueNode'

function useCopyClick({
  copyConfig,
  getText,
}: {
  copyConfig: any
  getText?: () => any
}) {
  const [copied, setCopied] = useDelayState(false)

  const copyLoading = shallowRef(false)

  const getClipboardText = async () => {
    const config = unref(copyConfig)
    if (typeof config?.text === 'function') {
      return config.text()
    }
    if (config?.text !== undefined) {
      return config.text
    }
    const origin = getText?.()
    const textList = toList(origin, true).map((item) => {
      item = getTextByNode(item)
      if (typeof item === 'string' || typeof item === 'number') {
        return String(item)
      }
      return ''
    })
    return textList.join('')
  }

  const onClick = async (e?: MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    copyLoading.value = true
    try {
      const text = await getClipboardText()
      const config = unref(copyConfig)
      const copyOptions: { format?: 'text/plain' | 'text/html' } = {}
      if (config?.format) {
        copyOptions.format = config.format
      }
      await copy(text == null ? '' : String(text), copyOptions)
      copyLoading.value = false

      setCopied(true, true)

      // Trigger tips update
      setCopied(false, { ms: 3000 })

      unref(copyConfig)?.onCopy?.(e)
    }
    catch (error) {
      copyLoading.value = false
      throw error
    }
  }

  return {
    copied,
    copyLoading,
    onClick,
  }
}

export default useCopyClick
