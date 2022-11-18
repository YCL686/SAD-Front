<template>
    <a-collapse v-model:activeKey="activeKey" accordion>
        <a-collapse-panel key="1" header="Auction Sales">
            <a-card v-for="adAuction in adAuctionList" hoverable style="width: 100%; border-radius: 10px; margin-top: 10px;">
                <template #cover>
                    <img alt="example" :src="adAuction.resourceUrl" />
                </template>
                <template #actions>
                    <a-space style="float: right; padding: 5px">
                    <a-button size="small" type="link">Bid Record</a-button>
                    <a-button :disabled="adAuction.auctionStatus != 1" size="small" shape="round" type="primary">Bid Now</a-button>
                    <a-button :disabled="adAuction.auctionStatus != 1" size="small" shape="round">Buy It Now</a-button>
                </a-space>
                </template>
                <a-badge-ribbon :text="adAuction.auctionStatusName" :color="colorList[adAuction.auctionStatus]">
                <a-card-meta :title="'#' + adAuction.adIndex">
                    <!-- <template #avatar>
                        <a-avatar src="https://joeschmoe.io/api/v1/random" />
                    </template> -->
                </a-card-meta>
            </a-badge-ribbon>
                <a-divider></a-divider>
                <a-row>
                    <a-col :span="12">
                        <a-statistic title="StartPrice:" :precision="2" :value="adAuction.startPrice" />
                    </a-col>
                    <a-col :span="12">
                        <a-statistic title="BuyItNowPrice:" :precision="2" :value="adAuction.buyItNowPrice" />
                    </a-col>
                </a-row>
                <a-divider></a-divider>
                <a-row>
                    <a-col :span="12">
                    <p style="color: rgba(0, 0, 0, 0.45);font-size: 14px;margin-bottom: 4px">BidPrice:</p><count-to style="font-size: 24px;" :startVal="0" :endVal="adAuction.bidPrice" :decimals="2" :duration="3000"></count-to>
                    </a-col>
                    <a-col v-if="adAuction.auctionStatus == 0" :span="12">
                        <a-statistic-countdown :value="deadline">
                    <template #title>
                        <span>StartIn:</span>
                    </template>
                </a-statistic-countdown>
                    </a-col>
                    <a-col v-if="adAuction.auctionStatus == 1" :span="12">
                        <a-statistic-countdown :value="deadline">
                    <template #title>
                        <span>EndIn:</span>
                    </template>
                </a-statistic-countdown>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col></a-col>
                </a-row>
            </a-card>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="My Auction">
            2
        </a-collapse-panel>
        <a-collapse-panel key="3" header="AD Introduce">
            <a-card title="Auction Introduce" hoverable :bordered="false" style="width: 100%; border-radius: 10px;">
                <a-row>
                    <a-col :span="24">
                        <a-typography-paragraph>
                            AD Auction is the core bussiness of SharableAD which is a way to get through the real world
                            and the crypto world. Each of our user could use their $SAD token to take part in the
                            auction,
                            once you bid it successfully you could show your self, your bussiness, your home, etc... And
                            the auction fee will seperate like this below:
                        </a-typography-paragraph>
                        <a-typography-paragraph>
                            <ul>
                                <li>
                                    <a-typography>ShareByAuctioneer: this part of fee will be shared by all the
                                        auctioneer, and the ratio is {{ burnRatio }}%.</a-typography>
                                </li>
                                <li>
                                    <a-typography>Feedback: this part of fee will be back as DailyTaskRewards, and the
                                        ratio is {{ feedbackRatio }}%.</a-typography>
                                </li>
                                <li>
                                    <a-typography>Burn: this part of fee will be burn, and the ratio is {{ burnRatio
                                    }}%.
                                    </a-typography>
                                </li>
                                <li>
                                    <a-typography>OnSale: this part of fee will back to onSale, and the ratio is
                                        {{ onSaleRatio }}%.</a-typography>
                                </li>
                            </ul>
                        </a-typography-paragraph>
                        <a-typography-paragraph>
                            AD Auction is generally start everyday, but if you need more days, you can bid more days
                            when you got it, and the maximumDays is {{ maximumBidDays }}, and each bid should at least
                            {{ minimumBidRatio }}% higher than before.
                        </a-typography-paragraph>
                    </a-col>
                </a-row>
                <a-row style="text-align: center;">
                    <div style="height: 500px;width:100%" ref="pie"></div>
                </a-row>
            </a-card>
        </a-collapse-panel>

    </a-collapse>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { getAdAuctionInfo, getAdAuctionList } from '../api/adAuction'
import * as echarts from 'echarts'
import { CountTo } from 'vue3-count-to'

const colorList = ['blue','volcano','green', 'gray']
const activeKey = ref("1")
const pie = ref<HTMLElement>()
const adAuctionList = ref([])
const burnRatio = ref(0)
const shareByAuctioneerRatio = ref(0)
const feedbackRatio = ref(0)
const onSaleRatio = ref(0)
const maximumBidDays = ref(0)
const minimumBidRatio = ref(0)
const myEcharts = ref()
const deadline = ref(Date.now() + 1000000)


watch(activeKey, (newVal, oldVal) => {
    if (oldVal != "3" && newVal == "3") {
        getAdAuctionInfoFunction();
    }
});

onMounted(() => {
    getAdAuctionListFunction()
})

const getAdAuctionInfoFunction = () => {
    if (myEcharts.value != null || myEcharts.value != undefined) {
        return;
    }
    getAdAuctionInfo().then(res => {
        burnRatio.value = res.burnRatio * 100;
        shareByAuctioneerRatio.value = res.shareByAuctioneerRatio * 100;
        feedbackRatio.value = res.feedbackRatio * 100;
        onSaleRatio.value = res.onSaleRatio * 100;
        maximumBidDays.value = res.maximumBidDays;
        minimumBidRatio.value = res.minimumBidRatio * 100
        myEcharts.value = echarts.init(pie.value!)
        generatePieFunction(myEcharts.value)
    })
}

const getAdAuctionListFunction = () => {
    getAdAuctionList().then(res => {
        adAuctionList.value = res
    })
}

const generatePieFunction = (myEcharts: any) => {
    let option = {
        title: {
            text: 'Auction Fee Seperate Pie',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: '10%'
        },
        series: [
            {
                name: 'Ratio',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: shareByAuctioneerRatio.value, name: 'ShareByAuctioneer' },
                    { value: feedbackRatio.value, name: 'Feedback' },
                    { value: burnRatio.value, name: 'Burn' },
                    { value: onSaleRatio.value, name: 'OnSale' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    myEcharts.setOption(option)
}
</script>
<style scoped>

</style>