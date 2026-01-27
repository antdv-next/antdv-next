<script setup lang="ts">
import { FastColor } from '@ant-design/fast-color'
import { theme } from 'antdv-next'
import getAlphaColor from 'antdv-next/theme/util/getAlphaColor'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const { locale } = storeToRefs(useAppStore())
const { token } = theme.useToken()
const background = computed(() => new FastColor(getAlphaColor('#f0f3fa', '#fff'))
  .onBackground(token.value.colorBgContainer)
  .toHexString(),
)
const details = {
  Github: [
    { name: 'Ant Design of React', url: 'https://ant.design/docs/react/introduce-cn' },
    { name: 'Ant Design of Angular', url: 'https://ng.ant.design/docs/introduce/zh' },
  ],
  Community: [
    { name: 'Change Log', url: 'https://github.com/antdv-next/antdv-next/releases' },
    { name: 'Bug Report', url: 'https://github.com/antdv-next/antdv-next/issues' },
  ],
  Links: [
    { name: 'Vue', url: 'https://vuejs.org/' },
    { name: 'Vue Router', url: 'https://router.vuejs.org/' },
    { name: 'Pinia', url: 'https://pinia.vuejs.org/' },
    { name: 'Vite', url: 'https://vitejs.dev/' },
  ],
}
const footerLocales = {
  Github: { 'zh-CN': 'Github', 'en-US': 'Github' },
  Community: { 'zh-CN': '社区', 'en-US': 'Community' },
  Links: { 'zh-CN': '友链', 'en-US': 'Links' },
}
</script>

<template>
  <footer id="footer">
    <div class="footer-wrap">
      <a-row>
        <a-col v-for="(item, key) of details" :key="key" :md="6" :sm="24" :xs="24">
          <div class="footer-center">
            <h2>{{ footerLocales?.[key]?.[locale] }}</h2>
            <template v-for="child in item" :key="child.name">
              <div>
                <a :href="child.url" target="_blank">{{ child.name }}</a>
              </div>
            </template>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="footer-bottom">
      <div class="footer-bottom-container">
        <div style="opacity: 0.4;">
          Made with <span style="color: rgb(255, 255, 255);">❤</span> by
        </div>
        <div style="color: var(--ant-color-text-secondary);">
          Antdv Next Team
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
 footer {
  clear: both;
  font-size: 14px;
  background-color: v-bind('background');
  position: relative;
  z-index: 8;

  .ant-row {
    text-align: center;

    .footer-center {
      display: inline-block;
      text-align: left;

      > h2 {
        font-size: 16px;
        margin: 0 auto 24px;
        font-weight: 500;
        position: relative;

        > .title-icon {
          width: 27px;
          margin-right: 16px;
        }

        > .anticon {
          font-size: 16px;
          position: absolute;
          left: -22px;
          top: 3px;
          color: #aaa;
        }
      }

      > div {
        margin: 12px 0;
      }
    }
  }

  .footer-wrap {
    position: relative;
    padding: 86px 144px 93px 144px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  }

  a {
    color: v-bind('token.colorText');
  }

  h2 {
    color: v-bind('token.colorText');
    & > span {
      color: v-bind('token.colorText');
    }
  }

  .footer-bottom {
    text-align: center;
    box-shadow: inset 0 106px 36px -116px rgba(0, 0, 0, 0.14);

    .footer-bottom-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 0;
      font-size: 14px;
      line-height: 32px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.25);
    }
  }
}
</style>
