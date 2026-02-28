import type { App } from 'vue'
import Dragger from './Dragger'
import InternalUpload, { LIST_IGNORE } from './Upload'

export type { DraggerProps } from './Dragger'
export type {
  UploadChangeParam,
  UploadEmits,
  UploadFile,
  UploadSlots,
} from './interface'
export type { InternalUploadProps as UploadProps } from './Upload'
export type { InternalUploadListProps as UploadListProps } from './UploadList'

const Upload = InternalUpload as typeof InternalUpload & {
  install: (app: App) => void
  Dragger: typeof Dragger
  LIST_IGNORE: string
}

Upload.Dragger = Dragger
Upload.LIST_IGNORE = LIST_IGNORE

Upload.install = (app: App) => {
  app.component(InternalUpload.name, Upload)
  app.component(Dragger.name, Dragger)
  return app
}

export const UploadDragger = Dragger

export default Upload
