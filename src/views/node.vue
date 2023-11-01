<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.name" placeholder="节点名称" class="handle-input mr10"></el-input>
        <el-input v-model="query.host" placeholder="节点地址" class="handle-input mr10"></el-input>

        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Refresh" @click="handleReset">重置</el-button>
        <el-button type="primary" :icon="Plus" @click="handleInsert">新增</el-button>
      </div>

      <el-table :data="nodeData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="节点名称"></el-table-column>
        <el-table-column prop="description" label="节点描述"></el-table-column>
        <el-table-column prop="type" label="节点类型" :formatter="nodeTypeFormat"></el-table-column>
        <el-table-column prop="host" label="登录地址"></el-table-column>
        <el-table-column prop="port" label="登录端口"></el-table-column>
        <el-table-column prop="username" label="登录用户"></el-table-column>
        <el-table-column prop="password" label="登录密码"></el-table-column>
        <el-table-column prop="status" label="节点状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 2 ? 'danger' : scope.row.status === 1 ? 'success' : 0">
              {{ statusEnum(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="modifier" label="修改人"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间"></el-table-column>

        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
<!--            <el-button style="margin-left: 0" text :icon="Top" @click="handleButtonClick(scope.$index)" v-permiss="1">-->
<!--              {{buttonText}}-->
<!--            </el-button>-->
            <el-dropdown class="group-status" trigger="click">
              <el-button style="margin-left: 0" class="el-dropdown-link" text :icon="Right" v-permiss="1">操作</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="enableAction(scope.row.id)">启用</el-dropdown-item>
                  <el-dropdown-item @click="disableAction(scope.row.id)">禁用</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <el-button style="margin-left: 0" text :icon="Refresh" class="green" @click="syncAction(scope.row.id)" v-permiss="1">
              同步
            </el-button>
            <el-button style="margin-left: 0" text :icon="Edit" class="blue" @click="handleEdit(scope.row)" v-permiss="1">
              编辑
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
    <el-dialog title="新增" v-model="insertVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="节点名称">
          <el-input v-model="insertForm.name" placeholder="节点名称"></el-input>
        </el-form-item>
        <el-form-item label="节点描述">
          <el-input v-model="insertForm.description" placeholder="节点描述"></el-input>
        </el-form-item>
        <el-form-item label="节点类型">
          <el-select v-model="insertForm.type" placeholder="节点类型">
            <el-option key="0" label="Slave" value="0"></el-option>
            <el-option key="1" label="Master" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录地址">
          <el-input v-model="insertForm.host" placeholder="节点IP地址"></el-input>
        </el-form-item>
        <el-form-item label="登录端口">
          <el-input v-model="insertForm.port" placeholder="ssh端口"></el-input>
        </el-form-item>
        <el-form-item label="登录用户">
          <el-input v-model="insertForm.username" placeholder="ssh用户"></el-input>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input v-model="insertForm.password" placeholder="登录密码"></el-input>
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
        <el-form-item label="节点名称">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="节点描述">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="节点类型">
          <el-select v-model="editForm.type" placeholder="节点类型">
            <el-option key="0" label="Slave" value="0"></el-option>
            <el-option key="1" label="Master" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录地址">
          <el-input v-model="editForm.host" placeholder="节点IP地址"></el-input>
        </el-form-item>
        <el-form-item label="登录端口">
          <el-input v-model="editForm.port" placeholder="ssh端口"></el-input>
        </el-form-item>
        <el-form-item label="登录用户">
          <el-input v-model="editForm.username" placeholder="ssh用户"></el-input>
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
import {ref, reactive, computed} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import { Plus, Search, Delete, Edit, Refresh, Right } from '@element-plus/icons-vue';
import {addNode, deleteNode, disableNode, enableNode, getNodeList, updateNode} from "../api/node";
import {codeToNodeStatus, codeToNodeType, nodeTypeToCode} from "../common/convert";
import {syncNode} from "../api/testcase";

interface NodeItem {
  id: number;
  name: string;
  description: string;
  type: number;
  host: string;
  port: number;
  username: string;
  password: string;
  creator: string;
  modifier: string;
  createTime: string;
  modifyTime: string;
}

const nodeTypeFormat = (row: any) => {
  return codeToNodeType(row.type)
}

const nodeStatusFormat = (row: any) => {
  return codeToNodeStatus(row.status)
}

const statusEnum = (code: number) => {
  switch (code) {
    case 0:
      return "禁用中";
    case 1:
      return "启用中";
    case 2:
      return "启动失败"
    default:
      return "禁用中";
  }
}

const query = reactive({
  name: null,
  host: null,
  page: 1,
  size: 10
});

const nodeData = ref<NodeItem[]>([]);
const total = ref(0);
const getList = () => {
  getNodeList(query).then(res => {
    const code = res.data.code
    if (code != 0) {
      ElMessage.error(res.data.message);
      return false;
    }
    nodeData.value = res.data.data.list;
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
  query.name = null;
  query.host = null;
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
  type: null,
  host: null,
  port: null,
  username: null,
  password: null
});

const handleInsert = (row: any) => {
  insertForm.name = row.name;
  insertForm.description = row.description;
  insertForm.type = row.type;
  insertForm.host = row.host;
  insertForm.port = row.port;
  insertForm.username = row.username;
  insertForm.password = row.password;
  insertVisible.value = true;
};

const saveInsert = async () => {
  insertVisible.value = false;
  const res = await addNode(insertForm);

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
  const res = await deleteNode(id);
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
  type: null,
  host: null,
  port: null,
  username: null
});

const handleEdit = (row : any) => {
  editForm.id = row.id;
  editForm.name = row.name;
  editForm.description = row.description;
  editForm.type = codeToNodeType(row.type);
  editForm.host = row.host;
  editForm.port = row.port;
  editForm.username = row.username;
  editVisible.value = true;
};

const saveEdit = async () => {
  editVisible.value = false;

  editForm.type = nodeTypeToCode(editForm.type);
  const res = await updateNode(editForm.id, editForm);

  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("编辑成功");
    await getList(); // 等待getList()执行完再继续
  }
};

//const isButtonActive = ref(false);
// const isButtonActive = ref(JSON.parse(localStorage.getItem('isButtonActive')) || false);
//
// const buttonText = computed(() => {
//   return isButtonActive.value ? '禁用' : '启用';
// });
//
// const handleButtonClick = (index: number) => {
//   if (isButtonActive.value) {
//     // 执行停止操作
//     disableAction(nodeData.value[index].id);
//   } else {
//     // 执行启动操作
//     enableAction(nodeData.value[index].id);
//   }
//   isButtonActive.value = !isButtonActive.value;
//   localStorage.setItem('isButtonActive', JSON.stringify(isButtonActive.value));
// };

const enableAction = async (id: number) => {
  // 启动操作的代码
  const res = await enableNode(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("启用成功");
  }
  await getList(); // 等待getList()执行完再继续
};

const disableAction = async (id: number) => {
  // 停止操作的代码
  const res = await disableNode(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("禁用成功");
    await getList(); // 等待getList()执行完再继续
  }
};

const syncAction = async (nodeId: number) => {
  const res = await syncNode(nodeId);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("同步成功");
    await getList(); // 等待getList()执行完再继续
  }
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
