import { filterEmpty } from '@v-c/util/dist/props-util'
import { defineComponent } from 'vue'
import { NoFormStyle } from '../form/context.tsx'
import { NoCompactStyle } from '../space/Compact.tsx'

export const ContextIsolator = defineComponent<{
  space?: boolean
  form?: boolean
}>(
  (props, { slots }) => {
    return () => {
      const { space, form } = props
      const children = filterEmpty(slots?.default?.())
      if (children.length === 0) {
        return null
      }
      let result: any = children
      if (form) {
        result = (
          <NoFormStyle override status>
            {result}
          </NoFormStyle>
        )
      }

      if (space) {
        result = <NoCompactStyle>{result}</NoCompactStyle>
      }
      return result
    }
  },
)
