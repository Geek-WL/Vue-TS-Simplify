<template>
  <div>
    <el-card shadow="never">
      <div slot="header">个人信息设置</div>
      <div style="min-height:60vh;width:60%">
        <el-form ref="form" :model="form" label-width="100px" :rules="updateRules" inline>
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:7001/api/v1/posts"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="form.avatarURL" :src="form.baseURL + form.avatarURL" class="avatar" title="选择头像上传">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机" prop="phone">
                <el-input v-model="form.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色">
                <el-input v-model="form.userrole" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="描述">
                <el-input type="textarea" :rows="3" v-model="form.userdesc" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item>
                <el-button type="primary" @click="onSubmit()">保存设置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
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
      this.form.avatarURL = userInfo.avatarURL
      this.form.baseURL = userInfo.baseURL
    },
    data() {
      return {
        updateRules: {
          email: [
            {validator: this.validateEmail, trigger: 'blur'}
          ],
          phone: [
            {validator: this.validatePhone, trigger: 'blur'}
          ],
          username: [
            {validator: this.validateUsername, trigger: 'blur'}
          ]
        },
        form: {
          username: "",
          phone: "",
          email: "",
          id: 0,
          userdesc: "",
          userrole: "",
          avatarURL: '',
          baseURL: ''
        },
      };
    },
    methods: {
      // 上传成功的回调
      handleAvatarSuccess(res, file) {
        // this.imageUrl = URL.createObjectURL(file.raw);
        // console.log(res);
        if (res.code === 200) {
          this.form.avatarURL = res.data;
          const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
          userInfo.avatarURL = res.data
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
          this.$message.success('头像上传成功')
        }
      },

      //上传之前的回调
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

      validateEmail(rule, value, callback) {
        // rule 规则  value 需要校验的数据 callback 判断成功或失败
        const reg = /^([A-Za-z0-9_\-\.])+\@(163.com|qq.com)$/; // 此正则仅匹配qq和网易邮箱
        if (!value) {
          callback(new Error('邮箱不能为空'));
        } else if (!reg.test(value)) {
          callback(new Error('现仅支持qq和网易邮箱'));
        } else {
          callback();
        }
      },
      validateUsername(rule, value, callback) {
        // rule 规则  value 需要校验的数据 callback 判断成功或失败
        const reg = /^[a-zA-Z][a-zA-Z0-9_]{8,20}$/;
        if (!value) {
          callback(new Error('用户名不能为空'));
        } else if (value.length < 8 || value.length > 20) {
          callback(new Error('用户名至少8位,至多20位'));
        } else if (!reg.test(value)) {
          callback(new Error('以英文字母开头,只能包含英文字母/数字/下划线'));
        } else {
          callback();
        }
      },
      validatePhone(rule, value, callback) {
        // rule 规则  value 需要校验的数据 callback 判断成功或失败
        const reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
        if (!value) {
          callback(new Error('请输入手机号码'));
        } else if (!reg.test(value)) {
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
                if (res.status === 200) {
                  const data = sessionStorage.getItem('userInfo');
                  let userInfo = JSON.parse(data);
                  const obj = {
                    phone: this.form.phone,
                    email: this.form.email
                  }
                  userInfo = Object.assign(userInfo, obj)
                  sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
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

<style lang="scss" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
