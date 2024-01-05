<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="企业名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入企业名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属产业链" prop="chain">
        <el-input
            v-model="queryParams.chain"
            placeholder="请输入所属产业链"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属园区" prop="park">
        <el-input
            v-model="queryParams.park"
            placeholder="请输入所属园区"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择当前状态" clearable>
          <el-option
              v-for="dict in business_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
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
            v-hasPermi="['taskallocation:business:add']"
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
            v-hasPermi="['taskallocation:business:edit']"
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
            v-hasPermi="['taskallocation:business:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['taskallocation:business:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="businessList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="企业编号" align="center" prop="id"/>
      <el-table-column label="企业名称" align="center" prop="name"/>
      <el-table-column label="企业邻居节点" align="center" prop="neighbor"/>
      <el-table-column label="具有技能种类数量" align="center" prop="skillNum"/>
      <el-table-column label="企业地址" align="center" prop="address"/>
      <el-table-column label="所属产业链" align="center" prop="chain"/>
      <el-table-column label="所属园区" align="center" prop="park"/>
      <el-table-column label="当前状态" align="center" prop="state">
        <template #default="scope">
          <dict-tag :options="business_type" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column label="联盟编号" align="center">
        <template #default="scope">
          <el-tag size="medium" type="primary">{{ scope.row.coalitionId === 0 ? '暂无' : scope.row.coalitionId }}
          </el-tag>
        </template>
      </el-table-column>
      <!--      <el-table-column label="当前是否有任务发布" align="center" prop="ispublish"/>-->
      <el-table-column label="所属网络层" align="center" prop="layer"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['taskallocation:business:edit']">修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['taskallocation:business:remove']">删除
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

    <!-- 添加或修改企业信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="businessRef" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入企业名称"/>
        </el-form-item>
        <el-form-item label="所属网络层编号" prop="layer">
          <el-input v-model="form.layer" placeholder="请输入网络层编号"/>
        </el-form-item>
        <el-form-item label="企业邻居节点编号" prop="neighbor">
          <el-input v-model="form.neighbor" placeholder="请输入企业邻居节点"/>
        </el-form-item>
        <el-form-item label="具有技能种类数量" prop="skillNum">
          <el-input v-model="form.skillNum" placeholder="请输入具有技能种类数量"/>
        </el-form-item>
        <el-form-item label="企业地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入企业地址"/>
        </el-form-item>
        <el-form-item label="所属产业链" prop="chain">
          <el-input v-model="form.chain" placeholder="请输入所属产业链"/>
        </el-form-item>
        <el-form-item label="所属园区" prop="park">
          <el-input v-model="form.park" placeholder="请输入所属园区"/>
        </el-form-item>
        <el-form-item label="当前状态" prop="state">
          <el-select v-model="form.state" placeholder="请选择当前状态">
            <el-option
                v-for="dict in business_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联盟编号" prop="coalitionId">
          <el-input v-model="form.coalitionId" placeholder="请输入联盟编号"/>
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Business">
import {addBusiness, delBusiness, getBusiness, listBusiness, updateBusiness} from "@/api/taskallocation/business";

const {proxy} = getCurrentInstance();
const {business_type} = proxy.useDict('business_type');

const businessList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
// const showDialog = ref(false);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 8,
    name: null,
    chain: null,
    park: null,
    state: null,
    layer: null
  },
  rules: {
    state: [
      {required: true, message: "当前状态不能为空", trigger: "change"}
    ],
    coalitionId: [
      {required: true, message: "联盟编号不能为空", trigger: "blur"}
    ],
    ispublish: [
      {required: true, message: "当前是否有任务发布不能为空", trigger: "blur"}
    ],
    layer: [
      {required: true, message: "所属网络层不能为空", trigger: "blur"}
    ]
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询企业信息列表 */
function getList() {
  loading.value = true;
  listBusiness(queryParams.value).then(response => {
    businessList.value = response.rows;
    total.value = response.total;
    loading.value = false;
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
    neighbor: null,
    skillNum: null,
    address: null,
    chain: null,
    park: null,
    state: null,
    coalitionId: null,
    ispublish: null,
    layer: null
  };
  proxy.resetForm("businessRef");
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
  // showDialog.value = true;
  reset();
  open.value = true;
  title.value = "添加企业信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getBusiness(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改企业信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["businessRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateBusiness(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBusiness(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除企业信息编号为"' + _ids + '"的数据项？').then(function () {
    return delBusiness(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('taskallocation/business/export', {
    ...queryParams.value
  }, `business_${new Date().getTime()}.xlsx`)
}

getList();
</script>
