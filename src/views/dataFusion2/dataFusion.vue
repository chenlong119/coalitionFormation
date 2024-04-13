<script setup>
import Step2 from './components/Step2.vue'
import Step3 from './components/Step3.vue'
import {computed, reactive, ref, watch} from "vue";
// import jsonData from "../../assets/dataFusion/company.json"
import axios from 'axios';
import {ArrowLeft, ArrowRight} from '@element-plus/icons-vue'
// 读取json数据并将其存储到nodeData数组和linkData数组中
const nodeData = reactive([]);
const linkData = reactive([]);
const emits = defineEmits(['onNodeSelected']);
// for (const node of jsonData.nodes) {
//   nodeData.push({
//     id: node.id,
//     name: node.name,
//     requirements: node.requirements,
//     products: node.products,
//     deadline: node.deadline,
//     lastTime: node.lastTime,
//     numbers: node.numbers,
//     lists: node.lists,
//     category: node.category,
//     x: node.x,
//     y: node.y
//   });
// }
// for (const link of jsonData.links) {
//   linkData.push({
//     source: link.source,
//     target: link.target,
//     relation: link.label.formatter,
//   });
// }

// 计算与所选节点相关的所有节点信息和连接信息
const selectedNode = ref(""); //用户选择的节点
const relatedNodesWithout = reactive([]);
const relatedNodeIds = new Set();

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
  let tempRelatedNodes1 = nodeData.filter((node) => relatedNodeIds.has(node.id) && node.id !== selectedNode.value); //没有加上选中节点
  // 将相关连接信息添加到相关节点信息中，并添加序号
  tempRelatedNodes1.forEach((node, index) => {
    node.relation = relatedLinks
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => link.relation)
        .join(",");
    node.index = index + 1;
  });
  relatedNodesWithout.value = tempRelatedNodes1;
  console.log(relatedNodesWithout.value);

}, {deep: true});
//"查看详情"功能
const infoDialogVisible = ref(false)
const formLabelWidth = '140px'
let info = ref({
  id: '',
  name: '',
  index: -1,
  requirements: '',
  products: '',
  deadline: '',
  lastTime: '',
  numbers: '',
  lists: '',
  category: '',
  relation: [],
  x: -1,
  y: -1,
  deleted: false
});
const handleInfo = (row) => {
  infoDialogVisible.value = true
  info.value = row
}

const buttonNames = ['企业关联分析'];
const active = ref(0)
const formInline = reactive({
  user: '',
  region: '',
})
const taskData = reactive({
  name: "",
  requirements: "",
  products: "",
  deadline: "",
  lastTime: "",
  numbers: "",
  lists: "",
})
let tableData = reactive({
  filterData: []
})
const open = ref(false);
const title = ref("");
const state = reactive({
  dormitory: [],
  currentPage: 1,
  totalCount: 100,
  pageSizes: [5, 10],
  PageSize: 5,
})

function handleSizeChange(val) {
  // 改变每页显示的条数
  this.PageSize = val
  // 注意：在改变每页显示的条数时，要将页码显示到第一页
  this.state.currentPage = 1
}

//分页展示，每页展示8个企业
const pageSize = 5
//当前页
let currentPage = ref(1);
let currentTaskList = computed(() => {
  return tableData.filterData.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize);
})
const handleCurrentChange = (val) => {
  currentPage.value = val
}
const {proxy} = getCurrentInstance();
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    requirements: null,
    products: null,
    ddl: null,
    duration: null,
    number: null,
    lists: null
  },
  rules: {
    name: [
      {required: true, message: "企业名称不能为空", trigger: "blur"}
    ],
    requirements: [
      {required: true, message: "企业资源需求不能为空", trigger: "change"}
    ],
    products: [
      {required: true, message: "企业预估产量不能为空", trigger: "change"}
    ],
    ddl: [
      {required: true, message: "企业截止时间不能为空", trigger: "blur"}
    ],
    duration: [
      {required: true, message: "企业持续时长不能为空", trigger: "blur"}
    ],
    number: [
      {required: true, message: "企业参与企业数量不能为空", trigger: "blur"}
    ],
    lists: [
      {required: true, message: "企业参与企业名单不能为空", trigger: "change"}
    ]
  }
});
const {queryParams, form, rules} = toRefs(data);

const back = () => {
  active.value--
}
const next = () => {
  active.value++
}

function searchTasks() {
  const category = formInline.region;
  axios.get('/src/assets/dataFusion/company.json').then(response => {
    let data = response.data.nodes;
    tableData.filterData = data.filter(item => item.category == category);
    console.log(tableData.filterData)
  })
  currentPage.value = 1;
}

function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加企业表 ";
}

function reset() {
  form.value = {
    id: null,
    name: null,
    requirements: null,
    products: null,
    ddl: null,
    duration: null,
    number: null,
    lists: null,
  };
  proxy.resetForm("taskAllocationRef");
}

const indexMethod = (index) => {
  return index + 1;
};

function submitForm() {
  // proxy.$refs["taskAllocationRef"].validate(valid => {
  //   if (valid) {
  //     if (form.value.id != null) {
  //       updateTaskAllocation(form.value).then(response => {
  //         proxy.$modal.msgSuccess("修改成功");
  //         open.value = false;
  //         getList();
  //       });
  //     } else {
  //       addTaskAllocation(form.value).then(response => {
  //         proxy.$modal.msgSuccess("新增成功");
  //         open.value = false;
  //         getList();
  //       });
  //     }
  //   }
  // });
  proxy.$refs["taskAllocationRef"].validate(valid => {
    if (valid) {
      proxy.$modal.msgSuccess("新增成功");
      open.value = false;
    }
  });
}

function cancel() {
  open.value = false;
  reset();
}

</script>

<template>
  <div>
    <!--    <el-card class="step-card">-->
    <!--      <el-steps :active="active" align-center>-->
    <!--        <el-step title="产业链模型" :icon="OfficeBuilding" description="Step 1" finish-status="success" />-->
    <!--        <el-step title="协作团体发现" :icon="View" description="Step 2" />-->
    <!--        <el-step title="关联耦合" :icon="Switch" description="Step 3" />-->
    <!--      </el-steps>-->
    <!--    </el-card>-->
    <div>
      <el-card class="content-card">
        <!--        <div v-if="active === 0">-->
        <!--          <Step1></Step1>-->
        <!--        </div>-->
        <div v-if="active === 0">
          <Step2></Step2>
        </div>
        <div v-if="active === 1">
          <Step3></Step3>
        </div>
      </el-card>
      <!--      <div class="button-container">-->
      <!--        <el-button class="button" :icon="ArrowLeft" type="primary" plain style="margin-top: 12px" @click="back"-->
      <!--                   v-show="active !== 0">上一步-->
      <!--        </el-button>-->
      <!--        <div class="right-button-container">-->
      <!--          <el-button type="primary" plain style="margin-top: 12px" @click="next" v-show="active !== 2">-->
      <!--            {{ buttonNames[active] }}-->
      <!--            <el-icon>-->
      <!--              <ArrowRight/>-->
      <!--            </el-icon>-->
      <!--          </el-button>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="button-container">
        <el-button :icon="ArrowLeft" type="primary" plain @click="back" v-show="active !== 0">上一步</el-button>
        <div class="right-button-container">
          <el-button type="primary" plain @click="next" v-show="active !== 1">
            <!--            {{ active === 0 ? '企业关联分析' : buttonNames[active] }}-->
            企业关联分析
            <el-icon>
              <ArrowRight/>
            </el-icon>
          </el-button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">

.table {
  border: #2c3e50;
  align-content: center;
}

.custom-table {
  border-width: 2px; /* 设置表格线条粗细 */
}

/* 首行底色更深 */
.custom-table .el-table__header-wrapper th {
  background-color: #181616; /* 设置首行底色 */
  color: white; /* 设置首行文字颜色 */
}

.topicText {
  text-align: center;
  font-family: BlinkMacSystemFont;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.flex-container {
  display: flex;
  align-items: center;
}

.header-text {
  margin-right: 10px;
  font-weight: bold
}

.button-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.button-container .el-button {
  font-size: 18px; /* Increase the font size */
  padding: 15px 30px; /* Increase the padding to enlarge the button */
  margin: 12px 0; /* Adjust the margin for spacing */
}

.right-button-container {
  display: flex;
  align-items: center;
}


</style>
