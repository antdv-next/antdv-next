<docs lang="zh-CN">
此处列出 Antv Next 中需要国际化支持的组件，你可以在演示里切换语言。
</docs>

<docs lang="en-US">
Components which need localization support are listed here, you can toggle the language in the demo.
</docs>

<script setup lang="ts">
import type { ConfigProviderProps, TableProps, TourStepItem, UploadFile } from 'antdv-next'

import { EllipsisOutlined } from '@antdv-next/icons'
import { Modal, theme } from 'antdv-next'
import enUS from 'antdv-next/locale/en_US'
import zhCN from 'antdv-next/locale/zh_CN'
import dayjs from 'dayjs'
import { reactive, ref, shallowRef, watch } from 'vue'
import 'dayjs/locale/zh-cn'

type Locale = ConfigProviderProps['locale']

dayjs.locale('en')

const { token } = theme.useToken()

const localeName = ref<'en-US' | 'zh-CN'>('en-US')

const locale = ref<Locale>(enUS)
const open = ref(false)
const tourOpen = ref(false)
const tourRef1 = shallowRef()
const tourRef2 = shallowRef()
const tourRef3 = shallowRef()

watch(localeName, (next) => {
  dayjs.locale(next === 'zh-CN' ? 'zh-cn' : 'en')
  locale.value = next === 'zh-CN' ? zhCN : enUS
})

const columns: TableProps['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    filters: [{ text: 'filter1', value: 'filter1' }],
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
]

const steps: TourStepItem[] = [
  {
    title: 'Upload File',
    description: 'Put your files here.',
    target: tourRef1,
  },
  {
    title: 'Save',
    description: 'Save your changes.',
    target: tourRef2,
  },
  {
    title: 'Other Actions',
    description: 'Click to see other actions.',
    target: tourRef3,
  },
]

const fileList = ref<UploadFile[]>([
  {
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-2',
    percent: 50,
    name: 'image.png',
    status: 'uploading',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-3',
    name: 'image.png',
    status: 'error',
  },
])

const formState = reactive({
  username: '',
  age: 100,
})

const selectOptions = [
  { label: 'jack', value: 'jack' },
  { label: 'lucy', value: 'lucy' },
]

function showModal() {
  open.value = true
}

function hideModal() {
  open.value = false
}

function info() {
  Modal.info({
    title: 'some info',
    content: 'some info',
  })
}

function confirm() {
  Modal.confirm({
    title: 'some info',
    content: 'some info',
  })
}
</script>

<template>
  <div style="margin-bottom: 16px;">
    <span style="margin-inline-end: 16px;">Change locale of components:</span>
    <a-radio-group v-model:value="localeName">
      <a-radio-button value="en-US">
        English
      </a-radio-button>
      <a-radio-button value="zh-CN">
        中文
      </a-radio-button>
    </a-radio-group>
  </div>
  <a-config-provider :locale="locale">
    <a-space
      vertical
      :size="[0, 16]"
      :style="{
        width: '100%',
        paddingTop: '16px',
        borderTop: `1px solid ${token.colorBorder}`,
      }"
    >
      <a-pagination :default-current="1" :total="50" show-size-changer />
      <a-space wrap>
        <a-select show-search style="width: 200px" :options="selectOptions" />
        <a-date-picker />
        <a-time-picker />
        <a-range-picker />
      </a-space>
      <a-space wrap>
        <a-button type="primary" @click="showModal">
          Show Modal
        </a-button>
        <a-button @click="info">
          Show info
        </a-button>
        <a-button @click="confirm">
          Show confirm
        </a-button>
        <a-popconfirm title="Question?">
          <a href="#">Click to confirm</a>
        </a-popconfirm>
      </a-space>
      <a-transfer :data-source="[]" show-search :target-keys="[]" />
      <div :style="{ width: '320px', border: `1px solid ${token.colorBorder}`, borderRadius: '8px' }">
        <a-calendar :fullscreen="false" :value="dayjs()" />
      </div>
      <a-form
        :model="formState"
        auto-complete="off"
        :label-col="{ sm: { span: 4 } }"
        :wrapper-col="{ span: 6 }"
      >
        <a-form-item label="Username" name="username" :rules="[{ required: true }]">
          <a-input v-model:value="formState.username" :style="{ width: '200px' }" />
        </a-form-item>
        <a-form-item
          label="Age"
          name="age"
          :rules="[{ type: 'number', min: 0, max: 99 }]"
        >
          <a-input-number v-model:value="formState.age" :style="{ width: '200px' }" />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 2, span: 6 }">
          <a-button type="primary" html-type="submit">
            Submit
          </a-button>
        </a-form-item>
      </a-form>
      <a-table :data-source="[]" :columns="columns" />
      <a-modal v-model:open="open" title="Locale Modal" @cancel="hideModal">
        <p>Locale Modal</p>
      </a-modal>
      <a-space wrap :size="80">
        <a-qrcode value="https://ant.design/" status="expired" @refresh="() => console.log('refresh')" />
        <a-image
          :width="160"
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      </a-space>
      <a-upload v-model:file-list="fileList" list-type="picture-card">
        <div style="padding: 8px 0">
          Upload
        </div>
      </a-upload>
      <a-divider title-placement="start">
        Tour
      </a-divider>
      <a-button type="primary" @click="tourOpen = true">
        Begin Tour
      </a-button>
      <a-space>
        <a-button ref="tourRef1">
          Upload
        </a-button>
        <a-button ref="tourRef2" type="primary">
          Save
        </a-button>
        <a-button ref="tourRef3">
          <template #icon>
            <EllipsisOutlined />
          </template>
        </a-button>
      </a-space>
      <a-tour v-model:open="tourOpen" :steps="steps" />
    </a-space>
  </a-config-provider>
</template>
