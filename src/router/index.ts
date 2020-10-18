import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Register from "@/views/Register.vue";
import Login from '@/views/Login.vue'
import Admin from '@/views/Admin.vue'
import Welcome from '@/components/Welcome.vue'
import Users from "@/components/Users.vue";
import Rights from "@/components/Rights.vue";
import Roles from  "@/components/Roles.vue"
import Error401 from "@/components/error-page/Error401.vue";
import Error404 from "@/components/error-page/Error404.vue";
import Error500 from "@/components/error-page/Error500.vue";
import EchartsBarSpace from "@/components/echarts/EchartsBarSpace.vue"
import EchartsLineSpace from "@/components/echarts/EchartsLineSpace.vue"
import ChinaMapSpace from "@/components/echarts/ChinaMapSpace.vue"
import WebDataSettings from "@/components/settings/WebDataSettings.vue"
import UserSettings from "@/components/settings/UserSettings.vue"
import PasswordSetting from "@/components/settings/PasswordSetting.vue"
import SourseCodePage from "@/components/SourseCodePage.vue"
import Cookies from "js-cookie";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: Welcome},
      {path: '/users', component: Users},
      {path: '/rights', component: Rights},
      {path: '/roles', component: Roles},
      {path: '/error401', component: Error401},
      {path: '/error404', component: Error404},
      {path: '/error500', component: Error500},
      {path: '/echartsbar', component: EchartsBarSpace},
      {path: '/echartsline', component: EchartsLineSpace},
      {path: '/echartsmap', component: ChinaMapSpace},
      {path: '/settingweb', component: WebDataSettings},
      {path: '/settinguser', component: UserSettings},
      {path: '/settingpassword', component: PasswordSetting},
      {path: '/sourse', component: SourseCodePage},
    ]
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// 路由控制
router.beforeEach((to, form, next) => {
  // 如果是访问非权限页面 放行
  if(to.path === '/register' || to.path === '/login' || to.path === '/error401' || to.path === '/error404' || to.path === '/error500' || to.path === '/echartsbar' || to.path === '/echartsline' || to.path === '/echartsmap' || to.path === '/settingweb' || to.path === '/settinguser' || to.path === '/settingpassword' || to.path === '/sourse') {
    return next();
  }
  // 判断登录状态，没有token就跳转至登录页
  // const token = sessionStorage.getItem('token')
  const token = Cookies.get('token');
  if(!token) {
    return next('/login')
  }
  const routerRights = getRouterRights();
  const flag = isNext(routerRights, to.path);
  if(flag) {
    next()
  } else {
    next(false); //可以跳转 但无任何展示
  }
  // 如果已登录 直接放行

});
// 遍历所有路由权限的路由地址，然后跟跳转的路由进行判断，true为有权限，false则无
const isNext = (routerRights: any, path: string) => {
  if(routerRights.rightsPath === path) return true;
  if(routerRights.children) {
    for(let i = 0; i < routerRights.children.length; i++) {
      const item = routerRights.children[i];
      if(isNext(item, path)) return true;
    }
  }
  return false;
};
// 取出路由相关权限
const getRouterRights = () => {
  const data = sessionStorage.getItem('userInfo');
  if(!data) return null;
  const userInfo = JSON.parse(data);
  const routerRights = userInfo.rightsTree.filter((rights: any) => {
    if(rights.rightsType === 'router') return rights;
  });
  return routerRights[0];
};

export default router
