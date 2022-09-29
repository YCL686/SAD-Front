import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus' // 引入element-plus
import 'element-plus/dist/index.css' // 引入element-plus的样式
import { VueDapp } from 'vue-dapp'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(VueDapp)
app.mount('#app')