<!--
 * @Date: 2021-04-28 18:07:46
 * @Description: 预览功能
-->
<template>
  <div class="preview-container">
    <!-- 此处用 if 因为编辑 lable 等可能不会引起视图更新 -->
    <el-dialog v-if="previewVisible" title="提示" v-model="previewVisible" @closed="close" :close-on-click-modal="false">
      <el-form :model="formData" label-position="top">
        <template v-for="formItem in previewData" :key="formItem.key">
          <component :is="formItem.component" :model-value="formItem" v-model:edit-value="formData[formItem.key]"></component>
        </template>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="confirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { defineProps, reactive, watch, defineEmit } from "@vue/runtime-core";
  import * as lodash from 'lodash'

  const props = defineProps({
    previewData: Array,
    previewVisible: {
      type: Boolean,
      default: false
    }
  })
  const emits = defineEmit(['update:previewVisible'])

  const formData = reactive({});

  watch(
    props.previewData,
    newVal => {
      newVal.forEach(item => {
        // 此处做一次深拷贝是因为防止对 item.vaue Object 或 Array 类型的引用
        formData[item.key] = lodash.cloneDeep(item.value);
      })
    }
  )

  const close = () => {
    emits('update:previewVisible', false);
  }

  const confirm = () => {
    console.log(formData);
    close();
  }
  
</script>

<style lang="scss">
  
</style>
<style lang="scss" scoped>
  .preview-container {
    ::v-deep(.el-dialog__body) {
      padding-top: 10px;
      .el-form-item__label {
        padding-bottom: 0;
      }
      .el-input {
        width: 100%;
      }
    }
  }
</style>