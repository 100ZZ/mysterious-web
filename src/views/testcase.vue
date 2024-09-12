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
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="description" label="描述" align="center"></el-table-column>
        <el-table-column prop="biz" label="产品" align="center"></el-table-column>
        <el-table-column prop="service" label="服务" align="center"></el-table-column>
        <el-table-column prop="version" label="版本" align="center"></el-table-column>
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
        <el-table-column prop="creator" label="创建人" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="modifier" label="修改人" align="center"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间" align="center"></el-table-column>

        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button style="margin-left: 0" text :icon="Search" class="bg-blue" @click="drawer = true,getFullTestCase(scope.row.id)" v-permiss="1">
              详情
            </el-button>
            <el-button style="margin-left: 0" text :icon="Edit" class="bg-blue" @click="handleEdit(scope.row)" v-permiss="1">
              编辑
            </el-button>
            <el-dropdown class="group-status" trigger="click">
              <el-button style="margin-left: 0" text :icon="Right" class="bg-blue" v-permiss="1">执行</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="debugAction(scope.row.id)">调试</el-dropdown-item>
                  <el-dropdown-item @click="startAction(scope.row.id)">压测</el-dropdown-item>
                  <el-dropdown-item @click="stopAction(scope.row.id)">停止</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button style="margin-left: 0" text :icon="Plus" class="bg-blue" @click="goReports(scope.row.id, scope.row.name)" v-permiss="1">
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
        <el-form-item label="ID">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="editForm.name" placeholder="名称"></el-input>
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
      <el-divider>基础信息</el-divider>
      <el-descriptions direction="vertical" :column="3" border>
        <el-descriptions-item label="ID" align="center">{{testCaseFullData.id}}</el-descriptions-item>
        <el-descriptions-item label="名称" align="center">{{testCaseFullData.name}}</el-descriptions-item>
        <el-descriptions-item label="描述" align="center">{{testCaseFullData.description}}</el-descriptions-item>
        <el-descriptions-item label="产品线" align="center">{{testCaseFullData.biz}}</el-descriptions-item>
        <el-descriptions-item label="服务" align="center">{{testCaseFullData.service}}</el-descriptions-item>
        <el-descriptions-item label="版本号" align="center">{{testCaseFullData.version}}</el-descriptions-item>
      </el-descriptions>

      <!--      关联jmx脚本-->
      <el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-upload action="" :show-file-list="false" :http-request="handleJmxUpload">
              <el-button text :icon="Upload" class="blue">本地上传JMX脚本文件</el-button>
            </el-upload>
          </el-col>
          <el-col :span="12">
            <el-button text :icon="Edit" class="blue" @click="onlineDrawer = true,getOnlineJmxData(jmxFullData[0] ? jmxFullData[0].id : null)">在线编写JMX脚本文件</el-button>
          </el-col>
        </el-row>
      </el-divider>

      <el-table :data="jmxFullData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="dstName" label="名称" align="center"></el-table-column>
        <el-table-column prop="description" label="描述" align="center"></el-table-column>
        <el-table-column prop="testCaseId" label="用例" align="center"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button style="margin-left: 0" text :icon="Search" class="bg-blue" @click="jmxDrawer = true,handleJmxView(scope.row.id)" v-permiss="1">
              预览
            </el-button>
            <el-button style="margin-left: 0" text :icon="Delete" class="red" @click="handleJmxDelete(scope.row.id)" v-permiss="1">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>


      <!-- 子抽屉用于编辑 JMX 脚本 -->
      <el-drawer v-model="onlineDrawer" title="在线编写JMX脚本文件" :append-to-body="true" :size="'75%'">
        <el-form :model="onlineJmxItem" label-width="150px" label-position="top">
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
              <el-form-item label="用例ID">
                <el-input v-model="onlineJmxItem.testCaseId" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider>
            <el-radio-group v-model="threadGroupType">
              <el-radio label="threadGroup">Thread Group</el-radio>
              <el-radio label="steppingThreadGroup">Stepping Thread Group</el-radio>
              <el-radio label="concurrencyThreadGroup">Concurrency Thread Group</el-radio>
            </el-radio-group>
          </el-divider>

          <!-- 条件渲染不同的线程组输入框 -->
          <template v-if="threadGroupType === 'threadGroup'">
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

          <template v-if="threadGroupType === 'steppingThreadGroup'">
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


          <template v-if="threadGroupType === 'concurrencyThreadGroup'">
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


          <el-divider>
            <el-radio-group v-model="requestType">
              <el-radio label="http">HTTP Request</el-radio>
              <el-radio label="java">Java Request</el-radio>
              <el-radio label="dubbo">Dubbo Request</el-radio>
            </el-radio-group>
          </el-divider>


          <template v-if="requestType === 'http'">
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
                      <el-button text :icon="Delete" class="red" @click="handleHttpParamDelete(scope.$index)">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button type="primary" @click="handleHttpParamAdd">新增</el-button>
              </el-tab-pane>
              <el-tab-pane label="Body" name="body">
                <el-input type="textarea" v-model="onlineJmxItem.httpVO.body" :rows="10"></el-input>
              </el-tab-pane>
            </el-tabs>
          </template>

          <template v-else-if="requestType === 'java'">
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

          <template v-else-if="requestType === 'dubbo'">
            <el-form-item>
              <el-input type="textarea" v-model="onlineJmxItem.dubboVO" :rows="10"></el-input>
            </el-form-item>
          </template>
        </el-form>
        <el-button type="primary" @click="handleSave" style="margin-top: 20px;">保存</el-button>
      </el-drawer>

      <!--    抽屉展示详情-->
      <el-drawer v-model="jmxDrawer" title="脚本详情" :append-to-body="true" :size="'45%'">
        <pre><div v-text="jmxFile"></div></pre>
      </el-drawer>

      <!--      关联csv文件-->
      <el-divider>
        <el-upload action="" :show-file-list="false" :http-request="handleCsvUpload">
          <el-button text :icon="Upload" class="blue">本地上传CSV数据文件</el-button>
        </el-upload>
      </el-divider>
      <el-table :data="csvFullData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="dstName" label="名称" align="center"></el-table-column>
        <el-table-column prop="description" label="描述" align="center"></el-table-column>
        <el-table-column prop="testCaseId" label="用例" align="center"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button style="margin-left: 0" text :icon="Search" class="bg-blue" @click="csvDrawer = true,handleCsvView(scope.row.id)" v-permiss="1">
              预览
            </el-button>
            <el-button style="margin-left: 0" text :icon="Delete" class="red" @click="handleCsvDelete(scope.row.id)" v-permiss="1">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--    抽屉展示详情-->
      <el-drawer v-model="csvDrawer" title="数据详情" :append-to-body="true" :size="'45%'">
        <pre><div v-text="csvFile"></div></pre>
      </el-drawer>

      <!--      关联jar依赖-->
      <el-divider>
        <el-upload action="" :show-file-list="false" :http-request="handleJarUpload">
          <el-button text :icon="Upload" class="blue">本地上传JAR依赖文件</el-button>
        </el-upload>
      </el-divider>
      <el-table :data="jarFullData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="dstName" label="名称" align="center"></el-table-column>
        <el-table-column prop="description" label="描述" align="center"></el-table-column>
        <el-table-column prop="testCaseId" label="用例" align="center"></el-table-column>
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
import {ref, reactive, onUnmounted, onMounted} from 'vue';
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
import {deleteCsv, downloadCsv, uploadCsv} from "../api/csv";
import {addOnlineJmx, deleteJmx, downloadJmx, getOnlineJmx, updateOnlineJmx, uploadJmx} from "../api/jmx";
import {deleteJar, uploadJar} from "../api/jar";
import router from "../router";
import {checkToLogin} from "../common/push";

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
  interval = setInterval(getList, 30000); // 每30秒刷新一次
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

// 预览jmx
const jmxFile = ref('');
const handleJmxView = async (id: number) => {
  const res = await downloadJmx(id);
  jmxFile.value = res.data;
};

// 预览csv
const csvFile = ref('');
const handleCsvView = async (id: number) => {
  const res = await downloadCsv(id);
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
}

interface OnlineJmxItem {
  id: number;
  srcName: string;
  testCaseId: number;
  jmeterScriptType: number;
  jmeterThreadsType: number;
  jmeterSampleType: number;
  threadGroupVO: ThreadGroupVO;
  steppingThreadGroupVO: SteppingThreadGroupVO;
  concurrencyThreadGroupVO: ConcurrencyThreadGroupVO;
  httpVO: HttpVO;
  javaVO: JavaVO;
  dubboVO: DubboVO;
}

const threadGroupType = ref('threadGroup'); // 默认为 Thread Group
const requestType = ref('http');
const activeTab = ref('header');
const onlineJmxItem = ref<OnlineJmxItem>({
  id: 0,
  srcName: '',
  testCaseId: 0,
  jmeterScriptType: 0,
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
  dubboVO: {}
});

const getOnlineJmxData = async (id: number | null) => {
  onlineDrawer.value = true;

  // 重置 onlineJmxItem 的状态
  onlineJmxItem.value = {
    id: 0,
    srcName: '',
    testCaseId: testCaseFullData.value.id, // 假设 testCaseFullData 中包含当前用例的 id
    jmeterScriptType: 0,
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
    dubboVO: {}
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

    console.log("onlineJmxData: ", numberToBoolean(onlineJmxData.threadGroupVO.sameUserOnNextIteration));
    // 设置 onlineJmxItem 的值
    // 设置 onlineJmxItem 的值
    onlineJmxItem.value = {
      id: onlineJmxData.id,
      srcName: onlineJmxData.srcName,
      testCaseId: onlineJmxData.testCaseId,
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
      dubboVO: onlineJmxData.dubboVO || {}
    };
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
const handleSave = () => {
  console.log("before format: ", onlineJmxItem.value);
  const formattedItem = convertBooleanToNumber(onlineJmxItem.value);
  console.log("after format: ", formattedItem);
  let res;
  // 保存编辑后的 JMX 脚本数据
  if (onlineJmxItem.value.id) {
    // 如果 id 不为空，则调用更新操作
    updateOnlineJmxData(formattedItem);
  } else {
    // 如果 id 为空，则调用新增操作
    addOnlineJmxData(formattedItem);
  }
};



const handleCheckboxChange = (field: string, value: boolean) => {
  onlineJmxItem.value.threadGroupVO[field] = value;
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
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
