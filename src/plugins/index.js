/*
 * @Date: 2021-05-18 09:57:07
 * @Description: 指令入口文件
 */

const modules = import.meta.globEager('./*.js');

export default {
  install: app => {
    for (const key in modules) {
      const install = modules[key].default;
      if(typeof install == 'function') {
        install(app);
        return;
      }
      if(typeof install == 'object' && typeof install.install == 'function'){
        install.install(app);
        return;
      }
      throw 'directive install is required!';
    }
  }
}