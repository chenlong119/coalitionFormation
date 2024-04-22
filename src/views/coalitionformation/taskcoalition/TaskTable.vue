<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="任务编号" prop="id">
        <el-input
            v-model="queryParams.id"
            placeholder="请输入任务编号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入任务名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务状态" prop="taskStatus">
        <el-select v-model="queryParams.taskStatus" placeholder="请选择任务状态" clearable>
          <el-option
              v-for="dict in task_state"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属企业编号" prop="companyId">
        <el-input
            v-model="queryParams.companyId"
            placeholder="请输入任务所属企业编号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['coalition:formation:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['coalition:formation:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['coalition:formation:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['coalition:formation:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="User"
            @click="$router.push('/coalitionFormation/companyInfo')"
        >查看企业信息
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Setting"
            @click="setResource"
        >配置资源
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Share"
            @click="$router.push('/coalitionFormation/coalitionResult')"
        >查看联盟详情
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="formationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="任务编号" align="center" prop="id"/>
      <el-table-column label="任务名称" align="center" prop="name"/>
      <el-table-column label="任务价值" align="center" prop="val"/>
      <el-table-column label="任务到达时间" align="center" prop="arrivalTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.arrivalTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务完成时间" align="center" prop="finishTime" width="180">
        <template #default="scope">
          <span v-if="scope.row.finishTime">{{ parseTime(scope.row.finishTime, '{y}-{m}-{d}') }}</span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" align="center" prop="taskStatus">
        <template #default="scope">
          <el-tag :type="getType(scope.row.taskStatus)">
            {{ getStatusNameByValue(scope.row.taskStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="任务持续时长" align="center" prop="duration"/>
      <el-table-column label="产品编号" align="center">
        <template #default="scope">
          <span v-if="scope.row.productId">{{ scope.row.productId }}</span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="联盟编号" align="center">
        <template #default="scope">
          <span v-if="scope.row.coalitionId==0">
            暂无
          </span>
          <span v-else>{{ scope.row.coalitionId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属产业链名称" align="center" :width="150">
        <template #default="scope">
          <span>{{ getNameByChainId(scope.row.chainId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属企业" align="center">
        <template #default="scope">
          <span>{{ scope.row.companyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源种类数" align="center">
        <template #default="scope">
          <span>{{ scope.row.resource?.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300">
        <template #default="scope">
          <el-button link type="primary" icon="Star" @click="coalitionformation(scope.row)"
                     :disabled="scope.row.taskStatus===1||scope.row.taskStatus===2">联盟形成
          </el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['coalition:formation:edit']">修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
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

    <!-- 添加或修改任务信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="formationRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入任务名称"/>
        </el-form-item>
        <el-form-item label="任务价值" prop="val">
          <el-input v-model="form.val" placeholder="请输入任务价值(万元)"/>
        </el-form-item>
        <el-form-item label="任务持续时长" prop="duration">
          <el-input v-model="form.duration" placeholder="请输入任务持续时长(天)"/>
        </el-form-item>
        <el-form-item label="产品编号" prop="productId">
          <el-row :gutter="5">
            <el-col :span="12">
              <el-input v-model="form.productId" placeholder="请输入产品编号" @keyup="getProductName(form.productId)"/>
            </el-col>
            <el-col :span="12">
              <el-input v-model="productName" disabled></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="setResourceDialog" title="任务资源配置" width="600px" @closed="clear">
      <ResourceSetting ckey="task" ref="resourceSetting"></ResourceSetting>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitResource">确 定</el-button>
          <el-button @click="cancleResource">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Formation">
import {addFormation, delFormation, getFormation, listFormation, updateFormation} from "@/api/taskcoalition/index.js";
import request from "@/utils/request.js";
import ResourceSetting from "@/views/coalitionformation/common/ResourceSetting.vue";
import {ElMessage} from "element-plus";
import useLoadingStore from "@/store/modules/loading.js";

const resourceSetting = ref(null);

const clear = () => {
  resourceSetting.value.clearData();
}

const setResourceDialog = ref(false);
const setResource = () => {
  setResourceDialog.value = true;
}
const submitResource = () => {
  resourceSetting.value.submit();
  setResourceDialog.value = false;
  ElMessage({
    message: '资源配置成功',
    type: 'success',
  })
  getList();
}
const cancleResource = () => {
  setResourceDialog.value = false;
}

const {proxy} = getCurrentInstance();
const {task_state} = proxy.useDict('task_state');

const getStatusNameByValue = (val) => {
  return task_state.value.filter(item => item.value == val)[0].label;
}

const getType = (val) => {
  const types = ['primary', 'warning', 'success', 'danger'];
  return types[val];
}

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
    pageSize: 4,
    id: null,
    name: null,
    val: null,
    taskStatus: null,
    companyId: null
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);
const chainName = ["汽车产业链", "家电产业链", "电子产业链"]
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
const getProductName = async (id) => {
  const name = await request({
    url: "/coalition/formation/getProductName",
    params: {
      id
    }
  })
  productName.value = name;
}
const getTaskResource = async (taskId) => {
  return await request({
    url: "/resource/getTaskResource",
    params: {
      task_id: taskId
    }
  })
}
const loadingStroe=useLoadingStore();
const coalitionformation=async (task)=>{
  const res=await request({
    url:"/coalition/allocation",
    method:"post",
    params:{
      taskId:task.id
    },
    data:task.resource
  })
  ElMessage({
    type: 'success',
    message: "联盟形成成功，联盟编号为："+res
  })
  loadingStroe.coalitionloading=!loadingStroe.coalitionloading;
  getList();
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
    })
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
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

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  getProductName(row.productId)
  const _id = row.id || ids.value
  getFormation(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改任务信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["formationRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateFormation(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFormation(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除任务信息编号为"' + _ids + '"的数据项？').then(function () {
    return delFormation(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('coalition/formation/export', {
    ...queryParams.value
  }, `formation_${new Date().getTime()}.xlsx`)
}

getList();
</script>

<style scoped>
.app-container {
  width: 100%;
}
</style>
