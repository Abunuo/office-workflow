<!--
 * @Date: 2021-04-20 10:43:42
 * @Description: 后台发起审批流程第四部
-->
<template>
	<div class="advanced-wrap">
		高级设置
	</div>
</template>

<script>
	import { defineComponent, watch } from 'vue'

	export default defineComponent({
		name: 'LaunchAdvanced',
		props: {
			defaultValue: Object
		},
		setup(props) {

			const exportFnc = () => {
				return Promise.resolve(props.defaultValue)
			}

			return {
				exportFnc
			}
		}
	})
</script>

<style lang="scss" scoped>
	.advanced-wrap {
		margin: 16px auto;
		width: 700px;
		background: #fff;
		border-radius: 10px;
		padding: 20px;
		box-sizing: border-box;
	}
</style>