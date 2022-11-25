<template>
    <a-spin style="background: linear-gradient(90deg, rgba(190, 190, 190, 0.2) 25%, rgba(129, 129, 129, 0.24) 37%, rgba(190, 190, 190, 0.2) 63%);" :spinning="loading">
    <el-carousel :interval="4000"  height="150px">
    <el-carousel-item @click="openLink(item.link)"  trigger="click" v-for="item in list" :key="item">
      <img style="width: 100%;height:150px;cursor: pointer;" :src="item.resourceUrl" alt=""/>
      <div  class="carousel-mask">
      <p style="text-align: left;color:aliceblue; width: 100%; height: 100%;padding-left: 20px; font-size:16px">{{item.label}}</p>
    </div>
    </el-carousel-item>
  </el-carousel>
</a-spin>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue'
import { getAdList } from "../api/ad";
  const list = ref([])
  const loading = ref(true)

  const getAdListFunction = () =>{
    getAdList().then(res=>{
      list.value = res
      loading.value = false
    })
  }

  const openLink = (link:string) => {
    window.open(link, "target_blank")
  }

  onMounted(() =>{
    getAdListFunction()
  })
</script>

<style scoped>
.carousel-mask{
  width: 100%;
  height: 30%;
  position: absolute;
  opacity: 0.5;
  bottom: 0;
  background: linear-gradient(to top, #000 50%, rgba(255, 255, 255, 0) 100%); /* 标准的语法 */ 
}
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-carousel{
  --el-carousel-indicator-width: 5px;
  --el-carousel-indicator-height: 5px
}
</style>

