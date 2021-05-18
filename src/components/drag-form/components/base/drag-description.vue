<!--
 * @Date: 2021-05-07 11:52:25
 * @Description: 说明文字
-->
<template>
	<template v-if="type == 1">
		<div class="drag-manage">
			<div class="manage-item">
				<div class="label">说明文字 <i class="change-color" :class="!inputData.colorFlag ? 'active' : ''" @click="inputData.colorFlag = !inputData.colorFlag">A</i></div>
				<el-input type="textarea" v-model="inputData.placeholder" :autosize="{ minRows: 3, maxRows: 6 }"></el-input>
			</div>
			<div class="manage-item">
				<div class="label">可以输入链接跳转地址</div>
				<el-input type="textarea" v-model="inputData.link" placeholder="请输入" :autosize="{ minRows: 2, maxRows: 3 }"></el-input>
			</div>
		</div>
	</template>
	<template v-else>
		<el-form-item props="inputData.key">
			<a :href="inputData.link ? inputData.link : 'javascript:void(0);'" :style="{fontSize: '12px', color: inputData.colorFlag ? '#878e98' : '#e9524a'}">{{inputData.placeholder}}</a>
		</el-form-item>
	</template>
</template>

<script>
	import { customDefineComponent, setupCommon } from '../utils.js'
	import PropsBase from '../common/props-base.vue'

	export const componentData = {
		component: 'DragDescription',
		name: '说明文字',
		label: '说明文字',
		value: '',
		link: '',
		placeholder: '请输入说明文字',
		requireLabel: false,
		colorFlag: true,
		icon: 'el-icon-warning-outline' // 左侧组件列表中组件的 icon
	}

	export default customDefineComponent({
		name: 'DragDescription',
		components: {
			PropsBase
		},
		setup(props, context) {
			const { inputData, editValue } = setupCommon(props, context)

			return {
				inputData,
				editValue
			}
		}
	})
</script>

<style lang="scss" scoped>
	::v-deep(.el-textarea__inner) {
		resize: none;
	}
	.el-form-item {
		margin-bottom: 4px!important;
		::v-deep(.el-form-item__content) {
			line-height: 1;
		}
	}
	.change-color {
		float: right;
		display: block;
		width: 24px;
		height: 24px;
		font-weight: bolder;
		border: 1px solid #ededed;
		border-radius: 4px;
		text-align: center;
		line-height: 18px;
		transform: translateY(-6px);
		position: relative;
		cursor: pointer;
		opacity: 0.5;
		&.active {
			opacity: 1;
			box-shadow: inset 0 0 4px 0px #ccc;
		}
		&::after {
			content: '';
			position: absolute;
			bottom: 3px;
			left: 3px;
			width: 16px;
			height: 4px;
			background-color: #e9524a;
		}
	}
</style>