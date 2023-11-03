<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.srcName" placeholder="数据名称" class="handle-input mr10"></el-input>
        <el-input v-model="query.testCaseId" placeholder="用例ID" class="handle-input mr10"></el-input>

        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Refresh" @click="handleReset">重置</el-button>
      </div>

      <el-table :data="csvData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="srcName" label="数据名称"></el-table-column>
        <el-table-column prop="description" label="数据描述"></el-table-column>
        <el-table-column prop="testCaseId" label="用例ID"></el-table-column>
        <el-table-column prop="csvDir" label="数据路径"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="modifier" label="修改人"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间"></el-table-column>

        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button style="margin-left: 0" text :icon="Search" class="green" @click="handleCsvView(scope.row.id)" v-permiss="1">
              预览
            </el-button>
            <el-button style="margin-left: 0" text :icon="Delete" class="red" @click="handleCsvDelete(scope.row.id)" v-permiss="1">
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
import {deleteCsv, downloadCsv, getCsvList} from "../api/csv";
import {CsvItem} from "../common/item";

const query = reactive({
  srcName: null,
  testCaseId: null,
  page: 1,
  size: 10
});

const csvData = ref<CsvItem[]>([]);
const total = ref(0);
const getList = () => {
  getCsvList(query).then(res => {
    const code = res.data.code
    if (code != 0) {
      ElMessage.error(res.data.message);
      return false;
    }
    csvData.value = res.data.data.list;
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
  query.srcName = null;
  query.testCaseId = null;
  getList();
};

// 分页导航
const handlePageChange = (val: number) => {
  query.page = val;
  getList();
};

// 删除操作
const handleCsvDelete = async (id: number) => {
  await ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  });
  const res = await deleteCsv(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("删除成功");
    await getList(); // 等待getList()执行完再继续
  }
};

// 预览操作
const handleCsvView = async (id: number) => {
  const res = await downloadCsv(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
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
