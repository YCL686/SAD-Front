<template>
    <a-list :loading="initLoading" item-layout="horizontal" :data-source="data">
    <template #renderItem="{ item,index }">
      <a-list-item>
          <template #actions>
          <a-button :loading="getLoadings[index]" type="primary" size="small" v-if="!item.gotten" :disabled="!item.finished" shape="round" @click="getDailyTaskRewardFunction(item.taskId, index)">GET</a-button>
          <a-button type="primary" size="small" disabled v-else shape="round">Gotten</a-button>
        </template>
        <a-list-item-meta
          :description="generateDescription(item.taskReward, item.taskCount, item.taskCounted)"
        >
        <template #progress>
        <a-progress :percent="30" size="small" />
        </template>

          <template #title>
            {{ item.taskName}}
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts" setup>
import { message } from 'ant-design-vue'
import {ref, onMounted} from 'vue'
import { getDailyTask, getDailyTaskReward } from '../api/dailyTask'

const data = ref([])
const getLoadings = ref([])
const initLoading = ref(true)

const getDailyTaskFunction = () =>{
    getDailyTask().then((res)=>{
        data.value = res;
        initLoading.value = false;
        res.forEach(element => {
            getLoadings.value.push(false);
        });
    })
}

const generateDescription = (reward: any, taskCount: any, taskCounted:any) =>{
    return "Rewards:" + reward + "$SAD (" + taskCounted + "/" + taskCount +")"
}

const getDailyTaskRewardFunction = (taskId: any, index: any) =>{
    getLoadings.value[index] = true;
    let param = {taskId: taskId};
    getDailyTaskReward(param).then(res=>{
        if(res){
            message.success("get success")
            getLoadings.value[index] = false
            getDailyTaskFunction()
        }
    })
}

onMounted(() =>{
    getDailyTaskFunction()
})

</script>