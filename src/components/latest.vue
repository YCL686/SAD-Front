<template>
  <div infinite-scroll-distance="1" v-infinite-scroll="load">

    <el-card class="opus-card" style="overflow: auto" v-for="(opus, index) in pageList" :key="index">
      <el-row>
        <el-col class="opus-header" :span="24">
          <el-image style="width: 4em; height: 4em; border-radius:3em;margin-right: 1em;" :src="opus.avatarUrl"
            :fit="fit" />
          <div class="opus-header-name">
            <span>{{opus.nickName}}</span><br />
            <span>{{opus.characterSign}}</span>
          </div>
        </el-col>
      </el-row>
      <el-divider/>
      <el-row class="opus-content">
        <el-col span="24">{{opus.content}}</el-col>
      </el-row>
      <div v-if="opus.resourceUrls != undefined && opus.resourceUrls != null && opus.resourceUrls.length > 0">
        <el-image v-for="(image, index) in opus.resourceUrls" :key="index" style="width: 100px; height: 100px"
          :src="image" :preview-src-list="opus.resourceUrls" :initial-index="index" fit="cover" />
      </div>
      <el-divider />
      <el-row class="opus-nums">
        <el-col :span="7">
          <el-icon>
            <Pointer />
          </el-icon>
          {{opus.likeNum}}
        </el-col>
        <el-divider direction="vertical" />
        <el-col :span="7">
          <el-icon>
            <ChatDotSquare />
          </el-icon>
          {{opus.replyNum}}
        </el-col>
        <el-divider direction="vertical" />
        <el-col :span="7">
          <el-icon>
            <Star />
          </el-icon>
          {{opus.collectNum}}
        </el-col>
      </el-row>
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
import { Pointer, ChatDotSquare, Star } from '@element-plus/icons-vue'
const count = ref(5)
const loading = ref(true)
const pageList = ref([])
let currentPageList: any = reactive([])
const pageSize = ref(5)
const pageNo = ref(1)

const load = () => {
  loading.value = true;
  count.value = pageList.value.length;
  if (currentPageList.length == 5) {
    pageNo.value++
    getPageOpusList(pageNo.value, pageSize.value)
  }else{
    loading.value = false
  }
}
function getPageOpusList(pageNo: number, pageSize: number) {

  const param = { pageSize: pageSize, pageNo: pageNo, orderType: 0 }
  pageOpusList(param).then((res) => {
    currentPageList = res;
    pageList.value = pageList.value.concat(currentPageList)
    loading.value = false;
  })
}
onMounted(() => {
  getPageOpusList(pageNo.value, pageSize.value)
})
</script>
<style scoped>
.opus-card {
  text-align: left;
  line-height: 30px;
  font-size: 16px;
  padding-left: 10px;
  padding-right: 10px;
}

.opus-header {
  display: flex;
  align-items: center;
  margin-left: 1em;
}

.opus-header-name {}


.opus-content {
  text-indent: 2em
}

.opus-nums {
  text-align: center;
}
</style>