<template>
    <el-carousel  :interval="4000"  height="150px">
    <el-carousel-item  trigger="click" v-for="item in imgList" :key="item">
      <img style="width: 100%;" :src="item" alt=""/>
      <div class="carousel-mask">
      <p style="text-align: left;color:aliceblue; width: 100%; height: 100%;">测试描述文字</p>
    </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script lang="ts" setup>
  const imgList = ["https://img1.baidu.com/it/u=3009731526,373851691&fm=253&fmt=auto&app=138&f=JPEG",
                   "https://img2.baidu.com/it/u=3596352791,3086982929&fm=253&fmt=auto&app=120&f=JPEG",
                   "https://img1.baidu.com/it/u=2214465636,2130809688&fm=253&fmt=auto&app=138&f=JPEG",
                   "https://img1.baidu.com/it/u=1822663465,2904205942&fm=253&fmt=auto&app=138&f=JPEG",
                   "https://img2.baidu.com/it/u=1893470775,4143435497&fm=253&fmt=auto&app=138&f=JPEG"]
</script>

<style scoped>
.carousel-mask{
  width: 100%;
  height: 40%;
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