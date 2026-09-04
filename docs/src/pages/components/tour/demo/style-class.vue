<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Tour 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Tour by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { TourProps, TourStepItem } from 'antdv-next'
import { computed, h, shallowRef } from 'vue'

const ref1 = shallowRef()
const ref2 = shallowRef()
const ref3 = shallowRef()
const open = shallowRef(false)
const openFn = shallowRef(false)

const btnProps = {
  nextButtonProps: {
    style: {
      border: '1px solid #CDC1FF',
      color: '#CDC1FF',
    },
  },
  prevButtonProps: {
    style: {
      backgroundColor: '#CDC1FF',
      color: '#fff',
    },
  },
}

const coverNode = h('img', {
  alt: 'tour.png',
  src: 'https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png',
})

const steps: TourStepItem[] = [
  {
    title: 'Upload File',
    description: 'Put your files here.',
    cover: coverNode,
    target: ref1,
    prevButtonProps: {},
  },
  {
    title: 'Save',
    description: 'Save your changes.',
    target: ref2,
  },
  {
    title: 'Other Actions',
    description: 'Click to see other actions.',
    target: ref3,
  },
]

const stepsWithButtonProps = computed(() => steps.map(step => ({ ...step, ...btnProps })))

const classes: TourProps['classes'] = {
  root: 'custom-tour-root',
  section: 'custom-tour-section',
}

const stylesObject: TourProps['styles'] = {
  mask: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  section: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '2px solid #4096ff',
  },
  cover: {
    borderRadius: '12px 12px 0 0',
  },
}

const stylesFn: TourProps['styles'] = (info) => {
  if (info.props.type === 'primary') {
    return {
      mask: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      },
      section: {
        backgroundColor: 'rgba(205, 193, 255, 0.8)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      cover: {
        borderRadius: '12px 12px 0 0',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="medium">
    <a-flex gap="medium">
      <a-button type="primary" @click="open = true">
        Begin Tour Object
      </a-button>
      <a-button type="primary" @click="openFn = true">
        Begin Tour Function
      </a-button>
    </a-flex>
    <a-divider />
    <a-tour
      v-model:open="open"
      :steps="steps"
      :classes="classes"
      :styles="stylesObject"
      :arrow="false"
    />
    <a-tour
      v-model:open="openFn"
      :steps="stepsWithButtonProps"
      :classes="classes"
      :styles="stylesFn"
      :arrow="false"
      type="primary"
    />
    <a-space>
      <a-button ref="ref1" type="primary">
        Upload
      </a-button>
      <a-button ref="ref2">
        Save
      </a-button>
      <a-button ref="ref3" type="dashed">
        Other Actions
      </a-button>
    </a-space>
  </a-flex>
</template>

<style>
.custom-tour-root {
  border-radius: 4px;
}

.custom-tour-section {
  border-radius: 8px;
}
</style>
