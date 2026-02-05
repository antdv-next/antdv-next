import type {
  AcceptConfig,
  VcFile as OriVcFile,
  UploadRequestOption as VcCustomRequestOptions,
} from '@v-c/upload'
import type { CSSProperties, ImgHTMLAttributes, VNodeChild } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { ProgressAriaProps, ProgressProps } from '../progress'

export type UploadFileStatus = 'error' | 'done' | 'uploading' | 'removed'
export interface HttpRequestHeader {
  [key: string]: string
}

export interface VcFile extends OriVcFile {
  readonly lastModifiedDate: Date
}

export interface UploadFile<T = any> extends ProgressAriaProps {
  uid: string
  size?: number
  name: string
  fileName?: string
  lastModified?: number
  lastModifiedDate?: Date
  url?: string
  status?: UploadFileStatus
  percent?: number
  thumbUrl?: string
  crossorigin?: ImgHTMLAttributes['crossorigin']
  originFileObj?: VcFile
  response?: T
  error?: any
  linkProps?: any
  type?: string
  xhr?: T
  preview?: string
}

export interface InternalUploadFile<T = any> extends UploadFile<T> {
  originFileObj: VcFile
}

export interface UploadChangeParam<T = UploadFile> {
  // https://github.com/ant-design/ant-design/issues/14420
  file: T
  fileList: T[]
  event?: { percent: number }
}

export interface ShowUploadListInterface<T = any> {
  extra?: VNodeChild | ((file: UploadFile<T>) => VNodeChild)
  showRemoveIcon?: boolean | ((file: UploadFile<T>) => boolean)
  showPreviewIcon?: boolean | ((file: UploadFile<T>) => boolean)
  showDownloadIcon?: boolean | ((file: UploadFile<T>) => boolean)
  removeIcon?: VNodeChild | ((file: UploadFile<T>) => VNodeChild)
  downloadIcon?: VNodeChild | ((file: UploadFile<T>) => VNodeChild)
  previewIcon?: VNodeChild | ((file: UploadFile<T>) => VNodeChild)
}

export interface UploadLocale {
  uploading?: string
  removeFile?: string
  downloadFile?: string
  uploadError?: string
  previewFile?: string
}

export type UploadType = 'drag' | 'select'
export type UploadListType = 'text' | 'picture' | 'picture-card' | 'picture-circle'
export type UploadListProgressProps = Omit<ProgressProps, 'percent' | 'type'>

export type ItemRender<T = any> = (
  originNode: VNodeChild,
  file: UploadFile<T>,
  fileList: Array<UploadFile<T>>,
  actions: {
    download: () => void
    preview: () => void
    remove: () => void
  },
) => VNodeChild

type PreviewFileHandler = (file: File | Blob) => PromiseLike<string>
type BeforeUploadValueType = void | boolean | string | Blob | File

export type UploadSemanticName = keyof UploadSemanticClassNames & keyof UploadSemanticStyles

export interface UploadSemanticClassNames {
  root?: string
  list?: string
  item?: string
}

export interface UploadSemanticStyles {
  root?: CSSProperties
  list?: CSSProperties
  item?: CSSProperties
}

export type UploadClassNamesType<T = any> = SemanticClassNamesType<
  UploadProps<T>,
  UploadSemanticClassNames
>

export type UploadStylesType<T = any> = SemanticStylesType<UploadProps<T>, UploadSemanticStyles>

export interface UploadProps<T = any> {
  type?: UploadType
  name?: string
  defaultFileList?: Array<UploadFile<T>>
  fileList?: Array<UploadFile<T>>
  action?: string | ((file: VcFile) => string) | ((file: VcFile) => PromiseLike<string>)
  directory?: boolean
  data?:
    | Record<string, unknown>
    | ((file: UploadFile<T>) => Record<string, unknown> | Promise<Record<string, unknown>>)
  method?: 'POST' | 'PUT' | 'PATCH' | 'post' | 'put' | 'patch'
  headers?: HttpRequestHeader
  showUploadList?: boolean | ShowUploadListInterface<T>
  multiple?: boolean
  accept?: string | AcceptConfig
  beforeUpload?: (
    file: VcFile,
    fileList: VcFile[],
  ) => BeforeUploadValueType | Promise<BeforeUploadValueType>
  listType?: UploadListType
  classes?: UploadClassNamesType
  styles?: UploadStylesType
  rootClass?: string
  supportServerRender?: boolean
  disabled?: boolean
  prefixCls?: string
  customRequest?: (
    options: VcCustomRequestOptions<T>,
    info: {
      /**
       * @since 5.28.0
       */
      defaultRequest: (option: VcCustomRequestOptions<T>) => void
    },
  ) => void
  withCredentials?: boolean
  openFileDialogOnClick?: boolean
  locale?: UploadLocale
  id?: string
  previewFile?: PreviewFileHandler
  iconRender?: (file: UploadFile<T>, listType?: UploadListType) => VNodeChild
  isImageUrl?: (file: UploadFile<T>) => boolean
  progress?: UploadListProgressProps
  itemRender?: ItemRender<T>
  /** Config max count of `fileList`. Will replace current one when `maxCount` is 1 */
  maxCount?: number
  onRemove?: (file: UploadFile<T>) => void | boolean | Promise<void | boolean>
  onPreview?: (file: UploadFile<T>) => void
  onDownload?: (file: UploadFile<T>) => void
  capture?: string | boolean
  hasControlInside?: boolean
  pastable?: boolean
}

// click: VcUploadProps['onClick']
// error: VcUploadProps['onError']
// start: VcUploadProps['onStart']
// batchStart: VcUploadProps['onBatchStart']
// success: VcUploadProps['onSuccess']
// progress: VcUploadProps['onProgress']
// mouseenter: VcUploadProps['onMouseEnter']
// mouseleave: VcUploadProps['onMouseLeave']
export interface UploadEmits<T = any> {
  'change': (info: UploadChangeParam<UploadFile<T>>) => void
  'drop': (event: DragEvent) => void
  // 'preview': (file: UploadFile<T>) => void
  // 'download': (file: UploadFile<T>) => void
  'update:fileList': (fileList: UploadFile<T>[]) => void
}

export interface UploadSlots<T = any> {
  default?: () => any
  iconRender?: (props: { file: UploadFile<T>, listType?: UploadListType }) => VNodeChild
  itemRender?: (props: {
    originNode: VNodeChild
    file: UploadFile<T>
    fileList: Array<UploadFile<T>>
    actions: {
      download: () => void
      preview: () => void
      remove: () => void
    }
  }) => VNodeChild
}

export interface UploadState<T = any> {
  fileList: UploadFile<T>[]
  dragState: string
}

export interface UploadListProps<T = any> {
  classes?: UploadClassNamesType
  styles?: UploadStylesType
  listType?: UploadListType
  items?: Array<UploadFile<T>>
  progress?: UploadListProgressProps
  prefixCls?: string
  showRemoveIcon?: boolean | ((file: UploadFile<T>) => boolean)
  showDownloadIcon?: boolean | ((file: UploadFile<T>) => boolean)
  showPreviewIcon?: boolean | ((file: UploadFile<T>) => boolean)
  removeIcon?: VNodeChild | ((file: UploadFile<T>) => VNodeChild)
  downloadIcon?: VNodeChild | ((file: UploadFile<T>) => VNodeChild)
  previewIcon?: VNodeChild | ((file: UploadFile<T>) => VNodeChild)
  extra?: VNodeChild | ((file: UploadFile<T>) => VNodeChild)
  locale: UploadLocale
  previewFile?: PreviewFileHandler
  iconRender?: (file: UploadFile<T>, listType?: UploadListType) => VNodeChild
  isImageUrl?: (file: UploadFile<T>) => boolean
  appendAction?: any
  appendActionVisible?: boolean
  itemRender?: ItemRender<T>
  /**
   * @internal Only the internal remove button is provided for use
   */
  disabled?: boolean
  onRemove?: (file: UploadFile<T>) => void | boolean
  onPreview?: (file: UploadFile<T>) => void
  onDownload?: (file: UploadFile<T>) => void
}

export interface UploadListEmits {
}

export interface UploadListSlots<T = any> {
  iconRender?: (props: { file: UploadFile<T>, listType?: UploadListType }) => VNodeChild
  itemRender?: (props: {
    originNode: VNodeChild
    file: UploadFile<T>
    fileList: Array<UploadFile<T>>
    actions: {
      download: () => void
      preview: () => void
      remove: () => void
    }
  }) => VNodeChild
  removeIcon?: (props: { file: UploadFile<T> }) => VNodeChild
  downloadIcon?: (props: { file: UploadFile<T> }) => VNodeChild
  previewIcon?: (props: { file: UploadFile<T> }) => VNodeChild
}
