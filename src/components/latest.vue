<template>
  <div infinite-scroll-distance="1" v-infinite-scroll="load">

    <a-list style="background-color: #fff;border-radius: 10px;" item-layout="vertical" size="large" :data-source="pageList">
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
          <a-list-item-meta   :description="item.characterSign">
            <template #title>
              <a>{{ item.nickName }}</a>
            </template>
            <template #avatar>
              <a-avatar :size="64" :src="item.avatarUrl" />
            </template>
          </a-list-item-meta>
          <p style="text-indent: 2em">
          {{ item.summary }}
        </p>
          <a-image-preview-group v-if="item.resourceUrls != null && item.resourceUrls != undefined && item.resourceUrls.length > 0">
            <a-image :width="200" v-for="image in item.resourceUrls" :src="image" />
          </a-image-preview-group>
        </a-skeleton>
        </a-list-item>
      </template>
    </a-list>
  </div>

  <el-drawer class="comment-drawer" v-model="commentDraw" title="Comment:" direction="rtl">
    <el-input v-model="comment" :rows="3" type="textarea" placeholder="Please input" />
    <Picker :data="emojiIndex" set="apple" @select="showEmoji" />
    <el-button @click="addCommentFunction(openOpusComment)" type="primary">
      add comment
    </el-button>
    <a-comment v-for="(comment, index) in pageCommentListResult" :key="index">
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
  </el-drawer>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { ref, reactive } from 'vue'
import { pageOpusList } from '../api/opus' //这里引入的就是刚刚添加的接口
import { pageCommentList, addComment, showAllCommentList } from '../api/comment'
import { Pointer, ChatDotSquare, Star } from '@element-plus/icons-vue'
import dayjs from 'dayjs';
import { StarOutlined, LikeFilled, LikeOutlined, DislikeFilled, DislikeOutlined, SendOutlined, MessageOutlined } from '@ant-design/icons-vue';
import relativeTime from 'dayjs/plugin/relativeTime';
import data from "emoji-mart-vue-fast/data/all.json";
// Note: component needs to be imported from /src subfolder:
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
import "emoji-mart-vue-fast/css/emoji-mart.css";
let emojiIndex = new EmojiIndex(data);

dayjs.extend(relativeTime);

const subCommentInputVisible = ref(false)
const count = ref(5)
const loading = ref(true)
const pageList = ref([])
let currentPageList: any = reactive([])
const pageSize = ref(5)
const pageNo = ref(1)
const commentDraw = ref(false)
const comment = ref('')
const subComment = ref('')
const pageCommentListResult = ref([])
const openOpusComment = ref(0)
const showMoreComments = ref(0)
const showMoreSubComments = ref(0)
const likes = ref<number>(0);
const dislikes = ref<number>(0);
const action = ref<string>();

const addCommentFunction = (opusId: number) => {
  if (comment.value == null || comment.value == undefined || comment.value == '') {
    return;
  }

  const param = {
    content: comment.value,
    fromUserId: 0,
    opusId: opusId,
    toUserId: 0
  }
  addComment(param).then((res) => {
    if (res) {
      comment.value = ''
      openComment(opusId);
    }
  })
}

const showMoreCommentsFunction = (opusId: number) => {
  const param = { pageNo: 1, pageSize: 5, opusId: opusId, showAllComments: true }
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

const showEmoji = (e) => {
  comment.value += e.native
}

function openComment(opusId: number) {
  const param = { pageNo: 1, pageSize: 5, opusId: opusId }
  openOpusComment.value = opusId;
  pageCommentList(param).then((res) => {
    if (res.list != null && res.list != undefined && res.list.length > 0) {
      commentDraw.value = true;
      pageCommentListResult.value = res.list;
      if (res.remainCommentNum > 0) {
        showMoreComments.value = res.remainCommentNum
      }
    }
  })

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
</style>