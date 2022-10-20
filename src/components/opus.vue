<template>
    <div v-if="!notFound">
    <a-list style="background-color: #fff;border-radius: 10px;" item-layout="vertical" size="large" :data-source="opus">
        <template #renderItem="{ item }">
            <a-list-item key="item.title">
                <template #actions>
                    <span>
                        <StarOutlined style="margin-right: 8px" />{{ 10 }}
                    </span>
                    <a-tooltip title="Comment">
                        <span>
                            <MessageOutlined @click="openComment(item.id)" style="margin-right: 8px" />{{ 30 }}
                        </span>
                    </a-tooltip>
                    <span>
                        <LikeOutlined style="margin-right: 8px" />{{ 10 }}
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
    <a-card title="Comments" style="width: 100%; margin-top: 10px; border-radius: 10px;">
    <template #extra><a href="#">more</a></template>
    <el-input style="margin-bottom: 10px;" v-model="comment" :rows="3" type="textarea" placeholder="Please input" />
  <div style="flex-grow: 1;display: flex;">
    <a-space style="margin-left: auto;">
  <a-popover title="emoji" trigger="click">
      <template #content>
        <Picker :data="emojiIndex" set="apple" @select="showEmoji" />
      </template>
      <a-button shape="circle"><template #icon><SmileOutlined/></template></a-button>
    </a-popover>

    <el-button @click="addCommentFunction()" type="primary">
        add comment
    </el-button>
    <el-button>
        clear
    </el-button>
    </a-space>
</div>
    
  
    <a-empty v-if="pageCommentListResult == null || pageCommentListResult == undefined || pageCommentListResult.length == 0" :description="null" />
    <a-comment v-else v-for="(comment, index) in pageCommentListResult" :key="index">
        <template #actions>
            <span key="comment-basic-like">
                <a-tooltip title="Like">
                    <template v-if="action === 'liked'">
                        <LikeFilled @click="like" />
                    </template>
                    <template v-else>
                        <LikeOutlined @click="like" />
                    </template>
                </a-tooltip>
                <span style="padding-left: 8px; cursor: auto">
                    {{ likes }}
                </span>
            </span>
            <span key="comment-basic-dislike">
                <a-tooltip title="Dislike">
                    <template v-if="action === 'disliked'">
                        <DislikeFilled @click="dislike" />
                    </template>
                    <template v-else>
                        <DislikeOutlined @click="dislike" />
                    </template>
                </a-tooltip>
                <span style="padding-left: 8px; cursor: auto">
                    {{ dislikes }}
                </span>
            </span>
            <span key="comment-basic-reply-to">Reply to</span>

        </template>
        <template #author><a>{{comment.fromNickName}}</a></template>
        <template #avatar>
            <a-avatar :src="comment.fromAvatarUrl" :alt="comment.fromNickName" />
        </template>
        <template #content>
            <p>
                {{comment.content}}
            </p>
        </template>
        <template #datetime>
            <a-tooltip :title="comment.gmtCreated">
                <span>{{ dayjs(comment.gmtCreated).fromNow() }}</span>
            </a-tooltip>
        </template>
        <a-comment v-if="comment.children != null && comment.children != undefined && comment.children.length > 0"
            v-for="(subComment, subIndex) in comment.children" :key="subIndex">
            <template #actions>
                <span key="comment-basic-like">
                    <a-tooltip title="Like">
                        <template v-if="action === 'liked'">
                            <LikeFilled @click="like" />
                        </template>
                        <template v-else>
                            <LikeOutlined @click="like" />
                        </template>
                    </a-tooltip>
                    <span style="padding-left: 8px; cursor: auto">
                        {{ likes }}
                    </span>
                </span>
                <span key="comment-basic-dislike">
                    <a-tooltip title="Dislike">
                        <template v-if="action === 'disliked'">
                            <DislikeFilled @click="dislike" />
                        </template>
                        <template v-else>
                            <DislikeOutlined @click="dislike" />
                        </template>
                    </a-tooltip>
                    <span style="padding-left: 8px; cursor: auto">
                        {{ dislikes }}
                    </span>
                </span>
                <span @click="" key="comment-basic-reply-to">Reply to</span>
                <!-- <el-input v-if="subCommentInputVisible = false" v-model="subComment" :rows="3" type="textarea" placeholder="Please input" /> -->
            </template>
            <template #author><a>{{subComment.fromNickName}}</a> @ <a>{{subComment.toNickName}}</a></template>
            <template #avatar>
                <a-avatar :src="subComment.fromAvatarUrl" :alt="subComment.fromNickName" />
            </template>
            <template #content>
                <p>
                    {{subComment.content}}
                </p>
            </template>
            <template #datetime>
                <a-tooltip :title="subComment.gmtCreated">
                    <span>{{ dayjs(subComment.gmtCreated).fromNow() }}</span>
                </a-tooltip>
            </template>
        </a-comment>
    </a-comment>
    <a @click="showMoreCommentsFunction(openOpusComment)" v-if="showMoreComments>0">show more {{showMoreComments}}
        comments</a>
    </a-card>
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
import { getOpusById } from '../api/opus'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs';
import { StarOutlined, LikeFilled, LikeOutlined, DislikeFilled, DislikeOutlined, SendOutlined, MessageOutlined, SmileOutlined } from '@ant-design/icons-vue';
import relativeTime from 'dayjs/plugin/relativeTime';
import data from "emoji-mart-vue-fast/data/all.json";
// Note: component needs to be imported from /src subfolder:
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
import "emoji-mart-vue-fast/css/emoji-mart.css";
let emojiIndex = new EmojiIndex(data);

dayjs.extend(relativeTime);

const loading = ref(true)

const comment = ref('')
const pageCommentListResult = ref([])
const openOpusComment = ref(0)
const showMoreComments = ref(0)
const likes = ref<number>(0);
const dislikes = ref<number>(0);
const action = ref<string>();
const router = useRouter()
const opus = ref([])
const opusId = ref('')
const notFound = ref(true)

const addCommentFunction = () => {
    if (comment.value == null || comment.value == undefined || comment.value == '') {
        return;
    }

    const param = {
        content: comment.value,
        fromUserId: 0,
        opusId: opusId.value,
        toUserId: 0
    }
    addComment(param).then((res) => {
        if (res) {
            comment.value = ''
            openComment();
        }
    })
}

const showMoreCommentsFunction = () => {
    const param = { pageNo: 1, pageSize: 5, opusId: opusId.value, showAllComments: true }
    pageCommentList(param).then((res) => {
        if (res.list != null && res.list != undefined && res.list.length > 0) {
            pageCommentListResult.value = res.list;
            showMoreComments.value = 0
        }
    })
}

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


const showEmoji = (e) => {
    comment.value += e.native
}

function openComment() {
    const param = { pageNo: 1, pageSize: 5, opusId: opusId.value }
    pageCommentList(param).then((res) => {
        if (res.list != null && res.list != undefined && res.list.length > 0) {
            pageCommentListResult.value = res.list;
            if (res.remainCommentNum > 0) {
                showMoreComments.value = res.remainCommentNum
            }
        }
    })

}


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
    openComment()
})
</script>
<style scoped>

</style>