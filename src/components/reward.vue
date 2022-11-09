<template>
    <a-spin :spinning="spinning">
        <a-row>
            <a-col :span="12">
                <a-statistic title="MyOffChainToken" :value="offChainToken"/>
            </a-col>
        </a-row>
        <a-divider />
        <a-row>
            <a-col :span="16">
                <el-input-number style="width: 90%;" v-model="inputNum" :min="1" :max="1000000" />
            </a-col>
            <a-col :span="8">
                <a-button type="primary" :loading="rewardLoading" @click="rewardFunction">REWARD
                </a-button>
            </a-col>
        </a-row>
        <a-row style="margin-top:10px">
            <a-space>
                <a-tag style="cursor: pointer;" @click="inputNum = offChainToken / 10" color="green">10%</a-tag>
                <a-tag style="cursor: pointer;" @click="inputNum = offChainToken / 4" color="blue">25%</a-tag>
                <a-tag style="cursor: pointer;" @click="inputNum = offChainToken / 2" color="pink">50%</a-tag>
                <a-tag style="cursor: pointer;" @click="inputNum = offChainToken * 3 / 4" color="orange">75%</a-tag>
                <a-tag style="cursor: pointer;" @click="inputNum = offChainToken" color="red">100%</a-tag>
            </a-space>
        </a-row>
        <a-row style="margin-top: 10px;width:80%">
            <a-typography-paragraph v-model:content="memo" editable />
            <template #editableIcon><HighlightOutlined /></template>
        </a-row>
        <!-- <a-divider /> -->
        <a-collapse ghost>
            <a-collapse-panel key="1" header="Reward Record">
                <!-- <a-table size="middle" :pagination="false" :dataSource="dailyStakingRecord" :columns="columns">
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.dataIndex === 'nickName'">
                            <a @click="getUserProfile(record.userId)">{{ text }}</a>
                        </template>
                    </template>
                </a-table> -->
            </a-collapse-panel>
            <a-collapse-panel key="2" header="Reward Rule">
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

import { ref, onMounted, watch } from 'vue'
import { getDailyStakingPool, stakeDailyStaking } from '../api/dailyStaking'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import {HighlightOutlined} from '@ant-design/icons-vue';
const inputNum = ref(0)
const offChainToken = ref(0)
const rewardRecord = ref([])
const rewardLoading = ref(false)
const spinning = ref(true)
const router = useRouter()
const memo = ref('leave your message')

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
    toUserId: String,
});

watch(
    () => props.toUserId,
    (newVal, oldVal) => {
        console.log(props.toUserId)
        if (newVal != oldVal) {
            console.log(props.toUserId)
            getRewardFunction()
        }
    },
    {
        deep: true
    }
)

const getRewardFunction = () => {    
    let param = { toUserId: props.toUserId }
    getDailyStakingPool(param).then(res => {
        spinning.value = false
        offChainToken.value = res.offChainToken
    })
}

const rewardFunction = () => {
    rewardLoading.value = true;
    let param = { toUserId: props.toUserId, amount: inputNum.value }
    stakeDailyStaking(param).then(res => {
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