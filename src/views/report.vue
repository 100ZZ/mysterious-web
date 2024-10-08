<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.name" placeholder="报告名称" class="handle-input mr10"></el-input>
        <el-input v-model="query.testCaseId" placeholder="用例" class="handle-input mr10"></el-input>


        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Refresh" @click="handleReset">重置</el-button>
      </div>

      <el-table :data="reportData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="编号" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="description" label="描述" align="center"></el-table-column>
        <el-table-column prop="testCaseId" label="用例" align="center">
          <template #default="scope">
            <span @click="handleTestCaseClick(scope.row.testCaseId)" style="cursor: pointer; color: blue;">{{ scope.row.testCaseId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="execType" label="类型" align="center">
          <template #default="scope">
<!--            <el-tag v-if="scope.row.execType === 1" type="primary">调试</el-tag>-->
<!--            <el-tag v-if="scope.row.execType === 2" type="danger">压测</el-tag>-->
            <el-tag
                v-if="scope.row.execType === 1"
                class="exec-type-debug"
            >调试
            </el-tag>
            <el-tag
                v-if="scope.row.execType === 2"
                class="exec-type-load"
            >压测
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" class="status-not-executed">没有执行</el-tag>
            <el-tag v-if="scope.row.status === 1" class="status-executing">正在执行</el-tag>
            <el-tag v-if="scope.row.status === 2" class="status-success">执行成功</el-tag>
            <el-tag v-if="scope.row.status === 3" class="status-error">执行异常</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="responseData" label="结果" align="center"></el-table-column>
        <el-table-column prop="creator" label="创建人" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
<!--        <el-table-column prop="modifier" label="修改人" align="center"></el-table-column>-->
<!--        <el-table-column prop="modifyTime" label="修改时间" align="center"></el-table-column>-->

        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-row type="flex" justify="center">
              <el-col :span="12">
                <el-button style="margin-left: 0" text :icon="Top" class="bg-blue" @click="handleViewReport(scope.row.id)" v-permiss="1">
                  预览
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button style="margin-left: 0" text :icon="Download" class="bg-blue" @click="handleDownload(scope.row.id)" v-permiss="1">
                  下载
                </el-button>
              </el-col>
            </el-row>
            <el-row type="flex" justify="center">
              <el-col :span="12">
                <el-button style="margin-left: 0" text :icon="Search" class="bg-blue" @click="drawer = true,handleJMeterLog(scope.row.id)" v-permiss="1">
                  日志
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button style="margin-left: 0" text :icon="Delete" class="red" @click="handleDelete(scope.row.id)" v-permiss="1">
                  删除
                </el-button>
              </el-col>
            </el-row>
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

    <!--    抽屉查看日志-->
    <el-drawer v-model="drawer" title="jmeter.log日志" :show-close="true" :with-header="true" :size="'60%'">
      <pre><div v-text="jmxLog"></div></pre>
    </el-drawer>

  </div>
</template>

<script setup lang="ts" name="baseJmx">
import {ref, reactive, computed} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import { Download, Search, Delete, Edit, Refresh, Top } from '@element-plus/icons-vue';
import {cleanReport, downloadReport, getLog, getReportList, viewReport} from "../api/report";
import {checkToLogin, handleTestCaseClick} from "../common/push";
import {useRoute} from "vue-router";
import router from "../router";

const drawer = ref(false);

interface ReportItem {
  id: number;
  name: string;
  description: string;
  testCaseId: number;
  execType: number;
  status: number;
  responseData: string;
  creator: string;
  modifier: string;
  createTime: string;
  modifyTime: string;
}

const route = useRoute();

const query = reactive({
  name: route.query.name || null,          // 获取传递的name参数
  testCaseId: route.query.testCaseId || null,  // 获取传递的testCaseId参数
  page: 1,
  size: 10
});

const reportData = ref<ReportItem[]>([]);
const total = ref(0);
const getList = () => {
  getReportList(query).then(res => {
    checkToLogin(res.data.message);
    const code = res.data.code
    if (code != 0) {
      ElMessage.error(res.data.message);
      return false;
    }
    reportData.value = res.data.data.list;
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
  query.name = null;
  query.testCaseId = null;
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
  if (!res.success) {
    ElMessage.error("下载失败, 请重试");
  }
}

// 查看报告
const handleViewReport = async (id: number) => {
  const res = await viewReport(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    window.open(res.data.data, '_blank');
  }
}

// 查看日志
const jmxLog = ref('');
const handleJMeterLog = async (id: number) => {
  const res = await getLog(id);
  console.log("res: ", res);
  jmxLog.value = res.data;
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

.status-not-executed {
  background-color: #909399 !important;
  color: #FFFFFF !important;
  border-color: #909399 !important;
}

.status-executing {
  background-color: #E6A23C !important;
  color: #FFFFFF !important;
  border-color: #E6A23C !important;
}

.status-success {
  background-color: #67C23A !important;
  color: #FFFFFF !important;
  border-color: #67C23A !important;
}

.status-error {
  background-color: #F56C6C !important;
  color: #FFFFFF !important;
  border-color: #F56C6C !important;
}

/* 调试类型样式 */
.exec-type-debug {
  background-color: #B3E5FC; /* 浅蓝色背景 */
  color: #0277BD; /* 深蓝色文字 */
  //padding: 4px 8px; /* 内边距 */
  //border-radius: 4px; /* 圆角 */
  //display: flex; /* 使用 flexbox */
  align-items: center; /* 垂直居中 */
  font-weight: 500; /* 字体加粗 */
}

/* 压测类型样式 */
.exec-type-load {
  background-color: #FFE0B2; /* 浅橙色背景 */
  color: #EF6C00; /* 深橙色文字 */
  //padding: 4px 8px; /* 内边距 */
  //border-radius: 4px; /* 圆角 */
  //display: flex; /* 使用 flexbox */
  align-items: center; /* 垂直居中 */
  font-weight: 500; /* 字体加粗 */
}

/* 去除边框 */
.el-tag {
  border: none !important; /* 强制去除边框 */
}


</style>
