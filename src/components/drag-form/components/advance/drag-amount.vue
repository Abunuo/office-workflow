<!--
 * @Date: 2021-05-07 21:01:37
 * @Description: 金额
-->
<template>
	<template v-if="type == 1">
		<props-base :input-data="inputData">
			<template #default="{slotData}">
				<div class="manage-item">
					<div class="label">显示大写<em>（输入数字后自动显示大写）</em></div>
					<el-switch v-model="inputData.upper"></el-switch>
				</div>
			</template>
		</props-base>
	</template>
	<template v-else>
		<el-form-item :label="inputData.label" :props="inputData.key" :required="inputData.required">
			<el-input-number v-model="editValue" :precision="2" :controls="false" :placeholder="inputData.placeholder" @change="convert"></el-input-number>
			<div v-if="inputData.upper" class="upper-inner">大写&nbsp;{{upper}}</div>
		</el-form-item>
	</template>
</template>
 
<script>
	import { ref, watch } from 'vue'
  import { customDefineComponent, setupCommon, number2upper } from '../utils.js'
	import PropsBase from '../common/props-base.vue'

	export const componentData = {
		component: 'DragAmount',
		name: '金额',
		label: '金额（元）',
		value: 0,
		isCondition: true,
		upper: true,  // 是否显示大写
		placeholder: '请输入金额',
		icon: 'el-icon-coin' // 左侧组件列表中组件的 icon
	}

	export default customDefineComponent({
		name: 'DragAmount',
		components: {
			PropsBase
		},
		setup(props, context) {
			const { inputData, editValue } = setupCommon(props, context);

			const upper = ref('');

			const convert = () => upper.value = number2upper(editValue.value)
			
			return {
				inputData,
				editValue,
				upper,
				convert
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
	.upper-inner {
		line-height: 1;
		font-size: 12px;
		margin-top: 14px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: #a3a5a7;
	}
</style>