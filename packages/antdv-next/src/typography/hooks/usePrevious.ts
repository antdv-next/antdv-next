import { ref, watch } from 'vue'

function usePrevious<T>(value: () => T): { value: T | undefined } {
  const previous = ref<T>()
  watch(
    value,
    (_val, oldVal) => {
      previous.value = oldVal
    },
  )

  return previous
}

export default usePrevious
