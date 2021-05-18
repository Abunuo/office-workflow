/*
 * @Date: 2021-04-19 19:14:13
 * @Description: workflow 数据
 */

// 默认流程节点数据
export const defaultNodeConfig = {
  pkId: 'sid-start-node',
  nodeName: '发起人',
  type: 0,
  nodeUserList: [],
  childNode: {
    nodeName: '审核人',
    error: false,
    type: 1,
    settype: 2,
    selectMode: 0,
    selectRange: 0,
    directorLevel: 1,
    replaceByUp: 0,
    examineMode: 1,
    noHanderAction: 2,
    examineEndDirectorLevel: 0,
    childNode: {
      nodeName: '抄送人',
      type: 2,
      ccSelfSelectFlag: 1,
      childNode: null,
      nodeUserList: [],
      error: false,
    },
    nodeUserList: [],
  },
}

// 创建流程步骤数据
export const navListInitData = [{
    step: 1,
    name: '基础设置',
    component: 'Main',
    data: {}
  },
  {
    step: 2,
    name: '表单设计',
    component: 'Apply',
    data: {}
  },
  {
    step: 3,
    name: '流程设计',
    component: 'Workflow',
    data: {}
  },
  {
    step: 4,
    name: '高级设置',
    component: 'Advanced',
    data: {}
  }
]

// 编辑时数据  -> 测试用
export default {
  workFlowVersionId: '',
  // 第一步数据
  name: '请假',
  description: '请假简介',
  procGroupId: 2,
  // 表单数据
  formTable: [],
  // 流程数据
  directorMaxLevel: 4,
  flowPermission: [],
  resource: defaultNodeConfig,
}