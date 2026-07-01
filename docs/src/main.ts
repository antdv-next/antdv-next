import antd from 'antdv-next'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import DocHeading from '@/components/docs/heading.vue'
import { router } from '@/routes'
import { setupRouterGuard } from '@/routes/guard'
import App from './App.vue'
import CodeDemo from './components/code-demo'
import ComponentOverview from './components/component-overview/index.vue'
import IconSearch from './components/icon-search/index.vue'
import InstallDependencies from './components/install-dependencies/index.vue'
import StackBlitz from './components/stackblitz/index.vue'
import ComponentTokenTable from './components/token/component-token-table.vue'
import TokenTable from './components/token/token-table.vue'
import './assets/styles/index.css'
import 'antd.css'
import 'uno.css'

const app = createApp(App)
app.use(router)
app.use(antd)
setupRouterGuard(router)
app.use(CodeDemo)
app.component('DocHeading', DocHeading)
app.component('ComponentOverview', ComponentOverview)
app.component('ComponentTokenTable', ComponentTokenTable)
app.component('InstallDependencies', InstallDependencies)
app.component('IconSearch', IconSearch)
app.component('stackblitz', StackBlitz)
app.component('TokenTable', TokenTable)
app.use(createPinia())
app.mount('#app')
