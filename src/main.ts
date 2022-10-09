import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus' // 引入element-plus
import 'element-plus/dist/index.css' // 引入element-plus的样式
import { VueDapp } from 'vue-dapp'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import i18n from './locales'
import InfiniteScroll from "element-plus"


const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(VueDapp)
app.use(i18n)
app.use(InfiniteScroll)
app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }