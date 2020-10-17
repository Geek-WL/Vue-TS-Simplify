<template>
  <div>
    <el-card shadow="never">
      <div slot="header">网站基础信息</div>
      <div style="min-height:60vh">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="网站名称">
            <el-input v-model="form.web_name" disabled style="color:#ccc;"></el-input>
          </el-form-item>
          <el-form-item label="网站网址">
            <el-input v-model="form.web_link" disabled></el-input>
          </el-form-item>
          <el-form-item label="文件前缀链接">
            <el-input v-model="form.file_web_link" disabled></el-input>
          </el-form-item>
          <el-form-item label="文件上传最大">
            <el-input-number
              disabled
              v-model="form.file_max_size"
              :min="1"
              :max="1000"
              label="描述文字"
            ></el-input-number>
            MB
          </el-form-item>
          <el-form-item label="META描述">
            <el-input type="textarea" :rows="3" v-model="form.web_mate_content"></el-input>
          </el-form-item>
          <el-form-item label="网站版权">
            <el-input type="textarea" :rows="2" v-model="form.web_copyright"></el-input>
          </el-form-item>
<!--          <el-form-item>-->
<!--            <el-button type="primary" @click="onSubmit">保存设置</el-button>-->
<!--          </el-form-item>-->
          <el-form-item label="开发者简述">
            <el-input type="text" v-model="form.web_devInfo"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    web_name: "Dlmwnr's Design",
                    web_link: "http://www.127.0.0.1:8080/",
                    file_web_link: "http://www.www.127.0.0.1:7001/public/",
                    file_max_size: 12,
                    web_mate_content: 'Dlmwnr\'s Design是基于TS加Vue加Element-Ui共同构建，快速开发学习的整体后台框架。该网站面向公司管理人员，拥有权限管理，用户管理，角色分配三大核心功能。',
                    web_copyright: "©2020/10/17 江伟龙 毕业设计",
                    web_devInfo: "江伟龙，毕业于广州工商学院计算机科学与工程系网络工程专业，自大二开始自学前端与后端，喜欢编程，玩游戏",
                },
            };
        },
        methods: {
            onSubmit() {
                console.log("submit!");
            },
        },
    };
</script>

<style scoped lang="scss">
</style>
