<!--
 * @Date: 2021-05-07 21:02:32
 * @Description: 附件
-->
<template>
  <template v-if="type == 1">
		<props-base :input-data="inputData" :placeholder="false"></props-base>
	</template>
	<template v-else>
		<el-form-item :props="inputData.key">
			<template #label>
				{{inputData.label}}
				<span class="upload-file-icon">
					<input class="input-image" type="file" multiple @change="addFiles" />
					添加附件
				</span>
			</template>
			<div class="accessory-wrap">
				<div class="accessory-item" v-for="file in editValue" :key="file.name">
					<i class="el-icon-document"></i>
					<div class="file-info">
						<p class="file-name">{{file.name}}</p>
						<p class="file-size">{{renderSize(file.size)}}</p>
					</div>
					<i class="el-icon-error" @click="delFile(file)"></i>
				</div>
			</div>
		</el-form-item>
	</template>
</template>

<script>
  import { customDefineComponent, setupCommon, renderSize } from '../utils.js'
	import PropsBase from '../common/props-base.vue'

	export const componentData = {
		component: 'DragAccessory',
		name: '附件',
		label: '附件',
		value: [],
    requireContent: false,
		icon: 'el-icon-paperclip' // 左侧组件列表中组件的 icon
	}

	export default customDefineComponent({
		name: 'DragAccessory',
		components: {
			PropsBase
		},
		setup(props, context) {
			const { inputData, editValue } = setupCommon(props, context);
			
			const addFiles = event => {
				editValue.value.push(...event.target.files)
			}

      const delFile = file => {
        const index = editValue.value.findIndex(item => item == file);
        if(-1 == index) return;
        editValue.value.splice(index, 1)
      }

			return {
				inputData,
				editValue,
				addFiles,
        delFile,
				renderSize
			}
		}
	})
</script>

<style lang="scss" scoped>
	.upload-file-icon {
		font-size: 12px;
		color: #4193f7;
		margin-left: 8px;
		position: relative;
		.input-image {
			width: 100%;
			height: 100%;
			opacity: 0;
			position: absolute;
			top: 0;
			left: 0;
			cursor: pointer;
		}
	}
	.accessory-item {
		width: 100%;
		height: 40px;
		margin-bottom: 8px;
		display: flex;
		align-items: center;
		.el-icon-document {
			font-size: 40px;
		}
		.file-info {
			flex: 1;
			margin: 0 6px;
			padding-top: 6px;
			p {
				line-height: 1;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.file-name {
				font-size: 14px;
				margin-bottom: 6px;
			}
			.file-size {
				font-size: 12px;
				color: #a3a5a7;
			}
		}
		.el-icon-error {
			font-size: 16px;
			cursor: pointer;
		}
	}
</style>