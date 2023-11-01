<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.id" placeholder="ID" class="handle-input mr10"></el-input>
        <el-input v-model="query.name" placeholder="名称" class="handle-input mr10"></el-input>
        <el-input v-model="query.biz" placeholder="产品线" class="handle-input mr10"></el-input>
        <el-input v-model="query.biz" placeholder="服务" class="handle-input mr10"></el-input>

        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Refresh" @click="handleReset">重置</el-button>
        <el-button type="primary" :icon="Plus" @click="handleInsert">新增</el-button>
      </div>

      <el-table :data="testCaseData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="biz" label="业务线"></el-table-column>
        <el-table-column prop="service" label="服务"></el-table-column>
        <el-table-column prop="version" label="版本"></el-table-column>
        <el-table-column prop="status" label="状态" align="center"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="modifier" label="修改人"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间"></el-table-column>

        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button style="margin-left: 0" text :icon="Search" class="green" @click="" v-permiss="1">
              详情
            </el-button>
            <el-button style="margin-left: 0" text :icon="Edit" class="green" @click="handleEdit(scope.row)" v-permiss="1">
              编辑
            </el-button>
            <el-button style="margin-left: 0" text :icon="Right" class="green" @click="" v-permiss="1">
              调试
            </el-button>
            <el-button style="margin-left: 0" text :icon="Plus" class="blue" @click="" v-permiss="1">
              报告
            </el-button>
            <el-button style="margin-left: 0" text :icon="Delete" class="red" @click="handleDelete(scope.row.id)" v-permiss="1">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.page"
            :page-size="query.size"
            :total="total"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>


    <!-- 新增弹出框 -->
    <el-dialog title="新增用例" v-model="insertVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="名称">
          <el-input v-model="insertForm.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="insertForm.description" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item label="业务线">
          <el-input v-model="insertForm.biz" placeholder="业务线"></el-input>
        </el-form-item>
        <el-form-item label="服务">
          <el-input v-model="insertForm.service" placeholder="服务"></el-input>
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model="insertForm.version" placeholder="版本号"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="insertVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveInsert">确 定</el-button>
				</span>
      </template>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑用例" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="ID">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="editForm.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.description" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item label="业务线">
          <el-input v-model="editForm.biz" placeholder="业务线"></el-input>
        </el-form-item>
        <el-form-item label="服务">
          <el-input v-model="editForm.service" placeholder="服务"></el-input>
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model="editForm.version" placeholder="版本号"></el-input>
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

<script setup lang="ts" name="baseNode">
import {ref, reactive} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import { Plus, Search, Delete, Edit, Refresh, Right } from '@element-plus/icons-vue';
import {codeToTestCaseStatus} from "../common/convert";
import {addTestCase, deleteTestCase, getTestCaseList, syncNode, updateTestCase} from "../api/testcase";

interface TestCaseItem {
  id: number;
  name: string;
  description: string;
  biz: number;
  service: string;
  version: number;
  status: string;
  testCaseDir: string;
  creator: string;
  modifier: string;
  createTime: string;
  modifyTime: string;
}

const nodeTypeFormat = (row: any) => {
  return codeToNodeType(row.type)
}

const testCaseStatusEnum = (code: number) => {
  switch (code) {
    case 0:
      return "没有执行";
    case 1:
      return "正在执行";
    case 2:
      return "执行成功"
    case 3:
      return "执行异常"
    case 4:
      return "排队等待"
    case 5:
      return "排队取消"
    default:
      return "没有执行";
  }
}

const query = reactive({
  id: null,
  name: null,
  biz: null,
  service: null,
  page: 1,
  size: 10
});

const testCaseData = ref<TestCaseItem[]>([]);
const total = ref(0);
const getList = () => {
  getTestCaseList(query).then(res => {
    const code = res.data.code
    if (code != 0) {
      ElMessage.error(res.data.message);
      return false;
    }
    testCaseData.value = res.data.data.list;
    total.value = res.data.data.total || 50;
  });
};
getList();

// 查询操作
const handleSearch = () => {
  query.page = 1;
  getList();
};

const handleReset = () => {
  query.id = null;
  query.name = null;
  query.biz = null;
  query.service = null;
  getList();
};

// 分页导航
const handlePageChange = (val: number) => {
  query.page = val;
  getList();
};

// 表格新增时弹窗和保存
const insertVisible = ref(false);
let insertForm = reactive({
  name: null,
  description: null,
  biz: null,
  service: null,
  version: null
});

const handleInsert = (row: any) => {
  insertForm.name = row.name;
  insertForm.description = row.description;
  insertForm.biz = row.biz;
  insertForm.service = row.service;
  insertForm.version = row.version;
  insertVisible.value = true;
};

const saveInsert = async () => {
  insertVisible.value = false;
  const res = await addTestCase(insertForm);

  const code = res.data.code;
  if (code !== 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("新增成功");
    await getList(); // 等待getList()执行完再继续
  }
};

// 删除操作
const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  });
  //const res = await deleteNode(nodeData.value[index].id);
  const res = await deleteTestCase(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("删除成功");
    await getList(); // 等待getList()执行完再继续
  }
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let editForm = reactive({
  id: null,
  name: null,
  description: null,
  biz: null,
  service: null,
  version: null
});

const handleEdit = (row : any) => {
  editForm.id = row.id;
  editForm.name = row.name;
  editForm.description = row.description;
  editForm.biz = row.biz;
  editForm.service = row.service;
  editForm.version = row.version;
  editVisible.value = true;
};

const saveEdit = async () => {
  editVisible.value = false;

  const res = await updateTestCase(editForm.id, editForm);

  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("编辑成功");
    await getList(); // 等待getList()执行完再继续
  }
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
  width: 200px;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #F56C6C;
}
.green {
  color: #00a854;
}
.blue {
  color: #20a0ff;
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
