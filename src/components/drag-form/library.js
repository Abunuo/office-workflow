/*
 * @Date: 2021-04-26 10:34:55
 * @Description: 组件库
 */
import Node from './node.js'
const modules =
  import.meta.globEager('./components/*/drag-*.vue')
const nodeList = [];

const libraryList = [{
  label: '布局控件',
  includes_zh: ['分栏'],
  includes: [],
  list: []
}, {
  label: '基础控件',
  includes_zh: ['单行输入框', '多行输入框', '数字输入框', '单选框', '多选框', '日期', '日期区间', '说明文字', '身份证', '电话'],
  includes: ['DragInput', 'DragTextarea', 'DragNumber', 'DragRadio', 'DragCheckbox', 'DragDate', 'DragDateRange', 'DragDescription', 'DragCard', 'DragTell'],
  list: []
}, {
  label: '增强控件',
  includes_zh: ['图片', '明细/表格', '金额', '附件', '手写签名', '外部联系人', '联系人', '部门', '地点', '计算公式', '电子发票', '关联审批单', '省市区', '评分', '收款账户'],
  includes: ['DragImage', 'DragAmount', 'DragAccessory'],
  list: []
}]

for (const key in modules) {
  nodeList.push(new Node(modules[key].componentData))
}
libraryList.forEach(item => {
  item.includes.forEach(itm => {
    const node = nodeList.find(node => node.component == itm)
    node && item.list.push(node)
  })
})

export default libraryList