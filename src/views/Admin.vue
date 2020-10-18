<template>
  <el-container>
    <el-header>
      <div class="header-left" @click="toggleCollapse">
        <p>Dlmwnr's Design</p>
      </div>
      <div class="header-right">
        <el-menu class="el-menu-demo" mode="horizontal" active-text-color="#ffd04b" background-color="#545c64"
                 text-color="#fff">
          <el-menu-item index="1"><i class="el-icon-bell"></i></el-menu-item>
          <el-menu-item index="2"><i class="el-icon-magic-stick"></i></el-menu-item>
          <el-menu-item index="3" @click="change_full_screen"><i class="el-icon-full-screen"></i></el-menu-item>
          <el-submenu index="4" style="width: 161px">
            <template slot="title">
              <div class="userInfo">
                <p>{{userInfo.username || userInfo.email || userInfo.phone}}</p>
                <img :src="userInfo.baseURL+userInfo.avatarURL" alt="">
                <i class="el-submenu__icon-arrow el-icon-arrow-down"></i>
              </div>
            </template>
            <el-menu-item index="4-1">个人中心</el-menu-item>
            <el-menu-item index="4-2">修改密码</el-menu-item>
            <el-menu-item index="4-3" @click="logout">退出</el-menu-item>
          </el-submenu>
          <el-menu-item index="5"><i class="el-icon-setting"></i></el-menu-item>
        </el-menu>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!--        垂直侧边栏-->
        <el-menu
          default-active="/welcome"
          class="el-menu-vertical-demo"
          background-color="#000"
          text-color="#E1E1E1"
          active-text-color="deepskyblue"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :unique-opened="true"
          :default-active="defaultActivePath">
          <el-menu-item index="/welcome" style="width: 200px;" @click="changeDefaultActivePath('/welcome')">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>主页</span>
            </template>
          </el-menu-item>
          <!--一级菜单-->
          <!--注意点: index绑定的值应为字符串，而后端返回的可能是null，因此需要做特殊处理-->
          <el-submenu style="width: 200px" :index="item.rightsPath || ''" v-for="(item, index) in currentMenus"
                      :key="item.id">
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
          class="el-menu-vertical-demo"
          background-color="#000"
          text-color="#E1E1E1"
          active-text-color="deepskyblue"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :unique-opened="true"
          :default-active="defaultActivePath">
          <!--一级菜单-->
          <el-submenu style="width: 200px" :index="item.path" v-for="item in menus" :key="item.menuName">
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
          <el-menu-item index="/sourse" style="width: 200px;" @click="changeDefaultActivePath('/sourse')">
            <template slot="title">
              <i class="el-icon-shopping-cart-full"></i>
              <span>获取源码</span>
            </template>
          </el-menu-item>
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
    private fullscreen = false;

    private change_full_screen() {
      //全屏切换函数
      let element: any = document.documentElement;
      if (this.fullscreen) {
        if ((document as any).exitFullscreen) {
          (document as any).exitFullscreen();
        } else if ((document as any).webkitCancelFullScreen) {
          (document as any).webkitCancelFullScreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      } else {
        if ((element as any).requestFullscreen) {
          (element as any).requestFullscreen();
        } else if ((element as any).webkitRequestFullScreen) {
          (element as any).webkitRequestFullScreen();
        } else if ((element as any).mozRequestFullScreen) {
          (element as any).mozRequestFullScreen();
        } else if ((element as any).msRequestFullscreen) {
          // IE11
          (element as any).msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen; //判断全屏状态
    }


    private defaultActivePath = '';
    private menus = [
      {
        menuName: '常用页面',
        path: 'commonPage',
        icon: 'el-icon-monitor',
        children: [
          {menuName: '登录', path: '/login', icon: 'el-icon-s-promotion', children: []},
          {menuName: '注册', path: '/register', icon: 'el-icon-thumb', children: []},
          {menuName: '401无权限访问', path: '/error401', icon: 'el-icon-folder-remove', children: []},
          {menuName: '404页面不存在', path: '/error404', icon: 'el-icon-s-flag', children: []},
          {menuName: '500服务端错误', path: '/error500', icon: 'el-icon-s-release', children: []}
        ]
      },
      {
        menuName: 'Echarts图表',
        path: 'echarts',
        icon: 'el-icon-pie-chart',
        children: [
          {menuName: '柱状图', path: '/echartsbar', icon: 'el-icon-s-data', children: []},
          {menuName: '折线图', path: '/echartsline', icon: 'el-icon-finished', children: []},
          {menuName: '地图', path: '/echartsmap', icon: 'el-icon-map-location', children: []}]
      },
      {
        menuName: '设置',
        path: 'settings',
        icon: 'el-icon-setting',
        children: [
          {menuName: '网站基础信息', path: '/settingweb', icon: '', children: []},
          {menuName: '个人设置', path: '/settinguser', icon: '', children: []},
          {menuName: '密码设置', path: '/settingpassword', icon: '', children: [], type: '个人设置'}]
      },
      // {
      //   menuName: '错误页面',
      //   path: 'errorPage',
      //   icon: 'el-icon-document-delete',
      //   children: [
      //     {menuName: '401', path: '/error401', icon: 'el-icon-folder-remove', children: []},
      //     {menuName: '404', path: '/error404', icon: 'el-icon-s-flag', children: []},
      //     {menuName: '500', path: '/error500', icon: 'el-icon-s-release', children: []}
      //   ]
      // },
      // {
      //   menuName: '主页',
      //   path: 'home',
      //   icon: 'el-icon-document-delete',
      // },
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
          return 'el-icon-tickets';
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
      padding-right: 20px;
      padding-left: 0;
      background: #545c64;

      .header-left {
        width: 200px;
        /*height: 55px;*/
        height: 100%;
        cursor: pointer;
        background: #000;
        /*background: url("../assets/bg.jpg") center center no-repeat;*/
        /*background-size: 80% auto;*/
        p {
          text-align: center;
          font-weight: bold;
          margin: 0;
          font-size: 15px;
          line-height: 60px;
          color: #fff;
        }
      }

      .header-right {
        display: flex;
        justify-content: space-between;
        align-items: center;

        i {
          color: #fff;
        }

        .userInfo {
          display: flex;
          align-items: center;
          justify-content: space-between;

          img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 50%;
            /*margin-left: 10px;*/
          }

          p {
            margin: 0;
            padding-right: 10px;
          }
        }
      }
    }

    .el-main {
      padding: 20px 10px !important;
    }

    .el-aside {
      background: #000;
      .el-menu-item {
        a {
          text-decoration: none;
          color: #E1E1E1;
        }
      }
    }
  }
</style>
