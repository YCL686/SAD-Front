<template>
    <el-carousel  :interval="4000"  height="150px">
    <el-carousel-item  trigger="click" v-for="item in 4" :key="item">
      <h3 text="2xl" justify="center">{{ item }}号广告位招租</h3>
    </el-carousel-item>
  </el-carousel>
</template>

<style scoped>
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
</style>