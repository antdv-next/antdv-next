import type { VNode } from 'vue'
import type { ModalFuncProps } from './interface'
import { createVNode, defineComponent, render, watch } from 'vue'
import { getVueInstance } from '../_util/instance'
import { devUseWarning, isDev } from '../_util/warning'
import { globalConfig } from '../config-provider'
import ConfirmDialog from './ConfirmDialog'
import destroyFns from './destroyFns'

let defaultRootPrefixCls = ''

function getRootPrefixCls() {
  return defaultRootPrefixCls
}

export type ConfigUpdate = ModalFuncProps | ((prevConfig: ModalFuncProps) => ModalFuncProps)

export type ModalFunc = (props: ModalFuncProps) => {
  destroy: () => void
  update: (configUpdate: ConfigUpdate) => void
}

export type ModalStaticFunctions = Record<NonNullable<ModalFuncProps['type']>, ModalFunc>

const ConfirmDialogWrapper = defineComponent<ModalFuncProps>(
  (props) => {
    return () => <ConfirmDialog {...props as any} />
  },
)

export default function confirm(config: ModalFuncProps) {
  const global = globalConfig()

  const warning = devUseWarning('Modal')
  if (isDev && config.getContainer === false) {
    warning(false, 'usage', 'Static method not support `getContainer` to be `false` since it do not have context env.')
  }

  const container = document.createElement('div')
  document.body.appendChild(container)
  let currentConfig = { ...config, close, open: true } as ModalFuncProps & { close: any }

  function destroy(...args: any[]) {
    const triggerCancel = args.some(param => param?.triggerCancel)
    if (triggerCancel) {
      config.onCancel?.(() => {}, ...args.slice(1))
    }
    const index = destroyFns.indexOf(close)
    if (index !== -1) {
      destroyFns.splice(index, 1)
    }
    render(null, container)
    container.parentNode?.removeChild(container)
  }

  function renderWithProps(props: ModalFuncProps) {
    const rootPrefixCls = global.getPrefixCls(undefined, getRootPrefixCls())
    const iconPrefixCls = global.getIconPrefixCls?.()
    const theme = global.theme.value
    const appContext = props?.appContext ?? getVueInstance() ?? null
    const prefixCls = props.prefixCls ?? `${rootPrefixCls}-modal`
    const vnode: VNode = createVNode(ConfirmDialogWrapper, {
      ...props,
      prefixCls,
      rootPrefixCls,
      iconPrefixCls,
      theme,
    })
    vnode.appContext = appContext
    watch(
      () => global.theme.value,
      () => {
        vnode.component?.update?.()
      },
    )
    render(vnode, container)
  }

  function close(...args: any[]) {
    currentConfig = {
      ...currentConfig,
      open: false,
      afterClose: () => {
        config.afterClose?.()
        destroy(...args)
      },
    }
    renderWithProps(currentConfig)
  }

  function update(configUpdate: ConfigUpdate) {
    currentConfig = typeof configUpdate === 'function'
      ? configUpdate(currentConfig)
      : { ...currentConfig, ...configUpdate } as any
    renderWithProps(currentConfig)
  }

  renderWithProps(currentConfig)
  destroyFns.push(close)

  return {
    destroy: close,
    update,
  }
}

export function withWarn(props: ModalFuncProps): ModalFuncProps {
  return {
    ...props,
    type: 'warning',
  }
}

export function withInfo(props: ModalFuncProps): ModalFuncProps {
  return {
    ...props,
    type: 'info',
  }
}

export function withSuccess(props: ModalFuncProps): ModalFuncProps {
  return {
    ...props,
    type: 'success',
  }
}

export function withError(props: ModalFuncProps): ModalFuncProps {
  return {
    ...props,
    type: 'error',
  }
}

export function withConfirm(props: ModalFuncProps): ModalFuncProps {
  return {
    ...props,
    type: 'confirm',
  }
}

export function modalGlobalConfig({ rootPrefixCls }: { rootPrefixCls: string }) {
  defaultRootPrefixCls = rootPrefixCls
}
