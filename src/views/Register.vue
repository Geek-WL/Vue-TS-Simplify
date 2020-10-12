<template>
  <div class="register-container">
    <div class="register-box">
      <h2>江伟龙后台管理系统前端注册</h2>
      <el-tabs tab-position="left" style="height: 300px;" @tab-click="handleClick">
        <el-tab-pane label="用户名注册">
          <NormalForm ref="normalForm"/>
        </el-tab-pane>
        <el-tab-pane label="邮箱注册">
          <EmailForm ref="emailForm"></EmailForm>
        </el-tab-pane>
        <el-tab-pane label="手机号注册">
          <PhoneForm ref="phoneForm"></PhoneForm>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Ref} from 'vue-property-decorator'
import NormalForm from "@/components/NormalForm.vue";
import EmailForm from "@/components/EmailForm.vue";
import PhoneForm from "@/components/PhoneForm.vue";

@Component({
  name: 'Register',
  components: {
    NormalForm,
    EmailForm,
    PhoneForm
  }
})
export default class Register extends Vue{
  @Ref() readonly normalForm!: NormalForm;
  @Ref() readonly emailForm!: EmailForm;
  @Ref() readonly phoneForm!: PhoneForm;
  private handleClick() {
    this.normalForm.resetForm();
    this.emailForm.resetForm();
    this.phoneForm.resetForm();
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  width: 100%;
  height: 100%;
  background: url("../assets/bg.jpg") no-repeat;
  background-size: 100% 100%;
  .register-box {
    width: 580px;
    height: 385px;
    border-radius: 10px;
    /*background: rgba(255,255,255,.8);*/
    background: #fff;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 0 20px;
    box-sizing: border-box;
    /*opacity: 0.8;*/
    }
    h2 {
      text-align: center;
    }
  }
</style>
