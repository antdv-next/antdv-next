<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    'root': '根元素，包含字体大小、背景色、圆角、滚动条颜色等表格容器的基础样式',
    'section': '容器元素，包含清除浮动、最大宽度、滚动条背景等表格包装容器样式',
    'header.wrapper': '头部容器元素，包含表头的布局和容器样式',
    'header.row': '头部行元素，包含表头行的布局和样式',
    'header.cell': '头部单元格元素，包含相对定位、内边距、文字换行、背景色、文字颜色、字体权重等表头单元格样式',
    'title': '标题元素，包含表格标题的样式和布局',
    'body.wrapper': '主体容器元素，包含表格主体的布局和容器样式',
    'body.row': '主体行元素，包含数据行的悬浮效果、选中状态、展开状态等交互样式',
    'body.cell': '主体单元格元素，包含相对定位、内边距、文字换行等数据单元格的基础样式',
    'footer': '底部元素，包含表格底部的背景色、文字颜色等样式',
    'content': '内容元素，包含表格内容区域的样式和布局',
    'pagination.root': '分页根元素，包含分页组件的基础样式和布局',
    'pagination.item': '分页单项元素，包含分页项的样式和交互效果',
  },
  en: {
    'root': 'Root element with font-size, background, border-radius, scrollbar-color and other basic table container styles',
    'section': 'Container element with clear-fix, max-width, scrollbar background and other table wrapper styles',
    'header.wrapper': 'Header wrapper element with table header layout and container styles',
    'header.row': 'Header row element with table header row layout and styling',
    'header.cell': 'Header cell element with relative positioning, padding, word-wrap, background, text color, font-weight and other header cell styles',
    'title': 'Title element with table title styling and layout',
    'body.wrapper': 'Body wrapper element with table body layout and container styles',
    'body.row': 'Body row element with hover effects, selected states, expanded states and other interactive row styles',
    'body.cell': 'Body cell element with relative positioning, padding, word-wrap and other basic data cell styles',
    'footer': 'Footer element with table footer background color, text color and other footer styles',
    'content': 'Content element with table content area styling and layout',
    'pagination.root': 'Pagination root element with pagination component basic styles and layout',
    'pagination.item': 'Pagination item element with pagination item styling and interactive effects',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root },
  { name: 'title', desc: locale.value.title },
  { name: 'content', desc: locale.value.content },
  { name: 'header.wrapper', desc: locale.value['header.wrapper'] },
  { name: 'header.row', desc: locale.value['header.row'] },
  { name: 'header.cell', desc: locale.value['header.cell'] },
  { name: 'section', desc: locale.value.section },
  { name: 'body.wrapper', desc: locale.value['body.wrapper'] },
  { name: 'body.row', desc: locale.value['body.row'] },
  { name: 'body.cell', desc: locale.value['body.cell'] },
  { name: 'footer', desc: locale.value.footer },
  { name: 'pagination.root', desc: locale.value['pagination.root'] },
  { name: 'pagination.item', desc: locale.value['pagination.item'] },
])

const columns = [
  {
    title: 'Personal Info',
    children: [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age' },
    ],
  },
  { title: 'Address', dataIndex: 'address' },
]

const data = [
  { key: '1', name: 'thinkasany', age: 24, address: 'New York No. 1 Lake Park' },
  { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: '3', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park' },
  { key: '4', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park' },
  { key: '5', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park' },
  { key: '6', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park' },
]
</script>

<template>
  <SemanticPreview
    component-name="Table"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-table
        bordered
        :style="{ width: '100%' }"
        :columns="columns"
        :data-source="data"
        size="middle"
        :pagination="{ pageSize: 3 }"
        :classes="classes"
      >
        <template #title>
          table title
        </template>
        <template #footer>
          table footer
        </template>
      </a-table>
    </template>
  </SemanticPreview>
</template>
