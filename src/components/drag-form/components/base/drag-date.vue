<!--
 * @Date: 2021-04-29 17:07:25
 * @Description: 日期
-->
<template>
	<template v-if="type == 1">
    <props-base :input-data="inputData">
      <template #default="{ slotData }">
        <div class="manage-item">
          <div class="label">日期类型</div>
          <el-select v-model="slotData.date_type" placeholder="请选择">
            <el-option label="年-月-日" :value="1"></el-option>
            <el-option label="年-月-日 时:分" :value="2"></el-option>
          </el-select>
        </div>
      </template>
    </props-base>
	</template>
	<template v-else>
		<el-form-item :label="inputData.label" :props="inputData.key" :required="inputData.required">
      <el-date-picker
        v-model="editValue"
        :clearable="false"
        :type="date_type"
        :format="format"
        :placeholder="inputData.placeholder"
        @change="changeDate">
      </el-date-picker>
		</el-form-item>
	</template>
</template>

<script>
  import { computed } from 'vue';
	import { customDefineComponent, setupCommon } from '../utils.js'
	import PropsBase from '../common/props-base.vue'
  import { formatDate } from '@/utils/date.js'

	export const componentData = {
		component: 'DragDate',
		name: '日期',
		label: '日期',
		value: '',
    date_type: 1,
    placeholder: '请选择',
		icon: 'el-icon-date' // 左侧组件列表中组件的 icon
	}

	export default customDefineComponent({
		name: 'DragDate',
		components: {
			PropsBase
		},
		setup(props, context) {
			const { inputData, editValue } = setupCommon(props, context, false);

      const date_type = computed(() => inputData.date_type == 1 ? 'date' : 'datetime');
      const format = computed(() => inputData.date_type == 1 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm');
      
      const changeDate = date => {
        context.emit('update:editValue', formatDate(date, format.value))
      }

			return {
				inputData,
				editValue,
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