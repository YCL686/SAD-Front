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
            <router-link to="/index">{{ $t('menus.index') }}</router-link>
          </el-menu-item>
          <el-menu-item index="2">
            <router-link to="/hot">{{ $t('menus.hot') }}</router-link>
          </el-menu-item>
          <el-menu-item index="3">
            <router-link to="/focus">{{ $t('menus.focus') }}</router-link>
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
            <a-button @click="goToPublish" type="primary" shape="circle" size="large">
              <PlusOutlined />
            </a-button>
          </a-tooltip>
          <a-tooltip :title="$t('tooltips.dailyTask')">
            <a-button @click="showDailyTaskModal" shape="circle" size="large">
              <ClockCircleOutlined />
            </a-button>
            <a-modal :get-container = "false" class="myModal" :destroyOnClose="true" :footer="null" v-model:visible="dailyTaskModalVisible" title="DailyTask"
              @ok="handleOk">
              <daily-task></daily-task>
            </a-modal>
          </a-tooltip>
          
          <a-button @click="isActive = !isActive" type="primary" shape="circle" size="large">
              <DownOutlined v-if="!isActive" />
              <UpOutlined v-else/>
            </a-button>
          <collapse>
            <a-space direction="vertical" v-show="isActive">
            <a-tooltip title="Launch">
            <a-button @click="goToLaunch()" shape="circle" size="large">
              <ThunderboltOutlined />
            </a-button>
          </a-tooltip>
          <a-tooltip title="Auction">
            <a-button @click="goToAuction()" type="primary" shape="circle" size="large">
              <svg-icon name="auction" height="20" width="20"></svg-icon>
            </a-button>
          </a-tooltip>
          <a-tooltip title="Public">
            <a-button @click="goToPublic()" shape="circle" size="large">
              <SyncOutlined />
            </a-button>
          </a-tooltip>
          
        </a-space>
          </collapse>

        </a-space>
      </a-affix>
      <el-col :xs="2" :sm="4" :md="4" :lg="3" :xl="3" class="hidden-sm-and-down">
        <div class="grid-content ep-bg-purple" />
      </el-col>
    </el-row>
  </div>

</template>
<style scoped>

.el-menu--horizontal>.el-menu-item a, .el-menu--horizontal>.el-menu-item a:hover {
  background-color: var(--theme_header_bg_color);
  color: var(--theme_header_text_color);
}

.el-menu {
  background-color: var(--theme_header_bg_color);
  color: var(--theme_header_text_color);
}

.el-menu--horizontal>.el-menu-item.is-active {
  background-color: var(--theme_header_bg_color)!important;
  color: var(--theme_header_text_color)!important;
}

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

 .myModal {
  color: var(--theme_a_modal_text_color);
  background: var(--theme_a_modal_bg_color);
  background-color: var(--theme_a_modal_bg_color);
 }
 :deep() .ant-modal-header .ant-modal-body .ant-modal-content {
    color: var(--theme_a_modal_text_color)!important;
    background: var(--theme_a_modal_bg_color)!important;
    background-color: var(--theme_a_modal_bg_color)!important;
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
import ad from './AD.vue'
import dailyTask from '../components/dailyTask.vue'
import 'element-plus/theme-chalk/display.css'
import store from '../store/index'
import { PlusOutlined, VerticalAlignTopOutlined, FieldTimeOutlined, ClockCircleOutlined, CrownOutlined, SyncOutlined, ThunderboltOutlined, DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import collapse from "../utils/collapse";




export default defineComponent({
  components: { ad, PlusOutlined, VerticalAlignTopOutlined, FieldTimeOutlined, dailyTask, ClockCircleOutlined, CrownOutlined, SyncOutlined, ThunderboltOutlined, DownOutlined, UpOutlined },
  name: 'myMain',
  setup() {
    const top = ref<number>(420);
    const item = {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    }

    const isActive = ref(false)

    const tableData = ref(Array.from({ length: 100 }).fill(item))
    const dailyTaskModalVisible = ref(false)
    const router = useRouter()

    const handleOk = () => {
      dailyTaskModalVisible.value = false
    }

    const showDailyTaskModal = () => {
      dailyTaskModalVisible.value = true
    }

    const goToAuction = () => {
      const auctionPage = router.resolve({
        path: '/auction'
      })
      window.open(auctionPage.href, '_blank')
    }

    const goToPublish = () => {
      const publishPage = router.resolve({
        path: '/publish'
      })
      window.open(publishPage.href, '_blank')
    }

    const goToPublic = () => {
      const publicPage = router.resolve({
        path: '/public'
      })
      window.open(publicPage.href, '_blank')
    }

    const goToLaunch = () => {
      const launchPage = router.resolve({
        path: '/launch'
      })
      window.open(launchPage.href, '_blank')
    }


    return {
      tableData,
      data: store.state,
      top,
      isActive,
      goToPublish,
      goToAuction,
      goToPublic,
      goToLaunch,
      dailyTaskModalVisible,
      handleOk,
      showDailyTaskModal
    }
  }
})
</script>