
# office-automatic

** OA 系统前端代码（还原钉钉流程创建）**

> 基于 vue3 (部分使用 script setup 语法)，element-plus
> 特点：流程创建支持条件组功能，条件设置基于表单创建，支持发起人限制

1. 后台：
    - 审批流程创建
      - workflow 基础信息
      - workflow [表单创建](https://github.com/Abunuo/form-draggable)
      - workflow 流程创建
      - workflow 高级设置
      - 预览功能（前台发起审批模板，需要兼容 PC，移动端）
    - OA审批功能（暂未开发）
2. 前台：
    - 发起审批功能

### Project setup
```
yarn
```

### Compiles and hot-reloads for development
```
yarn dev
```

### Compiles and minifies for production
```
yarn build
```

注：workflow 流程创建借鉴于[StavinLi](https://github.com/StavinLi/Workflow)