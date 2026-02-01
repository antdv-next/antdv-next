import iconsPkg from '@antdv-next/icons/package.json'
import sdk from '@stackblitz/sdk'
import vitePluginVuePkg from '@vitejs/plugin-vue/package.json'
import vueTsconfigPkg from '@vue/tsconfig/package.json'
import dayjsPkg from 'dayjs/package.json'
import typescriptPkg from 'typescript/package.json'
import vueTscPkg from 'vue-tsc/package.json'
import vuePkg from 'vue/package.json'
import antdvPkg from '../../../../../packages/antdv-next/package.json'

function genFilesMap(title: string, code: string) {
  return {
    'package.json': JSON.stringify({
      name: 'antdv-next-demo',
      version: antdvPkg.version,
      private: true,
      dependencies: {
        '@antdv-next/icons': iconsPkg.version,
        'antdv-next': antdvPkg.version,
        'dayjs': `^${dayjsPkg.version}`,
        'vue': `^${vuePkg.version}`,
      },
      devDependencies: {
        '@vitejs/plugin-vue': `^${vitePluginVuePkg.version}`,
        '@vue/tsconfig': `^${vueTsconfigPkg.version}`,
        'typescript': `^${typescriptPkg.version}`,
        'vite': `^7.3.1`,
        'vue-tsc': `^${vueTscPkg.version}`,
      },
      scripts: {
        dev: 'vite',
        build: 'vue-tsc && vite build',
        preview: 'vite preview',
      },
    }, null, 2),
    'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`,
    'vite.config.ts': `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
})`,
    'src/main.ts': `import { createApp } from 'vue';
import App from './App.vue';
import antd from 'antdv-next';
import 'antdv-next/dist/reset.css';

const app = createApp(App);
app.use(antd);
app.mount('#app');`,
    'src/Demo.vue': code,
    'src/App.vue': `<script setup lang="ts">
import Demo from './Demo.vue'
</script>

<template>
  <div class="container">
    <Demo />
  </div>
</template>

<style scoped>
.container {
  padding: 24px;
}
</style>`,
    'src/vite-env.d.ts': '/// <reference types="vite/client" />',
    'tsconfig.json': JSON.stringify({
      extends: '@vue/tsconfig/tsconfig.dom.json',
      compilerOptions: {
        baseUrl: '.',
        types: ['vite/client', '@antdv-next/global'],
        strict: true,
        noFallthroughCasesInSwitch: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        erasableSyntaxOnly: true,
        noUncheckedSideEffectImports: true,
      },
      include: ['src/**/*.ts', 'src/**/*.vue'],
    }, null, 2),
  }
}

export function openStackBlitz(
  title: string,
  code: string,
) {
  const files = genFilesMap(title, code)

  sdk.openProject({
    title,
    description: 'Ant Design Vue Next Demo',
    template: 'node',
    files,
  }, {
    openFile: 'src/Demo.vue',
  })
}

export function iframeStackBlitz(
  elementId: string | HTMLElement,
  title: string,
  code: string,
) {
  const files = genFilesMap(title, code)
  return sdk.embedProject(elementId, {
    title,
    description: 'Ant Design Vue Next Demo',
    template: 'node',
    files,
  }, {
    openFile: 'src/Demo.vue',
    showSidebar: false,
    hideNavigation: true,
    hideExplorer: true,
    height: 500,
  })
}
