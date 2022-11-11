<template>
<div class="footer" id = "footer">
    
    <a-row>
      <a-col style="text-align: right;" :span="12">
        <span><CopyrightCircleOutlined/> 2022 SharableAD Com</span>
      </a-col>
      <a-col style="text-align: right;" :span="6">
        <a-space size="middle">
          <svg-icon style="cursor: pointer;" name="web" height="30" width="30" ></svg-icon>
          <svg-icon style="cursor: pointer;" name="twitter" height="30" width="30" ></svg-icon>
          <svg-icon style="cursor: pointer;" name="telegram" height="30" width="30" ></svg-icon>
          <svg-icon style="cursor: pointer;" name="discord" height="30" width="30" ></svg-icon>
          <svg-icon style="cursor: pointer;" name="github" height="30" width="30" ></svg-icon>
          <svg-icon style="cursor: pointer;" name="gitcoin" height="30" width="120" ></svg-icon>
        </a-space>
      </a-col>
      <a-col style="text-align: center;" :span="6">
          <a-space >
            <a-button size="small" style="color: #b3c0d1;" type="link">About Us</a-button>
            <a-button size="small" style="color: #b3c0d1;" type="link">Community</a-button>
            <a-button size="small" style="color: #b3c0d1;" type="link">Help</a-button>
            <a-button size="small" style="color: #b3c0d1;" type="link">Advice</a-button>
            <a-button size="small" style="color: #b3c0d1;" type="link">Join Us</a-button>
          </a-space>
      </a-col>
    </a-row>
    
    
</div>
</template>
<style scoped>
.footer {
  line-height: 60px;
  background-color: #333;
  color: #b3c0d1;
}
</style>

<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { defineComponent } from 'vue'
import {CopyrightCircleOutlined} from '@ant-design/icons-vue'

export default defineComponent({
  components:{CopyrightCircleOutlined},
    name:'myFooter',
  setup() {
    return{
      CopyrightCircleOutlined
    }
  }
})
</script>