<!--
 * @Date: 2021-04-02 16:49:29
 * @LastEditTime: 2021-04-19 21:30:06
 * @Description: 发送到组织架构群
 * @FilePath: office-automatic/src/components/send-group/index.vue
-->

<template>
	<div class="send-group">
		<span class="el-icon-plus" @click="addGroup">添加</span>
		<span v-for="group in groupList" :key="group.name">
			{{group.name}}
			<i class="el-icon-close" @click="delGroup(index)"></i>
		</span>
	</div>
</template>

<script setup>
	import { reactive, defineEmit, defineProps } from '@vue/runtime-core'
	
	const props = defineProps({
		modelValue: Array,
	})
	const emit = defineEmit(['update:modelValue'])

	const groupList = reactive(props.modelValue)

	const addGroup = () => {
		groupList.push({
			name: '请选择所在部门',
			id: groupList.length,
		})
		updateValue()
	}
	
	const delGroup = (index) => {
		groupList.splice(index, 1)
		updateValue()
	}

	const updateValue = () => {
		emit('update:modelValue', groupList)
	}
</script>

<style lang="scss" scoped>
	.send-group {
		width: 100%;
		height: 34px;
		border: 1px solid rgb(220, 223, 230);
		border-radius: 4px;
		padding: 0 10px;
		overflow-x: scroll;
		white-space: nowrap;
		box-sizing: border-box;
		span {
			display: inline-block;
			font-size: 12px;
			line-height: 1;
			margin-right: 10px;
			padding: 4px 6px;
			border-radius: 3px;
			border: 1px solid #d9d9d9;
			&.el-icon-plus {
				color: #007efa;
				border: 1px dotted #007efa;
				cursor: pointer;
			}
			.el-icon-close {
				cursor: pointer;
			}
		}
	}
</style>