<!--
 * @Date: 2021-04-20 10:43:03
 * @Description: 后台发起审批流程第一步
-->
<template>
	<div class="main-wrap">
		<el-form label-position="top">
			<el-form-item class="form-item-avtor">
				<el-popover placement="right-start" title="标题" :width="200" trigger="click" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
					<template #reference>
						<el-avatar class="avtor" icon="el-icon-user-solid" :src="workFlowDef.avatar"></el-avatar>
					</template>
				</el-popover>
				<i class="avtor-btn el-icon-edit"></i>
			</el-form-item>
			<el-form-item class="form-item-name" required>
				<template #label>
					<span>表单名称 <em class="notice">最多50字</em></span>
				</template>
				<el-input v-model="workFlowDef.name" placeholder="请输入表单名称"></el-input>
			</el-form-item>
			<el-form-item label="所在分组" required>
				<el-select v-model="workFlowDef.group" placeholder="请选择">
					<el-option v-for="item in groupList" :label="item.name" :value="item.key" :key="item.key"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<template #label>
					<span>表单说明 <em class="notice">最多100字</em></span>
				</template>
				<el-input type="textarea" :autosize="{minRows:3}" v-model="workFlowDef.description" placeholder="请输入表单说明"></el-input>
			</el-form-item>
			<el-form-item label="谁可以发起">
				<el-input class="flowPermission el-icon-arrow-down" v-model="flowPermission_zh" disabled></el-input>
			</el-form-item>
		</el-form>

		<el-button type="text" @click="goAdvanced">权限管理&nbsp;&nbsp;&gt;</el-button>
	</div>
</template>

<script>
	import { defineComponent, reactive, computed, watch } from 'vue'
	import { useStore } from 'vuex'

	export default defineComponent({
		name: 'LaunchMain',
		props: {
			defaultValue: Object
		},
		setup(props) {
			const store = useStore()
			const groupList = reactive([
				{
					name: '考勤管理',
					key: 1
				},
				{
					name: '假勤管理',
					key: 2
				},
				{
					name: '财务管理',
					key: 3
				},
				{
					name: '其他',
					key: -1
				}
			])
			// const workFlowDef = computed(() => props.defaultValue)
			const workFlowDef = reactive(props.defaultValue)
			const flowPermission = computed(() => store.getters.flowPermission)
			const flowPermission_zh = computed(() => store.getters.flowPermission.map(item => item.name).toString() || '所有人')
			// 错误列表
			const errorList = []
			// 同步 title
			watch(
				() => workFlowDef.name,
				name => {
					store.dispatch('asyncTitle', name)
				}
			)

			const goAdvanced = () => {
				store.dispatch('asyncStep', 4)
			}

			const reErr = () => {
				if (!workFlowDef.name || workFlowDef.name == '') {
					errorList.push({
						type: '表单名称',
						name: '表单名称'
					})
				}
				if (!workFlowDef.group || workFlowDef.group == '') {
					errorList.push({
						type: '所在分组',
						name: '所在分组'
					})
				}
			}
			// 导出函数
			const exportFnc = () => {
				errorList.length = 0
				reErr()
				if (errorList.length) {
					return Promise.reject({
						step: '基础设置',
						error: errorList
					})
				} else {
					return Promise.resolve(workFlowDef)
				}
			}

			return {
				groupList,
				workFlowDef,
				flowPermission_zh,
				goAdvanced,
				exportFnc
			}
		}
	})
</script>


<style lang="scss" scoped>
	::v-deep(.el-form) {
		position: relative;
		.el-form-item__label {
			color: #222;
			padding: 0;
		}
		.el-textarea__inner {
			resize: none;
		}
		.el-input__inner {
			color: #333;
			text-indent: 0;
		}
		.el-select {
			width: 100%;
		}
		.el-avatar--large {
			width: 50px;
			height: 50px;
			line-height: 50px;
		}
		.flowPermission {
			position: relative;
			.el-input__inner {
				background: #fff;
				cursor: pointer;
			}
			&::before {
				position: absolute;
				right: 10px;
				color: #c0c4cc;
			}
		}
	}
	.main-wrap {
		margin: 16px auto;
		width: 600px;
		background: #fff;
		border-radius: 10px;
		padding: 20px;
		box-sizing: border-box;
		.notice {
			font-size: 12px;
			color: #bcbfc3;
			margin-left: 6px;
		}
		.form-item-avtor {
			position: absolute;
			top: 10px;
			left: 0;
			width: 50px;
			height: 50px;
			.avtor {
				border-radius: 20px;
			}
			.avtor-btn {
				position: absolute;
				right: 0;
				bottom: 10px;
				padding: 3px;
				color: #999;
				background: #fff;
				border: 1px solid #fff;
				border-radius: 50%;
				transform: scale(0.8);
			}
		}
		.form-item-name {
			padding-left: 65px;
		}
	}
</style>