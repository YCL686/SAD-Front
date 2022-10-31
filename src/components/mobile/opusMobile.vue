<template>
    <a-skeleton :loading="loading" avatar :paragraph="{ rows: 40 }" />
    <div v-if="!notFound">
      <a-list
        style="background-color: #fff; border-radius: 10px; margin-bottom: 5px"
        item-layout="vertical"
        size="large"
        :data-source="opus"
      >
        <template #renderItem="{ item }">
          <a-list-item key="item.title">
            <template #actions>
              <span style="cursor: pointer">
                <a-tooltip :title="$t('tooltips.share')">
                  <ShareAltOutlined style="margin-right: 8px" />
                </a-tooltip>
              </span>
  
              <span
                style="cursor: pointer"
                @click="item.collected = !item.collected;item.collectNum++;operateCollectFunction(item.id)"
                v-if="!item.collected"
              >
                <a-tooltip :title="$t('tooltips.collect')">
                  <StarOutlined style="margin-right: 2px" />
                  {{ item.collectNum }}
                </a-tooltip>
              </span>
  
              <span
                style="cursor: pointer"
                @click="item.collected = !item.collecteditem.collectNum--;operateCollectFunction(item.id)"
                v-if="item.collected"
              >
                <a-tooltip :title="$t('tooltips.collected')">
                  <StarTwoTone two-tone-color="#FFD700" style="margin-right: 2px" />
                  {{ item.collectNum }}
                </a-tooltip>
              </span>
  
              <a-tooltip :title="$t('tooltips.comment')">
                <span>
                  <MessageOutlined style="margin-right: 2px" />
                  {{ item.commentNum }}
                </span>
              </a-tooltip>
  
              <span
                style="cursor: pointer"
                @click="item.liked = !item.liked;item.likeNum++;operateLikeFunction(item.id, 0)"
                v-if="!item.liked"
              >
                <a-tooltip :title="$t('tooltips.like')">
                  <LikeOutlined style="margin-right: 2px" />
                  {{ item.likeNum }}
                </a-tooltip>
              </span>
  
              <span
                style="cursor: pointer"
                @click="item.liked = !item.liked;item.likeNum--;operateLikeFunction(item.id, 0)"
                v-if="item.liked"
              >
                <a-tooltip :title="$t('tooltips.liked')">
                  <LikeTwoTone two-tone-color="#FF0000" style="margin-right: 2px" />
                  {{ item.likeNum }}
                </a-tooltip>
              </span>
  
              <a-tooltip :title="$t('tooltips.watch')">
                <span>
                  <EyeOutlined style="margin-right: 2px" />
                  {{ item.watchNum }}
                </span>
              </a-tooltip>
  
              <a-tooltip :title="$t('tooltips.hot')">
                <span>
                  <FireTwoTone two-tone-color="#FF4500" style="margin-right: 2px" />
                  {{ item.hotScore }}
                </span>
              </a-tooltip>
  
              <a-tooltip :title="$t('tooltips.dailyStaking')">
                <span style="cursor: pointer">
                  <DollarCircleOutlined />
                  <count-to :startVal="0" :endVal="1000" :decimals="2" :duration="3000"></count-to>
                </span>
              </a-tooltip>
  
              <a-tooltip :title="$t('tooltips.reward')">
                <span style="cursor: pointer">
                  <GiftOutlined />
                  <count-to :startVal="0" :endVal="1000" :decimals="2" :duration="3000"></count-to>
                </span>
              </a-tooltip>
            </template>
            <!-- <template #extra>
              <img
                width="272"
                alt="logo"
                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
              />
            </template> -->
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
  
                <a-tooltip :title="item.publishTime">
                  <span style="color: #ccc; font-size: 12px; line-height: 18px; white-space: nowrap">
                    {{ dayjs(item.publishTime).fromNow() }}
                  </span>
                </a-tooltip>
                </a-space>
              </template>
              <template #avatar>
                <a-avatar
                  v-if="item.avatarUrl != null && item.avatarUrl != undefined && item.avatarUrl != ''"
                  :size="40"
                  :src="item.avatarUrl"
                />
                <a-avatar v-else :size="40">{{ item.nickName }}</a-avatar>
              </template>
            </a-list-item-meta>
          <el-divider />
            <a-typography-title
              v-if="item.title != null && item.title != '' && item.title != undefined"
              :level="5"
            >
              {{ item.title }}
            </a-typography-title>
            
            <!-- <p style="text-indent: 2em">
              {{ item.summary }}
            </p> -->
            <div style="border: none" class="ql-container ql-snow">
              <div class="ql-editor" v-html="item.content"></div>
            </div>
          </a-list-item>
        </template>
      </a-list>
      <a-card style="border-radius: 12px"><comment :value="opusId"></comment></a-card>
    </div>
  
    <a-result v-else status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
      <template #extra>
        <a-button type="primary" @click="backHome">Back Home</a-button>
      </template>
    </a-result>
  </template>
  <script lang="ts" setup>
  import { onMounted, onUpdated } from 'vue'
  import { ref, reactive } from 'vue'
  import comment from '../comment.vue'
  import { getOpusById } from '../../api/opus'
  import { operateLike } from '../../api/like'
  import { operateFocus } from '../../api/focus'
  import { operateCollect } from '../../api/collect'
  import { CountTo } from 'vue3-count-to'
  import { useRouter } from 'vue-router'
  import dayjs from 'dayjs'
  import {
    ShareAltOutlined,
    StarOutlined,
    StarTwoTone,
    LikeOutlined,
    LikeTwoTone,
    EyeOutlined,
    SendOutlined,
    MessageOutlined,
    SmileOutlined,
    DollarCircleOutlined,
    FireOutlined,
    FireTwoTone,
    GiftOutlined,
    CheckCircleOutlined, 
    CheckCircleTwoTone,
  } from '@ant-design/icons-vue'
  import relativeTime from 'dayjs/plugin/relativeTime'
  dayjs.extend(relativeTime)
  
  const loading = ref(true)
  
  const likes = ref<number>(0)
  const dislikes = ref<number>(0)
  const action = ref<string>()
  const router = useRouter()
  const opus = ref([])
  const opusId = ref('')
  const notFound = ref(true)
  
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
  
  const getOpusByIdFunction = () => {
    let param = { opusId: opusId.value }
    getOpusById(param)
      .then(res => {
        loading.value = false
        if (res != null && res != undefined) {
          opus.value.push(res)
          notFound.value = false
        }
      })
      .catch(fallback => {
        loading.value = false
        notFound.value = true
      })
  }
  
  const backHome = () => {
    router.push('/index')
  }
  
  onMounted(() => {
    opusId.value = router.currentRoute.value.params.opusId
    getOpusByIdFunction()
  })
  </script>
  <style scoped>
  </style>