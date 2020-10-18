<template>
  <div>
    <el-card shadow="never">
      <div slot="header">密码修改</div>
      <div style="min-height:40vh;width:40%">
        <el-form ref="form" :model="form" label-width="100px" :rules="passwordRules" disabled>
          <el-form-item label="旧密码" prop="oldPwd">
            <el-input v-model="form.oldPwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="form.newPwd" show-password title="6-20个字符"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="newPwd2">
            <el-input v-model="form.newPwd2" show-password></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="邮箱验证码" prop="captcha">
            <el-row>
              <el-col :span="8">
                <el-input v-model="form.captcha"></el-input>
              </el-col>
              <el-col :span="10">
                <el-button type="primary" style="margin-left: 20px;" @click="sendEmailCode()">发送验证码</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="onSubmit">确认修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
  import {sendEmailCaptcha} from "@/api";
  export default {
      created() {
          const data = sessionStorage.getItem('userInfo');
          if(data) {
              const userInfo = JSON.parse(data);
              this.form.id = userInfo.id;
          }
      },
      data() {
            return {
                form: {
                    id:"",
                    oldPwd: "",
                    newPwd: "",
                    newPwd2: "",
                    email: "",
                    captcha: "",
                },
                passwordRules: {
                    oldPwd: [
                        { validator: this.validatePassword, trigger: 'blur' }
                    ],
                    newPwd: [
                        { validator: this.validatePassword1, trigger: 'blur' }
                    ],
                    newPwd2: [
                        { validator: this.validatePassword2, trigger: 'blur' }
                    ],
                    email: [
                        { validator: this.validateEmail, trigger: 'blur' }
                    ],
                    captcha: [
                        { validator: this.validateCaptcha, trigger: 'blur' }
                    ]
                },
                sendEmailCode() {
                    if(this.form.email) {
                        sendEmailCaptcha({email: this.form.email})
                            .then((res) => {
                                if(res.status === 200) {
                                    this.$message.success(res.data.msg)
                                }else{
                                    this.$message.error(res.data.msg)
                                }
                            })
                            .catch(err => {
                                this.$message.error(err.response.msg);
                            })
                    } else {
                        this.$message.error('请输入邮箱账号');
                    }
                }
            };
        },
        methods: {
            validateCaptcha(rule, value, callback) {
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
            },
            validateEmail(rule, value, callback) {
                // rule 规则  value 需要校验的数据 callback 判断成功或失败
                const reg = /^([A-Za-z0-9_\-\.])+\@(163.com|qq.com)$/; // 此正则仅匹配qq和网易邮箱
                if(!value) {
                    callback(new Error('邮箱不能为空'));
                }else if(!reg.test(value)){
                    callback(new Error('现仅支持qq和网易邮箱'));
                } else {
                    callback();
                }
            },
            validatePassword(rule, value, callback) {
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
            },
            validatePassword1(rule, value, callback) {
                const reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,20}$/;
                if(!value) {
                    callback(new Error('请输入新的密码'));
                }else if(value.length < 8) {
                    callback(new Error('密码至少8位'));
                }else if(!reg.test(value)){
                    callback(new Error('包含数字,英文,字符中的两种以上'));
                } else if(value === this.form.oldPwd) {
                    callback(new Error('不能重复设置旧密码'));
                } else {
                    callback();
                }
            },
            validatePassword2(rule, value, callback) {
                if(!value) {
                    callback(new Error('请再次输入密码'));
                }else if(value !== this.form.newPwd){
                    callback(new Error('两次密码不一致'));
                } else {
                    callback();
                }
            },
            onSubmit() {
                this.$refs.form.validate(valid => {
                  if(valid) {
                      this.$message.error('暂不支持此功能');
                  } else {
                      this.$message.error('请完善修改信息');
                  }
                })
            },
        },
    };
</script>
