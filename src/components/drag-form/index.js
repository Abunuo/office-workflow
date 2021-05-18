/*
 * @Date: 2021-04-26 10:34:55
 * @Description: 全局注册组件
 */
const modules = import.meta.globEager('./components/*/drag-*.vue')

function install(app) {
  for (const key in modules) {
    const name = modules[key].default.name;
    if (!name) {
      throw new TypeErrorr('component.name is required');
    };
    app.component(name, modules[key].default)
  }
}

export default {
  install
}