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
				<el-table-column prop="giftName" label="礼物名称"></el-table-column>
				<el-table-column prop="type" label="礼物类型">
					<template #default="scope">
						<span v-if="scope.row.type === 1">化妆品</span>
						<span v-else-if="scope.row.type === 2">旅行</span>
						<span v-else-if="scope.row.type === 3">现金</span>
						<span v-else-if="scope.row.type === 4">游戏</span>
						<span v-else-if="scope.row.type === 5">衣服</span>
						<span v-else-if="scope.row.type === 6">美食</span>
						<span v-else-if="scope.row.type === 7">电子产品</span>
					</template>
				</el-table-column>
				<el-table-column prop="price" label="礼物价格"></el-table-column>
				<el-table-column prop="infatuationScore" label="心动值">
					<template #default="scope">
						<span>{{ scope.row.infatuationScore }} 分</span>
					</template>
				</el-table-column>
				<el-table-column prop="practicalityValue" label="实用性">
					<template #default="scope">
						<span>{{ scope.row.practicalityValue }} 分</span>
					</template>
				</el-table-column>
				<el-table-column prop="description" label="添加原因"></el-table-column>
				<el-table-column label="购买标识" align="center">
					<template #default="scope">
						<el-tag :type="scope.row.isBuy ? 'success' : 'danger'">
							{{ scope.row.isBuy ? '已购买' : '未购买' }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createUserName" label="创建人"></el-table-column>
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
				<el-form-item label="礼物名称" prop="giftName">
					<el-input v-model="form.giftName" placeholder="请填写礼物名称"></el-input>
				</el-form-item>
				<el-form-item label="礼物类型" prop="type">
					<el-select v-model="form.type" placeholder="请选择礼物类型" :clearable="true">
						<el-option key="化妆品" label="化妆品" :value="1"></el-option>
						<el-option key="旅行" label="旅行" :value="2"></el-option>
						<el-option key="现金" label="现金" :value="3"></el-option>
						<el-option key="游戏" label="游戏" :value="4"></el-option>
						<el-option key="衣服" label="衣服" :value="5"></el-option>
						<el-option key="美食" label="美食" :value="6"></el-option>
						<el-option key="电子产品" label="电子产品" :value="7"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="礼物价格" prop="price">
					<el-input-number v-model="form.price" controls-position="right" :precision="2" :step="50" :min="0"
						:max="100000" />
				</el-form-item>
				<el-form-item label="心动值" prop="infatuationScore">
					<el-slider v-model="form.infatuationScore" :min="60" :max="100" :step="5" show-stops />
				</el-form-item>
				<el-form-item label="实用性" prop="practicalityValue">
					<el-slider v-model="form.practicalityValue" :min="0" :max="100" :step="5" />
				</el-form-item>
				<el-form-item label="添加原因" prop="description">
					<el-input v-model="form.description" placeholder="请填写添加原因" type="textarea"></el-input>
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
				<el-form-item label="礼物名称" prop="giftName">
					<el-input v-model="form.giftName" placeholder="请填写礼物名称"></el-input>
				</el-form-item>
				<el-form-item label="礼物类型" prop="type">
					<el-select v-model="form.type" placeholder="请选择礼物类型" :clearable="true">
						<el-option key="化妆品" label="化妆品" :value="1"></el-option>
						<el-option key="旅行" label="旅行" :value="2"></el-option>
						<el-option key="现金" label="现金" :value="3"></el-option>
						<el-option key="游戏" label="游戏" :value="4"></el-option>
						<el-option key="衣服" label="衣服" :value="5"></el-option>
						<el-option key="美食" label="美食" :value="6"></el-option>
						<el-option key="电子产品" label="电子产品" :value="7"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="礼物价格" prop="price">
					<el-input-number v-model="form.price" controls-position="right" :precision="2" :step="50" :min="0"
						:max="100000" />
				</el-form-item>
				<el-form-item label="心动值" prop="infatuationScore">
					<el-slider v-model="form.infatuationScore" :min="60" :max="100" :step="5" show-stops />
				</el-form-item>
				<el-form-item label="实用性" prop="practicalityValue">
					<el-slider v-model="form.practicalityValue" :min="0" :max="100" :step="5" />
				</el-form-item>
				<el-form-item label="添加原因" prop="description">
					<el-input v-model="form.description" placeholder="请填写添加原因" type="textarea"></el-input>
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
import { getGiftList, updateGift, addGift, deleteGift } from '../api/gift';
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '../store/user-info';

const userStore = useUserStore();

interface TableItem {
	id: number,
	giftName: string,
	type: number,
	price: number,
	infatuationScore: number,
	practicalityValue: number,
	description: string,
	isBuy: boolean,
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
	getGiftList(query).then(res => {
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
			deleteGift(params).then(res => {
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
	giftName: '',
	type: 0,
	price: 0,
	infatuationScore: 0,
	practicalityValue: 0,
	description: '',
	isBuy: false,
	createUserName: '',
	createTime: '',
	updateTime: '',
	createId: 0
});

const editVisible = ref(false);
let idx: number = -1;
const handleEdit = (row: any) => {
	form.id = row.id;
	form.giftName = row.giftName;
	form.type = row.type;
	form.price = row.price;
	form.infatuationScore = row.infatuationScore;
	form.practicalityValue = row.practicalityValue;
	form.description = row.description;
	form.isBuy = row.isBuy;
	form.createUserName = row.createUserName;
	editVisible.value = true;
};
const saveEdit = (formEl: FormInstance | undefined) => {

	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			editVisible.value = false;

			updateGift(form).then(res => {
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
	form.giftName = '';
	form.type = 7;
	form.price = 0;
	form.infatuationScore = 60;
	form.practicalityValue = 0;
	form.description = '';
	form.isBuy = false;
	form.createUserName = '';
};
const saveAdd = (formEl: FormInstance | undefined) => {

	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			// 校验通过
			addVisible.value = false;

			addGift(form).then(res => {
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


const checkGiftName = (rule: any, value: any, callback: any) => {
	if (value === '') {
		return callback(new Error('给宝贝给个名字呗'));
	} else if (value.length > 10) {
		return callback(new Error('礼物名称太长了吧'));
	} else {
		callback();
	}
};

const checkDescription = (rule: any, value: any, callback: any) => {
	if (value === '') {
		return callback(new Error('填一下为什么想要嘛'));
	} else if (value.length > 100) {
		return callback(new Error('小作文写太长了吧'));
	} else {
		callback();
	}
};

const checkInfatuationScoreRange = (rule: any, value: any, callback: any) => {
	if (value === 60) {
		return callback(new Error('心动值是必填的哦，选一下吧~'));
	} else {
		callback();
	}
};

const checkPracticalityValueRange = (rule: any, value: any, callback: any) => {
	if (value === 0) {
		return callback(new Error('实用性是必填的哦，选一下吧~'));
	} else {
		callback();
	}
};


const rules = {
	giftName: [
		{ required: true, validator: checkGiftName, trigger: 'blur' }
	],
	type: [
		{ required: true, type: 'number', message: '必须选择礼物类型哦', trigger: 'blur' }
	],
	price: [
		{ required: true, type: 'number', message: '价格是必填的哦', trigger: 'blur' },
	],
	infatuationScore: [
		{ required: true, type: 'number', validator: checkInfatuationScoreRange, message: '心动值是必填的哦', trigger: 'blur' }
	],
	practicalityValue: [
		{ required: true, type: 'number', validator: checkPracticalityValueRange, message: '实用值是必填的哦', trigger: 'blur' }
	],
	description: [
		{ required: true, validator: checkDescription, trigger: 'blur' }
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
