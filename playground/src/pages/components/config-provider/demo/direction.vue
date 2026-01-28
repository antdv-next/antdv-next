<docs lang="zh-CN">
这里列出了支持 `rtl` 方向的组件，您可以在演示中切换方向。
</docs>

<docs lang="en-US">
Components which support rtl direction are listed here, you can toggle the direction in the demo.
</docs>

<script setup lang="ts">
import type { ConfigProviderProps, TreeDataNode, TreeSelectEmits } from 'antdv-next'
import {
  DownloadOutlined,
  LeftOutlined,
  MinusOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
  SmileOutlined,
} from '@antdv-next/icons'
import { computed, ref } from 'vue'

type DirectionType = ConfigProviderProps['direction']

type Placement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'

const direction = ref<DirectionType>('ltr')
const placement = computed<Placement>(() => (direction.value === 'rtl' ? 'bottomRight' : 'bottomLeft'))

const currentStep = ref(0)
const rateValue = ref(2.5)
const modalOpen = ref(false)
const badgeCount = ref(5)
const showBadge = ref(true)

const cascaderOptions = [
  {
    value: 'tehran',
    label: 'تهران',
    children: [
      {
        value: 'tehran-c',
        label: 'تهران',
        children: [
          {
            value: 'saadat-abad',
            label: 'سعادت آباد',
          },
        ],
      },
    ],
  },
  {
    value: 'ardabil',
    label: 'اردبیل',
    children: [
      {
        value: 'ardabil-c',
        label: 'اردبیل',
        children: [
          {
            value: 'pirmadar',
            label: 'پیرمادر',
          },
        ],
      },
    ],
  },
  {
    value: 'gilan',
    label: 'گیلان',
    children: [
      {
        value: 'rasht',
        label: 'رشت',
        children: [
          {
            value: 'district-3',
            label: 'منطقه ۳',
          },
        ],
      },
    ],
  },
]

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ title: 'sss', key: '0-0-1-0' }],
      },
    ],
  },
]

const treeSelectData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        children: [
          {
            value: 'my leaf',
            title: 'my leaf',
          },
          {
            value: 'your leaf',
            title: 'your leaf',
          },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        children: [
          {
            value: 'random3',
            title: 'random3',
          },
        ],
      },
    ],
  },
]

const treeSelectValue = ref()

function cascaderFilter(inputValue: string, path: { label: string }[]) {
  return path.some(option => option.label.toLowerCase().includes(inputValue.toLowerCase()))
}

function onCascaderChange(value: any) {
  console.log(value)
}

function showModal() {
  modalOpen.value = true
}

function handleModalOk() {
  modalOpen.value = false
}

function handleModalCancel() {
  modalOpen.value = false
}

function onStepsChange(nextStep: number) {
  currentStep.value = nextStep
}

function increaseBadge() {
  badgeCount.value += 1
}

function declineBadge() {
  badgeCount.value = Math.max(badgeCount.value - 1, 0)
}

const handleTreeSelectScroll: TreeSelectEmits['popupScroll'] = (e) => {
  console.log('popup scroll', e)
}
</script>

<template>
  <div style="margin-bottom: 16px;">
    <span style="margin-inline-end: 16px;">Change direction of components:</span>
    <a-radio-group v-model:value="direction">
      <a-radio-button value="ltr">
        LTR
      </a-radio-button>
      <a-radio-button value="rtl">
        RTL
      </a-radio-button>
    </a-radio-group>
  </div>
  <a-config-provider :direction="direction">
    <div class="direction-components">
      <a-row>
        <a-col :span="24">
          <a-divider title-placement="start">
            Cascader example
          </a-divider>
          <a-cascader
            :options="cascaderOptions"
            placeholder="یک مورد انتخاب کنید"
            :placement="placement"
            @change="onCascaderChange"
          >
            <template #suffixIcon>
              <SearchOutlined />
            </template>
          </a-cascader>
          &nbsp;&nbsp;&nbsp;&nbsp;With search:&nbsp;&nbsp;
          <a-cascader
            :options="cascaderOptions"
            placeholder="Select an item"
            :placement="placement"
            :show-search="{ filter: cascaderFilter } as any"
            @change="onCascaderChange"
          >
            <template #suffixIcon>
              <SmileOutlined />
            </template>
          </a-cascader>
        </a-col>
      </a-row>
      <br>
      <a-row>
        <a-col :span="12">
          <a-divider title-placement="start">
            Switch example
          </a-divider>
          &nbsp;&nbsp;
          <a-switch default-checked />
          &nbsp;&nbsp;
          <a-switch default-checked loading />
          &nbsp;&nbsp;
          <a-switch loading size="small" />
        </a-col>
        <a-col :span="12">
          <a-divider title-placement="start">
            Radio Group example
          </a-divider>
          <a-radio-group default-value="c" button-style="solid">
            <a-radio-button value="a">
              تهران
            </a-radio-button>
            <a-radio-button value="b" disabled>
              اصفهان
            </a-radio-button>
            <a-radio-button value="c">
              فارس
            </a-radio-button>
            <a-radio-button value="d">
              خوزستان
            </a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <br>
      <a-row>
        <a-col :span="12">
          <a-divider title-placement="start">
            Button example
          </a-divider>
          <div class="button-demo">
            <a-button type="primary">
              <template #icon>
                <DownloadOutlined />
              </template>
            </a-button>
            <a-button type="primary" shape="circle">
              <template #icon>
                <DownloadOutlined />
              </template>
            </a-button>
            <a-button type="primary" shape="round">
              <template #icon>
                <DownloadOutlined />
              </template>
            </a-button>
            <a-button type="primary" shape="round">
              <template #icon>
                <DownloadOutlined />
              </template>
              Download
            </a-button>
            <a-button type="primary">
              <template #icon>
                <DownloadOutlined />
              </template>
              Download
            </a-button>
            <br>
            <a-space-compact>
              <a-button type="primary">
                <template #icon>
                  <LeftOutlined />
                </template>
                Backward
              </a-button>
              <a-button type="primary" icon-placement="end">
                <template #icon>
                  <RightOutlined />
                </template>
                Forward
              </a-button>
            </a-space-compact>
            <a-button type="primary" loading>
              Loading
            </a-button>
            <a-button type="primary" size="small" loading>
              Loading
            </a-button>
          </div>
        </a-col>
        <a-col :span="12">
          <a-divider title-placement="start">
            Tree example
          </a-divider>
          <a-tree
            show-line
            checkable
            :default-expanded-keys="['0-0-0', '0-0-1']"
            :default-selected-keys="['0-0-0', '0-0-1']"
            :default-checked-keys="['0-0-0', '0-0-1']"
            :tree-data="treeData"
          >
            <template #titleRender="{ key, title }">
              <template v-if="key === '0-0-1-0'">
                <span style="color: #1677ff">{{ title }}</span>
              </template>
            </template>
          </a-tree>
        </a-col>
      </a-row>
      <br>
      <a-row>
        <a-col :span="24">
          <a-divider title-placement="start">
            Input (Space.Compact) example
          </a-divider>
          <a-space-compact size="large">
            <a-input style="width: 120px" default-value="0571" />
            <a-input style="width: 200px" default-value="26888888" />
          </a-space-compact>
          <br>
          <a-space-compact>
            <a-input style="width: 20%" default-value="0571" />
            <a-input style="width: 30%" default-value="26888888" />
          </a-space-compact>
          <br>
          <a-space-compact>
            <a-select
              default-value="Option1"
              :options="[
                { label: 'Option1', value: 'Option1' },
                { label: 'Option2', value: 'Option2' },
              ]"
            />
            <a-input style="width: 50%" default-value="input content" />
            <a-input-number />
          </a-space-compact>
          <br>
          <a-input-search placeholder="input search text" enter-button="Search" size="large" />
          <br>
          <br>
          <div style="margin-bottom: 16px">
            <a-space-compact>
              <a-select
                default-value="Http://"
                style="width: 90px"
                :options="[
                  { label: 'Http://', value: 'Http://' },
                  { label: 'Https://', value: 'Https://' },
                ]"
              />
              <a-input default-value="mysite" />
              <a-select
                default-value=".com"
                style="width: 80px"
                :options="[
                  { label: '.com', value: '.com' },
                  { label: '.jp', value: '.jp' },
                  { label: '.cn', value: '.cn' },
                  { label: '.org', value: '.org' },
                ]"
              />
            </a-space-compact>
          </div>
          <br>
          <a-row>
            <a-col :span="12">
              <a-divider title-placement="start">
                Select example
              </a-divider>
              <a-space wrap>
                <a-select
                  mode="multiple"
                  :default-value="['مورچه']"
                  style="width: 120px"
                  :options="[
                    { label: 'jack', value: 'jack' },
                    { label: 'مورچه', value: 'مورچه' },
                    { label: 'disabled', value: 'disabled', disabled: true },
                    { label: 'yiminghe', value: 'Yiminghe' },
                  ]"
                />
                <a-select
                  disabled
                  default-value="مورچه"
                  style="width: 120px"
                  :options="[{ label: 'مورچه', value: 'مورچه' }]"
                />
                <a-select
                  loading
                  default-value="مورچه"
                  style="width: 120px"
                  :options="[{ label: 'مورچه', value: 'مورچه' }]"
                />
                <a-select
                  show-search
                  style="width: 200px"
                  placeholder="Select a person"
                  :options="[
                    { label: 'jack', value: 'jack' },
                    { label: 'سعید', value: 'سعید' },
                    { label: 'Tom', value: 'tom' },
                  ]"
                />
              </a-space>
            </a-col>
            <a-col :span="12">
              <a-divider title-placement="start">
                TreeSelect example
              </a-divider>
              <a-tree-select
                v-model:value="treeSelectValue"
                show-search
                style="width: 100%"
                :tree-data="treeSelectData"
                :styles="{
                  popup: {
                    root: { maxHeight: '400px', overflow: 'auto' },
                  },
                }"
                placeholder="Please select"
                allow-clear
                tree-default-expand-all
                @popup-scroll="handleTreeSelectScroll"
              >
                <template #treeTitleRender="item">
                  <template v-if="item.value === 'random3'">
                    <b style="color: #08c">sss</b>
                  </template>
                </template>
              </a-tree-select>
            </a-col>
          </a-row>
          <br>
          <a-row>
            <a-col :span="24">
              <a-divider title-placement="start">
                Modal example
              </a-divider>
              <a-button type="primary" @click="showModal">
                Open Modal
              </a-button>
              <a-modal
                v-model:open="modalOpen"
                title="پنچره ساده"
                @ok="handleModalOk"
                @cancel="handleModalCancel"
              >
                <p>نگاشته‌های خود را اینجا قراردهید</p>
                <p>نگاشته‌های خود را اینجا قراردهید</p>
                <p>نگاشته‌های خود را اینجا قراردهید</p>
              </a-modal>
            </a-col>
          </a-row>
          <br>
          <a-row>
            <a-col :span="24">
              <a-divider title-placement="start">
                Steps example
              </a-divider>
              <a-steps
                type="dot"
                :current="currentStep"
                :items="[
                  { title: 'Finished', content: 'This is a description.' },
                  { title: 'In Progress', content: 'This is a description.' },
                  { title: 'Waiting', content: 'This is a description.' },
                ]"
              />
              <br>
              <a-steps
                :current="currentStep"
                :items="[
                  { title: 'Step 1', content: 'This is a description.' },
                  { title: 'Step 2', content: 'This is a description.' },
                  { title: 'Step 3', content: 'This is a description.' },
                ]"
                @change="onStepsChange"
              />
            </a-col>
          </a-row>
          <br>
          <a-row>
            <a-col :span="12">
              <a-divider title-placement="start">
                Rate example
              </a-divider>
              <a-rate v-model:value="rateValue" allow-half />
              <br>
              <strong>* Note:</strong> Half star not implemented in RTL direction, it will be
              supported after
              <a href="https://github.com/react-component/rate" target="_blank" rel="noreferrer">rc-rate</a>
              implement rtl support.
            </a-col>
            <a-col :span="12">
              <a-divider title-placement="start">
                Badge example
              </a-divider>
              <a-badge :count="badgeCount">
                <a href="#" class="head-example" />
              </a-badge>
              <a-space-compact>
                <a-button @click="declineBadge">
                  <template #icon>
                    <MinusOutlined />
                  </template>
                </a-button>
                <a-button @click="increaseBadge">
                  <template #icon>
                    <PlusOutlined />
                  </template>
                </a-button>
              </a-space-compact>
              <div style="margin-top: 12px;">
                <a-badge :dot="showBadge">
                  <a href="#" class="head-example" />
                </a-badge>
                <a-switch v-model:checked="showBadge" />
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <br>
      <br>
      <a-row>
        <a-col :span="24">
          <a-divider title-placement="start">
            Pagination example
          </a-divider>
          <a-pagination :default-current="3" :total="500" show-size-changer />
        </a-col>
      </a-row>
      <br>
      <a-row>
        <a-col :span="24">
          <a-divider title-placement="start">
            Grid System example
          </a-divider>
          <div class="grid-demo">
            <div class="code-box-demo">
              <p>
                <strong>* Note:</strong> Every calculation in RTL grid system is from right side
                (offset, push, etc.)
              </p>
              <a-row>
                <a-col :span="8">
                  col-8
                </a-col>
                <a-col :span="8" :offset="8">
                  col-8
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="6" :offset="6">
                  col-6 col-offset-6
                </a-col>
                <a-col :span="6" :offset="6">
                  col-6 col-offset-6
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12" :offset="6">
                  col-12 col-offset-6
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="18" :push="6">
                  col-18 col-push-6
                </a-col>
                <a-col :span="6" :pull="18">
                  col-6 col-pull-18
                </a-col>
              </a-row>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-config-provider>
</template>

<style scoped>
:deep(.button-demo .ant-btn),
:deep(.button-demo .ant-btn-group) {
  margin-inline-end: 8px;
  margin-bottom: 12px;
}

:deep(.button-demo .ant-btn-group > .ant-btn),
:deep(.button-demo .ant-btn-group > span > .ant-btn) {
  margin-inline-end: 0;
  margin-inline-start: 0;
}

.head-example {
  display: inline-block;
  width: 42px;
  height: 42px;
  vertical-align: middle;
  background: #eee;
  border-radius: 4px;
}

:deep(.ant-badge:not(.ant-badge-not-a-wrapper)) {
  margin-inline-end: 20px;
}

:deep(.ant-badge-rtl:not(.ant-badge-not-a-wrapper)) {
  margin-inline-end: 0;
  margin-inline-start: 20px;
}
</style>
