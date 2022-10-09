<template>
<div id = "main">
    <el-row :gutter="10">
    <el-col ::xs="2" :sm="4" :md="4" :lg="4" :xl="4"><div class="grid-content ep-bg-purple" />
    </el-col>
    <el-col ::xs="20" :sm="16" :md="14" :lg="14" :xl="14">
        <ad></ad>
        <el-divider />
    <!-- <el-scrollbar>
          <el-card class="opus-card" v-for="o in 30" :key="o">
              <el-skeleton style="--el-skeleton-circle-size: 75px">
    <template #template>
      <el-skeleton-item variant="circle" />
    </template>
  </el-skeleton>
          <el-skeleton :rows="5" animated />
          </el-card>
        </el-scrollbar> -->
        <RouterView></RouterView>
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
import ad from './ad.vue'
import 'element-plus/theme-chalk/display.css'



export default defineComponent({
  components:{ ad },
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