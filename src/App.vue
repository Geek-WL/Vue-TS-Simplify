<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator'

@Component({
  name: 'App'
})
export default class App extends Vue{

}
</script>

<style lang="scss">
  html, body {
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
}
  .el-input__inner {
    background: transparent !important;
    color: #fff !important;
    border: 1px solid #409EFF !important;
  }
  .el-form-item__error {
    color: #409EFF !important;
  }
</style>
