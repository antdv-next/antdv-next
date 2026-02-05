import type { SlotsType } from 'vue'
import type { UploadFile, UploadListEmits, UploadListProps, UploadListSlots, UploadLocale } from '../interface'
import { FileTwoTone, LoadingOutlined, PaperClipOutlined, PictureTwoTone } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import { getTransitionGroupProps } from '@v-c/util/dist/utils/transition'
import { cloneVNode, computed, defineComponent, getCurrentInstance, isVNode, onMounted, shallowRef, TransitionGroup, watch } from 'vue'
import { resolveStyleOrClass } from '../../_util/hooks'
import Button from '../../button'
import { isImageUrl, previewImage } from '../utils'
import ListItem from './ListItem'

const APPEND_ACTION_KEY = '__upload_append_action__'

const defaults = {
  listType: 'text',
  items: [],
  locale: {} as UploadLocale,
  showPreviewIcon: true,
  showRemoveIcon: true,
  showDownloadIcon: false,
  progress: { size: [-1, 2], showInfo: false },
  appendActionVisible: true,
} as any

const UploadList = defineComponent<
  UploadListProps,
  UploadListEmits,
  string,
  SlotsType<UploadListSlots>
>(
  (props = defaults, { slots }) => {
    const forceUpdate = shallowRef(0)
    const motionAppear = shallowRef(false)
    const instance = getCurrentInstance()
    const hasPreviewListener = computed(() => !!instance?.vnode.props?.onPreview)

    onMounted(() => {
      motionAppear.value = true
    })

    const listType = computed(() => props.listType ?? 'text')
    const isPictureCardOrCircle = computed(() => ['picture-card', 'picture-circle'].includes(listType.value))
    const isPictureType = computed(() => listType.value.startsWith('picture'))

    const prefixCls = computed(() => props.prefixCls ?? 'ant-upload')
    const mergedPreviewFile = computed(() => props.previewFile ?? previewImage)
    const mergedIsImageUrl = computed(() => props.isImageUrl ?? isImageUrl)

    const resolvedClasses = computed(() => {
      if (!props.classes) {
        return {}
      }
      return resolveStyleOrClass(props.classes, { props })
    })

    const resolvedStyles = computed(() => {
      if (!props.styles) {
        return {}
      }
      return resolveStyleOrClass(props.styles, { props })
    })

    watch(
      [isPictureType, () => props.items, mergedPreviewFile],
      () => {
        if (!isPictureType.value) {
          return
        }
        ;(props.items || []).forEach((file) => {
          if (
            !(file.originFileObj instanceof File || (file.originFileObj as any) instanceof Blob)
            || file.thumbUrl !== undefined
          ) {
            return
          }
          file.thumbUrl = ''
          mergedPreviewFile.value?.(file.originFileObj as File).then((previewDataUrl: string) => {
            file.thumbUrl = previewDataUrl || ''
            forceUpdate.value += 1
          })
        })
      },
      { immediate: true },
    )

    const onInternalPreview = (file: UploadFile, e?: MouseEvent) => {
      if (!hasPreviewListener.value) {
        return
      }
      e?.preventDefault?.()
      props?.onPreview?.(file)
    }

    const onInternalDownload = (file: UploadFile) => {
      props?.onDownload?.(file)
    }

    const onInternalClose = (file: UploadFile) => {
      props.onRemove?.(file)
    }

    const internalIconRender = (file: UploadFile) => {
      if (slots.iconRender) {
        return slots.iconRender({ file, listType: listType.value })
      }
      if (props.iconRender) {
        return props.iconRender(file, listType.value)
      }

      const isLoading = file.status === 'uploading'
      if (listType.value.startsWith('picture')) {
        const loadingIcon = listType.value === 'picture' ? <LoadingOutlined /> : props.locale?.uploading
        const fileIcon = mergedIsImageUrl.value?.(file) ? <PictureTwoTone /> : <FileTwoTone />
        return isLoading ? loadingIcon : fileIcon
      }
      return isLoading ? <LoadingOutlined /> : <PaperClipOutlined />
    }

    const actionIconRender = (
      customIcon: any,
      callback: () => void,
      actionPrefixCls: string,
      title?: string,
      acceptUploadDisabled?: boolean,
    ) => {
      const mergedDisabled = acceptUploadDisabled ? props.disabled : false
      const handleClick = (e: MouseEvent) => {
        callback()
        if (customIcon?.props?.onClick) {
          customIcon.props.onClick(e)
        }
      }

      if (isVNode(customIcon)) {
        return (
          <Button
            type="text"
            size="small"
            {
              ...{
                title,
              }
            }
            class={`${actionPrefixCls}-list-item-action`}
            disabled={mergedDisabled}
            onClick={handleClick}
            icon={cloneVNode(customIcon, { onClick: undefined })}
          />
        )
      }

      return (
        <Button
          type="text"
          size="small"
          {
            ...{
              title,
            }
          }
          class={`${actionPrefixCls}-list-item-action`}
          disabled={mergedDisabled}
          onClick={handleClick}
        >
          <span>{customIcon}</span>
        </Button>
      )
    }

    return () => {
      const items = props.items ?? []
      const listClassNames = clsx(
        `${prefixCls.value}-list`,
        `${prefixCls.value}-list-${listType.value}`,
        resolvedClasses.value?.list,
      )

      const transitionGroupProps = {
        ...getTransitionGroupProps(`${prefixCls.value}-${isPictureCardOrCircle.value ? 'animate-inline' : 'animate'}`),
        appear: motionAppear.value,
      }

      let appendAction = null
      if (props.appendAction && props.appendActionVisible) {
        appendAction = isVNode(props.appendAction)
          ? cloneVNode(props.appendAction, { key: APPEND_ACTION_KEY })
          : props.appendAction
      }

      const itemRender = slots.itemRender
        ? (originNode: any, file: UploadFile, fileList: UploadFile[], actions: any) =>
            slots.itemRender?.({ originNode, file, fileList, actions })
        : props.itemRender
      const removeIcon = slots.removeIcon
        ? (file: UploadFile) => slots.removeIcon?.({ file })
        : props.removeIcon
      const downloadIcon = slots.downloadIcon
        ? (file: UploadFile) => slots.downloadIcon?.({ file })
        : props.downloadIcon
      const previewIcon = slots.previewIcon
        ? (file: UploadFile) => slots.previewIcon?.({ file })
        : props.previewIcon

      return (
        <TransitionGroup
          {...transitionGroupProps}
          tag="div"
          {
            ...{
              class: listClassNames,
              style: resolvedStyles.value?.list,
            }
          }
        >
          {items.map(file => (
            <ListItem
              key={file.uid}
              locale={props.locale}
              prefixCls={prefixCls.value}
              classes={resolvedClasses.value}
              styles={resolvedStyles.value}
              file={file}
              items={items}
              progress={props.progress}
              listType={listType.value}
              isImgUrl={mergedIsImageUrl.value}
              showPreviewIcon={props.showPreviewIcon}
              showRemoveIcon={props.showRemoveIcon}
              showDownloadIcon={props.showDownloadIcon}
              removeIcon={removeIcon}
              previewIcon={previewIcon}
              downloadIcon={downloadIcon}
              extra={props.extra}
              iconRender={internalIconRender}
              actionIconRender={actionIconRender}
              itemRender={itemRender}
              onPreview={onInternalPreview}
              onDownload={onInternalDownload}
              onClose={onInternalClose}
            />
          ))}
          {appendAction}
        </TransitionGroup>
      )
    }
  },
  {
    name: 'UploadList',
  },
)

export default UploadList
