<script setup lang="ts">
import type { ConfigProviderProps } from 'antdv-next'
import type { CSSProperties } from 'vue'
import {
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
} from '@antdv-next/icons'
import { Modal } from 'antdv-next'
import { computed } from 'vue'
import { useLocale } from '@/composables/use-locale'
import { createStyles } from './hooks'

interface ComponentsBlockProps {
  config?: ConfigProviderProps
  style?: CSSProperties
  className?: string
  containerClassName?: string
}

defineProps<ComponentsBlockProps>()

const ModalPanel = (Modal as any)._InternalPanelDoNotUseOrYouWillBeFired

const useStyle = createStyles(({ css, cssVar }) => {
  return {
    container: css({
      backgroundColor: `color-mix(in srgb, ${cssVar.colorBgContainer} 70%, transparent)`,
      backdropFilter: 'blur(12px)',
    }),
    flexAuto: css({
      flex: 'auto',
    }),
  }
})

const { styles } = useStyle()
const { t } = useLocale()

const dropdownItems = computed(() =>
  Array.from({ length: 5 }).map((_, index) => ({
    key: `opt${index}`,
    label: `${t('homePage.componentsBlock.option')} ${index}`,
  })),
)

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

const radioOptions = computed(() => [
  t('homePage.componentsBlock.apple'),
  t('homePage.componentsBlock.banana'),
])
</script>

<template>
  <a-config-provider v-bind="config">
    <a-card :class="[containerClassName, styles.container]">
      <a-app>
        <a-flex vertical gap="middle" :style="style" :class="className">
          <ModalPanel title="Ant Design" width="100%">
            {{ t('homePage.componentsBlock.text') }}
          </ModalPanel>

          <a-alert :message="t('homePage.componentsBlock.infoText')" type="info" />

          <a-flex gap="middle">
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

            <a-color-picker style="flex: none;" />

            <a-select
              style="flex: auto;"
              mode="multiple"
              max-tag-count="responsive"
              :default-value="['apple', 'banana']"
              :options="selectOptions"
            />
          </a-flex>

          <a-progress style="margin: 0;" :percent="60" />

          <a-steps :current="1" :items="stepsItems" />

          <a-slider
            style="margin-inline: 20px;"
            range
            :marks="{
              0: '0°C',
              26: '26°C',
              37: '37°C',
              100: { style: { color: '#f50' }, label: '100°C' },
            }"
            :default-value="[26, 37]"
          />

          <a-flex gap="middle">
            <a-button type="primary" :class="styles.flexAuto">
              {{ t('homePage.componentsBlock.primary') }}
            </a-button>
            <a-button type="primary" danger :class="styles.flexAuto">
              {{ t('homePage.componentsBlock.danger') }}
            </a-button>
            <a-button :class="styles.flexAuto">
              {{ t('homePage.componentsBlock.default') }}
            </a-button>
            <a-button type="dashed" :class="styles.flexAuto">
              {{ t('homePage.componentsBlock.dashed') }}
            </a-button>
          </a-flex>

          <a-flex gap="middle">
            <a-switch default-checked style="width: 48px;">
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
      </a-app>
    </a-card>
  </a-config-provider>
</template>
