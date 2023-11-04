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
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
              <el-tag v-if="scope.row.status === 0" type="info">没有执行</el-tag>
              <el-tag v-if="scope.row.status === 1" type="warning">正在执行</el-tag>
              <el-tag v-if="scope.row.status === 2" type="success">执行成功</el-tag>
              <el-tag v-if="scope.row.status === 3" type="danger">执行异常</el-tag>
              <el-tag v-if="scope.row.status === 4" type="primary">排队等待</el-tag>
              <el-tag v-if="scope.row.status === 5" type="primary">排队取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="modifier" label="修改人"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间"></el-table-column>

        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button style="margin-left: 0" text :icon="Search" class="green" @click="drawer = true,handleFull(scope.row.id)" v-permiss="1">
              详情
            </el-button>
            <el-button style="margin-left: 0" text :icon="Edit" class="orange" @click="handleEdit(scope.row)" v-permiss="1">
              编辑
            </el-button>
            <el-dropdown class="group-status" trigger="click">
              <el-button style="margin-left: 0" text :icon="Right" class="purple" v-permiss="1">执行</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="debugAction(scope.row.id)">调试</el-dropdown-item>
                  <el-dropdown-item @click="startAction(scope.row.id)">压测</el-dropdown-item>
                  <el-dropdown-item @click="stopAction(scope.row.id)">停止</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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

<!--    抽屉展示详情-->
    <el-drawer v-model="drawer" title="用例详情" :show-close="true" :with-header="true" :size="'60%'">
      <el-divider>基础信息</el-divider>
      <el-descriptions direction="vertical" :column="3" border>
        <el-descriptions-item label="ID">{{testCaseFullData.id}}</el-descriptions-item>
        <el-descriptions-item label="名称">{{testCaseFullData.name}}</el-descriptions-item>
        <el-descriptions-item label="描述">{{testCaseFullData.description}}</el-descriptions-item>
        <el-descriptions-item label="业务线">{{testCaseFullData.biz}}</el-descriptions-item>
        <el-descriptions-item label="服务">{{testCaseFullData.service}}</el-descriptions-item>
        <el-descriptions-item label="版本号">{{testCaseFullData.version}}</el-descriptions-item>
      </el-descriptions>

      <el-divider>
<!--        <div>-->
<!--          <el-button text :icon="Upload" class="blue" @click="">上传JMX脚本文件</el-button>-->
<!--          <input type="file" ref="fileInput" style="display:none" @change="onFileChange">-->
<!--        </div>-->
        <!--            action="/mysterious/jmx/upload/{{testCaseFullData.id.toString()}}"-->

        <el-upload
            action=""
            :show-file-list="false"
            :http-request="handleJmxUpload"
            :on-success="handleJmxUploadSuccess"
        >
          <el-button text :icon="Upload" class="blue">上传JMX脚本文件</el-button>
        </el-upload>
      </el-divider>
      <el-table :data="jmxFullData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="55"></el-table-column>
        <el-table-column prop="dstName" label="名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="testCaseId" label="用例"></el-table-column>
        <el-table-column prop="jmxDir" label="路径"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button style="margin-left: 0" text :icon="Search" class="green" @click="handleJmxView(scope.row.id)" v-permiss="1">
              预览
            </el-button>
            <el-button style="margin-left: 0" text :icon="Delete" class="red" @click="handleJmxDelete(scope.row.id)" v-permiss="1">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-divider>
        <div>
          <el-button text :icon="Upload" class="blue" @click="">上传CSV数据文件</el-button>
        </div>
      </el-divider>
      <el-table :data="csvFullData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="55"></el-table-column>
        <el-table-column prop="dstName" label="名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="testCaseId" label="用例"></el-table-column>
        <el-table-column prop="csvDir" label="路径"></el-table-column>
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

      <el-divider>
        <div>
          <el-button text :icon="Upload" class="blue" @click="">上传JAR依赖文件</el-button>
        </div>
      </el-divider>
      <el-table :data="jarFullData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="55"></el-table-column>
        <el-table-column prop="dstName" label="名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="testCaseId" label="用例"></el-table-column>
        <el-table-column prop="jarDir" label="路径"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button style="margin-left: 0" text :icon="Delete" class="red" @click="handleJarDelete(scope.row.id)" v-permiss="1">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="baseTestCase">
import {ref, reactive} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import { Plus, Search, Delete, Edit, Refresh, Right, Upload } from '@element-plus/icons-vue';
import {
  addTestCase, debugTestCase,
  deleteTestCase, getFull,
  getTestCaseList,
  startTestCase,
  stopTestCase,
  updateTestCase
} from "../api/testcase";
import {CsvItem, JarItem, JmxItem} from "../common/item";
import {deleteCsv, downloadCsv} from "../api/csv";
import {deleteJmx, downloadJmx, uploadJmx} from "../api/jmx";
import {deleteJar} from "../api/jar";

const drawer = ref(false);

interface TestCaseItem {
  id: number;
  name: string;
  description: string;
  biz: number;
  service: string;
  version: string;
  status: number;
  testCaseDir: string;
  creator: string;
  modifier: string;
  createTime: string;
  modifyTime: string;
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

const handleEdit = (row: any) => {
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

const debugAction = async (id: number) => {
  const res = await debugTestCase(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("调试成功");
    await getList(); // 等待getList()执行完再继续
  }
}

const startAction = async (id: number) => {
  const res = await startTestCase(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("压测成功");
    await getList(); // 等待getList()执行完再继续
  }
}

const stopAction = async (id: number) => {
  const res = await stopTestCase(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("停止成功");
    await getList(); // 等待getList()执行完再继续
  }
}

//测试用例详情，包括了关联的jmx，csv，jar等
// 用例详情时弹窗
const fullVisible = ref(false);
interface TestCaseFullItem {
  id: number;
  name: string;
  description: string;
  biz: number;
  service: string;
  version: string;
  status: number;
  testCaseDir: string;
  jmxItem: JmxItem;
  csvItemList: CsvItem[];
  jarItemList: JarItem[];
}

const testCaseFullData = ref<TestCaseFullItem>({
  id: null,
  name: null,
  description: null,
  biz: null,
  service: null,
  version: null,
  status: null,
  testCaseDir: null,
  jmxItem: null,
  csvItemList: [],
  jarItemList: []
});
// const jmxFullData = ref<JmxItem>({
//   id: null,
//   srcName: null,
//   dstName: null,
//   description: null,
//   testCaseId: null,
//   jmxDir: null,
//   jmeterScriptType: null,
//   creator: null,
//   modifier: null,
//   createTime: null,
//   modifyTime: null
//  });
const jmxFullData = ref<JmxItem[]>([]);
const csvFullData = ref<CsvItem[]>([]);
const jarFullData = ref<JarItem[]>([]);

const handleFull = async (id: number) => {
  fullVisible.value = true;
  const res = await getFull(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
    return false;
  }
  testCaseFullData.value = res.data.data;
  jmxFullData.value[0] = res.data.data.jmxVO;
  csvFullData.value = res.data.data.csvVOList;
  jarFullData.value = res.data.data.jarVOList;
}

//删除csv
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

// 预览CSV
const handleCsvView = async (id: number) => {
  const res = await downloadCsv(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  }
};

// 删除JMX
const handleJmxDelete = async (id: number) => {
  await ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  });
  const res = await deleteJmx(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("删除成功");
    await getList(); // 等待getList()执行完再继续
  }
};

// 预览JMX
const handleJmxView = async (id: number) => {
  const res = await downloadJmx(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  }
};

// 删除JAR
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


//上传JMX
const handleJmxUpload = async (file) => {
  const testCaseId = testCaseFullData.value.id;
  console.log("testCaseId:", testCaseId);
  console.log("jmxFile:", file);
  const formData = new FormData();
  formData.append("jmxFile", file);
  const res = await uploadJmx(testCaseId, formData);
  console.log("res:", res);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  }
}

const handleJmxUploadSuccess = () => {
  console.log("success");
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
.drawer {
  width: 75%;
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
.orange {
  color: #ffA500;
}
.purple {
  color: #7b68ee;
}
.ant-drawer-header {
  display: none;
}
.test-case-descriptions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.test-case-descriptions-title {
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 700;
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
