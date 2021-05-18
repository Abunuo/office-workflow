<!--
 * @Date: 2021-04-25 21:23:19
 * @Description: 单行输入框
 * @type: 1、模板 2、属性 3、element 模板（默认）
 * eg: 
			<component :is="templateItem.component" ></component>
-->
<template>
	<template v-if="type == 1">
		<props-base :input-data="inputData"></props-base>
	</template>
	<template v-else>
		<el-form-item :label="inputData.label" :props="inputData.key" :required="inputData.required">
			<el-input v-model="editValue" :placeholder="inputData.placeholder"></el-input>
		</el-form-item>
	</template>
</template>

<script>
	import { customDefineComponent, setupCommon } from '../utils.js'
	import PropsBase from '../common/props-base.vue'

	export const componentData = {
		component: 'DragInput',
		name: '单行输入框',
		label: '单行输入框',
		value: '',
		icon: 'el-icon-edit' // 左侧组件列表中组件的 icon
	}

	export default customDefineComponent({
		name: 'DragInput',
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
</style>