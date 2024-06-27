<script setup>
import request from "@/utils/request.js";
import ResourcePie from "@/views/coalitionformation/userCenter/ResourcePie.vue";
import CompanyTaskTable from "@/views/coalitionformation/userCenter/CompanyTaskTable.vue";
import CompanyCoalitionTable from "@/views/coalitionformation/userCenter/CompanyCoalitionTable.vue";
import {ElMessage} from "element-plus";
import GyCoalitionTable from "@/views/coalitionformation/userCenter/GyCoalitionTable.vue";
import TaskCompletion from "@/views/coalitionformation/userCenter/TaskCompletion.vue";

let currentCompany = ref(null);
let companyResource = ref([]);
const chains = ['洗衣机产业链', '空调产业链', '汽车产业链']
const companyTypes = ['原料供应', '零件生产', '整机组装', '销售和回收']
const state = ['异常', '工作', '空闲']
let data = ref([]);
onMounted(async () => {
  let res = await request({
    url: "/userCenter/getUserInfo"
  })
  currentCompany.value = res[0];
  let res2 = await request({
    url: "/resource/getCompanyResource",
    params: {
      companyId: res[0].id,
      layerId: res[0].layerId
    }
  })
  companyResource.value = res2;
  data.value = res2.map(item => {
    return {
      name: item.name,
      value: item.num
    }
  })
})

let toggle = ref(1);
let cname = ref('小鸭家电');
let chain = ref('洗衣机产业链');

let cResource = ref([]);
const getCompanyResource = async () => {
  const res = await request({
    url: "/resource/getCompanyResource",
    params: {
      companyId: 1,
      layerId: 1
    }
  })
  cResource.value = res;
  cResource.value.forEach(resource => {
    resource.isAdd = false;
    resource.isUpdate = false;
    resource.isDelete = false;
  })
}
const addedResource = ref([]);
const addResource = () => {
  addedResource.value.push({
    id: "",
    name: "",
    num: "",
  })
}


const handleDelete = (resource) => {
  resource.isDelete = true;
}

const handleUpdate = (resource) => {
  resource.isUpdate = true;
}
const getResourceNameById = async (resource) => {
  const r = await request({
    url: "/resource/getone",
    params: {
      id: resource.id,
      companyId: 1,
      layerId: 1
    }
  })
  resource.name = r.name;
}

const addedDelete = (resource) => {
  const index = addedResource.value.indexOf(resource);
  addedResource.value.splice(index, 1);
}

const submit = () => {
  let updateArr = [];
  cResource.value.forEach(item => {
    if (item.isUpdate && !item.isDelete) {
      updateArr.push({
        id: item.id,
        name: item.name,
        num: item.num
      })
    }
  })
  let deleteArr = [];
  cResource.value.map((item) => {
    if (item.isDelete) {
      deleteArr.push({
        id: item.id,
        name: item.name,
        num: item.num
      })
    }
  })
  if (updateArr.length > 0) {
    request({
      url: "/resource/updateCompanyResource",
      method: 'put',
      params: {
        companyId: 1,
        layerId: 1
      },
      data: updateArr
    })
  }
  if (deleteArr.length > 0) {
    request({
      url: "/resource/deleteCompanyResource",
      method: 'delete',
      params: {
        companyId: 1,
        layerId: 1,
        resources: deleteArr.map(item => item.id).join(",")
      },
    })
  }
  if (addedResource.value.length > 0) {
    request({
      url: "/resource/insertCompanyResource",
      method: 'post',
      params: {
        companyId: 1,
        layerId: 1,
      },
      data: addedResource.value
    })
    addedResource.value = [];
  }
  ElMessage.success('资源修改成功');
}

onMounted(() => {
  getCompanyResource();
})

let processData = [
  {
    processName: "冲压成型",
    equipment: "冲床",
    duration: 2,
    personnel: "2人",
    qualityControl: "尺寸检测"
  },
  {
    processName: "焊接",
    equipment: "焊机",
    duration: 1.5,
    personnel: "3人",
    qualityControl: "焊缝检测"
  },
  {
    processName: "喷涂",
    equipment: "喷涂机",
    duration: 1,
    personnel: "2人",
    qualityControl: "涂层厚度检测"
  },
  {
    processName: "组装",
    equipment: "组装线",
    duration: 3,
    personnel: "5人",
    qualityControl: "整机检测"
  },
  {
    processName: "包装",
    equipment: "包装机",
    duration: 0.5,
    personnel: "2人",
    qualityControl: "包装完好性检查"
  },
  {
    processName: "检测",
    equipment: "检测仪",
    duration: 1,
    personnel: "2人",
    qualityControl: "电气性能检测"
  },
  {
    processName: "调试",
    equipment: "测试台",
    duration: 2,
    personnel: "3人",
    qualityControl: "运行调试"
  },
  {
    processName: "切割",
    equipment: "激光切割机",
    duration: 1.2,
    personnel: "2人",
    qualityControl: "切割精度检测"
  },
  {
    processName: "打磨",
    equipment: "打磨机",
    duration: 1,
    personnel: "2人",
    qualityControl: "表面光洁度检测"
  },
  {
    processName: "清洗",
    equipment: "清洗机",
    duration: 0.8,
    personnel: "1人",
    qualityControl: "清洁度检测"
  },
  {
    processName: "装配",
    equipment: "装配台",
    duration: 2.5,
    personnel: "4人",
    qualityControl: "部件匹配度检测"
  },
  {
    processName: "绝缘测试",
    equipment: "绝缘测试仪",
    duration: 0.7,
    personnel: "1人",
    qualityControl: "绝缘性能检测"
  },
  {
    processName: "喷砂",
    equipment: "喷砂机",
    duration: 1.3,
    personnel: "2人",
    qualityControl: "表面粗糙度检测"
  },
  {
    processName: "热处理",
    equipment: "热处理炉",
    duration: 3.5,
    personnel: "2人",
    qualityControl: "硬度检测"
  },
  {
    processName: "电镀",
    equipment: "电镀槽",
    duration: 2.5,
    personnel: "3人",
    qualityControl: "镀层厚度检测"
  },
  {
    processName: "冷却",
    equipment: "冷却装置",
    duration: 1,
    personnel: "1人",
    qualityControl: "温度检测"
  },
  {
    processName: "粘接",
    equipment: "粘接机",
    duration: 1.2,
    personnel: "2人",
    qualityControl: "粘接强度检测"
  },
  {
    processName: "冲孔",
    equipment: "冲孔机",
    duration: 1.5,
    personnel: "2人",
    qualityControl: "孔位精度检测"
  },
  {
    processName: "组焊",
    equipment: "自动焊接机",
    duration: 2,
    personnel: "3人",
    qualityControl: "焊接强度检测"
  },
  {
    processName: "喷涂前处理",
    equipment: "前处理设备",
    duration: 0.5,
    personnel: "1人",
    qualityControl: "表面处理效果检测"
  }
]

let pageNum = 1;
let pageSize = 17;
const list = ref([]);
const getList = () => {
  list.value = processData.slice((pageNum - 1) * pageSize, pageNum * pageSize);
}
onMounted(() => {
  getList();
})

const formRef = ref(null);

const form = reactive({
  errorCode: '',
  description: '',
  occurrenceTime: '',
  handler: '',
  handlerDescription: ''
});

const rules = reactive({
  errorCode: [{ required: true, message: '请输入异常代码', trigger: 'blur' }],
  description: [{ required: true, message: '请输入异常描述', trigger: 'blur' }],
  occurrenceTime: [{ required: true, message: '请选择发生时间', trigger: 'change' }],
  handler: [{ required: true, message: '请输入处理人', trigger: 'blur' }],
  handlerDescription: [{ required: true, message: '请输入处理描述', trigger: 'blur' }]
});

const onSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('提交成功');
      // 在这里处理提交逻辑
    } else {
      ElMessage.error('请填写完整的表单');
      return false;
    }
  });
};

const onReset = () => {
  formRef.value.resetFields();
};
</script>

<template>
  <div class="container">
    <div class="header">
      <span class="text">当前登录企业为：
        <span class="cname">小鸭家电</span>
      </span>
      <el-button type="primary" @click="toggle=1">编辑企业基本信息</el-button>
<!--      <el-button type="primary" @click="toggle=2">工艺联盟</el-button>-->
      <el-button type="primary" @click="toggle=3">企业任务</el-button>
    </div>
    <div class="body">
      <div class="companyinfo" v-show="toggle==1">
        <el-row :gutter="30" style="margin-bottom: 10px">
          <el-col :span="6">
            <el-card shadow="hover">
              <template #header>
                <div style="text-align: center">
                  <span style="font-weight: 600">企业基本信息</span>
                </div>
              </template>
              <el-form label-width="120px">
                <el-form-item label="企业编号" :model="currentCompany">
                  <el-input :value="currentCompany?.id" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="企业名称">
                  <el-input value="小鸭家电" style="width:100px"></el-input>
                </el-form-item>
                <el-form-item label="所在产业链">
                  <el-input :value="chains[currentCompany?.layerId-1]" style="width:120px"></el-input>
                </el-form-item>
                <el-form-item label="企业地址">
                  <el-input value="山东省青岛市" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="企业类型">
                  <el-input :value="companyTypes[currentCompany?.companyType-1]" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="当前状态">
                  <el-input :value="state[currentCompany?.status-1]" style="width:100px"></el-input>
                </el-form-item>
                <el-form-item label="拥有资源种类数">
                  <el-input :value="companyResource.length" style="width:100px"></el-input>
                </el-form-item>
                <el-form-item label="当前联盟编号">
                  <el-input :value="currentCompany?.coalitionId" style="width:100px"></el-input>
                </el-form-item>
                <el-form-item label="专利数量">
                  <el-input :value="10" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="最大产能">
                  <el-input :value="152.09" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="企业规模">
                  <el-input value="大型" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="注册资本">
                  <el-input :value="1000" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="法人代表">
                  <el-input value="张瑞敏" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="最大产能">
                  <el-input :value="152.09" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="员工数量">
                  <el-input :value="1664" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="年度营业额">
                  <el-input :value="7741.35" style="width:150px"></el-input>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover">
<!--              <template #header>-->
<!--                <div style="text-align: center">-->
<!--                  <span style="font-weight: 600">企业基本信息</span>-->
<!--                </div>-->
<!--              </template>-->
              <el-form label-width="120px">
                <el-form-item label="产品" :model="currentCompany">
                  <el-input value="脱水桶" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="员工培训效果">
                  <el-input value="10" style="width:100px"></el-input>
                </el-form-item>
                <el-form-item label="年度利润">
                  <el-input value="1232.01" style="width:120px"></el-input>
                </el-form-item>
                <el-form-item label="年度支出款">
                  <el-input value="1019.79" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="负债率">
                  <el-input value="6.77" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="仓储数量">
                  <el-input value="24" style="width:100px"></el-input>
                </el-form-item>
                <el-form-item label="仓储自动化程度">
                  <el-input value="10" style="width:100px"></el-input>
                </el-form-item>
                <el-form-item label="运输方式">
                  <el-input value="海运" style="width:100px"></el-input>
                </el-form-item>
                <el-form-item label="运输能力">
                  <el-input value="10" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="运送准时率">
                  <el-input value="152.09" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="运输成本">
                  <el-input value="365.47" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="最大产能">
                  <el-input :value="1858.91" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="新产品开发">
                  <el-input value="204" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="客户数量">
                  <el-input :value="9225" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="市场占有率">
                  <el-input :value="95.72" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="品牌知名度">
                  <el-input :value="9" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="平均交货时间">
                  <el-input :value="15" style="width:150px"></el-input>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" style="margin-bottom: 20px;height: 450px">
              <template #header>
                <div style="text-align: center">
                  <span style="font-weight: 600">企业资源详情</span>
                </div>
              </template>
              <el-form label-width="200px">
                <el-form-item label="企业名称">
                  <el-row :gutter="5">
                    <el-col :span="12">
                      <el-input :value="cname" disabled></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="企业所属产业链">
                  <el-row :gutter="5">
                    <el-col :span="12">
                      <el-input :value="chain" disabled style="width:150px"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="资源详情">
                  <template v-for="resource in cResource" :key="resource.id">
                    <el-row :gutter="5" v-if="!resource.isDelete">
                      <el-col :span="3">
                        <el-button link icon="Delete" @click="handleDelete(resource)"></el-button>
                      </el-col>
                      <el-col :span="7">
                        <el-input v-model="resource.id" disabled></el-input>
                      </el-col>
                      <el-col :span="7">
                        <el-input v-model="resource.name" disabled></el-input>
                      </el-col>
                      <el-col :span="7">
                        <el-input v-model="resource.num" @change="handleUpdate(resource)"></el-input>
                      </el-col>
                    </el-row>
                  </template>
                </el-form-item>
                <el-form-item label="添加资源">
                  <el-button link type="primary" @click="addResource">点击此处添加资源</el-button>
                </el-form-item>
                <el-form-item>
                  <template v-for="(resource,index) in addedResource" :key="index">
                    <el-row :gutter="5">
                      <el-col :span="2">
                        <el-button link icon="Delete" @click="addedDelete(resource)"></el-button>
                      </el-col>
                      <el-col :span="7">
                        <el-input v-model="resource.id" @keyup="getResourceNameById(resource)"
                                  placeholder="输入资源编号"></el-input>
                      </el-col>
                      <el-col :span="7">
                        <el-input v-model="resource.name" disabled></el-input>
                      </el-col>
                      <el-col :span="8">
                        <el-input v-model="resource.num" placeholder="范围[100-200]"></el-input>
                      </el-col>
                    </el-row>
                  </template>
                </el-form-item>
                <div class="dialog-footer">
                  <el-button type="primary" @click="submit">提交资源修改</el-button>
                </div>
              </el-form>
            </el-card>
            <el-card shadow="hover">
              <ResourcePie :data="data" v-if="data.length>0"/>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="gycoalition" v-show="toggle==2">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-card shadow="hover" style="margin-bottom: 20px;padding: 0">
              <GyCoalitionTable/>
            </el-card>
            <el-card shadow="hover" style="margin-bottom: 20px">
              <el-image style="width: 100%; height: 400px" src="/src/assets/images/gycoalition.png" :fit="fit"/>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <div style="text-align: center">
                  <span style="font-weight: 600;margin-right: 10px" >所需工艺信息</span>
                  <el-button type="primary" size="small">工艺联盟形成</el-button>
                </div>
              </template>
              <el-table :data="list" style="width: 100%">
                <el-table-column prop="processName" label="工艺名称" width="180"/>
                <el-table-column prop="equipment" label="所需设备" width="180"/>
                <el-table-column prop="duration" label="工艺时长(小时)" width="180"/>
                <el-table-column prop="personnel" label="所需人员" width="180"/>
                <el-table-column prop="qualityControl" label="质量控制" width="180"/>
              </el-table>
              <pagination
                  :total="20"
                  v-model:page="pageNum"
                  v-model:limit="pageSize"
                  @pagination="getList"
              />
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="companytask" v-show="toggle==3">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="hover" style="margin-bottom: 20px">
              <template #header>
                <div style="text-align: center">
                  <span style="font-weight: 600">我发布的任务</span>
                </div>
              </template>
              <CompanyTaskTable :current-company="1"/>
            </el-card>
            <el-card shadow="hover">
              <template #header>
                <div style="text-align: center">
                  <span style="font-weight: 600">我加入的联盟信息</span>
                </div>
              </template>
              <CompanyCoalitionTable :current-company="1"/>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" style="margin-bottom: 10px">
              <template #header>
                <div style="text-align: center">
                  <span style="font-weight: 600">我发布的任务完成情况</span>
                </div>
              </template>
              <TaskCompletion/>
            </el-card>
            <el-card shadow="hover">
              <template #header>
                <div style="text-align: center">
                  <span style="font-weight: 600">异常任务提交</span>
                </div>
              </template>
                <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
                  <el-form-item label="异常代码" prop="errorCode">
                    <el-input v-model="form.errorCode"></el-input>
                  </el-form-item>
                  <el-form-item label="异常描述" prop="description">
                    <el-input v-model="form.description"></el-input>
                  </el-form-item>
                  <el-form-item label="发生时间" prop="occurrenceTime">
                    <el-date-picker v-model="form.occurrenceTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="处理人" prop="handler">
                    <el-input v-model="form.handler"></el-input>
                  </el-form-item>
                  <el-form-item label="处理描述" prop="handlerDescription">
                    <el-input type="textarea" v-model="form.handlerDescription"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button @click="onReset">重置</el-button>
                  </el-form-item>
                </el-form>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  width: 50%;
  margin: 10px auto;
  display: flex;
  align-items: center;

  .text {
    font-size: 20px;
    margin-right: 20px;

    .cname {
      font-weight: 600;
    }
  }
}

.companyinfo {
  width: 90%;
  margin: 0 auto;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.gycoalition {
  margin-left: 10px
}
</style>