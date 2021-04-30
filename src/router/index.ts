import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'

// import Home from '../views/Home.vue'
// import Register from "@/views/Register.vue";
// import Login from '@/views/Login.vue'
// import Admin from '@/views/Admin.vue'
// import Welcome from '@/components/Welcome.vue'
// import Users from "@/components/Users.vue";
// import Rights from "@/components/Rights.vue";
// import Roles from "@/components/Roles.vue"
// import Error401 from "@/components/error-page/Error401.vue";
// import Error404 from "@/components/error-page/Error404.vue";
// import Error500 from "@/components/error-page/Error500.vue";
// import EchartsBarSpace from "@/components/echarts/EchartsBarSpace.vue"
// import EchartsLineSpace from "@/components/echarts/EchartsLineSpace.vue"
// import ChinaMapSpace from "@/components/echarts/ChinaMapSpace.vue"
// import WebDataSettings from "@/components/settings/WebDataSettings.vue"
// import UserSettings from "@/components/settings/UserSettings.vue"
// import PasswordSetting from "@/components/settings/PasswordSetting.vue"
// import SourseCodePage from "@/components/SourseCodePage.vue"
import Cookies from "js-cookie";

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页 - TS后台管理'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      title: '注册 - TS后台管理'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '登录 - TS后台管理'
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    redirect: '/welcome',
    meta: {
      title: '仪表台 - TS后台管理'
    },
    children: [
      {
        path: '/welcome',
        component: () => import('@/components/Welcome.vue'),
        meta: {
          title: '仪表台 - TS后台管理'
        }
      },
      {
        path: '/users',
        component: () => import('@/components/Users.vue'),
        meta: {
          title: '用户管理 - TS后台管理'
        }
      },
      {
        path: '/rights',
        component: () => import('@/components/Rights.vue'),
        meta: {
          title: '权限管理 - TS后台管理'
        }
      },
      {
        path: '/roles',
        component: () => import('@/components/Roles.vue'),
        meta: {
          title: '角色管理 - TS后台管理'
        }
      },
      {
        path: '/error401',
        component: () => import('@/components/error-page/Error401.vue'),
        meta: {
          title: '401 - TS后台管理'
        }
      },
      {
        path: '/error404',
        component: () => import('@/components/error-page/Error404.vue'),
        meta: {
          title: '404 - TS后台管理'
        }
      },
      {
        path: '/error500',
        component: () => import('@/components/error-page/Error500.vue'),
        meta: {
          title: '500 - TS后台管理'
        }
      },
      {
        path: '/echartsbar',
        component: () => import('@/components/echarts/EchartsBarSpace.vue'),
        meta: {
          title: '柱状图 - TS后台管理'
        }
      },
      {
        path: '/echartsline',
        component: () => import('@/components/echarts/EchartsLineSpace.vue'),
        meta: {
          title: '线性图 - TS后台管理'
        }
      },
      {
        path: '/echartsmap',
        component: () => import('@/components/echarts/ChinaMapSpace.vue'),
        meta: {
          title: '地图 - TS后台管理'
        }
      },
      {
        path: '/settingweb',
        component: () => import('@/components/settings/WebDataSettings.vue'),
        meta: {
          title: '网站设置 - TS后台管理'
        }
      },
      {
        path: '/settinguser',
        component: () => import('@/components/settings/UserSettings.vue'),
        meta: {
          title: '个人中心 - TS后台管理'
        }
      },
      {
        path: '/settingpassword',
        component: () => import('@/components/settings/PasswordSetting.vue'),
        meta: {
          title: '重置密码 - TS后台管理'
        }
      },
      {
        path: '/sourse',
        component: () => import('@/components/SourseCodePage.vue'),
        meta: {
          title: '外链 - TS后台管理'
        }
      },
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
  NProgress.start();
  // 如果是访问非权限页面 放行
  if (to.path === '/register' || to.path === '/login' || to.path === '/error401' || to.path === '/error404' || to.path === '/error500' || to.path === '/echartsbar' || to.path === '/echartsline' || to.path === '/echartsmap' || to.path === '/settingweb' || to.path === '/settinguser' || to.path === '/settingpassword' || to.path === '/sourse') {
    return setTimeout(() => {
      document.title = to.meta.title || '通用后台管理系统'
      next()
    }, 300);
  }
  // 判断登录状态，没有token就跳转至登录页
  // const token = sessionStorage.getItem('token')
  const token = Cookies.get('token');
  if (!token) {
    return next('/login')
  }
  const routerRights = getRouterRights();
  const flag = isNext(routerRights, to.path);
  if (flag) {
    document.title = to.meta.title || '通用后台管理系统'
    next()
  } else {
    next(false); //可以跳转 但无任何展示
  }
  // 如果已登录 直接放行

});

router.afterEach(() => {
  NProgress.done();
});

// 遍历所有路由权限的路由地址，然后跟跳转的路由进行判断，true为有权限，false则无
const isNext = (routerRights: any, path: string) => {
  if (routerRights.rightsPath === path) return true;
  if (routerRights.children) {
    for (let i = 0; i < routerRights.children.length; i++) {
      const item = routerRights.children[i];
      if (isNext(item, path)) return true;
    }
  }
  return false;
};
// 取出路由相关权限
const getRouterRights = () => {
  const data = sessionStorage.getItem('userInfo');
  if (!data) return null;
  const userInfo = JSON.parse(data);
  const routerRights = userInfo.rightsTree.filter((rights: any) => {
    if (rights.rightsType === 'router') return rights;
  });
  return routerRights[0];
};

export default router
