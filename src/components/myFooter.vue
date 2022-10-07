<template>
<div id = "footer">
    <el-row :gutter="24">
    <el-col :span="4"><div class="grid-content ep-bg-purple" />
    
    </el-col>
    <el-col :span="8"><div class="grid-content ep-bg-purple" />
    Copyright2022
    </el-col>
    <el-col :span="12"><div class="grid-content ep-bg-purple" />
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
  padding: 18px;
}

.grid-content {
  border-radius: 4px;
}
</style>

<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { defineComponent } from 'vue'

export default defineComponent({
    name:'myFooter',
  setup() {
    
  }
})
</script>