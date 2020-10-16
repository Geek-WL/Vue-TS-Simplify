<template>
  <div class="welcome">
    <div>
      <TopSpace/>
    </div>
    <div style="margin-top:20px">
      <WebDataSpace/>
    </div>
  </div>
</template>

<script lang="ts">
  import {Vue, Component} from 'vue-property-decorator'
  import TopSpace from '@/components/welcome/TopSpace.vue'
  import WebDataSpace from '@/components/welcome/WebDataSpace.vue'
  @Component({
    name: 'Home',
    components: {
      // TopSpace:resolve=>{require(['@/components/welcome/TopSpace'],resolve)},
      TopSpace,
      WebDataSpace,
      // WebDataSpace:resolve=>{require(['@/components/home/WebDataSpace'],resolve)}
    }
  })
  export default class Home extends Vue{

  }
</script>

<style lang="scss" scoped>
.welcome {
}
</style>
