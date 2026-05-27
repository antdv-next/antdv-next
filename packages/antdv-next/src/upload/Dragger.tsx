import type { SlotsType } from 'vue'
import type { EmptyEmit } from '../_util/type.ts'
import type { UploadProps, UploadSlots } from './interface'
import type { UploadRef } from './Upload'
import { computed, defineComponent, shallowRef } from 'vue'
import { getAttrStyleAndClass } from '../_util/hooks'
import Upload from './Upload'

export type DraggerProps<T = any> = UploadProps<T> & { height?: number }

const Dragger = defineComponent<
  DraggerProps,
  EmptyEmit,
  string,
  SlotsType<UploadSlots>
>(
  (props, { slots, attrs, expose }) => {
    const uploadRef = shallowRef<UploadRef>()

    expose({
      onBatchStart: (...args: Parameters<NonNullable<UploadRef['onBatchStart']>>) => uploadRef.value?.onBatchStart?.(...args),
      onSuccess: (...args: Parameters<UploadRef['onSuccess']>) => uploadRef.value?.onSuccess?.(...args),
      onProgress: (...args: Parameters<UploadRef['onProgress']>) => uploadRef.value?.onProgress?.(...args),
      onError: (...args: Parameters<UploadRef['onError']>) => uploadRef.value?.onError?.(...args),
      fileList: computed(() => uploadRef.value?.fileList ?? []),
      upload: computed(() => uploadRef.value?.upload ?? null),
      nativeElement: computed(() => uploadRef.value?.nativeElement ?? null),
    })

    return () => {
      const { height, hasControlInside = false, ...restProps } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const mergedStyle = { ...style, height }

      return (
        <Upload
          {...restAttrs}
          {...restProps}
          ref={uploadRef}
          class={className}
          style={mergedStyle}
          hasControlInside={hasControlInside}
          type="drag"
          v-slots={slots}
        />
      )
    }
  },
  {
    name: 'AUploadDragger',
    inheritAttrs: false,
  },
)

export default Dragger
