<template>
  <a-skeleton :loading="loading" avatar :paragraph="{ rows: 40 }" />
  <div v-if="flag">
    <a-card hoverable>
      <template #actions>
        <setting-outlined key="setting" />
        <edit-outlined key="edit" />
        <ellipsis-outlined key="ellipsis" />
      </template>
      <a-card-meta :title="data.nickName">
        <template #avatar>
          <a-avatar
            v-if="data.avatarUrl != '' && data.avatarUrl != undefined && data.avatarUrl != null"
            :src="data.avatarUrl"
            :size="64"
          />
          <a-avatar :size="64" v-else>{{ data.nickName }}</a-avatar>
        </template>
        
        <template #description>
          {{ data.characterSign }}
          <a-tooltip :title="data.gmtCreated">
                        <span
                          style="
                            color: #ccc;
                            font-size: 12px;
                            line-height: 18px;
                            white-space: nowrap;
                            float: right
                          "
                        >
                         registered {{ dayjs(data.gmtCreated).fromNow() }}
                        </span>
                      </a-tooltip>
        </template>
      </a-card-meta>
    </a-card>
    <a-card hoverable>
      <a-row :gutter="16">
        <a-col :span="5"><a-statistic title="OpusNum" :value="data.opusNum" /></a-col>
        <a-col :span="5"><a-statistic title="CommentNum" :value="data.commentNum" /></a-col>
        <a-col :span="5"><a-statistic title="LikedNum" :value="data.likedNum" /></a-col>
        <a-col :span="5"><a-statistic title="FocusNum" :value="data.focusNum" /></a-col>
        <a-col :span="4"><a-statistic title="FocusedNum" :value="data.focusedNum" /></a-col>
      </a-row>
    </a-card>
    <a-card hoverable style="width: 100%">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="Opus">
          <a-radio-group v-if="self" @change="opusStatusChange" v-model:value="opusStatus">
            <a-radio :value="0">待审核</a-radio>
            <a-radio :value="1">正常</a-radio>
            <a-radio :value="2">草稿</a-radio>
            <a-radio :value="4">审核失败</a-radio>
          </a-radio-group>
          <a-list class="demo-loadmore-list" item-layout="horizontal" :data-source="opusPageList">
            <template #loadMore>
              <div
                v-if="!opusLoading"
                :style="{
                  textAlign: 'center',
                  marginTop: '12px',
                  height: '32px',
                  lineHeight: '32px'
                }"
              >
                <a-button @click="onLoadMore">loading more</a-button>
              </div>
            </template>
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a
                    v-if="opusStatus != 0 && self"
                    key="list-loadmore-edit"
                    @click="goToPubilsh(item.id)"
                  >
                    edit
                  </a>
                  <a v-if="opusStatus == 2 && self" key="list-loadmore-more">publish</a>
                  <a v-if="self" key="list-loadmore-more">delete</a>
                  <a key="list-loadmore-more">more</a>
                </template>
                <a-list-item-meta>
                  <template #title>
                    <a-space>
                      <a>{{ item.title }}</a>

                      <a-tooltip :title="item.pubishTime">
                        <span
                          style="
                            color: #ccc;
                            font-size: 12px;
                            line-height: 18px;
                            white-space: nowrap;
                          "
                        >
                          {{ dayjs(item.pubishTime).fromNow() }}
                        </span>
                      </a-tooltip>
                    </a-space>
                  </template>
                  <template #description>
                    {{ item.summary }}
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Comment" force-render>Content of Tab Pane 2</a-tab-pane>
        <a-tab-pane key="3" tab="Collect">Content of Tab Pane 3</a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
  <a-result v-else status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <a-button type="primary" @click="backHome">Back Home</a-button>
    </template>
  </a-result>
</template>
  <script lang="ts" setup>
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProfile } from '../api/user'
import { pageProfileOpusList } from '../api/opus'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const flag = ref(false) //是否无效id 404页面
const data = ref({})
const router = useRouter()
const activeKey = ref('1')

const opusPageNo = ref(1)
const opusPageSize = ref(5)
const opusStatus = ref(1)
const opusPageTotal = ref(0)
const opusTotalPages = ref(0)
const opusPageList = ref([])
const opusLoading = ref(false)
const self = ref('false')
const loading = ref(true)

const getProfileFunction = () => {
  let param = { userId: router.currentRoute.value.params.userId }
  getProfile(param)
    .then(res => {
      loading.value = false
      flag.value = true
      data.value = res
      self.value = res.self
    })
    .catch(fallback => {
      loading.value = false
      flag.value = false
    })
}

const pageProfileOpusListFunction = () => {
  let param = {
    pageNo: opusPageNo.value,
    pageSize: opusPageSize.value,
    status: opusStatus.value,
    userId: router.currentRoute.value.params.userId
  }
  pageProfileOpusList(param).then(res => {
    opusPageList.value = opusPageList.value.concat(res.list)
    opusPageTotal.value = res.total
    opusTotalPages.value = res.totalPages
    opusLoading.value = false
  })
}

const opusStatusChange = () => {
  opusPageList.value = []
  opusLoading.value = true
  opusPageNo.value = 1
  pageProfileOpusListFunction()
}

const onLoadMore = () => {
  opusLoading.value = true
  opusPageNo.value += 1
  pageProfileOpusListFunction()
}

const goToPubilsh = (opusId: any) => {
  const publishPage = router.resolve({
    path: '/publish',
    query: { opusId: opusId }
  })
  window.open(publishPage.href, '_blank') // 打开新的窗口(跳转路径，跳转类型)
}

onMounted(() => {
  getProfileFunction()
  pageProfileOpusListFunction()
})

const backHome = () => {
  router.push('/index')
}
</script>