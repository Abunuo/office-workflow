<template>
	<layout>
		<div class="approve-content">
			<el-button @click="confirm">审批通过</el-button>
		</div>
	</layout>
</template>

<script setup>
	import { provide } from 'vue';
	import Layout from '@/layouts/main.vue'
	import { postApprove } from '@/api/LaunchApi.js'

	// 提供给 nav-header 组件的 back 方法，可不传递
	provide('title', '审批')

	// 提交审批
	const confirm = () => {
		
	}
</script>

<style lang="scss" scoped>
	.approve-container {
		height: 100%;
		background-color: #f0f0f5;
		user-select: none;
		.approve-content {
			height: calc(100% - 60px);
			overflow: scroll;
		}
	}
</style>