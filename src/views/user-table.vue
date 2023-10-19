<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<!-- <el-select v-model="query.address" placeholder="地址111" class="handle-select mr10">
					<el-option key="1" label="广东省" value="广东省"></el-option>
					<el-option key="2" label="湖南省" value="湖南省"></el-option>
				</el-select>
				<el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input> -->
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="name" label="姓名"></el-table-column>
				<el-table-column prop="birthday" label="出生日期">
					<template #default="{ row }">
						{{ format(new Date(row.birthday), 'yyyy-MM-dd') }}
					</template>
				</el-table-column>
				<el-table-column label="抽奖权限" align="center">
					<template #default="scope">
						<el-tag :type="scope.row.hasLotteryPermission ? 'success' : 'danger'">
							{{ scope.row.hasLotteryPermission ? '有权限' : '无权限' }}
						</el-tag>
					</template>
				</el-table-column>

				<el-table-column prop="createTime" label="创建时间"></el-table-column>
				<el-table-column prop="updateTime" label="修改时间"></el-table-column>
				<el-table-column label="操作" width="220" align="center">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
							编辑
						</el-button>
						<!-- <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
							删除
						</el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageNum"
					:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
			</div>
		</div>
		<!-- 新增弹出框 -->
		<el-dialog title="新增" v-model="addVisible" width="30%">
			<el-form ref="formRef" :model="form" status-icon :rules="rules" label-width="120px">
				<el-form-item label="用户名" prop="name">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="出生日期" prop="birthday">
					<el-date-picker v-model="form.birthday" type="date" placeholder="请选择出生日期" clearable />
				</el-form-item>
				<el-form-item label="抽奖权限" prop="hasLotteryPermission">
					<el-select v-model="form.hasLotteryPermission" placeholder="请选择抽奖权限">
						<el-option key="有权限" label="有权限" :value="true"></el-option>
						<el-option key="无权限" label="无权限" :value="false"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="addVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveAdd(formRef)">确 定</el-button>
				</span>
			</template>
		</el-dialog>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" v-model="editVisible" width="30%">
			<el-form ref="formRef" :model="form" status-icon :rules="rules" label-width="120px">
				<el-form-item label="用户名" prop="name">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="出生日期" prop="birthday">
					<el-date-picker v-model="form.birthday" type="date" placeholder="请选择出生日期" clearable />
				</el-form-item>
				<el-form-item label="抽奖权限" prop="hasLotteryPermission">
					<el-select v-model="form.hasLotteryPermission" placeholder="请选择抽奖权限">
						<el-option key="有权限" label="有权限" :value="true"></el-option>
						<el-option key="无权限" label="无权限" :value="false"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit(formRef)">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="usertable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { getUserList, updateUser, addUser } from '../api/user';
import { format, parseISO } from 'date-fns';
import type { FormInstance, FormRules } from 'element-plus'

interface TableItem {
	birthday: string;
	createTime: string;
	hasLotteryPermission: boolean;
	id: number;
	name: string;
	updateTime: string;
}

const query = reactive({
	pageNum: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
	getUserList(query).then(res => {
		tableData.value = res.data.list;
		pageTotal.value = res.data.total || 50;
	})
};

getData();

// 查询操作
const handleSearch = () => {
	query.pageNum = 1;
	getData();
};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageNum = val;
	getData();
};

// 删除操作
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			ElMessage.success('删除成功');
			tableData.value.splice(index, 1);
		})
		.catch(() => { });
};

// 表格编辑时弹窗和保存
const form = reactive({
	id: 0,
	name: '',
	birthday: '',
	hasLotteryPermission: false
});

const editVisible = ref(false);
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
	idx = index;
	form.id = row.id;
	form.name = row.name;
	form.birthday = format(parseISO(row.birthday), 'yyyy-MM-dd');
	form.hasLotteryPermission = row.hasLotteryPermission;
	editVisible.value = true;
};
const saveEdit = (formEl: FormInstance | undefined) => {

	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			editVisible.value = false;
			// 格式化日期并提交
			const formattedBirthday = format(new Date(form.birthday), 'yyyy-MM-dd');
			const formattedDateTime = `${formattedBirthday} 00:00:00`;
			// 将格式化后的日期时间设置回表单
			form.birthday = formattedDateTime;

			updateUser(form).then(res => {
				console.log(res);
				if (res.status == 1) {
					ElMessage.success('修改成功');
					getData();
				} else {
					ElMessage.error(res.message);
				}
			}).catch(() => {
				ElMessage.error('系统异常');
			})
			console.log('submit!');
		} else {
			console.log('error submit!');
			return false;
		}
	})
};


// 表格新增时弹窗和保存
const addVisible = ref(false);
const handleAdd = () => {
	addVisible.value = true;
	form.name = '';
	form.birthday = '';
	form.hasLotteryPermission = false;
};
const saveAdd = (formEl: FormInstance | undefined) => {

	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			// 校验通过
			addVisible.value = false;
			// 格式化日期并提交
			const formattedBirthday = format(new Date(form.birthday), 'yyyy-MM-dd');
			const formattedDateTime = `${formattedBirthday} 00:00:00`;
			// 将格式化后的日期时间设置回表单
			form.birthday = formattedDateTime;

			addUser(form).then(res => {
				console.log(res);
				if (res.status == 1) {
					ElMessage.success(res.message);
					getData();
				} else {
					ElMessage.error(res.message);
				}
			}).catch(() => {
				ElMessage.error('系统异常');
			})
			console.log('submit!');
		} else {
			console.log('error submit!');
			return false;
		}
	})

};

const formRef = ref<FormInstance>()


const checkName = (rule: any, value: any, callback: any) => {
	if (value === '') {
		return callback(new Error('用户名是必填项'));
	} else {
		callback();
	}
}

const checkBirthday = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('出生日期是必填项'));
	} else {
		callback();
	}
}

const rules = {
	name: [
		{ required: true, validator: checkName, trigger: 'blur' }
	],
	birthday: [
		{ required: true, validator: checkBirthday, trigger: 'blur' }
	],
	hasLotteryPermission: [
		{ required: true, trigger: 'blur' }
	]
}


</script>

<style scoped>
.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 120px;
}

.handle-input {
	width: 300px;
}

.table {
	width: 100%;
	font-size: 14px;
}

.red {
	color: #F56C6C;
}

.mr10 {
	margin-right: 10px;
}

.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}
</style>
