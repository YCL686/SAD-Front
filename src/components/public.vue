<template>

<a-collapse v-model:activeKey="activeKey" accordion>
        <a-collapse-panel key="0" header="VOL View">
        <!-- <a-card> -->
        <a-row>
            <a-col :span="12">
                <p style="color: rgba(0, 0, 0, 0.45);font-size: 15px;margin-bottom: 4px">SyncVOL: <CaretUpFilled v-if="synchronizeAmountGrowthRate > 0" style="color: green"/> <CaretDownFilled v-else style="color: red"/>{{synchronizeAmountGrowthRate}}%</p>
                <count-to style="font-size: 24px;" :startVal="0" :endVal="synchronizeAmount" :decimals="2" :duration="3000"></count-to>
            </a-col>
            <a-col :span="12">
                <p style="color: rgba(0, 0, 0, 0.45);font-size: 15px;margin-bottom: 4px">FeedBackVOL: 
                    <CaretUpFilled v-if="feedBackAmountGrowthRate > 0" style="color: green"/> <CaretDownFilled v-else style="color: red"/>{{feedBackAmountGrowthRate}}%
                </p>
                <count-to style="font-size: 24px;" :startVal="0" :endVal="feedBackAmount" :decimals="2" :duration="3000"></count-to>
            </a-col>
            
        </a-row>
        <a-divider></a-divider>
        <a-row>
            <a-col :span="12">
                <p style="color: rgba(0, 0, 0, 0.45);font-size: 15px;margin-bottom: 4px">OnSaleVOL: <CaretUpFilled v-if="onSaleAmountGrowthRate > 0" style="color: green"/> <CaretDownFilled v-else style="color: red"/>{{onSaleAmountGrowthRate}}%</p>
                <count-to style="font-size: 24px;" :startVal="0" :endVal="onSaleAmount" :decimals="2" :duration="3000"></count-to>
            </a-col>
            <a-col :span="12">
                <p style="color: rgba(0, 0, 0, 0.45);font-size: 15px;margin-bottom: 4px">BurnVOL: <CaretUpFilled v-if="burnAmountGrowthRate > 0" style="color: green"/> <CaretDownFilled v-else style="color: red"/>{{burnAmountGrowthRate}}%</p>
                <count-to style="font-size: 24px;" :startVal="0" :endVal="burnAmount" :decimals="2" :duration="3000"></count-to>
            </a-col>
        </a-row>
    <!-- </a-card> -->
</a-collapse-panel>
        <a-collapse-panel key="1" header="VOL Detail"></a-collapse-panel>
        <a-collapse-panel key="2" header="VOL History"></a-collapse-panel>
        <a-collapse-panel key="3" header="VOL Introduce"></a-collapse-panel>
        </a-collapse>

    
</template>
<script lang="ts" setup>
import {CaretDownFilled, CaretUpFilled} from '@ant-design/icons-vue';
import { CountTo } from 'vue3-count-to'
import { ref, onMounted} from 'vue'
import {getSynchronizeRecordList, getSynchronizeInfo} from '../api/synchronizeRecord'


const activeKey = ref(0)
const synchronizeAmount = ref(0.00)
const feedBackAmount = ref(0.00)
const onSaleAmount = ref(0.00)
const burnAmount = ref(0.00)

const synchronizeAmountGrowthRate = ref(0.00)
const feedBackAmountGrowthRate = ref(0.00)
const onSaleAmountGrowthRate = ref(0.00)
const burnAmountGrowthRate = ref(0.00)

const getSynchronizeInfoFunction = () => {
    getSynchronizeInfo().then(res => {
        synchronizeAmount.value = res.synchronizeAmount
        feedBackAmount.value = res.feedBackAmount
        onSaleAmount.value = res.onSaleAmount
        burnAmount.value = res.burnAmount

        synchronizeAmountGrowthRate.value = res.synchronizeAmountGrowthRate
        feedBackAmountGrowthRate.value = res.feedBackAmountGrowthRate
        onSaleAmountGrowthRate.value = res.onSaleAmountGrowthRate
        burnAmountGrowthRate.value = res.burnAmountGrowthRate
    })
}

onMounted(() => {
    getSynchronizeInfoFunction();
})

</script>
<style scoped>

</style>