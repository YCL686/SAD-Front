<template>
    <a-card style="border-radius: 10px;margin-top: 5px" hoverable>
        <a-skeleton v-if="loading" :active="loading" />
        <a-timeline v-else mode="alternate">
            <a-timeline-item v-for="record in timelineData">
                <!-- <a-space direction="vertical"> -->
                    <a-row>
                        <a-col :span="14" style="font-size: 16px;">{{ record.launchTime }}</a-col>
                        <a-col :span="10" style="font-size: 16px;">{{ record.launchPrice }}</a-col>
                    </a-row>
                    <a-row style="margin-top: 5px;">
                        <a-col :span="14">
                            <a-avatar-group :max-count="2"
                                :max-style="{ color: '#f56a00', backgroundColor: '#fde3cf' }">
                                <a-avatar v-for="user in record.data" :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }" :src="user.avatarUrl != ''? user.avatarUrl: ''" >
                                    {{user.nickName}}
                                </a-avatar>

                            </a-avatar-group>
                        </a-col>
                        <a-col :span="10" style="text-align: right;">
                            <a-button :disabled="!record.launchable" size="small" type="primary" shape="round" @click="launchModalVisible = true; launchPrice = record.launchPrice; launchId = record.launchId">Launch
                            </a-button>
                        </a-col>
                    </a-row>
                <!-- </a-space> -->
            </a-timeline-item>
        </a-timeline>
    </a-card>
    <a-modal :destroyOnClose="true" :footer="null" v-model:visible="launchModalVisible" title="Launch">
        <a-space direction="vertical" v-model:value="launchPrice" style="width: 100%;">
        <a-input-number style="width: 100%;" v-model:value="launchPrice" :disabled="true" addon-before="Token:" addon-after="$SAD" :step="0.01" string-mode></a-input-number>    
        <a-input addon-before="Title:" v-model:value="launchTitle" show-count :maxlength="20" />
        <a-input addon-before="Link:" v-model:value="launchLink" show-count :maxlength="20" />
        <a-textarea placeholder="Descrption..." :row="4" v-model:value="launchDescription" show-count :maxlength="200" />
        <a-space style="float: right">
        <a-button type="primary" size="small" shape="round" @click="addLaunchFunction">Launch</a-button>
        <a-button size="small" shape="round">Reset</a-button>
    </a-space>
    </a-space>
    
    </a-modal>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';
import { ref, onMounted } from 'vue'
import { getLaunchList } from "../api/launch";
import { addLaunch } from "../api/launchRecord";

const timelineData = ref([])
const launchId = ref()
const launchModalVisible = ref(false)
const launchTitle = ref('')
const launchLink = ref('')
const launchDescription = ref('')
const launchUrl = ref('')
const launchPrice = ref(0.00)
const loading = ref(true)

const addLaunchFunction = () => {
    const param = {
        launchTitle: launchTitle.value,
        launchLink: launchLink.value,
        launchDescription: launchDescription.value,
        launchUrl: launchUrl.value,
        launchId: launchId.value
    }
    addLaunch(param).then(res => {
        if(res){
            message.success("launch success")
            launchModalVisible.value = false;
            getLaunchListFunction()
        }
    })
}

const getLaunchListFunction = () => {
    loading.value = true
    getLaunchList().then(res => {
        loading.value = false
        timelineData.value = res
    })
}

onMounted(() => {
    getLaunchListFunction();
})
</script>

<style scoped>

</style>