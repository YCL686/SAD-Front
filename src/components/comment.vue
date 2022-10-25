<template>
    <el-input style="margin-bottom: 10px;" v-model="commentContent" :rows="3" type="textarea" placeholder="Please input" />
    <div style="display: flex;">
      <a-space style="margin-left: auto;">
        <a-popover title="emoji" trigger="click">
          <template #content>
            <Picker :data="emojiIndex" set="apple" @select="showEmoji" />
          </template>
          <a-button shape="circle"><template #icon>
              <SmileOutlined />
            </template></a-button>
        </a-popover>

        <el-button @click="addCommentFunction(null, commentContent, 0)" type="primary">
          add comment
        </el-button>
        <el-button>
          clear
        </el-button>
      </a-space>
    </div>
    <a-empty
      v-if="pageCommentListResult == null || pageCommentListResult == undefined || pageCommentListResult.length == 0"
      :description="null" />
    <a-comment v-else v-for="(comment, index) in pageCommentListResult" :key="index">
      <template #actions>
        
          <a-tooltip title="Like">
            <span style="cursor: pointer;" @click="comment.liked = !comment.liked; comment.likedNum++; operateLikeFunction(comment.id, 1)" v-if="!comment.liked">
              <LikeOutlined style="margin-right: 8px" />{{ comment.likedNum }}
            </span>
            <span style="cursor: pointer;" @click="comment.liked = !comment.liked; comment.likedNum--; operateLikeFunction(comment.id, 1)" v-if="comment.liked">
              <LikeTwoTone two-tone-color="#FF0000" style="margin-right: 8px" />{{ comment.likedNum }}
            </span>
          </a-tooltip>
        <span @click="commentIndex[index] = !commentIndex[index]" key="comment-basic-reply-to">Reply to</span>
      </template>
      <el-input v-if="commentIndex[index] == true" style="margin-bottom: 10px;" v-model="subCommentContent" :rows="3" type="textarea" placeholder="Please input" />
    <div v-if="commentIndex[index] == true" style="display: flex;">
      <a-space style="margin-left: auto;">
        <a-popover title="emoji" trigger="click">
          <template #content>
            <Picker :key="index" :data="emojiIndex" set="apple" @select="showEmojiSub" />
          </template>
          <a-button shape="circle"><template #icon>
              <SmileOutlined />
            </template></a-button>
        </a-popover>

        <el-button @click="addCommentFunction(comment.id, subCommentContent, comment.fromUserId);commentIndex[index] = false" type="primary">
          add comment
        </el-button>
        <el-button>
          clear
        </el-button>
      </a-space>
    </div>      
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
          <a-tooltip title="Like">
            <span style="cursor: pointer;" @click="subComment.liked = !subComment.liked; subComment.likedNum++; operateLikeFunction(subComment.id, 1)" v-if="!subComment.liked">
              <LikeOutlined style="margin-right: 8px" />{{ subComment.likedNum }}
            </span>
            <span style="cursor: pointer;" @click="subComment.liked = !subComment.liked; subComment.likedNum--; operateLikeFunction(subComment.id, 1)" v-if="subComment.liked">
              <LikeTwoTone two-tone-color="#FF0000" style="margin-right: 8px" />{{ subComment.likedNum }}
            </span>
          </a-tooltip>
          <span @click="subComment.showReply = !subComment.showReply" key="comment-basic-reply-to">Reply to</span>
          
        </template>
        <el-input v-if="subComment.showReply == true" style="margin-bottom: 10px;" v-model="subCommentContent" :rows="3" type="textarea" placeholder="Please input" />
    <div v-if="subComment.showReply == true" style="display: flex;">
      <a-space style="margin-left: auto;">
        <a-popover title="emoji" trigger="click">
          <template #content>
            <Picker :key="subIndex" :data="emojiIndex" set="apple" @select="showEmojiSub" />
          </template>
          <a-button shape="circle"><template #icon>
              <SmileOutlined />
            </template></a-button>
        </a-popover>

        <el-button @click="addCommentFunction(comment.id, subCommentContent, subComment.fromUserId);subComment.showReply = false" type="primary">
          add comment
        </el-button>
        <el-button>
          clear
        </el-button>
      </a-space>
    </div>
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
      <a @click="pageCommentListFunction(false, true, comment.id, index); comment.remainCommentNum = 0" v-if="comment.remainCommentNum>0">show more {{comment.remainCommentNum}}
      comments</a>
    </a-comment>
    <a @click="pageCommentListFunction(true, false, 0, 0)" v-if="showMoreComments>0">show more {{showMoreComments}}
      comments</a>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { ref, reactive } from 'vue'
import { pageCommentList, addComment } from '../api/comment'
import { operateLike } from '../api/like'
import {SmileOutlined, LikeOutlined, LikeTwoTone} from '@ant-design/icons-vue'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import data from "emoji-mart-vue-fast/data/all.json";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { string } from 'vue-types'
let emojiIndex = new EmojiIndex(data);

dayjs.extend(relativeTime);

const props = defineProps({
  		value: String,
	});
const commentContent = ref('')
const subCommentContent = ref('')
const pageCommentListResult = ref([])
const showMoreComments = ref(0)
const commentIndex = ref([])

watch(
  () => props.value,
  (newVal, oldVal) => {
    if( newVal != oldVal){
        pageCommentListResult.value = []
        showMoreComments.value = 0
        pageCommentListFunction(false, false, 0, 0)
    }
  }
)

const showEmoji = (e) => {
  commentContent.value += e.native
}

const showEmojiSub = (e) => {
  subCommentContent.value += e.native
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

const addCommentFunction = (parentId: any, comment: any, toUserId: any) => {
  if (comment == null || comment == undefined || comment == '') {
    return;
  }

  const param = {
    content: comment,
    fromUserId: 0,
    opusId: props.value,
    toUserId: toUserId,
    parentId: parentId
  }
  addComment(param).then((res) => {
    if (res) {
      commentContent.value = ''
      subCommentContent.value = ''
      pageCommentListResult.value = []
      showMoreComments.value = 0
      pageCommentListFunction(false, false, 0, 0)
    }
  })
}

const pageCommentListFunction = (showAllComments: boolean, showAllSubComments: boolean, subCommentParentId: any, index: any) =>{
    const param = { pageNo: 1, pageSize: 5, opusId: props.value, showAllComments: showAllComments, showAllSubComments: showAllSubComments, subCommentParentId: subCommentParentId }
  pageCommentList(param).then((res) => {
    if (res.list != null && res.list != undefined && res.list.length > 0) {
        if(subCommentParentId == 0){
        pageCommentListResult.value = pageCommentListResult.value.concat(res.list);
      res.list.forEach(() => {
        commentIndex.value.push(false)
      });

      if (res.remainCommentNum > 0) {
        showMoreComments.value = res.remainCommentNum
      }else{
        showMoreComments.value = 0
      }
    }else{
        pageCommentListResult.value[index].children = pageCommentListResult.value[index].children.concat(res.list[index].children);
    }
    }
  })
}

const showAllCommentsFunction = () =>{

}

onMounted(()=>{
    pageCommentListFunction(false, false, 0, 0)
})
</script>