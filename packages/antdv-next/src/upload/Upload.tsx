import type { UploadProps as VcUploadProps } from '@v-c/upload'
import type { SlotsType } from 'vue'
import type {
  ShowUploadListInterface,
  UploadChangeParam,
  UploadClassNamesType,
  UploadEmits,
  UploadFile,
  UploadProps,
  UploadSlots,
  UploadStylesType,
  VcFile,
} from './interface'
import VcUpload from '@v-c/upload'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, nextTick, shallowRef, watch } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { toPropsRefs } from '../_util/tools'
import { devUseWarning, isDev } from '../_util/warning'
import { useComponentBaseConfig } from '../config-provider/context'
import { useDisabledContext } from '../config-provider/DisabledContext'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import useLocale from '../locale/useLocale'
import useStyle from './style'
import UploadList from './UploadList'
import { file2Obj, getFileItem, removeFileItem, updateFileList } from './utils'

export const LIST_IGNORE = `__LIST_IGNORE_${Date.now()}__`
export interface UploadRef<T = any> {
  onBatchStart: VcUploadProps['onBatchStart']
  onSuccess: (response: any, file: VcFile, xhr: any) => void
  onProgress: (e: { percent: number }, file: VcFile) => void
  onError: (error: Error, response: any, file: VcFile) => void
  fileList: UploadFile<T>[]
  upload: any | null
  /**
   * Get native element for wrapping upload
   * @since 5.17.0
   */
  nativeElement: HTMLSpanElement | null
}

const defaults = {
  showUploadList: true,
  listType: 'text',
  type: 'select',
  data: {},
  multiple: false,
  accept: '',
  hasControlInside: true,
  action: '',
  supportServerRender: true,
} as any

const InternalUpload = defineComponent<
  UploadProps,
  UploadEmits,
  string,
  SlotsType<UploadSlots>
>(
  (props = defaults, { slots, attrs, expose, emit }) => {
    const {
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      customRequest: contextCustomRequest,
    } = useComponentBaseConfig('upload', props, ['customRequest'])

    const {
      disabled: customDisabled,
      classes,
      styles,
      rootClass,
    } = toPropsRefs(props, 'disabled', 'classes', 'styles', 'rootClass')

    // ===================== Disabled =====================
    const disabled = useDisabledContext()
    const mergedDisabled = computed(() => customDisabled.value ?? disabled.value)
    const customRequest = computed(() => props?.customRequest ?? contextCustomRequest.value)

    const internalFileList = shallowRef(props?.fileList ?? props?.defaultFileList ?? [])
    watch(
      () => props.fileList,
      () => {
        if (props.fileList !== undefined) {
          internalFileList.value = props?.fileList ?? []
        }
      },
    )
    const mergedFileList = computed(() => props?.fileList ?? internalFileList.value ?? [])

    const dragState = shallowRef('drop')
    const upload = shallowRef<any>()
    const wrapRef = shallowRef<HTMLSpanElement | null>(null)

    if (isDev) {
      const warning = devUseWarning('Upload')

      warning(
        (props.fileList !== undefined) || !('value' in attrs),
        'usage',
        '`value` is not a valid prop, do you mean `fileList`?',
      )
    }

    // Control mode will auto fill file uid if not provided
    watch(
      () => props?.fileList,
      () => {
        const timestamp = Date.now()
        ;(props?.fileList || []).forEach((file, index) => {
          if (!file.uid && !Object.isFrozen(file)) {
            file.uid = `__AUTO__${timestamp}_${index}__`
          }
        })
      },
      {
        immediate: true,
      },
    )

    const onInternalChange = (file: UploadFile, changedFileList: UploadFile[], event?: { percent: number }) => {
      const { maxCount } = props
      let cloneList = [...changedFileList]

      let exceedMaxCount = false
      if (maxCount === 1) {
        cloneList = cloneList.slice(-1)
      }
      else if (maxCount) {
        exceedMaxCount = cloneList.length > maxCount
        cloneList = cloneList.slice(0, maxCount)
      }

      if (props.fileList === undefined) {
        internalFileList.value = cloneList
      }

      nextTick(() => {
        emit('update:fileList', cloneList)
      })

      const changeInfo: UploadChangeParam<UploadFile> = {
        file: file as UploadFile,
        fileList: cloneList,
      }
      if (event) {
        changeInfo.event = event
      }
      if (
        !exceedMaxCount
        || file.status === 'removed'
        // We should ignore event if current file is exceed `maxCount`
        || cloneList.some(f => f.uid === file.uid)
      ) {
        nextTick(() => {
          emit('change', changeInfo)
        })
      }
    }

    const mergedBeforeUpload = async (file: VcFile, fileListArgs: VcFile[]) => {
      const { beforeUpload } = props
      let parsedFile: File | Blob | string = file
      if (beforeUpload) {
        const result = await beforeUpload(file, fileListArgs)

        if (result === false) {
          return false
        }

        // Hack for LIST_IGNORE, we add additional info to remove from the list
        delete (file as any)[LIST_IGNORE]
        if ((result as any) === LIST_IGNORE) {
          Object.defineProperty(file, LIST_IGNORE, {
            value: true,
            configurable: true,
          })
          return false
        }

        if (typeof result === 'object' && result) {
          parsedFile = result as File
        }
      }

      return parsedFile as VcFile
    }

    const onBatchStart: VcUploadProps['onBatchStart'] = (batchFileInfoList) => {
      // Skip file which marked as `LIST_IGNORE`, these file will not add to file list
      const filteredFileInfoList = batchFileInfoList.filter(
        info => !(info.file as any)[LIST_IGNORE],
      )

      // Nothing to do since no file need upload
      if (!filteredFileInfoList.length) {
        return
      }

      const objectFileList = filteredFileInfoList.map(info => file2Obj(info.file as VcFile))

      // Concat new files with prev files
      let newFileList = [...mergedFileList.value]

      objectFileList.forEach((fileObj) => {
        // Replace file if exist
        newFileList = updateFileList(fileObj, newFileList)
      })

      objectFileList.forEach((fileObj, index) => {
        // Repeat trigger `change` event for compatible
        let triggerFileObj: UploadFile = fileObj

        if (!filteredFileInfoList?.[index!]?.parsedFile) {
          // `beforeUpload` return false
          const { originFileObj } = fileObj
          let clone: UploadFile

          try {
            clone = new File([originFileObj], originFileObj.name, {
              type: originFileObj.type,
            }) as any as UploadFile
          }
          catch {
            clone = new Blob([originFileObj], {
              type: originFileObj.type,
            }) as any as UploadFile
            clone.name = originFileObj.name
            clone.lastModifiedDate = new Date()
            clone.lastModified = new Date().getTime()
          }

          clone.uid = fileObj.uid
          triggerFileObj = clone
        }
        else {
          // Inject `uploading` status
          fileObj.status = 'uploading'
        }

        onInternalChange(triggerFileObj, newFileList)
      })
    }

    const onSuccess = (response: any, file: VcFile, xhr: any) => {
      let parsedResponse = response
      try {
        if (typeof response === 'string') {
          parsedResponse = JSON.parse(response)
        }
      }
      catch {
        parsedResponse = response
      }

      // removed
      if (!getFileItem(file, mergedFileList.value)) {
        return
      }

      const targetItem = file2Obj(file)
      targetItem.status = 'done'
      targetItem.percent = 100
      targetItem.response = parsedResponse
      targetItem.xhr = xhr

      const nextFileList = updateFileList(targetItem, mergedFileList.value)

      onInternalChange(targetItem, nextFileList)
    }

    const onProgress = (e: { percent: number }, file: VcFile) => {
      // removed
      if (!getFileItem(file, mergedFileList.value)) {
        return
      }

      const targetItem = file2Obj(file)
      targetItem.status = 'uploading'
      targetItem.percent = e.percent

      const nextFileList = updateFileList(targetItem, mergedFileList.value)

      onInternalChange(targetItem, nextFileList, e)
    }

    const onError = (error: Error, response: any, file: VcFile) => {
      // removed
      if (!getFileItem(file, mergedFileList.value)) {
        return
      }

      const targetItem = file2Obj(file)
      targetItem.error = error
      targetItem.response = response
      targetItem.status = 'error'

      const nextFileList = updateFileList(targetItem, mergedFileList.value)

      onInternalChange(targetItem, nextFileList)
    }

    const handleRemove = (file: UploadFile) => {
      let currentFile: UploadFile
      Promise.resolve(typeof props.onRemove === 'function' ? props.onRemove(file) : props.onRemove).then((ret) => {
        // Prevent removing file
        if (ret === false) {
          return
        }

        const removedFileList = removeFileItem(file, mergedFileList.value)

        if (removedFileList) {
          currentFile = { ...file, status: 'removed' }
          mergedFileList.value?.forEach((item) => {
            const matchKey = currentFile.uid !== undefined ? 'uid' : 'name'
            if (item[matchKey] === currentFile[matchKey] && !Object.isFrozen(item)) {
              item.status = 'removed'
            }
          })
          upload.value?.abort?.(currentFile as VcFile)

          onInternalChange(currentFile, removedFileList)
        }
      })
    }

    const onFileDrop = (e: DragEvent) => {
      dragState.value = e.type

      if (e.type === 'drop') {
        emit('drop', e)
      }
    }

    // Test needs
    expose({
      onBatchStart,
      onSuccess,
      onProgress,
      onError,
      fileList: computed(() => mergedFileList.value),
      upload: computed(() => upload.value ?? null),
      nativeElement: computed(() => wrapRef.value ?? null),
    })

    const listType = computed(() => props.listType ?? 'text')
    const showUploadList = computed(() => props.showUploadList ?? true)
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => {
      return {
        ...props,
        listType: listType.value,
        showUploadList: showUploadList.value,
        type: props.type ?? 'select',
        multiple: props.multiple ?? false,
        hasControlInside: props.hasControlInside ?? true,
        supportServerRender: props.supportServerRender ?? true,
        disabled: mergedDisabled.value,
      }
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      UploadClassNamesType,
      UploadStylesType,
      UploadProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    const [contextLocale] = useLocale('Upload')
    const mergedLocale = computed(() => ({
      ...contextLocale?.value,
      ...(props.locale ?? {}),
    }))

    const renderUploadList = (button?: any, buttonVisible?: boolean) => {
      if (!showUploadList.value) {
        return button ?? null
      }

      const {
        showRemoveIcon,
        showPreviewIcon,
        showDownloadIcon,
        removeIcon,
        previewIcon,
        downloadIcon,
        extra,
      } = (typeof showUploadList.value === 'boolean' ? {} : showUploadList.value) as ShowUploadListInterface

      const realShowRemoveIcon = typeof showRemoveIcon === 'undefined' ? !mergedDisabled.value : showRemoveIcon

      const iconRender = slots.iconRender
        ? (file: UploadFile, currentListType?: any) => slots.iconRender?.({ file, listType: currentListType })
        : props.iconRender

      const itemRender = slots.itemRender
        ? (originNode: any, file: UploadFile, fileList: UploadFile[], actions: any) =>
            slots.itemRender?.({ originNode, file, fileList, actions })
        : props.itemRender

      return (
        <UploadList
          classes={mergedClassNames.value}
          styles={mergedStyles.value}
          prefixCls={prefixCls.value}
          listType={listType.value}
          items={mergedFileList.value}
          previewFile={props.previewFile}
          onPreview={(file: UploadFile) => {
            if (props?.onPreview) {
              // emit('preview', file)
              props?.onPreview?.(file)
            }
          }}
          onDownload={(file: UploadFile) => {
            if (props.onDownload) {
              props?.onDownload?.(file)
            }
            else if (file.url) {
              window.open(file.url)
            }
          }}
          onRemove={handleRemove}
          showRemoveIcon={realShowRemoveIcon}
          showPreviewIcon={showPreviewIcon}
          showDownloadIcon={showDownloadIcon}
          removeIcon={removeIcon}
          previewIcon={previewIcon}
          downloadIcon={downloadIcon}
          iconRender={iconRender}
          extra={extra}
          locale={mergedLocale.value}
          isImageUrl={props.isImageUrl}
          progress={props.progress}
          appendAction={button}
          appendActionVisible={buttonVisible}
          itemRender={itemRender}
          disabled={mergedDisabled.value}
        />
      )
    }

    return () => {
      const {
        type,
        multiple,
        action,
        accept,
        supportServerRender,
        hasControlInside,
        openFileDialogOnClick,
        withCredentials,
        id,
        name,
      } = props

      const children = filterEmpty(slots.default?.() ?? [])
      const hasChildren = children.length > 0

      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const mergedStyle = { ...contextStyle.value, ...style }

      const rcUploadProps: any = {
        onBatchStart,
        onError,
        onProgress,
        onSuccess,
        ...omit(props, ['classes', 'styles', 'rootClass', 'locale', 'maxCount', 'beforeUpload', 'onRemove', 'onPreview', 'onDownload']),
        customRequest: customRequest.value,
        data: props.data ?? {},
        multiple: multiple ?? false,
        action: action ?? '',
        accept: accept ?? '',
        supportServerRender: supportServerRender ?? true,
        prefixCls: prefixCls.value,
        disabled: mergedDisabled.value,
        beforeUpload: mergedBeforeUpload,
        onChange: undefined,
        hasControlInside: hasControlInside ?? true,
        openFileDialogOnClick,
        withCredentials,
        id,
        name,
      }

      delete rcUploadProps.class
      delete rcUploadProps.className
      delete rcUploadProps.style

      // Remove id to avoid open by label when trigger is hidden
      // !children: https://github.com/ant-design/ant-design/issues/14298
      // disabled: https://github.com/ant-design/ant-design/issues/16478
      //           https://github.com/ant-design/ant-design/issues/24197
      if (!hasChildren || mergedDisabled.value) {
        delete rcUploadProps.id
      }

      const wrapperCls = `${prefixCls.value}-wrapper`
      const mergedRootCls = clsx(
        wrapperCls,
        contextClassName.value,
        mergedClassNames.value.root,
        rootClass.value,
        cssVarCls.value,
        rootCls.value,
        hashId.value,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-picture-card-wrapper`]: listType.value === 'picture-card',
          [`${prefixCls.value}-picture-circle-wrapper`]: listType.value === 'picture-circle',
        },
        className,
      )
      const mergedRootStyle = { ...mergedStyles.value.root }

      if (type === 'drag') {
        const dragCls = clsx(
          hashId.value,
          prefixCls.value,
          `${prefixCls.value}-drag`,
          {
            [`${prefixCls.value}-drag-uploading`]: mergedFileList.value.some(file => file.status === 'uploading'),
            [`${prefixCls.value}-drag-hover`]: dragState.value === 'dragover',
            [`${prefixCls.value}-disabled`]: mergedDisabled.value,
            [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          },
          mergedClassNames.value.trigger,
        )

        return (
          <span {...restAttrs} class={mergedRootCls} ref={wrapRef} style={mergedRootStyle}>
            <div
              class={dragCls}
              style={[mergedStyle, mergedStyles.value.trigger]}
              onDrop={onFileDrop}
              onDragover={onFileDrop}
              onDragleave={onFileDrop}
            >
              <VcUpload {...rcUploadProps} ref={upload} className={`${prefixCls.value}-btn`}>
                <div class={`${prefixCls.value}-drag-container`}>{children}</div>
              </VcUpload>
            </div>
            {renderUploadList()}
          </span>
        )
      }

      const uploadBtnCls = clsx(
        prefixCls.value,
        `${prefixCls.value}-select`,
        {
          [`${prefixCls.value}-disabled`]: mergedDisabled.value,
          [`${prefixCls.value}-hidden`]: !hasChildren,
        },
        mergedClassNames.value.trigger,
      )

      const uploadButton = (
        <div class={uploadBtnCls} style={[mergedStyle, mergedStyles.value.trigger]}>
          <VcUpload {...rcUploadProps} ref={upload}>
            {children}
          </VcUpload>
        </div>
      )

      if (listType.value === 'picture-card' || listType.value === 'picture-circle') {
        return (
          <span {...restAttrs} class={mergedRootCls} ref={wrapRef} style={mergedRootStyle}>
            {renderUploadList(uploadButton, hasChildren)}
          </span>
        )
      }

      return (
        <span {...restAttrs} class={mergedRootCls} ref={wrapRef} style={mergedRootStyle}>
          {uploadButton}
          {renderUploadList()}
        </span>
      )
    }
  },
  {
    name: 'AUpload',
    inheritAttrs: false,
  },
)

export default InternalUpload
