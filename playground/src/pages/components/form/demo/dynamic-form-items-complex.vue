<docs lang="zh-CN">
复杂动态嵌套表单项。
</docs>

<docs lang="en-US">
Complex nested dynamic form items.
</docs>

<script setup lang="ts">
import { CloseOutlined } from '@antdv-next/icons'
import { reactive } from 'vue'

interface SubItem { first: string, second: string }

interface Item { name: string, list: SubItem[] }

const model = reactive<{ items: Item[] }>({
  items: [
    { name: '', list: [{ first: '', second: '' }] },
  ],
})

function addItem() {
  model.items.push({ name: '', list: [{ first: '', second: '' }] })
}

function removeItem(index: number) {
  model.items.splice(index, 1)
}

function addSubItem(index: number) {
  model.items[index].list.push({ first: '', second: '' })
}

function removeSubItem(itemIndex: number, subIndex: number) {
  model.items[itemIndex].list.splice(subIndex, 1)
}
</script>

<template>
  <a-form
    name="dynamic_form_complex"
    :model="model"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    style="max-width: 600px"
  >
    <div style="display: flex; row-gap: 16px; flex-direction: column">
      <a-card
        v-for="(item, index) in model.items"
        :key="`item-${index}`"
        size="small"
        :title="`Item ${index + 1}`"
        :extra="null"
      >
        <template #extra>
          <CloseOutlined @click="removeItem(index)" />
        </template>

        <a-form-item :name="['items', index, 'name']" label="Name">
          <a-input v-model:value="item.name" />
        </a-form-item>

        <a-form-item label="List">
          <div style="display: flex; flex-direction: column; row-gap: 16px">
            <a-space
              v-for="(subItem, subIndex) in item.list"
              :key="`sub-${index}-${subIndex}`"
              align="baseline"
            >
              <a-form-item no-style :name="['items', index, 'list', subIndex, 'first']">
                <a-input v-model:value="subItem.first" placeholder="first" />
              </a-form-item>
              <a-form-item no-style :name="['items', index, 'list', subIndex, 'second']">
                <a-input v-model:value="subItem.second" placeholder="second" />
              </a-form-item>
              <CloseOutlined @click="removeSubItem(index, subIndex)" />
            </a-space>
            <a-button type="dashed" block @click="addSubItem(index)">
              + Add Sub Item
            </a-button>
          </div>
        </a-form-item>
      </a-card>

      <a-button type="dashed" block @click="addItem">
        + Add Item
      </a-button>
    </div>

    <a-form-item no-style>
      <a-typography>
        <pre>{{ JSON.stringify(model, null, 2) }}</pre>
      </a-typography>
    </a-form-item>
  </a-form>
</template>
