<template>
    <a-collapse v-model:activeKey="activeKey" accordion>
    <a-collapse-panel key="1" header="Blind Box">
      1
    </a-collapse-panel>
    <a-collapse-panel key="2" header="NFT Market">
      2
    </a-collapse-panel>
    <a-collapse-panel key="3" header="My NFT">
      3
    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts" setup>
    import {ref} from 'vue'
    const activeKey = ref(1)
</script>