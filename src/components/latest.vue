<template>
  <div infinite-scroll-distance="1" v-infinite-scroll="load">
  <el-card class = "opus-card"  style="overflow: auto" v-for="o in count" :key="o">
            <el-skeleton style="--el-skeleton-circle-size: 75px">
  <template #template>
    <el-skeleton-item variant="circle" />
  </template>
</el-skeleton>
        <el-skeleton :rows="5" animated />
        </el-card>
      </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const count = ref(0)
const load = () => {
count.value += 2
}
</script>
<style scoped>
.opus-card{
  text-align: left;
  line-height: 2em;
  padding: 2em;
}
</style>