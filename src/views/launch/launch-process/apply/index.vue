<!--
 * @Date: 2021-04-20 10:43:22
 * @Description: 后台发起审批流程第二步
-->
<template>
	<form-draggable v-model="state.tableList" @async-conditions="asyncConditions"></form-draggable>
</template>

<script>
	import FormDraggable from '@/components/drag-form/index.vue'
	import { defineComponent, reactive } from 'vue'
	import { useStore } from 'vuex'

	export default defineComponent({
		name: 'LaunchApply',
		components: { FormDraggable },
		props: {
			defaultValue: Object
		},
		setup() {
			const store = useStore();
			const state = reactive({
				tableList: [],
				errorList: []
			})

			const asyncConditions = conditions => {
				store.dispatch('asyncConditionList', conditions)
			}

			const reErr = () => {
				state.tableList.forEach(item => {
					if(item.label == '') {
						state.errorList.push({
							type: '标题',
							name: item.name
						})
					}
				})
			}

			const exportFnc = () => {
				state.errorList.length = 0;
				reErr();
				if(state.errorList.length) {
					return Promise.reject({
						step: '表单设计',
						error: state.errorList
					})
				} else {
					return Promise.resolve(state.tableList)
				}
			}

			return {
				state,
				asyncConditions,
				exportFnc
			}
		}
	})
</script>

<style lang="scss" scoped>
</style>