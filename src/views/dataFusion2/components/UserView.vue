<script setup>

import {computed, onMounted, reactive, ref, watch} from 'vue'
import {
  getAllCompanyAndLink,
  getAllCompanyWithoutLocation,
  getImportantNodes,
  getTotalRelation
} from "@/api/datafusion/test";
//定义组件的自定义事件
const nodeData = reactive([]);
const companyData = reactive([]);
const relationData = reactive([]);
const linkData = reactive([]);
const importantNodes = reactive([]);
getAllCompanyAndLink().then(response => {
  for (const node of response.nodes) {
    nodeData.push({
      id: node.id,
      name: node.name,
      chain: node.chain,
      layer: node.layer,
      category: node.category,
      locationId: node.locationId
    });
  }
})
getTotalRelation().then(response => {
  for (const link of response.links) {
    linkData.push({
      source: link.sourceLocation,
      target: link.targetLocation,
      relation: link.strengthRelation,
      relation1: link.supplyRelation,
      relation2: link.cooperationRelation,
      relation3: link.competitionRelation,
      analysis: link.analysis
    });
  }
})
getAllCompanyWithoutLocation().then(response => {
  for (const node of response.nodes) {
    companyData.push({
      id: node.id,
      name: node.name,
      chain: node.chain,
      category: node.category,
      marketShare: node.marketShare,
      marketIncrease: node.marketIncrease,
      profitability: node.profitability,
      investRatio: node.investRatio,
      productWidth: node.productWidth,
      productDepth: node.productDepth,
      brandAwareness: node.brandAwareness,
      cooperationWillingness: node.cooperationWillingness,
      reputation: node.reputation,
      cooperationNum: node.cooperationNum,
      cooperationSuccess: node.cooperationSuccess,
      averageRoi: node.averageRoi,
      suppliersNum: node.suppliersNum,
      turnover: node.turnover,
      deliveryRate: node.deliveryRate,
      tradeLevel: node.tradeLevel,
    });
  }
})


let myChart;
// 读取json数据并将其存储到companyData数组和linkData数组中
const emits = defineEmits(['onNodeSelected']);
relationData.push(
    {
      id: 1,
      name: "竞争关系"
    },
    {
      id: 2,
      name: "供应关系"
    },
    {
      id: 3,
      name: "合作关系"
    }
)

//分页展示，每页展示8个企业
const pageSize = 5
//当前页
let currentPage = ref(1);
// 计算与所选节点相关的所有节点信息和连接信息
const selectedNode = ref("");
const relatedNodes = ref([]);
const selectedRelation = ref("");
const relatedNodesWithout = reactive([]);
const relatedNodeIds = new Set();
const handleCurrentChange = (val) => {
  currentPage.value = val
}

function handleSizeChange(val) {
  // 改变每页显示的条数
  this.PageSize = val
  // 注意：在改变每页显示的条数时，要将页码显示到第一页
  this.state.currentPage = 1
}

watch([selectedNode], () => {
  if (!selectedNode.value) {
    relatedNodes.value = [];
    return;
  }
  // 获取与所选节点相关的所有连接
  const relatedLinks = linkData.filter(
      (link) => link.source === selectedNode.value || link.target === selectedNode.value
  );
  relatedNodeIds.clear();
  for (const link of relatedLinks) {
    relatedNodeIds.add(link.source);
    relatedNodeIds.add(link.target);
  }
  let tempRelatedNodes1 = companyData.filter((node) => relatedNodeIds.has(node.id) && node.id !== selectedNode.value); //没有加上选中节点
  // 将相关连接信息添加到相关节点信息中，并添加序号
  tempRelatedNodes1.forEach((node, index) => {
    node.relation = relatedLinks
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => link.relation)
        .join(",");
    node.relation1 = relatedLinks
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => link.relation1)
        .join(",");
    node.relation2 = relatedLinks
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => link.relation2)
        .join(",");
    node.relation3 = relatedLinks
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => link.relation3)
        .join(",");
    node.analysis = relatedLinks
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => link.analysis)
        .join(",");
    node.index = index + 1;
  });
  relatedNodesWithout.value = tempRelatedNodes1;
  // handleSelectChange(selectedNode);
}, {deep: true});
//"查看详情"功能
const infoDialogVisible = ref(false)
const formLabelWidth = '140px'
let info = ref({
  id: '',
  name: '',
  chain: '',
  index: -1,
  marketShare: '',
  marketIncrease: '',
  profitability: '',
  investRatio: '',
  productWidth: '',
  productDepth: '',
  brandAwareness: '',
  cooperationWillingness: '',
  reputation: '',
  cooperationNum: '',
  cooperationSuccess: '',
  averageRoi: '',
  suppliersNum: '',
  turnover: '',
  deliveryRate: '',
  tradeLevel: '',
  category: '',
  relation1: [],
  relation2: [],
  relation3: [],
  analysis: [],
  x: -1,
  y: -1,
  deleted: false
});
const handleInfo = (row) => {
  infoDialogVisible.value = true
  info.value = row
}

const singleCompanyForm = reactive({
  companyName: ""
})

const formInline = reactive({
  user: '',
  region: '',
})

let tableData = reactive({
  filterData: []
})
let tableData2 = reactive({
  filterData: []
})

const querySearch = (queryString, cb) => {
  const results = queryString
      ? companyName.filter(createFilter(queryString))
      : companyName
  // call callback function to return suggestions
  cb(results)
}
const createFilter = (queryString) => {
  return (restaurant) => {
    return (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

function formatPercentage(row, column) {
  // 获取当前列的字段名
  const field = column.property;

  // 获取当前行的对应字段的值
  const value = row[field];

  // 将数值转换为百分比格式
  if (value !== null && value !== undefined) {
    return `${(value * 100).toFixed(1)}%`;
  } else {
    return ''; // 处理空值的情况
  }
}

function formatHundred(row, column) {
  // 获取当前列的字段名
  const field = column.property;

  // 获取当前行的对应字段的值
  const value = row[field];

  // 将数值转换为百分比格式
  if (value !== null && value !== undefined) {
    return `${(value * 100).toFixed(0)}`;
  } else {
    return ''; // 处理空值的情况
  }
}

function showGroupFeatures() {
  selectedGroup.value = formInline.region;
  selectedGroupFeature.value = groupFeatures.find(group => group.name === formInline.region)?.feature || '';
}


let groupData = ref([]);
let currentTaskList = computed(() => {
  return tableData.filterData.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize);
})
const handleSelectChange = (value) => {
  // console.log('Selected company ID:', value);
  searchCompanyInSameGroup(value);
};
const searchCompanyInSameGroup = async (selectedNodeId) => {
  try {
    const response = await getAllCompanyWithoutLocation();
    let data = response.nodes;
    fetchImportantNodes();
    const selectedCompany = data.find(item => item.id === selectedNodeId);

    if (selectedCompany) {
      const category = selectedCompany.category;
      tableData.filterData = data.filter(item => item.category === category && item.id !== selectedNodeId);
      currentPage.value = 1;
    } else {
      console.error("Selected company not found in the response data");
    }
  } catch (error) {
    console.error("Error fetching company data:", error);
  }
};
const rankData = ref([]);
const fetchImportantNodes = async () => {
  try {
    const response = await getImportantNodes();
    importantNodes.splice(0, importantNodes.length, ...response); // 使用splice更新响应式数组
    console.log(importantNodes);
    updateRankData();
  } catch (error) {
    console.error('获取重要节点失败:', error);
  }
};
const updateRankData = () => {
  rankData.value = importantNodes.map(node => {
    const company = companyData.find(company => company.id === node);
    return {
      ...node,
      name: company ? company.name : '未知企业'
    };
  });
};

</script>

<template>
  <div class="container">
    <div style="display: flex; justify-content: center; align-items: center;">
<!--    <span-->
<!--        style="font-size: 14px; font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; margin-right: 10px; font-weight: bold;">-->
<!--      个体企业：-->
<!--    </span>-->
      <el-select v-model="selectedNode" class="m-2" placeholder="请选择企业" size="large" filterable @change="handleSelectChange">
        <el-option v-for="item in companyData" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
    </div>
    <el-row :gutter="10" style="margin-bottom: 10px">
      <el-col :span="18">
        <el-row :gutter="10" style="margin-bottom: 10px">
          <el-col :span="24">
            <el-card shadow="hover">
              <template #header>
                <div style="text-align: center">
                  <span style="font-weight: 600">企业关联信息</span>
                </div>
              </template>
              <el-main>
                <div class="container-t">
                  <el-table :data="relatedNodesWithout.value" style="height:250px" border highlight-current-row
                            :header-cell-style="{height: '60px',}" :row-style="{ textAlign: 'center', height: '54px', }"
                            class="my-table custom-table">
                    <el-table-column fixed type="index" :index="indexMethod" label="序号" width="100"/>
                    <el-table-column prop="id" label="企业id" align="center" width="80px"/>
                    <el-table-column prop="name" label="企业名称" width="250px" align="center"/>
                    <el-table-column prop="category" label="所属团体" align="center"/>
                    <el-table-column prop="relation1" label="供应强度（0~1）" align="center"/>
                    <el-table-column prop="relation2" label="合作强度（0~1）" align="center"/>
                    <el-table-column prop="relation3" label="竞争强度（0~1）" align="center"/>
                    <el-table-column prop="relation" label="整体关联强度（0~1）" align="center"/>
                    <el-table-column prop="information" label="企业信息" width="">
                      <template #default="scope">
                        <el-button link type="primary" @click="handleInfo(scope.row)">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>


                <el-pagination v-model="currentPage" :page-size="pageSize" :pager-count="11" layout="prev, pager, next"
                               :total="relatedNodesWithout.length" @current-change="handleCurrentChange"
                               @size-change="handleSizeChange"/>

                <el-dialog v-model="infoDialogVisible" title="企业详情" align-center>
                  <el-form :model="info">
                    <el-form-item label="" :label-width="formLabelWidth">
                      企业id：{{ info.id }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      企业名称：{{ info.name }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      所属产业链：{{ info.chain }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      所属企业团体：{{ info.category }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      市场份额：{{ (info.marketShare * 100).toFixed(1) + "%" }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      市场增长率：：{{ (info.marketIncrease * 100).toFixed(1) + "%" }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      盈利率：{{ (info.profitability * 100).toFixed(1) + "%" }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      科研投入比例：{{ (info.investRatio * 100).toFixed(1) + "%" }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      产品线宽度：{{ info.productWidth }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      产品线深度：{{ info.productDepth }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      品牌知名度：{{ Math.round(info.brandAwareness * 100) }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      供应商数量：{{ info.suppliersNum }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      库存周转率：{{ (info.turnover * 100).toFixed(1) + "%" }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      准时交付率：：{{ (info.deliveryRate * 100).toFixed(1) + "%" }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      物流水平：{{ (info.tradeLevel * 100).toFixed(1) }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      合作意愿强度：{{ (info.cooperationWillingness * 100).toFixed(1) }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      信誉分：{{ (info.reputation * 100).toFixed(1) }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      参与合作数量：{{ info.cooperationNum }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      合作成功率：{{ (info.cooperationSuccess * 100).toFixed(1) + "%" }}
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                      合作项目平均收益率：{{ (info.averageRoi * 100).toFixed(1) + "%" }}
                    </el-form-item>
                  </el-form>
                </el-dialog>

              </el-main>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-card shadow="hover">
              <template #header>
                <div style="text-align: center">
                  <span style="font-weight: 600">企业团体信息</span>
                </div>
              </template>

              <el-row>
                <el-table :data="currentTaskList" style="width: 100%" border class="table custom-table">
                  <el-table-column fixed prop="name" label="企业名称" width="250px" align="center"/>
                  <el-table-column prop="marketShare" label="市场份额" width="" align="center" :formatter="formatPercentage"/>
                  <el-table-column prop="cooperationNum" label="参与合作次数" width="" align="center"/>
                  <el-table-column prop="suppliersNum" label="供应商数量" width="" align="center"/>
                  <el-table-column prop="cooperationWillingness" :label="'合作意愿强度\n(0~100)'" width="180px" align="center"
                                   :formatter="formatHundred"/>
                  <el-table-column prop="cooperationSuccess" label="合作成功率" width="100px" align="center"
                                   :formatter="formatPercentage"/>
                  <el-table-column prop="averageRoi" label="合作平均收益率" width="130px" align="center"
                                   :formatter="formatPercentage"/>
                </el-table>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="pageSize"
                    :total="tableData.filterData.length"
                    @current-change="handleCurrentChange"
                    class="mt-4"
                />
              </el-row>

            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div style="text-align: center">
              <span style="font-weight: 600">企业影响力排行榜</span>
            </div>
          </template>
          <div class="box-card">
            <el-table :data="rankData" class="el-table" stripe>
              <el-table-column type="index" label="排名" align="center" width="60%">
                <template #default="{ $index }">
                  <span v-if="$index === 0" class="rank-gold">🥇</span>
                  <span v-else-if="$index === 1" class="rank-silver">🥈</span>
                  <span v-else-if="$index === 2" class="rank-bronze">🥉</span>
                  <span v-else>{{ $index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="企业名称" :width="groupNameWidth" align="center"></el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
/* 增加表格行间距 */
.el-table .el-table__row {
  height: 80px; /* 你可以根据需要调整这个值 */
}
</style>