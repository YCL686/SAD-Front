<template>
  <a-card id="upload" title="Create Your Opus">
    <template #extra>
      <a-button type="primary" @click="pubilshFunction(0)">Publish</a-button>
      <a-button @click="pubilshFunction(1)">Stage</a-button>
    </template>
    <a-input v-model:value="title" placeholder="title is optional" />
    <el-upload class="avatar-uploader" :action="uploadImgUrl" :accept="'image/*,video/*'" :show-file-list="false"
      :on-success="uploadEditorSuccess" :on-error="uploadEditorError" :before-upload="beforeEditorUpload"
      :headers="headers">
    </el-upload>
    <quill-editor ref="quillRef" v-model="content" style="min-height: 900px" :disabled="true" theme="snow"
      :options="data.editorOption" content-type="html" enable :content="desc" />
  </a-card>
  <br />

</template>
  
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { publish, getOpusByIdForPublish } from '../api/opus'
import { useRouter } from 'vue-router'

const header = ref('')
const resourceUrl = ref('')
const title = ref('')
const quillRef = ref();
const desc = ref('')
const content = ref('')
const router = useRouter()
const opusId = ref('')
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'size': ['small', false, 'large', 'huge'] }],
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
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function(value: any) {
                //debugger
                if (value) {
                  document.querySelector("#upload .avatar-uploader input").click();
                } else {
                  quillRef.value.format("image", false);
                }
              },
              //https://blog.csdn.net/m0_51963973/article/details/126222377
              video: function(value: any) {
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





    //   modules: {
    //     // theme:'snow',
    //     toolbar: [
    //       ['bold', 'italic', 'underline', 'strike'],
    //       [{ 'size': ['small', false, 'large', 'huge'] }],
    //       [{ 'font': [] }],
    //       [{ 'align': [] }],
    //       ['code-block'],
    //       [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    //       [{ 'indent': '-1' }, { 'indent': '+1' }],
    //       [{ 'header': 1 }, { 'header': 2 }],
    //       ['link', 'image', 'video'],
    //       ['clean'],
    //       //[{'direction': 'rtl' }],    //文字编辑方向，从左到右还是从右到左
    //       [{ 'color': [] }, { 'background': [] }]
    //     ]
    //   },
    //   placeholder: '......',
    //   toolbar: {
    //     container: toolbarOptions,  // 工具栏
    //     handlers: {
    //       image: function (value: any) {
    //         console.log("image")
    //         debugger
    //         if (value) {
    //           document.querySelector('#quillEditorQiniu .avatar-uploader input').click()
    //         } else {
    //           quillRef.value.format('image', false);
    //         }
    //       },
    //       video: function (value: any) {
    //         if (value) {
    //           document.querySelector('#quillEditorQiniu .avatar-uploader input').click()
    //         } else {
    //           quillRef.value.format('video', false);
    //         }
    //       }
    //     }
    //   },
    // },

  },
})

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