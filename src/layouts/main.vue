<template>
	<div class="layout-container">
		<nav-header>
			<slot name="title"></slot>
			<template v-slot:sub-title><slot name="sub-title"></slot></template>
			<template v-slot:extends><slot name="extends"></slot></template>
		</nav-header>
		<div class="layout-content">
			<slot></slot>
		</div>
	</div>
</template>

<script setup>
	import NavHeader from '@/components/nav-header/index.vue'
</script>

<style lang="scss" scoped>
	.layout-container {
		height: 100%;
		background-color: #f0f0f5;
		user-select: none;
		.layout-content {
			width: 100%;
			height: calc(100% - 60px);
			overflow: scroll;
			&::-webkit-scrollbar {
				display: none;
			}
		}
	}
</style>