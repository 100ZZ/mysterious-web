<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.configKey" placeholder="配置字段" class="handle-input mr10"></el-input>

        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Refresh" @click="handleReset">重置</el-button>
        <el-button type="primary" :icon="Plus" @click="handleInsert">新增</el-button>
      </div>

      <el-table :data="configData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="编号" width="55" align="center"></el-table-column>
        <el-table-column prop="configKey" label="配置字段" align="center"></el-table-column>
        <el-table-column prop="configValue" label="字段值" align="center"></el-table-column>
        <el-table-column prop="description" label="字段描述" align="center"></el-table-column>
        <el-table-column prop="creator" label="创建人" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="modifier" label="修改人" align="center"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间" align="center"></el-table-column>

        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" class="bg-blue" @click="handleEdit(scope.row)" v-permiss="1">
              编辑
            </el-button>
            <el-button text :icon="Delete" class="red" @click="handleDelete(scope.row.id)" v-permiss="1">
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
          <el-input v-model="insertForm.configKey" placeholder="配置字段"></el-input>
        </el-form-item>
        <el-form-item label="字段值">
          <el-input v-model="insertForm.configValue" placeholder="字段值"></el-input>
        </el-form-item>
        <el-form-item label="字段描述">
          <el-input v-model="insertForm.description" placeholder="字段描述"></el-input>
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
        <el-form-item label="编号">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="配置字段">
          <el-input v-model="editForm.configKey" disabled></el-input>
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
import { Plus, Search, Delete, Edit, Refresh } from '@element-plus/icons-vue';
import {addConfig, deleteConfig, getConfigList, updateConfig} from "../api/config";
import {checkToLogin} from "../common/push";

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
    checkToLogin(res.data.message);
    const code = res.data.code
    if (code != 0) {
      ElMessage.error(res.data.message);
      return false;
    }
    configData.value = res.data.data.list;
    total.value = res.data.data.total || 10;
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
  insertForm.configKey = row.configKey;
  insertForm.configValue = row.configValue;
  insertForm.description = row.description;
  insertVisible.value = true;
};

const saveInsert = async () => {
  const res = await addConfig(insertForm);

  const code = res.data.code;
  if (code !== 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("新增成功");
    insertVisible.value = false;
    await getList(); // 等待getList()执行完再继续
  }
};

// 删除操作
const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  });
  const res = await deleteConfig(id);
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

const handleEdit = (row : any) => {
  editForm.id = row.id;
  editForm.configKey = row.configKey;
  editForm.configValue = row.configValue;
  editForm.description = row.description;
  editVisible.value = true;
};

const saveEdit = async () => {
  const res = await updateConfig(editForm.id, editForm);

  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("编辑成功");
    editVisible.value = false;
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
.bg-blue {
  color: #409EFF;
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
