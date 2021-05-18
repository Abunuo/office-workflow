<template>
	<div class="overview">
		<p class="process-id">编号：{{data.id}}</p>
		<p class="process-title">{{data.user.name}}提交的员工请假</p>
		<p class="process-company">北京龙创悦动网络科技有限公司</p>
	</div>
</template>

<script setup>
import { defineProps } from "@vue/runtime-core";

const props = defineProps({
  data: Object
})
</script>

<style lang="scss" scoped>
	.overview {
		padding: 14px 20px;
		width: 100%;
		background-color: #fff;
		color: #9d9d9d;
		box-sizing: border-box;
		.process-id {
			font-size: 12px;
		}
		.process-title {
			color: #30363b;
			margin: 14px 0;
			font-size: 20px;
			font-weight: bold;
		}
		.process-company {
			font-size: 12px;
			padding-left: 20px;
			background: url(@/assets/company-logo.png) no-repeat left center;
			background-size: contain;
		}
	}
</style>