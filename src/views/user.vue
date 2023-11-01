<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.username" placeholder="用户" class="handle-input mr10"></el-input>
        <el-input v-model="query.realName" placeholder="姓名" class="handle-input mr10"></el-input>

        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Refresh" @click="handleReset">重置</el-button>
        <el-button type="primary" :icon="Plus" @click="handleInsert">新增</el-button>
      </div>

      <el-table :data="userData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="username" label="用户"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column prop="realName" label="姓名"></el-table-column>
        <el-table-column prop="effectTime" label="生效时间"></el-table-column>
        <el-table-column prop="expireTime" label="失效时间"></el-table-column>

        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
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
        <el-form-item label="用户">
          <el-input v-model="insertForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="insertForm.password"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="insertForm.realName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="insertVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveInsert">确 定</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="baseUser">
import { ref, reactive } from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import { Plus, Search, Delete, Refresh } from '@element-plus/icons-vue';
import {addUser, deleteUser, getUserList} from "../api/user";

interface UserItem {
  id: number;
  username: string;
  password: string;
  realName: string;
  effectTime: string;
  expireTime: string;
}

const query = reactive({
  username: null,
  realName: null,
  page: 1,
  size: 10
});

const userData = ref<UserItem[]>([]);
const total = ref(0);
const getList = () => {
  getUserList(query).then(res => {
    const code = res.data.code
    if (code != 0) {
      ElMessage.error(res.data.message);
      return false;
    }
    userData.value = res.data.data.list;
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
  query.realName = null;
  query.username = null;
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
  username: null,
  password: null,
  realName: null
});

const handleInsert = (row: any) => {
  insertForm.username = row.username;
  insertForm.password = row.password;
  insertForm.realName = row.realName;
  insertVisible.value = true;
};

const saveInsert = async () => {
  insertVisible.value = false;
  const res = await addUser(insertForm);

  const code = res.data.code;
  if (code !== 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("新增成功");
    await getList(); // 等待getList()执行完再继续
  }
};

// const saveInsert = () => {
//   insertVisible.value = false;
//   addUser(insertForm).then(res => {
//     const code = res.data.code;
//     if (code !== 0) {
//       ElMessage.error(res.data.message);
//     } else {
//       ElMessage.success("新增成功");
//       getList(); // 等待getList()执行完再继续
//     }
//   })
// };

// 删除操作
const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  });
  const res = await deleteUser(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("删除成功");
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
