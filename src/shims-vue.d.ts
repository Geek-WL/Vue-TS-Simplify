declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

// 第三方库如果没有相应的声明文件 那么就必须得自己加上 否则引用的时候报 cant not found 错误
declare module 'vue-particle-line'
