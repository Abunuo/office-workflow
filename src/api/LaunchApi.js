import axios from '@/utils/axios-util.js'

const baseUrl = import.meta.env.VITE_OA_URL;

// 存储审批流程
export const postLaunchData = (data) => {
  return axios.post(`${baseUrl}/v1/workflow/procdef/save`, data)
}

// 用户发起 oa 流程
export const postApplyData = (data) => {
  return axios.post(`${baseUrl}/v1/workflow/process/start`, data)
}

// 后台审批流程
export const postApprove = (data) => {
  return axios.post(`${baseUrl}/v1/workflow/task/complete`, data)
}