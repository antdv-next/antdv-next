<docs lang="zh-CN">
简单的展示。
</docs>

<docs lang="en-US">
Simplest Usage.
</docs>

<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-statistic title="Active Users" :value="112893" />
    </a-col>
    <a-col :span="12">
      <a-statistic title="Account Balance (CNY)" :value="112893" :precision="2" />
      <a-button style="margin: 16px" type="primary">
        Recharge
      </a-button>
    </a-col>
    <a-col :span="12">
      <a-statistic title="Active Users" :value="112893" loading />
    </a-col>
  </a-row>
</template>
