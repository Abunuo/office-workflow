<!--
 * @Date: 2021-04-19 17:00:00
 * @Description: 节点 template
 * 节点数据：type：0：发起人，1：审批人，2：抄送人，3：条件节点，4：路由节点(添加路由节点)
 * 用户数据：type[activename]： 1：成员/组织架构，2：角色，3：组织
-->
<template>
	<!-- 非条件 node -->
	<div class="node-wrap" v-if="nodeConfig.type!=4">
		<div class="node-wrap-box" :class="(nodeConfig.type==0?'start-node ':'')+(isTried&&nodeConfig.error?'active error':'')">
			<div class="title" :style="'background: rgb('+ ['87, 106, 149','255, 148, 62','50, 150, 250'][nodeConfig.type] +');'">
				<span class="iconfont" v-show="nodeConfig.type==1"></span>
				<span class="iconfont" v-show="nodeConfig.type==2"></span>
				<span v-if="nodeConfig.type==0">{{nodeConfig.nodeName}}</span>
				<input v-if="nodeConfig.type!=0&&isInput" class="ant-input editable-title-input" type="text" v-focus v-model="nodeConfig.nodeName" :placeholder="placeholderList[nodeConfig.type]"
					@blur="blurEvent()" @focus="$event.currentTarget.select()">
				<span class="editable-title" @click="clickEvent()" v-if="nodeConfig.type!=0&&!isInput">{{nodeConfig.nodeName}}</span>
				<i class="anticon anticon-close close" v-if="nodeConfig.type!=0" @click="delNode()"></i>
			</div>
			<div class="content" @click="setPerson">
				<!-- 发起人 -->
				<div class="text" v-if="nodeConfig.type==0">{{arrToStr(flowPermission)?arrToStr(flowPermission):'所有人'}}</div>
				<!-- 审批人 -->
				<div class="text" v-if="nodeConfig.type==1">
					<span class="placeholder" v-if="!setApproverStr(nodeConfig)">请选择{{placeholderList[nodeConfig.type]}}</span>
					{{setApproverStr(nodeConfig)}}
				</div>
				<!-- 抄送人 -->
				<div class="text" v-if="nodeConfig.type==2">
					<span class="placeholder" v-if="!copyerStr(nodeConfig)">请选择{{placeholderList[nodeConfig.type]}}</span>
					{{copyerStr(nodeConfig)}}
				</div>
				<i class="anticon anticon-right arrow"></i>
			</div>
			<div class="error_tip" v-if="isTried&&nodeConfig.error">
				<i class="anticon anticon-exclamation-circle" style="color: rgb(242, 86, 67);"></i>
			</div>
		</div>
		<add-node v-model:childNodeP="nodeConfig.childNode"></add-node>
	</div>
	<!-- 添加条件 node -->
	<div class="branch-wrap" v-if="nodeConfig.type==4">
		<div class="branch-box-wrap">
			<div class="branch-box">
				<button class="add-branch" @click="addTerm">添加条件</button>
				<div class="col-box" v-for="(item,index) in nodeConfig.conditionNodes" :key="index">
					<div class="condition-node">
						<div class="condition-node-box">
							<div class="auto-judge" :class="isTried&&item.error?'error active':''">
								<div class="title-wrapper">
									<input type="text" class="ant-input editable-title-input" v-if="isInputList[index]" @blur="blurEvent(index)" @focus="$event.currentTarget.select()" v-focus v-model="item.nodeName">
									<span class="editable-title" @click="clickEvent(index)" v-if="!isInputList[index]">{{item.nodeName}}</span>
									<span class="priority-title" @click="setPerson(item.priorityLevel)">优先级{{item.priorityLevel}}</span>
									<i class="anticon anticon-close close" @click="delTerm(index)"></i>
								</div>
								<div class="content" @click="setPerson(item.priorityLevel)">{{conditionStr(item,index)}}</div>
								<!-- 左右箭头，定位 -->
								<div class="sort-left" v-if="index!=0" @click="arrTransfer(index,-1)">&lt;</div>
								<div class="sort-right" v-if="index!=nodeConfig.conditionNodes.length-1" @click="arrTransfer(index)">&gt;</div>
								<div class="error_tip" v-if="isTried&&item.error">
									<i class="anticon anticon-exclamation-circle" style="color: rgb(242, 86, 67);"></i>
								</div>
							</div>
							<add-node v-model:childNodeP="item.childNode"></add-node>
						</div>
					</div>
					<nodeWrap v-if="item.childNode && item.childNode" v-model:nodeConfig="item.childNode" :isTried="isTried" :directorMaxLevel="directorMaxLevel"></nodeWrap>
					<div class="top-left-cover-line" v-if="index==0"></div>
					<div class="bottom-left-cover-line" v-if="index==0"></div>
					<div class="top-right-cover-line" v-if="index==nodeConfig.conditionNodes.length-1"></div>
					<div class="bottom-right-cover-line" v-if="index==nodeConfig.conditionNodes.length-1"></div>
				</div>
			</div>
			<add-node v-model:childNodeP="nodeConfig.childNode"></add-node>
		</div>
	</div>

	<!-- 发起人设置 -->
	<el-drawer append-to-body title="发起人" v-model="promoterDrawer" direction="rtl" custom-class="set_promoter" size="550px" :before-close="savePromoter">
		<div class="demo-drawer__content">
			<div class="promoter_content drawer_content">
				<p>{{arrToStr(flowPermission1)?arrToStr(flowPermission1):'所有人'}}</p>
				<el-button type="primary" @click="addPromoter">添加/修改发起人</el-button>
			</div>
			<div class="demo-drawer__footer clear">
				<el-button type="primary" @click="savePromoter">确 定</el-button>
				<el-button @click="promoterDrawer = false">取 消</el-button>
			</div>
			<el-dialog title="选择成员" v-model="promoterVisible" width="600px" append-to-body custom-class="promoter_person">
				<div class="person_body clear">
					<div class="person_tree l">
						<input type="text" placeholder="搜索成员" v-model="promoterSearchName" @input="getDebounceData($event)">
						<p class="ellipsis tree_nav" v-if="!promoterSearchName">
							<!-- <span @click="getDepartmentList(0)" class="ellipsis">天下</span> -->
							<span v-for="(item,index) in departments.titleDepartments" class="ellipsis" :key="index+'a'" @click="getDepartmentList(item.id)">{{item.departmentName}}</span>
						</p>
						<ul>
							<li v-for="(item,index) in departments.childDepartments" :key="index+'b'" class="check_box">
								<a :class="toggleClass(checkedDepartmentList,item)&&'active'" @click="toChecked(checkedDepartmentList,item)">
									<img src="../assets/images/icon_file.png">{{item.departmentName}}</a>
								<i @click="getDepartmentList(item.id)">下级</i>
							</li>
							<li v-for="(item,index) in departments.employees" :key="index+'c'" class="check_box">
								<a :class="toggleClass(checkedEmployessList,item)&&'active'" @click="toChecked(checkedEmployessList,item)" :title="item.departmentNames">
									<img src="../assets/images/icon_people.png">{{item.employeeName}}</a>
							</li>
						</ul>
					</div>
					<div class="has_selected l">
						<p class="clear">已选（{{checkedDepartmentList.length+checkedEmployessList.length}}）
							<a @click="checkedDepartmentList=[];checkedEmployessList=[]">清空</a>
						</p>
						<ul>
							<li v-for="(item,index) in checkedDepartmentList" :key="index+'d'">
								<img src="../assets/images/icon_file.png">
								<span>{{item.departmentName}}</span>
								<img src="../assets/images/cancel.png" @click="removeEle(checkedDepartmentList,item)">
							</li>
							<li v-for="(item,index) in checkedEmployessList" :key="index+'e'">
								<img src="../assets/images/icon_people.png">
								<span>{{item.employeeName}}</span>
								<img src="../assets/images/cancel.png" @click="removeEle(checkedEmployessList,item)">
							</li>
						</ul>
					</div>
				</div>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="promoterVisible = false">取 消</el-button>
						<el-button type="primary" @click="surePromoter">确 定</el-button>
					</span>
				</template>
			</el-dialog>
		</div>
	</el-drawer>
	<!-- 审批人设置 -->
	<el-drawer append-to-body title="审批人设置" v-model="approverDrawer" direction="rtl" custom-class="set_promoter" size="550px" :before-close="saveApprover">
		<div class="demo-drawer__content">
			<div class="drawer_content">
				<div class="approver_content">
					<el-radio-group v-model="approverConfig.settype" class="clear" @change="changeType">
						<el-radio :label="1">指定成员</el-radio>
						<el-radio :label="2">主管</el-radio>
						<el-radio :label="4">发起人自选</el-radio>
						<el-radio :label="5">发起人自己</el-radio>
						<el-radio :label="7">连续多级主管</el-radio>
					</el-radio-group>
				</div>
				<!-- 指定成员 -->
				<div class="approver_appoint_member" v-if="approverConfig.settype==1">
					<el-button type="primary" @click="addApprover">添加/修改成员</el-button>
					<p class="selected_list">
						<span v-for="(item,index) in approverConfig.nodeUserList" :key="index">{{item.name}}
							<img src="../assets/images/add-close1.png" @click="removeEle(approverConfig.nodeUserList,item,'targetId')">
						</span>
						<a v-if="approverConfig.nodeUserList.length!=0" @click="approverConfig.nodeUserList=[]">清除</a>
					</p>
				</div>
				<!-- 主管 -->
				<div class="approver_manager" v-if="approverConfig.settype==2">
					<p>
						<span>发起人的：</span>
						<select v-model="approverConfig.directorLevel">
							<option v-for="item in directorMaxLevel" :value="item" :key="item">{{item==1?'直接':'第'+item+'级'}}主管</option>
						</select>
					</p>
					<p class="tip">找不到主管时，由上级主管代审批</p>
				</div>
				<!-- 发起人自选 -->
				<div class="approver_self_select" v-show="approverConfig.settype==4">
					<el-radio-group v-model="approverConfig.selectMode" style="width: 100%;">
						<el-radio :label="1">选一个人</el-radio>
						<el-radio :label="2">选多个人</el-radio>
					</el-radio-group>
					<h3>选择范围</h3>
					<el-radio-group v-model="approverConfig.selectRange" style="width: 100%;" @change="changeRange">
						<el-radio :label="1">全公司</el-radio>
						<el-radio :label="2">指定成员</el-radio>
						<el-radio :label="3">指定角色</el-radio>
					</el-radio-group>
					<el-button type="primary" @click="addApprover" v-if="approverConfig.selectRange==2">添加/修改成员</el-button>
					<el-button type="primary" @click="addRoleApprover" v-if="approverConfig.selectRange==3">添加/修改角色</el-button>
					<p class="selected_list" v-if="approverConfig.selectRange==2||approverConfig.selectRange==3">
						<span v-for="(item,index) in approverConfig.nodeUserList" :key="index">{{item.name}}
							<img src="../assets/images/add-close1.png" @click="removeEle(approverConfig.nodeUserList,item,'targetId')">
						</span>
						<a v-if="approverConfig.nodeUserList.length!=0&&approverConfig.selectRange!=1" @click="approverConfig.nodeUserList=[]">清除</a>
					</p>
				</div>
				<!-- 发起人自己 -->
				<div class="approver_self" v-if="approverConfig.settype==5">
					<p>该审批节点设置“发起人自己”后，审批人默认为发起人</p>
				</div>
				<!-- 连续多级主管 -->
				<div class="approver_manager" v-if="approverConfig.settype==7">
					<p>审批终点</p>
					<p style="padding-bottom:20px">
						<span>发起人的：</span>
						<select v-model="approverConfig.examineEndDirectorLevel">
							<option v-for="item in directorMaxLevel" :value="item" :key="item">{{item==1?'最高':'第'+item}}层级主管</option>
						</select>
					</p>
				</div>

				<!-- 指定成员(人员数大于 1) or 主管 or 发起人自选(多选)-->
				<div class="approver_some" v-if="(approverConfig.settype==1&&approverConfig.nodeUserList.length>1)||approverConfig.settype==2||(approverConfig.settype==4&&approverConfig.selectMode==2)">
					<p>多人审批时采用的审批方式</p>
					<el-radio-group v-model="approverConfig.examineMode" class="clear">
						<el-radio :label="1">依次审批</el-radio>
						<br />
						<el-radio :label="2">会签(须所有审批人同意)</el-radio>
						<br />
						<el-radio :label="3">或签(一名审批人同意或拒绝即可)</el-radio>
					</el-radio-group>
				</div>
				<!-- 主管 or 连续多级主管 -->
				<div class="approver_some" v-if="approverConfig.settype==2||approverConfig.settype==7">
					<p>审批人为空时</p>
					<el-radio-group v-model="approverConfig.noHanderAction" class="clear">
						<el-radio :label="1">自动审批通过</el-radio>
						<br />
						<el-radio :label="2">转交给审核管理员</el-radio>
					</el-radio-group>
				</div>
			</div>
			<div class="demo-drawer__footer clear">
				<el-button type="primary" @click="saveApprover">确 定</el-button>
				<el-button @click="approverDrawer = false">取 消</el-button>
			</div>
			<el-dialog title="选择成员" v-model="approverVisible" width="600px" append-to-body custom-class="promoter_person">
				<div class="person_body clear">
					<div class="person_tree l">
						<input type="text" placeholder="搜索成员" v-model="approverSearchName" @input="getDebounceData($event)">
						<p class="ellipsis tree_nav" v-if="!approverSearchName">
							<!-- <span @click="getDepartmentList(0)" class="ellipsis">天下</span> -->
							<span v-for="(item,index) in departments.titleDepartments" class="ellipsis" :key="index+'a'" @click="getDepartmentList(item.id)">{{item.departmentName}}</span>
						</p>
						<ul>
							<li v-for="(item,index) in departments.childDepartments" :key="index+'b'" class="check_box not">
								<a><img src="../assets/images/icon_file.png">{{item.departmentName}}</a>
								<i @click="getDepartmentList(item.id)">下级</i>
							</li>
							<li v-for="(item,index) in departments.employees" :key="index+'c'" class="check_box">
								<a :class="toggleClass(approverEmplyessList,item)&&'active'" @click="toChecked(approverEmplyessList,item)" :title="item.departmentNames">
									<img src="../assets/images/icon_people.png">{{item.employeeName}}</a>
							</li>
						</ul>
					</div>
					<div class="has_selected l">
						<p class="clear">已选（{{approverEmplyessList.length}}）
							<a @click="approverEmplyessList=[]">清空</a>
						</p>
						<ul>
							<li v-for="(item,index) in approverEmplyessList" :key="index+'e'">
								<img src="../assets/images/icon_people.png">
								<span>{{item.employeeName}}</span>
								<img src="../assets/images/cancel.png" @click="removeEle(approverEmplyessList,item)">
							</li>
						</ul>
					</div>
				</div>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="approverVisible = false">取 消</el-button>
						<el-button type="primary" @click="sureApprover">确 定</el-button>
					</span>
				</template>
			</el-dialog>
			<el-dialog title="选择角色" v-model="approverRoleVisible" width="600px" append-to-body custom-class="promoter_person">
				<div class="person_body clear">
					<div class="person_tree l">
						<input type="text" placeholder="搜索角色" v-model="approverRoleSearchName" @input="getDebounceData($event,2)">
						<ul>
							<li v-for="(item,index) in roles" :key="index+'b'" class="check_box not" :class="toggleClass(approverRoleList,item,'roleId')&&'active'" @click="approverRoleList=[item]">
								<a :title="item.description"><img src="../assets/images/icon_role.png">{{item.roleName}}</a>
							</li>
						</ul>
					</div>
					<div class="has_selected l">
						<p class="clear">已选（{{approverRoleList.length}}）
							<a @click="approverRoleList=[]">清空</a>
						</p>
						<ul>
							<li v-for="(item,index) in approverRoleList" :key="index+'e'">
								<img src="../assets/images/icon_role.png">
								<span>{{item.roleName}}</span>
								<img src="../assets/images/cancel.png" @click="removeEle(approverRoleList,item,'roleId')">
							</li>
						</ul>
					</div>
				</div>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="approverRoleVisible = false">取 消</el-button>
						<el-button type="primary" @click="sureApprover">确 定</el-button>
					</span>
				</template>
			</el-dialog>
		</div>
	</el-drawer>
	<!-- 抄送人设置 -->
	<el-drawer append-to-body title="抄送人设置" v-model="copyerDrawer" direction="rtl" custom-class="set_copyer" size="550px" :before-close="saveCopyer">
		<div class="demo-drawer__content">
			<div class="copyer_content drawer_content">
				<el-button type="primary" @click="addCopyer">添加成员</el-button>
				<p class="selected_list">
					<span v-for="(item,index) in copyerConfig.nodeUserList" :key="index">{{item.name}}
						<img src="../assets/images/add-close1.png" @click="removeEle(copyerConfig.nodeUserList,item,'targetId')">
					</span>
					<a v-if="copyerConfig.nodeUserList&&copyerConfig.nodeUserList.length!=0" @click="copyerConfig.nodeUserList=[]">清除</a>
				</p>
				<el-checkbox-group v-model="ccSelfSelectFlag" class="clear">
					<el-checkbox :label="1">允许发起人自选抄送人</el-checkbox>
				</el-checkbox-group>
			</div>
			<div class="demo-drawer__footer clear">
				<el-button type="primary" @click="saveCopyer">确 定</el-button>
				<el-button @click="copyerDrawer = false">取 消</el-button>
			</div>
			<el-dialog title="选择成员" v-model="copyerVisible" width="600px" append-to-body custom-class="promoter_person">
				<div class="person_body clear">
					<div class="person_tree l">
						<input type="text" placeholder="搜索成员" v-model="copyerSearchName" @input="getDebounceData($event,activeName)">
						<el-tabs v-model="activeName" @tab-click="handleClick">
							<el-tab-pane label="组织架构" name="1"></el-tab-pane>
							<el-tab-pane label="角色列表" name="2"></el-tab-pane>
						</el-tabs>
						<p class="ellipsis tree_nav" v-if="activeName==1&&!copyerSearchName">
							<!-- <span @click="getDepartmentList(0)" class="ellipsis">天下</span> -->
							<span v-for="(item,index) in departments.titleDepartments" class="ellipsis" :key="index+'a'" @click="getDepartmentList(item.id)">{{item.departmentName}}</span>
						</p>
						<ul style="height: 360px;" v-if="activeName==1">
							<li v-for="(item,index) in departments.childDepartments" :key="index+'b'" class="check_box not">
								<a><img src="../assets/images/icon_file.png">{{item.departmentName}}</a>
								<i @click="getDepartmentList(item.id)">下级</i>
							</li>
							<li v-for="(item,index) in departments.employees" :key="index+'c'" class="check_box">
								<a :class="toggleClass(copyerEmployessList,item)&&'active'" @click="toChecked(copyerEmployessList,item)" :title="item.departmentNames">
									<img src="../assets/images/icon_people.png">{{item.employeeName}}</a>
							</li>
						</ul>
						<ul style="height: 360px;" v-if="activeName==2">
							<li v-for="(item,index) in roles" :key="index+'c'" class="check_box">
								<a :class="toggleClass(copyerRoleList,item,'roleId')&&'active'" @click="toChecked(copyerRoleList,item,'roleId')" :title="item.description">
									<img src="../assets/images/icon_role.png">{{item.roleName}}</a>
							</li>
						</ul>
					</div>
					<div class="has_selected l">
						<p class="clear">已选（{{copyerEmployessList.length+copyerRoleList.length}}）
							<a @click="copyerEmployessList=[];copyerRoleList=[]">清空</a>
						</p>
						<ul>
							<li v-for="(item,index) in copyerRoleList" :key="index+'e'">
								<img src="../assets/images/icon_role.png">
								<span>{{item.roleName}}</span>
								<img src="../assets/images/cancel.png" @click="removeEle(copyerRoleList,item,'roleId')">
							</li>
							<li v-for="(item,index) in copyerEmployessList" :key="index+'e1'">
								<img src="../assets/images/icon_people.png">
								<span>{{item.employeeName}}</span>
								<img src="../assets/images/cancel.png" @click="removeEle(copyerEmployessList,item)">
							</li>
						</ul>
					</div>
				</div>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="copyerVisible = false">取 消</el-button>
						<el-button type="primary" @click="sureCopyer">确 定</el-button>
					</span>
				</template>
			</el-dialog>
		</div>
	</el-drawer>
	<!-- 条件设置 -->
	<el-drawer append-to-body title="条件设置" v-model="conditionDrawer" direction="rtl" custom-class="condition_copyer" size="550px" :before-close="saveCondition">
		<select v-model="conditionConfig.priorityLevel" class="priority_level">
			<option v-for="item in conditionRouteConfig.conditionNodes.length" :value="item" :key="item">优先级{{item}}</option>
		</select>
		<div class="demo-drawer__content">
			<div class="condition_content drawer_content">
				<p class="tip">当审批单同时满足以下条件时进入此流程</p>
				<ul v-for="(conditionGroup,conditionGroupIndex) in conditionConfig.conditionList" :key="conditionGroupIndex">
					<li v-for="(item,index) in conditionGroup" :key="index">
						<span class="ellipsis" :title="item.type==1?'发起人':item.showName">{{item.type==1?'发起人':item.showName}}：</span>
						<!-- 条件：发起人 -->
						<div v-if="item.type==1">
							<p :class="item.nodeUserList.length > 0?'selected_list':''" @click.self="addConditionRole(item.nodeUserList, conditionGroupIndex, index)" style="cursor:text">
								<span v-for="(item1,index1) in item.nodeUserList" :key="index1">
									{{item1.name}}<img src="../assets/images/add-close1.png" @click="removeEle(item.nodeUserList,item1,'targetId')">
								</span>
								<input v-if="item.nodeUserList.length == 0" type="text" placeholder="请选择具体人员/角色/部门" @click="addConditionRole(item.nodeUserList, conditionGroupIndex, index)">
							</p>
						</div>
						<!-- 枚举类型 多选框-->
						<div v-else-if="item.columnType == 'String' && item.showType == 3">
							<p class="check_box">
								<a v-for="(item1,index1) in item.fixedDownBoxValue" :class="toggleStrClass(item,item1.key)&&'active'" @click="toStrChecked(item,item1.key)" :key="index1">{{item1.value}}</a>
							</p>
						</div>
						<!-- 数值类型 -->
						<div v-else>
							<p>
								<select v-model="item.optType" :style="'width:'+(item.optType==6?370:100)+'px'" @change="changeOptType(item)">
									<option value="1">小于</option>
									<option value="2">大于</option>
									<option value="3">小于等于</option>
									<option value="4">等于</option>
									<option value="5">大于等于</option>
									<option value="6">介于两个数之间</option>
								</select>
								<!-- 除去区间的输入框 -->
								<input v-if="item.optType!=6" type="text" :placeholder="'请输入'+item.showName" v-enter-number="2" v-model="item.zdy1">
							</p>
							<p v-if="item.optType==6">
								<input type="text" style="width:75px;" class="mr_10" v-enter-number="2" v-model="item.zdy1" placeholder="请输入">
								<select style="width:60px;" v-model="item.opt1">
									<option value="<">&lt;</option>
									<option value="≤">≤</option>
								</select>
								<span class="ellipsis" style="display:inline-block;width:60px;vertical-align: text-bottom;">{{item.showName}}</span>
								<select style="width:60px;" class="ml_10" v-model="item.opt2">
									<option value="<">&lt;</option>
									<option value="≤">≤</option>
								</select>
								<input type="text" style="width:75px;" v-enter-number="2" v-model="item.zdy2" placeholder="请输入">
							</p>
						</div>
						<a v-if="item.type==1" @click="item.nodeUserList=[];removeEle(conditionGroup,item,'columnId')">删除</a>
						<a v-if="item.type==2" @click="removeEle(conditionGroup,item,'columnId')">删除</a>
					</li>
					<el-button type="text" @click="addCondition(conditionGroupIndex)">添加条件</el-button>
				</ul>
				<el-button type="primary" @click="addConditionGroup">添加条件组</el-button>
			</div>
			<div class="demo-drawer__footer clear">
				<el-button type="primary" @click="saveCondition">确 定</el-button>
				<el-button @click="conditionDrawer = false">取 消</el-button>
			</div>
			<!-- 选择条件 -->
			<el-dialog title="选择条件" v-model="conditionSelectVisible" width="480px" append-to-body custom-class="condition_list">
				<p>请选择用来区分审批流程的条件字段</p>
				<p class="check_box">
					<a :class="toggleClass(conditionList,{columnId:0},'columnId')&&'active'" @click="toChecked(conditionList,{columnId:0},'columnId')">发起人</a>
					<a v-for="(item,index) in conditions" :key="index" :class="toggleClass(conditionList,item,'columnId')&&'active'" @click="toChecked(conditionList,item,'columnId')">{{item.showName}}</a>
				</p>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="conditionSelectVisible = false">取 消</el-button>
						<el-button type="primary" @click="sureCondition">确 定</el-button>
					</span>
				</template>
			</el-dialog>
			<!-- 选择成员 -->
			<el-dialog title="选择成员" v-model="conditionVisible" width="600px" append-to-body custom-class="promoter_person">
				<div class="person_body clear">
					<div class="person_tree l">
						<input type="text" placeholder="搜索成员" v-model="conditionRoleSearchName" @input="getDebounceData($event,activeName)">
						<el-tabs v-model="activeName" @tab-click="handleClick">
							<el-tab-pane label="组织架构" name="1"></el-tab-pane>
							<el-tab-pane label="角色列表" name="2"></el-tab-pane>
						</el-tabs>
						<p class="ellipsis tree_nav" v-if="activeName==1&&!conditionRoleSearchName">
							<span @click="getDepartmentList(0)" class="ellipsis">天下</span>
							<span v-for="(item,index) in departments.titleDepartments" class="ellipsis" :key="index+'a'" @click="getDepartmentList(item.id)">{{item.departmentName}}</span>
						</p>
						<ul style="height: 360px;" v-if="activeName==1">
							<li v-for="(item,index) in departments.childDepartments" :key="index+'b'" class="check_box">
								<a :class="toggleClass(conditionDepartmentList,item)&&'active'" @click="toChecked(conditionDepartmentList,item)">
									<img src="../assets/images/icon_file.png">{{item.departmentName}}</a>
								<i @click="getDepartmentList(item.id)">下级</i>
							</li>
							<li v-for="(item,index) in departments.employees" :key="index+'c'" class="check_box">
								<a :class="toggleClass(conditionEmployessList,item)&&'active'" @click="toChecked(conditionEmployessList,item)" :title="item.departmentNames">
									<img src="../assets/images/icon_people.png">{{item.employeeName}}</a>
							</li>
						</ul>
						<ul style="height: 360px;" v-if="activeName==2">
							<li v-for="(item,index) in roles" :key="index+'c'" class="check_box">
								<a :class="toggleClass(conditionRoleList,item,'roleId')&&'active'" @click="toChecked(conditionRoleList,item,'roleId')" :title="item.description">
									<img src="../assets/images/icon_role.png">{{item.roleName}}</a>
							</li>
						</ul>
					</div>
					<div class="has_selected l">
						<p class="clear">已选（{{conditionDepartmentList.length+conditionEmployessList.length+conditionRoleList.length}}）
							<a @click="conditionDepartmentList=[];conditionEmployessList=[];conditionRoleList=[]">清空</a>
						</p>
						<ul>
							<li v-for="(item,index) in conditionRoleList" :key="index+'e'">
								<img src="../assets/images/icon_role.png">
								<span>{{item.roleName}}</span>
								<img src="../assets/images/cancel.png" @click="removeEle(conditionRoleList,item,'roleId')">
							</li>
							<li v-for="(item,index) in conditionDepartmentList" :key="index+'e1'">
								<img src="../assets/images/icon_file.png">
								<span>{{item.departmentName}}</span>
								<img src="../assets/images/cancel.png" @click="removeEle(conditionDepartmentList,item)">
							</li>
							<li v-for="(item,index) in conditionEmployessList" :key="index+'e2'">
								<img src="../assets/images/icon_people.png">
								<span>{{item.employeeName}}</span>
								<img src="../assets/images/cancel.png" @click="removeEle(conditionEmployessList,item)">
							</li>
						</ul>
					</div>
				</div>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="conditionVisible = false">取 消</el-button>
						<el-button type="primary" @click="sureConditionRole">确 定</el-button>
					</span>
				</template>
			</el-dialog>
		</div>
	</el-drawer>

	<!-- 嵌套子节点 -->
	<nodeWrap v-if="nodeConfig.childNode" v-model:nodeConfig="nodeConfig.childNode" :isTried="isTried" :directorMaxLevel="directorMaxLevel"></nodeWrap>
</template>
<script>
	import { mapActions, mapGetters } from 'vuex';
	
	import DepartmentsData from '../data/departments.js'
	import Employees from '../data/employees.js'
	import Roles from '../data/roles.js'

	import addNode from './addNode.vue'
	export default {
		name: 'nodeWrap',
		components: {
			addNode
		},
		props: [
			'nodeConfig',
			'directorMaxLevel',
			'isTried',
		],
		data() {
			return {
				placeholderList: ['发起人', '审核人', '抄送人'],
				// input 输入框列表 eg: [true, true, false, true]
				isInputList: [],
				// node 节点输入框状态
				isInput: false,

				/**
				 * @Description: 组织架构数据
				 * eg: {
				 * 		childDepartments: 组织架构
				 * 		employees: 成员
				 * 		titleDepartments: 组织架构导航烂
				 * }
				 */
				departments: {},
				// 1：组织架构，2：角色列表
				activeName: '1',
				// 角色列表
				roles: [],

				// 发起人列表
				flowPermission1: this.flowPermission,
				// 发起人设置
				promoterDrawer: false,
				// 发起人组织架构
				promoterVisible: false,
				// 发起人组织架构搜索名字
				promoterSearchName: '',
				// 发起人组织架构勾选组织列表
				checkedDepartmentList: [],
				// 发起人组织架构勾选人员列表
				checkedEmployessList: [],

				// 抄送人节点数据
				copyerConfig: {},
				// 抄送人设置
				copyerDrawer: false,
				// 抄送人自选状态
				ccSelfSelectFlag: [],
				// 抄送人组织架构
				copyerVisible: false,
				// 抄送人组织架构搜索名字
				copyerSearchName: '',
				// 抄送人组织架构勾选人员列表
				copyerEmployessList: [],
				// 抄送人组织架构勾选角色列表
				copyerRoleList: [],

				// 审批人节点数据
				approverConfig: {},
				// 审批人设置
				approverDrawer: false,
				// 审批人组织架构
				approverVisible: false,
				// 审批人组织架构搜索名字
				approverSearchName: '',
				// 审批人组织架构勾选人员列表
				approverEmplyessList: [],
				// 审批人组织架构 -> 角色
				approverRoleVisible: false,
				// 审批人组织架构 -> 角色搜索名字
				approverRoleSearchName: '',
				// 审批人组织架构勾选角色列表
				approverRoleList: [],
				
				// 条件路由节点，由多个条件节点组成
				conditionRouterConfig: {
					conditionNodes: []
				},
				// 条件节点
				conditionConfig: {},
				// 条件设置
				conditionDrawer: false,
				// 条件选择设置 -> 基于第二步流程特殊控件 且 必填
				conditionSelectVisible: false,
				// 条件组列表
				conditionList: [],
				// 用来记录当前是添加的第几个条件组
				conditionGroupIndex: 0,
				// 用来记录当前是添加的第几个条件组的第几个条件（修改发起人使用）
				conditionIndex: 0,
				// 条件优先级  ->  条件列表中顺序
				bPriorityLevel: '',
				// 条件组织架构 -> 角色
				conditionVisible: false,
				// 条件组织架构 -> 角色搜索名字
				conditionRoleSearchName: '',
				// 条件组织架构勾选组织列表
				conditionDepartmentList: [],
				// 条件组织架构勾选成员列表
				conditionEmployessList: [],
				// 条件组织架构勾选角色列表
				conditionRoleList: []
			}
		},
		computed: {
			// 发起人设置，具体什么人可以发起该流程（第一步，第三步均可修改）
			// 条件选择项 -> 基于第二步流程特殊控件 且 必填
			...mapGetters({
				flowPermission: 'flowPermission',
				conditions: 'conditionList'
			})
		},
		watch: {
			// 同步更新第二部表格数据变化后的值
			conditions(conditions) {
				if(this.nodeConfig.type!=4) return;
				// 路由节点
				this.nodeConfig.conditionNodes.forEach(conditionNode => {
					// 条件组
					conditionNode.conditionList.forEach(conditionGroup => {
						// 条件节点
						conditionGroup.forEach(condition => {
							if(condition.columnId == 0)return;
							const {
								columnId,
								showName,
								columnName,
								showType,
								columnType,
								fixedDownBoxValue
							} = conditions.find(item => item.columnId == condition.columnId)
							Object.assign(condition, {
								columnDbname: columnName,
								showName: showName,
								showType: showType,
								columnId: columnId,
								columnType: columnType,
								fixedDownBoxValue: fixedDownBoxValue
							})
							if(condition.columnType == 'String' && condition.showType == 3) {
								// 同步剔除已选中，但是新更新的条件中不存在的值
								const updateValue = [];
								const oriValues = fixedDownBoxValue.map(item => ''+item.key);
								condition.zdy1.split(',').forEach(value => {
									oriValues.includes(value) && updateValue.push(value)
								})
								condition.zdy1 = updateValue.join(',')
							}
						})
					})
				})
			}
		},
		mounted() {
			if (this.nodeConfig.type == 1) {
				this.nodeConfig.error = !this.setApproverStr(this.nodeConfig)
			} else if (this.nodeConfig.type == 2) {
				this.nodeConfig.error = !this.copyerStr(this.nodeConfig)
			} else if (this.nodeConfig.type == 4) {
				for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
					this.nodeConfig.conditionNodes[i].error =
						this.conditionStr(this.nodeConfig.conditionNodes[i], i) ==
							'请设置条件' && i != this.nodeConfig.conditionNodes.length - 1
				}
			}
		},
		methods: {
			...mapActions(['asyncFlowPermission']),
			/**
			 * part：功能方法区域
			 */
			// 数组转字符串
			arrToStr(arr) {
				if (arr) {
					return arr
						.map(item => {
							return item.name
						})
						.toString()
				}
			},
			//  class 处理
			toggleClass(arr, elem, key = 'id') {
				return arr.some(item => {
					return item[key] == elem[key]
				})
			},
			// 勾选操作 callBack
			toChecked(arr, elem, key = 'id') {
				var isIncludes = this.toggleClass(arr, elem, key)
				!isIncludes ? arr.push(elem) : this.removeEle(arr, elem, key)
			},
			// 删除数组某一项
			removeEle(arr, elem, key = 'id') {
				var includesIndex
				arr.map((item, index) => {
					if (item[key] == elem[key]) {
						includesIndex = index
					}
				})
				arr.splice(includesIndex, 1)
			},

			/**
			 * part：api 接口
			 */
			// 获取组织架构列表
			getDepartmentList(parentId = 0) {
				this.departments = DepartmentsData
			},
			// 获取角色列表
			getRoleList() {
				this.roles = Roles.list;
			},
			// 获取组织架构不同类型的数据，根据 activeName确定，1：成员，2：角色
			getDebounceData(event, type = 1) {
				if (event.target.value) {
					if(type == 1) {
						this.departments.childDepartments = [];
						this.departments.employees = Employees;
					} else {
						this.roles = Roles;
					}
				} else {
					type == 1 ? this.getDepartmentList() : this.getRoleList()
				}
			},


			/**
			 * part：节点区域
			 * 只有条件节点才会传入 index
			 */
			// 点击节点名称，输入框获取焦点
			clickEvent(index) {
				if (index || index === 0) {
					this.isInputList[index] = true
				} else {
					this.isInput = true
				}
			},
			// 节点名称输入框失去焦点
			blurEvent(index) {
				if (index || index === 0) {
					this.isInputList[index] = false
					this.nodeConfig.conditionNodes[index].nodeName = this.nodeConfig
						.conditionNodes[index].nodeName
						? this.nodeConfig.conditionNodes[index].nodeName
						: '条件'
				} else {
					this.isInput = false
					this.nodeConfig.nodeName = this.nodeConfig.nodeName
						? this.nodeConfig.nodeName
						: this.placeholderList[this.nodeConfig.type]
				}
			},
			// 	删除当前节点
			delNode() {
				this.$emit('update:nodeConfig', this.nodeConfig.childNode)
			},

			/**
			 * part：节点编辑区
			 * type: 0：发起人，1：审批人，2：抄送人，3：条件(在路由下，不会单独出现)，4：路由
			 */
			// 设置当期那 node 属性，即设置当前流程的人员
			setPerson(priorityLevel) {
				var { type } = this.nodeConfig
				if (type == 0) {
					this.promoterDrawer = true
					this.flowPermission1 = this.flowPermission
				} else if (type == 1) {
					this.approverDrawer = true
					this.approverConfig = JSON.parse(JSON.stringify(this.nodeConfig))
					this.approverConfig.settype = this.approverConfig.settype
						? this.approverConfig.settype
						: 1
				} else if (type == 2) {
					this.copyerDrawer = true
					this.copyerConfig = JSON.parse(JSON.stringify(this.nodeConfig))
					this.ccSelfSelectFlag =
						this.copyerConfig.ccSelfSelectFlag == 0
							? []
							: [this.copyerConfig.ccSelfSelectFlag]
				} else {
					this.conditionDrawer = true
					this.bPriorityLevel = priorityLevel
					this.conditionRouteConfig = JSON.parse(JSON.stringify(this.nodeConfig))
					this.conditionConfig = this.conditionRouteConfig.conditionNodes[
						priorityLevel - 1
					]
				}
			},

			/**
			 * 发起人
			 */
			// 添加发起人
			addPromoter() {
				this.promoterVisible = true
				this.getDepartmentList()
				this.promoterSearchName = ''
				this.checkedEmployessList = []
				this.checkedDepartmentList = []
				for (var i = 0; i < this.flowPermission1.length; i++) {
					var { type, name, targetId } = this.flowPermission1[i]
					if (type == 1) {
						this.checkedEmployessList.push({
							employeeName: name,
							id: targetId
						})
					} else if (type == 3) {
						this.checkedDepartmentList.push({
							departmentName: name,
							id: targetId
						})
					}
				}
			},
			// 发起人组织架构弹框确认按钮
			surePromoter() {
				this.flowPermission1 = []
				this.checkedDepartmentList.map(item => {
					this.flowPermission1.push({
						type: 3,
						targetId: item.id,
						name: item.departmentName
					})
				})
				this.checkedEmployessList.map(item => {
					this.flowPermission1.push({
						type: 1,
						targetId: item.id,
						name: item.employeeName
					})
				})
				this.promoterVisible = false
			},
			// 发起人 drawer 关闭，保存发起人
			savePromoter() {
				this.asyncFlowPermission(this.flowPermission1);
				this.promoterDrawer = false
			},

			/**
			 * 审批人
			 */
			// 审批人设置：切换审批人类型
			changeType(val) {
				this.approverConfig.nodeUserList = []
				this.approverConfig.examineMode = 1
				this.approverConfig.noHanderAction = 2
				if (val == 2) {
					this.approverConfig.directorLevel = 1
				} else if (val == 4) {
					this.approverConfig.selectMode = 1
					this.approverConfig.selectRange = 1
				} else if (val == 7) {
					this.approverConfig.examineEndDirectorLevel = 1
				}
			},
			// 审批人设置>发起人自选：切换自选范围
			changeRange() {
				this.approverConfig.nodeUserList = []
			},
			// 添加审批人 -> 成员级别
			addApprover() {
				this.approverVisible = true
				this.approverSearchName = ''
				this.getDepartmentList()
				this.approverEmplyessList = []
				for (var i = 0; i < this.approverConfig.nodeUserList.length; i++) {
					var { name, targetId } = this.approverConfig.nodeUserList[i]
					this.approverEmplyessList.push({
						employeeName: name,
						id: targetId
					})
				}
			},
			// 添加审批人 -> 角色级别
			addRoleApprover() {
				this.approverRoleVisible = true
				this.approverRoleSearchName = ''
				this.getRoleList()
				this.approverRoleList = []
				for (var i = 0; i < this.approverConfig.nodeUserList.length; i++) {
					var { name, targetId } = this.approverConfig.nodeUserList[i]
					this.approverRoleList.push({
						roleName: name,
						roleId: targetId
					})
				}
			},
			// 批人组织架构弹框确认按钮
			sureApprover() {
				this.approverConfig.nodeUserList = []
				if (
					this.approverConfig.settype == 1 ||
					(this.approverConfig.settype == 4 &&
						this.approverConfig.selectRange == 2)
				) {
					// 成员组织架构
					this.approverEmplyessList.map(item => {
						this.approverConfig.nodeUserList.push({
							type: 1,
							targetId: item.id,
							name: item.employeeName
						})
					})
					this.approverVisible = false
				} else if (
					this.approverConfig.settype == 4 &&
					this.approverConfig.selectRange == 3
				) {
					// 角色
					this.approverRoleList.map(item => {
						this.approverConfig.nodeUserList.push({
							type: 2,
							targetId: item.roleId,
							name: item.roleName
						})
					})
					this.approverRoleVisible = false
				}
			},
			// 审批人 drawer 关闭，保存审批人
			saveApprover() {
				this.approverConfig.error = !this.setApproverStr(this.approverConfig)
				this.$emit('update:nodeConfig', this.approverConfig)
				this.approverDrawer = false
			},
			// 审批人列表转换成字符串
			setApproverStr(nodeConfig) {
				if (nodeConfig.settype == 1) {
					if (nodeConfig.nodeUserList.length == 1) {
						return nodeConfig.nodeUserList[0].name
					} else if (nodeConfig.nodeUserList.length > 1) {
						if (nodeConfig.examineMode == 1) {
							return this.arrToStr(nodeConfig.nodeUserList)
						} else if (nodeConfig.examineMode == 2) {
							return nodeConfig.nodeUserList.length + '人会签'
						} else if (nodeConfig.examineMode == 3) {
							return nodeConfig.nodeUserList.length + '人或签'
						}
					}
				} else if (nodeConfig.settype == 2) {
					let level =
						nodeConfig.directorLevel == 1
							? '直接主管'
							: '第' + nodeConfig.directorLevel + '级主管'
					if (nodeConfig.examineMode == 1) {
						return level
					} else if (nodeConfig.examineMode == 2) {
						return level + '会签'
					} else if (nodeConfig.examineMode == 3) {
						return level + '或签'
					}
				} else if (nodeConfig.settype == 4) {
					if (nodeConfig.selectRange == 1) {
						return '发起人自选'
					} else {
						if (nodeConfig.nodeUserList.length > 0) {
							if (nodeConfig.selectRange == 2) {
								return '发起人自选'
							} else {
								return '发起人从' + nodeConfig.nodeUserList[0].name + '中自选'
							}
						} else {
							return ''
						}
					}
				} else if (nodeConfig.settype == 5) {
					return '发起人自己'
				} else if (nodeConfig.settype == 7) {
					return (
						'从直接主管到通讯录中级别最高的第' +
						nodeConfig.examineEndDirectorLevel +
						'个层级主管'
					)
				}
			},
			
			/**
			 * 抄送人
			 */
			// 添加抄送人
			addCopyer() {
				this.copyerSearchName = ''
				this.copyerVisible = true
				this.activeName = '1'
				this.getDepartmentList()
				this.copyerEmployessList = []
				this.copyerRoleList = []
				for (var i = 0; i < this.copyerConfig.nodeUserList.length; i++) {
					var { type, name, targetId } = this.copyerConfig.nodeUserList[i]
					if (type == 1) {
						this.copyerEmployessList.push({
							employeeName: name,
							id: targetId
						})
					} else if (type == 2) {
						this.copyerRoleList.push({
							roleName: name,
							roleId: targetId
						})
					}
				}
			},
			// 抄送人切换组织架构，角色/组织架构
			handleClick() {
				this.copyerSearchName = ''
				this.conditionRoleSearchName = ''
				if (this.activeName == 1) {
					this.getDepartmentList()
				} else {
					this.getRoleList()
				}
			},
			// 抄送人组织架构弹框确认按钮
			sureCopyer() {
				this.copyerConfig.nodeUserList = []
				this.copyerEmployessList.map(item => {
					this.copyerConfig.nodeUserList.push({
						type: 1,
						targetId: item.id,
						name: item.employeeName
					})
				})
				this.copyerRoleList.map(item => {
					this.copyerConfig.nodeUserList.push({
						type: 2,
						targetId: item.roleId,
						name: item.roleName
					})
				})
				this.copyerVisible = false
			},
			// 抄送人 drawer 关闭，保存抄送人
			saveCopyer() {
				this.copyerConfig.ccSelfSelectFlag = this.ccSelfSelectFlag.length == 0 ? 0 : 1
				this.copyerConfig.error = !this.copyerStr(this.copyerConfig)
				this.$emit('update:nodeConfig', this.copyerConfig)
				this.copyerDrawer = false
			},
			// 抄送人列表转换成字符串
			copyerStr(nodeConfig) {
				if (nodeConfig.nodeUserList.length != 0) {
					return this.arrToStr(nodeConfig.nodeUserList)
				} else {
					if (nodeConfig.ccSelfSelectFlag == 1) {
						return '发起人自选'
					}
				}
			},

			/**
			 * 路由操作
			 */
			// 添加条件分支
			addTerm() {
				let len = this.nodeConfig.conditionNodes.length + 1
				this.nodeConfig.conditionNodes.push({
					nodeName: '条件' + len,
					type: 3,
					priorityLevel: len,
					conditionList: [],
					nodeUserList: [],
					childNode: null
				})
				for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
					this.nodeConfig.conditionNodes[i].error =
						this.conditionStr(this.nodeConfig.conditionNodes[i], i) ==
							'请设置条件' && i != this.nodeConfig.conditionNodes.length - 1
				}
				this.$emit('update:nodeConfig', this.nodeConfig)
			},
			// 移除条件分支
			delTerm(index) {
				this.nodeConfig.conditionNodes.splice(index, 1)
				for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
					this.nodeConfig.conditionNodes[i].error =
						this.conditionStr(this.nodeConfig.conditionNodes[i], i) ==
							'请设置条件' && i != this.nodeConfig.conditionNodes.length - 1
				}
				this.$emit('update:nodeConfig', this.nodeConfig)
				if (this.nodeConfig.conditionNodes.length == 1) {
					if (this.nodeConfig.childNode) {
						if (this.nodeConfig.conditionNodes[0].childNode) {
							this.reData(
								this.nodeConfig.conditionNodes[0].childNode,
								this.nodeConfig.childNode
							)
						} else {
							this.nodeConfig.conditionNodes[0].childNode = this.nodeConfig.childNode
						}
					}
					this.$emit(
						'update:nodeConfig',
						this.nodeConfig.conditionNodes[0].childNode
					)
				}
			},
			reData(data, addData) {
				if (!data.childNode) {
					data.childNode = addData
				} else {
					this.reData(data.childNode, addData)
				}
			},
			// 条件分支箭头切换优先级（顺序）
			arrTransfer(index, type = 1) {
				//向左-1,向右1
				this.nodeConfig.conditionNodes[
					index
				] = this.nodeConfig.conditionNodes.splice(
					index + type,
					1,
					this.nodeConfig.conditionNodes[index]
				)[0]
				this.nodeConfig.conditionNodes.map((item, index) => {
					item.priorityLevel = index + 1
				})
				for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
					this.nodeConfig.conditionNodes[i].error =
						this.conditionStr(this.nodeConfig.conditionNodes[i], i) ==
							'请设置条件' && i != this.nodeConfig.conditionNodes.length - 1
				}
				this.$emit('update:nodeConfig', this.nodeConfig)
			},

			/**
			 * 条件操作
			 * eg: {
			 * 	nodeName: '路由节点'，
			 * 	type: 4,
			 * 	childNode: {},
			 * 	consditionNodes: [{
			 * 		nodeName: "条件1",
			 * 		type: 3,
			 * 		childNode: {},
			 * 		conditionList: [
			 * 			[{
			 * 			  columnType: Double: 数值类型，String：多选类型,
			 * 			  showType: 1,3（不知道什么玩意，3: 选择框，1，数值）
			 * 			  type: 1: 发起人，2：other
			 * 		  }]
			 *     ]
			 *   }]
			 * }
			 * 路由节点不存在 conditionList，只有 consditionNodes
			 * 条件节点不存在 consditionNodes
			 */
			// 添加条件组
			addConditionGroup() {
				this.conditionConfig.conditionList.push([{
					columnId: 0,
					showName: "发起人",
					type: 1,
					nodeUserList: [],
				}])
			},
			// 添加条件 dialog
			addCondition(conditionGroupIndex) {
				this.conditionList = []
				this.conditionGroupIndex = conditionGroupIndex;
				this.conditionSelectVisible = true
				const conditionList = this.conditionConfig.conditionList[conditionGroupIndex]
				if (conditionList) {
					for ( var i = 0; i < conditionList.length; i++ ) {
						var { columnId } = conditionList[i]
						if (columnId == 0) {
							this.conditionList.push({ columnId: 0 })
						} else {
							this.conditionList.push(
								this.conditions.filter(item => {
									return item.columnId == columnId
								})[0]
							)
						}
					}
				}
			},
			// TODO：确认条件 dialog
			sureCondition() {
				//1.弹窗有，外面无+
				//2.弹窗有，外面有不变
				const conditionList = this.conditionConfig.conditionList[this.conditionGroupIndex];
				for (var i = 0; i < this.conditionList.length; i++) {
					var {
						columnId,
						showName,
						columnName,
						showType,
						columnType,
						fixedDownBoxValue
					} = this.conditionList[i]
					if (
						this.toggleClass(
							conditionList,
							this.conditionList[i],
							'columnId'
						)
					) {
						continue
					}
					if (columnId == 0) {
						conditionList.push({
							type: 1,
							columnId: columnId,
							showName: '发起人',   //具体数据在 conditionConfig 层级的 nodeUserList 字段
							nodeUserList: [],
						})
					} else {
						if (columnType == 'Double') {
							conditionList.push({
								columnDbname: columnName,  //该条件对应的 key
								showName: showName,   //该条件对应的 name
								showType: showType,
								columnId: columnId,
								columnType: columnType,
								type: 2,
								optType: '1',
								opt1: '<',
								opt2: '<',
								zdy1: '1',
								zdy2: '2',
							})
						} else if (columnType == 'String' && showType == '3') {
							conditionList.push({
								columnDbname: columnName,
								showName: showName,
								showType: showType,
								columnId: columnId,
								columnType: columnType,
								type: 2,
								zdy1: '',
								fixedDownBoxValue: fixedDownBoxValue
							})
						}
					}
				}
				////3.弹窗无，外面有-
				for (let i = conditionList.length - 1; i >= 0; i--) {
					if (
						!this.toggleClass(
							this.conditionList,
							conditionList[i],
							'columnId'
						)
					) {
						conditionList.splice(i, 1)
					}
				}
				conditionList.sort(function(a, b) {
					return a.columnId - b.columnId
				})
				this.conditionSelectVisible = false
			},
			// 条件 dialog：选择发起人
			addConditionRole(nodeUserList, conditionGroupIndex, conditionIndex) {
				this.conditionRoleSearchName = ''
				this.conditionVisible = true
				this.activeName = '1'
				this.getDepartmentList()
				this.conditionDepartmentList = []
				this.conditionEmployessList = []
				this.conditionRoleList = []
				this.conditionGroupIndex = conditionGroupIndex
				this.conditionIndex = conditionIndex
				for (var i = 0; i < nodeUserList.length; i++) {
					var { type, name, targetId } = nodeUserList[i]
					if (type == 1) {
						this.conditionEmployessList.push({
							employeeName: name,
							id: targetId
						})
					} else if (type == 2) {
						this.conditionRoleList.push({
							roleName: name,
							roleId: targetId
						})
					} else if (type == 3) {
						this.conditionDepartmentList.push({
							departmentName: name,
							id: targetId
						})
					}
				}
			},
			// 条件 dialog：确认选择发起人
			sureConditionRole() {
				const condition = this.conditionConfig.conditionList[this.conditionGroupIndex][this.conditionIndex]
				condition.nodeUserList = []
				this.conditionRoleList.map(item => {
					condition.nodeUserList.push({
						type: 2,
						targetId: item.roleId,
						name: item.roleName
					})
				})
				this.conditionDepartmentList.map(item => {
					condition.nodeUserList.push({
						type: 3,
						targetId: item.id,
						name: item.departmentName
					})
				})
				this.conditionEmployessList.map(item => {
					condition.nodeUserList.push({
						type: 1,
						targetId: item.id,
						name: item.employeeName
					})
				})
				this.conditionVisible = false
			},
			// 条件 drawer 关闭，保存条件
			saveCondition() {
				var a = this.conditionRouteConfig.conditionNodes.splice(
					this.bPriorityLevel - 1,
					1
				) //截取旧下标
				this.conditionRouteConfig.conditionNodes.splice(
					this.conditionConfig.priorityLevel - 1,
					0,
					a[0]
				) //填充新下标
				this.conditionRouteConfig.conditionNodes.map((item, index) => {
					item.priorityLevel = index + 1
				})
				for (var i = 0; i < this.conditionRouteConfig.conditionNodes.length; i++) {
					this.conditionRouteConfig.conditionNodes[i].error =
						this.conditionStr(this.conditionRouteConfig.conditionNodes[i], i) ==
							'请设置条件' && i != this.conditionRouteConfig.conditionNodes.length - 1
				}
				this.conditionDrawer = false
				this.$emit('update:nodeConfig', this.conditionRouteConfig)
			},
			// 枚举型条件：多选框样式装换
			toggleStrClass(item, key) {
				let a = item.zdy1 ? item.zdy1.split(',') : []
				return a.some(item => {
					return item == key
				})
			},
			// 枚举型条件：多选框勾选
			toStrChecked(item, key) {
				let a = item.zdy1 ? item.zdy1.split(',') : []
				var isIncludes = this.toggleStrClass(item, key)
				if (!isIncludes) {
					// 勾选
					a.push(key)
					item.zdy1 = a.toString()
				} else {
					// 取消勾选
					this.removeStrEle(item, key)
				}
			},
			// 枚举型条件：多选框取消勾选
			removeStrEle(item, key) {
				let a = item.zdy1 ? item.zdy1.split(',') : []
				var includesIndex
				a.map((item, index) => {
					if (item == key) {
						includesIndex = index
					}
				})
				a.splice(includesIndex, 1)
				item.zdy1 = a.toString()
			},
			// 数值型条件：改变relation
			changeOptType(item) {
				item.zdy1 = '1'
				if (item.optType == 6) {
					item.zdy2 = '2'
				}
			},
			// 条件列表转换成字符串
			conditionStr(item, index) {
				var { conditionList } = item
				if (conditionList.length == 0) {
					return index == this.nodeConfig.conditionNodes.length - 1 &&
						this.nodeConfig.conditionNodes[0].conditionList.length != 0
						? '其他条件进入此流程'
						: '请设置条件'
				} else {
					let str = ''
					// 循环条件组 conditionList 为二维数组
					for (var g = 0; g < conditionList.length; g++) {
						const conditions = conditionList[g];
						// 循环条件
						for (var i = 0; i < conditions.length; i++) {
							var {
								columnId,
								columnType,
								showType,
								showName,
								nodeUserList,
								optType,
								zdy1,
								opt1,
								zdy2,
								opt2,
								fixedDownBoxValue
							} = conditions[i]
							if (columnId == 0) {
								if (nodeUserList.length != 0) {
									str += '发起人属于：'
									str +=
										nodeUserList
											.map(item => {
												return item.name
											})
											.join('或') + ' 并且 '
								}
							}
							if (columnType == 'String' && showType == '3') {
								if (zdy1) {
									str +=
										showName +
										'属于：' +
										this.dealStr(zdy1, fixedDownBoxValue) +
										' 并且 '
								}
							}
							if (columnType == 'Double') {
								if (optType != 6 && zdy1) {
									var optTypeStr = ['', '<', '>', '≤', '=', '≥'][optType]
									str += `${showName} ${optTypeStr} ${zdy1} 并且 `
								} else if (optType == 6 && zdy1 && zdy2) {
									str += `${zdy1} ${opt1} ${showName} ${opt2} ${zdy2} 并且 `
								}
							}
						}
						if(g < conditionList.length && str != '') {
							str = str.substring(0, str.length - 4) + ' 或着 '
						}
					}
					return str ? str.substring(0, str.length - 4) : '请设置条件'
				}
			},
			// 条件使用，字符串转换或
			dealStr(str, obj) {
				let arr = []
				let list = str.split(',')
				for (var elem of Object.values(obj)) {
					list.map(item => {
						if (item == elem.key) {
							arr.push(elem.value)
						}
					})
				}
				return arr.join('或')
			},
		}
	}
</script>
<style>
	.error_tip {
		position: absolute;
		top: 0px;
		right: 0px;
		transform: translate(150%, 0px);
		font-size: 24px;
	}
	.add-node-popover-body {
		display: flex;
	}
	.promoter_content {
		padding: 0 20px;
	}
	.condition_content .el-button,
	.copyer_content .el-button,
	.approver_self_select .el-button,
	.promoter_content .el-button,
	.approver_content .el-button {
		margin-bottom: 20px;
	}
	.promoter_content p {
		padding: 18px 0;
		font-size: 14px;
		line-height: 20px;
		color: #000000;
	}
	.promoter_person .el-dialog__body {
		padding: 10px 20px 14px 20px;
	}
	.person_body {
		border: 1px solid #f5f5f5;
		height: 500px;
		display: flex;
	}
	.person_tree {
		padding: 10px 12px 0 8px;
		width: 280px;
		height: 100%;
		border-right: 1px solid #f5f5f5;
	}
	.person_tree input {
		padding-left: 22px;
		width: 210px;
		height: 30px;
		font-size: 12px;
		border-radius: 2px;
		border: 1px solid #d5dadf;
		background: url(../assets/images/list_search.png) no-repeat 10px center;
		background-size: 14px 14px;
		margin-bottom: 14px;
	}
	.tree_nav span {
		display: inline-block;
		padding-right: 10px;
		margin-right: 5px;
		max-width: 6em;
		color: #38adff;
		font-size: 12px;
		cursor: pointer;
		background: url(../assets/images/jiaojiao.png) no-repeat right center;
	}
	.tree_nav span:last-of-type {
		background: none;
	}
	.person_tree ul,
	.has_selected ul {
		height: 420px;
		overflow-y: auto;
	}
	.person_tree li {
		padding: 5px 0;
	}
	.person_tree li i {
		float: right;
		padding-left: 24px;
		padding-right: 10px;
		color: #3195f8;
		font-size: 12px;
		cursor: pointer;
		background: url(../assets/images/next_level_active.png) no-repeat 10px center;
		border-left: 1px solid rgb(238, 238, 238);
	}
	.person_tree li a.active + i {
		color: rgb(197, 197, 197);
		background-image: url(../assets/images/next_level.png);
		pointer-events: none;
	}
	.person_tree img {
		width: 14px;
		vertical-align: middle;
		margin-right: 5px;
	}
	.has_selected {
		width: 276px;
		height: 100%;
		font-size: 12px;
	}
	.has_selected ul {
		height: 460px;
	}
	.has_selected p {
		padding-left: 19px;
		padding-right: 20px;
		line-height: 37px;
		border-bottom: 1px solid #f2f2f2;
	}
	.has_selected p a {
		float: right;
	}
	.has_selected ul li {
		margin: 11px 26px 13px 19px;
		line-height: 17px;
	}
	.has_selected li span {
		vertical-align: middle;
	}
	.has_selected li img:first-of-type {
		width: 14px;
		vertical-align: middle;
		margin-right: 5px;
	}
	.has_selected li img:last-of-type {
		float: right;
		margin-top: 2px;
		width: 14px;
	}
	el-radio-group {
		padding: 20px 0;
	}
	.approver_content {
		padding-bottom: 10px;
		border-bottom: 1px solid #f2f2f2;
	}
	.approver_content .el-radio,
	.approver_some .el-radio,
	.approver_self_select .el-radio {
		width: 27%;
		margin-bottom: 20px;
	}
	.copyer_content .el-checkbox {
		margin-bottom: 20px;
	}
	.el-checkbox__label {
		font-size: 12px;
	}
	.condition_content,
	.copyer_content,
	.approver_appoint_member,
	.approver_self_select,
	.approver_manager,
	.approver_content,
	.approver_some {
		padding: 20px 20px 0;
	}
	.approver_appoint_member .el-button {
		margin-bottom: 20px;
	}
	.approver_manager p:first-of-type,
	.approver_some p {
		line-height: 19px;
		font-size: 14px;
		margin-bottom: 14px;
	}

	.approver_manager p {
		line-height: 32px;
	}
	.approver_manager select {
		width: 420px;
		height: 32px;
		background: rgba(255, 255, 255, 1);
		border-radius: 4px;
		border: 1px solid rgba(217, 217, 217, 1);
	}
	.approver_manager p.tip {
		margin: 10px 0 22px 0;
		font-size: 12px;
		line-height: 16px;
		color: #f8642d;
	}
	.approver_self {
		padding: 28px 20px;
	}
	.selected_list {
		line-height: 30px;
	}
	.selected_list span {
		margin-right: 10px;
		padding: 3px 6px 3px 9px;
		line-height: 12px;
		white-space: nowrap;
		border-radius: 2px;
		border: 1px solid rgba(220, 220, 220, 1);
	}
	.selected_list img {
		margin-left: 5px;
		width: 7px;
		height: 7px;
		cursor: pointer;
	}
	.approver_self_select h3 {
		margin: 5px 0 20px;
		font-size: 14px;
		font-weight: bold;
		line-height: 19px;
	}
	.condition_copyer .el-drawer__body .priority_level {
		position: absolute;
		top: 11px;
		right: 30px;
		width: 100px;
		height: 32px;
		background: rgba(255, 255, 255, 1);
		border-radius: 4px;
		border: 1px solid rgba(217, 217, 217, 1);
	}
	.condition_content p.tip {
		margin: 0 0 20px 0;
		width: 510px;
		text-indent: 14px;
		line-height: 36px;
		background: #e9f7fe;
		border: 1px solid #a1d4fb;
		border-radius: 4px;
		color: #515659;
		font-size: 12px;
	}
	.condition_content ul {
		max-height: 500px;
		overflow-y: scroll;
	}
	.condition_content li {
		margin-bottom: 16px;
	}
	.condition_content li > span {
		float: left;
		margin-right: 8px;
		width: 70px;
		line-height: 32px;
		text-align: right;
	}
	.condition_content li > div {
		display: inline-block;
		width: 370px;
	}
	/* .condition_content li:not(:last-child) > div > p {
		margin-bottom: 20px;
	} */
	.condition_content li > div > p:not(:last-child) {
		margin-bottom: 10px;
	}
	.condition_content li > a {
		float: right;
		margin-right: 10px;
		margin-top: 7px;
	}
	.condition_content li select,
	.condition_content li input {
		width: 100%;
		height: 32px;
		background: rgba(255, 255, 255, 1);
		border-radius: 4px;
		text-indent: 10px;
		border: 1px solid rgba(217, 217, 217, 1);
	}
	.condition_content li select + input {
		width: 260px;
	}
	.condition_content li select {
		margin-right: 10px;
		width: 100px;
	}
	.condition_content li p.selected_list {
		padding-left: 10px;
		border-radius: 4px;
		min-height: 32px;
		border: 1px solid rgba(217, 217, 217, 1);
	}
	.condition_content li p.check_box {
		line-height: 32px;
	}
	.condition_list .el-dialog__body {
		padding: 16px 26px;
	}
	.condition_list p {
		color: #666666;
		margin-bottom: 10px;
	}
	.condition_list p.check_box {
		margin-bottom: 0;
		line-height: 36px;
	}
</style>