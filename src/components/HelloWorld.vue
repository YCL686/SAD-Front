<!--HelloWorld.vue-->
<template>
  <button type="button" @click="onClick">count is: {{ count }}</button>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useStore } from 'vuex'

  const store = useStore()
  const count = computed(() => {
    return store.state.count
  })
  const onClick = () => {
    store.commit('increment')
  }
</script>
