/*
 * @Date: 2021-04-19 17:47:17
 * @Description: workflow 使用的指令
 */
const install = app => {
  app.directive('enterNumber', {
    // value 表示可以输入几位小数
    beforeMount: function (el, {
      value = 2
    }) {
      el = el.nodeName == "INPUT" ? el : el.children[0]
      var RegStr = value == 0 ? `^[\\+\\-]?\\d+\\d{0,0}` : `^[\\+\\-]?\\d+\\.?\\d{0,${value}}`;
      el.addEventListener('keyup', function () {
        el.value = el.value.match(new RegExp(RegStr, 'g'));
        el.dispatchEvent(new Event('input'))
      })
    }
  });
  app.directive('focus', {
    // 当被绑定的元素插入到 DOM 中时……
    mounted: function (el) {
      el.focus()
    }
  });
}

export default {
  install
};