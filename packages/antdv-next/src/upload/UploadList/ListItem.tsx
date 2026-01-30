import type { SlotsType } from 'vue'
import type { EmptyEmit } from '../../_util/type.ts'
import type {
  ItemRender,
  UploadFile,
  UploadListProgressProps,
  UploadListType,
  UploadLocale,
  UploadSemanticClassNames,
  UploadSemanticStyles,
} from '../interface'
import { DeleteOutlined, DownloadOutlined, EyeOutlined } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import { getTransitionProps } from '@v-c/util/dist/utils/transition'
import { computed, defineComponent, onBeforeUnmount, onMounted, shallowRef, Transition, watch } from 'vue'
import { getAttrStyleAndClass } from '../../_util/hooks'
import { useComponentBaseConfig } from '../../config-provider/context.ts'
import Progress from '../../progress'
import Tooltip from '../../tooltip'

export interface ListItemProps {
  prefixCls: string
  classes?: UploadSemanticClassNames
  styles?: UploadSemanticStyles
  locale: UploadLocale
  file: UploadFile
  items: UploadFile[]
  listType?: UploadListType
  isImgUrl?: (file: UploadFile) => boolean
  showRemoveIcon?: boolean | ((file: UploadFile) => boolean)
  showDownloadIcon?: boolean | ((file: UploadFile) => boolean)
  showPreviewIcon?: boolean | ((file: UploadFile) => boolean)
  removeIcon?: any | ((file: UploadFile) => any)
  downloadIcon?: any | ((file: UploadFile) => any)
  previewIcon?: any | ((file: UploadFile) => any)
  extra?: any | ((file: UploadFile) => any)
  iconRender: (file: UploadFile) => any
  actionIconRender: (
    customIcon: any,
    callback: () => void,
    prefixCls: string,
    title?: string,
    acceptUploadDisabled?: boolean,
  ) => any
  itemRender?: ItemRender
  onPreview: (file: UploadFile, e?: MouseEvent) => void
  onClose: (file: UploadFile) => void
  onDownload: (file: UploadFile) => void
  progress?: UploadListProgressProps
}

const ListItem = defineComponent<
  ListItemProps,
  EmptyEmit,
  string,
  SlotsType<Record<string, never>>
>(
  (props, { attrs }) => {
    const mergedStatus = shallowRef(props.file.status)
    watch(
      () => props.file.status,
      (status) => {
        if (status !== 'removed') {
          mergedStatus.value = status
        }
      },
    )

    const showProgress = shallowRef(false)
    let progressTimer: ReturnType<typeof setTimeout> | null = null

    onMounted(() => {
      progressTimer = setTimeout(() => {
        showProgress.value = true
      }, 300)
    })

    onBeforeUnmount(() => {
      if (progressTimer) {
        clearTimeout(progressTimer)
        progressTimer = null
      }
    })

    const { rootPrefixCls } = useComponentBaseConfig('upload')
    const listType = computed(() => props.listType ?? 'text')

    return () => {
      const {
        prefixCls,
        file,
        items,
        classes,
        styles,
        locale,
        isImgUrl,
        showPreviewIcon,
        showRemoveIcon,
        showDownloadIcon,
        previewIcon: customPreviewIcon,
        removeIcon: customRemoveIcon,
        downloadIcon: customDownloadIcon,
        extra: customExtra,
        iconRender,
        actionIconRender,
        itemRender,
        onPreview,
        onDownload,
        onClose,
        progress: progressProps,
      } = props

      const iconNode = iconRender(file)
      let icon = <div class={`${prefixCls}-icon`}>{iconNode}</div>

      if (listType.value.startsWith('picture')) {
        if (mergedStatus.value === 'uploading' || (!file.thumbUrl && !file.url)) {
          const uploadingClassName = clsx(`${prefixCls}-list-item-thumbnail`, {
            [`${prefixCls}-list-item-file`]: mergedStatus.value !== 'uploading',
          })
          icon = <div class={uploadingClassName}>{iconNode}</div>
        }
        else {
          const isImage = isImgUrl?.(file)
          const thumbnail = isImage
            ? (
                <img
                  src={file.thumbUrl || file.url}
                  alt={file.name}
                  class={`${prefixCls}-list-item-image`}
                  crossorigin={file.crossorigin}
                />
              )
            : iconNode
          const aClassName = clsx(`${prefixCls}-list-item-thumbnail`, {
            [`${prefixCls}-list-item-file`]: isImgUrl && !isImage,
          })
          icon = (
            <a
              class={aClassName}
              onClick={e => onPreview(file, e)}
              href={file.url || file.thumbUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {thumbnail}
            </a>
          )
        }
      }

      const listItemClassName = clsx(
        `${prefixCls}-list-item`,
        `${prefixCls}-list-item-${mergedStatus.value}`,
        classes?.item,
      )

      let linkProps = file.linkProps
      if (typeof linkProps === 'string') {
        try {
          linkProps = JSON.parse(linkProps)
        }
        catch {
          linkProps = {}
        }
      }

      const removeIcon
        = (typeof showRemoveIcon === 'function'
          ? showRemoveIcon(file)
          : showRemoveIcon)
          ? actionIconRender(
              (typeof customRemoveIcon === 'function' ? customRemoveIcon(file) : customRemoveIcon) || (
                <DeleteOutlined />
              ),
              () => onClose(file),
              prefixCls,
              locale.removeFile,
              true,
            )
          : null

      const downloadIcon
        = (typeof showDownloadIcon === 'function' ? showDownloadIcon(file) : showDownloadIcon)
          && mergedStatus.value === 'done'
          ? actionIconRender(
              (typeof customDownloadIcon === 'function'
                ? customDownloadIcon(file)
                : customDownloadIcon) || <DownloadOutlined />,
              () => onDownload(file),
              prefixCls,
              locale.downloadFile,
            )
          : null

      const downloadOrDelete = listType.value !== 'picture-card' && listType.value !== 'picture-circle' && (
        <span
          key="download-delete"
          class={clsx(`${prefixCls}-list-item-actions`, { picture: listType.value === 'picture' })}
        >
          {downloadIcon}
          {removeIcon}
        </span>
      )

      const extraContent = typeof customExtra === 'function' ? customExtra(file) : customExtra
      const extra = extraContent && (
        <span class={`${prefixCls}-list-item-extra`}>{extraContent}</span>
      )

      const listItemNameClass = clsx(`${prefixCls}-list-item-name`)
      const fileName = file.url
        ? (
            <a
              key="view"
              target="_blank"
              rel="noopener noreferrer"
              class={listItemNameClass}
              title={file.name}
              {...linkProps}
              href={file.url}
              onClick={e => onPreview(file, e)}
            >
              {file.name}
              {extra}
            </a>
          )
        : (
            <span
              key="view"
              class={listItemNameClass}
              onClick={e => onPreview(file, e)}
              title={file.name}
            >
              {file.name}
              {extra}
            </span>
          )

      const previewIcon
        = (typeof showPreviewIcon === 'function' ? showPreviewIcon(file) : showPreviewIcon)
          && (file.url || file.thumbUrl)
          ? (
              <a
                href={file.url || file.thumbUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => onPreview(file, e)}
                title={locale.previewFile}
              >
                {typeof customPreviewIcon === 'function'
                  ? customPreviewIcon(file)
                  : customPreviewIcon || <EyeOutlined />}
              </a>
            )
          : null

      const pictureCardActions = (listType.value === 'picture-card' || listType.value === 'picture-circle')
        && mergedStatus.value !== 'uploading' && (
        <span class={`${prefixCls}-list-item-actions`}>
          {previewIcon}
          {mergedStatus.value === 'done' && downloadIcon}
          {removeIcon}
        </span>
      )

      const dom = (
        <div class={listItemClassName} style={styles?.item}>
          {icon}
          {fileName}
          {downloadOrDelete}
          {pictureCardActions}
          {showProgress.value && (
            <Transition
              {...getTransitionProps(`${rootPrefixCls.value}-fade`)}
              appear
            >
              {mergedStatus.value === 'uploading'
                ? (
                    <div class={`${prefixCls}-list-item-progress`}>
                      {'percent' in file
                        ? (
                            <Progress
                              type="line"
                              percent={file.percent}
                              aria-label={file['aria-label']}
                              aria-labelledby={file['aria-labelledby']}
                              {...progressProps}
                            />
                          )
                        : null}
                    </div>
                  )
                : null}
            </Transition>
          )}
        </div>
      )

      const message = typeof file.response === 'string'
        ? file.response
        : file.error?.statusText || file.error?.message || locale.uploadError
      const item = mergedStatus.value === 'error'
        ? (
            <Tooltip title={message} getPopupContainer={node => node.parentNode as HTMLElement}>
              {dom}
            </Tooltip>
          )
        : dom

      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)

      return (
        <div
          {...restAttrs}
          class={clsx(`${prefixCls}-list-item-container`, className)}
          style={style}
        >
          {itemRender
            ? itemRender(item, file, items, {
                download: () => onDownload(file),
                preview: () => onPreview(file),
                remove: () => onClose(file),
              })
            : item}
        </div>
      )
    }
  },
  {
    name: 'UploadListItem',
    inheritAttrs: false,
  },
)

export default ListItem
