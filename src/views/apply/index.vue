<!--
 * @Date: 2021-04-01 16:19:44
 * @LastEditTime: 2021-04-25 16:07:08
 * @Description: 用户申请页面
-->
<template>
	<layout>
		<div class="apply-wrap">
			<div class="apply-inner">
				<div class="apply-title">
					<h1>员工请假</h1>
					<sub class="bg-logo">北京柯基科技有限公司</sub>
				</div>
				<el-form :model="formData" :rules="formRules">
					<el-form-item label="请假类型" prop="leave_type">
						<el-select class="width100" v-model="formData.leave_type" placeholder="请选择">
							<el-option label="年假" value="year"></el-option>
							<el-option label="事假" value="thing"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="开始时间" prop="date_from">
						<el-date-picker type="date" placeholder="请选择" v-model="formData.date_from"></el-date-picker>&nbsp;&nbsp;&nbsp;
						<el-select v-model="formData.date_from_noon" placeholder="请选择">
							<el-option label="上午" value="morning"></el-option>
							<el-option label="下午" value="afternoon"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="结束时间" prop="date_to">
						<el-date-picker type="date" placeholder="请选择" v-model="formData.date_to"></el-date-picker>&nbsp;&nbsp;&nbsp;
						<el-select v-model="formData.date_to_noon" placeholder="请选择">
							<el-option label="上午" value="morning"></el-option>
							<el-option label="下午" value="afternoon"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="时长" prop="date_range">
						<el-input class="width100" v-model="formData.date_range" disabled></el-input>
						<span class="notice">根据排班自动计算时长</span>
					</el-form-item>
					<el-form-item label="所在部门" prop="department">
						<el-select class="width100" v-model="formData.department" placeholder="请选择">
							<el-option label="BI" value="bi"></el-option>
							<el-option label="SB" value="sb"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="请假事由">
						<el-input
							class="width100"
							:rows="4"
							type="textarea"
							v-model="formData.reason"
							placeholder="请输入请假事由"
						></el-input>
					</el-form-item>
					<el-form-item label="发送到群">
						<send-group v-model="formData.send_group"></send-group>
					</el-form-item>
				</el-form>
			</div>
			<apply-process-module class="apply-inner" :if-show-process="true" @submit="submit"></apply-process-module>
		</div>
	</layout>
	<process-detail v-model:drawer="drawer"></process-detail>
</template>

<script setup>
	import { reactive, ref, watch, provide } from 'vue'
	import Layout from '@/layouts/main.vue'
	import ProcessDetail from '@/components/process-overview/index.vue'
	import SendGroup from '@/components/send-group/index.vue'
	import ApplyProcessModule from '@/components/apply-process-module/index.vue'
	import { postApplyData } from '@/api/LaunchApi.js'
	import { formatDate, dateDifference, getDateBySub } from '@/utils/date.js'

	provide('title', '请假')

	// 提交表单数据
	const formData = reactive({
		leave_type: '',
		date_from: null,
		date_from_noon: '',
		date_to: null,
		date_to_noon: '',
		date_range: '',
		department: '',
		reason: '',
		send_group: [],
	})
	// 表单校验规则
	const formRules = {
		leave_type: [
			{ required: true, message: '请选择请假类型', trigger: 'change' },
		],
		date_range: [
			{
				required: true,
				message: '请选择开始时间或者结束时间',
				trigger: 'change',
			},
		],
		department: [
			{ required: true, message: '请选择所在部门', trigger: 'change' },
		],
	}
	// 审批预览
	const drawer = ref(false)
	const showProcess = ref(false);

	watch(
		[
			() => formData.date_from,
			() => formData.date_to,
			() => formData.date_from_noon,
			() => formData.date_to_noon,
		],
		([date_from, date_to, date_from_noon, date_to_noon]) => {
			if (
				date_from == null ||
				date_to == null ||
				date_from_noon == '' ||
				date_to_noon == ''
			) {
				formData.date_range = ''
				return
			}
			date_from =
				formatDate(date_from) +
				(date_from_noon == 'morning' ? ' 00:00' : ' 12:00')
			date_to =
				date_to_noon == 'morning'
					? formatDate(date_to) + ' 12:00'
					: getDateBySub(-1, date_to) + ' 00:00'
			formData.date_range = dateDifference(date_from, date_to, false)
		}
	)
	watch(
		() => formData.leave_type,
		() => {
			formData.date_from = null
			formData.date_from_noon = ''
			formData.date_to = null
			formData.date_to_noon = ''
		}
	)

	const submit = () => {
		console.log(formData);
	}
</script>

<style lang="scss" scoped>
	@media screen and (max-width: 979px) {
		.apply-wrap {
			min-width: 375px;
			width: 100%;
		}
	}
	@media screen and (min-width: 980px) {
		.apply-wrap {
			width: 980px;
		}
	}
	.apply-wrap {
		margin: 0 auto;
		.apply-inner {
			margin: 20px 0;
			background-color: #fff;
			border-radius: 10px;
			padding: 20px 30px;
			box-sizing: border-box;
			text-align: left;
			.apply-title {
				padding-bottom: 20px;
				margin-bottom: 20px;
				border-bottom: 2px dotted #dee0e1;
				h1 {
					font-size: 24px;
				}
				.bg-logo {
					color: #9d9d9d;
					padding-left: 20px;
					background: url(@/assets/company-logo.png) no-repeat left center;
					background-size: contain;
				}
			}
			.notice {
				font-size: 12px;
				color: #9d9d9d;
			}
		}
	}
	::v-deep(.el-form-item) {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		.el-form-item__content,
		.width100 {
			width: 100%;
		}
		.el-textarea__inner {
			resize: none;
		}
	}
</style>