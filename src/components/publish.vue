<template>
    <Tinymce ref="editorRef" v-model="value" />
  </template>
  
  <script lang="ts">
    import Tinymce from './editor.vue'
    import { defineComponent, ref } from 'vue'
    export default defineComponent({
      components: {
        Tinymce,
      },
      setup() {
        const editorRef = ref(null)
        const value = ref(null)
        return {
           editorRef,
           value
        }
      },
    })
  </script>