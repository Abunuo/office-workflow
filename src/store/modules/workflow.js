/*
 * @Date: 2021-05-13 10:03:05
 * @Description: 后台创建流程 store
 */
import types from '../mutation-types'

const state = {
  title: '',
  flowPermission: [],
  step: 1,
  conditionList: [],
}

const getters = {
  title: state => state.title,
  flowPermission: state => state.flowPermission,
  step: state => state.step,
  conditionList: state => state.conditionList
}

const mutations = {
  [types.ASYNC_WORKFLOW_TITLE](state, title) {
    state.title = title;
  },
  [types.ASYNC_FLOWPERMISSION](state, flowPermission) {
    state.flowPermission = flowPermission;
  },
  [types.ASYNC_WORKFLOW_STEP](state, step) {
    state.step = step;
  },
  [types.ASYNC_CONDITIONLIST](state, conditionList) {
    state.conditionList = conditionList;
  },
}

const actions = {
  asyncTitle(context, title) {
    context.commit(types.ASYNC_WORKFLOW_TITLE, title)
  },
  asyncFlowPermission(context, flowPermission) {
    context.commit(types.ASYNC_FLOWPERMISSION, flowPermission)
  },
  asyncStep(context, step) {
    context.commit(types.ASYNC_WORKFLOW_STEP, step)
  },
  asyncConditionList(context, conditionList) {
    context.commit(types.ASYNC_CONDITIONLIST, conditionList)
  },
}

export default {
  // namespaced: true,
  state,
  getters,
  actions,
  mutations
}
