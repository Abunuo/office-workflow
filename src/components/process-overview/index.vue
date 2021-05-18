<!--
 * @Date: 2021-03-31 10:52:00
 * @Description: 侧边审批流程
-->
<template>
	<teleport to="body">
		<el-drawer :title="title" v-model="drawer" destroy-on-close @closed="emit('update:drawer', false)">
			<div class="detail-container">
				<overview :data="detailData"></overview>
        <div class="process-detail">
          <approve-detail :detail="detailData.detail"></approve-detail>
          <approve-process class="process-inner" :process="detailData.process"></approve-process>
        </div>
			</div>
		</el-drawer>
	</teleport>
</template>

<script setup>
	import { defineProps, defineEmit, reactive } from 'vue'
  import ApproveDetail from './detail.vue'
  import ApproveProcess from './approve.vue'
  import Overview from './overview.vue'

	const props = defineProps({
		drawer: Boolean,
		title: {
			default: '详情',
		},
	})
	const emit = defineEmit(['update:drawer'])

	const detailData = reactive({
    id: 2012112121823419842,
    user: {
      name: '阿卜诺',
      company: '北京龙创悦动网络科技有限公司'
    },
    detail: [{
      name: '所在部门',
      value: '项目运营-BICloud-研发组-前端'
    }, {
      name: '请假类型',
      value: '事假'
    }, {
      name: '开始时间',
      value: '2021-02-01 上午'
    }, {
      name: '结束时间',
      value: '2021-02-01 上午'
    }, {
      name: '所在部门',
      value: '项目运营'
    }, {
      name: '请假事由',
      value: '家里有点事，请一天假'
    }],
    process: [{
      type: 'origin',
      type_zh: '原审批流程',
      steps: [{
        type: '发起申请',
        name: '阿卜诺',
        avtor: 'https://img.yxwoo.com:4433/uploads/images/xiaz/2020/0629/1593419103842.jpg',
        status: 0,
        time: '01-31 15:08',
        comment: '重新提一下'
      }, {
        type: '直接主管',
        name: 'BBBBB',
        avtor: 'https://wimg.ruan8.com/uploadimg/image/20190131/20190131130305_65861.jpg',
        status: 0,
        time: '01-31 19:08'
      }, {
        type: '直接主管',
        name: 'BBBBB',
        avtor: 'https://wimg.ruan8.com/uploadimg/image/20190131/20190131130305_65861.jpg',
        status: 1,
        time: '01-31 19:08'
      }]
    }, {
      type: 'repeal',
      type_zh: '申请撤销(当前)',
      steps: [{
        type: '发起申请',
        name: '阿卜诺',
        avtor: 'https://img.yxwoo.com:4433/uploads/images/xiaz/2020/0629/1593419103842.jpg',
        status: 0,
        time: '01-31 15:08',
        comment: '重新提一下'
      }, {
        type: '直接主管',
        name: 'BBBBB',
        avtor: 'https://wimg.ruan8.com/uploadimg/image/20190131/20190131130305_65861.jpg',
        status: 0,
        time: '01-31 19:08'
      }, {
        type: '直接主管',
        avtor: 'https://wimg.ruan8.com/uploadimg/image/20190131/20190131130305_65861.jpg',
        status: 0,
        time: '01-31 19:08',
        comment: '这个提错了，本意是年假。已经审批通过，无法重新提，在这里说明：改为年假。'
      }]
    }]
  })
</script>

<style lang="scss">
  .el-drawer {
    width: 500px!important;
    padding-top: 70px;
  }
	.el-drawer__header {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    margin: 0;
    padding-bottom: 20px;
    background-color: #fff;
    box-sizing: border-box;
    box-shadow: 0 4px 10px 0 rgba(75, 82, 89, 0.1);
	}
  .el-drawer__body {
    height: 100%;
    overflow: scroll;
  }
</style>
<style lang="scss" scoped>
  p {
    line-height: 1;
  }
	.detail-container {
		background-color: #f0f0f5;
		width: 100%;
		height: 100%;
		overflow: scroll;
		&::-webkit-scrollbar {
			display: none;
		}
    .process-detail {
      padding: 14px 10px 30px;
      width: 100%;
      box-sizing: border-box;
      color: #3c3c3c;
      .process-inner {
        margin-top: 14px;
      }
    }
	}
</style>