<template>
  <a-skeleton v-if="whileLoading" v-for="i in 10" :key="i"
    style="padding: 20px;background-color: #fff;border-radius: 10px; margin-bottom: 5px;" :loading="loading" active
    avatar></a-skeleton>
  <div v-else infinite-scroll-distance="1" v-infinite-scroll="load">
    <a-list style="background-color: #fff;border-radius: 10px;" item-layout="vertical" size="large"
      :data-source="pageList">
      <template #renderItem="{ item }">
        <a-list-item key="item.title">
          <template #actions>
            <a-tooltip title="share">
              <span>
                <ShareAltOutlined style="margin-right: 8px" />
              </span>
            </a-tooltip>
            <span style="cursor: pointer;"
              @click="item.collected = !item.collected; item.collectNum++; operateCollectFunction(item.id)"
              v-if="!item.collected">
              <StarOutlined style="margin-right: 8px" />{{ item.collectNum }}
            </span>
            <span style="cursor: pointer; "
              @click="item.collected = !item.collected;item.collectNum--; operateCollectFunction(item.id)"
              v-if="item.collected">
              <StarTwoTone two-tone-color="#FFD700" style="margin-right: 8px" />{{ item.collectNum }}
            </span>
            <a-tooltip title="Comment">
              <span>
                <MessageOutlined @click="openComment(item.id)" style="margin-right: 8px" />{{ item.commentNum }}
              </span>
            </a-tooltip>
            <span style="cursor: pointer;"
              @click="item.liked = !item.liked; item.likeNum++; operateLikeFunction(item.id, 0)" v-if="!item.liked">
              <LikeOutlined style="margin-right: 8px" />{{ item.likeNum }}
            </span>
            <span style="cursor: pointer;"
              @click="item.liked = !item.liked; item.likeNum--; operateLikeFunction(item.id, 0)" v-if="item.liked">
              <LikeTwoTone two-tone-color="#FF0000" style="margin-right: 8px" />{{ item.likeNum }}
            </span>

            <span>
              <FireTwoTone two-tone-color="#FF4500" style="margin-right: 8px" />{{item.hotScore}}
            </span>

            <a-tooltip title="Daily Staking">
              <span style="cursor: pointer;">
                <DollarCircleOutlined />
                <count-to :startVal="0" :endVal="1000" :decimals="2" :duration="3000"></count-to>
              </span>
            </a-tooltip>

          </template>
          <a-badge-ribbon v-if="item.minted === 1" text="Minted"></a-badge-ribbon>
          <a-list-item-meta :description="item.characterSign">
            <template #title>
              <a-space>
                <a @click="getUserProfile(item.userId)">{{ item.nickName }}</a>
                <a-button @click="item.focused = !item.focused; operateFocusFunction(item.userId)" v-if="!item.focused"
                  type="primary" size="small" danger>
                  <template #icon>
                    <PlusOutlined />
                  </template>
                  Focus
                </a-button>
                <a-button @click="item.focused = !item.focused; operateFocusFunction(item.userId)" v-if="item.focused"
                  size="small">
                  <template #icon>
                    <CheckOutlined />
                  </template>
                  Focused
                </a-button>

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



          <a-typography-title @click="getOpusByIdFunction(item.id)" style="text-align: center;cursor: pointer;"
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
              v-if="item.resourceCompressUrls != null && item.resourceCompressUrls != undefined && item.resourceCompressUrls.length > 0 && item.resourceCompressUrls.length < 5"
              v-for="(image, index) in item.resourceCompressUrls" class="preview-image"
              :src="image" :preview-src-list="item.resourceUrls" :initial-index="index" fit="cover">
              <!-- <template #viewer>
             <div v-if="index==1" class="image-slot">
           +123
          </div>
        </template> -->
            </el-image>
              
            <el-image
              v-if="item.resourceCompressUrls != null && item.resourceCompressUrls != undefined && item.resourceCompressUrls.length > 0 && item.resourceCompressUrls.length >= 5"
              v-for="image, index in item.resourceCompressUrls.slice(0,5)" class="preview-image"
              :class="{mask: index==1}" :src="image" :preview-src-list="item.resourceUrls" :initial-index="index"
              fit="cover">
            </el-image>
            

          </div>
        </a-list-item>
      </template>
      <a-skeleton v-for="i in 5" :key="i" style="padding: 20px;" :loading="loading" active avatar></a-skeleton>
    </a-list>
    <el-drawer v-model="commentDraw" title="Comment:" direction="rtl">
      <comment :value="opusId"></comment>
    </el-drawer>
  </div>


</template>
<script lang="ts" setup>
import { onMounted, onUpdated } from 'vue'
import { ref, reactive } from 'vue'
import { pageOpusList } from '../api/opus' //这里引入的就是刚刚添加的接口
import { operateFocus } from '../api/focus'
import { operateCollect } from '../api/collect'
import { operateLike } from '../api/like'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs';
import { StarOutlined, StarTwoTone, LikeTwoTone, LikeOutlined, MessageOutlined, DollarCircleOutlined, ShareAltOutlined, PlusOutlined, CheckOutlined, FireTwoTone } from '@ant-design/icons-vue';
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
  const param = { pageSize: pageSize, pageNo: pageNo, orderType: 0 }
  pageOpusList(param).then((res) => {
    currentPageList = res;
    pageList.value = pageList.value.concat(currentPageList)
    loading.value = false;
  })
}

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