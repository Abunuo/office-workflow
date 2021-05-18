<!--
 * @Date: 2021-04-27 18:58:35
 * @Description: 模板区域内容部分
-->
<template>
	<div class="drag-input-overview drag-overview" :class="{'active' : activeKey == templateItem.key}" @click="emits('check', templateItem)">
		<!-- label -->
		<div v-if="templateItem.requireLabel && templateItem.label" class="label" :class="{'required': templateItem.required}">
			{{templateItem.label}}{{templateItem.label_extend ? `（${templateItem.label_extend}）`:''}}
			<!-- 图片组件右侧提示 -->
			<i v-if="['DragImage'].includes(templateItem.component)" class="drag-image el-icon-picture-outline"></i>
			<!-- 附件组件右侧提示 -->
			<i v-if="['DragAccessory'].includes(templateItem.component)" class="drag-accessory el-icon-plus"></i>
		</div>
		<!-- content -->
		<div v-if="templateItem.requireContent" class="content" :class="{'drag-textarea': templateItem.component == 'DragTextarea'}">
			<template v-if="['DragRadio', 'DragCheckbox'].includes(templateItem.component) && templateItem.flat">
				<!-- 单选框，多选框单独样式 -->
				<p class="option" :class="templateItem.component == 'DragRadio' ? 'radio' : 'checkbox'" v-for="radio in templateItem.options">{{radio.label}}</p>
			</template>
			<template v-else>
				{{templateItem.placeholder || '待填写者输入'}}
				<!-- 时间框右侧箭头 -->
				<i v-if="['DragDate', 'DragDateRange'].includes(templateItem.component)" class="drag-date el-icon-arrow-right"></i>
			</template>
		</div>

		<!-- 日期区间特殊处理 补充部分 -->
		<template v-if="templateItem.component == 'DragDateRange'">
      <div class="label2-line"></div>
			<div v-if="templateItem.label2" class="label" :class="{'required': templateItem.required}">
				{{templateItem.label2}}
			</div>
			<div class="content">
				{{templateItem.placeholder2 || '待填写者输入'}}
				<i class="drag-date el-icon-arrow-right"></i>
			</div>
			<!-- 自动计算时长 -->
			<template v-if="templateItem.autocomputed">
				<div class="label2-line"></div>
				<div class="label" :class="{'required': templateItem.required}">
					{{templateItem.label3}}({{templateItem.date_type == 1 ? '天' : '小时'}})
				</div>
				<div class="content">
					请输入{{templateItem.label3}}
				</div>
			</template>
		</template>

		<!-- 金额补充部分 -->
		<template v-if="templateItem.component == 'DragAmount' && templateItem.upper">
			<div class="amount-upper">大写</div>
		</template>

		<!-- operation -->
		<div class="opt-wrap" :class="activeKey == templateItem.key ? 'active' : ''">
			<i class="el-icon-document-copy" @click.stop="emits('add', templateItem)"></i>
			<i class="el-icon-delete" @click.stop="emits('delComponent', templateItem.key)"></i>
		</div>
	</div>

</template>
 
<script setup>
	import { defineProps, computed, defineEmit } from '@vue/runtime-core'

	const props = defineProps({
		modelValue: Object,
		activeKey: String
	})

  const emits = defineEmit(['check', 'add', 'delComponent'])

	const templateItem = computed(() => props.modelValue)

</script>

<style lang="scss" scoped>
	.drag-textarea {
		height: 100px;
	}
	.drag-image {
		position: absolute;
		top: 4px;
		right: 0;
		font-size: 22px;
		color: #999;
		font-weight: normal;
	}
	.drag-accessory {
		position: absolute;
		top: 4px;
		right: 0;
		font-size: 22px;
		color: #4193f7;
	}
	.drag-date {
		position: absolute;
		top: 0;
		right: 0;
	}
	.amount-upper {
		margin-top: 16px;
  	font-size: 14px;
	}
	.option {
		font-size: 14px;
		line-height: 22px;
		color: #2c3e50;
		padding-left: 34px;
		margin-bottom: 10px;
		position: relative;
		&:last-of-type {
			margin-bottom: 0;
		}
		&:before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 20px;
			height: 20px;
			border: 1px solid #dee0e1;
			box-sizing: border-box;
		}
		&.radio:before {
			border-radius: 50%;
		}
	}
</style>