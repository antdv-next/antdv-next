---
category: Components
group: Data Entry
title: Upload
description: Used to select and upload files or drag and drop files.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*93ymR4RD4S0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*l1nlSryXib8AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

Uploading is the process of publishing information (web pages, text, pictures, video, etc.) to a remote server via a web page or upload tool.

- When you need to upload one or more files.
- When you need to show the process of uploading.
- When you need to upload files by dragging and dropping.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Upload by clicking</demo>
  <demo src="./demo/avatar.vue">Avatar</demo>
  <demo src="./demo/defaultFileList.vue">Default Files</demo>
  <demo src="./demo/picture-card.vue">Pictures Wall</demo>
  <demo src="./demo/picture-circle.vue">Pictures with picture-circle type</demo>
  <demo src="./demo/fileList.vue">Complete control over file list</demo>
  <demo src="./demo/drag.vue">Drag and Drop</demo>
  <demo src="./demo/paste.vue">Paste</demo>
  <demo src="./demo/directory.vue">Upload directory</demo>
  <demo src="./demo/upload-manually.vue">Upload manually</demo>
  <demo src="./demo/upload-png-only.vue">Upload png file only</demo>
  <demo src="./demo/picture-style.vue">Pictures with list style</demo>
  <demo src="./demo/preview-file.vue">Customize preview file</demo>
  <demo src="./demo/max-count.vue">Max Count</demo>
  <demo src="./demo/transform-file.vue">Transform file before request</demo>
  <demo src="./demo/upload-with-aliyun-oss.vue">Aliyun OSS</demo>
  <demo src="./demo/file-type.vue" debug>Custom show icon</demo>
  <demo src="./demo/upload-custom-action-icon.vue">Custom action icon and extra info</demo>
  <demo src="./demo/drag-sorting.vue">Drag sorting of uploadList</demo>
  <demo src="./demo/crop-image.vue">Crop image before uploading</demo>
  <demo src="./demo/customize-progress-bar.vue">Customize Progress Bar</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
  <demo src="./demo/component-token.vue" debug>Component Token</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| accept | File types that can be accepted. See [input accept Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept) | string \| [AcceptObject](#acceptobject) | - | - |
| action | Uploading URL | string \| (file) => Promise&lt;string> | - | - |
| beforeUpload | Hook function which will be executed before uploading. Uploading will be stopped with `false` or a rejected Promise returned. When returned value is `Upload.LIST_IGNORE`, the list of files that have been uploaded will ignore it. **Warning：this function is not supported in IE9** | (file: [VcFile](#vcfile), fileList: [VcFile[]](#vcfile)) => boolean \| Promise&lt;File> \| `Upload.LIST_IGNORE` | - | - |
| customRequest | Override for the default xhr behavior allowing for additional customization and the ability to implement your own XMLHttpRequest | ( options: [RequestOptions](#request-options), info: { defaultRequest: (option: [RequestOptions](#request-options)) => void; } ) => void | - | defaultRequest: - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - | - |
| data | Uploading extra params or function which can return uploading extra params | object \| (file) => object \| Promise&lt;object> | - | - |
| directory | Support upload whole directory ([caniuse](https://caniuse.com/#feat=input-file-directory)) | boolean | false | - |
| disabled | Disable upload button | boolean | false | When customizing Upload children, please pass the disabled attribute to the child node at the same time to ensure the disabled rendering effect is consistent. |
| fileList | List of files that have been uploaded (controlled). Here is a common issue [#2423](https://github.com/ant-design/ant-design/issues/2423) when using it, support `v-model:file-list` | [UploadFile](#uploadfile)\[] | - | - |
| headers | Set request headers, valid above IE10 | object | - | - |
| iconRender | Custom show icon | (file: UploadFile, listType?: UploadListType) => VueNode | - | - |
| isImageUrl | Customize if render &lt;img /> in thumbnail | (file: UploadFile) => boolean | [(inside implementation)](https://github.com/ant-design/ant-design/blob/4ad5830eecfb87471cd8ac588c5d992862b70770/components/upload/utils.tsx#L47-L68) | - |
| itemRender | Custom item of uploadList | (originNode: VueNode, file: UploadFile, fileList: object\[], actions: { download: function, preview: function, remove: function }) => VueNode | - | - |
| listType | Built-in stylesheets, support for four types: `text`, `picture`, `picture-card` or `picture-circle` | string | `text` | - |
| maxCount | Limit the number of uploaded files. Will replace current one when `maxCount` is `1` | number | - | - |
| method | The http method of upload request | string | `post` | - |
| multiple | Whether to support selected multiple files. `IE10+` supported. You can select multiple files with CTRL holding down while multiple is set to be true | boolean | false | - |
| name | The name of uploading file | string | `file` | - |
| openFileDialogOnClick | Click open file dialog | boolean | true | - |
| pastable | Support paste file | boolean | false | - |
| previewFile | Customize preview file logic | (file: File \| Blob) => Promise&lt;dataURL: string> | - | - |
| progress | Custom progress bar | [ProgressProps](/components/progress#api) (support `type="line"` only) | { strokeWidth: 2, showInfo: false } | - |
| showUploadList | Whether to show default upload list, could be an object to specify `extra`, `showPreviewIcon`, `showRemoveIcon`, `showDownloadIcon`, `removeIcon` and `downloadIcon` individually | boolean \| { extra?: VueNode \| (file: UploadFile) => VueNode, showPreviewIcon?: boolean \| (file: UploadFile) => boolean, showDownloadIcon?: boolean \| (file: UploadFile) => boolean, showRemoveIcon?: boolean \| (file: UploadFile) => boolean, previewIcon?: VueNode \| (file: UploadFile) => VueNode, removeIcon?: VueNode \| (file: UploadFile) => VueNode, downloadIcon?: VueNode \| (file: UploadFile) => VueNode } | true | `extra`: -, `showPreviewIcon` function: -, `showRemoveIcon` function: -, `showDownloadIcon` function: - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | - |
| withCredentials | The ajax upload with cookie sent | boolean | false | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | A callback function, can be executed when uploading state is changing. It will trigger by every uploading phase. see [onChange](#onchange) | function | - |
| drop | A callback function executed when files are dragged and dropped into the upload area | (event: DragEvent) => void | - |
| download | Click the method to download the file, pass the method to perform the method logic, and do not pass the default jump to the new TAB | function(file): void | (Jump to new TAB) |
| preview | A callback function, will be executed when the file link or preview icon is clicked | function(file) | - |
| remove | A callback function, will be executed when removing file button is clicked, remove event will be prevented when the return value is false or a Promise which resolve(false) or reject | function(file): boolean \| Promise | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| itemRender | Custom item of uploadList | ( ctx:{ originNode: VNode, file: UploadFile, fileList: object\[], actions: { download: function, preview: function, remove: function }}) => VueNode | - |
| iconRender | Custom show icon | (ctx:{ file: UploadFile, listType?: UploadListType}) => VueNode | - |

## Types

### VcFile {#vcfile}

Extends [File](https://developer.mozilla.org/en-US/docs/Web/API/File).

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| uid | unique id. Will auto-generate when not provided | string | - | - |
| lastModifiedDate | A Date object indicating the date and time at which the file was last modified | date | - | - |

### UploadFile {#uploadfile}

Extends [File](https://developer.mozilla.org/en-US/docs/Web/API/File) with additional props.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| crossOrigin | CORS settings attributes | `'anonymous'` \| `'use-credentials'` \| `''` | - | - |
| name | File name | string | - | - |
| percent | Upload progress percent | number | - | - |
| status | Upload status. Show different style when configured | `error` \| `done` \| `uploading` \| `removed` | - | - |
| thumbUrl | Thumb image url | string | - | - |
| uid | unique id. Will auto-generate when not provided | string | - | - |
| url | Download url | string | - | - |

### RequestOptions {#request-options}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| action | Uploading URL | string | - | - |
| data | Uploading extra params or function which can return uploading extra params | Record<string, unknown> | - | - |
| filename | file name | string | - | - |
| file | File object containing upload information | [UploadFile](#uploadfile) | - | - |
| withCredentials | The ajax upload with cookie sent | boolean | - | - |
| headers | Set request headers, valid above IE10 | Record<string, string> | - | - |
| method | The http method of upload request | string | - | - |
| onProgress | Progress event callback | (event: object, file: UploadFile) => void | - | - |
| onError | Error callback when upload fails | (event: object, body?: object) => void | - | - |
| onSuccess | Success callback when upload completes | (body: object, fileOrXhr?: UploadFile \| XMLHttpRequest) => void | - | - |

### onChange {#onchange}

> 💡 The function will be called when uploading is in progress, completed, or failed.

When uploading state change, it returns:

```ts
{
  file: { /* ... */ },
  fileList: [ /* ... */ ],
  event: { /* ... */ },
}
```

1. `file` File object for the current operation.

   ```ts
   {
      uid: 'uid',      // unique identifier, negative is recommended, // to prevent interference with internally generated id
      name: 'xx.png',   // file name
      status: 'done' | 'uploading' | 'error' | 'removed', // Intercepted file by beforeUpload doesn't have a status field.
      response: '{"status": "success"}', // response from server
      linkProps: '{"download": "image"}', // additional HTML props of file link
      xhr: 'XMLHttpRequest{ ... }', // XMLHttpRequest Header
   }
   ```

2. `fileList` current list of files

3. `event` response from the server, including uploading progress, supported by advanced browsers.

### AcceptObject {#acceptobject}

```ts
{
  format: string;
  filter?: 'native' | ((file: VcFile) => boolean);
}
```

Configuration object for file type acceptance rules.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| format | Accepted file types, same as native input accept attribute. Supports MIME types, file extensions, etc. See [input accept Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept) | string | - | - |
| filter | File filtering rule. When set to `'native'`, uses browser native filtering behavior; when set to a function, allows custom filtering logic. Function returns `true` to accept the file, `false` to reject | `'native'` \| `(file: VcFile) => boolean` | - | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Upload"></ComponentTokenTable>

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.

## FAQ

### How do I implement upload server side? {#faq-server-implement}

- You can consult [jQuery-File-Upload](https://github.com/blueimp/jQuery-File-Upload/wiki#server-side) about how to implement server side upload interface.
- There is a mock example of [express](https://github.com/react-component/upload/blob/211979fdaa2c7896b6496df7061a0cfc0fc5434e/server.js) in rc-upload.

### I want to display download links. {#faq-show-download-link}

Please set property `url` of each item in `fileList` to control the content of the link.

### How to use `customRequest`? {#faq-custom-request}

See <https://github.com/react-component/upload#customrequest>.

### Why will the `fileList` that's in control not trigger `onChange` `status` update when the file is not in the list? {#faq-filelist-controlled-status}

`onChange` will only trigger when the file is in the list, it will ignore any events removed from the list.

### Why does `onChange` sometimes return File object and other times return `{ originFileObj: File }`? {#faq-on-change-return-type}

For compatible case, we return File object when `beforeUpload` return `false`. It will merge to `{ originFileObj: File }` in the next major version. Current version is compatible to get origin file by `info.file.originFileObj`. You can change this before a major release.

### Why sometimes Chrome can not upload? {#faq-chrome-file-picker}

Chrome update will also break native upload. Please restart Chrome to finish the upload job.

<img alt="click restart button on Chrome" src="https://github.com/ant-design/ant-design/assets/507615/1509b25f-4cd3-41b2-9415-90394ad08273" width="800" />

Ref:

- [#48007](https://github.com/ant-design/ant-design/issues/48007)
- [#32672](https://github.com/ant-design/ant-design/issues/32672)
- [#32913](https://github.com/ant-design/ant-design/issues/32913)
- [#33988](https://github.com/ant-design/ant-design/issues/33988)

### Can still select files when uploading a folder in Safari? {#faq-safari-folder-upload}

Inside the upload component, we use the `directory` and `webkitdirectory` properties to control the input to implement folder selection, but it seems that in Safari's implementation, [it doesn't prevent users from selecting files](https://stackoverflow.com/q/55649945/3040605). You can solve this issue through `accept` configuration, for example:

```ts
accept = {
  // Do not allow selecting any files
  format: `.${'n'.repeat(100)}`,
  // Accept all files within the folder after folder selection
  filter: () => true,
}
```
