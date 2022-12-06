<template>
  <a-skeleton class="mySkeletion" v-if="whileLoading" v-for="i in 10" :key="i"
   :loading="loading" active
    avatar></a-skeleton>
  <div v-else infinite-scroll-distance="1" v-infinite-scroll="load">
    <a-list class="myList" id="111" item-layout="vertical" size="large"
      :data-source="pageList">
      <template #renderItem="{ item }">
        <a-list-item v-if="item.id != null && item.id != undefined && item.id != ''" key="item.title">
          <!-- <template #actions>
            </template> -->
          <a-badge-ribbon v-if="item.minted === 1" text="Minted"></a-badge-ribbon>
          <a-list-item-meta class="myMeta" :description="item.characterSign">
            <template #title>
              <a-space>
                <a-tooltip :title="$t('tooltips.profile')">
                  <a @click="getUserProfile(item.userId)">{{ item.nickName }}</a>
                </a-tooltip>
                <a-tooltip v-if="!item.focused" :title="$t('tooltips.focus')">
                  <a-button @click="item.focused = !item.focused; operateFocusFunction(item.userId)" type="text"
                    size="small">
                    <template #icon>
                      <CheckCircleOutlined />
                    </template>
                  </a-button>
                </a-tooltip>
                <a-tooltip v-if="item.focused" :title="$t('tooltips.focus')">
                  <a-button @click="item.focused = !item.focused; operateFocusFunction(item.userId)" type="text"
                    size="small">
                    <template #icon>
                      <CheckCircleTwoTone two-tone-color="#00FF00" />
                    </template>
                  </a-button>
                </a-tooltip>
                <!-- <template #datetime> -->
                <a-tooltip :title="item.publishTime">
                  <span style="font-size: 8px;line-height: 12px;white-space: nowrap;">{{
                      item.publishTimeString
                  }}</span>
                </a-tooltip>
                <!-- </template> -->
              </a-space>
            </template>

            <template #avatar>
              <a-avatar v-if="item.avatarUrl != null && item.avatarUrl != '' && item.avatarUrl != undefined" :size="50"
                :src="item.avatarUrl" />
              <a-avatar v-else :size="50">
                {{ item.nickName }}
              </a-avatar>
            </template>

          </a-list-item-meta>
          <a-typography-title @click="getOpusByIdFunction(item.id)" style="cursor: pointer;"
            v-if="item.title != null && item.title != '' && item.title != undefined" :level="5">{{ item.title }}
          </a-typography-title>
          <!-- <p style="text-indent: 2em">
            {{ item.summary }}
          </p> -->
          <a-typography-paragraph @click="getOpusByIdFunction(item.id)" style="cursor: pointer; text-indent: 2em">
            <blockquote>{{ item.summary }}</blockquote>
            <!-- <pre>{{ item.summary }}</pre> -->
          </a-typography-paragraph>
          <div style="text-align: center;">
            <el-image style="width:80px; height:80px"
              v-if="item.resourceCompressUrls != null && item.resourceCompressUrls != undefined && item.resourceCompressUrls.length > 0 && item.resourceCompressUrls.length"
              v-for="(image, index) in item.resourceCompressUrls" class="preview-image" :src="image"
              :preview-src-list="item.resourceUrls" :initial-index="index" fit="cover">
            </el-image>
          </div>
          <a-row style="text-align: center;margin-top: 10px;">
            <a-col :span="6"><span style="cursor: pointer;"
                @click="item.collected = !item.collected; item.collectNum++; operateCollectFunction(item.id)"
                v-if="!item.collected">
                <a-tooltip :title="$t('tooltips.collect')">
                  <StarOutlined style="margin-right: 2px" />{{ item.collectNum }}
                </a-tooltip>
              </span>


              <span style="cursor: pointer;"
                @click="item.collected = !item.collected; item.collectNum--; operateCollectFunction(item.id)"
                v-if="item.collected">
                <a-tooltip :title="$t('tooltips.collected')">
                  <StarTwoTone two-tone-color="#FFD700" style="margin-right: 2px" />{{ item.collectNum }}
                </a-tooltip>
              </span>

              <a-divider type="vertical" style="float: right;height:100%;"></a-divider>
            </a-col>
            <a-col :span="6">
              <a-tooltip :title="$t('tooltips.comment')">
                <span>
                  <MessageOutlined @click="openComment(item.id)" style="margin-right: 2px" />{{ item.commentNum }}
                </span>
              </a-tooltip>
              <a-divider type="vertical" style="float: right;height:100%;"></a-divider>
            </a-col>
            <a-col :span="6"><span style="cursor: pointer;"
                @click="item.liked = !item.liked; item.likeNum++; operateLikeFunction(item.id, 0)" v-if="!item.liked">
                <a-tooltip :title="$t('tooltips.like')">
                  <LikeOutlined style="margin-right: 2px" />{{ item.likeNum }}
                </a-tooltip>
              </span>


              <span style="cursor: pointer;"
                @click="item.liked = !item.liked; item.likeNum--; operateLikeFunction(item.id, 0)" v-if="item.liked">
                <a-tooltip :title="$t('tooltips.liked')">
                  <LikeTwoTone two-tone-color="#FF0000" style="margin-right: 2px" />{{ item.likeNum }}
                </a-tooltip>
              </span>
              <a-divider type="vertical" style="float: right;height:100%;"></a-divider>
            </a-col>
            <a-col :span="6">
              <a-tooltip :title="$t('tooltips.watch')">
                <span>
                  <EyeOutlined style="margin-right: 2px" />{{ item.watchNum }}
                </span>
              </a-tooltip>
            </a-col>

          </a-row>
          <a-divider style="margin: 10px 0;"></a-divider>
          <a-row style="text-align: center;">
            <a-col :span="6"><span style="cursor: pointer;">
                <a-tooltip :title="$t('tooltips.share')">
                  <ShareAltOutlined style="margin-right: 2px" />
                </a-tooltip>
              </span>
              <a-divider type="vertical" style="float: right;height:100%;"></a-divider>
            </a-col>
            <a-col :span="6">
              <a-tooltip :title="$t('tooltips.hot')">
                <span>
                  <FireTwoTone two-tone-color="#FF4500" style="margin-right: 2px" />{{ item.hotScore }}
                </span>
              </a-tooltip>
              <a-divider type="vertical" style="float: right;height:100%;"></a-divider>
            </a-col>

            <a-col :span="6">
              <a-tooltip :title="$t('tooltips.dailyStaking')">
                <span @click="dailyStakingModalVisible = true; opusId = item.id" style="cursor: pointer;">
                  <DollarCircleOutlined style="margin-right: 2px" />
                  <count-to :startVal="0" :endVal="item.currentStakingAmount" :decimals="2" :duration="3000"></count-to>
                </span>
              </a-tooltip>
              <a-divider type="vertical" style="float: right;height:100%;"></a-divider>
            </a-col>
            <!-- <a-col :span="6">
              <a-tooltip :title="$t('tooltips.reward')">
                <span
                  style="cursor: pointer;">
                  <EllipsisOutlined />
                </span>
              </a-tooltip>
            </a-col> -->
            <a-col :span="6">
              <a-tooltip :title="$t('tooltips.reward')">
                <span @click="rewardModalVisible = true; userId = item.userId, toNickName = item.nickName"
                  style="cursor: pointer;">
                  <GiftOutlined />
                </span>
              </a-tooltip>
            </a-col>
          </a-row>

        </a-list-item>

        <a-card v-else>
          <a-badge-ribbon text="Launch" color="green">
            <a-row>
              <a-col :span="24">
                <p style="font-weight: bold; font-size: 18px">{{ item.launchTitle }}</p>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="6">
                <a-image :width="70" :height="70"
                  fallback="data:image/png;base64,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"
                  :src="item.launchUrl"></a-image>
              </a-col>
              <a-col style="cursor: pointer;" :span="16">
                <p style="font-size: 10px; text-indent: 2em;">{{ item.launchDescription }}</p>
              </a-col>
            </a-row>
            <!-- <a-divider></a-divider> -->
            <a-row style="font-size: 12px; margin-top: 10px">
              <a-col :span="12">Want <a>Launch</a> ?</a-col>
              <a-col :span="12" >Launched By <a>{{ item.nickName }}</a></a-col>
            </a-row>
          </a-badge-ribbon>
        </a-card>

      </template>

      <a-skeleton v-for="i in 5" :key="i" style="padding: 20px;" :loading="loading" active avatar></a-skeleton>
      <a-back-top :visibilityHeight="100" :target="backToTop" />
    </a-list>
    <el-drawer size="80%" v-model="commentDraw" title="Comment:" direction="btt">
      <comment :value="opusId"></comment>
    </el-drawer>
    <a-modal :destroyOnClose="true" :footer="null" v-model:visible="dailyStakingModalVisible" title="DailyStaking"
      @ok="handleOk">
      <dailyStaking :opusId="opusId"></dailyStaking>
    </a-modal>
    <a-modal :destroyOnClose="true" :footer="null" v-model:visible="rewardModalVisible" title="Reward" @ok="handleOk">
      <reward :toUserId="userId" :toNickName="toNickName"></reward>
    </a-modal>
  </div>


</template>
<script lang="ts" setup>
import { onMounted, onUpdated, watch } from 'vue'
import { ref, reactive } from 'vue'
import { pageOpusList } from '../../api/opus' //这里引入的就是刚刚添加的接口
import { operateFocus } from '../../api/focus'
import { operateCollect } from '../../api/collect'
import { operateLike } from '../../api/like'
import { useRouter } from 'vue-router'
import { StarOutlined, StarTwoTone, LikeTwoTone, LikeOutlined, MessageOutlined, DollarCircleOutlined, ShareAltOutlined, PlusOutlined, CheckOutlined, FireTwoTone, CheckCircleOutlined, CheckCircleTwoTone, EyeOutlined, GiftOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
import { CountTo } from 'vue3-count-to'
import comment from '../comment.vue'
import dailyStaking from '../dailyStaking.vue'
import reward from '../reward.vue'




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
  if (currentPageList.length == 5 || currentPageList.length == 6) {
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

const backToTop = () => {
  return document.getElementById('111')
}

watch(() => router.currentRoute.value.name, (newValue, oldValue) => {
  if (newValue == "index") {
    orderType.value = 0;
  }
  if (newValue == "hot") {
    orderType.value = 1;
  }
  if (newValue == "focus") {
    orderType.value = 2;
  }
  currentPageList.value = []
  pageList.value = []
  pageNo.value = 1;
  pageSize.value = 5;
  getPageOpusList(pageNo.value, pageSize.value)
}, { immediate: true })

onMounted(() => {
  //getPageOpusList(pageNo.value, pageSize.value)
})

onUpdated(() => {
  whileLoading.value = false;
})
</script>
<style scoped>

.mySkeletion{
  padding: 20px;
  background-color: var(--theme_card_bg_color);
  color: var(--theme_card_text_color);
  border-radius: 10px; 
  margin-bottom: 5px;
}

.myList{
  border-radius: 10px;
  background-color: var(--theme_card_bg_color);
  color: var(--theme_card_text_color);
}

.a-list-item-meta{
  color: var(--theme_card_action_text_color);
}

.ant-typography {
  color: var(--theme_card_action_text_color);
}

.myMeta {
  color: var(--theme_card_action_text_color);
}

.ant-list-item{
  border-radius: 10px;
  margin-top: 5px;
  color: var(--theme_card_action_text_color);
}

.ant-divider{
  color: var(--theme_divider_color);
}
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