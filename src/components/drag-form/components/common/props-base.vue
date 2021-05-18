<!--
 * @Date: 2021-04-28 11:03:55
 * @Description: 属性编辑区公共部分
-->
<template>
	<div class="drag-manage">
		<div class="manage-item" v-if="label" :class="inputData.label==''?'error':''">
			<div class="label">标题 <em>{{inputData.label==''?'标题不能为空':`最多${inputData.labelLength}字`}}</em></div>
			<el-input v-model="inputData.label"></el-input>
		</div>
		<div class="manage-item" v-if="placeholder">
			<div class="label">提示文字 <em>最多{{inputData.placeholderLength}}字</em></div>
			<el-input v-model="inputData.placeholder"></el-input>
		</div>
		<slot :slot-data="inputData"></slot>
		<div class="manage-item" v-if="required">
			<div class="label">必填
				<em v-if="inputData.isCondition">
					勾选后可作为
					<el-tooltip popper-class="require-notice" content="流程条件：流程设计里可用于区分流程走向，例如：金额大于500需要主管+经理审批；小于500只需要主管审批。" placement="top-end">
						<i class="require-poper">流程条件</i>
					</el-tooltip>
				</em>
			</div>
			<el-switch v-model="inputData.required"></el-switch>
		</div>
	</div>
</template>
 
<script setup>
	import { defineProps, computed } from '@vue/runtime-core'

	const props = defineProps({
		inputData: Object,
		label: {
			type: Boolean,
			default: true
		},
		placeholder: {
			type: Boolean,
			default: true
		},
		required: {
			type: Boolean,
			default: true
		}
	})
	
	const inputData = computed(() => props.inputData)
</script>
 
<style lang="scss" scoped>
	::v-global(.require-notice) {
		width: 250px;
	}
	.require-poper {
		color: #3a88f1;
		cursor: pointer;
	}
</style>