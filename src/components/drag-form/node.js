/*
 * @Date: 2021-04-25 21:07:58
 * @Description: 组件数据
 */

export default class Node {
  component =  ''; // 组件名称，需要提前注册到 Vue

  // 左侧拖拽组件属性
  name = ''; // 左侧组件列表中组件的的名字
  icon = '' // 左侧组件列表中组件的 icon

  // form 表单属性
  label = ''; // 表单 label
  label_extend = ''; // 表单 label 额外拓展(数字组件)
  requireLabel = true; // 表单是否需要 label , 默认需要
  requireContent = true; // 表单是否需要 content , 默认需要
  key = ''; // 表单使用：需要存储的 key
  value = null; //  表单使用：需要存储的 key 对应的 value
  placeholder = '请输入'; // 组件提示文字
  labelLength = 20; // 组件 label 最大字数
  placeholderLength = 50; // 组件提示信息最大字数
  required = false; // 是否必填
  isCondition = false; // 是否可以作为后续流程条件

  verify = null;  //自定义校验函数
  
  // 组件样式, 暂不支持修改
  style = { 
    width: '100%',
    height: 33,
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'left',
    color: ''
  }
  constructor(options) {
    if (!options.component || !options.name || !options.icon) {
      throw '"component" or "name" or "icon"is required by Component!'
    }
    // FIXED: label 可以为空。eg: drag-description
    // if (!options.label) {
    //   options.label = options.component;
    // }
    Object.assign(this, options)
  }
  setProperty(key, value) {
    this[key] = value
  }
  getProperty(key) {
    return this[key]
  }
}