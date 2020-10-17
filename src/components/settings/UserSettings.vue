<template>
  <div>
    <el-card shadow="never">
      <div slot="header">个人信息设置</div>
      <div style="min-height:60vh;width:70%">
        <el-form ref="form" :model="form" label-width="100px" :rules="updateRules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-input v-model="form.userrole" disabled></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" :rows="3" v-model="form.userdesc" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit()">保存设置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
    import {updateUsers} from "@/api";
  export default {
        created() {
            const data = sessionStorage.getItem('userInfo');
            const userInfo = JSON.parse(data);
            this.form.username = userInfo.username;
            this.form.email = userInfo.email;
            this.form.phone = userInfo.phone;
            this.form.id = userInfo.id;
            this.form.userdesc = userInfo.roles[0].roleDesc;
            this.form.userrole = userInfo.roles[0].roleName;
        },
        data() {
            return {
                updateRules: {
                    email: [
                        { validator: this.validateEmail, trigger: 'blur' }
                    ],
                    phone: [
                        { validator: this.validatePhone, trigger: 'blur' }
                    ],
                    username: [
                        { validator: this.validateUsername, trigger: 'blur' }
                    ]
                },
                form: {
                    username: "",
                    phone: "",
                    email: "",
                    id: 0,
                    userdesc: "",
                    userrole: "",
                },
            };
        },
        methods: {
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
            validateUsername(rule, value, callback) {
                // rule 规则  value 需要校验的数据 callback 判断成功或失败
                const reg = /^[a-zA-Z][a-zA-Z0-9_]{8,20}$/;
                if(!value) {
                    callback(new Error('用户名不能为空'));
                }else if(value.length < 8 || value.length > 20) {
                    callback(new Error('用户名至少8位,至多20位'));
                }else if(!reg.test(value)){
                    callback(new Error('以英文字母开头,只能包含英文字母/数字/下划线'));
                } else {
                    callback();
                }
            },
            validatePhone(rule, value, callback) {
                // rule 规则  value 需要校验的数据 callback 判断成功或失败
                const reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
                if(!value) {
                    callback(new Error('请输入手机号码'));
                }else if(!reg.test(value)){
                    callback(new Error('手机号码格式不正确'));
                } else {
                    callback();
                }
            },
            onSubmit() {
              this.$refs.form.validate((valid) => {
                  if (valid) {
                      updateUsers(this.form.id, this.form)
                      .then(res => {
                          if(res.status === 200) {
                              this.$message.success('信息更新成功');
                          } else {
                              this.$message.error('设置失败');
                          }
                      })
                      .catch(err => {
                          this.$message.error(err.response.data.msg);
                      })
                  } else {
                      this.$message.error('请输入正确信息');
                  }
              })
            },
        },
    };
</script>
