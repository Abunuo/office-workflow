/*
 * @Date: 2021-05-17 16:02:36
 * @Description: Mind 相关接口
 */
import axios from '@/utils/axios-util.js'

const baseUrl = import.meta.env.VITE_MIND_URL;

// 获取组织架构
export const getMindOrgnazition = teamId => {
  return axios.get(`${baseUrl}/teams/${teamId}/departments`)
}

/**
 * @description: 根据 token 获取用户信息
 * @return { Promise } asios
 */
export const getMindUserInfo = () => {
  return axios.get(`${baseUrl}/users/me`)
}
