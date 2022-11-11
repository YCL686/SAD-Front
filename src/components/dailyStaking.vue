<template>
    <a-spin :spinning="spinning">
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
                <a-statistic title="CurrentRank" :value="currentRank" style="margin-right: 50px">
                    <template #prefix>
                        <NumberOutlined />
                    </template>
                </a-statistic>
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
                <a-statistic-countdown :value="deadline" style="margin-right: 50px">
                    <template #title>
                        <span>Announce</span>
                    </template>
                </a-statistic-countdown>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="12">
                <a-statistic title="StakedNum/TotalNum" :value="stakedNum" style="margin-right: 50px">
                    <template #suffix>
                        <span>/{{ totalNum }}</span>
                    </template>
                </a-statistic>
            </a-col>
            <a-col :span="12">
                <a-statistic title="Unknown" :value="11111.00" />
            </a-col>
        </a-row>
        <a-divider />
        <a-row>
            <a-col :span="24">
                <a-slider @change="sliderChange" v-model:value="sliderPoint" :min="0" :max="100" :marks="marks">
                    <template #mark="{ label, point }">
                            <strong>{{ label }}</strong>
                    </template>
                </a-slider>
            </a-col>
            <a-col :span="8">
                
            </a-col>
            <a-col style="text-align: right;" :span="16">
                <a-input-number @change="inputChange" v-model:value="inputNum" :min="1" :max="offChainToken" style="margin-left: 16px" />
                <a-button type="primary" :loading="stakingLoading" :disabled="!stakeable" @click="stakeFunction" style="margin-left: 16px">STAKE
                </a-button>
            </a-col>
        </a-row>
        <!-- <a-row style="margin-top:10px">
            <a-space size="small">
                <a-tag style="cursor: pointer;" @click="inputNum = offChainToken / 10" color="green">10%</a-tag>
                <a-tag style="cursor: pointer;" @click="inputNum = offChainToken / 4" color="blue">25%</a-tag>
                <a-tag style="cursor: pointer;" @click="inputNum = offChainToken / 2" color="pink">50%</a-tag>
                <a-tag style="cursor: pointer;" @click="inputNum = offChainToken * 3 / 4" color="orange">75%</a-tag>
                <a-tag style="cursor: pointer;" @click="inputNum = offChainToken" color="red">100%</a-tag>
            </a-space>
        </a-row> -->
        <a-divider />
        <a-collapse ghost>
            <a-collapse-panel key="1" header="Daily Staking Record">
                <a-table size="middle" :pagination="false" :dataSource="dailyStakingRecord" :columns="columns">
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.dataIndex === 'nickName'">
                            <a @click="getUserProfile(record.userId)">{{ text }}</a>
                        </template>
                    </template>
                </a-table>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="Daily Staking Rule">
                <a-typography>
                    <a-typography-title>Introduction</a-typography-title>
                    <a-typography-paragraph>
                        Daily Staking is an activity aimed at encouraging creators to create high-quality content.Users
                        could use your offChainToken to stake for those
                        awsome opus, if the hotScore of those that you staked rank in top 10%, you could share the
                        TotalPoolSize.
                    </a-typography-paragraph>
                    <a-typography-paragraph>
                        <a-typography-text strong>
                            Attention please: you may lose all your offChainToken.
                        </a-typography-text>
                    </a-typography-paragraph>
                    <a-typography-title :level="3">Terminology</a-typography-title>
                    <a-typography-paragraph>
                        Here we are going to explain those terms below:
                    </a-typography-paragraph>
                    <a-typography-paragraph>
                        <ul>
                            <li>
                                <a-typography-text code>TotalPoolSize</a-typography-text>
                                <a-typography-text>: TotalPoolSize is the sum of all the staked amount
                                </a-typography-text>
                            </li>
                            <li>
                                <a-typography-text code>CurrentPoolSize</a-typography-text>
                                <a-typography-text>: CurrentPoolSize is the staked amount of current opus
                                </a-typography-text>
                            </li>
                            <li>
                                <a-typography-text code>CurrentRank</a-typography-text>
                                <a-typography-text>: CurrentRank is the rank of current opus</a-typography-text>
                            </li>
                            <li>
                                <a-typography-text code>CurrentHotScore</a-typography-text>
                                <a-typography-text>: CurrentHotScore is the hot score of current opus
                                </a-typography-text>
                            </li>
                            <li>
                                <a-typography-text code>MyOffChainToken</a-typography-text>
                                <a-typography-text>: MyOffChainToken is the amount of my usable token
                                </a-typography-text>
                            </li>
                            <li>
                                <a-typography-text code>Announce</a-typography-text>
                                <a-typography-text>: Announce is the counting down of the settlement</a-typography-text>
                            </li>
                            <li>
                                <a-typography-text code>StakedNum/TotalNum</a-typography-text>
                                <a-typography-text>: StakedNum is the number of staked record, and TotalNum is the max
                                    number of single opus that could be staked daily</a-typography-text>
                            </li>
                        </ul>
                    </a-typography-paragraph>
                    <a-typography-paragraph>
                        Press
                        <a-typography-text keyboard>Esc</a-typography-text>
                        to exit...
                    </a-typography-paragraph>
                </a-typography>
            </a-collapse-panel>
        </a-collapse>
    </a-spin>
</template>

<script lang="ts" setup>

import { ref, onMounted } from 'vue'
import { getDailyStakingPool, stakeDailyStaking } from '../api/dailyStaking'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { NumberOutlined } from '@ant-design/icons-vue';
const inputNum = ref(0)
const offChainToken = ref(0)
const totalAmount = ref(0)
const stakingAmount = ref(0)
const currentRank = ref(0)
const hotScore = ref(0)
const dailyStakingRecord = ref([])
const stakingLoading = ref(false)
const deadline = ref(Date.now())
const stakeable = ref(false)
const spinning = ref(true)
const stakedNum = ref(0)
const totalNum = ref(10)
const router = useRouter()

const sliderPoint = ref(0)
const marks = ref<Record<number, any>>({
    10: '10%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%'
});


const columns = [
    {
        title: 'NickName',
        dataIndex: 'nickName',
        key: 'nickName',
    },
    {
        title: 'StakedAmount',
        dataIndex: 'stakingAmount',
        key: 'stakingAmount',
    },
    {
        title: 'StakedTime',
        key: 'stakingTime',
        dataIndex: 'stakingTime',
    }
];

const props = defineProps({
    opusId: String,
});

const sliderChange = () => {
    inputNum.value = Number((sliderPoint.value * offChainToken.value / 100).toFixed(2))
}

const inputChange = () => {
    sliderPoint.value = inputNum.value / offChainToken.value > 1 ? 100 : inputNum.value / offChainToken.value * 100
}

const getDailyStakingPoolFunction = () => {
    let tmLoc = new Date()

    let param = { opusId: props.opusId }
    getDailyStakingPool(param).then(res => {
        spinning.value = false
        offChainToken.value = res.offChainToken
        totalAmount.value = res.totalAmount
        stakingAmount.value = res.stakingAmount
        currentRank.value = res.currentRank
        hotScore.value = res.hotScore
        deadline.value = tmLoc.getTime() + tmLoc.getTimezoneOffset() * 60000 + Number(res.deadLine)
        dailyStakingRecord.value = res.list
        stakeable.value = res.stakable
        stakedNum.value = res.stakedNum
        totalNum.value = res.totalNum
    })
}

const stakeFunction = () => {
    stakingLoading.value = true;
    let param = { opusId: props.opusId, stakingAmount: inputNum.value }
    stakeDailyStaking(param).then(res => {
        stakingLoading.value = false;
        if (res) {
            message.success("staking success")
            getDailyStakingPoolFunction()
        }
    })
}

const getUserProfile = (userId: any) => {
    const profilePage = router.resolve({
        path: '/profile/' + userId
    })
    window.open(profilePage.href, '_blank') // 打开新的窗口(跳转路径，跳转类型)
}

onMounted(() => {
    console.log(Date.now())
    getDailyStakingPoolFunction()
})

</script>

<style scoped>

</style>