<docs lang="zh-CN">
通过封装，实现 Table 始终自动填充容器高度。
</docs>

<docs lang="en-US">
Wrap Table to make it always fill the container height automatically.
</docs>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { Table } from 'antdv-next'
import { defineComponent, h, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'

// ===================== Wrapper =====================
const measureClasses = {
  header: 'measure-header',
  pagination: 'measure-pagination',
}

const tableClasses = {
  header: {
    wrapper: measureClasses.header,
  },
  pagination: {
    root: measureClasses.pagination,
  },
}

const AutoHeightTable = defineComponent<TableProps<any>>(
  (props, { attrs }) => {
    const rootRef = shallowRef<InstanceType<typeof Table>>()
    const scrollY = ref(0)
    const sectionHeight = ref(0)

    const getHeight = (target: string | HTMLElement) => {
      const ele = typeof target === 'string'
        ? rootRef.value?.nativeElement?.querySelector<HTMLElement>(`.${target}`)
        : target

      if (ele) {
        const styles = getComputedStyle(ele)
        const marginTop = Number.parseFloat(styles.marginTop) || 0
        const marginBottom = Number.parseFloat(styles.marginBottom) || 0

        return ele.getBoundingClientRect().height + marginTop + marginBottom
      }

      return 0
    }

    let resizeObserver: ResizeObserver | undefined

    onMounted(() => {
      const element = rootRef.value?.nativeElement
      if (!element)
        return

      const measure = () => {
        const totalHeight = getHeight(element)
        const headerHeight = getHeight(measureClasses.header)
        const paginationHeight = getHeight(measureClasses.pagination)

        scrollY.value = Math.max(0, Math.floor(totalHeight - headerHeight - paginationHeight))
        sectionHeight.value = totalHeight - paginationHeight
      }

      measure()

      resizeObserver = new ResizeObserver(measure)
      resizeObserver.observe(element)
    })

    onBeforeUnmount(() => {
      resizeObserver?.disconnect()
    })

    return () => {
      const { scroll, ...restProps } = props
      return h(Table, {
        ...restProps,
        ...attrs,
        ref: rootRef,
        scroll: { ...scroll, y: scrollY.value },
        style: { height: '100%' },
        styles: {
          section: {
            height: `${sectionHeight.value}px`,
          },
        },
        classes: tableClasses,
      })
    }
  },
  {
    name: 'AutoHeightTable',
    props: ['columns', 'dataSource', 'scroll'] as any,
  },
)

// ==================== Usage ====================

interface DataType {
  key: number
  name: string
  age: number
  address: string
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: '20%',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: '20%',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: '60%',
  },
]

function genData(length: number): DataType[] {
  return Array.from({ length }).map((_, index) => ({
    key: index,
    name: `Edward King ${index}`,
    age: 32 + index,
    address: `London, Park Lane no. ${index}`,
  }))
}

const dataMore = genData(30)
const dataLess = genData(2)

const hasData = ref(true)
</script>

<template>
  <a-flex vertical gap="middle" align="start">
    <a-switch
      v-model:checked="hasData"
      checked-children="More Data"
      un-checked-children="More Data"
    />
    <div
      :style="{
        height: '400px',
        boxSizing: 'border-box',
        background: 'rgba(140, 140, 140, 0.03)',
        padding: '16px',
        alignSelf: 'stretch',
      }"
    >
      <AutoHeightTable :columns="columns" :data-source="hasData ? dataMore : dataLess" />
    </div>
  </a-flex>
</template>
