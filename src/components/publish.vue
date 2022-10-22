<template>
  <a-card title="Create Your Opus">
    <template #extra><a-button type="primary" @click="pubilshFunction(0)">Publish</a-button>
  <a-button @click="pubilshFunction(1)">Stage</a-button>
    </template>
    <a-input v-model:value="title" placeholder="title is optional" />
    <quill-editor ref="quillRef" v-model="content" style="min-height: 900px" :disabled="true" theme="snow" :options="data.editorOption" content-type="html" enable :content="desc" />
  </a-card>
  <br />
     
  </template>
  
  <script lang="ts" setup>
    import { defineComponent, ref, reactive, watch, onMounted } from 'vue'
    import { publish, getOpusByIdForPublish } from '../api/opus'
    import {useRouter} from 'vue-router'
    
    const resourceUrl = ref('')
    const title = ref('')
    const quillRef = ref();
    const desc = ref('')
    const content = ref('')
    const router = useRouter()
    const opusId = ref('')
    const data = reactive({
      content: '',
      editorOption: {
        modules: {
          // theme:'snow',
          toolbar: [
          	['bold', 'italic', 'underline', 'strike'],
          	[{'size': ['small', false, 'large', 'huge']}],
          	[{'font': []}],
          	[{'align': []}],
            ['code-block'],
          	[{'list': 'ordered'}, {'list': 'bullet'}],
          	[{'indent': '-1'}, {'indent': '+1'}],
          	[{'header': 1}, {'header': 2}], 
          	['image'],
          	[{'direction': 'rtl' }],    //文字编辑方向，从左到右还是从右到左
          	[{ 'color': [] }, { 'background': [] }] 
          ]
        },
        placeholder: '......'
      }
    })

    const pubilshFunction = (type: number) => {
      let length = quillRef.value.getText().length
      let a = quillRef.value.getContents()
      if(length === 2){
        alert('内容不能为空')
        return;
      }

      const param = {
        text: quillRef.value.getText(),
        content:quillRef.value.getContents(),
        title:title.value,
        resourceUrl:resourceUrl.value,
        type:type,
        id:opusId.value
      }
      
      publish(param).then(res=>{
        console.log(res)
      })
    }

    const getOpusByIdForPublishFunction = () =>{
      let param = {opusId: router.currentRoute.value.query.opusId}
      getOpusByIdForPublish(param).then(res=>{
        title.value = res.title;
        quillRef.value.setContents(res.content)
        opusId.value = res.opusId;
      })
    }

    onMounted( ()=>{
      console.log(router.currentRoute.value)
      if(router.currentRoute.value.query.opusId != null && router.currentRoute.value.query.opusId != undefined && router.currentRoute.value.query.opusId != ''){
        getOpusByIdForPublishFunction()
      }
    })

    

  </script>