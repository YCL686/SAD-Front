
<template>
    <el-container direction="vertical">
      <el-header>
        <my-header v-if="!data.isMobile"></my-header>
        <my-header-mobile v-else></my-header-mobile>
      </el-header>
      <el-main>
        <my-main></my-main>
      </el-main>
      <my-footer v-if="!data.isMobile"></my-footer>
    </el-container>

</template>

<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { defineComponent, onMounted } from 'vue'
import  myHeader  from './components/myHeader.vue'
import myHeaderMobile from './components/mobile/myHeaderMobile.vue'
import myMain from './components/myMain.vue'
import myFooter from './components/myFooter.vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'
import  store  from './store' //store存放语言配置
import {getDotCount} from './api/user'




export default defineComponent({
  name:'App',
  components: { myHeader, myMain, myFooter, myHeaderMobile},
  setup() {

    onMounted(() => {
      getDotCount().then(res => {
        store.dispatch('setUnreadMessageCount', res.unreadMessageCount)
        store.dispatch('setUnfinishedDailyTaskCount', res.unfinishedDailyTaskCount)
      })
    })

    return{
      data: store.state
    }
  }
})

</script>

<style>
#app {
  padding: 0px;
  text-align: left;
}
html,
body,
#app,
.el-container {
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px!important;
  /*外部间距也是如此设置*/
  margin: 0px;
  /*统一设置高度为100%*/
  height: 100%;
  width: 100%;
  max-width: 2888px;
}

.el-header,
.el-footer {
  background-color: var(--theme_header_bg_color);
  color: var(--theme_header_text_color);
  /* text-align: center; */
  line-height: 60px;
  --el-header-padding: 0 0px!important
}

.el-main {
  --el-main-padding: 3px!important;
  background-color: var(--theme_bg_color);
  color: #333;
  /* //text-align: center; */
}

:root {
  /* 背景色 */
  --theme_bg_color: #e9eef3;
  --theme_header_bg_color: #778899;
  --theme_header_text_color: #b3c0d1;
  --theme_header_active_bg_color: #7788ff;
  --theme_header_active_text_color: #1890ff;
  /* 按钮颜色 */
  --theme_button_color: #1890ff;
  --theme_card_bg_color: #fff;
  --theme_card_text_color: rgba(0, 0, 0, 0.45);
  --theme_card_action_text_color: rgba(0, 0, 0, 0.45);
  --theme_divider_color: rgba(0, 0, 0, 0.85);
  --theme_a_modal_bg_color: #fff;
  --theme_a_modal_text_color: rgba(0, 0, 0, 0.85)
}
</style>


