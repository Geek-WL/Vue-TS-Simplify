<template>
  <div>
    <el-card shadow="never" class="card">
      <div slot="header" class="clearfix">
        <span>获取Github源码</span>
      </div>
      <div id="back">
            <el-card shadow="never" class="card" style="width: 300px;">
              <div slot="header" class="clearfix">
                <span>{{eui_data.title}}</span>
              </div>
              <div>
                <p style="color:#606266">{{eui_data.explain}}</p>
                <div style="margin-top:30px;text-align:center">
                  <el-button :type="eui_data.button_type" icon="el-icon-download"><a href="https://github.com/MrLohh/Vue-TS-Simplify" style="text-decoration: none;color:#fff ">{{eui_data.button_title}}</a></el-button>
                </div>
              </div>
            </el-card>
      </div>
    </el-card>
  </div>
</template>
<script>
    export default {
        data(){
            return{
                eui_data: {
                        title:"Dlmwnr's Design1.0",
                        explain:"此项目前端基于TS+Vue,使用了较新的技术栈，可用于学习TS实战相关的注意点",
                          button_title:'获取Design源码',
                        button_type:'success'
                    }
            }
        },
        methods:{
        }
    }
</script>
<style scoped>
  #back {
    min-height: 50vh;
    color: #606266;
  }
</style>
