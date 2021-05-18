/**
 * import axios from '../axios-util.js'
 *
 * axios({
 *      url: '/user',  // `url` 是用于请求的服务器 URL
 *      method: 'get', // `method` 是创建请求时使用的方法   默认 default  
 *      headers: {'X-Requested-With': 'XMLHttpRequest'},   // `headers` 是即将被发送的自定义请求头
 *      params: {ID: 12345},  // `params` 是即将与请求一起发送的 URL 参数  GET 请求
 *      data: {}  // `data` 是作为请求主体被发送的数据   只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
 *      responseType: 'json', // default   // `responseType` 表示服务器响应的数据类型 相当于 jsonType
 * })
 */

import Axios from 'axios';
import {
	ElMessage
} from 'element-plus';

const baseURL = import.meta.env.VITE_BASE_URL

const axios = Axios.create({
	baseURL,
	withCredentials: true,
	timeout: 5000
});

// 请求体预处理
axios.interceptors.request.use(config => {
	// 可以对请求的 headers 等修改

	// 当 application/json 的时候不用对 data 数据做处理  浏览器显示 request payload
	// 当 application/x-www-form-urencode 的时候。需要对 data 数据做 qs.stringfy(data)处理

	// if(window.localStorage.getItem('MDUSERTOKEN')) {
	//     config.headers.token = window.localStorage.getItem('MDUSERTOKEN')
	// }
	return config;
}, error => {
	return Promise.reject(error)
})

// 请求返回信息处理
axios.interceptors.response.use(response => {
	// 可以对请求返回的data修改，提前处理返回的 status 等
	const responseData = response.data,
		code = responseData.code;
	switch (code) {
		case 0:
			return responseData;
			break;
		case -1:
			ElMessage({
				type: 'warning',
				message: responseData.message
			})
			return Promise.reject()
			break;
		default:
			return responseData;
			break;
	}
}, error => {
	ElMessage({
		type: 'error',
		message: error
	})
	return Promise.reject(error);
});

export const post = (url, data = {}) => {
	return axios({
		url,
		method: 'post',
		data,
	})
}

export const get = (url, params = {}) => {
	return axios({
		url,
		method: 'get',
		params
	})
}

export default axios;