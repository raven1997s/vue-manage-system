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
				<el-table-column prop="holidayName" label="节日名称"></el-table-column>
				<el-table-column prop="holidayTime" label="节日所在日期">
					<template #default="{ row }">
						{{ format(new Date(row.holidayTime), 'yyyy-MM-dd') }}
					</template>
				</el-table-column>
				<el-table-column prop="level" label="节日重要程度">
					<template #default="scope">
						<span v-if="scope.row.level === 1">平淡的一天</span>
						<span v-else-if="scope.row.level === 2">非常重要</span>
						<span v-else-if="scope.row.level === 3">特殊的日子</span>
					</template>
				</el-table-column>
				<el-table-column prop="holidayType" label="节日类型">
					<template #default="scope">
						<span v-if="scope.row.holidayType === 1">传统节日</span>
						<span v-else-if="scope.row.holidayType === 2">纪念日</span>
						<span v-else-if="scope.row.holidayType === 3">外国节日</span>
						<span v-else-if="scope.row.holidayType === 4">周末</span>
						<span v-else-if="scope.row.holidayType === 5">日常</span>
					</template>
				</el-table-column>
				<el-table-column prop="createUserName" label="节日添加人"></el-table-column>
				<el-table-column prop="createTime" label="创建时间"></el-table-column>
				<el-table-column prop="updateTime" label="修改时间"></el-table-column>
				<el-table-column label="操作" width="220" align="center">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleEdit(scope.row)" v-permiss="15">
							编辑
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.row.id)" v-permiss="16">
							删除
						</el-button>
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
				<el-form-item label="节日名称" prop="holidayName">
					<el-input v-model="form.holidayName" placeholder="请填写节日名称"></el-input>
				</el-form-item>
				<el-form-item label="节日重要程度" prop="level">
					<el-select v-model="form.level" placeholder="请选择节日重要程度" :clearable="true">
						<el-option key="平淡的一天" label="平淡的一天" :value="1"></el-option>
						<el-option key="非常重要" label="非常重要" :value="2"></el-option>
						<el-option key="特殊的日子" label="特殊的日子" :value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="节日类型" prop="holidayType">
					<el-select v-model="form.holidayType" placeholder="请选择节日类型" :clearable="true">
						<el-option key="传统节日" label="传统节日" :value="1"></el-option>
						<el-option key="纪念日" label="纪念日" :value="2"></el-option>
						<el-option key="外国节日" label="外国节日" :value="3"></el-option>
						<el-option key="周末" label="周末" :value="4"></el-option>
						<el-option key="日常" label="日常" :value="5"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="节日所在日期" prop="holidayTime">
					<el-date-picker v-model="form.holidayTime" type="date" placeholder="请选择节日所在日期" clearable />
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
				<el-form-item label="节日名称" prop="holidayName">
					<el-input v-model="form.holidayName" placeholder="请填写节日名称"></el-input>
				</el-form-item>
				<el-form-item label="节日重要程度" prop="level">
					<el-select v-model="form.level" placeholder="请选择节日重要程度" :clearable="true">
						<el-option key="平淡的一天" label="平淡的一天" :value="1"></el-option>
						<el-option key="非常重要" label="非常重要" :value="2"></el-option>
						<el-option key="特殊的日子" label="特殊的日子" :value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="节日类型" prop="holidayType">
					<el-select v-model="form.holidayType" placeholder="请选择节日类型" :clearable="true">
						<el-option key="传统节日" label="传统节日" :value="1"></el-option>
						<el-option key="纪念日" label="纪念日" :value="2"></el-option>
						<el-option key="外国节日" label="外国节日" :value="3"></el-option>
						<el-option key="周末" label="周末" :value="4"></el-option>
						<el-option key="日常" label="日常" :value="5"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="节日所在日期" prop="holidayTime">
					<el-date-picker v-model="form.holidayTime" type="date" placeholder="请选择节日所在日期" clearable />
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
import { storeToRefs } from 'pinia';
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getSpecialDateList, updateSpecialDate, addSpecialDate, deleteSpecialDate } from '../api/special-date-table';
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '../store/user-info';
import { format, parseISO } from 'date-fns';

const userStore = useUserStore();

interface TableItem {
	id: number,
	holidayName: string,
	level: number,
	holidayType: number,
	holidayTime: string,
	createUserName: string,
	createTime: string,
	updateTime: string
}

const query = reactive({
	pageNum: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
	getSpecialDateList(query).then(res => {
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
const handleDelete = (id: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			const params = { id: id };
			deleteSpecialDate(params).then(res => {
				console.log(res);
				ElMessage.success('删除成功');
				getData();
			}).catch(() => {
				ElMessage.error('系统异常');
			})
		})
		.catch(() => { });
};

// 表格编辑时弹窗和保存
const form = reactive({
	id: 0,
	createId: 0,
	holidayName: "",
	level: 0,
	holidayType: 0,
	holidayTime: "",
	createUserName: "",
	createTime: "",
	updateTime: ""
});

const editVisible = ref(false);
let idx: number = -1;
const handleEdit = (row: any) => {
	form.id = row.id;
	form.holidayName = row.holidayName;
	form.level = row.level;
	form.holidayType = row.holidayType;
	form.holidayTime = format(parseISO(row.holidayTime), 'yyyy-MM-dd');
	editVisible.value = true;
};
const saveEdit = (formEl: FormInstance | undefined) => {

	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			// 格式化日期并提交
			const formattedBirthday = format(new Date(form.holidayTime), 'yyyy-MM-dd');
			const formattedDateTime = `${formattedBirthday} 00:00:00`;
			// 将格式化后的日期时间设置回表单
			form.holidayTime = formattedDateTime;

			editVisible.value = false;

			updateSpecialDate(form).then(res => {
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
	form.createId = userStore.userId;
	form.holidayName = '';
	form.level = 1;
	form.holidayType = 1;
	form.holidayTime = "";
	form.createUserName = '';
};
const saveAdd = (formEl: FormInstance | undefined) => {

	if (userStore.userId === 0) {
		ElMessage.error("请选择所属用户");
		return false;
	}

	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			// 格式化日期并提交
			const formattedBirthday = format(new Date(form.holidayTime), 'yyyy-MM-dd');
			const formattedDateTime = `${formattedBirthday} 00:00:00`;
			// 将格式化后的日期时间设置回表单
			form.holidayTime = formattedDateTime;
			// 校验通过
			addVisible.value = false;

			addSpecialDate(form).then(res => {
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


const checkHolidayName = (rule: any, value: any, callback: any) => {
	if (value === '') {
		return callback(new Error('给节日给个名字呗'));
	} else if (value.length > 10) {
		return callback(new Error('节日名称太长了吧'));
	} else {
		callback();
	}
};

const checkHolidayTime = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('节日所在日期是必填项'));
	} else {
		callback();
	}
}

const rules = {
	holidayName: [
		{ required: true, validator: checkHolidayName, trigger: 'blur' }
	],
	level: [
		{ required: true, type: 'number', message: '必须选择节日重要程度哦', trigger: 'blur' }
	],
	holidayType: [
		{ required: true, type: 'number', message: '必须选择节日类型哦', trigger: 'blur' }
	],
	holidayTime: [
		{ required: true, type: 'number', validator: checkHolidayTime, message: '节日所在日期是必填的哦', trigger: 'blur' },
	],
};


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
