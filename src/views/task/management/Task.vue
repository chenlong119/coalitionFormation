<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-form-item label="任务状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择任务状态" clearable>
          <el-option
              v-for="dict in task_state"
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
            v-hasPermi="['task:management:add']"
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
            v-hasPermi="['task:management:edit']"
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
            v-hasPermi="['task:management:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['task:management:export']"
        >导出
        </el-button>
        <el-button
            type="success"
            plain
            @click="switchBusiness"
        >切换企业列表
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="managementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="任务编号" align="center" prop="id"/>
      <el-table-column label="任务名称" align="center" prop="name">
        <template #default="scope">
          <el-link type="primary" :underline="false" @click="openDrawer(scope.row)">{{ scope.row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="所需资源种类数量" align="center" prop="resourceNum"/>
      <el-table-column label="任务价值(万元)" align="center" prop="value"/>
      <el-table-column label="截止日期" align="center" prop="ddl" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.ddl, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="持续时长(天)" align="center" prop="duration"/>
      <el-table-column label="任务状态" align="center" prop="state">
        <template #default="scope">
          <el-tag :type="scope.row.state===1?'success':'danger'">
            <dict-tag :options="task_state" :value="scope.row.state"/>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="任务到达时间" align="center" prop="arrivalTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.arrivalTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联盟编号" align="center">
        <template #default="scope">
          <span v-if="scope.row.state===1">{{ scope.row.id }}</span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['task:management:edit']">修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['task:management:remove']">删除
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

    <!-- 添加或修改系统任务管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="managementRef" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入任务名称"/>
        </el-form-item>
        <el-form-item label="所需资源种类数量" prop="resourceNum">
          <el-input v-model="form.resourceNum" placeholder="请输入任务所需资源数量"/>
        </el-form-item>
        <el-form-item label="任务价值(万元)" prop="value">
          <el-input v-model="form.value" placeholder="请输入任务价值"/>
        </el-form-item>
        <el-form-item label="截止日期" prop="ddl">
          <el-date-picker clearable
                          v-model="form.ddl"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择截止日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="持续时长(天)" prop="duration">
          <el-input v-model="form.duration" placeholder="请输入持续时长"/>
        </el-form-item>
        <el-form-item label="任务到达时间" prop="arrivalTime">
          <el-date-picker clearable
                          v-model="form.arrivalTime"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择任务到达时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-drawer direction="rtl" v-model="showDrawer">
      <template #title>
        <h3>{{ drawerTitle }}</h3>
      </template>
      <div ref="resourceChart" style="width:100%;height:300px">
      </div>
    </el-drawer>
  </div>
</template>

<script setup name="Management">
import {addManagement, delManagement, getManagement, listManagement, updateManagement} from "@/api/task/management";
import {nextTick, ref} from "vue";
import request from "@/utils/request";
import * as echarts from "echarts";
import {ElMessage, ElMessageBox} from "element-plus";

const emits = defineEmits(["switchBusiness"]);

const {proxy} = getCurrentInstance();
const {task_state} = proxy.useDict('task_state');
const showDrawer = ref(false);

const drawerTitle = ref('');
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
    text: "任务资源详情",
    textStyle: {
      color: "white"
    }
  },
  legend: {
    data: ['资源总量', '任务所需资源数量'],
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
let currentId = null;

const getResource = async () => {
  let res = await request.get("/taskallocation/business/resource?id=" + currentId + "&type=task");
  category = res.categories;
  lineData = res.lineData;
  barData = res.barData;
  resourceOption.series = [
    {
      name: '资源总量',
      type: 'line',
      smooth: true,
      showAllSymbol: true,
      symbol: 'emptyCircle',
      symbolSize: 15,
      data: lineData
    },
    {
      name: '任务所需资源数量',
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
  currentId = row.id;
  // console.log("currentId:", currentId)
  nextTick(() => {
    drawerTitle.value = row.name;
    createResourceChart();
  })
}

const managementList = ref([]);
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
    name: null,
    state: null,
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

const switchBusiness = () => {
  //触发自定义事件
  emits("switchBusiness");
}

/** 查询系统任务管理列表 */
function getList() {
  loading.value = true;
  listManagement(queryParams.value).then(response => {
    managementList.value = response.rows;
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
    resourceNum: null,
    value: null,
    ddl: null,
    duration: null,
    state: null,
    arrivalTime: null
  };
  proxy.resetForm("managementRef");
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
  title.value = "添加系统任务管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getManagement(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改系统任务管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["managementRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateManagement(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addManagement(form.value).then(response => {
          let htmlstring = `<div>
            <p>任务名称：${form.value.name}</p>
            <p>任务价值：${form.value.value}</p>
            <p>截止日期：${form.value.ddl}</p>
            <p>持续时长：${form.value.duration}</p>
            <p>任务到达时间：${form.value.arrivalTime}</p>
            <p>所需资源种类数量：${form.value.resourceNum}</p>
          </div>`
          ElMessageBox.alert(htmlstring, '新增任务信息', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            callback: (action) => {
              ElMessage({
                type: 'success',
                message: "新增任务成功",
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
  proxy.$modal.confirm('是否确认删除系统任务管理编号为"' + _ids + '"的数据项？').then(function () {
    return delManagement(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('task/management/export', {
    ...queryParams.value
  }, `management_${new Date().getTime()}.xlsx`)
}

getList();
</script>

<style scoped lang="scss">

</style>