/*
 * @Date: 2021-05-17 18:35:41
 * @Description: 用户信息
 */

import types from '../mutation-types'
import { ElMessage } from 'element-plus'
import { setToken, getToken } from '@/utils/auth.js'
import { getMindUserInfo, getMindOrgnazition } from '@/api/mindApi.js'

const state = {
  token: getToken(),
  teamId: '',
  user: {},
  orgnazition: [],
}

const getters = {
  token: state => state.token,
  teamId: state => state.teamId,
  user: state => state.user,
  userId: state => state.user.id,
  userName: state => state.user.nickname,
  orgnazition: state => state.orgnazition
}

const mutations = {
  [types.SET_TOKEN](state, token) {
    state.token = token;
  },
  [types.SET_TEAM_ID](state, teamId) {
    state.teamId = teamId;
  },
  [types.SET_USER_INFO](state, userInfo) {
    state.user = userInfo;
  },
  [types.SET_ORGNAZITION](state, orgnazition) {
    state.orgnazition = orgnazition;
  },
}

const actions = {
  setToken(context, token) {
    context.commit(types.SET_TOKEN, token)
    // token 存储到 cookie
    setToken(token)
    // 根据 token 同步用户信息
    context.dispatch('getUserInfo', token)
  },
  setTeamId(context, teamId) {
    context.commit(types.SET_TEAM_ID, teamId);
    // 根据 teamId 同步组织架构
    context.dispatch('getOrgnazition', teamId)
  },
  getUserInfo(context) {
    context.commit(types.SET_USER_INFO, {});
  },
  getOrgnazition(context, teamId) {
    context.commit(types.SET_ORGNAZITION, []);
  },
}

export default {
  // namespaced: true,
  state,
  getters,
  actions,
  mutations
}
