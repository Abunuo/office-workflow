<!--
 * @Date: 2021-04-19 17:28:18
 * @Description: 后台发起审批流程第 3 步
-->
<template>
	<div class="fd-nav-content">
		<section class="dingflow-design">
			<div class="zoom">
				<div :class="'zoom-out'+ (zoomVal==minZoom?' disabled':'')" @click="zoomSize(1)"></div>
				<span>{{zoomVal}}%</span>
				<div :class="'zoom-in'+ (zoomVal==maxZoom?' disabled':'')" @click="zoomSize(2)"></div>
			</div>
			<div class="box-scale" id="box-scale" :style="'transform: scale('+zoomVal/100+'); transform-origin: 50% 0px 0px;'">
				<node-wrap v-model:nodeConfig="nodeConfig" :isTried="isTried" :directorMaxLevel="directorMaxLevel"></node-wrap>
				<div class="end-node">
					<div class="end-node-circle"></div>
					<div class="end-node-text">流程结束</div>
				</div>
			</div>
		</section>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex';
	import nodeWrap from './components/nodeWrap.vue'

	export default {
		name: 'LaunchWorkflow',
		components: {
			nodeWrap
		},
		props: ['defaultValue'],
		data() {
			return {
				// 缩放比例
				zoomVal: 100,
				minZoom: 50,
				maxZoom: 300,
				// 尝试提交数据，即用户意义的完成流程创建
				isTried: false,
				// 流程设计 node 节点列表
				nodeConfig: this.defaultValue,
				// 主管最多有多少级
				directorMaxLevel: 20,
				// 错误信息
				errorList: []
			}
		},
		computed: {
			// 发起人设置，具体什么人可以发起该流程（第一步，第三步均可修改）
			...mapGetters(['flowPermission'])
		},
		watch: {
			defaultValue: {
				handler(newal) {
					this.nodeConfig = newal;
				},
				deep: true
			}
		},
		methods: {
			// 用户缩放
			zoomSize(type) {
				if (this.zoomVal == 50 || this.zoomVal == 300) return
				if (type == 1) {
					this.zoomVal -= 10
				} else {
					this.zoomVal += 10
				}
			},
			// 校验流程是否填写完整
			reErr(data) {
				// 不存在子节点
				if (!data.childNode) return

				// 路由
				if (data.childNode.type == 4) {
					this.reErr(data.childNode)
					for (var i = 0; i < data.childNode.conditionNodes.length; i++) {
						if (data.childNode.conditionNodes[i].error) {
							this.errorList.push({
								name: data.childNode.conditionNodes[i].nodeName,
								type: '条件'
							})
						}
						this.reErr(data.childNode.conditionNodes[i])
					}
					return
				}

				// 其他类型   暂时没有角色这个类型
				const type_zh_list = ['发起人', '审核人', '抄送人', '条件'] // 对应 type = 0、1、2、3
				const type_zh = type_zh_list[data.childNode.type]
				if (data.childNode.error) {
					this.errorList.push({ name: data.childNode.nodeName, type: type_zh })
				}
				this.reErr(data.childNode)
			},
			// 导出数据
			exportFnc() {
				this.isTried = true
				this.errorList = []
				this.reErr(this.nodeConfig)
				if (this.errorList.length != 0) {
					return Promise.reject({
						step: '流程设计',
						error: this.errorList
					})
				}
				return Promise.resolve({
					nodeConfig: this.nodeConfig,
				})
			}
		}
	}
</script>
<style>
	@import './assets/styles/iconfont.scss';
	@import './assets/styles/override-element-ui.scss';
	@import './assets/styles/workflow.scss';
	.error-modal-list {
		width: 455px;
	}
</style>