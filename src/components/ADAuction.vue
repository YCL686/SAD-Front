<template>
    <a-collapse v-model:activeKey="activeKey" accordion>
    <a-collapse-panel key="1" header="AD Auction">
      1
    </a-collapse-panel>
    <a-collapse-panel key="2" header="My AD">
      2
    </a-collapse-panel>
  </a-collapse>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
const activeKey = ref(1)
</script>
<style scoped></style>