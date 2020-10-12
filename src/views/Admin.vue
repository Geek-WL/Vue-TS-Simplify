<template>
  <el-container>
    <el-header>
      <div class="header-left" @click="toggleCollapse"></div>
      <div class="header-right">
        <img :src="userInfo.baseURL+userInfo.avatarURL" alt="">
        <p>{{userInfo.username || userInfo.email || userInfo.phone}}</p>
        <el-button @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!--        垂直侧边栏-->
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#000"
          text-color="#fff"
          active-text-color="deepskyblue"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="defaultActivePath">
          <!--一级菜单-->
          <!--注意点: index绑定的值应为字符串，而后端返回的可能是null，因此需要做特殊处理-->
          <el-submenu :index="item.rightsPath || ''" v-for="(item, index) in currentMenus" :key="item.id">
            <template slot="title">
              <i :class="getIcon(item.rightsName)"></i>
              <span>{{item.rightsName}}</span>
            </template>
            <!--            二级菜单-->
            <el-menu-item-group>
              <!--注意点: index绑定的值应为字符串，而后端返回的可能是null，因此需要做特殊处理-->
              <el-menu-item :index="subItem.rightsPath || ''" v-for="subItem in item.children" :key="subItem.id"
                            @click="changeDefaultActivePath(subItem.rightsPath)">
                <i :class="getIcon(subItem.rightsName)"></i>
                <span>{{subItem.rightsName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#000"
          text-color="#fff"
          active-text-color="deepskyblue"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="defaultActivePath">
          <!--一级菜单-->
          <el-submenu :index="item.path" v-for="item in menus" :key="item.menuName">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.menuName}}</span>
            </template>
            <!--            二级菜单-->
            <el-menu-item-group>
              <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.menuName"
                            @click="changeDefaultActivePath(subItem.path)">
                <i :class="subItem.icon"></i>
                <span>{{subItem.menuName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
  import {Vue, Component} from 'vue-property-decorator'
  import Cookies from "js-cookie";

  @Component({
    name: 'Admin'
  })
  export default class Admin extends Vue {
    private defaultActivePath = '';
    private menus = [
      {
        menuName: '错误页面',
        path: '',
        icon: 'el-icon-document-delete',
        children: [
          {menuName: '401', path: '/error401', icon: 'el-icon-folder-remove', children: []},
          {menuName: '404', path: '/error404', icon: 'el-icon-s-flag', children: []},
          {menuName: '500', path: '/error500', icon: 'el-icon-s-release', children: []}
        ]
      },
      // {
      //   menuName:'用户管理',
      //   path: '',
      //   icon: 'el-icon-setting',
      //   children:[
      //     {menuName:'用户列表',path: '/users', icon:'el-icon-user', children:[]}
      //   ]
      // },
      // {
      //   menuName:'权限管理',
      //   path: '',
      //   icon:'el-icon-collection',
      //   children:[
      //     {menuName:'角色列表',path: '/roles', icon:'el-icon-view',children:[]},
      //     {menuName:'权限列表',path: '/rights', icon:'el-icon-unlock',children:[]}
      //   ]
      // },
    ];

    private get currentMenus() {
      for (let i = 0; i < this.userInfo.rightsTree.length; i++) {
        const rights = this.userInfo.rightsTree[i];
        if (rights.rightsType === 'menu') {
          return rights.children;
        }
      }
    }

    private isCollapse = false;

    private logout() {
      Cookies.remove('token');
      sessionStorage.removeItem('activePath');
      sessionStorage.removeItem('userInfo');
      this.$router.push('/login');
    }

    private toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }

    private changeDefaultActivePath(path: string) {
      this.defaultActivePath = path;
      sessionStorage.setItem('activePath', path)
    }

    private userInfo: any = {};

    created(): void {
      const path = sessionStorage.getItem('activePath');
      this.defaultActivePath = path ? path : '';
      const userInfo = sessionStorage.getItem('userInfo');
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);
      }
      // console.log(this.userInfo.rightsTree);
      // 解决菜单同步展开问题
      let i = 1;
      this.userInfo.rightsTree[0].children.forEach((item: any) => {
        item.rightsPath = `${i++}`
      });
    }
    private getIcon(rightsName: string) {
      switch (rightsName) {
        case '用户管理':
          return 'el-icon-setting';
          break;
        case '权限管理':
          return 'el-icon-collection';
          break;
        case '用户列表':
          return 'el-icon-user';
          break;
        case '用户管理':
          return 'el-icon-setting';
          break;
        case '角色列表':
          return 'el-icon-view';
          break;
        case '权限列表':
          return 'el-icon-unlock';
          break;
        default:
          '';
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-container {
    width: 100%;
    height: 100%;
    background: #fff;

    .el-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      background: #144a83;

      .header-left {
        width: 160px;
        height: 55px;
        cursor: pointer;
        background: url("../assets/bg.jpg") center center no-repeat;
        background-size: 80% auto;
      }

      .header-right {
        display: flex;
        justify-content: space-between;
        align-items: center;

        img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 50%;
          /*margin-left: 10px;*/
        }

        p {
          padding-left: 10px;
          padding-right: 20px;
        }
      }
    }

    .el-aside {
      background: #000;
    }
  }
</style>
