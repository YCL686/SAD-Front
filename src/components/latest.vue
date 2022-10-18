<template>
  <div infinite-scroll-distance="1" v-infinite-scroll="load">

    <el-card class="opus-card" style="overflow: auto" v-for="(opus, index) in pageList" :key="index">
      <el-row>
        <el-col class="opus-header" :span="24">
          <el-image style="width: 4em; height: 4em; border-radius:3em;margin-right: 1em;" :src="opus.avatarUrl"
            :fit="fit" />
          <div class="opus-header-name">
            <span>{{opus.nickName}}</span><br />
            <span>{{opus.characterSign}}</span>
          </div>
        </el-col>
      </el-row>
      <el-divider />
      <el-row class="opus-content">
        <el-col span="24">{{opus.content}}</el-col>
      </el-row>
      <div v-if="opus.resourceUrls != undefined && opus.resourceUrls != null && opus.resourceUrls.length > 0">
        <el-image v-for="(image, index) in opus.resourceUrls" :key="index" style="width: 100px; height: 100px"
          :src="image" :preview-src-list="opus.resourceUrls" :initial-index="index" fit="cover" />
      </div>
      <el-divider />
      <el-row class="opus-nums">
        <el-col :span="7">
          <a>
            <el-icon>
              <Pointer />
            </el-icon>
            {{opus.likeNum}}
          </a>
        </el-col>
        <el-divider direction="vertical" />
        <el-col :span="7">
          <a @click="openComment(opus.id)">
            <el-icon>
              <ChatDotSquare />
            </el-icon>
            {{opus.replyNum}}
          </a>
        </el-col>
        <el-divider direction="vertical" />
        <el-col :span="7">
          <a>
            <el-icon>
              <Star />
            </el-icon>
            {{opus.collectNum}}
          </a>
        </el-col>
      </el-row>
      <el-skeleton :loading="loading" style="--el-skeleton-circle-size: 75px">
        <template #template>
          <el-skeleton-item variant="circle" />
        </template>
        <template #default>

        </template>
      </el-skeleton>

    </el-card>
  </div>

  <el-drawer class="comment-drawer" v-model="commentDraw" title="Comment:" direction="rtl">
    <el-input v-model="comment" :rows="3" type="textarea" placeholder="Please input" />
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
        <a-tooltip :title="dayjs().format(comment.gmtCreated)">
          <span>{{ dayjs().fromNow() }}</span>
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
    <a @click="showMoreCommentsFunction(openOpusComment)" v-if="showMoreComments>0">show more {{showMoreComments}} comments</a>
  </el-drawer>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { ref, reactive } from 'vue'
import { pageOpusList } from '../api/opus' //这里引入的就是刚刚添加的接口
import { pageCommentList, addComment, showAllCommentList } from '../api/comment'
import { Pointer, ChatDotSquare, Star } from '@element-plus/icons-vue'
import dayjs from 'dayjs';
import { LikeFilled, LikeOutlined, DislikeFilled, DislikeOutlined, SendOutlined } from '@ant-design/icons-vue';
import relativeTime from 'dayjs/plugin/relativeTime';
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

const addCommentFunction = (opusId: number) =>{
  if(comment.value == null || comment.value == undefined || comment.value == ''){
    return;
  }

  const param = {
    content: comment.value,
    fromUserId:0,
    opusId:opusId,
    toUserId:0
  }
  addComment(param).then((res)=>{
    if(res){
      comment.value = ''
      openComment(opusId);
    }
  })
}

const showMoreCommentsFunction = (opusId: number) =>{
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

function openComment(opusId: number) {
  const param = { pageNo: 1, pageSize: 5, opusId: opusId }
  openOpusComment.value = opusId;
  pageCommentList(param).then((res) => {
    if (res.list != null && res.list != undefined && res.list.length > 0) {
      commentDraw.value = true;
      pageCommentListResult.value = res.list;
      if(res.remainCommentNum > 0){
        showMoreComments.value = res.remainCommentNum
      }
    }
  })

}

function getPageOpusList(pageNo: number, pageSize: number) {

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