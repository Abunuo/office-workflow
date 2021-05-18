<!--
 * @Date: 2021-04-29 20:35:36
 * @Description: 日期区间
-->
<template>
	<template v-if="type == 1">
    <div class="drag-manage">
      <div class="manage-item" :class="inputData.label==''?'error':''">
        <div class="label">标题1 <em>{{inputData.label==''?'标题1不能为空':`最多${inputData.labelLength}字`}}</em></div>
        <el-input v-model="inputData.label"></el-input>
      </div>
      <div class="manage-item">
        <div class="label">提示文字1 <em>最多{{inputData.placeholderLength}}字</em></div>
        <el-input v-model="inputData.placeholder"></el-input>
      </div>
      <div class="manage-item" :class="inputData.label2==''?'error':''">
        <div class="label">标题2 <em>{{inputData.label==''?'标题2不能为空':`最多${inputData.labelLength}字`}}</em></div>
        <el-input v-model="inputData.label2"></el-input>
      </div>
      <div class="manage-item">
        <div class="label">提示文字2 <em>最多{{inputData.placeholderLength}}字</em></div>
        <el-input v-model="inputData.placeholder2"></el-input>
      </div>
      <div class="manage-item">
        <div class="label">日期类型</div>
        <el-select v-model="inputData.date_type" placeholder="请选择">
          <el-option label="年-月-日" :value="1"></el-option>
          <el-option label="年-月-日 时:分" :value="2"></el-option>
        </el-select>
      </div>
      <div class="manage-item">
        <div class="label">必填</div>
        <el-switch v-model="inputData.required"></el-switch>
      </div>
      <div class="manage-item">
        <div class="label">自动计算时长</div>
        <el-switch v-model="inputData.autocomputed"></el-switch>
      </div>
      <div class="manage-item" v-if="inputData.autocomputed">
        <div class="label">标题 <em>最多20字</em></div>
        <el-input v-model="inputData.label3"></el-input>
      </div>
    </div>
	</template>
	<template v-else>
		<el-form-item :label="inputData.label" :required="inputData.required">
      <el-date-picker
        v-model="editValue[0]"
        :clearable="false"
        :type="date_type"
        :format="format"
        :placeholder="inputData.placeholder"
        @change="date => changeDate(date, 0)">
      </el-date-picker>
		</el-form-item>
    <el-form-item :label="inputData.label2" :required="inputData.required">
      <el-date-picker
        v-model="editValue[1]"
        :clearable="false"
        :type="date_type"
        :format="format"
        :placeholder="inputData.placeholder2"
        @change="date => changeDate(date, 1)">
      </el-date-picker>
		</el-form-item>
    <el-form-item v-if="inputData.autocomputed" :label="`${inputData.label3}(${date_interval_zh})`" :required="inputData.required">
      <el-input v-model="date_interval" :placeholder="`请输入${inputData.label3}`" disabled></el-input>
		</el-form-item>
	</template>
</template>

<script>
  import { ref, computed } from 'vue';
	import { customDefineComponent, setupCommon } from '../utils.js'
	import PropsBase from '../common/props-base.vue'
  import { formatDate, dateDifference } from '@/utils/date.js'

	export const componentData = {
		component: 'DragDateRange',
		name: '日期区间',
		label: '开始时间',
    label2: '结束时间',
    label3: '时长',
    placeholder: '请选择',
    placeholder2: '请选择',
		value: ['', ''],
    autocomputed: false,
    date_type: 1,
		icon: 'el-icon-date' // 左侧组件列表中组件的 icon
	}

	export default customDefineComponent({
		name: 'DragDateRange',
		components: {
			PropsBase
		},
		setup(props, context) {
			const { inputData, editValue } = setupCommon(props, context, false);

      const date_interval_zh = computed(() => inputData.date_type == 1 ? '天' : '小时');
      const date_type = computed(() => inputData.date_type == 1 ? 'date' : 'datetime');
      const format = computed(() => inputData.date_type == 1 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm');

      const date_interval = ref('')
      
      const changeDate = (date, index) => {
        editValue.value.splice(index, 1, formatDate(date, format.value))
        // 一定先赋值在同步时差，因为 element 时间控件返回 date 对象的数据
        if(editValue.value[1] && editValue.value[0]) {
          date_interval.value = dateDifference(editValue.value[1], editValue.value[0])
        }
      }

			return {
				inputData,
				editValue,
        date_interval_zh,
        date_interval,
        date_type,
        format,

        changeDate
			}
		}
	})
</script>

<style lang="scss" scoped>
  ::v-deep(.el-select) {
    width: 100%;
  }
</style>