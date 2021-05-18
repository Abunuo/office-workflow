<!--
 * @Date: 2021-04-25 21:23:19
 * @Description: 单行输入框
 * @type: 1、模板 2、属性 3、element 模板（默认）
-->
<template>
	<template v-if="type == 1">
		<props-base :input-data="inputData">
			<template #default="{slotData}">
				<div class="manage-item">
					<div class="label">单位</div>
					<el-input v-model="slotData.label_extend" placeholer="请输入"></el-input>
				</div>
			</template>
		</props-base>
	</template>
	<template v-else>
		<el-form-item :label="inputData.label" :props="inputData.key" :required="inputData.required">
			<el-input-number v-model="editValue" :controls="false" :placeholder="inputData.placeholder"></el-input-number>
		</el-form-item>
	</template>
</template>

<script>
	import { customDefineComponent, setupCommon } from '../utils.js'
	import PropsBase from '../common/props-base.vue'

	export const componentData = {
		component: 'DragNumber',
		name: '数字输入框',
		label: '数字输入框',
		label_extend: '',
		value: 0,
		isCondition: true,
		placeholer: '请输入数字',
		icon: 'el-icon-edit' // 左侧组件列表中组件的 icon
	}

	export default customDefineComponent({
		name: 'DragNumber',
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
	::v-deep(.el-input-number) {
		width: 100%;
		.el-input__inner {
			text-align: left;
		}
	}
</style>