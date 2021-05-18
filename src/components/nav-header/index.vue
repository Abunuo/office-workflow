<!--
 * @Author: Monologue
 * @Date: 2021-04-01 16:19:44
 * @LastEditTime: 2021-04-20 11:57:47
 * @LastEditors: Please set LastEditors
 * @Description: 通用头部导航组件
 * @FilePath: /Vue3.0/Users/monologue/Documents/LCYD/office-automatic/src/components/nav-header/index.vue
 * @props: title: 可以通过 props 传递，也可以通过 provide
 * @emit: back: 只能通过 provide/inject 传递
 * @slot： back: 后退样式、sub-title：返回按钮旁边区域、default：中间区域、extends：右侧拓展区域
-->

<template>
	<div class="nav-header-container">
		<div class="back" @click="back">
			<slot name="back">
				<i class="back-btn el-icon-arrow-left"></i>
			</slot>
		</div>
		<div class="left">
			<slot name="sub-title"></slot>
		</div>
		<div class="center">
			<slot>{{title}}</slot>
		</div>
		<div class="right">
			<slot name="extends"></slot>
		</div>
	</div>
</template>

<script setup>
	import { defineProps, inject } from 'vue'

	const props = defineProps({
		title: {
			type: String,
			default: '',
		},
	})

	const back = inject('back', () => {
		history.go(-1)
	})
	const title = inject('title', props.title)
</script>

<style lang="scss" scoped>
	.nav-header-container {
		width: 100%;
		height: 60px;
		padding: 0 30px 0 0;
		background-color: #fff;
		display: flex;
		align-items: center;
		position: relative;
		box-sizing: border-box;
		.back-btn {
			display: inline-block;
			width: 34px;
			height: 34px;
			line-height: 32px;
			text-align: center;
			border: 1px solid #dee0e1;
			border-radius: 50%;
			cursor: pointer;
			margin-left: 30px;
		}
		.center {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
		}
		.right {
			position: absolute;
			right: 30px;
		}
	}
</style>