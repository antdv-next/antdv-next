<docs lang="zh-CN">
对于字符型的头像，当字符串较长时，字体大小可以根据头像宽度自动调整。也可使用 `gap` 来设置字符距离左右两侧边界单位像素。
</docs>

<docs lang="en-US">
For letter type Avatar, when the letters are too long to display, the font size can be automatically adjusted according to the width of the Avatar. You can also use `gap` to set the unit distance between left and right sides.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const UserList = ['U', 'Lucy', 'Tom', 'Edward']
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']
const GapList = [4, 3, 2, 1]

const user = ref(UserList[0])
const color = ref(ColorList[0])
const gap = ref(GapList[0])

function changeUser() {
  const index = UserList.indexOf(user.value!)
  user.value = index < UserList.length - 1 ? UserList[index + 1] : UserList[0]
  color.value = index < ColorList.length - 1 ? ColorList[index + 1] : ColorList[0]
}

function changeGap() {
  const index = GapList.indexOf(gap.value!)
  gap.value = index < GapList.length - 1 ? GapList[index + 1] : GapList[0]
}
</script>

<template>
  <div>
    <a-avatar
      :style="{ backgroundColor: color, verticalAlign: 'middle' }"
      size="large"
      :gap="gap"
    >
      {{ user }}
    </a-avatar>
    <a-button
      size="small"
      style="margin: 0 16px; vertical-align: middle;"
      @click="changeUser"
    >
      ChangeUser
    </a-button>
    <a-button
      size="small"
      style="vertical-align: middle;"
      @click="changeGap"
    >
      changeGap
    </a-button>
  </div>
</template>
