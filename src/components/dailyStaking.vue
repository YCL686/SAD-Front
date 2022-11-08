<template>
    <a-row>
        <a-col :span="12">
            <a-statistic title="TotalPoolSize" :value="totalAmount" :precision="2" style="margin-right: 50px" />
        </a-col>
        <a-col :span="12">
            <a-statistic title="CurrentPoolSize" :precision="2" :value="stakingAmount" />
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="12">
            <a-statistic title="CurrentRank" :value="currentRank" style="margin-right: 50px" />
        </a-col>
        <a-col :span="12">
            <a-statistic title="CurrentHotScore" :precision="2" :value="hotScore" />
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="12">
            <a-statistic title="MyOffChainToken" :value="offChainToken" style="margin-right: 50px" />
        </a-col>
        <a-col :span="12">
            <a-statistic-countdown :value="deadline" style="margin-right: 50px" @finish="">
        <template #title>
          <span>Announce</span>
          <a-tooltip placement="right">
            <template #title>
              <span>hurry up!</span>
            </template>
            <question-circle-two-tone style="margin-left: 5px" />
          </a-tooltip>
        </template>
      </a-statistic-countdown>
        </a-col>
    </a-row>
    <a-divider />
    <a-row>
        <a-space>
            <el-input-number v-model="inputNum" :min="1" :max="1000000" />
            <a-tag style="cursor: pointer;" @click="inputNum = offChainToken / 4" color="pink">25%</a-tag>
            <a-tag style="cursor: pointer;" @click="inputNum = offChainToken / 2" color="red">50%</a-tag>
            <a-tag style="cursor: pointer;" @click="inputNum = offChainToken" color="orange">100%</a-tag>
            <a-button type="primary" size="small" :loading="stakingLoading" @click="stakeFunction">STAKE</a-button>
        </a-space>
    </a-row>
    <a-divider />
    <a-list item-layout="horizontal" :data-source="dailyStakingRecord">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta
          :description=item.stakingAmount
        >
          <template #title>
            <a href="https://www.antdv.com/">{{ item.nickName }}</a>
          </template>
          <template #avatar>
            <a-avatar :src="item.avatarUrl" />
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>

import { ref, onMounted, watch } from 'vue'
import { getDailyStakingPool, stakeDailyStaking } from '../api/dailyStaking'
import { message } from 'ant-design-vue'
const inputNum = ref(0)
const offChainToken = ref(0)
const totalAmount = ref(0)
const stakingAmount = ref(0)
const currentRank = ref(0)
const hotScore = ref(0)
const dailyStakingRecord = ref([])
const stakingLoading = ref(false)
const deadline = ref(Date.now() + 1000 * 60 * 60 * 20)
const props = defineProps({
    opusId: String,
});

watch(
  () => props.opusId,
  (newVal, oldVal) => {
    console.log(props.opusId)
    if( newVal != oldVal){
        console.log(props.opusId)
        getDailyStakingPoolFunction()
    }
  },
  {
        deep: true
  }
)

const getDailyStakingPoolFunction = () => {
    let param = { opusId: props.opusId }
    getDailyStakingPool(param).then(res => {
        offChainToken.value = res.offChainToken
        totalAmount.value = res.totalAmount
        stakingAmount.value = res.stakingAmount
        currentRank.value = res.currentRank
        hotScore.value = res.hotScore
        deadline.value = res.deadLine
        dailyStakingRecord.value = res.list
    })
}

const stakeFunction = () => {
    stakingLoading.value = true;
    let param = {opusId: props.opusId, stakingAmount: inputNum.value}
    stakeDailyStaking(param).then(res=>{
        stakingLoading.value = false;
        if(res){
            message.success("staking success")
            getDailyStakingPoolFunction()
        }
    })
}

onMounted(() => {
    getDailyStakingPoolFunction()
})

</script>

<style scoped>

</style>