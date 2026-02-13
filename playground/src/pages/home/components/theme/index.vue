<script setup lang="ts">
import {
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
} from '@antdv-next/icons'
import { Modal } from 'antdv-next'
import { computed, h, ref } from 'vue'
import { useLocale } from '@/composables/use-locale'
import Group from '../group/index.vue'
import BackgroundImage from './background-image.vue'
import { usePreviewThemes } from './preview-theme'

const ModalPanel = (Modal as any)._InternalPanelDoNotUseOrYouWillBeFired
const previewThemes = usePreviewThemes()

const activeThemeIndex = ref(0)
const activeTheme = computed(() => previewThemes.value[activeThemeIndex.value])

// Slider marks
const sliderMarks = {
  0: '0°C',
  26: '26°C',
  37: '37°C',
  100: {
    style: {
      color: '#f50',
    },
    label: h('strong', '100°C'),
  },
}

const { t } = useLocale()

const selectOptions = computed(() => [
  { value: 'apple', label: t('homePage.componentsBlock.apple') },
  { value: 'banana', label: t('homePage.componentsBlock.banana') },
  { value: 'orange', label: t('homePage.componentsBlock.orange') },
  { value: 'watermelon', label: t('homePage.componentsBlock.watermelon') },
])

const dropdownItems = computed(() =>
  Array.from({ length: 5 }).map((_, index) => ({
    key: `opt${index}`,
    label: `${t('homePage.componentsBlock.option')} ${index}`,
  })),
)

// Steps items
const stepsItems = computed(() => [
  { title: t('homePage.componentsBlock.finished') },
  { title: t('homePage.componentsBlock.inProgress') },
  { title: t('homePage.componentsBlock.waiting') },
])

// Checkbox options
const checkboxOptions = computed(() => [
  t('homePage.componentsBlock.apple'),
  t('homePage.componentsBlock.banana'),
  t('homePage.componentsBlock.orange'),
])

// Radio options
const radioOptions = computed(() => [
  t('homePage.componentsBlock.apple'),
  t('homePage.componentsBlock.banana'),
])

const memoThemeProps = computed(() => activeTheme.value?.props)
</script>

<template>
  <Group
    id="flexible"
    :title="t('homePage.theme.themeTitle')"
    :description="t('homePage.theme.themeDesc')"
    :title-color="activeTheme?.bgImgDark ? '#fff' : '#000'"
  >
    <a-flex class="theme-container" gap="large">
      <!-- Theme List -->
      <div class="theme-list" role="tablist" aria-label="Theme selection">
        <div
          v-for="(item, index) in previewThemes"
          :key="item.name"
          class="theme-list-item"
          :class="{
            active: activeThemeIndex === index,
            dark: activeTheme?.bgImgDark,
          }"
          role="tab"
          :tabindex="activeThemeIndex === index ? 0 : -1"
          :aria-selected="activeThemeIndex === index"
          @click="activeThemeIndex = index"
          @keydown="(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              activeThemeIndex = index
            }
          }"
        >
          {{ item.name }}
        </div>
      </div>

      <a-config-provider v-bind="memoThemeProps">
        <!-- Background Image -->
        <BackgroundImage
          :src="activeTheme?.bgImg"
          :is-light="!activeTheme?.bgImgDark"
        />
        <!-- Components Block -->
        <a-card
          class="components-block"
          :classes="{
            root: 'components-card',
          }"
        >
          <a-flex vertical gap="middle">
            <!-- Modal Panel -->
            <ModalPanel title="Antdv Next">
              {{ t('homePage.componentsBlock.text') }}
            </ModalPanel>

            <!-- Alert -->
            <a-alert :message="t('homePage.componentsBlock.infoText')" type="info" />

            <!-- Dropdown & ColorPicker & Select -->
            <a-flex gap="middle">
              <a-space-compact>
                <a-button>{{ t('homePage.componentsBlock.dropdown') }}</a-button>
                <a-dropdown :menu="{ items: dropdownItems }">
                  <a-button>
                    <DownOutlined />
                  </a-button>
                </a-dropdown>
              </a-space-compact>
              <a-color-picker />
              <a-select
                style="flex: auto"
                mode="multiple"
                max-tag-count="responsive"
                :default-value="['apple', 'banana']"
                :options="selectOptions"
              />
            </a-flex>

            <!-- Progress -->
            <a-progress :percent="60" style="margin: 0" />

            <!-- Steps -->
            <a-steps :current="1" :items="stepsItems" />

            <!-- Slider -->
            <a-slider
              range
              :marks="sliderMarks"
              :default-value="[26, 37]"
              style="margin-inline: 20px"
            />

            <!-- Buttons -->
            <a-flex gap="middle">
              <a-button type="primary" class="flex-auto">
                {{ t('homePage.componentsBlock.primary') }}
              </a-button>
              <a-button type="primary" danger class="flex-auto">
                {{ t('homePage.componentsBlock.danger') }}
              </a-button>
              <a-button class="flex-auto">
                {{ t('homePage.componentsBlock.default') }}
              </a-button>
              <a-button type="dashed" class="flex-auto">
                {{ t('homePage.componentsBlock.dashed') }}
              </a-button>
            </a-flex>

            <!-- Switch & Checkbox & Radio -->
            <a-flex gap="middle">
              <a-switch default-checked style="width: 48px">
                <template #checkedChildren>
                  <CheckOutlined />
                </template>
                <template #unCheckedChildren>
                  <CloseOutlined />
                </template>
              </a-switch>
              <a-checkbox-group
                :options="checkboxOptions"
                :default-value="[t('homePage.componentsBlock.apple')]"
              />
              <a-radio-group
                :default-value="t('homePage.componentsBlock.apple')"
                :options="radioOptions"
              />
            </a-flex>
          </a-flex>
        </a-card>
      </a-config-provider>
    </a-flex>
  </Group>
</template>

<style>
.theme-container {
  width: 100%;
  align-items: stretch;
  justify-content: center;
}

.theme-list {
  flex: auto;
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.theme-list-item {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  padding-block: 12px;
  padding-inline: 16px;
  border: 1px solid transparent;
  border-radius: 6px;
  transition: all 0.2s;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.88);
}

.theme-list-item:hover:not(.active) {
  border-color: #91caff;
  background-color: #e6f4ff;
}

.theme-list-item:focus-visible {
  outline: 2px solid #1677ff;
  outline-offset: 2px;
}

.theme-list-item.active {
  border-color: #1677ff;
  background-color: #e6f4ff;
  color: #1677ff;
}

.theme-list-item.dark {
  color: #fff;
  background-color: transparent;
}

.theme-list-item.dark:hover,
.theme-list-item.dark.active {
  border-color: #fff;
  background-color: transparent;
}

.components-block {
  flex: none;
  background: color-mix(in srgb, var(--ant-color-bg-container) 70%, transparent);
  backdrop-filter: blur(12px);
  max-width: calc(420px + var(--ant-padding-xl) * 8);
  border: var(--ant-line-width) var(--ant-line-type) var(--ant-color-border-secondary);
}

.flex-auto {
  flex: auto;
}

.components-card {
  flex: auto;
  display: flex;
  padding: var(--ant-padding-xl);
  -webkit-box-pack: center;
  justify-content: center;
  border: var(--ant-line-width) var(--ant-line-type) var(--ant-color-border-secondary);
  border-radius: var(--ant-border-radius);
  box-shadow: var(--ant-box-shadow);
}
</style>
