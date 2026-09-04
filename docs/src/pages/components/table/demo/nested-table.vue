<docs lang="zh-CN">
展示每行数据更详细的信息。
</docs>

<docs lang="en-US">
Showing more detailed info of every row.
</docs>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { DownOutlined } from '@antdv-next/icons'

interface ExpandedDataType {
  key: string
  date: string
  name: string
  upgradeNum: string
}

interface DataType {
  key: string
  name: string
  platform: string
  version: string
  upgradeNum: number
  creator: string
  createdAt: string
}

const items = [
  { key: '1', label: 'Action 1' },
  { key: '2', label: 'Action 2' },
]

const expandColumns: TableProps['columns'] = [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Status', key: 'state' },
  { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  { title: 'Action', key: 'operation' },
]

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Platform', dataIndex: 'platform', key: 'platform' },
  { title: 'Version', dataIndex: 'version', key: 'version' },
  { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  { title: 'Creator', dataIndex: 'creator', key: 'creator' },
  { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'Action', key: 'operation' },
]

const expandDataSource: ExpandedDataType[] = Array.from({ length: 3 }).map((_, i) => ({
  key: String(i),
  date: '2014-12-24 23:12:00',
  name: 'This is production name',
  upgradeNum: 'Upgraded: 56',
}))

const dataSource: DataType[] = Array.from({ length: 3 }).map((_, i) => ({
  key: String(i),
  name: 'Screen',
  platform: 'iOS',
  version: '10.3.4.5654',
  upgradeNum: 500,
  creator: 'Jack',
  createdAt: '2014-12-24 23:12:00',
}))

const expandable = {
  defaultExpandedRowKeys: ['0'],
}
</script>

<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :expandable="expandable"
  >
    <template #expandedRowRender>
      <a-table
        :columns="expandColumns"
        :data-source="expandDataSource"
        :pagination="false"
      >
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'state'">
            <a-badge status="success" text="Finished" />
          </template>
          <template v-else-if="column.key === 'operation'">
            <a-space size="medium">
              <a>Pause</a>
              <a>Stop</a>
              <a-dropdown :menu="{ items }">
                <a>
                  More
                  <DownOutlined />
                </a>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </template>
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'operation'">
        <a>Publish</a>
      </template>
    </template>
  </a-table>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :expandable="expandable"
    size="medium"
  >
    <template #expandedRowRender>
      <a-table
        :columns="expandColumns"
        :data-source="expandDataSource"
        :pagination="false"
      >
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'state'">
            <a-badge status="success" text="Finished" />
          </template>
          <template v-else-if="column.key === 'operation'">
            <a-space size="medium">
              <a>Pause</a>
              <a>Stop</a>
              <a-dropdown :menu="{ items }">
                <a>
                  More
                  <DownOutlined />
                </a>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </template>
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'operation'">
        <a>Publish</a>
      </template>
    </template>
  </a-table>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :expandable="expandable"
    size="small"
  >
    <template #expandedRowRender>
      <a-table
        :columns="expandColumns"
        :data-source="expandDataSource"
        :pagination="false"
      >
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'state'">
            <a-badge status="success" text="Finished" />
          </template>
          <template v-else-if="column.key === 'operation'">
            <a-space size="medium">
              <a>Pause</a>
              <a>Stop</a>
              <a-dropdown :menu="{ items }">
                <a>
                  More
                  <DownOutlined />
                </a>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </template>
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'operation'">
        <a>Publish</a>
      </template>
    </template>
  </a-table>
</template>
