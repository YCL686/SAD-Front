<template>
  <a-skeleton v-if="whileLoading" v-for="i in 10" :key="i"
    style="padding: 20px;background-color: #fff;border-radius: 10px; margin-bottom: 5px;" :loading="loading" active
    avatar></a-skeleton>
  <div v-else infinite-scroll-distance="1" v-infinite-scroll="load">
    <a-list id="111" style="background-color: #fff;border-radius: 10px" item-layout="vertical" size="large"
      :data-source="pageList">
      <template #renderItem="{ item }">
        <a-list-item key="item.title">
          <template #actions>
            
              <span style="cursor: pointer;">
                <a-tooltip :title="$t('tooltips.share')">
                <ShareAltOutlined style="margin-right: 8px" />
                </a-tooltip>
              </span>
            
            
            <span style="cursor: pointer;"
              @click="item.collected = !item.collected; item.collectNum++; operateCollectFunction(item.id)"
              v-if="!item.collected">
              <a-tooltip :title="$t('tooltips.collect')">
              <StarOutlined style="margin-right: 8px" />{{ item.collectNum }}
              </a-tooltip>
            </span>
            
            
            <span style="cursor: pointer; "
              @click="item.collected = !item.collected;item.collectNum--; operateCollectFunction(item.id)"
              v-if="item.collected">
              <a-tooltip :title="$t('tooltips.collected')">
              <StarTwoTone two-tone-color="#FFD700" style="margin-right: 8px" />{{ item.collectNum }}
              </a-tooltip>
            </span>
            
            <a-tooltip :title="$t('tooltips.comment')">
              <span>
                <MessageOutlined @click="openComment(item.id)" style="margin-right: 8px" />{{ item.commentNum }}
              </span>
            </a-tooltip>
            
            <span style="cursor: pointer;"
              @click="item.liked = !item.liked; item.likeNum++; operateLikeFunction(item.id, 0)" v-if="!item.liked">
              <a-tooltip :title="$t('tooltips.like')">
              <LikeOutlined style="margin-right: 8px" />{{ item.likeNum }}
              </a-tooltip>
            </span>
            
            
            <span style="cursor: pointer;"
              @click="item.liked = !item.liked; item.likeNum--; operateLikeFunction(item.id, 0)" v-if="item.liked">
              <a-tooltip :title="$t('tooltips.liked')">
              <LikeTwoTone two-tone-color="#FF0000" style="margin-right: 8px" />{{ item.likeNum }}
              </a-tooltip>
            </span>

            <a-tooltip :title="$t('tooltips.watch')">
            <span>
              <EyeOutlined style="margin-right: 8px" />{{item.watchNum}}
            </span>
            </a-tooltip>
            
            <a-tooltip :title="$t('tooltips.hot')">
            <span>
              <FireTwoTone two-tone-color="#FF4500" style="margin-right: 8px" />{{item.hotScore}}
            </span>
            </a-tooltip>

            <a-tooltip :title="$t('tooltips.dailyStaking')">
              <span @click="dailyStakingModalVisible = true; opusId = item.id" style="cursor: pointer;">
                <DollarCircleOutlined style="margin-right: 8px" />
                <count-to :startVal="0" :endVal="item.currentStakingAmount" :decimals="2" :duration="3000"></count-to>
              </span>
            </a-tooltip>

            <a-tooltip :title="$t('tooltips.reward')">
              <span @click="rewardModalVisible = true; userId = item.userId, toNickName = item.nickName" style="cursor: pointer;">
                <GiftOutlined />
              </span>
            </a-tooltip>

          </template>
          <a-badge-ribbon v-if="item.minted === 1" text="Minted"></a-badge-ribbon>
          <a-list-item-meta :description="item.characterSign">
            <template #title>
              <a-space>
                <a-tooltip :title="$t('tooltips.profile')">
                <a @click="getUserProfile(item.userId)">{{ item.nickName }}</a>
                </a-tooltip>
                <a-tooltip v-if="!item.focused" :title = "$t('tooltips.focus')">
                <a-button @click="item.focused = !item.focused; operateFocusFunction(item.userId)" 
                  type="text" size="small">
                  <template #icon>
                    <CheckCircleOutlined />
                  </template>
                </a-button>
                </a-tooltip>
                <a-tooltip v-if="item.focused" :title="$t('tooltips.focus')">
                <a-button @click="item.focused = !item.focused; operateFocusFunction(item.userId)" 
                type="text"
                  size="small">
                  <template #icon>
                    <CheckCircleTwoTone two-tone-color="#00FF00" />
                  </template>
                </a-button>
                </a-tooltip>
                <!-- <template #datetime> -->
                <a-tooltip :title="item.publishTime">
                  <span style="color: #ccc;font-size: 12px;line-height: 18px;white-space: nowrap;">{{
                  dayjs(item.publishTime).fromNow() }}</span>
                </a-tooltip>
                <!-- </template> -->
              </a-space>
            </template>

            <template #avatar>
              <a-avatar v-if="item.avatarUrl != null &&item.avatarUrl != '' && item.avatarUrl != undefined" :size="64"
                :src="item.avatarUrl" />
              <a-avatar v-else :size="64">
                {{item.nickName}}
              </a-avatar>
            </template>

          </a-list-item-meta>
          <a-typography-title @click="getOpusByIdFunction(item.id)" style="text-indent: 2em;cursor: pointer;"
            v-if="item.title != null && item.title != '' && item.title != undefined" :level="4">{{item.title}}
          </a-typography-title>
          <!-- <p style="text-indent: 2em">
          {{ item.summary }}
        </p> -->
          <a-typography-paragraph @click="getOpusByIdFunction(item.id)" style="cursor: pointer; text-indent: 2em">
            <blockquote>{{ item.summary }}</blockquote>
            <!-- <pre>{{ item.summary }}</pre> -->
          </a-typography-paragraph>
          <div style="text-align: center;">
            <el-image
              v-if="item.resourceCompressUrls != null && item.resourceCompressUrls != undefined && item.resourceCompressUrls.length > 0 && item.resourceCompressUrls.length"
              v-for="(image, index) in item.resourceCompressUrls" class="preview-image"
              :src="image" :preview-src-list="item.resourceUrls" :initial-index="index" fit="cover">
            </el-image>
          </div>
          
        </a-list-item>
      </template>
      <a-skeleton v-for="i in 5" :key="i" style="padding: 20px;" :loading="loading" active avatar></a-skeleton>
      <a-back-top :visibilityHeight="100" :target="backToTop" />
    </a-list>
    <el-drawer v-model="commentDraw" title="Comment:" direction="rtl">
      <comment :value="opusId"></comment>
    </el-drawer>
    <a-modal :destroyOnClose="true" :footer="null" v-model:visible="dailyStakingModalVisible" title="DailyStaking" @ok="handleOk">
      <dailyStaking :opusId="opusId"></dailyStaking>
    </a-modal>
    <a-modal :destroyOnClose="true" :footer="null" v-model:visible="rewardModalVisible" title="Reward" @ok="handleOk">
      <reward :toUserId="userId" :toNickName = "toNickName"></reward>
    </a-modal>
  </div>

</template>
<script lang="ts" setup>
import { onMounted, onUpdated } from 'vue'
import { ref, reactive, watch } from 'vue'
import { pageOpusList } from '../api/opus' //这里引入的就是刚刚添加的接口
import { operateFocus } from '../api/focus'
import { operateCollect } from '../api/collect'
import { operateLike } from '../api/like'
import { useRouter } from 'vue-router'
import dailyStaking from '../components/dailyStaking.vue'
import reward from '../components/reward.vue'
import dayjs from 'dayjs';
import { StarOutlined, StarTwoTone, LikeTwoTone, LikeOutlined, MessageOutlined, DollarCircleOutlined, ShareAltOutlined, PlusOutlined, CheckOutlined, FireTwoTone, CheckCircleOutlined, CheckCircleTwoTone, EyeOutlined, GiftOutlined, ExclamationCircleOutlined} from '@ant-design/icons-vue';
import { CountTo } from 'vue3-count-to'
import relativeTime from 'dayjs/plugin/relativeTime';
import comment from './comment.vue'
dayjs.extend(relativeTime);


const whileLoading = ref(true)
const count = ref(5)
const loading = ref(true)
const pageList = ref([])
let currentPageList: any = reactive([])
const pageSize = ref(5)
const pageNo = ref(1)
const commentDraw = ref(false)
const router = useRouter()
const opusId = ref()
const userId = ref()
const toNickName = ref()
const dailyStakingModalVisible = ref(false)
const rewardModalVisible = ref(false)
const orderType = ref(0)

const handleOk = () => {
  dailyStakingModalVisible.value = false
  rewardModalVisible.value = false
}


const load = () => {
  loading.value = true;
  count.value = pageList.value.length;
  if (currentPageList.length == 5) {
    pageNo.value++
    getPageOpusList(pageNo.value, pageSize.value)
  } else {
    loading.value = false
  }
}

const getOpusByIdFunction = (opusId: string) => {
  const opusPage = router.resolve({
    path: '/opus/' + opusId
  })
  window.open(opusPage.href, '_blank') // 打开新的窗口(跳转路径，跳转类型)
}

const operateFocusFunction = (focusedId: any) => {
  let param = { focusedId: focusedId }
  operateFocus(param).then(res => {
    if (res) {
      console.log(res.data)
    }
  })
}

const operateCollectFunction = (opusId: any) => {
  let param = { opusId: opusId }
  operateCollect(param).then(res => {
    console.log(res)
  })
}

const operateLikeFunction = (likedId: any, likedType: any) => {
  let param = {
    likedId: likedId,
    likedType: likedType
  }
  operateLike(param).then(res => {
    console.log(res)
  })
}

const getUserProfile = (userId: any) => {
  const profilePage = router.resolve({
    path: '/profile/' + userId
  })
  window.open(profilePage.href, '_blank') // 打开新的窗口(跳转路径，跳转类型)
}

const openComment = (id: any) => {
  opusId.value = id;
  commentDraw.value = true;
}

function getPageOpusList(pageNo: number, pageSize: number) {
  loading.value = true
  const param = { pageSize: pageSize, pageNo: pageNo, orderType: orderType.value }
  pageOpusList(param).then((res) => {
    currentPageList = res;
    pageList.value = pageList.value.concat(currentPageList)
    loading.value = false;
  })
}

const backToTop = () =>{
  return document.getElementById('111')
}

watch(() =>router.currentRoute.value.name,(newValue,oldValue)=> {
    if(newValue == "index"){
    orderType.value = 0;
  }
  if(newValue == "hot"){
    orderType.value = 1;
  }
  currentPageList.value = []
  pageList.value = []
  pageNo.value = 1;
  pageSize.value = 5;
 getPageOpusList(pageNo.value, pageSize.value)
},{ immediate: true })

onMounted(() => {
  getPageOpusList(pageNo.value, pageSize.value)
})

onUpdated(() => {
  whileLoading.value = false;
})
</script>
<style scoped>
.opus-card {
  text-align: left;
  line-height: 30px;
  font-size: 16px;
  padding-left: 10px;
  padding-right: 10px;
}

.opus-header {
  display: flex;
  align-items: center;
  margin-left: 1em;
}

.opus-header-name {}


.opus-content {
  text-indent: 2em
}

.opus-nums {
  text-align: center;
}

.comment-drawer {
  text-align: left;
}

.preview-image {
  width: 200px;
  height: 200px;
}

.mask {
  background-color: black;
  opacity: .5;
  z-index: 100;
  filter: alpha(opacity=10);
}
</style>