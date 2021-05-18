/**
 * [mutions 类型]
 */

// 创建流程
const workflow = {
  // 设置创建流程名字
  ASYNC_WORKFLOW_TITLE: 'ASYNC_WORKFLOW_TITLE',
  // 设置创建流程发起人
  ASYNC_FLOWPERMISSION: 'ASYNC_FLOWPERMISSION',
  // 设置创建流程步骤
  ASYNC_WORKFLOW_STEP: 'ASYNC_WORKFLOW_STEP',
  // 设置创建流程步骤
  ASYNC_CONDITIONLIST: 'ASYNC_CONDITIONLIST',
}

const user = {
  SET_TOKEN: 'SET_TOKEN',
  SET_TEAM_ID: 'SET_TEAM_ID',
  SET_USER_INFO: 'SET_USER_INFO',
  SET_ORGNAZITION: 'SET_ORGNAZITION',
}

export default {
  ...workflow,
  ...user
}