<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.configKey" placeholder="配置字段" class="handle-input mr10"></el-input>

        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Search" @click="handleReset">重置</el-button>
        <el-button type="primary" :icon="Plus" @click="handleInsert">新增</el-button>
      </div>

      <el-table :data="configData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="configKey" label="配置字段"></el-table-column>
        <el-table-column prop="configValue" label="字段值"></el-table-column>
        <el-table-column prop="description" label="字段描述"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="modifier" label="修改人"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间"></el-table-column>

        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" class="blue" @click="handleEdit(scope.$index, scope.row)" v-permiss="1">
              编辑
            </el-button>
            <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="1">
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
    <el-dialog title="新增" v-model="insertVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="配置字段">
          <el-input v-model="insertForm.configKey"></el-input>
        </el-form-item>
        <el-form-item label="字段值">
          <el-input v-model="insertForm.configValue"></el-input>
        </el-form-item>
        <el-form-item label="字段描述">
          <el-input v-model="insertForm.description"></el-input>
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
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="ID">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="配置字段">
          <el-input v-model="editForm.configKey"></el-input>
        </el-form-item>
        <el-form-item label="字段值">
          <el-input v-model="editForm.configValue"></el-input>
        </el-form-item>
        <el-form-item label="字段描述">
          <el-input v-model="editForm.description"></el-input>
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

<script setup lang="ts" name="baseConfig">
import { ref, reactive } from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import { Plus, Search, Delete, Edit } from '@element-plus/icons-vue';
import {addConfig, deleteConfig, getConfigList, updateConfig} from "../api/config";

interface ConfigItem {
  id: number;
  configKey: string;
  configValue: string;
  description: string;
  creator: string;
  modifier: string;
  createTime: string;
  modifyTime: string;
}

const query = reactive({
  configKey: null,
  page: 1,
  size: 10
});

const configData = ref<ConfigItem[]>([]);
const total = ref(0);
const getList = () => {
  getConfigList(query).then(res => {
    const code = res.data.code
    if (code != 0) {
      ElMessage.error(res.data.message);
      return false;
    }
    configData.value = res.data.data.list;
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
  query.configKey = null;
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
  configKey: null,
  configValue: null,
  description: null
});

const handleInsert = (row: any) => {
  insertForm.configKey  = row.configKey;
  insertForm.configValue = row.configValue;
  insertForm.description = row.description;
  insertVisible.value = true;
};

const saveInsert = async () => {
  insertVisible.value = false;
  const res = await addConfig(insertForm);

  const code = res.data.code;
  if (code !== 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("新增成功");
    await getList(); // 等待getList()执行完再继续
  }
};

// 删除操作
const handleDelete = async (index: number) => {
  await ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  });
  const res = await deleteConfig(configData.value[index].id);
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
  configKey: null,
  configValue: null,
  description: null,
});

let idx: number = -1
const handleEdit = (index: number, row : any) => {
  idx = index;
  editForm.id = row.id;
  editForm.configKey = row.configKey;
  editForm.configValue = row.configValue;
  editForm.description = row.description;
  editVisible.value = true;
};

const saveEdit = async () => {
  editVisible.value = false;

  const res = await updateConfig(configData.value[idx].id, editForm);

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
