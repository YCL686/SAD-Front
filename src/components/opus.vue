<template>
    <div v-if="!notFound">
    <a-list style="background-color: #fff;border-radius: 10px;" item-layout="vertical" size="large" :data-source="opus">
        <template #renderItem="{ item }">
            <a-list-item key="item.title">
                <template #actions>
                    <span>
                        <StarOutlined style="margin-right: 8px" />{{ item.collectNum }}
                    </span>
                    <a-tooltip title="Comment">
                        <span>
                            <MessageOutlined @click="openComment(item.id)" style="margin-right: 8px" />{{ item.commentNum }}
                        </span>
                    </a-tooltip>
                    <span>
                        <LikeOutlined style="margin-right: 8px" />{{ item.likedNum }}
                    </span>
                </template>
                <!-- <template #extra>
            <img
              width="272"
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
          </template> -->
                <a-skeleton :loading="loading" active avatar>
                    <a-badge-ribbon v-if="item.minted === 1" text="Minted"></a-badge-ribbon>
                    <a-list-item-meta :description="item.characterSign">
                        <template #title>
                            <a>{{ item.nickName }}</a>
                        </template>
                        <template #avatar>
                            <a-avatar :size="64" :src="item.avatarUrl" />
                        </template>
                    </a-list-item-meta>
                    <template #datetime>
                        <a-tooltip :title="item.gmtCreated">
                            <span>{{ dayjs(item.gmtCreated).fromNow() }}</span>
                        </a-tooltip>
                    </template>
                    <a-typography-title style="text-align: center;"
                        v-if="item.title != null && item.title != '' && item.title != undefined" :level="4">
                        {{item.title}}</a-typography-title>
                    <!-- <p style="text-indent: 2em">
            {{ item.summary }}
          </p> -->
                    <div class="ql-container ql-snow">
                        <div class="ql-editor" v-html="item.content"> </div>
                    </div>

                </a-skeleton>
            </a-list-item>
        </template>
    </a-list>
    <a-card><comment :value="opusId"></comment></a-card>
    </div>
    
    <a-result v-else status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <a-button type="primary">Back Home</a-button>
    </template>
  </a-result>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { ref, reactive } from 'vue'
import { pageCommentList, addComment, showAllCommentList } from '../api/comment'
import comment from './comment.vue'
import { getOpusById } from '../api/opus'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs';
import { StarOutlined, LikeFilled, LikeOutlined, DislikeFilled, DislikeOutlined, SendOutlined, MessageOutlined, SmileOutlined } from '@ant-design/icons-vue';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const loading = ref(true)

const likes = ref<number>(0);
const dislikes = ref<number>(0);
const action = ref<string>();
const router = useRouter()
const opus = ref([])
const opusId = ref('')
const notFound = ref(true)

const like = () => {
    likes.value = 1;
    dislikes.value = 0;
    action.value = 'liked';
};

const dislike = () => {
    likes.value = 0;
    dislikes.value = 1;
    action.value = 'disliked';
};


const getOpusByIdFunction = () => {
    let param = { opusId: opusId.value }
    getOpusById(param).then(res => {
        loading.value = false
        if (res != null && res != undefined) {
            opus.value.push(res)
            notFound.value = false;
        }
    })

}

onMounted(() => {
    opusId.value = router.currentRoute.value.params.opusId
    getOpusByIdFunction()
})
</script>
<style scoped>

</style>