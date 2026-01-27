import type { CSSProperties, Ref } from 'vue'
import type { AnyObject } from '../../_util/type'
import type { RequiredSemanticPicker } from '../generatePicker/interface'
import { clsx } from '@v-c/util'
import { computed, unref } from 'vue'
import { useMergeSemantic, useToArr, useToProps } from '../../_util/hooks'
import { useComponentConfig } from '../../config-provider/context'

export default function useMergedPickerSemantic<P extends AnyObject = AnyObject>(
  pickerType: 'timePicker' | 'datePicker' | 'rangePicker',
  classNames: Ref<P['classes'] | undefined>,
  styles: Ref<P['styles'] | undefined>,
  popupClassName: Ref<string | undefined>,
  popupStyle: Ref<CSSProperties | undefined>,
  mergedProps: Ref<P>,
) {
  const contextConfig = useComponentConfig(pickerType as any)
  const contextClassNames = computed(() => contextConfig.value?.classes as P['classes'])
  const contextStyles = computed(() => contextConfig.value?.styles as P['styles'])

  const [mergedClassNames, mergedStyles] = useMergeSemantic<P['classes'], P['styles'], P>(
    useToArr(contextClassNames, classNames),
    useToArr(contextStyles, styles),
    useToProps(mergedProps),
    computed(() => ({
      popup: {
        _default: 'root',
      },
    })),
  )

  const filledClassNames = computed(() => {
    const className = unref(popupClassName)
    return {
      ...mergedClassNames.value,
      popup: {
        ...mergedClassNames.value.popup,
        root: clsx(mergedClassNames.value.popup?.root, className),
      },
    }
  })

  const filledStyles = computed(() => {
    const style = unref(popupStyle)
    return {
      ...mergedStyles.value,
      popup: {
        ...mergedStyles.value.popup,
        root: {
          ...mergedStyles.value.popup?.root,
          ...(style ?? {}),
        },
      },
    }
  })

  return [filledClassNames, filledStyles] as unknown as RequiredSemanticPicker
}
