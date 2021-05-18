<template>
	<div class="approve-wrap">
		<div class="approve-title">流程</div>
    <template v-for="(approveItem, index) in process" :key="approveItem.type">
      <div class="approve-item">
        <div class="title" v-if="process.length == 2">
          {{approveItem.type_zh}}
          <span class="view" @click="toggleView(index)">{{visibleArr[index] ? '收起' : '展开'}}</span>
        </div>
        <template v-for="step in approveItem.steps" :key="step.id">
          <div v-show="visibleArr[index]" class="approve-step">
            <div class="left">
              <el-image class="avtor" :src="step.avtor" fit="fill"></el-image>
              <i v-if="step.status == 0" class="approve-status el-icon-check"></i>
              <i v-else-if="step.status == 1" class="approve-status el-icon-close"></i>
              <i v-else-if="step.status == 2" class="approve-status el-icon-check"></i>
            </div>
            <div class="right">
              <div class="user-info">
                <div>
                  <p>{{step.type}}</p>
                  <p v-if="step.name" class="user-name">{{step.name}}{{step.status !== 0 ? '（已拒绝）' : '（已同意）'}}</p>
                </div>
                <div class="step-time">{{step.time}}</div>
              </div>
              <div v-if="step.comment" class="comment">{{step.comment}}</div>
            </div>
          </div>
        </template>
      </div>
    </template>
	</div>
</template>

<script setup>
import { defineProps, reactive, watch } from "@vue/runtime-core";

const props = defineProps({
  process: Array
})
let visibleArr = reactive([])
watch(
  () => props.process,
  (newVal) => {
    visibleArr.length = newVal.length;
    visibleArr.fill(false)
    visibleArr[visibleArr.length-1] = true;
  },
  {
    immediate: true
  }
)

const toggleView = (index) => {
  visibleArr[index] = !visibleArr[index]
}
</script>

<style lang="scss" scoped>
	.approve-wrap {
    border-radius: 10px;
		background-color: #fff;
		padding: 20px 20px 0;
		overflow: hidden;
    line-height: 1;
		.approve-title {
			margin-bottom: 30px;
		}
    .approve-item {
      font-size: 14px;
      .title {
        margin-bottom: 20px;
        .view {
          float: right;
          font-size: 12px;
          color: #9d9d9d;
          cursor: pointer;
        }
      }
      .approve-step {
        padding-bottom: 36px;
        position: relative;
        display: flex;
        align-items: flex-start;
        &:not(:last-of-type):after {
          content: '';
          position: absolute;
          left: 20px;
          top: 44px;
          bottom: 4px;
          column-rule-width: 0;
          border-left: 3px solid #dee0e1;
        }
        .left {
          position: relative;
          margin-right: 14px;
          .avtor {
            width: 40px;
            height: 40px;
            border-radius: 6px;
          }
          .approve-status {
            position: absolute;
            bottom: 0;
            right: -8px;
            color: #fff;
            font-size: 12px;
            border-radius: 50%;
            border: 2px solid #fff;
            &.el-icon-check {
              background-color: #00b37a;
            }
            &.el-icon-close {
              background-color: #fb4c40;
            }
          }
        }
        .right {
          flex: 1;
          .user-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .user-name {
              color: #9d9d9d;
              font-size: 12px;
              margin-top: 8px;
            }
            .step-time {
              width: 100px;
              color: #9d9d9d;
              font-size: 12px;
              text-align: right;;
            }
          }
          .comment {
            line-height: 1.5;
            margin-top: 8px;
            padding: 10px;
            background-color: #f0f0f5;
            border-radius: 4px;
          }
        }
      }
    }
	}
</style>