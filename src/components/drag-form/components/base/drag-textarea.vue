<!--
 * @Date: 2021-04-27 17:06:24
 * @Description: 多行输入框
-->
<template>
	<template v-if="type == 1">
		<props-base :input-data="inputData"></props-base>
	</template>
	<template v-else>
		<el-form-item :label="inputData.label" :props="inputData.key" :required="inputData.required">
			<el-input type="textarea" v-model="editValue" :placeholder="inputData.placeholder" :autosize="{ minRows: 3, maxRows: 6 }"></el-input>
		</el-form-item>
	</template>
</template>

<script>
  import { customDefineComponent, setupCommon } from '../utils.js'
	import PropsBase from '../common/props-base.vue'

	export const componentData = {
		component: 'DragTextarea',
		name: '多行输入框',
		label: '多行输入框',
		value: '',
		icon: 'el-icon-edit', // 左侧组件列表中组件的 icon
	}
  
  export default customDefineComponent({
    name: 'DragTextarea',
		components: {
			PropsBase
		},
    setup(props, context) {
      const { inputData, editValue } = setupCommon(props, context);
			
			return {
				inputData,
				editValue
			}
    }
  })
</script>

<style lang="scss" scoped>
  .drag-textarea {
    height: 100px;
  }
	::v-deep(.el-textarea__inner) {
		resize: none;
	}
</style>