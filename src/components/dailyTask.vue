<template>
    <a-list item-layout="horizontal" :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>
          <template #actions>
          <a-button type="primary" size="small" v-if="item.finished && !item.gotten" key="list-loadmore-edit" shape="round">Get</a-button>
          <a-button type="primary" size="small" disabled v-else key="list-loadmore-more" shape="round">Gotten</a-button>
        </template>
        <a-list-item-meta
          :description="generateDescription(item.taskReward, item.taskCount, item.taskCounted)"
        >
        <template #progress>
        <a-progress :percent="30" size="small" />
        </template>

          <template #title>
            <a href="https://www.antdv.com/">{{ item.taskName}}  ({{item.taskReward}}$SAD)</a>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts" setup>
import {ref, onMounted} from 'vue'
import { getDailyTask } from '../api/dailyTask'

const data = ref([])

const getDailyTaskFunction = () =>{
    getDailyTask().then((res)=>{
        data.value = res;
    })
}

const generateDescription = (reward: any, taskCount: any, taskCounted:any) =>{
    return "Rewards:" + reward + "$SAD (" + taskCounted + "/" + taskCount +")"
}

onMounted(() =>{
    getDailyTaskFunction()
})

</script>