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
				<el-button type="primary" :icon="Plus">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="name" label="姓名"></el-table-column>
				<el-table-column prop="birthday" label="出生时间"></el-table-column>
				<el-table-column label="是否有抽奖权限" align="center">
					<template #default="scope">
						<el-tag
							:type="scope.row.hasLotteryPermission ? 'success' :  'danger'"
						>
							{{ scope.row.hasLotteryPermission ? '有' : '无'}}
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
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					layout="total, prev, pager, next"
					:current-page="query.pageNum"
					:page-size="query.pageSize"
					:total="pageTotal"
					@current-change="handlePageChange"
				></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" v-model="editVisible" width="30%">
			<el-form label-width="120px">
				<el-form-item label="用户名">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="出生日期">
					<el-input v-model="form.birthday"></el-input>
				</el-form-item>
				<!-- <el-form-item v-model="form.hasLotteryPermission" class="handle-select mr10">
					<el-option key="1" label="有抽奖权限" value="有"></el-option>
					<el-option key="0" label="无抽奖权限" value="无"></el-option>
				</el-form-item> -->
				<el-form-item label="是否有抽奖权限" prop="form.hasLotteryPermission">
                    <el-select v-model="form.hasLotteryPermission" placeholder="请选择抽奖权限">
                        <el-option key="有" label="有" value="true"></el-option>
                        <el-option key="无" label="无" value="false"></el-option>
                    </el-select>
                </el-form-item>
				
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="usertable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { getUserList,updateUser } from '../api/user';

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
		
		tableData.value = res.list;
		pageTotal.value = res.total || 50;
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
		.catch(() => {});
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
	id : 0,
	name: '',
	birthday : '',
	hasLotteryPermission: ''
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
	idx = index;
	form.id = row.id;
	form.name = row.name;
	form.birthday = row.birthday;
	form.hasLotteryPermission = row.hasLotteryPermission ? '有' : '无';
	editVisible.value = true;
};
const saveEdit = () => {
	editVisible.value = false;
	
	ElMessage.success(`修改成功`);
	// tableData.value[idx].name = form.name;
	// tableData.value[idx].address = form.address;
	console.log("xxx");
	
	updateUser(form).then(res => {

	})
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
