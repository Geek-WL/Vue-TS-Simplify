<template>
  <el-form ref="form" :model="registerData" :rules="registerRules" label-width="0px">
    <el-form-item label="" prop="phone">
      <el-input v-model="registerData.phone" prefix-icon="el-icon-phone-outline"></el-input>
    </el-form-item>
    <el-form-item label="" prop="password">
      <el-input type="password" v-model="registerData.password" prefix-icon="el-icon-lock"></el-input>
    </el-form-item>
    <el-form-item label="" prop="captcha">
      <el-row>
        <el-col :span="18">
          <el-input v-model="registerData.captcha" prefix-icon="el-icon-lock"></el-input>
        </el-col>
        <el-col :span="6">
           <el-button @click="getPhoneCaptcha" type="primary">获取验证码</el-button>
        </el-col>
      </el-row>
    </el-form-item>
<!--    <el-form-item>-->
      <el-button type="primary" @click="onSubmit" style="width: 100%">注册</el-button>
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
  import {registerUser, sendPhoneCaptcha} from '../api/index'

@Component({
  name: 'PhoneForm'
})
export default class PhoneForm extends Vue{
  private registerData = {
    phone: '',
    password: '',
    captcha: '',
    type: 'phone',
    checked: true,
  };
  private registerRules = {
    phone: [
      { validator: this.validatePhone, trigger: 'blur' }
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
  private validatePhone(rule: any, value: string, callback: any) {
    // rule 规则  value 需要校验的数据 callback 判断成功或失败
    const reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
    if(!value) {
      callback(new Error('请输入手机号码'));
    }else if(!reg.test(value)){
      callback(new Error('手机号码格式不正确'));
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

  private getPhoneCaptcha() {
    sendPhoneCaptcha({phone: this.registerData.phone})
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
</style>
