<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="任务编号" prop="id">
        <el-input
            v-model="queryParams.id"
            placeholder="请输入任务编号"
            clearable
            style="width: 140px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入任务名称"
            clearable
            @keyup.enter="handleQuery"
            style="width: 140px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="formationList" @selection-change="handleSelectionChange">
      <el-table-column label="任务编号" align="center" prop="id"/>
      <el-table-column label="任务名称" align="center" prop="name"/>
      <el-table-column label="任务状态" align="center" prop="taskStatus">
        <template #default="scope">
          <el-tag type="danger" v-if="scope.row.taskStatus==0">异常</el-tag>
          <el-tag type="success" v-else>正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="联盟编号" align="center">
        <template #default="scope">
          <span v-if="scope.row.coalitionId==0">
            暂无
          </span>
          <el-link type="primary" v-else>{{ scope.row.coalitionId }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="所属产业链名称" align="center" :width="150">
        <template #default="scope">
          <span>{{ getNameByChainId(scope.row.chainId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300">
        <template #default="scope">
          <el-button link type="primary" icon="Star" @click="coalitionformation(scope.row)"
          >生成迁移方案
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     :disabled="scope.row.taskStatus==1"
                     v-hasPermi="['coalition:formation:remove']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />
    <el-dialog v-model="showMigration" width="40%">
      <template #title>
        <span>任务迁移</span>
      </template>
      <div>
        <h3>企业替换记录</h3>
        <!-- 在这里添加企业替换记录的显示 -->
        <el-table :data="replacementRecords" style="width: 100%">
          <el-table-column prop="originalCompany" label="原企业"></el-table-column>
          <el-table-column prop="newCompany" label="新企业"></el-table-column>
          <el-table-column prop="algorithm" label="迁移算法"></el-table-column>
        </el-table>

        <h3>迁移算法效果对比</h3>
        <!-- 在这里添加迁移算法效果对比的显示 -->
        <el-table :data="algorithmComparison" style="width: 100%;margin-bottom: 10px">
          <el-table-column prop="algorithm" label="算法"></el-table-column>
          <el-table-column prop="effectiveness" label="迁移效率提升"></el-table-column>
          <el-table-column prop="mode" label="迁移模式"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showMigration = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup name="Formation">

import {addFormation, delFormation, getFormation, listFormation, updateFormation} from "@/api/taskcoalition/index.js";
import request from "@/utils/request.js";
import useTaskStore from "@/store/modules/task.js";

const replacementRecords = ref([
  {originalCompany: '云南瑞华能源', newCompany: '金发科技', algorithm: 'ABCTM'},
  {originalCompany: '厦门物业', newCompany: '南京涂料', algorithm: 'RLTM'},
  // 添加更多替换记录数据
]);

const algorithmComparison = ref([
  {algorithm: 'ABCTM', effectiveness: '58%',mode:"跨企业群"},
  {algorithm: 'RLTM', effectiveness: '29%',mode:"产业链"},
]);

const taskStore = useTaskStore();
const {proxy} = getCurrentInstance();
const {task_state, chain_stage} = proxy.useDict('task_state', 'chain_stage');


const formationList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: null,
    name: null,
    taskStatus: null,
    chainId: null,
    taskType: null
  },
  rules: {
    name: [{
      required: true, message: "任务名称不能为空", trigger: "blur"
    }
    ],
    taskType: [
      {required: true, message: "任务类型不能为空", trigger: "blur"}
    ]
  }
});

const {queryParams, form} = toRefs(data);
const chainName = ["洗衣机产业链", "空调产业链", "汽车产业链"]
const getNameByChainId = (id) => {
  return chainName[id - 1];
}

const getCompanyName = async (cid, lid) => {
  const company = await request({
    url: "/company/show/getone",
    params: {
      id: cid,
      layer: lid
    }
  })
  return company.name;
}

const productName = ref("");
const getTaskResource = async (taskId) => {
  return await request({
    url: "/resource/getTaskResource",
    params: {
      task_id: taskId
    }
  })
}

const showMigration = ref(false);
const coalitionformation = async (task) => {
  task.coalitionId = Math.floor(Math.random() * 100) + 200;
  task.taskStatus = 1;
  showMigration.value = true;
}

/** 查询任务信息列表 */
function getList() {
  loading.value = true;
  listFormation(queryParams.value).then((response) => {
    formationList.value = response.rows;
    total.value = response.total;
    loading.value = false;
    formationList.value.forEach(async (item) => {
      item.companyName = await getCompanyName(item.companyId, item.chainId);
      item.resource = await getTaskResource(item.id);
      item.taskStatus = 0;
    })
  });
}

// 表单重置
function reset() {
  productName.value = "";
  form.value = {
    id: null,
    name: null,
    val: null,
    arrivalTime: null,
    coalitionTime: null,
    finishTime: null,
    taskStatus: null,
    duration: null,
    productId: null,
    coalitionId: null,
    chainId: null,
    companyId: null
  };
  proxy.resetForm("formationRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加任务信息";
}

const taskTypes = ['原料供应', '零件生产', '整机组装', '销售和回收']


/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除任务信息编号为"' + _ids + '"的数据项？').then(function () {
    return delFormation(_ids);
  }).then(() => {
    taskStore.isAddTask = !taskStore.isAddTask;
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

getList();
</script>

<style scoped>
.app-container {
  width: 100%;
}
</style>
