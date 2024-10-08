<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.id" placeholder="编号" class="handle-input mr10"></el-input>
        <el-input v-model="query.name" placeholder="名称" class="handle-input mr10"></el-input>
        <el-input v-model="query.biz" placeholder="产品线" class="handle-input mr10"></el-input>
        <el-input v-model="query.biz" placeholder="服务" class="handle-input mr10"></el-input>

        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Refresh" @click="handleReset">重置</el-button>
        <el-button type="primary" :icon="Plus" @click="handleInsert">新增</el-button>
      </div>

      <el-table :data="testCaseData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="编号" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="description" label="描述" align="center"></el-table-column>
        <el-table-column prop="biz" label="产品" align="center"></el-table-column>
        <el-table-column prop="service" label="服务" align="center"></el-table-column>
        <el-table-column prop="version" label="版本" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" class="status-not-executed">没有执行</el-tag>
            <el-tag v-if="scope.row.status === 1" class="status-executing">正在执行</el-tag>
            <el-tag v-if="scope.row.status === 2" class="status-success">执行成功</el-tag>
            <el-tag v-if="scope.row.status === 3" class="status-error">执行异常</el-tag>
            <el-tag v-if="scope.row.status === 4" class="status-waiting">排队等待</el-tag>
            <el-tag v-if="scope.row.status === 5" class="status-canceled">排队取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="modifier" label="修改人" align="center"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间" align="center"></el-table-column>

        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-row type="flex" justify="center">
              <el-col :span="12">
                <el-button style="margin-left: 0" text :icon="Search" class="bg-blue" @click="drawer = true, getFullTestCase(scope.row.id)" v-permiss="1">
                  详情
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button style="margin-left: 0" text :icon="Edit" class="bg-blue" @click="handleEdit(scope.row)" v-permiss="1">
                  编辑
                </el-button>
              </el-col>
            </el-row>
            <el-row type="flex" justify="center">
              <el-col :span="12">
<!--                <el-dropdown class="group-status" trigger="click">-->
<!--                  <el-button style="margin-left: 0" text :icon="Right" class="bg-blue" v-permiss="1">执行</el-button>-->
<!--                  <template #dropdown>-->
<!--                    <el-button-group>-->
<!--                      <el-button type="primary" @click="debugAction(scope.row.id)">调试</el-button>-->
<!--                      <el-button type="danger" @click="startAction(scope.row.id)">压测</el-button>-->
<!--                      <el-button type="info" @click="stopAction(scope.row.id)">停止</el-button>-->
<!--                    </el-button-group>-->
<!--                  </template>-->
<!--                </el-dropdown>-->
                <el-dropdown class="group-status" trigger="click">
                  <el-button style="margin-left: 0" text :icon="Right" class="bg-blue" v-permiss="1">执行</el-button>
                  <template #dropdown>
                    <el-dropdown-menu class="horizontal-dropdown-menu">
                      <el-dropdown-item :style="{ backgroundColor: '#3B82F6', color: '#FFFFFF' }" @click="debugAction(scope.row.id)">调试</el-dropdown-item>
                      <el-dropdown-item :style="{ backgroundColor: '#EF4444', color: '#FFFFFF' }" @click="startAction(scope.row.id)">压测</el-dropdown-item>
                      <el-dropdown-item :style="{ backgroundColor: '#909399', color: '#FFFFFF' }" @click="stopAction(scope.row.id)">停止</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>

              </el-col>
              <el-col :span="12">
                <el-button style="margin-left: 0" text :icon="Plus" class="bg-blue" @click="goReports(scope.row.id, scope.row.name)" v-permiss="1">
                  报告
                </el-button>
              </el-col>
            </el-row>
            <el-row type="flex" justify="center">
              <el-col :span="12">
                <el-button style="margin-left: 0" text :icon="Refresh" class="bg-blue" @click="openChartDialog(scope.row.id)" v-permiss="1">
                  曲线
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

    <!-- 新增弹出框 -->
    <el-dialog title="新增用例" v-model="insertVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="名称">
          <el-input v-model="insertForm.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="insertForm.description" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item label="产品线">
          <el-input v-model="insertForm.biz" placeholder="产品线"></el-input>
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
        <el-form-item label="编号">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="editForm.name" placeholder="名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.description" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item label="产品线">
          <el-input v-model="editForm.biz" placeholder="产品线"></el-input>
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
    <el-drawer v-model="drawer" title="用例详情" :show-close="true" :size="'80%'">
      <!-- 基础信息 -->
      <el-card shadow="hover" style="margin-bottom: 20px;">
<!--        <el-divider>基础信息</el-divider>-->
        <el-descriptions direction="vertical" :column="3" border>
          <el-descriptions-item label="编号" align="center">{{testCaseFullData.id}}</el-descriptions-item>
          <el-descriptions-item label="名称" align="center">{{testCaseFullData.name}}</el-descriptions-item>
          <el-descriptions-item label="描述" align="center">{{testCaseFullData.description}}</el-descriptions-item>
          <el-descriptions-item label="产品线" align="center">{{testCaseFullData.biz}}</el-descriptions-item>
          <el-descriptions-item label="服务" align="center">{{testCaseFullData.service}}</el-descriptions-item>
          <el-descriptions-item label="版本号" align="center">{{testCaseFullData.version}}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 关联JMX脚本 -->
      <el-card shadow="hover" style="margin-bottom: 20px;">
        <el-divider>
          <el-row :gutter="20" style="margin-bottom: 10px;">
            <el-col :span="12">
              <el-upload action="" :show-file-list="false" :http-request="handleJmxUpload">
                <el-button text :icon="Upload" class="blue">本地上传JMX脚本文件</el-button>
              </el-upload>
            </el-col>
            <el-col :span="12">
              <el-button text :icon="Edit" class="blue" @click="onlineDrawer = true,getOnlineJmxData(jmxFullData[0] ? jmxFullData[0].id : null)">在线编写JMX脚本文件(测试版)</el-button>
            </el-col>
          </el-row>
        </el-divider>
        <el-table :data="jmxFullData" border style="width: 100%">
          <el-table-column prop="id" label="编号" width="55" align="center"></el-table-column>
          <el-table-column prop="dstName" label="名称" align="center">
            <template #default="scope">
              <div @click="handleJmxDownload(scope.row.id, scope.row.dstName)" style="color: blue; cursor: pointer;">{{ scope.row.dstName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" align="center"></el-table-column>
          <el-table-column prop="testCaseId" label="用例" align="center"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <el-button text :icon="Search" class="bg-blue" @click="jmxDrawer = true,handleJmxView(scope.row.id)" v-permiss="1">预览</el-button>
              <el-button text :icon="Delete" class="red" @click="handleJmxDelete(scope.row.id)" v-permiss="1">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 关联CSV文件 -->
      <el-card shadow="hover" style="margin-bottom: 20px;">
        <el-divider>
          <el-upload action="" :show-file-list="false" :http-request="handleCsvUpload" style="margin-bottom: 10px;">
            <el-button text :icon="Upload" class="blue">本地上传CSV数据文件</el-button>
          </el-upload>
        </el-divider>
        <el-table :data="csvFullData" border style="width: 100%">
          <el-table-column prop="id" label="编号" width="55" align="center"></el-table-column>
          <el-table-column prop="dstName" label="名称" align="center">
            <template #default="scope">
              <div @click="handleCsvDownload(scope.row.id, scope.row.dstName)" style="color: blue; cursor: pointer;">{{ scope.row.dstName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" align="center"></el-table-column>
          <el-table-column prop="testCaseId" label="用例" align="center"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <el-button text :icon="Search" class="bg-blue" @click="csvDrawer = true,handleCsvView(scope.row.id)" v-permiss="1">预览</el-button>
              <el-button text :icon="Delete" class="red" @click="handleCsvDelete(scope.row.id)" v-permiss="1">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 关联JAR依赖 -->
      <el-card shadow="hover">
        <el-divider>
          <el-upload action="" :show-file-list="false" :http-request="handleJarUpload" style="margin-bottom: 10px;">
            <el-button text :icon="Upload" class="blue">本地上传JAR依赖文件</el-button>
          </el-upload>
        </el-divider>
        <el-table :data="jarFullData" border style="width: 100%">
          <el-table-column prop="id" label="编号" width="55" align="center"></el-table-column>
          <el-table-column prop="dstName" label="名称" align="center">
<!--            <template #default="scope">-->
<!--              <div @click="handleJarDownload(scope.row.id, scope.row.dstName)" style="color: blue; cursor: pointer;">{{ scope.row.dstName }}</div>-->
<!--            </template>-->
          </el-table-column>
          <el-table-column prop="description" label="描述" align="center"></el-table-column>
          <el-table-column prop="testCaseId" label="用例" align="center"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <el-button text :icon="Delete" class="red" @click="handleJarDelete(scope.row.id)" v-permiss="1">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-drawer>




    <!-- 子抽屉用于编辑 JMX 脚本 -->
    <el-drawer v-model="onlineDrawer" title="在线编写JMX脚本文件" :append-to-body="true" :size="'75%'">
      <!-- 基础信息 -->
      <el-form :model="onlineJmxItem" label-width="150px" label-position="top">
        <el-card shadow="hover" style="margin-bottom: 20px;">

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="脚本名称">
              <el-input v-model="onlineJmxItem.srcName" placeholder="请输入脚本名称, 以.jmx后缀结尾" :disabled="onlineJmxItem.id !== 0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="脚本描述">
              <el-input v-model="testCaseFullData.name" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用例">
              <el-input v-model="onlineJmxItem.testCaseId" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>


      <el-card shadow="hover" style="margin-bottom: 20px;">

        <el-divider>
          <el-radio-group v-model="jmeterThreadsType" @change="handleThreadGroupTypeChange">
            <el-radio label="threadGroup">ThreadGroup</el-radio>
            <el-radio label="steppingThreadGroup">SteppingThreadGroup</el-radio>
            <el-radio label="concurrencyThreadGroup">ConcurrencyThreadGroup</el-radio>
          </el-radio-group>
        </el-divider>

        <!-- 条件渲染不同的线程组输入框 -->
        <template v-if="jmeterThreadsType === 'threadGroup'">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Number of Threads (users)">
                <el-input v-model="onlineJmxItem.threadGroupVO.numThreads"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Ramp-Up Period (in seconds)">
                <el-input v-model="onlineJmxItem.threadGroupVO.rampTime"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Loop Count">
                <el-input v-model="onlineJmxItem.threadGroupVO.loops"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Same user on each iteration">
                <el-checkbox v-model="onlineJmxItem.threadGroupVO.sameUserOnNextIteration" @change="handleCheckboxChange('sameUserOnNextIteration', $event)"></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Delay Thread creation until needed">
                <el-checkbox v-model="onlineJmxItem.threadGroupVO.delayedStart" @change="handleCheckboxChange('delayedStart', $event)"></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Scheduler">
                <el-checkbox v-model="onlineJmxItem.threadGroupVO.scheduler" @change="handleCheckboxChange('scheduler', $event)"></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="16" v-if="onlineJmxItem.threadGroupVO.scheduler">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="Duration (seconds)">
                    <el-input v-model="onlineJmxItem.threadGroupVO.duration"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Startup Delay (seconds)">
                    <el-input v-model="onlineJmxItem.threadGroupVO.delay"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>

        <template v-if="jmeterThreadsType === 'steppingThreadGroup'">
          <!-- Stepping Thread Group 输入框调整 -->
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="This group will start">
                <el-input v-model="onlineJmxItem.steppingThreadGroupVO.numThreads"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="First, wait for">
                <el-input v-model="onlineJmxItem.steppingThreadGroupVO.firstWaitForSeconds"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Then start">
                <el-input v-model="onlineJmxItem.steppingThreadGroupVO.thenStartThreads"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Next, add threads">
                <el-input v-model="onlineJmxItem.steppingThreadGroupVO.nextAddThreads"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Every (seconds)">
                <el-input v-model="onlineJmxItem.steppingThreadGroupVO.nextAddThreadsEverySeconds"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Ramp-Up Time (seconds)">
                <el-input v-model="onlineJmxItem.steppingThreadGroupVO.usingRampUpSeconds"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Hold load for (seconds)">
                <el-input v-model="onlineJmxItem.steppingThreadGroupVO.thenHoldLoadForSeconds"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Finally, stop threads">
                <el-input v-model="onlineJmxItem.steppingThreadGroupVO.finallyStopThreads"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Every (seconds)">
                <el-input v-model="onlineJmxItem.steppingThreadGroupVO.finallyStopThreadsEverySeconds"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>


        <template v-if="jmeterThreadsType === 'concurrencyThreadGroup'">
          <!-- 这里根据 Concurrency Thread Group 的需求添加输入框 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Target Concurrency">
                <el-input v-model="onlineJmxItem.concurrencyThreadGroupVO.targetConcurrency"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Ramp-Up Time (seconds)">
                <el-input v-model="onlineJmxItem.concurrencyThreadGroupVO.rampUpTime"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Ramp-Up Steps Count">
                <el-input v-model="onlineJmxItem.concurrencyThreadGroupVO.rampUpStepsCount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Hold Target Rate Time (seconds)">
                <el-input v-model="onlineJmxItem.concurrencyThreadGroupVO.holdTargetRateTime"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        </el-card>

        <!-- Sample类型模块 -->
        <el-card shadow="hover">
        <el-divider>
          <el-radio-group v-model="jmeterSampleType" @change="handleRequestTypeChange">
            <el-radio label="http">HttpRequest</el-radio>
            <el-radio label="java">JavaRequest</el-radio>
            <el-radio label="dubbo">DubboRequest</el-radio>
          </el-radio-group>
        </el-divider>


        <template v-if="jmeterSampleType === 'http'">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Protocol">
                <el-select v-model="onlineJmxItem.httpVO.protocol">
                  <el-option label="HTTP" value="http"></el-option>
                  <el-option label="HTTPS" value="https"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Host">
                <el-input v-model="onlineJmxItem.httpVO.domain"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Port">
                <el-input v-model="onlineJmxItem.httpVO.port"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Method">
                <el-select v-model="onlineJmxItem.httpVO.method">
                  <el-option label="GET" value="GET"></el-option>
                  <el-option label="POST" value="POST"></el-option>
                  <el-option label="PUT" value="PUT"></el-option>
                  <el-option label="DELETE" value="DELETE"></el-option>
                  <el-option label="PATCH" value="PATCH"></el-option>
                  <el-option label="TRACE" value="TRACE"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Path">
                <el-input v-model="onlineJmxItem.httpVO.path"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Encoding">
                <el-input v-model="onlineJmxItem.httpVO.contentEncoding" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="Header" name="header">
              <el-table :data="onlineJmxItem.httpVO.httpHeaderVOList" border style="width: 100%">
                <el-table-column prop="key" label="Key" width="180" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.headerKey"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="value" label="Value" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.headerValue"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                  <template #default="scope">
                    <el-button text :icon="Delete" class="red" @click="handleHttpHeaderDelete(scope.$index)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" @click="handleHttpHeaderAdd">新增</el-button>
            </el-tab-pane>
            <el-tab-pane label="Param" name="param">
              <el-table :data="onlineJmxItem.httpVO.httpParamVOList" border style="width: 100%">
                <el-table-column prop="key" label="Key" width="180" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.paramKey" :disabled="isParamDisabled"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="value" label="Value" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.paramValue" :disabled="isParamDisabled"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                  <template #default="scope">
                    <el-button text :icon="Delete" class="red" @click="handleHttpParamDelete(scope.$index)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" @click="handleHttpParamAdd" :disabled="isParamDisabled">新增</el-button>
            </el-tab-pane>
            <el-tab-pane label="Body" name="body">
              <!--                <el-input type="textarea" v-model="onlineJmxItem.httpVO.body" :rows="10"></el-input>-->
              <el-input type="textarea" v-model="formattedJson" :rows="6" @blur="onJsonBlur" :disabled="isBodyDisabled"></el-input>
            </el-tab-pane>

            <el-tab-pane label="Assertion" name="assertion">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="Response Code">
                    <el-input
                        v-model="onlineJmxItem.assertionVO.responseCode"
                        size="small"
                        placeholder="请输入期望的响应状态码，等于关系"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Response Message">
                    <el-input
                        v-model="onlineJmxItem.assertionVO.responseMessage"
                        type="textarea"
                        rows="3"
                        placeholder="请输入期望的响应消息内容，包含关系"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="JSON Path">
                    <el-input
                        v-model="onlineJmxItem.assertionVO.jsonPath"
                        size="small"
                        placeholder="请输入要提取结果的JSON Path表达式，比如：$.success"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Expected Value">
                    <el-input
                        v-model="onlineJmxItem.assertionVO.expectedValue"
                        type="textarea"
                        rows="3"
                        placeholder="请输入通过JSON Path表达式提取的预期结果，比如：true"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>


          </el-tabs>
        </template>

        <template v-else-if="jmeterSampleType === 'java'">
          <el-form-item label="ClassPath">
            <el-input v-model="onlineJmxItem.javaVO.javaRequestClassPath"></el-input>
          </el-form-item>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="JavaParams" name="javaParams">
              <el-table :data="onlineJmxItem.javaVO.javaParamVOList" border style="width: 100%">
                <el-table-column prop="key" label="Key" width="180" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.paramKey"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="value" label="Value" align="center">
                  <template #default="scope">
                    <el-input v-model="scope.row.paramValue"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                  <template #default="scope">
                    <el-button text :icon="Delete" class="red" @click="handleJavaParamDelete(scope.$index)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" @click="handleJavaParamAdd">新增</el-button>
            </el-tab-pane>
          </el-tabs>
        </template>

        <template v-else-if="jmeterSampleType === 'dubbo'">
          <el-form-item>
            <el-input v-model="onlineJmxItem.dubboVO.message" :rows="10"></el-input>
          </el-form-item>
        </template>
        </el-card>
      </el-form>
      <el-button type="primary" @click="handleSave" style="margin-top: 20px;">保存</el-button>
    </el-drawer>

    <!--    抽屉展示详情-->
    <el-drawer v-model="jmxDrawer" title="脚本详情" :append-to-body="true" :size="'45%'">
      <pre><div v-text="jmxFile"></div></pre>
    </el-drawer>

    <!--    抽屉展示详情-->
    <el-drawer v-model="csvDrawer" title="数据详情" :append-to-body="true" :size="'45%'">
      <pre><div v-text="csvFile"></div></pre>
    </el-drawer>

    <!-- 曲线图弹出框 -->
    <el-dialog title="实时数据" v-model="chartDialogVisible" width="60%">
      <schart class="bar-schart" canvasId="throughputChart" :options="throughputChart"></schart>
      <schart class="bar-schart" canvasId="responseTimeChart" :options="responseTimeChart"></schart>

    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="baseTestCase">
import Schart from 'vue-schart';
import {ref, reactive, onUnmounted, onMounted, watch, computed} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import { Plus, Search, Delete, Edit, Refresh, Right, Upload } from '@element-plus/icons-vue';
import {
  addTestCase, debugTestCase,
  deleteTestCase, getFull, getResult,
  getTestCaseList,
  startTestCase,
  stopTestCase,
  updateTestCase
} from "../api/testcase";
import {CsvItem, JarItem, JmxItem} from "../common/item";
import {deleteCsv, viewCsv, uploadCsv, downloadCsv} from "../api/csv";
import {addOnlineJmx, deleteJmx, viewJmx, getOnlineJmx, updateOnlineJmx, uploadJmx, downloadJmx} from "../api/jmx";
import {deleteJar, downloadJar, uploadJar} from "../api/jar";
import router from "../router";
import {checkToLogin} from "../common/push";
import {useRoute} from "vue-router";

const drawer = ref(false);
const jmxDrawer = ref(false)
const csvDrawer = ref(false)
const onlineDrawer = ref(false)

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

const route = useRoute();

const query = reactive({
  id: route.query.id || null,  // 获取传递的testCaseId参数
  name: null,
  biz: null,
  service: null,
  page: 1,
  size: 10
});


// 定义 formattedJson
const formattedJson = ref('');

// 格式化 JSON 的方法
const formatJson = (body: string) => {
  try {
    const jsonObject = JSON.parse(body);
    return JSON.stringify(jsonObject, null, 2);
  } catch {
    // 如果 JSON 解析失败，则返回空字符串或原始数据
    return body;
  }
};

// 处理 blur 事件，在输入框失去焦点时进行 JSON 解析
const onJsonBlur = (event: Event) => {
  const input = event.target as HTMLTextAreaElement;
  // 格式化后的 JSON 显示在输入框中
  formattedJson.value = formatJson(input.value);
  // 更新 onlineJmxItem 的 body 数据
  onlineJmxItem.value.httpVO.body = formattedJson.value;
};

// 使用 onMounted 来确保 onlineJmxItem 初始化后再设置 watch
onMounted(() => {
  // 初始化时同步 body 和 formattedJson 的值
  watch(() => onlineJmxItem.value.httpVO.body, (newBody) => {
    formattedJson.value = formatJson(newBody || '');
  }, { immediate: true });
});


// 监听 Param 是否有输入
const isParamDisabled = computed(() => {
  return onlineJmxItem.value.httpVO.body !== '';
});

// 监听 Body 是否有输入
const isBodyDisabled = computed(() => {
  return onlineJmxItem.value.httpVO.httpParamVOList.some(item => item.paramKey || item.paramValue);
});

const testCaseData = ref<TestCaseItem[]>([]);
const total = ref(0);
const getList = () => {
  getTestCaseList(query).then(res => {
    checkToLogin(res.data.message);
    const code = res.data.code
    if (code != 0) {
      ElMessage.error(res.data.message);
      return false;
    }
    testCaseData.value = res.data.data.list;
    total.value = res.data.data.total || 10;
  });
};

// 定时刷新数据
let interval: ReturnType<typeof setInterval>;
onMounted(() => {
  getList(); // 页面加载时获取一次数据
  interval = setInterval(getList, 10000); // 每10秒刷新一次
});

onUnmounted(() => {
  clearInterval(interval); // 页面卸载时清除定时器
});

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
  const res = await addTestCase(insertForm);

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
  const res = await updateTestCase(editForm.id, editForm);

  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("编辑成功");
    editVisible.value = false;
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

const getFullTestCase = async (id: number) => {
  fullVisible.value = true;
  const res = await getFull(id);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
    return false;
  }
  const fullData = res.data.data;
  testCaseFullData.value = fullData;
  //jmxFullData.value[0] = res.data.data.jmxVO;
  // 检查 jmxVO 是否为 null，如果是则将 jmxFullData 设置为空数组
  if (fullData.jmxVO === null) {
    jmxFullData.value = [];
  } else {
    jmxFullData.value[0] = fullData.jmxVO;
  }
  csvFullData.value = fullData.csvVOList;
  jarFullData.value = fullData.jarVOList;
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
    await getFullTestCase(testCaseFullData.value.id);
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
    await getFullTestCase(testCaseFullData.value.id);
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
    await getFullTestCase(testCaseFullData.value.id);
  }
};


//上传JMX
const handleJmxUpload = async (uploadRequestOptions) => {
  const testCaseId = testCaseFullData.value.id;
  const formData = new FormData();
  formData.append("jmxFile", uploadRequestOptions.file);
  const res = await uploadJmx(testCaseId, formData);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("上传成功");
    await getFullTestCase(testCaseId);
  }
}

//上传CSV
const handleCsvUpload = async (uploadRequestOptions) => {
  const testCaseId = testCaseFullData.value.id;
  const formData = new FormData();
  formData.append("csvFile", uploadRequestOptions.file);
  const res = await uploadCsv(testCaseId, formData);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("上传成功");
    await getFullTestCase(testCaseId);
  }
}

//上传JAR
const handleJarUpload = async (uploadRequestOptions) => {
  const testCaseId = testCaseFullData.value.id;
  const formData = new FormData();
  formData.append("jarFile", uploadRequestOptions.file);
  const res = await uploadJar(testCaseId, formData);
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("上传成功");
    await getFullTestCase(testCaseId);
  }
}


const handleJmxDownload = async (id: number, jmxName: string) => {
  if (!jmxName) {
    ElMessage.error("jmx脚本文件不存在");
    return;
  }
  const res = await downloadJmx(id, jmxName);
  if (!res.success) {
    ElMessage.error("下载失败, 请重试");
  }
}

const handleCsvDownload = async (id: number, csvName: string) => {
  if (!csvName) {
    ElMessage.error("csv数据文件不存在");
    return;
  }
  const res = await downloadCsv(id, csvName);
  if (!res.success) {
    ElMessage.error("下载失败, 请重试");
  }
}

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

// 预览jmx
const jmxFile = ref('');
const handleJmxView = async (id: number) => {
  const res = await viewJmx(id);
  jmxFile.value = res.data;
};

// 预览csv
const csvFile = ref('');
const handleCsvView = async (id: number) => {
  const res = await viewCsv(id);
  csvFile.value = res.data;
};


// const goReports = () => {
//   router.push({path:'/report'})
// }

const goReports = (testCaseId, name) => {
  router.push({
    path: '/report',
    query: {
      testCaseId: testCaseId,
      name: name
    }
  });
}


interface ThreadGroupVO {
  id: number;
  testCaseId: number;
  jmxId: number;
  numThreads: string;
  rampTime: string;
  loops: string;
  sameUserOnNextIteration: boolean; //  1：true，0：false
  delayedStart: boolean;
  scheduler: boolean;
  duration: string;
  delay: string;
}

interface SteppingThreadGroupVO {
  id: number;
  testCaseId: number;
  jmxId: number;
  numThreads: string;
  firstWaitForSeconds: string;
  thenStartThreads: string;
  nextAddThreads: string;
  nextAddThreadsEverySeconds: string;
  usingRampUpSeconds: string;
  thenHoldLoadForSeconds: string;
  finallyStopThreads: string;
  finallyStopThreadsEverySeconds: string;
}

interface ConcurrencyThreadGroupVO {
  id: number;
  testCaseId: number;
  jmxId: number;
  targetConcurrency: string;
  rampUpTime: string;
  rampUpStepsCount: string;
  holdTargetRateTime: string;
}

interface HttpVO {
  id: number;
  testCaseId: number;
  jmxId: number;
  protocol: string;
  domain: string;
  port: string;
  method: string;
  path: string;
  contentEncoding: string;
  httpHeaderVOList: HttpHeaderVO[];
  httpParamVOList: HttpParamVO[];
  body: string;
}

// 在线编辑
interface HttpHeaderVO {
  id: number;
  testCaseId: number;
  jmxId: number;
  httpId: number;
  headerKey: string;
  headerValue: string;
}

interface HttpParamVO {
  id: number;
  testCaseId: number;
  jmxId: number;
  httpId: number;
  paramKey: string;
  paramValue: string;
}

interface JavaVO {
  id: number;
  testCaseId: number;
  jmxId: number;
  javaRequestClassPath: string;
  javaParamVOList: JavaParamVO[];
}

interface JavaParamVO {
  id: number;
  testCaseId: number;
  jmxId: number;
  javaId: number;
  paramKey: string;
  paramValue: string;
}

interface DubboVO {
  id: number;
  testCaseId: number;
  jmxId: number;
  message: string;
}

interface AssertionVO {
  id: number;
  testCaseId: number;
  jmxId: number;
  responseCode: string;
  responseMessage: string;
  jsonPath: string;
  expectedValue: string;
}

interface OnlineJmxItem {
  id: number;
  srcName: string;
  dstName: string;
  testCaseId: number;
  jmxDir: string;
  jmeterScriptType: number;
  jmeterThreadsType: number;
  jmeterSampleType: number;
  threadGroupVO: ThreadGroupVO;
  steppingThreadGroupVO: SteppingThreadGroupVO;
  concurrencyThreadGroupVO: ConcurrencyThreadGroupVO;
  httpVO: HttpVO;
  javaVO: JavaVO;
  dubboVO: DubboVO;
  assertionVO: AssertionVO;
}

const jmeterThreadsType = ref('threadGroup'); // 默认为 Thread Group
const jmeterSampleType = ref('http');
const activeTab = ref('header');
const onlineJmxItem = ref<OnlineJmxItem>({
  id: 0,
  srcName: '',
  dstName: '',
  testCaseId: 0,
  jmxDir: '',
  jmeterScriptType: 1,
  jmeterThreadsType: 0,
  jmeterSampleType: 0,
  threadGroupVO: {
    id: 0,
    testCaseId: 0,
    jmxId: 0,
    numThreads: '1',
    rampTime: '0',
    loops: '-1',
    sameUserOnNextIteration: true,
    delayedStart: false,
    scheduler: true,
    duration: '300',
    delay: '0'
  },
  steppingThreadGroupVO: {
    id: 0,
    testCaseId: 0,
    jmxId: 0,
    numThreads: '20',
    firstWaitForSeconds: '0',
    thenStartThreads: '0',
    nextAddThreads: '2',
    nextAddThreadsEverySeconds: '30',
    usingRampUpSeconds: '5',
    thenHoldLoadForSeconds: '300',
    finallyStopThreads: '5',
    finallyStopThreadsEverySeconds: '1'
  },
  concurrencyThreadGroupVO: {
    id: 0,
    testCaseId: 0,
    jmxId: 0,
    targetConcurrency: '20',
    rampUpTime: '300',
    rampUpStepsCount: '10',
    holdTargetRateTime: '300'
  },
  httpVO: {
    id: 0,
    testCaseId: 0,
    jmxId: 0,
    protocol: 'http',
    domain: '',
    port: '',
    method: 'GET',
    path: '',
    contentEncoding: 'UTF-8',
    httpHeaderVOList: [{ id: 0, testCaseId: 0, jmxId: 0, httpId: 0, headerKey: '', headerValue: '' }],
    httpParamVOList: [{ id: 0, testCaseId: 0, jmxId: 0, httpId: 0, paramKey: '', paramValue: '' }],
    body: ''
  },
  javaVO: {
    id: 0,
    testCaseId: 0,
    jmxId: 0,
    javaRequestClassPath: '',
    javaParamVOList: [{ id: 0, testCaseId: 0, jmxId: 0, javaId: 0, paramKey: '', paramValue: '' }]
  },
  dubboVO: {
    id: 0,
    testCaseId: 0,
    jmxId: 0,
    message: '',
  },
  assertionVO: {
    id: 0,
    testCaseId: 0,
    jmxId: 0,
    responseCode: '',
    responseMessage: '',
    jsonPath: '',
    expectedValue: ''
  }
});

const getOnlineJmxData = async (id: number | null) => {
  onlineDrawer.value = true;

  // 重置 onlineJmxItem 的状态
  onlineJmxItem.value = {
    id: 0,
    srcName: '',
    dstName: '',
    testCaseId: testCaseFullData.value.id, // 假设 testCaseFullData 中包含当前用例的 id
    jmxDir: '',
    jmeterScriptType: 1,
    jmeterThreadsType: 0,
    jmeterSampleType: 0,
    threadGroupVO: {
      id: 0,
      testCaseId: 0,
      jmxId: 0,
      numThreads: '1',
      rampTime: '0',
      loops: '-1',
      sameUserOnNextIteration: true,
      delayedStart: false,
      scheduler: true,
      duration: '300',
      delay: '0'
    },
    steppingThreadGroupVO: {
      id: 0,
      testCaseId: 0,
      jmxId: 0,
      numThreads: '20',
      firstWaitForSeconds: '0',
      thenStartThreads: '0',
      nextAddThreads: '2',
      nextAddThreadsEverySeconds: '30',
      usingRampUpSeconds: '5',
      thenHoldLoadForSeconds: '300',
      finallyStopThreads: '5',
      finallyStopThreadsEverySeconds: '1'
    },
    concurrencyThreadGroupVO: {
      id: 0,
      testCaseId: 0,
      jmxId: 0,
      targetConcurrency: '20',
      rampUpTime: '300',
      rampUpStepsCount: '10',
      holdTargetRateTime: '300'
    },
    httpVO: {
      id: 0,
      testCaseId: 0,
      jmxId: 0,
      protocol: 'http',
      domain: '',
      port: '',
      method: 'GET',
      path: '',
      contentEncoding: 'UTF-8',
      httpHeaderVOList: [{ id: 0, testCaseId: 0, jmxId: 0, httpId: 0, headerKey: '', headerValue: '' }],
      httpParamVOList: [{ id: 0, testCaseId: 0, jmxId: 0, httpId: 0, paramKey: '', paramValue: '' }],
      body: ''
    },
    javaVO: {
      id: 0,
      testCaseId: 0,
      jmxId: 0,
      javaRequestClassPath: '',
      javaParamVOList: [{ id: 0, testCaseId: 0, jmxId: 0, javaId: 0, paramKey: '', paramValue: '' }]
    },
    dubboVO: {
      id: 0,
      testCaseId: 0,
      jmxId: 0,
      message: '',
    },
    assertionVO: {
      id: 0,
      testCaseId: 0,
      jmxId: 0,
      responseCode: '',
      responseMessage: '',
      jsonPath: '',
      expectedValue: ''
    }
  };

  if (id) {
    // 如果传入了 id，则调用获取数据操作
    const res = await getOnlineJmx(id);
    const code = res.data.code;
    if (code != 0) {
      ElMessage.error(res.data.message);
      onlineDrawer.value = false;
      return false;
    }

    const onlineJmxData = res.data.data;

    // 判断 jmeterScriptType
    if (onlineJmxData.jmeterScriptType !== 1) {
      ElMessage.warning("只支持在线编写的脚本");
      return false;
    }

    // 设置 onlineJmxItem 的值
    onlineJmxItem.value = {
      id: onlineJmxData.id,
      srcName: onlineJmxData.srcName,
      dstName: onlineJmxData.srcName,
      testCaseId: onlineJmxData.testCaseId,
      jmxDir: onlineJmxData.jmxDir,
      jmeterScriptType: onlineJmxData.jmeterScriptType,
      jmeterThreadsType: onlineJmxData.jmeterThreadsType,
      jmeterSampleType: onlineJmxData.jmeterSampleType,
      threadGroupVO: {
        id: onlineJmxData.threadGroupVO?.id || 0,
        testCaseId: onlineJmxData.threadGroupVO?.testCaseId || 0,
        jmxId: onlineJmxData.threadGroupVO?.jmxId || 0,
        numThreads: onlineJmxData.threadGroupVO?.numThreads || '1',
        rampTime: onlineJmxData.threadGroupVO?.rampTime || '0',
        loops: onlineJmxData.threadGroupVO?.loops || '-1',
        sameUserOnNextIteration: numberToBoolean(onlineJmxData.threadGroupVO?.sameUserOnNextIteration || 0),
        delayedStart: numberToBoolean(onlineJmxData.threadGroupVO?.delayedStart || 0),
        scheduler: numberToBoolean(onlineJmxData.threadGroupVO?.scheduler || 0),
        duration: onlineJmxData.threadGroupVO?.duration || '300',
        delay: onlineJmxData.threadGroupVO?.delay || '0'
      },
      steppingThreadGroupVO: {
        id: onlineJmxData.steppingThreadGroupVO?.id || 0,
        testCaseId: onlineJmxData.steppingThreadGroupVO?.testCaseId || 0,
        jmxId: onlineJmxData.steppingThreadGroupVO?.jmxId || 0,
        numThreads: onlineJmxData.steppingThreadGroupVO?.numThreads || '20',
        firstWaitForSeconds: onlineJmxData.steppingThreadGroupVO?.firstWaitForSeconds || '0',
        thenStartThreads: onlineJmxData.steppingThreadGroupVO?.thenStartThreads || '0',
        nextAddThreads: onlineJmxData.steppingThreadGroupVO?.nextAddThreads || '2',
        nextAddThreadsEverySeconds: onlineJmxData.steppingThreadGroupVO?.nextAddThreadsEverySeconds || '30',
        usingRampUpSeconds: onlineJmxData.steppingThreadGroupVO?.usingRampUpSeconds || '5',
        thenHoldLoadForSeconds: onlineJmxData.steppingThreadGroupVO?.thenHoldLoadForSeconds || '300',
        finallyStopThreads: onlineJmxData.steppingThreadGroupVO?.finallyStopThreads || '5',
        finallyStopThreadsEverySeconds: onlineJmxData.steppingThreadGroupVO?.finallyStopThreadsEverySeconds || '1'
      },
      concurrencyThreadGroupVO: {
        id: onlineJmxData.concurrencyThreadGroupVO?.id || 0,
        testCaseId: onlineJmxData.concurrencyThreadGroupVO?.testCaseId || 0,
        jmxId: onlineJmxData.concurrencyThreadGroupVO?.jmxId || 0,
        targetConcurrency: onlineJmxData.concurrencyThreadGroupVO?.targetConcurrency || '20',
        rampUpTime: onlineJmxData.concurrencyThreadGroupVO?.rampUpTime || '300',
        rampUpStepsCount: onlineJmxData.concurrencyThreadGroupVO?.rampUpStepsCount || '10',
        holdTargetRateTime: onlineJmxData.concurrencyThreadGroupVO?.holdTargetRateTime || '300'
      },
      httpVO: {
        id: onlineJmxData.httpVO?.id || 0,
        testCaseId: onlineJmxData.httpVO?.testCaseId || 0,
        jmxId: onlineJmxData.httpVO?.jmxId || 0,
        protocol: onlineJmxData.httpVO?.protocol || 'http',
        domain: onlineJmxData.httpVO?.domain || '',
        port: onlineJmxData.httpVO?.port || '',
        method: onlineJmxData.httpVO?.method || 'GET',
        path: onlineJmxData.httpVO?.path || '',
        contentEncoding: onlineJmxData.httpVO?.contentEncoding || 'UTF-8',
        httpHeaderVOList: (onlineJmxData.httpVO?.httpHeaderVOList || []).map(h => ({
          id: h.id || 0,
          testCaseId: h.testCaseId || 0,
          jmxId: h.jmxId || 0,
          httpId: h.httpId || 0,
          headerKey: h.headerKey || '',
          headerValue: h.headerValue || ''
        })),
        httpParamVOList: (onlineJmxData.httpVO?.httpParamVOList || []).map(p => ({
          id: p.id || 0,
          testCaseId: p.testCaseId || 0,
          jmxId: p.jmxId || 0,
          httpId: p.httpId || 0,
          paramKey: p.paramKey || '',
          paramValue: p.paramValue || ''
        })),
        body: onlineJmxData.httpVO?.body || ''
      },
      javaVO: {
        id: onlineJmxData.javaVO?.id || 0,
        testCaseId: onlineJmxData.javaVO?.testCaseId || 0,
        jmxId: onlineJmxData.javaVO?.jmxId || 0,
        javaRequestClassPath: onlineJmxData.javaVO?.javaRequestClassPath || '',
        javaParamVOList: (onlineJmxData.javaVO?.javaParamVOList || []).map(p => ({
          id: p.id || 0,
          testCaseId: p.testCaseId || 0,
          jmxId: p.jmxId || 0,
          javaId: p.javaId || 0,
          paramKey: p.paramKey || '',
          paramValue: p.paramValue || ''
        }))
      },
      dubboVO: onlineJmxData.dubboVO || {},
      assertionVO: {
        id: onlineJmxData.assertionVO?.id || 0,
        testCaseId: onlineJmxData.assertionVO?.testCaseId || 0,
        jmxId: onlineJmxData.assertionVO?.jmxId || 0,
        responseCode: onlineJmxData.assertionVO?.responseCode || '',
        responseMessage: onlineJmxData.assertionVO?.responseMessage || '',
        jsonPath: onlineJmxData.assertionVO?.jsonPath || '',
        expectedValue: onlineJmxData.assertionVO?.expectedValue || ''
      }
    };
    //根据 onlineJmxData 设置 jmeterThreadsType 和 jmeterSampleType
    jmeterThreadsType.value = getJmeterThreadsType(onlineJmxData.jmeterThreadsType);
    jmeterSampleType.value = getJmeterSampleType(onlineJmxData.jmeterSampleType);

  } else {
    // 如果是新增操作，重置为默认值
    jmeterThreadsType.value = 'threadGroup';
    jmeterSampleType.value = 'http';
  }
  await getFullTestCase(testCaseFullData.value.id);
};

const getJmeterThreadsType = (type: number): string => {
  switch (type) {
    case 0:
      return 'threadGroup';
    case 1:
      return 'steppingThreadGroup';
    case 2:
      return 'concurrencyThreadGroup';
    default:
      return 'threadGroup';
  }
};

const getJmeterSampleType = (type: number): string => {
  switch (type) {
    case 0:
      return 'http';
    case 1:
      return 'java';
    case 2:
      return 'dubbo';
    default:
      return 'http';
  }
};

const handleThreadGroupTypeChange = (value: string) => {
  switch (value) {
    case 'threadGroup':
      onlineJmxItem.value.jmeterThreadsType = 0;
      break;
    case 'steppingThreadGroup':
      onlineJmxItem.value.jmeterThreadsType = 1;
      break;
    case 'concurrencyThreadGroup':
      onlineJmxItem.value.jmeterThreadsType = 2;
      break;
    default:
      onlineJmxItem.value.jmeterThreadsType = 0;
  }
};

const handleRequestTypeChange = (value: string) => {
  switch (value) {
    case 'http':
      onlineJmxItem.value.jmeterSampleType = 0;
      break;
    case 'java':
      onlineJmxItem.value.jmeterSampleType = 1;
      break;
    case 'dubbo':
      onlineJmxItem.value.jmeterSampleType = 2;
      break;
    default:
      onlineJmxItem.value.jmeterSampleType = 0;
  }
};

const numberToBoolean = (value: number): boolean => value === 1;
// Simplify checkbox change handler using helper function
const boolToNumber = (value: boolean): number => value ? 1 : 0;

// Reusable function to add a new item to any list (like headers, params)
const addNewItem = <T>(list: T[], newItem: T) => {
  list.push(newItem);
};

// Reusable function to delete an item by index from a list
const deleteItemByIndex = <T>(list: T[], index: number) => {
  list.splice(index, 1);
};

// Refactored HTTP Header and Param handlers using generic functions
const handleHttpHeaderAdd = () => {
  addNewItem(onlineJmxItem.value.httpVO.httpHeaderVOList, {
    id: 0,
    testCaseId: 0,
    jmxId: 0,
    httpId: 0,
    headerKey: '',
    headerValue: ''
  });
};

const handleHttpHeaderDelete = (index: number) => {
  deleteItemByIndex(onlineJmxItem.value.httpVO.httpHeaderVOList, index);
};

const handleHttpParamAdd = () => {
  addNewItem(onlineJmxItem.value.httpVO.httpParamVOList, {
    id: 0,
    testCaseId: 0,
    jmxId: 0,
    httpId: 0,
    paramKey: '',
    paramValue: ''
  });
};

const handleHttpParamDelete = (index: number) => {
  deleteItemByIndex(onlineJmxItem.value.httpVO.httpParamVOList, index);
};

// Java Param handlers using the same generic functions
const handleJavaParamAdd = () => {
  addNewItem(onlineJmxItem.value.javaVO.javaParamVOList, {
    id: 0,
    testCaseId: 0,
    jmxId: 0,
    javaId: 0,
    paramKey: '',
    paramValue: ''
  });
};

const handleJavaParamDelete = (index: number) => {
  deleteItemByIndex(onlineJmxItem.value.javaVO.javaParamVOList, index);
};

// 定义用于 API 的类型
interface OnlineJmxItemForApi extends Omit<OnlineJmxItem, 'threadGroupVO'> {
  threadGroupVO: {
    sameUserOnNextIteration: number;
    delayedStart: number;
    scheduler: number;
    id: number;
    testCaseId: number;
    jmxId: number;
    numThreads: string;
    rampTime: string;
    loops: string;
    duration: string;
    delay: string;
  };
}

// 布尔值转数字的公共方法
const convertBooleanToNumber = (item: OnlineJmxItem): OnlineJmxItemForApi => {
  const { sameUserOnNextIteration, delayedStart, scheduler, ...restOfThreadGroupVO } = item.threadGroupVO;

  return {
    ...item,
    threadGroupVO: {
      sameUserOnNextIteration: boolToNumber(sameUserOnNextIteration),
      delayedStart: boolToNumber(delayedStart),
      scheduler: boolToNumber(scheduler),
      // 保留其他字段
      ...restOfThreadGroupVO
    }
  };
};

// 添加在线 JMX 数据的函数
const addOnlineJmxData = async (formattedItem: OnlineJmxItemForApi) => {
  const res = await addOnlineJmx(formattedItem);
  const code = res.data.code;
  if (code !== 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("新增成功");
    onlineDrawer.value = false;
  }
};

// 更新在线 JMX 数据的函数
const updateOnlineJmxData = async (formattedItem: OnlineJmxItemForApi) => {
  const res = await updateOnlineJmx(formattedItem.id, formattedItem);
  const code = res.data.code;
  if (code !== 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("更新成功");
    onlineDrawer.value = false;
  }
};

// 处理保存操作的函数
const handleSave = async () => {
  // 强制计算 isParamDisabled 和 isBodyDisabled 确保它们的值是最新的
  const isParamDisabledValue = isParamDisabled.value;
  const isBodyDisabledValue = isBodyDisabled.value;

  const formattedItem = convertBooleanToNumber(onlineJmxItem.value);

  // 如果 Param 被禁用，则将 Param 传 null
  if (isParamDisabledValue) {
    formattedItem.httpVO.httpParamVOList = [];
  }

  // 如果 Body 被禁用，则将 Body 传 null
  if (isBodyDisabledValue) {
    formattedItem.httpVO.body = null;
  }

  // 保存编辑后的 JMX 脚本数据
  if (onlineJmxItem.value.id) {
    // 如果 id 不为空，则调用更新操作
    await updateOnlineJmxData(formattedItem);
  } else {
    // 如果 id 为空，则调用新增操作
    await addOnlineJmxData(formattedItem);
  }

  // 在操作完成后刷新关联列表
  await getFullTestCase(testCaseFullData.value.id);
};

const handleCheckboxChange = (field: string, value: boolean) => {
  onlineJmxItem.value.threadGroupVO[field] = value;
};


const chartDialogVisible = ref(false);

// 打开弹窗并获取数据
const openChartDialog = async (id: number) => {
  chartDialogVisible.value = true;

  const res = await getResult(id); // 获取后端数据
  const code = res.data.code
  if (code != 0) {
    ElMessage.error(res.data.message);
    return false;
  }
  // console.log("res:", res.data.data);

  // 提取 currentTime、throughput 和 avgResponseTime 列表
  const resultData = res.data.data;
  console.log("resultData:", resultData);
  if (resultData.length == 0) {
    throughputChart.datasets[0].data = ["0"];

    responseTimeChart.datasets[0].data = ["0"];
    return;
  }
  const labels = resultData.map(item => item.currentTime);
  const throughputData = resultData.map(item => item.throughput);
  const responseTimeData = resultData.map(item => item.avgResponseTime);

  // console.log("labels:", labels);
  // console.log("throughputData:", throughputData);
  // console.log("responseTimeData:", responseTimeData);
  // 设置图表数据
  throughputChart.labels = labels;
  throughputChart.datasets[0].data = throughputData;

  responseTimeChart.labels = labels;
  responseTimeChart.datasets[0].data = responseTimeData;
};

// 绘制吞吐量曲线图

const throughputChart = reactive({
  type: 'line',
  title: {
    text: '吞吐量'
  },
  bgColor: '#ffffff',
  labels: [],
  xRorate: 45,
  datasets: [
    {
      label: '单位：/s',
      data: []
    }
  ]
});

const responseTimeChart = reactive({
  type: 'line',
  title: {
    text: '响应时间'
  },
  bgColor: '#ffffff',
  labels: [],
  xRorate: 45,
  datasets: [
    {
      label: '单位：ms',
      data: []
    }
  ]
});

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
.bg-blue {
  color: #409EFF;
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
.bar-schart-box {
  display: inline-block;
  margin: 20px;
  width: 100%;
}
.bar-schart {
  width: 100%;
  height: 30vh; /* 设置图表的高度为视口高度的45% */
  margin-bottom: 20px; /* 图表之间的间距 */
}
.horizontal-dropdown-menu {
  display: flex; /* 使用 flexbox */
  flex-direction: row; /* 横向排列 */
  padding: 0; /* 去掉内边距（如果需要） */
}

.horizontal-dropdown-menu .el-dropdown-item {
  padding: 10px 20px; /* 可以根据需要调整每个按钮的内边距 */
}

/* 在样式表中定义六个类 */
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

.status-waiting {
  background-color: #409EFF !important;
  color: #FFFFFF !important;
  border-color: #409EFF !important;
}

.status-canceled {
  background-color: #409EFF !important;
  color: #FFFFFF !important;
  border-color: #409EFF !important;
}
</style>
