<!--
 * @Date: 2021-04-19 17:55:21
 * @Description: 后台发起审批流程入口
-->
<template>
	<div class="launch-container">
		<nav-header class="fd-nav">
			<template #back>
				<div class="fd-nav-back"><i class="anticon anticon-left"></i></div>
			</template>
			<template #sub-title>
				<div class="fd-nav-title">{{title}}</div>
			</template>
			<div class="fd-nav-container">
				<div class="ghost-bar" :style="{transform: `translateX(${150*(step-1)}px)`}"></div>
				<template v-for="navItem in navList" :key="navItem.step">
					<div class="fd-nav-item" :class="navItem.step == step ? 'active':''" @click="store.dispatch('asyncStep',navItem.step)">
						<span class="order-num">{{navItem.step}}</span>{{navItem.name}}
					</div>
				</template>
			</div>
			<template #extends>
				<el-button class="ant-btn button-publish" @click="preview"><span>预 览</span></el-button>
				<el-button class="ant-btn button-publish" @click="publish"><span>发 布</span></el-button>
			</template>
		</nav-header>
		<!-- 流程模块 -->
		<template v-for="componentItem in navList" :key="componentItem.step">
			<component :ref="setFlowComponent" :is="stepComponents[componentItem.component]" v-show="step == componentItem.step" :defaultValue="componentItem.data"></component>
		</template>

		<!-- 错误提示信息 -->
		<el-dialog title="提示" v-model="errorVisible">
			<div class="ant-confirm-body">
				<i class="anticon anticon-close-circle" style="color: #f00;"></i>
				<span class="ant-confirm-title">当前无法发布</span>
				<div class="ant-confirm-content">
					<div>
						<p class="error-modal-desc">以下内容不完善，需进行修改</p>
						<div class="error-modal-list">
							<template v-for="(item,index) in errorList" :key="index">
								<div class="error-modal-item" v-for="(errorItem,idx) in item.error" :key="item.step+idx">
									<div class="error-modal-item-label">{{item.step}}</div>
									<div class="error-modal-item-content">{{errorItem.name}} 未选择{{errorItem.type}}</div>
								</div>
							</template>
						</div>
					</div>
				</div>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="errorVisible = false">我知道了</el-button>
				</span>
			</template>
		</el-dialog>

		<!-- 客户端流程预览 -->
		<Preview :preview-data="previewData" v-model:preview-visible="previewVisible"></Preview>
	</div>
</template>

<script setup>
	import { reactive, ref, computed, onBeforeUpdate } from 'vue'
	import { useStore } from 'vuex';
	
	import { ElMessage } from 'element-plus';
	import navHeader from '@/components/nav-header/index.vue'
	// 预览组件
	import Preview from './preview.vue'

	// 步骤组件
	import Main from './launch-process/main/index.vue'
	import Apply from './launch-process/apply/index.vue'
	import Workflow from './launch-process/workflow/index.vue'
	import Advanced from './launch-process/advanced/index.vue'
	const stepComponents = { Main, Apply, Workflow, Advanced }
	
	// 模拟数据
	import { defaultNodeConfig, navListInitData } from './defaultDate.js'
	import { promiseAllStated } from '@/utils/common'
  // 创建 api 接口
	import { postLaunchData } from '@/api/LaunchApi.js'

	const store = useStore()

	// 导航栏数据
	const navList = reactive(navListInitData)
	const step = computed(() => store.getters.step)
	const title = computed(() => store.getters.title)

	// 错误提示列表
	let errorList = reactive([])
	// 错误提示状态
	const errorVisible = ref(false)

	// 预览时表格数据
	let previewData = reactive([])
	const previewVisible = ref(false)

	// 注册四步组件的 refs
	// refs  -->  vue3 bug 暂时不支持 <script setup> 语法糖
	let flowComponent = []
	const setFlowComponent = el => flowComponent.push(el)
	onBeforeUpdate(() => {
		flowComponent = []
	})

	// 默认值 or 编辑流程数据
	const getflowIdData = () => {
		const name = '请假'
		navList[0].data = {
			name,
			description: '',
			group: -1,
		}
		navList[1].data = []
		navList[2].data = defaultNodeConfig
		navList[3].data = {}
		store.dispatch('asyncTitle', name)
		store.dispatch('asyncFlowPermission', [])
	}
	getflowIdData()

	// 预览按钮
	const preview = () => {
		flowComponent[1].exportFnc().then(res => {
			previewData.length = 0;
			previewVisible.value = true;
			previewData.push(...res)
		})
	}

	// 发布按钮
	const publish = () => {
		const promiseArr = flowComponent.map(item => item.exportFnc())
		promiseAllStated(promiseArr)
			.then(res => {
				console.log(res);
			})
			.catch(error => {
				errorList.length = 0;
				errorVisible.value = true
				errorList.push(...error)
			})
	}
</script>

<style lang="scss" scoped>
	.launch-container {
		width: 100%;
		height: 100%;
		min-width: 1000px;
	}
	::v-deep() {
		.el-textarea__inner:hover {
			border-color: #52a2f8;
		}
		.el-input__inner:hover {
			border-color: #52a2f8;
		}
	}
</style>
