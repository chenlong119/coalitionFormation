<template>
  <div class="app-container table">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="工艺名称" prop="id">
        <el-input
            v-model="queryParams.id"
            placeholder="请输入工艺名称"
            clearable
            @keyup.enter="handleQuery"
            style="width: 120px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="showList" @selection-change="handleSelectionChange">
<!--      <el-table-column type="selection" width="55" align="center"/>-->
<!--      <el-table-column label="企业编号" align="center" prop="id"/>-->
      <el-table-column label="企业名称" align="center" prop="name" width="200"/>
      <!--      <el-table-column label="产业链网络层编号" align="center" prop="layerId"/>-->
      <el-table-column label="企业类型" align="center" prop="companyType">
        <template #default="scope">
          <dict-tag :options="chain_stage" :value="scope.row.companyType"/>
        </template>
      </el-table-column>
      <el-table-column label="企业地址" align="center" prop="address"/>
      <!--      <el-table-column label="企业类型" align="center" prop="companyType"/>-->
      <el-table-column label="所属产业链名称" align="center" prop="chainName"/>
      <el-table-column label="所属联盟编号" align="center">
        <template #default="scope">
          <span v-if="scope.row.coalitionId!==0">{{ scope.row.coalitionId }}</span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="企业信誉评分" align="center" prop="rep">
        <template #default="scope">
          {{ scope.row.rep*Math.floor(Math.random()*10)+1 }}
        </template>
      </el-table-column>
      <el-table-column label="企业状态" align="center" prop="status">
        <template #default="scope">
          <el-tag :type="getType(scope.row.status)">
            {{ getStatusNameByValue(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="工艺技术" align="center" width="180">
        <template #default="scope">
          <div class="gytag">
            <el-tag type="success" style="margin-right: 5px">水管密封</el-tag>
            <el-tag type="success">PVC管材</el-tag>
          </div>
          <span>{{2}}</span>
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
    <el-dialog :title="title" v-model="open" width="500px" append-to-body @closed="handleColse">
      <el-form ref="showRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="企业编号" prop="id">
          <el-input v-model="form.id" placeholder="请输入企业编号,为空则自动分配" :disabled="!isAdd"/>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入企业名称"/>
        </el-form-item>
        <el-form-item label="企业地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入企业地址"/>
        </el-form-item>
        <el-form-item label="所属网络层编号" prop="layerId">
          <el-input v-model="form.layerId" placeholder="请输入网络层编号" :disabled="!isAdd"/>
        </el-form-item>
        <el-form-item label="企业类型" prop="companyType" v-if="isAdd">
          <el-select v-model="form.companyType" placeholder="请选择企业类型" clearable>
            <el-option
                v-for="dict in chain_stage"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="层内邻居关系" v-if="!isAdd">
          <el-button link type="primary" @click="addNei">点击此处添加层内邻居关系</el-button>
          <template v-for="idx in idxs">
            <el-row :gutter="5">
              <el-col :span="4">
                <el-input placeholder="编号" v-model="neis[idx].id2" @keyup="searchName(idx)"></el-input>
              </el-col>
              <el-col :span="10">
                <el-input placeholder="邻居名称" disabled v-model="neis[idx].name"></el-input>
              </el-col>
              <el-col :span="10">
                <el-input disabled v-model="neis[idx].chainName"></el-input>
              </el-col>
            </el-row>
          </template>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!--    企业资源详情对话框-->
    <el-dialog :title="name+'在'+chain+'上的资源详情'" v-model="openResource" width="800px" :center="true">
      <ResourceDialog :resource-data="resource"></ResourceDialog>
    </el-dialog>
    <el-dialog v-model="setResourceDialog" title="企业资源配置" width="600px" @closed="clear">
      <ResourceSetting ckey="companykey" ref="resourceSetting"></ResourceSetting>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitResource">确 定</el-button>
          <el-button @click="cancleResource">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Show">
import {addShow, delShow, getShow, listShow, updateShow} from "@/api/company/show.js";
import request from "@/utils/request.js";
import ResourceDialog from "@/views/coalitionformation/company/ResourceDialog.vue";
import useLoadingStore from "@/store/modules/loading.js";
import ResourceSetting from "@/views/coalitionformation/common/ResourceSetting.vue";
import {ElMessage} from "element-plus";
import {getCurrentInstance} from "vue";

const setResourceDialog = ref(false);
const setResource = () => {
  setResourceDialog.value = true;
}

const resourceSetting = ref(null);
const clear = () => {
  resourceSetting.value.clearData();
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
const { company_status, chain_stage } = proxy.useDict('company_status', 'chain_stage');

const states = ['异常', '空闲','工作'];

const getStatusNameByValue = (val) => {
  return states[val];
}

const getType = (val) => {
  const types = ['danger', 'info', 'success'];
  return types[val];
}
const showList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const isAdd = ref(true);
// 添加企业关系时使用
const idxs = ref([]);
const neis = ref([]);
const chains = ["洗衣机产业链", "空调产业链", "汽车产业链"]


const addNei = () => {
  let layer = form.value.layerId;
  let chainName = chains[layer - 1];
  neis.value.push({
    id2: null,
    name: null,
    chainName
  })
  idxs.value.push(neis.value.length - 1);
}
const handleColse = () => {
  idxs.value = [];
  neis.value = [];
}

const searchName = async (idx) => {
  let company2 = neis.value[idx].id2;
  let layerId = form.value.layerId;
  const company = await request({
    url: "/company/show/getone",
    params: {
      id: company2,
      layer: layerId
    }
  });
  neis.value[idx].name = company.name;
}

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 3,
    name: null,
    layerId: null,
    status: null,
    companyType:null,
    id:null
  },
  rules: {
    name: [
      {required: true, message: "企业名称不能为空", trigger: "blur"}
    ],
    layerId: [
      {required: true, message: "网络层编号不能为空", trigger: "blur"}
    ],
    companyType: [
      {required: true, message: "企业类型不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

//根据企业id和layer_id查询企业具有的资源
const getCompanyResource = async (id, layerId) => {
  return await request.get("/resource/getCompanyResource", {
    params: {
      companyId: id,
      layerId: layerId
    }
  });
};


/** 查询企业信息列表 */
function getList() {
  loading.value = true;
  listShow(queryParams.value).then(response => {
    showList.value = response.rows;
    total.value = response.total;
    loading.value = false;
    showList.value.forEach(async (company) => {
      const res = await getCompanyResource(company.id, company.layerId);
      company.resource = res;
    })
  });
}

let name = ref("");
let chain = ref("");
let resource = ref([]);
let openResource = ref(false);
const viewResource = (row) => {
  openResource.value = true;
  resource.value = row.resource;
  name.value = row.name;
  chain.value = row.chainName;
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
    layerId: null,
    address: null,
    companyType: null,
    chainName: null,
    groupId: null,
    processRate: null,
    rep: null,
    status: null
  };
  proxy.resetForm("showRef");
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
  isAdd.value = true;
  reset();
  open.value = true;
  title.value = "添加企业信息";
}

const loadingStore = useLoadingStore()

let companyType = null;
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  isAdd.value = false;
  const _id = row.id || ids.value
  const layerId = row.layerId;
  companyType=row.companyType;
  getShow(_id, layerId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改企业信息";
  });
}

let id2s = [];
const addRelation = async () => {
  await request({
    url: "/coalition/graph/addrelation",
    params: {
      id1: form.value.id,
      id2s: id2s.join(","),
      layer: form.value.layerId,
      companyType
    }
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["showRef"].validate(valid => {
    if (valid) {
      if (!isAdd.value) {
        updateShow(form.value).then(async (response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
          id2s = neis.value.map(item => {
            return item.id2;
          })
          if (id2s.length > 0) {
            await addRelation();
            loadingStore.isloading = true;
          }
        });
      } else {
        addShow(form.value).then(async (response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
          loadingStore.isloading = true;
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除企业信息编号为"' + _ids + '"的数据项？').then(function () {
    return delShow(_ids);
  }).then(() => {
    loadingStore.isloading = true;
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('company/show/export', {
    ...queryParams.value
  }, `show_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
})
</script>

<style scoped lang="scss">
.table {
  width: 100%;
}

.gytag
{
  display: flex;
  border: 1px solid #ccc;
  justify-content: center;
}
.app-container{
  padding: 0;
}
</style>
