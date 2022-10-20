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
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.min.js'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';


const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(VueDapp)
app.use(i18n)
app.use(InfiniteScroll)
app.use(Antd)
app.component('QuillEditor', QuillEditor)
app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

//当路由进入前
router.beforeEach((to, from , next) => {
  // 每次切换页面时，调用进度条
 NProgress.start();
 // 这个一定要加，没有next()页面不会跳转的
  next();
});
//当路由进入后：关闭进度条
router.afterEach(() => {  
 // 在即将进入新的页面组件前，关闭掉进度条
 NProgress.done()
})