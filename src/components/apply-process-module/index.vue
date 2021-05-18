<!--
 * @Date: 2021-04-02 20:20:29
 * @Description: 前台申请审批流程流程模块
-->
<template>
	<div>
		<div class="process-title">
			流程
			<el-popover v-if="ifShowProcess" placement="bottom-start" :width="520" trigger="click">
				<template #reference>
					<span class="sub-title">已启用自动去重<i class="el-icon-warning-outline"></i></span>
				</template>
				<template #default>
					<p class="sub-title-popover">已启用自动去重</p>
					<p>同一审批人在第一次审批同意后，后续环节将自动同意，此规则将在审批完成时生效</p>
				</template>
			</el-popover>
		</div>
		<div class="process-inner" v-if="ifShowProcess">
			<div class="process-line">
				<span v-for="item in data" :key="item"></span>
			</div>
			<div class="process-wrap">
				<div class="process-item" v-for="processItem in data" :key="processItem.id">
					<div>
						<p class="approve-type">{{processItem.type}}</p>
						<p class="approve-notice">{{processItem.users.length}}个{{processItem.type}}</p>
					</div>
					<div class="approve-user">
						<!-- 此处 key 的 eslint 提示问题忽略，没必要再多加一层 div -->
						<template v-for="(userInfo, index) in processItem.users" :key="userInfo.name">
							<div class="user-item">
								<img class="user-avtor" :src="userInfo.avtor" alt="">
								<span class="user-name">{{userInfo.name}}</span>
							</div>
							<div v-if="processItem.custom || index < processItem.users.length - 1" class="add-icon">+</div>
						</template>
						<div v-if="processItem.custom" class="user-add" @click="addCustomApprove">+</div>
					</div>
				</div>
			</div>
		</div>
		<div class="process-notice" v-else>必填信息填写后，流程将自动显示</div>
		<el-button class="submit-btn" type="primary" size="medium" round @click="emit('submit')">提交</el-button>
	</div>
</template>

<script setup>
	import { defineEmit, defineProps, computed } from '@vue/runtime-core'

	const props = defineProps({
		ifShowProcess: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Array,
			default: () => [
				{
					type: '直接主管',
					custom: false,
					users: [
						{
							avtor:
								'https://wimg.ruan8.com/uploadimg/image/20190131/20190131130305_65861.jpg',
							name: '御风',
						},
					],
				},
				{
					type: '审批者',
					custom: true,
					users: [
						{
							avtor:
								'https://wimg.ruan8.com/uploadimg/image/20190131/20190131130305_65861.jpg',
							name: '御风',
						},
						{
							avtor:
								'https://img.yxwoo.com:4433/uploads/images/xiaz/2020/0629/1593419103842.jpg',
							name: 'lsp',
						}
					],
				},
			],
		},
	})
	const emit = defineEmit(['submit'])
	const addCustomApprove = () => {}
</script>

<style lang="scss" scoped>
	.sub-title-popover {
		margin-bottom: 6px;
	}
	.process-title {
		display: flex;
		align-items: center;
		font-size: 20px;
		.sub-title {
			font-size: 14px;
			color: #587497;
			margin-left: 10px;
			cursor: pointer;
			i {
				margin-left: 4px;
			}
		}
	}
	.process-inner {
		display: flex;
		margin-bottom: 20px;
		.process-line {
			width: 40px;
			position: relative;
			&:after {
				content: '';
				position: absolute;
				top: 40px;
				bottom: 40px;
				left: 4px;
				width: 0;
				border-left: 4px solid #d9e1e8;
			}
			span {
				display: inline-block;
				position: absolute;
				left: 0;
				width: 8px;
				height: 8px;
				background: #41698d;
				border: 2px solid #fff;
				border-radius: 50%;
				z-index: 10;
				// 最大设置 10 个流程步骤，正常应该不会超过这个值
				@for $i from 1 through 10 {
					&:nth-of-type(#{$i}) {
						// (80 - 12) / 2
						top: 34px + 80px * ($i - 1);
					}
				}
			}
		}
		.process-wrap {
			flex: 1;
			overflow-x: scroll;
			.process-item {
				line-height: 1;
				height: 80px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: border-box;
				border-bottom: 1px dashed #ebeef1;
				.approve-type {
					font-size: 16px;
				}
				.approve-notice {
					margin-top: 6px;
					font-size: 12px;
					color: #9d9d9d;
				}
				.approve-user {
					display: flex;
					.user-item {
						display: flex;
						flex-direction: column;
						align-items: center;
						.user-avtor {
							width: 30px;
							height: 30px;
							border-radius: 4px;
						}
						.user-name {
							margin-top: 6px;
							font-size: 12px;
						}
					}
					.add-icon {
						font-size: 12px;
						line-height: 30px;
						margin: 0 10px;
					}
					.user-add {
						width: 30px;
						height: 30px;
						font-size: 30px;
						color: #008cf4;
						text-align: center;
						line-height: 30px;
						border-radius: 4px;
						border: 1px dashed #008cf4;
						cursor: pointer;
					}
				}
			}
		}
	}
	.process-notice {
		margin: 20px 0;
		font-size: smaller;
	}
	.submit-btn {
		width: 140px;
	}
</style>