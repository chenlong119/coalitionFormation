<script setup>
import {getCurrentInstance, nextTick, onMounted, ref} from 'vue'
import * as echarts from 'echarts';
import request from "@/utils/request";
import Task from "@/views/task/management/Task.vue"
//企业信息列表部分
import {addBusiness, delBusiness, getBusiness, listBusiness, updateBusiness} from "@/api/taskallocation/business";
import Map from './map.vue'
import MultiChart from "@/views/coalitionformation/dashboard/multiChart.vue";
import {ElMessage, ElMessageBox} from "element-plus";


let reload = ref(false);
const checkLoading = async () => {
  let res = await request.get("/graph/isloading");
  reload.value = res;
  if (res) {
    getList();
  }
}

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

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 3,
    id: null,
    chain: null,
    state: null,
    task: null
  },
  rules: {
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
        //neighbor是一个字符串，如"1,2,3"
        form.value.neighbor = added.value.map(item => item.id).join(",");
        added.value = [];
        addBusiness(form.value).then(response => {

          let htmlString = "<div style='text-align: left;'>" +
              "<p>企业编号：" + form.value.id + "</p>" +
              "<p>企业名称：" + form.value.name + "</p>" +
              "<p>企业地址：" + form.value.address + "</p>" +
              "<p>所属产业链：" + form.value.chain + "</p>" +
              "<p>所属网络层：" + form.value.layer +
              "</p><p>企业邻居节点编号：" + form.value.neighbor + "</p>" +
              "<p>所属园区：" + form.value.park + "</p>" +
              "<p>具有技能种类数量：" + form.value.skillNum + "</p>" +
              "</div>"
          ElMessageBox.alert(htmlString, '新增企业信息', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            callback: (action) => {
              ElMessage({
                type: 'success',
                message: "新增成功",
              })
            },
          })
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

const taskView = ref(false);
const switchTaskView = () => {
  taskView.value = true;
}

const switchBusiness = () => {
  console.log("切换企业列表");
  taskView.value = false;
}

getList();
const state = ['空闲', '工作'];
const tagType = ['success', 'danger'];
const showDrawer = ref(false);
const drwaerTitle = ref("");

let currentId;


//抽屉中的资源图
const resourceChart = ref(null);
let category = [];
let lineData = [];
let barData = [];
// option
let resourceOption = {
  backgroundColor: '#0f375f',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  title: {
    text: "企业资源详情",
    textStyle: {
      color: "white"
    }
  },
  legend: {
    data: ['总量', '企业拥有量'],
    textStyle: {
      color: '#ccc'
    }
  },
  xAxis: {
    data: category,
    axisLine: {
      lineStyle: {
        color: '#ccc'
      }
    }
  },
  yAxis: {
    splitLine: {show: false},
    axisLine: {
      lineStyle: {
        color: '#ccc'
      }
    }
  }
};
let resourceChartInstance = null;

const getResource = async () => {
  let res = await request.get("/taskallocation/business/resource?id=" + currentId + "&type=bus");
  category = res.categories;
  lineData = res.lineData;
  barData = res.barData;
  resourceOption.series = [
    {
      name: '总量',
      type: 'line',
      smooth: true,
      showAllSymbol: true,
      symbol: 'emptyCircle',
      symbolSize: 15,
      data: lineData
    },
    {
      name: '企业拥有量',
      type: 'bar',
      barWidth: 10,
      itemStyle: {
        borderRadius: 5,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {offset: 0, color: '#14c8d4'},
          {offset: 1, color: '#43eec6'}
        ])
      },
      data: barData
    },
    {
      name: 'line',
      type: 'bar',
      barGap: '-100%',
      barWidth: 10,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {offset: 0, color: 'rgba(20,200,212,0.5)'},
          {offset: 0.2, color: 'rgba(20,200,212,0.2)'},
          {offset: 1, color: 'rgba(20,200,212,0)'}
        ])
      },
      z: -12,
      data: lineData
    },
    {
      name: 'dotted',
      type: 'pictorialBar',
      symbol: 'rect',
      itemStyle: {
        color: '#0f375f'
      },
      symbolRepeat: true,
      symbolSize: [12, 4],
      symbolMargin: 1,
      z: -10,
      data: lineData
    }
  ];
  resourceOption.xAxis.data = category;
  resourceChartInstance.setOption(resourceOption);
}

const createResourceChart = () => {
  resourceChartInstance = echarts.init(resourceChart.value);
  resourceChartInstance.setOption(resourceOption);
  getResource();
}
const openDrawer = (row) => {
  showDrawer.value = true;
  drwaerTitle.value = row.name;
  currentId = row.id;
  nextTick(() => {
    createResourceChart();
  })
}
const tips = ref([]);
const kw = ref('');
const added = ref([]);

const searchNeighbor = async () => {
  console.log("搜索邻居");
  let res = await request.get("/taskallocation/business/neighbor?kw=" + kw.value);
  tips.value = res;
}

//添加邻居
const addneighbor = (tip) => {
  added.value.push(tip);
  kw.value = '';
  tips.value = [];
}
//删除已添加的邻居
const handleClose = (tip) => {
  added.value.splice(added.value.indexOf(tip), 1);
}

onMounted(() => {
  setInterval(checkLoading, 2000);
});

</script>

<template>
  <div class="container">
    <el-card shadow="hover" class="card">
      <div class="app-container" v-if="!taskView">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
          <el-form-item label="企业编号" prop="id">
            <el-input
                v-model="queryParams.id"
                placeholder="请输入企业编号"
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
          <el-form-item label="联盟编号" prop="task">
            <el-input
                v-model="queryParams.task"
                placeholder="请输入联盟编号"
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
                @click="handleExport"
                v-hasPermi="['taskallocation:business:export']"
            >导出
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="success"
                plain
                @click="switchTaskView"
            >切换任务列表
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="businessList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="企业编号" align="center" prop="id">
          </el-table-column>
          <el-table-column label="企业名称" align="center" prop="name">
            <template #default="scope">
              <el-link type="primary"
                       @click="openDrawer(scope.row)"
              >{{ scope.row.name }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="企业邻居节点" align="center" prop="neighbor"/>
          <el-table-column label="具有资源种类数量" align="center" prop="skillNum"/>
          <el-table-column label="企业地址" align="center" prop="address"/>
          <el-table-column label="所属产业链" align="center" prop="chain"/>
          <el-table-column label="所属园区" align="center" prop="park"/>
          <el-table-column label="联盟编号" align="center">
            <template #default="scope">
              {{
                scope.row.task === 0 ? '暂无' : scope.row.task
              }}
            </template>
          </el-table-column>
          <el-table-column label="所属网络层" align="center" prop="layer"/>
          <el-table-column label="当前状态" align="center" prop="state">
            <template #default="scope">
              <el-tag :type="tagType[scope.row.state - 1]">
                {{ state[scope.row.state - 1] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width"
                           width="200"
          >
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
            <!--            prop="neighbor"-->
            <el-form-item label="企业邻居节点" prop="neighbor">
              <el-input v-model="kw" placeholder="请输入企业邻居节点名称" @keyup="searchNeighbor">
              </el-input>
              <div class="tippanel" v-if="kw!=''">
                <!--                <h4 v-for="tip in tips" :key="tip.id">{{ tip.name }}</h4>-->
                <!--                使用el-table展示，不需要表头-->
                <el-table :data="tips" :show-header="false" stripe>
                  <el-table-column label="企业名称" prop="name" width="180">
                  </el-table-column>
                  <el-table-column label="操作" align="right" class-name="small-padding fixed-width"
                                   width="100"
                  >
                    <template #default="scope">
                      <el-button type="primary" @click="addneighbor(scope.row)">添加</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="addedpanel" v-else>
                <el-tag
                    v-for="tip in added"
                    :key="tip.id"
                    closable
                    @close="handleClose(tip)"
                >{{ tip.name }}
                </el-tag>
              </div>
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
            <el-form-item label="经度" prop="longitude">
              <el-input v-model="form.longitude" placeholder="请输入经度"/>
            </el-form-item>
            <el-form-item label="纬度" prop="latitude">
              <el-input v-model="form.latitude" placeholder="请输入纬度"/>
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
      <Task v-else @switchBusiness="switchBusiness"></Task>
    </el-card>
    <el-row>
      <el-col :span="12">
        <el-card shadow="hover" class="card">
          <MultiChart :isloading="reload"></MultiChart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover"
                 class="card">
          <div class="chart">
            <Map :isloading="reload"></Map>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-drawer direction="rtl" v-model="showDrawer">
      <template #header>
        <h3>{{ drwaerTitle }}</h3>
      </template>
      <div ref="resourceChart" style="width:100%;height:300px">
      </div>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.container {

  .card {
    margin-left: 10px;
    margin-top: 10px;
  }

  .chart {
    width: 100%;
    height: 500px;
  }

}
</style>