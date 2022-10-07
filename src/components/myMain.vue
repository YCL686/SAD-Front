<template>
<div id = "main">
    <el-row :gutter="10">
    <el-col ::xs="2" :sm="4" :md="4" :lg="4" :xl="4"><div class="grid-content ep-bg-purple" />
    </el-col>
    <el-col ::xs="20" :sm="16" :md="14" :lg="14" :xl="14">
        <el-carousel indicator-position="none" :interval="4000" type="card" height="200px">
    <el-carousel-item v-for="item in 6" :key="item">
      <h3 text="2xl" justify="center">{{ item }}号广告位招租</h3>
    </el-carousel-item>
  </el-carousel>
    <el-scrollbar>
          <!-- <el-table :data="tableData">
            <el-table-column prop="date" label="Date" width="140" />
            <el-table-column prop="name" label="Name" width="120" />
            <el-table-column prop="address" label="Address" />
          </el-table> -->
          <el-card class="opus-card" v-for="o in 30" :key="o">
              <el-skeleton style="--el-skeleton-circle-size: 75px">
    <template #template>
      <el-skeleton-item variant="circle" />
    </template>
  </el-skeleton>
          <el-skeleton :rows="5" animated />
          </el-card>
        </el-scrollbar>
    </el-col>
    <el-col :xs="2" :sm="4" :md="6" :lg="6" :xl="6" class="hidden-sm-and-down">
        <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <div style="width:100%;float:left">MyBalance: 1000000</div>
        <div style="width:100%;float:left">        <el-button class="button">Deposit</el-button>
        <el-button class="button">Withdraw</el-button>
        <el-button class="button">Entry</el-button>
        </div>
      </div>
    </template>
    <!-- <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div> -->
    <div class="text item">My Opus</div>
    <div class="text item">My Collect</div>
    <div class="text item">My Foucus</div>
    <div class="text item">My Message</div>
  </el-card>
    </el-col>
    
  </el-row>
    
      
</div>
</template>
<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 0px;
}

.box-card {
  width: 100%;
  line-height: 80px;
}

.opus-card{
    width: 100%;;
    line-height: 30px;
    text-align: left;
}
</style>

<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { defineComponent } from 'vue'
import { ref } from 'vue'
import 'element-plus/theme-chalk/display.css'



export default defineComponent({
    name:'myMain',
  setup() {
      const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles',
}
const tableData = ref(Array.from({ length: 100 }).fill(item))

return{
  tableData
}
  }
})
</script>