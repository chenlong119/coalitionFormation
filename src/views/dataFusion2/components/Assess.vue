<script setup>
import {getCurrentInstance} from "vue";
import axios from 'axios';
import {ElMessage, ElMessageBox} from "element-plus";
import {addShow, listShow, updateShow} from "@/api/company/show.js";
import {addAssessment, deleteAssessment, getAssessments} from "@/api/datafusion/test.js";
const showRef = ref(null);
const total = ref(0);
const showList = ref([
]);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 3,
    name: null,
  },
  rules: {
    name: [
      {required: true, message: "企业名称不能为空", trigger: "blur"}
    ],
    assessment1: [
      { required: true, message: '请评分协作团体发现', trigger: 'change' }
    ],
    assessment2: [
      { required: true, message: '请评分关系强度量化', trigger: 'change' }
    ],
    assessment3: [
      { required: true, message: '请评分关键企业识别', trigger: 'change' }
    ],
    assessment: [
      { required: true, message: '请评分群智汇聚总评', trigger: 'change' }
    ],
    comment: [
      { required: true, message: '请输入评价内容', trigger: 'blur' }
    ]
  }
});
const submitForm = () => {
  showRef.value.validate((valid) => {
    if (valid) {
      // 表单验证通过，执行提交逻辑
      console.log('提交的数据:', form.value);
      addAssessment(form.value)
          .then(response => {
            // 假设后端返回的响应中包含成功信息
            ElMessage({
              message: '新增评价成功',
              type: 'success'
            });
            // 关闭对话框
            open.value = false;
            fetchData();
          })
          .catch(error => {
            console.error('提交失败:', error);
            ElMessage({
              message: '提交失败，请重试',
              type: 'error'
            });
          });
    } else {
      console.log('验证失败');
      return false;
    }
  });
};

const {queryParams, form, rules} = toRefs(data);
const isAdd = ref(true);
const {proxy} = getCurrentInstance();
const open = ref(false);
const title = ref("");
const loading = ref(false);
// 时间格式化函数
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleString().replace('T', ' ');
  // return date.toLocaleString('zh-CN', { hour12: false }).replace('T', ' ');
};
const fetchData = async () => {
  loading.value = true;
  try {
    const response = await getAssessments();
    console.log(response);
    showList.value = response;
  } catch (error) {
    console.error('Error fetching assessments:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
function getList() {
  loading.value = true;
  // listShow(queryParams.value).then(response => {
  //   showList.value = response.rows;
  //   total.value = response.total;
  //   loading.value = false;
  //   showList.value.forEach(async (company) => {
  //     const res = await getCompanyResource(company.id, company.layerId);
  //     company.resource = res;
  //   })
  // });
  loading.value = false;
}
// const deleteDialogVisible = ref(true);
// const deleteItem = ref({});
// const confirmDelete = (row) => {
//   console.log("start delete");
//   deleteItem.value = row;
//   deleteDialogVisible.value = true;
// };
// const handleDelete = async (row) => {
//   try {
//
//     deleteAssessment(row.id);
//     showList.value = showList.value.filter(item => item.id !== row.id);
//     //deleteDialogVisible.value = false;
//     console.log('Deleted row:', row);
//   } catch (error) {
//     console.error('Error deleting assessment:', error);
//   }
// };
const handleDelete = (row) => {
  ElMessageBox.confirm(
      `是否要删除 ${row.name} 企业的评价？`,
      '删除确认',
      {
        confirmButtonText: '确 认',
        cancelButtonText: '取 消',
        type: 'warning',
      }
  ).then(async () => {
    try {
      deleteAssessment(row.id);
      showList.value = showList.value.filter(item => item.id !== row.id);
      ElMessage({
        type: 'success',
        message: '删除成功!',
      });
    } catch (error) {
      console.error('Error deleting assessment:', error);
      ElMessage({
        type: 'error',
        message: '删除失败!',
      });
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '删除已取消',
    });
  });
};
function reset() {
  form.value = {
    // id: null,
    name: null,
    assessment1: 0,
    assessment2: 0,
    assessment3: 0,
    assessment: 0,
    comment: '',

  };
  proxy.resetForm("showRef");
}

function handleAdd() {
  isAdd.value = true;
  reset();
  open.value = true;
  title.value = "添加评估信息";
}

function cancel() {
  open.value = false;
  reset();
}
</script>

<template>
  <div class="app-container table">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['company:show:add']"
        >新增评估
        </el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--            type="danger"-->
<!--            plain-->
<!--            icon="Delete"-->
<!--            :disabled="multiple"-->
<!--            @click="handleDelete"-->
<!--            v-hasPermi="['company:show:remove']"-->
<!--        >删除-->
<!--        </el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--            type="warning"-->
<!--            plain-->
<!--            icon="Download"-->
<!--            @click="handleExport"-->
<!--            v-hasPermi="['company:show:export']"-->
<!--        >导出-->
<!--        </el-button>-->
<!--      </el-col>-->
    </el-row>
    <el-table v-loading="loading" :data="showList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="企业名称" align="center" prop="name" width="200"/>
      <el-table-column label="群智汇聚评分" align="center" prop="assessment">
        <template #default="scope">
          <el-rate v-model="scope.row.assessment" disabled />
        </template>
      </el-table-column>
      <el-table-column label="评价内容" align="center" width="400">
        <template #default="scope">
          <div style="text-align: left;">{{ scope.row.comment }}</div>
        </template>
      </el-table-column>
      <el-table-column label="评价时间" align="center">
        <template #default="scope">
          <div>{{ formatDateTime(scope.row.commentTime) }}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" :width="300">
        <template #default="scope">
<!--          <el-button link type="primary" icon="Search" @click="viewResource(scope.row)">详情</el-button>-->
<!--          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"-->
<!--                     v-hasPermi="['company:show:edit']">修改-->
<!--          </el-button>-->
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['company:show:remove']">删除
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
    <el-dialog :visible.sync="deleteDialogVisible" width="30%" center>
      <div>是否要删除 {{ deleteItem.name }} 企业的评价？</div>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDelete">确 认</el-button>
      </template>
    </el-dialog>

    <el-dialog :title="title" v-model="open" width="500px" append-to-body @closed="handleColse">
      <el-form ref="showRef" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入企业名称"/>
        </el-form-item>
        <el-form-item label="协作团体发现评分" prop="assessment">
          <div style="display: flex; align-items: center;">
            <el-rate v-model="form.assessment1"/>
            <span style="margin-left: 10px;">{{ form.assessment1 }} 分</span>
          </div>
        </el-form-item>
        <el-form-item label="关系强度量化评分" prop="assessment">
          <div style="display: flex; align-items: center;">
            <el-rate v-model="form.assessment2"/>
            <span style="margin-left: 10px;">{{ form.assessment2 }} 分</span>
          </div>
        </el-form-item>
        <el-form-item label="关键企业识别评分" prop="assessment">
          <div style="display: flex; align-items: center;">
            <el-rate v-model="form.assessment3"/>
            <span style="margin-left: 10px;">{{ form.assessment3 }} 分</span>
          </div>
        </el-form-item>
        <el-form-item label="群智汇聚总评" prop="assessment">
          <div style="display: flex; align-items: center;">
            <el-rate v-model="form.assessment"/>
            <span style="margin-left: 10px;">{{ form.assessment }} 分</span>
          </div>
        </el-form-item>
        <el-form-item label="评价内容" prop="comment">
          <el-input type="textarea" v-model="form.comment" placeholder="请输入评价内容" />
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

<style scoped lang="scss">
.dialog-footer {
  text-align: right;
}
</style>