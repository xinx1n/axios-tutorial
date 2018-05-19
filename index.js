import axios from "axios";
import _ from "lodash";

console.log('默认配置:', axios.defaults);

// 超时设置
axios.defaults.timeout = 3000;

// 设置通用头部
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// 跨域携带cookie
axios.defaults.headers.common['withCredentials'] = true;

// 拦截请求
axios.interceptors.request.use(config => {
  config.headers['Authorization'] = 'whr2'
  return config
}, error => {
  // 什么时候会发送请求失败？
  console.log(error);
})

// 拦截响应
axios.interceptors.response.use(response => {
  response.code = 1;
  return response
}, error => {
  const { response, config } = error;
  const { url } = config;
  let status, message;
  if (response && _.isPlainObject(response)) {
    const { data, statusText } = response;
    status = response.status;
    message = data.message || statusText;
  } else {
      status = 600
      message = error.message || 'Network Error'
  }
  return Promise.reject({
    code: 0,
    url,
    message,
    status,
  })
})

console.log('拦截器:', axios.interceptors);

axios.get('http://jsonplaceholder.typicode.com/users', {
  params: {
    b: 2
  },
  headers: {
    'Authorization': 'whr',
  }
})
.then(data => {
  console.log('请求成功的数据:', data);
})
.catch(err => {
  console.log('请求失败:', err);
})
