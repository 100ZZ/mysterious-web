<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.name" placeholder="报告名称" class="handle-input mr10"></el-input>

        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Refresh" @click="handleReset">重置</el-button>
      </div>

      <el-table :data="reportData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="报告名称"></el-table-column>
        <el-table-column prop="description" label="报告描述"></el-table-column>
        <el-table-column prop="testCaseId" label="用例ID"></el-table-column>
        <el-table-column prop="execType" label="执行类型"></el-table-column>
        <el-table-column prop="responseData" label="执行结果"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="modifier" label="修改人"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间"></el-table-column>

        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button style="margin-left: 0" text :icon="Search" class="green" @click="handleJMeterLog(scope.row.id)" v-permiss="1">
              查看日志
            </el-button>
            <el-button style="margin-left: 0" text :icon="Download" class="blue" @click="handleDownload(scope.row.id)" v-permiss="1">
              报告下载
            </el-button>
            <el-button style="margin-left: 0" text :icon="Top" class="purple" @click="handleViewReport(scope.row.id)" v-permiss="1">
              报告预览
            </el-button>
            <el-button style="margin-left: 0" text :icon="Delete" class="red" @click="handleDelete(scope.row.id)" v-permiss="1">
              删除报告
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
import { Download, Search, Delete, Edit, Refresh, Top } from '@element-plus/icons-vue';
import {cleanReport, downloadReport, getLog, getReportList, viewReport} from "../api/report";

interface ReportItem {
  id: number;
  name: string;
  description: string;
  testCaseId: number;
  execType: number;
  responseData: string;
  creator: string;
  modifier: string;
  createTime: string;
  modifyTime: string;
}

const query = reactive({
  name: null,
  page: 1,
  size: 10
});

const reportData = ref<ReportItem[]>([]);
const total = ref(0);
const getList = () => {
  getReportList(query).then(res => {
    const code = res.data.code
    if (code != 0) {
      ElMessage.error(res.data.message);
      return false;
    }
    reportData.value = res.data.data.list;
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
  getList();
};

// 分页导航
const handlePageChange = (val: number) => {
  query.page = val;
  getList();
};

// 删除操作
const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  });
  const res = await cleanReport(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("删除成功");
    await getList(); // 等待getList()执行完再继续
  }
};

// 报告下载
const handleDownload = async (id: number) => {
  const res = await downloadReport(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  }
}

// 查看报告
const handleViewReport = async (id: number) => {
  const res = await viewReport(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  }
  window.open(res.data.data, '_blank');
}

// 查看日志
const handleJMeterLog = async (id: number) => {
  const res = await getLog(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
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
.purple {
  color: #7b68ee;
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
