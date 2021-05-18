<!--
 * @Date: 2021-04-25 21:01:02
 * @Description: 拖拽组件模板
 * eg: <form-draggable v-model="state.tableList" @async-conditions="asyncConditions"></form-draggable>
-->
<template>
	<div class="drag-container">
		<!-- 左侧列表区域 -->
		<div class="library-wrap">
			<template v-for="comItem in libraryList" :key="comItem.label">
				<div class="library-group" v-if="comItem.list.length">
					<div class="library-group-title">{{comItem.label}}</div>
					<span v-for="item in comItem.list" :key="item.name" class="drag-input-btn drag-btn" :class="item.icon" @click="add(item)">{{item.name}}</span>
				</div>
			</template>
		</div>
		<!-- 中间模板区域 -->
		<div class="overview-wrap">
			<div class="overview-title area-title"></div>
			<div class="mobile-wrap">
				<div class="mobile-inner">
					<template v-if="templateData.length" v-for="templateItem in templateData" :key="templateItem.key">
						<model-content :model-value="templateItem" :active-key="active_key" @check="check" @add="add" @del-component="delComponent"></model-content>
					</template>
					<template v-else>
						<div class="empty">点击添加控件</div>
					</template>
				</div>
			</div>
		</div>
		<!-- 右侧属性编辑区域 -->
		<div class="manage-wrap">
			<div class="manage-title area-title">
				<span class="title" :class="state.activeComponent.icon">{{state.activeComponent.name}}</span>
			</div>
			<component v-if="state.activeComponent.component" :is="state.activeComponent.component" :key="state.activeComponent.key" :type="1" v-model="state.activeComponent"></component>
		</div>
	</div>
</template>

<script setup>
	import * as lodash from 'lodash'
	import libraryList from './library.js'
	import {
		defineEmit,
		defineProps,
		reactive,
		ref,
		watch
	} from '@vue/runtime-core'
	import ModelContent from './components/common/model-content.vue'

	const props = defineProps({
		modelValue: Array
	})
	const emits = defineEmit(['update:modelValue', 'asyncConditions'])

	// 激活的节点
	const state = reactive({
		activeComponent: {}
	})
	// 模板数据列表
	const templateData = reactive([])
	// 当前激活的 key
	const active_key = ref(null)

	// 选中模板
	const check = component => {
		active_key.value = component.key
		state.activeComponent = component
	}
	// 添加模板
	const add = component => {
		const temCom = lodash.cloneDeep(component)
		temCom.key = `OA_${new Date().getTime()}_${temCom.component}`
		const index = templateData.findIndex(item => item.key == active_key.value)
		templateData.splice(index + 1, 0, temCom)
		check(temCom)
	}
	// 删除模板
	const delComponent = key => {
		const index = templateData.findIndex(item => item.key == key)
		templateData.splice(index, 1)
		if (templateData.length && active_key.value == key) {
			if (index == templateData.length) {
				check(templateData[templateData.length - 1])
			} else {
				check(templateData[index])
			}
		}
	}

	// 默认存在一个基础表单项
	add(libraryList[1].list[0])

	const convertConditions = nodes => {
		const condition = []
		nodes.forEach((node, index) => {
			// 不是添加到条件的组件过滤掉
			if (!node.isCondition) return
			// 没有勾选必填的过滤掉
			if(!node.required) return
			// 枚举类型
			if (['DragRadio', 'DragCheckbox'].includes(node.component)) {
				condition.push({
					columnId: 1000 + index,
					columnType: 'String',
					showType: '3',
					showName: node.label,
					columnName: node.key,
					fixedDownBoxValue: node.options.map(option => {
						return {
							value: option.label,
							key: option.value
						}
					})
				})
			}
			// 数值类型
			if (['DragNumber', 'DragAmount'].includes(node.component)) {
				condition.push({
					columnId: 1000 + index,
					columnType: 'Double',
					showType: '1',
					showName: node.label,
					columnName: node.key
				})
			}
		})
		return condition
	}

	// 监听 templateData， 用变动时同步数据
	watch(
		templateData,
		newVal => {
			emits('update:modelValue', lodash.cloneDeep(newVal))
			emits('asyncConditions', convertConditions(newVal))
		},
		{
			deep: true,
			immediate: true
		}
	)
</script>

<style lang="scss">
	@import './draggable.scss';
</style>