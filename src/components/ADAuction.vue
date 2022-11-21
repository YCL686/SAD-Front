<template>
    <a-collapse v-model:activeKey="activeKey" accordion>
        <a-collapse-panel key="1" header="Auction Sales">
            <a-card v-for="adAuction in adAuctionList" hoverable
                style="width: 100%; border-radius: 10px; margin-top: 10px;">
                <template #cover>
                    <img alt="example" :src="adAuction.resourceUrl" />
                </template>
                <template #actions>
                    <a-space style="float: right; padding: 5px">
                        <a-button size="small" type="link" @click="showBidRecordModalFunction(adAuction.adAuctionId)">
                            Bid Record</a-button>
                        <a-button :disabled="adAuction.auctionStatus != 1"
                            @click="showBidBuyModalFunction(0, adAuction.startPrice, adAuction.buyItNowPrice, adAuction.bidPrice, adAuction.adAuctionId, adAuction.adIndex)"
                            size="small" shape="round" type="primary">Bid
                            Now</a-button>
                        <a-button :disabled="adAuction.auctionStatus != 1"
                            @click="showBidBuyModalFunction(1, adAuction.startPrice, adAuction.buyItNowPrice, adAuction.bidPrice, adAuction.adAuctionId, adAuction.adIndex)"
                            size="small" shape="round">Buy It Now
                        </a-button>
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
                        <p style="color: rgba(0, 0, 0, 0.45);font-size: 14px;margin-bottom: 4px">BidPrice:</p>
                        <count-to style="font-size: 24px;" :startVal="0" :endVal="adAuction.bidPrice" :decimals="2"
                            :duration="3000"></count-to>
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

                <a-row v-if="adAuction.userId != '0' && adAuction.userId != null && adAuction.userId != undefined">
                    <a-divider></a-divider>
                    <a-col>
                        <p style="color: rgba(0, 0, 0, 0.45);font-size: 14px;margin-bottom: 4px">CurrentBidder:</p>
                        <a-avatar
                            v-if="adAuction.resourceUrl != null && item.resourceUrl != '' && item.resourceUrl != undefined"
                            :size="32" :src="item.resourceUrl" />
                        <a-avatar v-else :size="32">
                            {{ adAuction.nickName }}
                        </a-avatar>
                    </a-col>
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
                                        auctioneer, and the ratio is {{ shareByAuctioneerRatio }}%.</a-typography>
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

    <a-modal :destroyOnClose="true" :footer="null" v-model:visible="bidRecordModalVisible" title="BidRecord"
        @ok="handleOk">
        <a-table :columns="columns" :data-source="bidRecordData" size="small" :scroll="{ x: 2000 }" :pagination="{ pageSize: 50 }" />
    </a-modal>

    <a-modal :destroyOnClose="true" :footer="null" v-model:visible="bidBuyModalVisible" title="BidOrBuyItNow"
        @ok="handleOk">
        <a-row>
            <a-col :span="12">
                <a-statistic title="StartPrice:" :precision="2" :value="singleStartPrice" />
            </a-col>
            <a-col :span="12">
                <a-statistic title="BuyItNowPrice:" :precision="2" :value="singleBuyItNowPrice" />
            </a-col>
        </a-row>
        <a-divider></a-divider>
        <a-row>
            <a-col :span="12">
                <a-statistic title="BidPrice:" :precision="2" :value="singleBidPrice" />
            </a-col>
            <a-col :span="12">
                <a-statistic title="MyOffChainToken:" :precision="2" :value="offChainToken" />
            </a-col>
        </a-row>
        <a-divider></a-divider>
        <a-row>
            <a-col :span="18">
                <a-slider v-model:value="auctionDays" :min="1" :max="maximumBidDays"></a-slider>
            </a-col>
            <a-col style="margin-left: 10px;" :span="4">
                {{ auctionDays }} Days
            </a-col>
        </a-row>
        <a-row style="margin-top: 15px">
            <a-col :span="24">Your Unit Price:
                <a-input-number :disabled="auctionType == 1" v-model:value="inputBidPrice" style="width: 200px"
                    :min="singleMinPrice" :max="singleBuyItNowPrice" :step="0.01" string-mode />
            </a-col>
        </a-row>
        <a-row style="margin-top: 15px">
            <a-col :span="24">
                <a-typography-paragraph v-model:content="singleMemo" editable />
            </a-col>
        </a-row>
        <a-divider>
        </a-divider>
        <a-row>
            <a-col :span="12">
                <a-statistic title="YourTotalPrice:" :precision="2" :value="inputBidPrice * auctionDays" />
            </a-col>
            <a-col style="text-align: right;" :span="12">
                <a-button v-if="auctionType == 0" type="primary" size="small" shape="round" @click="bidBuyFunction(0)">
                    Bid Now</a-button>
                <a-button v-if="auctionType == 1" type="primary" size="small" shape="round" @click="bidBuyFunction(1)">
                    Buy It Now</a-button>
            </a-col>
        </a-row>
    </a-modal>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { getAdAuctionInfo, getAdAuctionList } from '../api/adAuction'
import { getAccount } from "../api/account";
import { pageBidRecord, bidBuy } from "../api/adAuctionRecord"
import * as echarts from 'echarts'
import { CountTo } from 'vue3-count-to'
import { from } from "rxjs";
import { message } from "ant-design-vue";

const colorList = ['blue', 'volcano', 'green', 'gray']
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
const bidRecordModalVisible = ref(false)
const bidBuyModalVisible = ref(false)
const auctionType = ref(0)
const offChainToken = ref(0)
const singleAdIndex = ref(0)

const singleStartPrice = ref(0)
const singleBuyItNowPrice = ref(0)
const singleBidPrice = ref(0)
const singleMinPrice = ref(0)
const auctionDays = ref(0)
const inputBidPrice = ref(0)
const singleMemo = ref('Leave Your Message')


const adAuctionId = ref(0)
const pageNo = ref(1)
const pageSize = ref(5)
const total = ref(0)
const totalPages = ref(0)
const bidRecordData = ref([])

const columns = [{
    title: 'User',
    dataIndex: 'nickName',
    key: 'nickName',
    fixed: true,
    width: 120
},{
    title: 'BidPrice',
    dataIndex: 'auctionUnitPrice',
    key: 'auctionUnitPrice',
    width:100
},{
    title: 'Days',
    dataIndex: 'auctionDays',
    key: 'auctionDays',
    width:80
},{
    title: 'TotalPrice',
    dataIndex: 'auctionTotalPrice',
    key: 'auctionTotalPrice',
    width:100
},{
    title: 'AuctionType',
    dataIndex: 'auctionTypeName',
    key: 'auctionTypeName',
    width:120
},{
    title: 'memo',
    dataIndex: 'memo',
    key: 'memo',
    width:100
},{
    title: 'status',
    dataIndex: 'statusName',
    key: 'statusName',
    width:100
},{
    title: 'operateTime',
    dataIndex: 'gmtCreated',
    key: 'gmtCreated'
}]


watch(activeKey, (newVal, oldVal) => {
    if (oldVal != "3" && newVal == "3") {
        generatePieFunction(myEcharts);
    }
});

onMounted(() => {
    getAdAuctionListFunction()
    getAdAuctionInfoFunction()
})

const handleOk = () => {
    bidRecordModalVisible.value = false
    bidModalVisible.value = false
}

const showBidRecordModalFunction = (adAuctionId: any) => {
    bidRecordModalVisible.value = true
    pageBidRecordFunction(adAuctionId);
}

const pageBidRecordFunction = (adAuctionId: any) => {
    const param = { pageNo: pageNo.value, pageSize: pageSize.value, adAuctionId: adAuctionId }
    pageBidRecord(param).then(res => {
        bidRecordData.value = res.data;
    })
}

const getAdAuctionInfoFunction = () => {
    getAdAuctionInfo().then(res => {
        burnRatio.value = res.burnRatio * 100;
        shareByAuctioneerRatio.value = res.shareByAuctioneerRatio * 100;
        feedbackRatio.value = res.feedbackRatio * 100;
        onSaleRatio.value = res.onSaleRatio * 100;
        maximumBidDays.value = res.maximumBidDays;
        minimumBidRatio.value = res.minimumBidRatio * 100
    })
}

const showBidBuyModalFunction = (type: number, startPrice: any, buyItNowPrice: any, bidPrice: any, id: any, adIndex: any) => {

    getAccount().then(res => {
        offChainToken.value = res.balance;
        auctionType.value = type
        adAuctionId.value = id
        singleStartPrice.value = startPrice
        singleBidPrice.value = bidPrice
        singleBuyItNowPrice.value = buyItNowPrice
        singleAdIndex.value = adIndex
        singleMinPrice.value = singleBidPrice.value == 0.00 ? singleStartPrice.value : singleBidPrice.value * (100 + minimumBidRatio.value) / 100
        bidBuyModalVisible.value = true

    })
}

const bidBuyFunction = (type: number) => {
    const param = {
        auctionDays: auctionDays.value,
        auctionType: type,
        memo: singleMemo.value,
        adAuctionId: adAuctionId.value,
        auctionUnitPrice: inputBidPrice.value
    }

    bidBuy(param).then(res => {
        message.success("bid success")
        bidBuyModalVisible.value = false;
        getAdAuctionListFunction()
    })
}

const getAdAuctionListFunction = () => {
    getAdAuctionList().then(res => {
        adAuctionList.value = res
    })
}

const generatePieFunction = (myEcharts: any) => {
    if (myEcharts.value != null && myEcharts.value != undefined && myEcharts.value != '') {
        return;
    }
    myEcharts.value = echarts.init(pie.value!)
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