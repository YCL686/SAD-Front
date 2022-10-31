<template>
  <a-spin :spinning="uploadLoading">
  <a-card v-if="!publishSuccess" id="upload" title="Create Your Opus">
    <template #extra>
      <a-button type="primary" @click="pubilshFunction(0)">{{ $t('buttons.publish') }}</a-button>
      <a-button @click="pubilshFunction(1)">{{ $t('buttons.stage') }}</a-button>
    </template>
    <a-input v-model:value="title" :placeholder="$t('inputs.title')" />
    <el-upload class="avatar-uploader" :action="uploadResourceUrl" :accept="'image/*,video/*'" :show-file-list="false"
      :on-success="uploadResourceSuccess" :on-error="uploadResourceError" :before-upload="beforeResourceUpload"
      :headers="headers">
    </el-upload>
    
      <QuillEditor ref="quillRef" v-model="content" style="min-height: 900px" theme="snow" :options="data.editorOption"
        :modules="data.modules" content-type="html" enable :content="desc" />
    
  </a-card>
  <a-result v-else status="success" title="Successfully Publish Your Awsome Opus!"
    sub-title="Waiting For The Audited Result...">
    <template #extra>
      <a-button key="console" type="primary" @click="createOneMore">Create One More</a-button>
      <a-button key="console" @click="goBack">Go Back</a-button>
    </template>
  </a-result>
  <br />
</a-spin>

</template>
  
<script lang="ts" setup>
import { ref, reactive, onMounted, toRaw } from 'vue'
import { publish, getOpusByIdForPublish } from '../api/opus'
import { getMentionedList } from '../api/user'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue';
import BlotFormatter from 'quill-blot-formatter/dist/index'
import { QuillEditor, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Video from '../utils/video'
import quillEmoji from 'quill-emoji'
import 'quill-emoji/dist/quill-emoji.css'
import mention from "quill-mention";
import 'quill-mention/dist/quill.mention.min.css'

Quill.register(Video, true);
Quill.register('modules/quillEmoji', quillEmoji)
Quill.register({ 'modules/mention': mention, })

const publishSuccess = ref(false)
const header = ref('')
const resourceUrl = ref('')
const title = ref('')
const quillRef = ref();
const desc = ref('')
const content = ref('')
const router = useRouter()
const opusId = ref('')
const uploadLoading = ref(false)
const uploadResourceUrl = import.meta.env.VITE_BASE_URL + 'resource/upload'
const headers = {
  token: localStorage.getItem('token')
}
const toolbarOptions = [
  //'underline', 'strike'
  ['bold', 'italic'],
  [{ 'size': ['small', 'large', 'huge'] }],
  // [{ 'font': [] }],
  // [{ 'align': [] }],
  ['code-block'],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  // [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'header': 1 }, { 'header': 2 }],
  ['link', 'image'],
  ['emoji'],
  //[{'direction': 'rtl' }],    //文字编辑方向，从左到右还是从右到左
  [{ 'color': [] }]
]
const data = reactive({
  content: '',
  quillUpdateImg: false,
  editorOption: {
    placeholder: '......',
    modules: {
      // imageResize: {
      //   displayStyles: {
      //     backgroundColor: "black",
      //     border: "none",
      //     color: "white"
      //   },
      //   modules: ["Resize", "DisplaySize", "Toolbar"]
      // },
      // name: 'blotFormatter',  
      // module: BlotFormatter, 
      // options: {},
      toolbar: {
        container: toolbarOptions,
        handlers: {
          image: function (value: any) {
            //debugger
            if (value) {
              document.querySelector("#upload .avatar-uploader input").click();
            } else {
              quillRef.value.format("image", false);
            }
          },
          //https://blog.csdn.net/m0_51963973/article/details/126222377
          video: function (value: any) {
            //debugger
            if (value) {
              document.querySelector("#upload .avatar-uploader input").click();
            } else {
              quillRef.value.format("video", false);
            }
          }
        }
      },
      "emoji-toolbar": true,
      // "emoji-textarea": true,
      "emoji-shortname": true,
      mention: {  // 重点： 提醒功能配置项
        allowedChars: /^[A-Za-z\s]*$/, // 正则匹配
        mentionDenotationChars: ['@'], // 匹配符号，匹配到@符号弹出提醒框
        offsetLeft: 4,
        source: (searchTerm, renderList, mentionChar) => { // 数据源（遍历成{id, value}形式）
          const param = {key :searchTerm};
          getMentionedList(param).then(res=>{
            const values = res.map(item => ({
            id: item.id,
            value: item.nickName,
          }))
          renderList(values, searchTerm) // 渲染函数（生成提醒框）
          })
        },
        onSelect: (data, insertItem) => { // 注意：选中后的回调函数
          const item = {
            text: `@${data.value}`,
            name: data.value,
            id: data.id,
          }
          insertItem(data) // 注意：这个函数必须加上，有这个才会在文本框显示选中的值
          //this.onSelectd(item) // 返回给后端的选中提醒的人 TODO

        },

      },

    }
  },
  modules: [{
    name: 'blotFormatter',
    module: BlotFormatter,
    options: {/* options */ }
  }]
})

const createOneMore = () => {
  publishSuccess.value = false
  title.value = ''
  quillRef.value = ''
  content.value = ''
}

const goBack = () => {
  router.push('/index')
}

const beforeResourceUpload = (file: any) => {
  //console.log(file);
  uploadLoading.value = true;
  if (file.type.indexOf("image") === 0) {
    if (file.size > 25165824) {
      message.error('image size too large over 3MB!');
      return false;
    }
    return true;

  }

  if (file.type.indexOf("video") === 0) {
    if (file.size > 83886080) {
      message.error('video size too large over 10MB!');
    }
    return true;
  }
  message.error('invalid file type!');
  return false;
}

const uploadResourceSuccess = (res) => {
  
  uploadLoading.value = false;

  if (res.code != 0) {
    console.log(res.message)
    return;
  }

  let length = toRaw(quillRef.value).getQuill().getSelection().index;
  if (res.data.type == "image") {
    toRaw(quillRef.value).getQuill().insertEmbed(length, 'image', res.data.originUrl);
    return;
  }

  if (res.data.type == "video") {
    window.jsValue = res.data.originUrl;
    toRaw(quillRef.value).getQuill().insertEmbed(length, 'video', res.data.originUrl);
  }

}

const uploadResourceError = () => {
  uploadLoading.value = false;
}

const pubilshFunction = (type: number) => {
  uploadLoading.value = true;

  let length = quillRef.value.getText().length
  let a = quillRef.value.getContents()
  if (length === 1) {
      message.error("please input")    
      return;
  }

  console.log(quillRef.value)

  const param = {
    text: quillRef.value.getText(),
    content: quillRef.value.getContents(),
    title: title.value,
    resourceUrl: resourceUrl.value,
    type: type,
    id: opusId.value
  }

  publish(param).then(res => {
    uploadLoading.value = false
    if (type == 0) {
      publishSuccess.value = true
    }else{
      message.success("stage success !")
    }
  })
}

const getOpusByIdForPublishFunction = () => {
  let param = { opusId: router.currentRoute.value.query.opusId }
  getOpusByIdForPublish(param).then(res => {
    title.value = res.title;
    quillRef.value.setContents(res.content)
    opusId.value = res.opusId;
  })
}

onMounted(() => {
  header.value = localStorage.getItem('token')
  console.log(router.currentRoute.value)
  if (router.currentRoute.value.query.opusId != null && router.currentRoute.value.query.opusId != undefined && router.currentRoute.value.query.opusId != '') {
    getOpusByIdForPublishFunction()
  }
})



</script>