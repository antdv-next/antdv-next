<script setup lang="ts">
import type { ConfigProviderProps, MenuProps, TableColumnsType } from 'antdv-next'
import { FastColor } from '@ant-design/fast-color'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BellOutlined,
  ColumnHeightOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  FolderOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  SortAscendingOutlined,
} from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import {
  App,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  ConfigProvider,
  Flex,
  Input,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutSider,
  Menu,
  Row,
  Segmented,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  theme,
  Typography,
} from 'antdv-next'
import { createStyles } from 'antdv-style'
import { computed, h, markRaw } from 'vue'

// Props
const props = withDefaults(defineProps<{
  class?: string
  config?: ConfigProviderProps
  style?: any
  activeTheme?: any
}>(), {
  class: undefined,
  config: undefined,
  style: undefined,
  activeTheme: undefined,
})

// ============================= Style =============================
const useStyles = createStyles(({ css, cssVar }) => {
  const demo = css({
    overflow: 'hidden',
    background: 'rgba(240, 242, 245, 0.25)',
    backdropFilter: 'blur(50px)',
    boxShadow: '0 2px 10px 2px rgba(0, 0, 0, 0.1)',
    transition: `all ${cssVar.motionDurationSlow}`,
  })

  return {
    demo,

    otherDemo: css({
      [`&.${demo}`]: {
        backdropFilter: 'blur(10px)',
        background: 'rgba(247, 247, 247, 0.5)',
      },
    }),

    darkDemo: css({
      [`&.${demo}`]: {
        background: '#000',
      },
    }),

    menu: css({
      marginInlineStart: 'auto',
    }),

    header: css({
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${cssVar.colorSplit}`,
      paddingInline: `${cssVar.paddingLG} !important`,
      height: `calc(${cssVar.controlHeightLG} * 1.2)`,
      lineHeight: `calc(${cssVar.controlHeightLG} * 1.2)`,
    }),

    headerDark: css({
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    }),

    avatar: css({
      width: 28,
      height: 28,
      borderRadius: '100%',
      backgroundSize: '70%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      boxShadow: '0 0 2px rgba(0, 0, 0, 0.2)',
    }),

    avatarDark: css({
      background: 'rgba(200, 200, 200, 0.3)',
    }),

    logo: css({
      display: 'flex',
      alignItems: 'center',
      columnGap: cssVar.padding,

      'h1': {
        fontWeight: 400,
        fontSize: cssVar.fontSizeLG,
        lineHeight: 1.5,
      },
    }),

    logoImg: css({
      width: 30,
      height: 30,
      overflow: 'hidden',

      'img': {
        width: 30,
        height: 30,
        verticalAlign: 'top',
      },
    }),

    transBg: css({
      background: 'transparent !important',
    }),

    dashboardShell: css({
      width: '100%',
      minHeight: 480,
      overflow: 'hidden',
      transition: `all ${cssVar.motionDurationSlow}`,

      '.ant-card': {
        height: '100%',
      },

      '.ant-card-body': {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      },
    }),

    dashboardToolbar: css({
      marginBlockEnd: cssVar.marginMD,
    }),

    dashboardTabs: css({
      padding: 3,
      borderRadius: 999,

      '.ant-segmented-item': {
        minWidth: 96,
        borderRadius: 999,
        fontWeight: 600,
      },

      '.ant-segmented-thumb': {
        borderRadius: 999,
      },
    }),

    dashboardTabsDark: css({
      background: 'rgba(255, 255, 255, 0.14)',
      backdropFilter: 'blur(16px)',
      boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.16)',
      '.ant-segmented-thumb': {
        background: 'rgba(255, 255, 255, 0.96)',
        boxShadow: '0 6px 18px rgba(0,0,0,0.24)',
      },
      '.ant-segmented-item': {
        color: 'rgba(255, 255, 255, 0.78)',
        '&:not(.ant-segmented-item-selected):not(.ant-segmented-item-disabled):hover': {
          color: '#fff',
          background: 'rgba(255, 255, 255, 0.08)',
        },
      },
      '.ant-segmented-item-selected': {
        color: cssVar.colorText,
      },
    }),

    dashboardStatValue: css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: cssVar.marginSM,
    }),

    dashboardStatTrend: css({
      marginInlineStart: 'auto',
      border: 0,
      fontWeight: 600,
    }),

    dashboardPanelTitle: css({
      margin: '0 !important',
    }),

    dashboardKpiGrid: css({
      marginBlockEnd: cssVar.marginMD,
    }),

    dashboardTableCard: css({
      marginBlockStart: cssVar.marginMD,
    }),

    dashboardTableActions: css({
      marginBlock: cssVar.marginMD,
    }),

    dashboardEmployee: css({
      minWidth: 0,
    }),

    dashboardEmployeeMeta: css({
      lineHeight: 1.3,
    }),
  }
})

const { styles } = useStyles()

// ========================== Menu Config ==========================
const subMenuItems = [
  { key: 'Design Values', label: 'Design Values' },
  { key: 'Global Styles', label: 'Global Styles' },
  { key: 'Themes', label: 'Themes' },
  { key: 'DesignPatterns', label: 'Design Patterns' },
]

const sideMenuItems: MenuProps['items'] = [
  {
    key: 'Design',
    label: 'Design',
    icon: markRaw(() => h(FolderOutlined)),
    children: subMenuItems,
  },
  {
    key: 'Development',
    label: 'Development',
    icon: markRaw(() => h(FolderOutlined)),
  },
]

// ========================== Logo Color Filter ==========================
const DEFAULT_COLOR = '#1677FF'

function normalize(value: number) {
  return value / 255
}

function rgbToColorMatrix(color: string) {
  const rgb = new FastColor(color).toRgb()
  const { r, g, b } = rgb

  const invertValue = normalize(r) * 100
  const sepiaValue = 100
  const saturateValue = Math.max(normalize(r), normalize(g), normalize(b)) * 10000
  const hueRotateValue
    = ((Math.atan2(
      Math.sqrt(3) * (normalize(g) - normalize(b)),
      2 * normalize(r) - normalize(g) - normalize(b),
    )
    * 180)
  / Math.PI
  + 360)
% 360

  return `invert(${invertValue}%) sepia(${sepiaValue}%) saturate(${saturateValue}%) hue-rotate(${hueRotateValue}deg)`
}

// ========================== KPI Data ==========================
const dashboardKpis = [
  { title: 'Revenue', value: 228441, prefix: 'US$', trend: 3.3, status: 'success' as const },
  { title: 'Expenses', value: 25108, prefix: 'US$', trend: 3.3, status: 'error' as const },
  { title: 'Sales', value: 458, prefix: '', trend: 3.3, status: 'success' as const },
  { title: 'Profit', value: 203133, prefix: 'US$', trend: 4.1, status: 'success' as const },
]

// ========================== Employee Data ==========================
interface EmployeeRecord {
  key: string
  id: string
  avatar: string
  email: string
  member: string
  role: string
  type: string
}

const employeeData: EmployeeRecord[] = [
  {
    key: '1',
    id: '#4586936',
    avatar: 'linear-gradient(135deg, #69c0ff, #9254de)',
    email: 'alex@acme.com',
    member: 'Alex Turner',
    role: 'Product Manager',
    type: 'Employee',
  },
  {
    key: '2',
    id: '#4586937',
    avatar: 'linear-gradient(135deg, #ffadd2, #eb2f96)',
    email: 'emma@acme.com',
    member: 'Emma Davis',
    role: 'Senior Designer',
    type: 'Employee',
  },
  {
    key: '3',
    id: '#4586933',
    avatar: 'linear-gradient(135deg, #b5f5ec, #1677ff)',
    email: 'john@acme.com',
    member: 'John Smith',
    role: 'Chief Technology Officer',
    type: 'Employee',
  },
  {
    key: '4',
    id: '#4586932',
    avatar: 'linear-gradient(135deg, #d3f261, #5cdbd3)',
    email: 'kate@acme.com',
    member: 'Kate Moore',
    role: 'Chief Executive Officer',
    type: 'Employee',
  },
]

const employeeColumns: TableColumnsType<EmployeeRecord> = [
  {
    title: 'Worker ID',
    dataIndex: 'id',
    width: 150,
  },
  {
    title: 'Member',
    dataIndex: 'member',
  },
  {
    title: 'Role',
    dataIndex: 'role',
  },
  {
    title: 'Worker Type',
    dataIndex: 'type',
    width: 160,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 148,
    align: 'right',
  },
]

// ========================== Dashboard Config ==========================
function getDashboardConfig(config?: ConfigProviderProps): ConfigProviderProps {
  if (!config) {
    return {
      theme: {
        algorithm: theme.defaultAlgorithm,
        inherit: false,
      },
    }
  }

  const { theme: configTheme, ...restConfig } = config as any

  return {
    ...restConfig,
    theme: {
      ...(configTheme || {}),
      inherit: false,
    },
  }
}

// ========================== Theme Detection ==========================
const isDarkTheme = computed(() => {
  const algorithm = (props.config as any)?.theme?.algorithm
  const algorithms = Array.isArray(algorithm) ? algorithm : algorithm ? [algorithm] : []
  return algorithms.includes(theme.darkAlgorithm)
})

const hasDarkBackground = computed(() => {
  return isDarkTheme.value || !!props.activeTheme?.bgImgDark
})

const dashboardConfig = computed(() => getDashboardConfig(props.config))

const { token } = theme.useToken()
const closestColor = DEFAULT_COLOR

const logoColor = computed(() => {
  const primaryColor = token.value.colorPrimary || DEFAULT_COLOR
  const hsv = new FastColor(primaryColor).toHsv()
  hsv.v = Math.min(hsv.v, 0.7)
  return new FastColor(hsv).toHexString()
})

const menuTheme = computed(() => hasDarkBackground.value ? 'dark' : 'light')

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { title: markRaw(h(HomeOutlined)) },
  { title: 'Design', menu: { items: subMenuItems } },
  { title: 'Themes' },
])

// Select options
const selectOptions = [
  {
    value: 'monthly',
    label: 'Monthly',
  },
]

function formatValue(value: number | string, prefix: string) {
  return `${prefix}${Number(value).toLocaleString('en-US')}`
}

// ========================== Computed Classes ==========================
const demoClass = computed(() => clsx(
  styles.demo,
  props.class,
  !hasDarkBackground.value && closestColor !== DEFAULT_COLOR && styles.otherDemo,
  hasDarkBackground.value && styles.darkDemo,
))

const headerClass = computed(() => clsx(
  styles.header,
  hasDarkBackground.value && styles.headerDark,
))
</script>

<template>
  <ConfigProvider v-bind="dashboardConfig">
    <App style="width: 100%;">
      <div
        :class="demoClass"
        :style="props.style"
      >
        <Layout>
          <LayoutHeader :class="headerClass">
            <div :class="styles.logo">
              <div :class="styles.logoImg">
                <img
                  draggable="false"
                  src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                  :style="{
                    filter: closestColor === DEFAULT_COLOR ? undefined : rgbToColorMatrix(logoColor),
                  }"
                  alt="antd logo"
                >
              </div>
              <h1 style="margin: 0;">
                Ant Design
              </h1>
            </div>
            <Flex :class="styles.menu" gap="middle">
              <BellOutlined />
              <QuestionCircleOutlined />
              <div
                :class="styles.avatar"
                :style="{
                  backgroundImage: `url(${props.activeTheme?.icon})`,
                }"
              />
            </Flex>
          </LayoutHeader>
          <Layout has-sider>
            <LayoutSider :theme="menuTheme" :width="200">
              <Menu
                mode="inline"
                :theme="menuTheme"
                :selected-keys="['Themes']"
                :open-keys="['Design']"
                :style="{ height: '100%', borderInlineEnd: '0px' }"
                :items="sideMenuItems"
                :expand-icon="false"
              />
            </LayoutSider>
            <Layout style="padding: 0 24px 24px;">
              <Breadcrumb
                style="margin: 16px 0;"
                :items="breadcrumbItems"
              />
              <LayoutContent>
                <div :class="styles.dashboardShell">
                  <Flex
                    :class="styles.dashboardToolbar"
                    justify="space-between"
                    align="center"
                    wrap
                    gap="middle"
                  >
                    <Segmented
                      :class="[styles.dashboardTabs, hasDarkBackground && styles.dashboardTabsDark]"
                      default-value="Overview"
                      :options="['Overview', 'Sales', 'Expenses']"
                    />
                    <Space>
                      <Button shape="circle">
                        <template #icon>
                          <ReloadOutlined />
                        </template>
                      </Button>
                      <Select
                        value="monthly"
                        style="width: 144px;"
                        :options="selectOptions"
                      />
                      <Button type="primary">
                        <template #icon>
                          <DownloadOutlined />
                        </template>
                        Download
                      </Button>
                    </Space>
                  </Flex>

                  <Row :gutter="[16, 16]" :class="styles.dashboardKpiGrid">
                    <Col v-for="item in dashboardKpis" :key="item.title" :xs="24" :sm="12" :lg="6">
                      <Card>
                        <Typography.Text type="secondary">
                          {{ item.title }}
                        </Typography.Text>
                        <div :class="styles.dashboardStatValue">
                          <Statistic
                            :value="item.value"
                            :formatter="(value) => formatValue(value, item.prefix)"
                          />
                          <Tag
                            :class="styles.dashboardStatTrend"
                            :color="item.status"
                          >
                            <template #icon>
                              <ArrowUpOutlined v-if="item.status === 'success'" />
                              <ArrowDownOutlined v-else />
                            </template>
                            {{ item.trend }}%
                          </Tag>
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  <Card :class="styles.dashboardTableCard">
                    <template #title>
                      <Space>
                        <Typography.Title :level="4" :class="styles.dashboardPanelTitle">
                          All Employees
                        </Typography.Title>
                        <Tag>32</Tag>
                      </Space>
                    </template>
                    <template #extra>
                      <Input placeholder="Search...">
                        <template #prefix>
                          <SearchOutlined />
                        </template>
                      </Input>
                    </template>
                    <Flex
                      :class="styles.dashboardTableActions"
                      justify="space-between"
                      align="center"
                      wrap
                      gap="middle"
                    >
                      <Space wrap>
                        <Button>
                          <template #icon>
                            <FilterOutlined />
                          </template>
                          Filter
                        </Button>
                        <Button>
                          <template #icon>
                            <SortAscendingOutlined />
                          </template>
                          Sort
                        </Button>
                        <Button>
                          <template #icon>
                            <ColumnHeightOutlined />
                          </template>
                          Columns
                        </Button>
                      </Space>
                    </Flex>
                    <Table
                      :columns="employeeColumns"
                      :data-source="employeeData"
                      :pagination="false"
                      size="middle"
                      :scroll="{ x: 900, y: 220 }"
                    >
                      <template #bodyCell="{ column, text, record }">
                        <template v-if="column.dataIndex === 'id'">
                          <Typography.Text strong>
                            {{ text }}
                          </Typography.Text>
                        </template>
                        <template v-else-if="column.dataIndex === 'member'">
                          <Flex align="center" gap="middle" :class="styles.dashboardEmployee">
                            <Avatar :size="40" :style="{ background: record.avatar }" />
                            <div :class="styles.dashboardEmployeeMeta">
                              <Typography.Text strong>
                                {{ record.member }}
                              </Typography.Text>
                              <br>
                              <Typography.Text type="secondary">
                                {{ record.email }}
                              </Typography.Text>
                            </div>
                          </Flex>
                        </template>
                        <template v-else-if="column.key === 'actions'">
                          <Space size="small">
                            <Button shape="circle">
                              <template #icon>
                                <EyeOutlined />
                              </template>
                            </Button>
                            <Button shape="circle">
                              <template #icon>
                                <EditOutlined />
                              </template>
                            </Button>
                            <Button danger shape="circle">
                              <template #icon>
                                <DeleteOutlined />
                              </template>
                            </Button>
                          </Space>
                        </template>
                      </template>
                    </Table>
                  </Card>
                </div>
              </LayoutContent>
            </Layout>
          </Layout>
        </Layout>
      </div>
    </App>
  </ConfigProvider>
</template>
