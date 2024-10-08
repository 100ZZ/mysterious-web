<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.srcName" placeholder="依赖名称" class="handle-input mr10"></el-input>
        <el-input v-model="query.testCaseId" placeholder="用例" class="handle-input mr10">
        </el-input>

        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Refresh" @click="handleReset">重置</el-button>
      </div>

      <el-table :data="jarData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="编号" width="55" align="center"></el-table-column>
        <el-table-column prop="srcName" label="名称" align="center">
<!--          <template #default="scope">-->
<!--            <div @click="handleJarDownload(scope.row.id, scope.row.dstName)" style="color: blue; cursor: pointer;">{{ scope.row.dstName }}</div>-->
<!--          </template>-->
        </el-table-column>
        <el-table-column prop="description" label="描述" align="center"></el-table-column>
        <el-table-column prop="testCaseId" label="用例" align="center">
          <template #default="scope">
            <span @click="handleTestCaseClick(scope.row.testCaseId)" style="cursor: pointer; color: blue;">{{ scope.row.testCaseId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
<!--        <el-table-column prop="modifier" label="修改人" align="center"></el-table-column>-->
<!--        <el-table-column prop="modifyTime" label="修改时间" align="center"></el-table-column>-->

        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button style="margin-left: 0" text :icon="Delete" class="red" @click="handleJarDelete(scope.row.id)" v-permiss="1">
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

  </div>
</template>

<script setup lang="ts" name="baseJmx">
import {ref, reactive, computed} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import { Plus, Search, Delete, Edit, Refresh, Top } from '@element-plus/icons-vue';
import {deleteJar, downloadJar, getJarList} from "../api/jar";
import {JarItem} from "../common/item";
import {checkToLogin, handleTestCaseClick} from "../common/push";

const query = reactive({
  srcName: null,
  testCaseId: null,
  page: 1,
  size: 10
});

const jarData = ref<JarItem[]>([]);
const total = ref(0);
const getList = () => {
  getJarList(query).then(res => {
    checkToLogin(res.data.message);
    const code = res.data.code
    if (code != 0) {
      ElMessage.error(res.data.message);
      return false;
    }
    jarData.value = res.data.data.list;
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
  query.srcName = null;
  query.testCaseId = null;
  getList();
};

// 分页导航
const handlePageChange = (val: number) => {
  query.page = val;
  getList();
};

const handleJarDownload = async (id: number, jarName: string) => {
  if (!jarName) {
    ElMessage.error("jar依赖文件不存在");
    return;
  }
  const res = await downloadJar(id, jarName);
  if (!res.success) {
    ElMessage.error("下载失败, 请重试");
  }
}

// 删除操作
const handleJarDelete = async (id: number) => {
  await ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  });
  const res = await deleteJar(id);
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
