<template>
  <div id="main">
    <el-row>
      <el-col :xs="4" :sm="4" :md="4" :lg="3" :xl="3" class="hidden-sm-and-down">
        <div class="grid-content ep-bg-purple" />
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="18">
        <ad style="margin-bottom: 10px"></ad>
        <el-menu :default-active="1" class="el-menu-demo" mode="horizontal" v-if="data.isMobile">
          <el-menu-item index="1">
            <router-link to="/index">{{$t('menus.index')}}</router-link>
          </el-menu-item>
          <el-menu-item index="2">
            <router-link to="/hot">{{$t('menus.hot')}}</router-link>
          </el-menu-item>
          <el-menu-item index="3">
            <router-link to="/focus">{{$t('menus.focus')}}</router-link>
          </el-menu-item>
          <el-menu-item index="4">
            <router-link to="/nft">NFT</router-link>
          </el-menu-item>
          <el-menu-item index="5">
            <router-link to="/defi">DeFi</router-link>
          </el-menu-item>
        </el-menu>
        <RouterView></RouterView>
      </el-col>
      <a-affix style="position: absolute;right: 5%;" :offset-top="top">
        <a-space direction="vertical">
          <a-tooltip :title="$t('tooltips.publish')">
          <a-button @click="goToPublish" type="primary" shape="circle" size="large"><PlusOutlined/></a-button>
          </a-tooltip>
          <a-tooltip :title="$t('tooltips.dailyTask')">
          <a-button @click="showDailyTaskModal"  shape="circle" size="large"><ClockCircleOutlined/></a-button>
          <a-modal :destroyOnClose="true" :footer="null" v-model:visible="dailyTaskModalVisible" title="DailyTask" @ok="handleOk">
      <daily-task></daily-task>
    </a-modal>
          </a-tooltip>
          <a-tooltip title="Auction">
            <a-button type="primary" shape="circle" size="large"><svg-icon name="auction" height="20" width="20" ></svg-icon></a-button>
          </a-tooltip>
          
        </a-space>
      </a-affix> 
      <el-col :xs="2" :sm="4" :md="4" :lg="3" :xl="3" class="hidden-sm-and-down">
        <div class="grid-content ep-bg-purple" />
      </el-col>
      <!-- <el-col :xs="2" :sm="4" :md="6" :lg="6" :xl="6" class="hidden-sm-and-down">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <div style="width:100%;float:left">MyBalance: 1000000</div>
              <div style="width:100%;float:left">
                <el-button class="button">Deposit</el-button>
                <el-button class="button">Withdraw</el-button>
                <el-button class="button">Entry</el-button>
              </div>
            </div>
          </template>
          <div class="text item">My Opus</div>
          <div class="text item">My Collect</div>
          <div class="text item">My Foucus</div>
          <div class="text item">My Message</div>
        </el-card>
      </el-col> -->

      
    </el-row>
  </div>
  
</template>
<style scoped>
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
}



.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 0px;
}

.box-card {
  width: 100%;
  line-height: 80px;
}

.opus-card {
  width: 100%;
  ;
  line-height: 30px;
  text-align: left;
}
</style>

<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { defineComponent } from 'vue'
import { ref } from 'vue'
import ad from './ad.vue'
import dailyTask from '../components/dailyTask.vue'
import 'element-plus/theme-chalk/display.css'
import store from '../store/index'
import { PlusOutlined, VerticalAlignTopOutlined, FieldTimeOutlined, ClockCircleOutlined, CrownOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'




export default defineComponent({
  components: { ad, PlusOutlined, VerticalAlignTopOutlined, FieldTimeOutlined, dailyTask, ClockCircleOutlined, CrownOutlined },
  name: 'myMain',
  setup() {
    const top = ref<number>(550);
    const item = {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    }
    const tableData = ref(Array.from({ length: 100 }).fill(item))
    const dailyTaskModalVisible = ref(false)
    const router = useRouter()

    const handleOk = () => {
      dailyTaskModalVisible.value = false
    }

    const showDailyTaskModal = () => {
      dailyTaskModalVisible.value = true
    }

    const goToPublish = () =>{
      const publishPage = router.resolve({
    path: '/publish'
  })
      window.open(publishPage.href, '_blank') 
    }


    return {
      tableData,
      data: store.state,
      top,
      goToPublish,
      dailyTaskModalVisible,
      handleOk,
      showDailyTaskModal
    }
  }
})
</script>