<template>
  <el-form ref="form" :model="registerData" :rules="registerRules" label-width="0px">
    <el-form-item label="" prop="email">
      <el-input v-model="registerData.email" prefix-icon="el-icon-message"></el-input>
    </el-form-item>
    <el-form-item label="" prop="password">
      <el-input type="password" v-model="registerData.password" prefix-icon="el-icon-lock"></el-input>
    </el-form-item>
    <el-form-item label="" prop="captcha">
      <el-row>
        <el-col :span="14">
          <el-input v-model="registerData.captcha" prefix-icon="el-icon-lock"></el-input>
        </el-col>
        <el-col :span="10">
           <el-button @click="getEmailCaptcha" type="primary" style="background:transparent; color: #409EFF">获取验证码</el-button>
        </el-col>
      </el-row>
    </el-form-item>
<!--    <el-form-item>-->
      <el-button type="primary" @click="onSubmit" style="width: 100px;background:transparent; color: #409EFF">注册</el-button>
    <span style="color: #0078ff;margin-left:20px">已有账号,去→<a href="javascript:;" @click.prevent="toLogin">登录</a></span>
<!--    </el-form-item>-->
    <el-form-item prop="checked">
      <el-checkbox v-model="registerData.checked">
        <p>阅读并接受 <a href="#">《管理系统用户协议》</a>及<a href="#">《系统隐私权保护声明》</a></p>
      </el-checkbox>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
  import {Vue, Component, Ref} from 'vue-property-decorator'
  import {ElForm} from "element-ui/types/form"; // 用于给Ref声明类型
  import {registerUser, sendEmailCaptcha} from '../api/index'

@Component({
  name: 'EmailForm'
})
export default class EmailForm extends Vue{
    private toLogi() {
      this.$router.push('/login')
    }
  private registerData = {
    email: '',
    password: '',
    captcha: '',
    type: 'email',
    checked: true,
  };
  private registerRules = {
    email: [
      { validator: this.validateEmail, trigger: 'blur' }
    ],
    password: [
      { validator: this.validatePassword, trigger: 'blur' }
    ],
    captcha: [
      { validator: this.validateCaptcha, trigger: 'blur' }
    ],
    checked: [
      { validator: this.validateChecked, trigger: 'change' }
    ]
  };
  private validateEmail(rule: any, value: string, callback: any) {
    // rule 规则  value 需要校验的数据 callback 判断成功或失败
    const reg = /^([A-Za-z0-9_\-\.])+\@(163.com|qq.com)$/; // 此正则仅匹配qq和网易邮箱
    if(!value) {
      callback(new Error('邮箱不能为空'));
    }else if(!reg.test(value)){
      callback(new Error('现仅支持qq和网易邮箱'));
    } else {
      callback();
    }
  }
  private validatePassword(rule: any, value: string, callback: any) {
    const reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,20}$/;
    if(!value) {
      callback(new Error('请输入密码'));
    }else if(value.length < 8) {
      callback(new Error('密码至少8位'));
    }else if(!reg.test(value)){
      callback(new Error('包含数字,英文,字符中的两种以上'));
    } else {
      callback();
    }
  }
  private validateCaptcha(rule: any, value: string, callback: any) {
    const reg = /^[A-Za-z0-9]{4}$/;
    if(!value) {
      callback(new Error('请输入验证码'));
    }else if(value.length < 4) {
      callback(new Error('验证码为4位'));
    }else if(!reg.test(value)){
      callback(new Error('验证码格式不正确'));
    } else {
      callback();
    }
  }
  private validateChecked(rule: any, value: string, callback: any) {
    if(!value) {
      callback(new Error('请勾选用户服务协议'));
    }else{
      callback()
    }
  };

  @Ref() readonly form!: ElForm;
  private onSubmit() {
    this.form.validate((valid) => {
      if (valid) {
        registerUser(this.registerData)
        .then((res: any) => {
          if(res.status === 200) {
            (this as any).$message.success('注册成功');
            this.$router.push('/login');
          }else{
            (this as any).$message.error(res.data.msg);
          }
        })
        .catch((err: any) => {
          (this as any).$message.error(err.response.data.msg);
        })
      } else {
        (this as any).$message.error('请完善注册信息');
      }
    })
  }
  public resetForm() {
    this.form.resetFields();
  }

  private getEmailCaptcha() {
    if(this.registerData.email) {
      sendEmailCaptcha({email: this.registerData.email})
        .then((res: any) => {
          if(res.status === 200) {
            (this as any).$message.success(res.data.msg)
          }else{
            (this as any).$message.error(res.data.msg)
          }
        })
        .catch(err => {
          (this as any).$message.error(err.response.data.msg);
        })
    } else {
      (this as any).$message.error('请输出正确的邮箱')
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row {
    height: 40px;
    .el-col {
      height: 40px;
    }
  }
  .el-checkbox {
    margin-top: 10px;
  }
  p {
    width: 250px;
    white-space: normal;
  }
  a {
    color: #409EFF;
  }
</style>
