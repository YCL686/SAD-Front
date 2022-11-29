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
                            <a-button :disabled="!record.launchable" size="small" type="primary" shape="round" @click="launchModalVisible = true; launchPrice = record.launchPrice; launchId = record.launchId; launchDescription = ''; launchLink = ''; launchTitle = '', launchUrl = ''">Launch
                            </a-button>
                        </a-col>
                    </a-row>
                <!-- </a-space> -->
            </a-timeline-item>
        </a-timeline>
    </a-card>
    <a-modal :destroyOnClose="true" :footer="null" v-model:visible="launchModalVisible" title="Launch">
        <a-space direction="vertical" v-model:value="launchPrice" style="width: 100%;">
            <a-row style="text-align: center;">
                    <a-col v-if="!launchUrl" :span="24">
                        <a-upload :accept="null" v-model:file-list="fileList" name="file" list-type="picture-card"
                            style="width: 100%;" :show-upload-list="false" :action="uploadUrl" :headers=headers
                            :before-upload="beforeUpload" @change="handleChange">
                            <div>
                                <loading-outlined v-if="uploadLoading"></loading-outlined>
                                <plus-outlined v-else></plus-outlined>
                                <div class="ant-upload-text">Upload</div>
                            </div>
                        </a-upload>
                        
                        

                    </a-col>
                    <a-col v-else :span = "24">
                        <img style="width: 100%; height: 90%" :src="launchUrl" alt="avatar" />
                        <a-button @click="fileList=[]; launchUrl=''" type="text">Delete</a-button>
                    </a-col>
                </a-row>        
        <a-input-number style="width: 100%;" v-model:value="launchPrice" :disabled="true" addon-before="Token:" addon-after="$SAD" :step="0.01" string-mode></a-input-number>    
        <a-input addon-before="Title:" v-model:value="launchTitle" show-count :maxlength="30" />
        <a-input addon-before="Link:" v-model:value="launchLink" show-count :maxlength="30" />
        <a-textarea placeholder="Descrption..." :row="4" v-model:value="launchDescription" show-count :maxlength="300" />
        <a-space style="float: right">
        <a-button type="primary" size="small" shape="round" :loading="addLoading" @click="addLaunchFunction">Launch</a-button>
        <a-button size="small" shape="round">Reset</a-button>
    </a-space>
    </a-space>
    
    </a-modal>
</template>

<script lang="ts" setup>
import { message, Upload } from 'ant-design-vue';
import { ref, onMounted } from 'vue'
import { getLaunchList } from "../api/launch";
import { addLaunch } from "../api/launchRecord";
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';



const timelineData = ref([])
const launchId = ref()
const launchModalVisible = ref(false)
const launchTitle = ref('')
const launchLink = ref('')
const launchDescription = ref('')
const launchUrl = ref('')
const launchPrice = ref(0.00)
const loading = ref(true)
const uploadLoading = ref(false)
const addLoading = ref(false)

const fileList = ref<UploadProps['fileList']>([])
const headers = {
    token: localStorage.getItem('token')
}
const uploadUrl = import.meta.env.VITE_BASE_SERVER + import.meta.env.VITE_BASE_URL + '/resource/uploadLaunch'

const addLaunchFunction = () => {
    addLoading.value = true
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
            getLaunchListFunction();
            addLoading.value = false
        }
    })
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
      const isImg = (file.type === 'image/png' || file.type === 'image/jpeg');
      if (!isImg) {
        message.error(`only image supported`);
      }

      if(file.size > 25165824){
        message.error(`maximum size is 3M`);
        return false || Upload.LIST_IGNORE
      }

      return isImg || Upload.LIST_IGNORE;
    };

const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
        uploadLoading.value = true;
        return;
    }
    if (info.file.status === 'done') {
        // debugger
        launchUrl.value = info.file.response.data;
        uploadLoading.value = false;
    }
    if (info.file.status === 'error') {
        loading.value = false;
        message.error('upload error');
    }
    uploadLoading.value = false
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