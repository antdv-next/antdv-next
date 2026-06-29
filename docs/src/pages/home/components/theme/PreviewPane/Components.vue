<script setup lang="ts">
import type { ButtonProps, ConfigProviderProps } from 'antdv-next'
import type { CSSProperties, VNode } from 'vue'
import {
  AppleFilled,
  DownOutlined,
  FacebookOutlined,
  GoogleOutlined,
  LoadingOutlined,
  MailOutlined,
  MessageOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from '@antdv-next/icons'
import {
  App,
  Avatar,
  AvatarGroup,
  Badge,
  BorderBeam,
  Button,
  Card,
  CheckboxGroup,
  ColorPicker,
  ConfigProvider,
  DatePicker,
  Divider,
  Dropdown,
  Flex,
  Input,
  InputOTP,
  Modal,
  notification,
  Popconfirm,
  Progress,
  QRCode,
  RadioGroup,
  Rate,
  Segmented,
  Select,
  SpaceCompact,
  Spin,
  Steps,
  Switch,
  Tag,
  TypographyText,
  TypographyTitle,
} from 'antdv-next'
import { createStyles } from 'antdv-style'
import { computed, h } from 'vue'
import antdvNextLogo from '@/assets/antdv-next.svg'

interface ComponentsBlockProps {
  config?: ConfigProviderProps
  style?: CSSProperties
  className?: string
  containerClassName?: string
  inherit?: boolean
  isDark?: boolean
}

const props = withDefaults(defineProps<ComponentsBlockProps>(), {
  inherit: false,
  isDark: false,
})

const { _InternalPanelDoNotUseOrYouWillBeFired: InternalPopconfirm } = Popconfirm as any
const { _InternalPanelDoNotUseOrYouWillBeFired: InternalPanel } = notification as any
const { _InternalPanelDoNotUseOrYouWillBeFired: ModalInternalPanel } = Modal as any

const useStyle = createStyles(({ css, token, cssVar }) => {
  return {
    container: css({
      backgroundColor: 'transparent',
      padding: 0,
      border: 'none',
      boxShadow: 'none',
      width: '100%',
    }),
    layoutRow: css({
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      justifyContent: 'center',
      margin: '0 auto',
    }),
    colLeft: css({
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: token.paddingLG,
      '@media (max-width: 768px)': {
        display: 'none',
      },
    }),
    colCenter: css({
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: token.paddingLG,
    }),
    colRight: css({
      width: 320,
      display: 'flex',
      flexDirection: 'column',
      gap: token.paddingLG,
      '@media (max-width: 1200px)': {
        display: 'none',
      },
    }),
    mainCard: css({
      justifyContent: 'center',
      padding: 32,
      borderRadius: 16,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }),
    blockCard: css({
      background: cssVar.colorBgContainer,
      borderRadius: token.borderRadiusLG,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      padding: token.paddingLG,
    }),
    avatarGroup: css({
      marginBlockEnd: 16,
    }),
    selectInput: css({
      flex: '0 0 300px',
    }),
    colorPickerFixed: css({
      flex: 'none',
    }),
    datePickerGrow: css({
      flex: 1,
    }),
    controlsRow: css({
      marginBlockStart: 16,
      paddingInline: 4,
    }),
    stepsWrapper: css({
      marginBlockStart: 16,
    }),
    progressWrapper: css({
      marginBlockStart: 8,
    }),
    flexRow12: css({
      padding: 0,
      display: 'flex',
      gap: 12,
    }),
    blockCardQr: css({
      padding: 6,
      flex: '0 0 auto',
    }),
    blockCardExtraPad: css({
      padding: 6,
      justifyContent: 'center',
      marginBlockEnd: 8,
    }),
    flexCol1: css({
      flex: 1,
    }),
    rateStyle: css({
      marginBlockEnd: 20,
    }),
    popconfirmFull: css({
      width: '100%',
      margin: 0,
    }),
    blockCardSegmented: css({
      padding: 8,
    }),
    avatarSection: css({
      textAlign: 'center',
      position: 'relative',
    }),
    avatarExtra: css({
      backgroundColor: '#fff',
      color: '#666',
    }),
    otpWrapper: css({
      marginBlock: 16,
    }),
    dangerBtn: css({
      '.ant-btn': {
        background: '#fff2f0',
        border: 'none',
      },
    }),
    profileInfo: css({
      flex: 1,
    }),
    profileTitle: css({
      margin: 0,
    }),
    profileHandle: css({
      fontSize: 13,
    }),
    profileDesc: css({
      marginBlock: 8,
      fontSize: 14,
    }),
    profileStats: css({
      fontSize: 13,
    }),
    signupCard: css({
      textAlign: 'center',
      padding: '32px 24px',
    }),
    signupAvatar: css({
      marginBlockEnd: 16,
    }),
    signupText: css({
      display: 'block',
      marginBlockEnd: 24,
      fontSize: 14,
    }),
    signupBtn: css({
      marginBlockEnd: 16,
    }),
    signupDivider: css({
      color: token.colorTextSecondary,
      fontSize: 12,
    }),
  }
})

const { styles } = useStyle()

const selectOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'watermelon', label: 'Watermelon' },
]

const dropdownMenuItems = Array.from({ length: 5 }).map((_, index) => ({
  key: `opt${index}`,
  label: `Option ${index}`,
}))

const checkboxOptions = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
]

const radioOptions = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
]

const badgeList = [
  { status: 'success', text: 'Success' },
  { status: 'error', text: 'Error' },
  { status: 'default', text: 'Default' },
  { status: 'processing', text: 'Processing' },
  { status: 'warning', text: 'Warning' },
]

const tagList: { icon: () => VNode, color: string, label: string }[] = [
  { icon: () => h(TwitterOutlined), color: '#55acee', label: 'Twitter' },
  { icon: () => h(YoutubeOutlined), color: '#cd201f', label: 'Youtube' },
  { icon: () => h(FacebookOutlined), color: '#3b5999', label: 'Facebook' },
]

const avatarGroupList = [
  'https://avatars.githubusercontent.com/u/45655660?v=4',
  'https://avatars.githubusercontent.com/u/71313168?v=4',
  'https://avatars.githubusercontent.com/u/69418751?v=4',
  'https://avatars.githubusercontent.com/u/106022674?v=4',
  'https://avatars.githubusercontent.com/u/18481623?v=4',
  'https://avatars.githubusercontent.com/u/51188676?v=4',
]

const buttonList: (ButtonProps & { label: string })[] = [
  { type: 'primary', label: 'Primary button' },
  { danger: true, label: 'Danger button' },
  { type: 'dashed', variant: 'outlined', shape: 'round', label: 'Outlined button' },
  { danger: true, shape: 'round', label: 'Round button' },
]

const stepsItems = [{ title: 'Finished' }, { title: 'In Process' }, { title: 'Waiting' }]

const mergedConfig = computed<ConfigProviderProps>(() => {
  const { theme, ...restConfig } = props.config || {}
  return {
    ...restConfig,
    theme: {
      ...theme,
      inherit: props.inherit,
    },
  }
})
</script>

<template>
  <ConfigProvider v-bind="mergedConfig">
    <div :class="[containerClassName, styles.container]">
      <App style="width: 100%;">
        <BorderBeam :line-width="2">
          <Card
            :class="[className, styles.mainCard]"
            :styles="{
              root: {
                backgroundColor: isDark ? 'lab(14% 0 0)' : 'transparent',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 12px rgba(0,0,0,.08), 0 12px 32px rgba(0,0,0,.08)',
              },
              body: {
                padding: 0,
              },
            }"
          >
            <div :class="styles.layoutRow">
              <!-- ================= LEFT COLUMN ================= -->
              <div :class="styles.colLeft">
                <div>
                  <Flex vertical gap="middle">
                    <Flex gap="middle">
                      <Input placeholder="antd@email.com" />
                      <Select
                        placeholder="Select one"
                        :class="styles.selectInput"
                        mode="multiple"
                        max-tag-count="responsive"
                        :default-value="['apple', 'banana']"
                        :options="selectOptions"
                      />
                    </Flex>
                    <Flex gap="middle">
                      <ColorPicker
                        show-text
                        default-value="#1677ff"
                        :class="styles.colorPickerFixed"
                      />
                      <SpaceCompact>
                        <Button>Dropdown</Button>
                        <Dropdown :menu="{ items: dropdownMenuItems }">
                          <Button>
                            <template #icon>
                              <DownOutlined />
                            </template>
                          </Button>
                        </Dropdown>
                      </SpaceCompact>
                      <DatePicker :class="styles.datePickerGrow" placeholder="Select Date" />
                    </Flex>
                    <Flex align="center" justify="space-between" :class="styles.controlsRow">
                      <CheckboxGroup :options="checkboxOptions" :default-value="['Apple']" />
                      <RadioGroup block :options="radioOptions" default-value="Apple" />
                      <Switch default-checked />
                      <Progress type="circle" :percent="25" :size="20" :show-info="false" />
                    </Flex>

                    <div :class="styles.stepsWrapper">
                      <Steps :current="1" status="error" :items="stepsItems" />
                    </div>
                  </Flex>
                </div>

                <div :class="styles.progressWrapper">
                  <Flex gap="middle" vertical>
                    <Progress :percent="50" status="active" />
                    <Progress :percent="70" status="exception" />
                  </Flex>
                </div>

                <div>
                  <Flex justify="space-between" gap="8">
                    <Badge
                      v-for="badge in badgeList"
                      :key="badge.status"
                      :status="badge.status as any"
                      :text="badge.text"
                    />
                  </Flex>
                </div>

                <div :class="styles.flexRow12">
                  <div :class="[styles.blockCard, styles.blockCardQr]">
                    <QRCode
                      error-level="H"
                      value="http://weixin.qq.com/r/mp/1iYQCM-ESZI2rYtr93PE"
                      :icon="antdvNextLogo"
                    />
                  </div>
                  <div :class="styles.flexCol1">
                    <Flex justify="space-around">
                      <Spin size="middle">
                        <template #indicator>
                          <LoadingOutlined spin />
                        </template>
                      </Spin>
                      <Spin size="middle" />
                      <Rate size="middle" :value="3" :class="styles.rateStyle" />
                    </Flex>
                    <div :class="[styles.blockCard, styles.blockCardExtraPad]">
                      <Flex gap="small" align="center">
                        <Tag
                          v-for="tag in tagList"
                          :key="tag.label"
                          :icon="tag.icon"
                          :color="tag.color"
                        >
                          {{ tag.label }}
                        </Tag>
                      </Flex>
                    </div>
                    <InternalPopconfirm
                      title="Are you OK?"
                      placement="topRight"
                      :class="styles.popconfirmFull"
                    />
                  </div>
                </div>

                <div :class="[styles.blockCard, styles.blockCardSegmented]">
                  <Segmented block :options="['1D', '7D', '1M', '1Y', 'All']" />
                  <Segmented
                    :styles="{
                      root: {
                        marginBlockStart: '8px',
                      },
                    }"
                    block
                    :options="[
                      { label: 'Chats', value: 'Chats', icon: () => h(MessageOutlined) },
                      { label: 'Emails', value: 'Emails', icon: () => h(MailOutlined) },
                    ]"
                  />
                </div>
              </div>

              <!-- ================= CENTER COLUMN ================= -->
              <div :class="styles.colCenter">
                <div :class="styles.avatarSection">
                  <AvatarGroup :class="styles.avatarGroup">
                    <Avatar
                      v-for="src in avatarGroupList"
                      :key="src"
                      :size="46"
                      :src="src"
                    />
                    <Avatar :size="46" :class="styles.avatarExtra">
                      +5
                    </Avatar>
                  </AvatarGroup>
                  <TypographyTitle :level="5">
                    Verify account
                  </TypographyTitle>
                  <TypographyText type="secondary">
                    We've sent a code to a****@gmail.com
                  </TypographyText>

                  <div :class="styles.otpWrapper">
                    <InputOTP size="large" :length="6" default-value="4320" />
                  </div>
                  <TypographyText type="secondary">
                    Didn't receive a code? <a>Resend</a>
                  </TypographyText>
                </div>

                <Flex gap="large" vertical>
                  <Flex gap="middle" justify="center">
                    <Button
                      v-for="(btn, idx) in buttonList.slice(0, 2)"
                      :key="idx"
                      :type="btn.type"
                      :danger="btn.danger"
                    >
                      {{ btn.label }}
                    </Button>
                  </Flex>
                  <Flex gap="middle" justify="center">
                    <Button
                      v-for="(btn, idx) in buttonList.slice(-2)"
                      :key="idx"
                      :type="btn.type"
                      :danger="btn.danger"
                      :variant="btn.variant"
                      :shape="btn.shape"
                    >
                      {{ btn.label }}
                    </Button>
                  </Flex>
                </Flex>

                <div :class="styles.blockCard">
                  <Flex align="flex-start" gap="middle">
                    <Avatar
                      shape="square"
                      :size="60"
                      :src="antdvNextLogo"
                    />
                    <div :class="styles.profileInfo">
                      <TypographyTitle :level="5" :class="styles.profileTitle">
                        Antdv Next
                      </TypographyTitle>
                      <TypographyText type="secondary" :class="styles.profileHandle">
                        @antdv-next
                      </TypographyText>
                      <p :class="styles.profileDesc">
                        Building the future of UI for web & mobile.
                      </p>
                    </div>
                  </Flex>
                </div>

                <InternalPanel
                  :styles="{ root: { width: '100%' } }"
                  title="Antdv Next"
                  description="An enterprise-class design system for building modern, intelligent, and delightful user experiences."
                  type="success"
                />
              </div>

              <!-- ================= RIGHT COLUMN ================= -->
              <div :class="styles.colRight">
                <div :class="[styles.blockCard, styles.signupCard]">
                  <Avatar
                    :size="50"
                    src="https://avatars.githubusercontent.com/u/59312002?v=4"
                    :class="styles.signupAvatar"
                  />
                  <TypographyTitle :level="4">
                    Create an account
                  </TypographyTitle>
                  <TypographyText type="secondary" :class="styles.signupText">
                    Start your free 7-day trial. No credit card required.
                  </TypographyText>
                  <Button type="primary" block size="large" :class="styles.signupBtn">
                    Get Started
                  </Button>
                  <Divider :class="styles.signupDivider">
                    OR
                  </Divider>
                  <Flex vertical gap="small">
                    <Button block size="large">
                      <template #icon>
                        <GoogleOutlined />
                      </template>
                      Continue with Google
                    </Button>
                    <Button block size="large">
                      <template #icon>
                        <AppleFilled />
                      </template>
                      Continue with Apple
                    </Button>
                  </Flex>
                </div>

                <ModalInternalPanel title="Antdv Next">
                  <div>
                    Antdv Next use CSS-in-JS technology to provide dynamic & mix theme ability.
                  </div>
                </ModalInternalPanel>
              </div>
            </div>
          </Card>
        </BorderBeam>
      </App>
    </div>
  </ConfigProvider>
</template>
