<template>
	<div class="detail-wrap">
		<template v-for="detailItem in detail" :key="detailItem.name+detailItem.value">
			<div class="item">
				<p class="label">{{detailItem.name}}</p>
				<p>{{detailItem.value}}</p>
			</div>
		</template>
	</div>
</template>

<script setup>
import { defineProps } from "@vue/runtime-core";

const props = defineProps({
  detail: Array
})
</script>

<style lang="scss" scoped>
	.detail-wrap {
		border-radius: 10px;
		background-color: #fff;
		padding: 20px 20px 0;
		overflow: hidden;
		.item {
			margin-bottom: 20px;
			font-size: 14px;
			.label {
				font-size: 12px;
				color: #9d9d9d;
				margin-bottom: 8px;
			}
		}
	}
</style>