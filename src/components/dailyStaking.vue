<template>
    <a-row>
    <a-col :span="12">
      <a-statistic title="TotalPoolSize" :value="112893" style="margin-right: 50px" />
    </a-col>
    <a-col :span="12">
      <a-statistic title="CurrentPoolSize" :precision="2" :value="112893" />
    </a-col>
  </a-row>
  <a-row>
    <a-col :span="12">
      <a-statistic title="CurrentRank" :value="1" style="margin-right: 50px" />
    </a-col>
    <a-col :span="12">
      <a-statistic title="CurrentHotScore" :precision="2" :value="112893" />
    </a-col>
  </a-row>
  <a-divider/>
  <a-row>
    <a-space>
    <el-input-number v-model="inputNum" :min="1" :max="1000000" /><a-button type="primary" shape="round" >stake</a-button>
    </a-space>
  </a-row>
</template>

<script lang="ts" setup>

import {ref, onMounted} from 'vue'

const inputNum = ref(0)

</script>

<style scoped>
</style>