
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
import { defineComponent } from 'vue'
import  myHeader  from './components/myHeader.vue'
import myHeaderMobile from './components/mobile/myHeaderMobile.vue'
import myMain from './components/myMain.vue'
import myFooter from './components/myFooter.vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'
import  store  from './store' //store存放语言配置




export default defineComponent({
  name:'App',
  components: { myHeader, myMain, myFooter, myHeaderMobile},
  setup() {
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
  background-color: #333;
  color: #b3c0d1;
  /* text-align: center; */
  line-height: 60px;
  --el-header-padding: 0 0px!important
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  /* //text-align: center; */
}
</style>


