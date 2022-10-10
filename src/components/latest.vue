<template>
  <div infinite-scroll-distance="1" v-infinite-scroll="load">
    
    <el-card class="opus-card" style="overflow: auto" v-for="o in count" :key="o">
      {{o}}
      <el-skeleton :loading="loading" style="--el-skeleton-circle-size: 75px">
        <template #template>
          <el-skeleton-item variant="circle" />
        </template>
      <template #default>
        
      </template>
      </el-skeleton>
    
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { ref, reactive } from 'vue'
import { pageOpusList } from '../api/opus' //这里引入的就是刚刚添加的接口
const count = ref(5)
const loading = ref(true)
let pageList:any = reactive([])
let currentPageList:any = reactive([])
const pageSize = ref(5)
const pageNo = ref(1)

const load = () => {
  count.value = pageList.length;
  if(currentPageList.length == 5){
  pageNo.value++
  getPageOpusList(pageNo.value, pageSize.value)
  }
}
function getPageOpusList(pageNo: number, pageSize: number) {
  
  const param = { pageSize: pageSize, pageNo: pageNo }
  pageOpusList(param).then((res) => {
    currentPageList = res;
    console.log(currentPageList)
    pageList = pageList.concat(currentPageList)
  })
}
onMounted(() => {
  getPageOpusList(pageNo.value, pageSize.value)
})
</script>
<style scoped>
.opus-card {
  text-align: left;
  line-height: 2em;
  padding: 2em;
}
</style>