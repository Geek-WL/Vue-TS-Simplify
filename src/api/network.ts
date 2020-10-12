import axios from 'axios'
const source = axios.CancelToken.source();

axios.defaults.baseURL = 'http://127.0.0.1:7001';
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true; // 让axios发送请求的时候带上cookie

const isRequest = (actionRights:any, path:string, method:string)=>{
  const reg = new RegExp(`^${actionRights.rightsPath}(/[0-9]*)?$`, 'i');
  if(reg.test(path) && actionRights.rightsMethod === method) return true;
  if(actionRights.children){
    for(let i = 0; i < actionRights.children.length; i++){
      const item = actionRights.children[i];
      if(isRequest(item, path, method)) return true;
    }
  }
  return false;
};
const getActionRights = () => {
  const data = sessionStorage.getItem('userInfo');
  if(!data) return null;
  const userInfo = JSON.parse(data);
  const actionRights = userInfo.rightsTree.filter((rights: any) => {
    if(rights.rightsType === 'action') return rights;
  });
  return actionRights[0];
};
const actionRights = getActionRights();

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // config.headers.Authorization = sessionStorage.getItem('token'); //请求之前把sessionStorage里的token放到请求头中
  // console.log(config);
  const curPath = config.url || '';
  const curMethod = config.method || '';
  if(curPath.startsWith('/api/v1')) {
    const flag = isRequest(actionRights, curPath, curMethod);
    if(!flag) {
      config.cancelToken = source.token;
      source.cancel('没有对应的请求权限');
    }
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
});


// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
});

export default {
  get(path = '', data = {}) {
    return new Promise((resolve, reject) => {
      axios.get(path, {
        params: data
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
      })
    })
  },
  post(path = '', data = {}) {
    return new Promise((resolve, reject) => {
      axios.post(path, data)
        .then(res => {
          // res不是后端传过来的数据 axios的请求把后端返回的数据放进了 data属性下，然后自己封装了一层axios请求的信息，所以要用到真正后端返回的数据就在这里直接返回res.data,筛选掉它自己加的内容
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  delete(path = '') {
    return new Promise((resolve, reject) => {
      axios.delete(path)
        .then(res => {
          // res不是后端传过来的数据 axios的请求把后端返回的数据放进了 data属性下，然后自己封装了一层axios请求的信息，所以要用到真正后端返回的数据就在这里直接返回res.data,筛选掉它自己加的内容
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  put(path = '', data = {}) {
    return new Promise((resolve, reject) => {
      axios.put(path, data)
        .then(res => {
          // res不是后端传过来的数据 axios的请求把后端返回的数据放进了 data属性下，然后自己封装了一层axios请求的信息，所以要用到真正后端返回的数据就在这里直接返回res.data,筛选掉它自己加的内容
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  all(list: any[]) {
    return new Promise((resolve, reject) => {
      axios.all(list)
        .then(res => {
          resolve(res) // 两个请求都完成
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
