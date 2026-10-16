import { ContextIsolator } from '../_util/ContextIsolator'

type RenderFunction = (...args: any[]) => any

function usePopupRender(renderFn?: RenderFunction) {
  if (!renderFn) {
    return undefined
  }
  return (...args: any[]) => (
    <ContextIsolator space form>
      {renderFn(...args)}
    </ContextIsolator>
  )
}

export default usePopupRender
