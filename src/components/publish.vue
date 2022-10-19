<template>
  <a-card title="Create Your Opus">
    <template #extra><a-button type="primary" @click="pubilshFunction(0)">Publish</a-button>
  <a-button @click="pubilshFunction(1)">Stage</a-button>
    </template>
    <a-input v-model="title" placeholder="title is optional" />
    <quill-editor ref="quillRef" v-model="content" style="min-height: 900px" :disabled="true" theme="snow" :options="data.editorOption" content-type="html" enable :content="desc" />
  </a-card>
  <br />
     
  </template>
  
  <script lang="ts" setup>
    import { defineComponent, ref, reactive, watch } from 'vue'
    import { publish } from '../api/opus'
    
    const resourceUrl = ref('')
    const title = ref('')
    const quillRef = ref();
    const desc = ref('')
    const content = ref('')
    const data = reactive({
      content: '',
      editorOption: {
        modules: {
          theme:'bubble',
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
        type:type
      }

      publish(param).then(res=>{
        console.log(res)
      })

    }

    

  </script>