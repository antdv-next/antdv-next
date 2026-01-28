<docs lang="zh-CN">
骨架按钮、头像、输入框、图像和自定义节点。
</docs>

<docs lang="en-US">
Skeleton Button, Avatar, Input, Image and Node.
</docs>

<script setup lang="ts">
import { DotChartOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

type SizeType = 'default' | 'small' | 'large'
type ButtonShapeType = 'circle' | 'square' | 'round' | 'default'
type AvatarShapeType = 'circle' | 'square'

const active = ref(false)
const block = ref(false)
const size = ref<SizeType>('default')
const buttonShape = ref<ButtonShapeType>('default')
const avatarShape = ref<AvatarShapeType>('circle')
</script>

<template>
  <a-flex gap="middle" vertical>
    <a-space>
      <a-skeleton-button :active="active" :size="size" :shape="buttonShape" :block="block" />
      <a-skeleton-avatar :active="active" :size="size" :shape="avatarShape" />
      <a-skeleton-input :active="active" :size="size" />
    </a-space>
    <a-skeleton-button :active="active" :size="size" :shape="buttonShape" :block="block" />
    <a-skeleton-input :active="active" :size="size" :block="block" />
    <a-space>
      <a-skeleton-image :active="active" />
      <a-skeleton-node :active="active" style="width: 160px" />
      <a-skeleton-node :active="active">
        <DotChartOutlined style="font-size: 40px; color: #bfbfbf" />
      </a-skeleton-node>
    </a-space>
    <a-divider />
    <a-form layout="inline" style="margin: 16px 0">
      <a-space :size="16" wrap>
        <a-form-item label="Active">
          <a-switch v-model:value="active" />
        </a-form-item>
        <a-form-item label="Button and Input Block">
          <a-switch v-model:value="block" />
        </a-form-item>
        <a-form-item label="Size">
          <a-radio-group v-model:value="size">
            <a-radio-button value="default">
              Default
            </a-radio-button>
            <a-radio-button value="large">
              Large
            </a-radio-button>
            <a-radio-button value="small">
              Small
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="Button Shape">
          <a-radio-group v-model:value="buttonShape">
            <a-radio-button value="default">
              Default
            </a-radio-button>
            <a-radio-button value="square">
              Square
            </a-radio-button>
            <a-radio-button value="round">
              Round
            </a-radio-button>
            <a-radio-button value="circle">
              Circle
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="Avatar Shape">
          <a-radio-group v-model:value="avatarShape">
            <a-radio-button value="square">
              Square
            </a-radio-button>
            <a-radio-button value="circle">
              Circle
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-space>
    </a-form>
  </a-flex>
</template>
