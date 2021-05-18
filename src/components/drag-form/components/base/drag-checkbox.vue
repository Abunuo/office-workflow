<!--
 * @Date: 2021-04-29 16:42:44
 * @Description: 多选框，类似于单选框
-->
<template>
  <template v-if="type == 1">
		<props-base :input-data="inputData">
			<template #default="{slotData}">
				<div class="manage-item">
					<div class="label">选项</div>
					<div class="checkbox-option-item" v-for="option in slotData.options" :key="option.key">
						<i class="drag-icon el-icon-rank"></i>
						<el-input v-model="option.label"></el-input>
						<i class="el-icon-delete" @click="delOption(option)"></i>
					</div>
					<div class="checkbox-operation">
						<span @click="addOption">添加选项</span>
					</div>
				</div>
				<!-- 暂时不做平铺功能 -->
				<!-- <div class="manage-item">
					<div class="label">选项平铺</div>
					<el-switch v-model="slotData.flat"></el-switch>
				</div> -->
			</template>
		</props-base>
	</template>
	<template v-else>
		<el-form-item :label="inputData.label" :props="inputData.key" :required="inputData.required">
      <el-checkbox-group v-model="editValue">
		  	<el-checkbox v-for="option in inputData.options" :key="option.key" :label="option.value">{{option.label}}</el-checkbox>
      </el-checkbox-group>
		</el-form-item>
	</template>
</template>

<script>
  import { customDefineComponent, setupCommon } from '../utils.js'
	import PropsBase from '../common/props-base.vue'

	const timestamp = new Date().getTime();
	export const componentData = {
		component: 'DragCheckbox',
		name: '多选框',
		label: '多选框',
		value: [],
		flat: true,
		isCondition: true,
		start_timestamp: timestamp,  // 用来生成后续的 options 的 key
		options: [{
			label: '选项 1',
			key: `IM30_${timestamp}_DragCheckbox_option`,
			value: timestamp
		}, {
			label: '选项 2',
			key: `IM30_${timestamp+1}_DragCheckbox_option`,
			value: timestamp+1
		}, {
			label: '选项 3',
			key: `IM30_${timestamp+2}_DragCheckbox_option`,
			value: timestamp+2
		}],
		icon: 'el-icon-circle-check' // 左侧组件列表中组件的 icon
	}

	export default customDefineComponent({
		name: 'DragCheckbox',
		components: {
			PropsBase
		},
		setup(props, context) {
			const { inputData, editValue } = setupCommon(props, context);

			const addOption = () => {
				const index = inputData.options.length+1;
				inputData.options.push({
					label: '选项 '+index,
					key: `IM30_${inputData.start_timestamp+index}_DragCheckbox_option`,
					value: inputData.start_timestamp + index
				})
			}

			const delOption = option => {
				const index = inputData.options.findIndex(item => item == option);
				inputData.options.splice(index, 1)
			}

			return {
				inputData,
				editValue,

				addOption,
				delOption
			}
		}
	})
</script>

<style lang="scss" scoped>
	.checkbox-option-item {
		display: flex;
		align-items: center;
		line-height: 1;
		margin-bottom: 6px;
		i{
			margin: 0 4px;
			cursor: pointer;
			&.drag-icon {
				cursor: move;
			}
		}
		> div {
			flex: 1;
		}
	}
	.checkbox-operation {
		span {
			font-weight: bold;
			font-size: 12px;
			cursor: pointer;
			color: #409eff;
			padding: 0 8px;
			&:first-of-type {
				padding-left: 0;
			}
			&:not(:last-of-type) {
				border-right: 1px solid #dadada;
			}
		}
	}
</style>