<script setup lang="ts">
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@antdv-next/icons'
import dayjs from 'dayjs'
import { computed, onMounted, onUnmounted, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const orderNo = computed(() => route.query.out_trade_no as string || '')
const pageStatus = shallowRef<'loading' | 'success' | 'pending' | 'fail'>('loading')
const orderInfo = shallowRef<{
  orderNo: string
  amount: string
  subject: string
  status: string
  paidAt: string | null
  createdAt: string
}>()

const submitUrl = 'https://test-pay.lingyu.org.cn'
let pollTimer: ReturnType<typeof setTimeout> | null = null
let pollCount = 0
const MAX_POLL = 10

async function queryOrder() {
  if (!orderNo.value) {
    pageStatus.value = 'fail'
    return
  }
  try {
    const res = await fetch(`${submitUrl}/pay/alipay/query?orderNo=${orderNo.value}`)
    const { code, data } = await res.json()
    if (code === 0 && data) {
      orderInfo.value = data
      if (data.status === 'paid') {
        pageStatus.value = 'success'
        stopPoll()
      }
      else if (data.status === 'pending') {
        pageStatus.value = 'pending'
        startPoll()
      }
      else {
        pageStatus.value = 'fail'
        stopPoll()
      }
    }
    else {
      pageStatus.value = 'fail'
    }
  }
  catch {
    pageStatus.value = 'fail'
  }
}

function startPoll() {
  if (pollCount >= MAX_POLL) {
    return
  }
  pollTimer = setTimeout(async () => {
    pollCount++
    await queryOrder()
  }, 3000)
}

function stopPoll() {
  if (pollTimer) {
    clearTimeout(pollTimer)
    pollTimer = null
  }
}

function goBack() {
  router.push('/sponsor')
}

onMounted(() => {
  queryOrder()
})

onUnmounted(() => {
  stopPoll()
})
</script>

<template>
  <div class="success-page">
    <div class="success-container">
      <div class="result-card">
        <!-- Loading / Pending -->
        <template v-if="pageStatus === 'loading' || pageStatus === 'pending'">
          <div class="result-icon loading">
            <LoadingOutlined />
          </div>
          <h1 class="result-title">
            {{ pageStatus === 'loading' ? '正在查询支付结果...' : '等待支付确认中...' }}
          </h1>
          <p class="result-desc">
            {{ pageStatus === 'loading' ? '请稍候，我们正在确认您的支付状态' : '支付结果还在路上，正在自动刷新~' }}
          </p>

          <div v-if="orderInfo" class="order-info">
            <div class="order-row">
              <span class="order-label">订单编号</span>
              <span class="order-value">{{ orderInfo.orderNo }}</span>
            </div>
            <div class="order-row">
              <span class="order-label">赞助金额</span>
              <span class="order-value">¥{{ orderInfo.amount }}</span>
            </div>
            <div class="order-row">
              <span class="order-label">订单状态</span>
              <span class="order-value">
                <a-tag color="processing">待支付</a-tag>
              </span>
            </div>
          </div>

          <div v-if="pageStatus === 'pending'" class="result-actions">
            <a-button type="primary" size="large" class="action-btn" @click="goBack">
              返回赞助页
            </a-button>
          </div>
        </template>

        <!-- Success -->
        <template v-if="pageStatus === 'success'">
          <div class="result-icon success">
            <CheckCircleOutlined />
          </div>
          <h1 class="result-title">
            感谢您的赞助！
          </h1>
          <p class="result-desc">
            您的支持是我们前进的最大动力，每一份心意我们都铭记于心~
          </p>

          <div v-if="orderInfo" class="order-info">
            <div class="order-row">
              <span class="order-label">订单编号</span>
              <span class="order-value">{{ orderInfo.orderNo }}</span>
            </div>
            <div class="order-row">
              <span class="order-label">赞助金额</span>
              <span class="order-value highlight">¥{{ orderInfo.amount }}</span>
            </div>
            <div v-if="orderInfo.paidAt" class="order-row">
              <span class="order-label">支付时间</span>
              <span class="order-value">{{ dayjs(orderInfo.paidAt).format('YYYY-MM-DD HH:MM:ss') }}</span>
            </div>
          </div>

          <div class="result-actions">
            <a-button type="primary" size="large" class="action-btn" @click="goBack">
              返回赞助页
            </a-button>
          </div>
        </template>

        <!-- Fail -->
        <template v-if="pageStatus === 'fail'">
          <div class="result-icon fail">
            <CloseCircleOutlined />
          </div>
          <h1 class="result-title">
            支付结果确认中
          </h1>
          <p class="result-desc">
            暂未查询到支付结果，可能存在网络延迟，请稍后再试~
          </p>

          <div class="result-actions">
            <a-space :size="16">
              <a-button size="large" class="action-btn" @click="queryOrder">
                重新查询
              </a-button>
              <a-button type="primary" size="large" class="action-btn" @click="goBack">
                返回赞助页
              </a-button>
            </a-space>
          </div>
        </template>
      </div>

      <div class="success-footer">
        <p>Antdv Next. 全面保障支付安全及财务合规性。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-page {
  padding: 48px 24px;
  min-height: calc(100vh - var(--ant-doc-header-height));
  background: var(--ant-color-bg-layout);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.success-container {
  max-width: 560px;
  width: 100%;
  margin-top: 48px;
}

.result-card {
  background: var(--ant-color-bg-container);
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--ant-color-border-secondary);
  padding: 48px 32px;
  text-align: center;
}

.result-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.result-icon.success {
  color: #52c41a;
}

.result-icon.fail {
  color: #ff4d4f;
}

.result-icon.loading {
  color: var(--ant-color-primary);
}

.result-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--ant-color-text);
  margin: 0 0 12px;
}

.result-desc {
  font-size: 15px;
  color: var(--ant-color-text-secondary);
  margin: 0 0 32px;
  line-height: 1.6;
}

.order-info {
  background: var(--ant-color-fill-quaternary);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 32px;
  text-align: left;
}

.order-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.order-row + .order-row {
  border-top: 1px solid var(--ant-color-border-secondary);
}

.order-label {
  font-size: 14px;
  color: var(--ant-color-text-secondary);
}

.order-value {
  font-size: 14px;
  color: var(--ant-color-text);
  font-weight: 500;
}

.order-value.highlight {
  font-size: 18px;
  font-weight: 700;
  color: #52c41a;
}

.result-actions {
  margin-top: 8px;
}

.action-btn {
  height: 44px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  min-width: 140px;
}

.success-footer {
  text-align: center;
  margin-top: 40px;
  color: var(--ant-color-text-quaternary);
  font-size: 13px;
}

.success-footer p {
  margin: 0;
}

@media (max-width: 768px) {
  .success-page {
    padding: 20px 12px;
  }

  .success-container {
    margin-top: 24px;
  }

  .result-card {
    padding: 32px 20px;
    border-radius: 16px;
  }

  .result-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .result-title {
    font-size: 22px;
  }

  .result-desc {
    font-size: 14px;
    margin-bottom: 24px;
  }

  .order-info {
    padding: 14px 16px;
    border-radius: 12px;
  }

  .action-btn {
    min-width: 120px;
  }
}
</style>
