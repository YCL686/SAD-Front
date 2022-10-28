<template>
  <a-card id="upload" title="Create Your Opus">
    <template #extra>
      <a-button type="primary" @click="pubilshFunction(0)">Publish</a-button>
      <a-button @click="pubilshFunction(1)">Stage</a-button>
    </template>
    <a-input v-model:value="title" placeholder="title is optional" />
    <el-upload class="avatar-uploader" :action="uploadResourceUrl" :accept="'image/*,video/*'" :show-file-list="false"
      :on-success="uploadResourceSuccess" :on-error="uploadResourceError" :before-upload="beforeResourceUpload"
      :headers="headers">
    </el-upload>
    <a-spin :spinning="uploadLoading">
    <QuillEditor ref="quillRef" v-model="content" style="min-height: 900px" theme="snow"
      :options="data.editorOption" :modules="data.modules" content-type="html" enable :content="desc" />
    </a-spin>
  </a-card>
  <br />

</template>
  
<script lang="ts" setup>
import { ref, reactive, onMounted, toRaw } from 'vue'
import { publish, getOpusByIdForPublish } from '../api/opus'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue';
import BlotFormatter from 'quill-blot-formatter/dist/index'
import { QuillEditor, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Video from '../utils/video'
Quill.register(Video, true);


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
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'size': ['small', 'large', false, 'huge'] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['code-block'],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'header': 1 }, { 'header': 2 }],
  ['link', 'image', 'video'],
  ['clean'],
  //[{'direction': 'rtl' }],    //文字编辑方向，从左到右还是从右到左
  [{ 'color': [] }, { 'background': [] }]
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
      }
    }
  },
  modules:[{
    name: 'blotFormatter',  
      module: BlotFormatter, 
      options: {/* options */}
  }]
})

const beforeResourceUpload = (file: any) => {
  //console.log(file);
  uploadLoading.value = true;
  if(file.type.indexOf("image") === 0){
    if(file.size > 25165824){
      message.error('image size too large over 3MB!');
      return false;
    }
    return true;

  }

  if(file.type.indexOf("video") === 0){
    if(file.size > 83886080){
      message.error('video size too large over 10MB!');
    }
    return true;
  }
  message.error('invalid file type!');
  return false;
}

const uploadResourceSuccess = (res) => {
  console.log(quillRef.value)
  console.log(toRaw(quillRef.value).getQuill())

  uploadLoading.value = false;

  if(res.code != 0){
    console.log(res.message)
    return;
  }

  let length = toRaw(quillRef.value).getQuill().getSelection().index;
  if(res.data.type == "image"){
    toRaw(quillRef.value).getQuill().insertEmbed(length, 'image', res.data.originUrl);
    return;
  }

  if(res.data.type == "video"){
    window.jsValue= res.data.originUrl;
    toRaw(quillRef.value).getQuill().insertEmbed(length, 'video', res.data.originUrl);
  }

}

const uploadResourceError = () => {
  uploadLoading.value = false;
}

const pubilshFunction = (type: number) => {
  let length = quillRef.value.getText().length
  let a = quillRef.value.getContents()
  if (length === 1) {
    alert('内容不能为空')
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
    console.log(res)
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