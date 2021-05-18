<!--
 * @Date: 2021-05-18 15:29:26
 * @Description: 组织架构组件
-->

<!-- TODO: 暂时没有开发，用于流程创建组织架构创建，可以借鉴 workflow 成员选择弹窗 -->

<template>
	<!-- 选择成员 -->
	<div class=""></div>
</template>

<script setup>
	import { useStore } from 'vuex'
	import { defineEmit, defineProps, watch } from '@vue/runtime-core'

	const store = useStore()
	const props = defineProps({
		modelValue: {
			type: Array,
			default: () => []
		}
	})
	const emits = defineEmit(['update:modelValue'])

	const checkList = reactive(props.modelValue)
  watch(
    props.modelValue,
    newVal => {
      checkList.length = 0;
      checkList.push(...newVal)
    }
  )

	const cleanCheck = () => {
		checkList.length = 0
	}

	const check = item => {
		checkList.push(item)
	}
  
</script>

<style lang="scss" scoped>
</style>