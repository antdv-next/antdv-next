<script setup lang="ts">
import { AntdvNextOutlined, CheckOutlined, CloseOutlined, DownOutlined } from '@antdv-next/icons'
import { message, Modal, theme, Tooltip } from 'antdv-next'
import { computed } from 'vue'
import { useLocale } from '@/composables/use-locale'
import Tilt from './tilt.vue'

const { _InternalPanelDoNotUseOrYouWillBeFired: ModalPanel } = Modal as any
const { _InternalPanelDoNotUseOrYouWillBeFired: InternalTooltip } = Tooltip
const { _InternalPanelDoNotUseOrYouWillBeFired: InternalMessage } = message

const { token } = theme.useToken()

const { t } = useLocale()

const dropdownItems = computed(() =>
  Array.from({ length: 5 }).map((_, index) => ({
    key: `opt${index}`,
    label: `${t('homePage.componentsBlock.option')} ${index}`,
  })))

const selectOptions = computed(() => [
  { value: 'apple', label: t('homePage.componentsBlock.apple') },
  { value: 'banana', label: t('homePage.componentsBlock.banana') },
  { value: 'orange', label: t('homePage.componentsBlock.orange') },
  { value: 'watermelon', label: t('homePage.componentsBlock.watermelon') },
])

const stepsItems = computed(() => [
  { title: t('homePage.componentsBlock.finished') },
  { title: t('homePage.componentsBlock.inProgress') },
  { title: t('homePage.componentsBlock.waiting') },
])

const checkboxOptions = computed(() => [
  t('homePage.componentsBlock.apple'),
  t('homePage.componentsBlock.banana'),
  t('homePage.componentsBlock.orange'),
])
</script>

<template>
  <Tilt :options="{ max: 4, glare: false, scale: 0.98 }" class="holder">
    <ModalPanel title="Antdv Next" width="100%">
      {{ t('homePage.componentsBlock.text') }}
    </ModalPanel>
    <a-alert :title="t('homePage.componentsBlock.infoText')" type="info" />
    <!-- Line -->
    <div class="flex">
      <a-color-picker style="flex: none;" />
      <div style="flex: none;">
        <a-space-compact>
          <a-button>{{ t('homePage.componentsBlock.dropdown') }}</a-button>
          <a-dropdown :menu="{ items: dropdownItems }">
            <a-button>
              <template #icon>
                <DownOutlined />
              </template>
            </a-button>
          </a-dropdown>
        </a-space-compact>
      </div>
      <a-select
        style="flex: auto;"
        mode="multiple"
        max-tag-count="responsive"
        :default-value="['apple', 'banana']"
        :options="selectOptions"
      />
      <a-input style="flex: none; width: 120px;" />
    </div>
    <a-progress
      style="margin: 0;"
      :percent="100"
      :stroke-color="{ '0%': '#108ee9', '100%': '#87d068' }"
    />
    <a-progress style="margin: 0;" :percent="33" status="exception" />
    <a-steps :current="1" :items="stepsItems" />
    <!-- Line -->
    <div class="block">
      <a-slider
        style="margin-inline: 20px;"
        range
        :marks="{
          0: '0°C',
          26: '26°C',
          37: '37°C',
          100: { label: '100°C', style: { color: '#f50' } },
        }"
        :default-value="[26, 37]"
      />
    </div>
    <!-- Line -->
    <div class="flex">
      <a-button class="ptg_20" type="primary">
        {{ t('homePage.componentsBlock.primary') }}
      </a-button>
      <a-button class="ptg_20" type="primary" danger>
        {{ t('homePage.componentsBlock.danger') }}
      </a-button>
      <a-button class="ptg_20">
        {{ t('homePage.componentsBlock.default') }}
      </a-button>
      <a-button class="ptg_20" type="dashed">
        {{ t('homePage.componentsBlock.dashed') }}
      </a-button>
      <a-button class="ptg_20">
        <template #icon>
          <AntdvNextOutlined />
        </template>
        {{ t('homePage.componentsBlock.icon') }}
      </a-button>
    </div>
    <!-- Line -->
    <div class="block">
      <div class="flex">
        <a-switch
          class="ptg_none"
          default-checked
        >
          <template #checkedChildren>
            <CheckOutlined />
          </template>
          <template #unCheckedChildren>
            <CloseOutlined />
          </template>
        </a-switch>
        <a-checkbox-group
          class="ptg_none"
          :options="checkboxOptions"
          :default-value="[t('homePage.componentsBlock.apple')]"
        />
      </div>
    </div>
    <div>
      <InternalMessage :content="t('homePage.componentsBlock.release')" type="success" />
    </div>
    <InternalTooltip :title="t('homePage.componentsBlock.hello')" placement="topLeft" class="noMargin" />
    <a-alert title="Antdv Next love you!" type="success" />
  </Tilt>
</template>

<style scoped>
.holder {
  width: 500px;
  display: flex;
  flex-direction: column;
  row-gap: v-bind('`${token.padding}px`');
  opacity: 0.8;
}

.flex {
  display: flex;
  flex-wrap: nowrap;
  column-gap: v-bind('`${token.padding}px`');
}

.ptg_20 {
  flex: 0 1 20%;
}

.ptg_none {
  flex: none;
}

.block {
  background-color: v-bind('token.colorBgContainer');
  padding: v-bind('`${token.paddingXS}px`') v-bind('`${token.paddingSM}px`');
  border-radius: v-bind('`${token.borderRadius}px`');
  border: 1px solid v-bind('token.colorBorder');
}

.noMargin {
  margin: 0;
}
</style>
