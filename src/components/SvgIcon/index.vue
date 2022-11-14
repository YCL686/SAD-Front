<script lang="ts" setup>
import { computed } from "vue";
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ''
  },
  width: {
    type:[Number,String],
    default: 60
  },
  height:{
    type:[Number,String],
    default: 60
  }
})

const iconName = computed(() => `#icon-${props.name}`)
const svgClass = computed(() => {
  console.log(props.name, "props.name")
  if (props.name) {
     return `svg-icon ${props.name}`
  }
  return "svg-icon"
})

</script>
<template>
    <svg :class="svgClass" :style="{ 
        width: width + 'px',
        height: height + 'px'
    }"
    >
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>
​
<style scoped>
.svg-icon {
  fill: currentColor;
  vertical-align: middle;
}
</style>