<!--
 * @Date: 2021-05-07 15:34:23
 * @Description: 图片
-->
<template>
	<template v-if="type == 1">
		<props-base :input-data="inputData" :placeholder="false"></props-base>
	</template>
	<template v-else>
		<el-form-item :props="inputData.key">
			<template #label>
				{{inputData.label}}
				<span class="upload-image-icon">
					<input v-if="editValue.length < 9" class="input-image" type="file" accept="image/*" multiple @change="addImages" />
					添加图片
				</span>
				<em class="upload-notice">（最多选择 9 张）</em>
			</template>
			<div class="images-wrap">
				<div class="image-item" v-for="file in editValue" :key="file.name">
					<el-image :src="convertImg(file)" fit="cover"></el-image>
					<i class="el-icon-error" @click="delImage(file)"></i>
				</div>
			</div>
		</el-form-item>
	</template>
</template>

<script>
	import { reactive, watch } from 'vue'
	import { customDefineComponent, setupCommon } from '../utils.js'
	import PropsBase from '../common/props-base.vue'

	export const componentData = {
		component: 'DragImage',
		name: '图片',
		label: '图片',
		value: [],
		requireContent: false,
		icon: 'el-icon-picture-outline' // 左侧组件列表中组件的 icon
	}

	export default customDefineComponent({
		name: 'DragImage',
		components: {
			PropsBase
		},
		setup(props, context) {
			const { inputData, editValue } = setupCommon(props, context)

			const addImages = event => {
				for (const imgFile of event.target.files) {
					if(editValue.value.length < 9) {
						editValue.value.push(imgFile)
					}
				}
			}

			const convertImg = file => {
				if (typeof file === 'string') return file
				return URL.createObjectURL(file)
			}

      const delImage = file => {
        const index = editValue.value.findIndex(item => item == file);
        if(-1 == index) return;
        editValue.value.splice(index, 1)
      }

			return {
				inputData,
				editValue,
				addImages,
				convertImg,
        delImage
			}
		}
	})
</script>

<style lang="scss" scoped>
	.upload-image-icon {
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
	.upload-notice {
		font-size: 12px;
		color: #a3a5a7;
	}
	.images-wrap {
		width: 100%;
		.image-item {
      float: left;
			width: 40px;
			height: 40px;
			margin-right: 8px;
			margin-top: 4px;
			position: relative;
			.el-icon-error {
				position: absolute;
				top: -8px;
				right: -8px;
				border-radius: 50%;
				background-color: #fff;
				font-size: 16px;
				color: #000;
        cursor: pointer;
				display: none;
			}
			&:hover .el-icon-error{
				display: inline-block;
			}
		}
	}
</style>