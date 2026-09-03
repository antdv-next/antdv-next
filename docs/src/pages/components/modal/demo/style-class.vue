<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象或者函数可以自定义 Modal 组件的 [语义化结构](#semantic-dom) 样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Modal by passing objects or functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { ModalProps } from 'antdv-next'
import { computed, ref } from 'vue'

const modalOpen = ref(false)
const modalFnOpen = ref(false)

const lineStyle = {
  lineHeight: '28px',
}

const classNames = computed(() => ({
  container: 'custom-modal-container',
}))

const styles: ModalProps['styles'] = {
  mask: {
    backgroundImage: `linear-gradient(to top, #18181b 0, rgba(21, 21, 22, 0.2) 100%)`,
  },
}

const stylesFn: ModalProps['styles'] = {
  container: {
    borderRadius: '14px',
    border: '1px solid #ccc',
    padding: '0',
    overflow: 'hidden',
  },
  header: {
    padding: '16px',
  },
  body: {
    padding: '16px',
  },
  footer: {
    padding: '16px 10px',
    backgroundColor: '#fafafa',
  },
}

const sharedProps = computed<ModalProps>(() => ({
  centered: true,
  classes: classNames.value,
}))
</script>

<template>
  <a-flex gap="medium">
    <a-button @click="modalOpen = true">
      Open Style Modal
    </a-button>
    <a-button type="primary" @click="modalFnOpen = true">
      Open Function Modal
    </a-button>

    <a-modal
      v-bind="sharedProps"
      v-model:open="modalOpen"
      :footer="null"
      title="Custom Style Modal"
      :styles="styles"
    >
      <div :style="lineStyle">
        Following the Ant Design specification, we developed a React UI library antd that contains a
        set of high quality components and demos for building rich, interactive user interfaces.
      </div>
      <div :style="lineStyle">
        🌈 Enterprise-class UI designed for web applications.
      </div>
      <div :style="lineStyle">
        📦 A set of high-quality React components out of the box.
      </div>
      <div :style="lineStyle">
        🛡 Written in TypeScript with predictable static types.
      </div>
      <div :style="lineStyle">
        ⚙️ Whole package of design resources and development tools.
      </div>
      <div :style="lineStyle">
        🌍 Internationalization support for dozens of languages.
      </div>
      <div :style="lineStyle">
        🎨 Powerful theme customization in every detail.
      </div>
    </a-modal>

    <a-modal
      v-bind="sharedProps"
      v-model:open="modalFnOpen"
      title="Custom Function Modal"
      :styles="stylesFn"
      :mask="{ enabled: true, blur: true }"
    >
      <div :style="lineStyle">
        Following the Ant Design specification, we developed a React UI library antd that contains a
        set of high quality components and demos for building rich, interactive user interfaces.
      </div>
      <div :style="lineStyle">
        🌈 Enterprise-class UI designed for web applications.
      </div>
      <div :style="lineStyle">
        📦 A set of high-quality React components out of the box.
      </div>
      <div :style="lineStyle">
        🛡 Written in TypeScript with predictable static types.
      </div>
      <div :style="lineStyle">
        ⚙️ Whole package of design resources and development tools.
      </div>
      <div :style="lineStyle">
        🌍 Internationalization support for dozens of languages.
      </div>
      <div :style="lineStyle">
        🎨 Powerful theme customization in every detail.
      </div>
      <template #footer>
        <a-button
          :style="{ borderColor: '#ccc', color: '#171717', backgroundColor: '#fff' }"
          @click="modalFnOpen = false"
        >
          Cancel
        </a-button>
        <a-button
          type="primary"
          :style="{ backgroundColor: '#171717' }"
          @click="modalOpen = true"
        >
          Submit
        </a-button>
      </template>
    </a-modal>
  </a-flex>
</template>

<style scoped>
.custom-modal-container {
  border-radius: 10px;
  padding: 10px;
}
</style>
