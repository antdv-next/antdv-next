import type { App } from 'vue'
import type { ModalEmits, ModalProps, ModalSlots } from './interface'
import type useModal from './useModal'
import confirm, { modalGlobalConfig, withError, withInfo, withSuccess, withWarn } from './confirm'
import destroyFns from './destroyFns'
import ModalComponent from './Modal'
import useModalHook from './useModal/index'

interface StaticModal {
  useModal: typeof useModal
  confirm: typeof confirm
  info: typeof confirm
  success: typeof confirm
  error: typeof confirm
  warning: typeof confirm
  warn: typeof confirm
  destroyAll: () => void
  config: typeof modalGlobalConfig
}

const Modal = ModalComponent as typeof ModalComponent & StaticModal

Modal.useModal = useModalHook
Modal.confirm = confirm
Modal.info = config => confirm(withInfo(config))
Modal.success = config => confirm(withSuccess(config))
Modal.error = config => confirm(withError(config))
Modal.warning = config => confirm(withWarn(config))
Modal.warn = Modal.warning
Modal.destroyAll = () => {
  // Close and clean up all confirm modals
  while (destroyFns.length) {
    destroyFns.pop()?.()
  }
}
Modal.config = modalGlobalConfig

;(Modal as any).install = (app: App) => {
  app.component(Modal.name, Modal)
}

export type { ModalEmits, ModalProps, ModalSlots }
export { useModalHook as useModal }

export default Modal as typeof ModalComponent & StaticModal
