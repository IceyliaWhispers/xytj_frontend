import axios from 'axios'; // 引入axios
import Vue from "vue"
Vue.prototype.$http = axios;
// 改变路径
const baseUrl = "https://www.swpuxytj.com:8089";
const localPath = ""
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.timeout = 10000;

axios.interceptors.request.use(config => {
  return config;
});


/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params){    
    return new Promise((resolve, reject) =>{        
        axios.get(baseUrl + url, {            
            params: params        
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)        
    })    
});}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
         axios.post(baseUrl + url, params)
        .then(res => {
            resolve(res.data);
        })
        .catch(err =>{
            reject(err.data)
        })
    });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function put(url, params) {
    return new Promise((resolve, reject) => {
         axios.put(baseUrl + url, params)
        .then(res => {
            resolve(res.data);
        })
        .catch(err =>{
            reject(err.data)
        })
    });
}

/**
 * localGet方法，对应get请求
 * @param {String} url [public下的url地址，如/map]
 */
export function localGet(url){    
    return new Promise((resolve, reject) =>{        
        axios.get(localPath + url).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)        
    })    
});}
