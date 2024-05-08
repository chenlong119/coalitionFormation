<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="联盟编号" prop="id">
          <el-input
              v-model="queryParams.id"
              placeholder="请输入联盟编号"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="联盟任务" prop="taskId">
          <el-input
              v-model="queryParams.taskId"
              placeholder="请输入联盟任务编号"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="联盟状态" prop="coalitionStatus">
          <el-select v-model="queryParams.coalitionStatus" placeholder="请选择联盟状态" clearable>
            <el-option
                v-for="dict in coalition_state"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              icon="User"
              @click="$router.push('/intelligenceEmerges/coalitionResult')"
          >查看企业信息
          </el-button>
            <el-button
                type="success"
                icon="Comment"
                @click="$router.push('/intelligenceEmerges/formation')"
            >查看任务信息
            </el-button>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="enterpriseList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="联盟编号" align="center" prop="id" />
        <el-table-column label="联盟名称" align="center" prop="name" />
        <el-table-column label="联盟任务编号" align="center" prop="taskId" />
        <el-table-column label="联盟状态" align="center">
          <template #default="scope">
            <el-tag :type="stateTypes[scope.row.coalitionStatus]">{{getStateName(scope.row)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="联盟内部企业个数" align="center">
          <template #default="socpe">
            <span>{{socpe.row.company?.length}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Search" @click="handleCoalition(scope.row)">查看联盟详情</el-button>
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
      <el-dialog
          title="联盟详情"
          v-model="coalitionDialog"
          width="50%"
      >
        <el-row :gutter="15">
          <el-col :span="14">
            <div>
              <h3>当前任务：{{taskName}}</h3>
            </div>
            <el-table :data="pageCompany">
              <el-table-column label="企业编号" align="center" prop="companyId" />
              <el-table-column label="企业名称" align="center" prop="companyName" />
              <el-table-column label="所属产业链" align="center">
                <template #default="scope">
                  <span>{{chainName[scope.row.layerId-1]}}</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="myPagination">
              <el-pagination hide-on-single-page
                             background
                             layout="prev, pager, next" :total="totalPage"
                             :page-size="myPageSize"
                             @current-change="handlePageChange"
              />
            </div>
          </el-col>
          <el-col :span="10">
            <CoalitionPie :coalition-company="companyList"/>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
</template>

<script setup name="Enterprise">
import { listEnterprise} from "@/api/coalition/enterprise";
import request from "@/utils/request.js";
import CoalitionPie from "@/views/coalitionformation/coalitionresult/CoalitionPie.vue";
import useLoadingStore from "@/store/modules/loading.js";
const { proxy } = getCurrentInstance();
const { coalition_state } = proxy.useDict('coalition_state');
const loadingStroe=useLoadingStore();
watch(()=>loadingStroe.coalitionloading,()=>{
  getList();
})

const chainName=['洗衣机产业链','空调产业链','汽车产业链']
const stateTypes=['danger','warning','success']
const enterpriseList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const coalitionDialog=ref(false)

let companyList=ref([]);
let taskName=ref("");


const getStateName=(row)=>{
  let label="";
  coalition_state.value.forEach(item=>{
    if(item.value===row.coalitionStatus.toString())
    {
      label= item.label;
    }
  })
  return label;
}
let totalPage=0;
const myPageSize=4;
let currentPage=1;
let pageCompany=ref([]);
const handleCoalition=async (row)=>{
  coalitionDialog.value=true
  // allCompanyInCoalition=row.company;
  totalPage=row.company.length;
 companyList.value=row.company;
 pageCompany.value=row.company.slice((currentPage-1)*myPageSize,myPageSize);
  const res=await request({
    url:"/coalition/formation/getone",
    params:{
      id:row.taskId
    }
  })
  if(res.name!=null) {
    taskName.value = res.name;
  }
}

const handlePageChange=(currentPage)=>{
  let start=currentPage==1?(currentPage-1)*myPageSize:(currentPage-1)*myPageSize-1;
  pageCompany.value=companyList.value.slice(start,myPageSize);
}
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 5,
    name: null,
    taskId: null,
    coalitionStatus: null,
    companyType:null
  },
  rules: {
  }
});

const { queryParams } = toRefs(data);

/** 查询企业联盟列表 */
function getList() {
  loading.value = true;
  listEnterprise(queryParams.value).then((response) => {
    enterpriseList.value = response.rows;
    total.value = response.total;
    loading.value = false;
    enterpriseList.value.forEach(async (item)=>{
      item.company=await request({
        url: "/company/show/getcompanybycoalition",
        method: 'get',
        params:{
          coalitionId:item.id
        }
      })
    })
  });
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


getList();
</script>

<style scoped>
.app-container
{
  height: 480px;
}

.myPagination
{
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
