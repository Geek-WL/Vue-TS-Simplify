<template>
  <div class="users">
    <!--  separator : 面包屑的分隔符-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/admin" @click="resetDefaultActivePath">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col :span="18">
          <el-form :inline="true" :model="searchData" class="demo-form-inline">
            <el-form-item label="" style="width: 160px;">
              <el-select v-model="searchData.role" placeholder="-所有角色-">
                <el-option label="-所有角色-" value=""></el-option>
                <el-option label="管理员" value="manager"></el-option>
                <el-option label="普通用户" value="normal"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" style="width: 160px;">
              <el-select v-model="searchData.origin" placeholder="-所有来源-">
                <el-option label="-所有来源-" value=""></el-option>
                <el-option label="本地注册" value="local"></el-option>
                <el-option label="Github用户" value="github"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" style="width: 160px;">
              <el-select v-model="searchData.type" placeholder="-所有用户-">
                <el-option label="-所有用户-" value=""></el-option>
                <el-option label="用户名" value="username"></el-option>
                <el-option label="邮箱" value="email"></el-option>
                <el-option label="手机号" value="phone"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" style="width: 160px;">
              <el-input v-model="searchData.key" placeholder="-关键字-"></el-input>
            </el-form-item>
            <el-form-item style="width: 180px">
              <el-button type="primary" @click="onSubmit" size="small" v-permission="'users:query'">查询</el-button>
              <el-button type="primary" @click="exportUsers" size="small" v-permission="'users:exportRes'">导出搜索结果</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <el-button type="primary"
                     @click="showAddUserDialog"
                     size="small"
                     v-permission="'users:addUser'">添加用户</el-button>
          <el-upload
            style="display: inline-block;margin-left: 10px;margin-right: 10px"
            class="upload-demo"
            action="http://127.0.0.1:7001/api/v1/importUser"
            :show-file-list="false"
            :on-success="handleExcelSuccess"
            :before-upload="beforeExcelUpload"
            accept=".xlsx">
<!--            accept=".xls">-->
            <el-button size="small" type="primary" v-permission="'users:importUser'">导入用户</el-button>
          </el-upload>
          <a href="http://127.0.0.1:7001/api/v1/exportUser">
            <el-button size="small" type="primary" v-permission="'users:exportAllUser'">导出所有用户</el-button>
          </a>
        </el-col>
      </el-row>
      <!--      中间表格区-->
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading
        :stripe="true">
        <!--        第一列作为索引列-->
        <el-table-column type="index">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话">
        </el-table-column>
        <el-table-column
          :formatter="getCurrentRoleName"
          label="角色">
        </el-table-column>
        <el-table-column
          label="状态">
          <!--          想拿到每一行的数据 使用作用域插槽scope，scope下的row就是一行的数据-->
          <!--          <template slot-scope="scope">{{scope.row}}</template>-->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.userState"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeUserState(scope.row)"
              v-permission="'users:status'">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="showEditUserDialog(scope.row)" icon="el-icon-edit" size="small" v-permission="'users:editUser'"></el-button>
            <el-button type="danger" @click="destroyUser(scope.row.id)" icon="el-icon-delete" size="small" v-permission="'users:deleteUser'"></el-button>
            <el-tooltip :enterable="false" class="item" effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="small" @click="showAddRoleDialog(scope.row)" v-permission="'users:assignRole'"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--      底部分页区-->
    <el-pagination
      :current-page="searchData.currentPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="searchData.pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>

<!--    添加用户对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="30%">
      <el-form ref="form" :model="userData" :rules="addUserRules" label-width="0px">
        <el-form-item label="" prop="username">
          <el-input v-model="userData.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="" prop="email">
          <el-input v-model="userData.email" prefix-icon="el-icon-message"></el-input>
        </el-form-item>
        <el-form-item label="" prop="phone">
          <el-input v-model="userData.phone" prefix-icon="el-icon-phone-outline"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input type="password" v-model="userData.password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="createUser">确 定</el-button>
  </span>
    </el-dialog>

<!--    编辑用户对话框-->
    <el-dialog
      title="编辑用户"
      :visible.sync="editUserDialogVisible"
      width="30%">
      <el-form ref="form" :model="editData" :rules="editUserRules" label-width="0px">
        <el-form-item label="" prop="username" style="text-align: center">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:7001/api/v1/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="editData.avatarURL" :src="editData.baseURL + editData.avatarURL" class="avatar">
            <!--            <img v-if="editData.avatarURL" :src="editData.avatarURL" class="avatar">-->
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="" prop="username">
          <el-input v-model="editData.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="" prop="email">
          <el-input v-model="editData.email" prefix-icon="el-icon-message"></el-input>
        </el-form-item>
        <el-form-item label="" prop="phone">
          <el-input v-model="editData.phone" prefix-icon="el-icon-phone-outline"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input type="password" v-model="editData.password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
    </el-dialog>

    <!--    分配角色对话框-->
    <el-dialog
      title="分配角色"
      :visible.sync="addRoleDialogVisible"
      width="30%">
      <el-form ref="form" :model="currentUser" label-width="80px">
        <el-form-item label="当前用户" prop="" style="text-align: center">
          <el-input v-model="currentUser.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前角色" prop="" style="text-align: center">
          <el-input v-model="currentUser.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="新的角色" prop="">
          <el-select v-model="currentRoleId" placeholder="请选择角色">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">添加角色</el-button>
        <el-button type="danger" @click="removeRole()" v-permission="'users:removeRole'">移除角色</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Ref} from 'vue-property-decorator'
  import {ElForm} from "element-ui/types/form";
  import {getUsers, createUsers, destroyUsers, updateUsers, getRoles, createUserRole, destroyUserRole} from "@/api";
  import XLSX from 'xlsx';
  import { saveAs } from 'file-saver';

  @Component({
  name: 'Users'
})
export default class Users extends Vue{
    @Ref() readonly form?: ElForm;
    // 分配角色相关
    private addRoleDialogVisible = false;
    private currentUser: any = {};
    private currentRoleId = '';
    private roles: any = [];
    private showAddRoleDialog(user: any) {
      this.addRoleDialogVisible = true;
      this.currentUser = user;
      getRoles({})
      .then((res: any) => {
        if(res.status === 200) {
          this.roles = res.data.data.roles;
          (this as any).$message.success('获取角色成功');
        } else {
          (this as any).$message.error('获取角色失败');
        }
      })
      .catch(err => {
        (this as any).$message.error(`获取角色失败-${err.response.data.msg}`);
      })
    }
    private addRole() {
      this.addRoleDialogVisible = false;
      const obj = {userId: this.currentUser.id, roleId: this.currentRoleId};
      createUserRole(obj)
      .then((res: any) => {
        if(res.status === 200) {
          this.getUserList();
          (this as any).$message.success('分配角色成功');
        } else {
          (this as any).$message.error('分配角色失败');
        }
      })
      .catch(err => {
        (this as any).$message.error('分配角色失败');
      })
    }
    private getCurrentRoleName(row: any, column: any, cellValue: any, index: any) {
      const roles = row.roles;
      const names: any[] = [];
      roles.forEach((role: any) => {
        names.push(role.roleName);
      });
      return names.join(' | ');
    }
    private removeRole() {
      this.addRoleDialogVisible = false;
      const obj = {roleId: this.currentRoleId};
      destroyUserRole(this.currentUser.id, obj)
      .then((res: any) => {
        if(res.status === 200) {
          this.getUserList();
          (this as any).$message.success('移除角色成功');
        } else {
          (this as any).$message.error('移除角色失败');
        }
      })
      .catch(err => {
        (this as any).$message.error('移除角色失败');
      })
    }


    private created():void {
      this.getUserList();
    }
    private handleSizeChange(currentSize: any) {
      (this.searchData as any).pageSize = currentSize;
      this.getUserList();
    }
    private handleCurrentChange(currentPage: any) {
      (this.searchData as any).currentPage = currentPage;
      this.getUserList();
    }
    private totalCount = 0;
    private getUserList() {
      getUsers(this.searchData)
        .then((res: any) => {
          if(res.status === 200) {
            // console.log(res.data.data.users, '-----------------')
            const curUserInfo: any = sessionStorage.getItem('userInfo')
            const curUser = JSON.parse(curUserInfo)
            this.tableData = res.data.data.users.filter((user: any) => {
              return user.roles[0] ? user.roles[0].id >= curUser.roles[0].id : user
            });
            this.totalCount = res.data.data.totalCount;
          }else {
            (this as any).$message.error(res.data.msg);
          }
        })
        .catch(err => {
          (this as any).$message.error(err.response.data.msg);
        })
    }

    // 上传成功的回调
    private handleExcelSuccess(res: any, file: any) {
      // console.log(res);
      if(res.code === 200) {
        // (this.tableData as any).push(...res.data); // 红线无伤大雅
        this.getUserList();
        (this as any).$message.success('导入用户成功');
      } else {
        (this as any).$message.success('导入用户失败');
      }
    }
    //上传之前的回调
    private beforeExcelUpload(file: any) {
      // xlsx 文件类型: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
      // xls  文件类型: application/vnd.ms-excel
      // 以上两种类型都是excel文件类型格式 其中xls后缀为2003版本的文件格式，xlsx为2007以上版本的文件格式
      // console.log(file.type);
      // const isExcel = file.type === 'application/vnd.ms-excel';
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isExcel) {
        (this as any).$message.error('上传的文件只能是 Excel 格式!');
      }
      if (!isLt2M) {
        (this as any).$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isExcel && isLt2M;
    }

    private changeUserState(user: any) {
      updateUsers(user.id, user)
      .then((res: any) => {
        if(res.status === 200) {
          (this as any).$message.success('更新用户状态成功');
        } else {
          user.userState = !user.userState;
          (this as any).$message.error('更新用户状态失败');
        }
      })
      .catch(err => {
        user.userState = !user.userState;
        (this as any).$message.error('更新用户状态失败');
      })
    }

    // 上传成功的回调
    private handleAvatarSuccess(res: any, file: any) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      // console.log(res);
      if(res.code === 200) {
        this.editData.avatarURL = res.data;
      }
    }
    //上传之前的回调
    private beforeAvatarUpload(file: any) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        (this as any).$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        (this as any).$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }

  private editUserRules = {
    username: [
      { validator: this.validateUsername, trigger: 'blur' }
    ],
    phone: [
      { validator: this.validatePhone, trigger: 'blur' }
    ],
    email: [
      { validator: this.validateEmail, trigger: 'blur' }
    ],
    password: [
      { validator: this.validatePassword2, trigger: 'blur' }
    ],
  };
  private editData = {
    username: '',
    email: '',
    phone: '',
    password: '',
    id: '',
    avatarURL: '',
  };
  private editUserDialogVisible = false;
  private editUser() {
      this.editUserDialogVisible = false;
      this.form!.validate((flag) => {
      if(flag) {
        updateUsers(this.editData.id, this.editData)
        .then((res: any) => {
          if(res.status === 200) {
            const idx = this.tableData.findIndex((obj: any) => {
              return obj.id === this.editData.id;
            });
            this.$set(this.tableData, idx, this.editData);
            (this as any).$message.success('更新用户成功');
          } else {
            (this as any).$message.error(res.data.msg);
          }
        })
        .catch((err) => {
          (this as any).$message.error(err.response.data.msg);
        })
      }else{
        (this as any).$message.error('请完善用户信息');
      }
    })
  };
  private showEditUserDialog(user: any) {
    this.editUserDialogVisible = true;
    this.editData = Object.assign(this.editData, user);
  }


  private destroyUser(id: string) {
    destroyUsers(id)
    .then((res: any) => {
      if(res.status === 200) {
        const idx = this.tableData.findIndex((obj: any) => {
          return obj.id === id;
        });
        this.tableData.splice(idx, 1);
        (this as any).$message.success(res.data.msg);
      } else {
        (this as any).$message.error(res.data.msg);
      }
    })
    .catch(err => {
      (this as any).$message.error(err.response.data.msg);
    })
  }

  private addUserDialogVisible = false;
  private userData = {
    username: '',
    email: '',
    phone: '',
    password: '',
  };
  private addUserRules = {
    username: [
      { validator: this.validateUsername, trigger: 'blur' }
    ],
    phone: [
      { validator: this.validatePhone, trigger: 'blur' }
    ],
    email: [
      { validator: this.validateEmail, trigger: 'blur' }
    ],
    password: [
      { validator: this.validatePassword, trigger: 'blur' }
    ],
  };
  private validatePhone(rule: any, value: string, callback: any) {
    // console.log(rule, value, callback)
    const reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
    if(value && !reg.test(value)) {
      callback(new Error('手机号格式不正确'));
    }else{
      callback();
    }
  };
  private validateEmail(rule: any, value: string, callback: any) {
    // console.log(rule, value, callback)
    const reg = /^([A-Za-z0-9_\-\.])+\@(163.com|qq.com)$/;
    if(value && !reg.test(value)) {
      callback(new Error('邮箱格式不正确'));
    }else{
      callback();
    }
  };
  private validateUsername(rule: any, value: string, callback: any) {
    // console.log(rule, value, callback)
    const reg = /^[a-zA-Z][a-zA-Z0-9_]{8,20}$/;
    if(!value) {
      callback(new Error('请填写用户名'));
    }else if(value.length < 6) {
      callback(new Error('用户名至少6位'));
    }else if(!reg.test(value)) {
      callback(new Error('用户名只能是字母数字组合'));
    }else{
      callback()
    }
  };
  private validatePassword(rule: any, value: string, callback: any) {
    // console.log(rule, value, callback)
    const reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,20}$/;
    if(!value) {
      callback(new Error('务必填写密码'));
    }else if(value.length < 6) {
      callback(new Error('密码至少8位'));
    }else if(!reg.test(value)) {
      callback(new Error('密码必须包含字母数字和特殊字符'));
    }else{
      callback()
    }
  };
  private validatePassword2(rule: any, value: string, callback: any) {
    // console.log(rule, value, callback)
    const reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,20}$/;
    if(value) {
      if(value.length < 6) {
        callback(new Error('密码至少8位'));
      }else if(!reg.test(value)) {
        callback(new Error('密码必须包含字母数字和特殊字符'));
      }
    }else{
      callback()
    }
  };
  private tableData = [];

  private searchData = {
    role: '',
    origin: '',
    type: '',
    key: '',
    currentPage: 1,
    pageSize: 5,
  };
  private resetDefaultActivePath() {
    sessionStorage.removeItem('activePath');
  }
  private onSubmit() {
    this.getUserList();
  }
  private exportUsers() {
    const user = this.tableData.length ? this.tableData[0] : null;
    if(user) {
      const columnTitles = Object.keys(user);
      const data: any[] = [];
      data.push(columnTitles);
      this.tableData.forEach(user => {
        const temp: any = [];
        columnTitles.forEach(key => {
          temp.push(user[key]);
        });
        data.push(temp);
      });
      // 1.根据表格的内容生成表格中的数据
      const sheet = XLSX.utils.aoa_to_sheet(data);
      // 2.创建一个新的表格
      const workbook = XLSX.utils.book_new();
      // 3.把数据添加到表格中，并给这个表格起一个名称
      XLSX.utils.book_append_sheet(workbook, sheet, 'user');
      // 4.将生成的表格保存到本地
      // XLSX.writeFile(workbook, 'users.xls'); // 有兼容问题 可以配合file-saver.js解决兼容问题
      const wopts: any = {bookType: 'xlsx', bookSST: false, type: 'array'};
      const wbout = XLSX.write(workbook,wopts);
      saveAs(new Blob([wbout],{type: 'application/octet-stream'}), 'users.xlsx')
    }
  }


  private showAddUserDialog() {
    this.addUserDialogVisible = true;
    this.form?.resetFields();
  }
  private createUser() {
    this.addUserDialogVisible = false;
    this.form!.validate((flag) => {
      if(flag) {
        createUsers(this.userData)
          .then((res: any) => {
            if(res.status === 200) {
              const user = res.data.data;
              // (this.tableData as any).push(user);
              this.getUserList();
              (this as any).$message.success('添加用户成功')
            }else{
              (this as any).$message.error(res.data.msg)
            }
          })
          .catch(err => {
            (this as any).$message.error(err.response.data.msg)
          })
      }else{
        (this as any).$message.error('请完善用户信息');
      }
    })
  }
  private importUsers() {

  }
}
</script>

<style lang="scss" scoped>

  .users {
    min-width: 1225px;
  }
  .el-breadcrumb {
    padding-bottom: 20px;
  }
  .el-pagination{
    padding-top: 20px;
  }
  .avatar-uploader {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader:hover {
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
