/*
 * @Date: 2021-04-27 17:12:05
 * @Description: 组件部分 mixin 方法
 */
import {
  defineComponent,
  reactive,
  ref,
  watch
} from 'vue';
const defaultComponentData = {
  props: {
    modelValue: Object,
    active: {
      type: Boolean,
      default: true
    },
    type: Number,
    // 前台 form 表单使用
    editValue: null
  },
  emits: ['update:modelValue', 'update:editValue'],
}

// 组件公共部分
export const customDefineComponent = options => defineComponent(Object.assign({}, defaultComponentData, options));

/**
 * @description: 组件 setup 函数中公用的部分
 * @param {Object} props setup 的 props
 * @param {Object} context setup 的 context
 * @param {Boolean} asyncEditValue 是否需要同步 editValue, false 的情况下需要组件手动同步(防止某些情况下需要对 editValue 额外处理一次， eg： date / dateRange)
 * @return {Object}
 */
export const setupCommon = (props, { emit }, asyncEditValue = true) => {
  let inputData = reactive({})
  watch(
    props.modelValue,
    newVal => {
      inputData = reactive(newVal)
    },
    {immediate:true, deep: true}
  )
  watch(
    inputData,
    newVal => {
      emit('update:modelValue', newVal)
    },
    { deep: true }
  )

  const editValue = ref(null);

  if (props.editValue != undefined) {
    watch(
      () => props.editValue,
      newVal => {
        editValue.value = newVal;
      },
      {immediate: true}
    )
    watch(
      editValue,
      newVal => {
        asyncEditValue && emit('update:editValue', newVal)
      },
      {deep:true}
    )
  }

  return {
    inputData,
    editValue
  }
}

/**
 * @description: 数字金额转化成大写汉字
 * @param {n} number
 * @return {String}
 */
export const number2upper = n => {
  var fraction = ['角', '分'];
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  var unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  var head = n < 0 ? '(负)' : '';
  n = Math.abs(n);
  var s = '';
  for (var i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(shiftRight(n, 1 + i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (var i = 0; i < unit[0].length && n > 0; i++) {
    var p = '';
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(shiftLeft(n, 1));
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}
// 向右移位
function shiftRight(number, digit) {
  digit = parseInt(digit, 10);
  var value = number.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + digit) : digit))
}
// 向左移位
function shiftLeft(number, digit) {
  digit = parseInt(digit, 10);
  var value = number.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] - digit) : -digit))
}

export const renderSize = value =>  {
  if (null == value || value == '') {
    return "0 Bytes";
  }
  var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
  var index = 0,
    srcsize = parseFloat(value);
  index = Math.floor(Math.log(srcsize) / Math.log(1024));
  var size = srcsize / Math.pow(1024, index);
  //  保留的小数位数
  size = size.toFixed(2);
  return size + unitArr[index];
}