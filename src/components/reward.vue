<template>
    <a-spin :spinning="spinning">
        <a-row>
            <a-col :span="12">
                <a-statistic title="MyOffChainToken" :value="offChainToken"/>
            </a-col>
            <a-col :span="12">
                <a-statistic title="TotalRewardAmount" :value="totalRewardAmount"/>
            </a-col>
        </a-row>
        <a-divider>You are rewarding to <a @click="getUserProfile(props.toUserId)">{{$props.toNickName}}</a></a-divider>
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
                <a-button type="primary" :disabled="!rewardable" :loading="rewardLoading" @click="rewardFunction" style="margin-left: 16px">REWARD
                </a-button>
            </a-col>
        </a-row>
        <!-- <a-row style="margin-top:15px">
            <a-space size="large">
                <a-tag style="cursor: pointer;" @click="inputNum = offChainToken / 10" color="green">10%</a-tag>
                <a-tag style="cursor: pointer;" @click="inputNum = offChainToken / 4" color="blue">25%</a-tag>
                <a-tag style="cursor: pointer;" @click="inputNum = offChainToken / 2" color="pink">50%</a-tag>
                <a-tag style="cursor: pointer;" @click="inputNum = offChainToken * 3 / 4" color="orange">75%</a-tag>
                <a-tag style="cursor: pointer;" @click="inputNum = offChainToken" color="red">100%</a-tag>
            </a-space>
        </a-row> -->
        <a-divider />
        <a-row style="margin-top: 10px;width:80%">
            <a-typography-paragraph v-model:content="memo" editable />
            <template #editableIcon><HighlightOutlined /></template>
        </a-row>
        <!-- <a-divider /> -->
        <a-collapse ghost>
            <a-collapse-panel key="1" header="Reward Record">
                <a-table size="middle" :pagination="false" :dataSource="rewardRecord" :columns="columns">
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.dataIndex === 'fromUserName'">
                            <a @click="getUserProfile(record.fromUserId)">{{ text }}</a>
                        </template>
                    </template>
                </a-table>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="Reward Rule">
                <a-typography>
                    <a-typography-title>Introduction</a-typography-title>
                    <a-typography-paragraph>
                        Reward is a kind of way to donate your offChainToken to someone else, the platform will take a percentage of 5%
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

import { ref, onMounted, watch } from 'vue'
import { rewardMe, pageRewardRecord } from '../api/reward'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import {HighlightOutlined} from '@ant-design/icons-vue';
const inputNum = ref(0)
const offChainToken = ref(0)
const totalRewardAmount = ref(0)
const rewardRecord = ref([])
const rewardLoading = ref(false)
const spinning = ref(true)
const router = useRouter()
const memo = ref('Leave Your Message')
const pageNo = ref(1)
const pageSize = ref(5)
const rewardable = ref(true)

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
        dataIndex: 'fromUserName',
        key: 'fromUserName',
    },
    {
        title: 'RewardAmount',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: 'RewardTime',
        key: 'gmtCreated',
        dataIndex: 'gmtCreated',
    }
];

const props = defineProps({
    toUserId: String,
    toNickName: String
});

// watch(
//     () => props.toUserId,
//     (newVal, oldVal) => {
//         console.log(props.toUserId)
//         if (newVal != oldVal) {
//             getRewardFunction()
//         }
//     },
//     {
//         deep: true
//     }
// )

const sliderChange = () => {
    inputNum.value = Number((sliderPoint.value * offChainToken.value / 100).toFixed(2))
}

const inputChange = () => {
    sliderPoint.value = inputNum.value / offChainToken.value >= 1 ? 100 : inputNum.value / offChainToken.value * 100
}

const getRewardFunction = () => {    
    let param = { toUserId: props.toUserId, pageNo:pageNo.value, pageSize:pageSize.value }
    pageRewardRecord(param).then(res => {
        spinning.value = false
        offChainToken.value = res.offChainToken
        totalRewardAmount.value = res.totalRewardAmount
        rewardRecord.value = res.data
        rewardable.value = res.rewardable
    })
}

const rewardFunction = () => {
    rewardLoading.value = true;
    let param = { toUserId: props.toUserId, amount: inputNum.value }
    rewardMe(param).then(res => {
        rewardLoading.value = false;
        if (res) {
            message.success("reward success")
            getRewardFunction()
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
    getRewardFunction()
})

</script>

<style scoped>

</style>