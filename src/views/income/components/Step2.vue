<template>
  <div style="margin-left: 20px; margin-top: 10px">
    <span>当前评估企业：</span
    ><span style="font-weight: bold; font-size: large"
      >{{ store.companyInfo.name }}（ID：{{
        store.companyInfo.companyId
      }}）</span
    >
  </div>

  <div class="search-box">
    <div class="search-container">
      <span>搜索：</span>
      <el-input v-model.trim="searchParam" placeholder="请输入关联企业名称" />
      <el-button
        :icon="Search"
        class="search-btn"
        @click="handleSearch"
      ></el-button>
      <el-button @click="clearSearch">清空搜索</el-button>
    </div>
    <div class="add-container">
      <el-button class="add-btn" type="primary" plain @click="toAdd"
        >新增关联企业</el-button
      >
      <el-button
        class="add-btn"
        type="primary"
        plain
        @click="recoverallRelatedNodes"
        >重置关联关系</el-button
      >
    </div>
  </div>

  <div style="display: flex; flex-direction: column; align-items: center">
    <el-table
      :data="showList"
      style="width: 88%; height: 600px; margin-bottom: 20px"
      highlight-current-row
      :header-cell-style="{
        height: '60px',
      }"
      :row-style="{ height: '70px' }"
      class="my-table"
    >
      <el-table-column
        fixed
        type="index"
        align="center"
        label="序号"
        :min-width="7"
      />
      <el-table-column
        prop="companyId"
        label="企业ID"
        align="center"
        :min-width="8"
      />
      <el-table-column
        prop="name"
        label="企业名称"
        align="center"
        :min-width="20"
      />
      <el-table-column
        prop="field"
        label="所处领域"
        align="center"
        :min-width="10"
      />
      <el-table-column
        prop="chainName"
        label="所处产业链"
        align="center"
        :min-width="15"
      />
      <el-table-column :min-width="20" align="center">
        <template #header>
          <div style="text-align: center">关联关系</div>
        </template>
        <template #default="scope">
          <el-tag type="warning" v-if="scope.row.isSupply === 1"
            >供应关系</el-tag
          >
          <el-tag type="success" v-if="scope.row.isCooperation === 1"
            >合作关系</el-tag
          >
          <el-tag type="info" v-if="scope.row.isCompetition === 1"
            >竞争关系</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="totalRelation"
        label="关联强度"
        align="center"
        :min-width="7"
      />
      <el-table-column prop="tool" label="操作" align="center" :min-width="13">
        <template #default="scope">
          <el-button
            type="primary"
            plain
            :icon="Edit"
            circle
            @click="editNode(scope.row)"
          />
          <el-button
            type="danger"
            plain
            :icon="Delete"
            circle
            @click="deleteNode(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: flex-start; margin-left: 10px">
      <el-button type="primary" @click="submitModify()">提交</el-button>
    </div>
  </div>

  <el-dialog v-model="editDialogVisible" title="修改关联企业" align-center>
    <el-form :model="companyForm">
      <el-form-item label="" :label-width="formLabelWidth">
        <strong>当前评估企业：{{ store.companyInfo.name }}</strong>
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth"></el-form-item>

      <el-form-item label="" :label-width="formLabelWidth">
        关联企业ID：{{ companyForm.companyId }}
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth">
        关联企业名称：{{ companyForm.name }}
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth">
        关联关系：
        <el-checkbox
          label="供应关系"
          v-model="isSupplyChecked"
          :true-value="'供应关系'"
          :false-value="''"
        ></el-checkbox>
        <el-checkbox
          label="合作关系"
          v-model="isCooperationChecked"
          :true-value="'合作关系'"
          :false-value="''"
        ></el-checkbox>
        <el-checkbox
          label="竞争关系"
          v-model="isCompetitionChecked"
          :true-value="'竞争关系'"
          :false-value="''"
        ></el-checkbox>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">确认修改</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="addDialogVisible" title="新增关联企业" align-center>
    <el-form v-model="newCompany">
      <el-form-item label="" :label-width="formLabelWidth">
        <strong>当前评估企业：{{ store.companyInfo.name }}</strong>
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth"></el-form-item>

      <el-form-item label="" :label-width="formLabelWidth">
        新增关联企业ID：{{ newCompany.companyId }}
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth">
        新增关联企业名称：
        <el-select
          v-model="newCompany.name"
          @change="getSelectedId()"
          placeholder="请选择企业"
        >
          <el-option
            v-for="company in unrelatedCompany"
            :key="company.companyId"
            :label="company.name"
            :value="company.companyId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="" :label-width="formLabelWidth" ref="relationForm">
        新增关联企业关系：
        <el-checkbox
          label="供应关系"
          v-model="isSupply"
          :true-value="'供应关系'"
          :false-value="''"
        ></el-checkbox>
        <el-checkbox
          label="合作关系"
          v-model="isCooperation"
          :true-value="'合作关系'"
          :false-value="''"
        ></el-checkbox>
        <el-checkbox
          label="竞争关系"
          v-model="isCompetition"
          :true-value="'竞争关系'"
          :false-value="''"
        ></el-checkbox>
      </el-form-item>

      <el-form :model="newCompany" :rules="formRules">
        <el-form-item :label-width="formLabelWidth" prop="totalRelation">
          总关联强度：
          <el-input
            v-model="newCompany.totalRelation"
            placeholder="请输入关联强度"
            style="width: 200px"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addNode">确认新增</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Search, Edit, Delete } from "@element-plus/icons-vue";
import { ref } from "vue";
import { watch, nextTick, computed, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import _, { add } from "lodash";
import { getAllCompany } from "@/api/income/manage.js";
import { useMyStore } from "@/store/myStore.js";

//全局变量
const store = useMyStore();

//用于临时存储关联企业的变量
let tempRelatedCompany = ref<any[]>([]);
//用于展示的列表
const showList = ref<any[]>([]);

//监听关联企业信息
watch(
  () => store.relatedCompany,
  (newVal) => {
    nextTick(() => {
      if (newVal) {
        tempRelatedCompany.value = _.cloneDeep(store.relatedCompany);
        showList.value = _.cloneDeep(store.relatedCompany);
      }
    });
  },
  { deep: true, immediate: true }
);

//企业节点信息
const companyForm = ref({
  companyId: -1,
  name: "",
  field: "",
  chainName: "",
  marketShare: -1,
  marketIncrease: -1,
  turnover: -1,
  deliveryRate: -1,
  earningsRate: -1,
  averageRoi: -1,
  liability: -1,
  ownerEquity: -1,
  isSupply: 0,
  isCooperation: 0,
  isCompetition: 0,
  totalRelation: -1,
  analysis: "",
});
//所有企业id和名称
const allCompany: any[] = reactive([]);
//未关联企业id和名称
const unrelatedCompany: any[] = reactive([]);
// 定义新增企业初始状态
const initialNewCompany = reactive({
  companyId: "",
  name: "",
  field: "",
  chainName: "",
  marketShare: -1,
  marketIncrease: -1,
  turnover: -1,
  deliveryRate: -1,
  earningsRate: -1,
  averageRoi: -1,
  liability: -1,
  ownerEquity: -1,
  isSupply: 0,
  isCooperation: 0,
  isCompetition: 0,
  totalRelation: 0,
  analysis: "",
});
const isSupply = ref(false);
const isCooperation = ref(false);
const isCompetition = ref(false);
//定义新增企业
const newCompany = reactive({
  companyId: "",
  name: "",
  field: "",
  chainName: "",
  marketShare: -1,
  marketIncrease: -1,
  turnover: -1,
  deliveryRate: -1,
  earningsRate: -1,
  averageRoi: -1,
  liability: -1,
  ownerEquity: -1,
  isSupply: 0,
  isCooperation: 0,
  isCompetition: 0,
  totalRelation: null,
  analysis: "",
});

onMounted(() => {
  // 调用API接口，获取所有的企业id和名称
  getAllCompany()
    .then((response) => {
      
      response.forEach((item) => {
        let fieldText = "";
        if (item.field === "1") {
          fieldText = "原料供应";
        } else if (item.field === "2") {
          fieldText = "零件生产";
        } else if (item.field === "3") {
          fieldText = "整机组装";
        } else if (item.field === "4") {
          fieldText = "销售和回收";
        }
        allCompany.push({
          companyId: item.companyId,
          name: item.name,
          field: fieldText,
          chainName: item.chainName,
          marketShare: item.marketShare,
          marketIncrease: item.marketIncrease,
          turnover: item.turnover,
          deliveryRate: item.deliveryRate,
          earningsRate: item.earningsRate,
          averageRoi: item.averageRoi,
          liability: item.liability,
          ownerEquity: item.ownerEquity,
        });
      });
    })
    .catch((error) => {
      console.error("API请求失败", error);
    });
});

//1.“搜索”功能
const searchParam = ref<string>("");
const searchResult = ref<any[][]>([]); // 用于存储搜索结果的引用
const handleSearch = () => {
  if (searchParam.value === "") {
    ElMessage({
      type: "warning",
      message: "请输入搜索内容",
    });
    return;
  }
  searchResult.value.length = 0;
  searchResult.value.push(
    tempRelatedCompany.value.filter((company) => {
      return company.name.includes(searchParam.value);
    })
  );
  if (searchResult.value[0].length === 0) {
    ElMessage({
      type: "warning",
      message: "未找到相关企业",
    });
  }
  showList.value = searchResult.value[0];
};
//清空搜索
function clearSearch() {
  searchParam.value = "";
  showList.value = tempRelatedCompany.value;
}

//2.“修改关联关系”功能
const editDialogVisible = ref(false);
const formLabelWidth = "140px";
const editNode = (row) => {
  editDialogVisible.value = true;
  // 清空 companyForm 对象的属性值
  Object.assign(companyForm.value, {
    companyId: -1,
    name: "",
    field: "",
    chainName: "",
    marketShare: -1,
    marketIncrease: -1,
    turnover: -1,
    deliveryRate: -1,
    earningsRate: -1,
    averageRoi: -1,
    liability: -1,
    ownerEquity: -1,
    isSupply: 0,
    isCooperation: 0,
    isCompetition: 0,
    totalRelation: -1,
    analysis: "",
  });
  // 将接收到的 row 信息赋值给 companyForm 对象
  Object.assign(companyForm.value, row);
};
//关联关系复选框的计算属性
const isSupplyChecked = computed({
  get() {
    return companyForm.value.isSupply === 1;
  },
  set(value) {
    companyForm.value.isSupply = value ? 1 : 0;
  },
});
const isCooperationChecked = computed({
  get() {
    return companyForm.value.isCooperation === 1;
  },
  set(value) {
    companyForm.value.isCooperation = value ? 1 : 0;
  },
});
const isCompetitionChecked = computed({
  get() {
    return companyForm.value.isCompetition === 1;
  },
  set(value) {
    companyForm.value.isCompetition = value ? 1 : 0;
  },
});
//保存修改
function saveEdit() {
  if (
    companyForm.value.isSupply !== 1 &&
    companyForm.value.isCooperation !== 1 &&
    companyForm.value.isCompetition !== 1
  ) {
    ElMessage({
      type: "error",
      message: " 请至少选择一个关联关系",
    });
  } else {
    const index = tempRelatedCompany.value.findIndex(
      (obj) => obj.companyId === companyForm.value.companyId
    );
    if (index !== -1) {
      // 更新对象的属性值
      tempRelatedCompany.value[index] = _.cloneDeep(companyForm.value);
    }
    editDialogVisible.value = false; //关闭弹窗
  }
  showList.value = [...tempRelatedCompany.value]; //更新页面渲染
  store.isSubmitRelation = false;
}

//3.“删除关联企业”功能
const deleteNode = (row) => {
  ElMessageBox.confirm("是否要删除该关联企业?", "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  }).then(() => {
    const index = tempRelatedCompany.value.findIndex(
      (item) => item.companyId === row.companyId
    ); // 根据对象的id属性进行比较
    if (index !== -1) {
      tempRelatedCompany.value.splice(index, 1); // 从数组中删除对象
      ElMessage({
        type: "success",
        message: "关联企业已删除",
      });
    }
    showList.value = [...tempRelatedCompany.value];
  });
  store.isSubmitRelation = false;
};

interface FormRules {
  totalRelation: Array<{
    required?: boolean;
    type?: string;
    min?: number;
    max?: number;
    message: string;
    trigger: string;
  }>;
}
const formRules: FormRules = reactive({
  totalRelation: [
    { required: true, message: "请输入关联强度", trigger: "blur" },
  ],
});
//4.“新增关联企业”功能
const addDialogVisible = ref(false);
//点击新增按钮
const toAdd = () => {
  addDialogVisible.value = true;

  newCompany.companyId = "";
  newCompany.name = "";
  isSupply.value = false;
  isCooperation.value = false;
  isCompetition.value = false;
  newCompany.totalRelation = null;

  const filteredTempRelatedCompany = allCompany.filter(
    (c) =>
      !tempRelatedCompany.value.some(
        (company) => company.companyId === c.companyId
      )
  );
  // 删除与nodeId对应的企业对象，并将结果存入unrelatedCompany
  unrelatedCompany.splice(0); // 清空数组
  filteredTempRelatedCompany.forEach((company) => {
    if (company.companyId !== store.companyInfo.companyId) {
      unrelatedCompany.push(company);
    }
  });
};
// 在选择新节点时，更新newCompany属性值
const getSelectedId = () => {
  const addRelatedCompany = unrelatedCompany.find(
    (company) => company.companyId === newCompany.name
  );
  if (addRelatedCompany) {
    newCompany.companyId = addRelatedCompany.companyId;
    newCompany.name = addRelatedCompany.name;
  }
};
// 新增节点
const addNode = () => {
  if (!newCompany.companyId) {
    ElMessage({
      type: "error",
      message: "请选择一个关联企业",
    });
    return;
  }
  if (
    isSupply.value === false &&
    isCooperation.value === false &&
    isCompetition.value === false
  ) {
    ElMessage({
      type: "error",
      message: "请至少选择一个关联关系",
    });
    return;
  } else {
    isSupply.value ? (newCompany.isSupply = 1) : (newCompany.isSupply = 0);
    isCooperation.value
      ? (newCompany.isCooperation = 1)
      : (newCompany.isCooperation = 0);
    isCompetition.value
      ? (newCompany.isCompetition = 1)
      : (newCompany.isCompetition = 0);
  }

  //查找企业属性并赋值
  const company = allCompany.find(
    (item) => item.companyId === newCompany.companyId
  );
  if (company) {
    newCompany.field = company.field;
    newCompany.chainName = company.chainName;
    newCompany.marketShare = company.marketShare;
    newCompany.marketIncrease = company.marketIncrease;
    newCompany.turnover = company.turnover;
    newCompany.deliveryRate = company.deliveryRate;
    newCompany.earningsRate = company.earningsRate;
    newCompany.averageRoi = company.averageRoi;
    newCompany.liability = company.liability;
    newCompany.ownerEquity = company.ownerEquity;

    // 深拷贝newCompany对象
    const clonedNewCompany = JSON.parse(JSON.stringify(newCompany));
    tempRelatedCompany.value.push(clonedNewCompany);
    tempRelatedCompany.value.sort((a, b) => a.companyId - b.companyId);
    showList.value = [...tempRelatedCompany.value];

    Object.assign(newCompany, initialNewCompany); //新增关联企业初始化
    addDialogVisible.value = false; //关闭弹窗
    searchParam.value = ""; //更新搜索框
    store.isSubmitRelation = false;
    ElMessage({
      type: "success",
      message: "关联企业新增成功",
    });
  } else {
    ElMessage({
      type: "success",
      message: "关联企业新增失败",
    });
    addDialogVisible.value = false; //关闭弹窗
  }
};

// 5.初始化（重置）企业关联列表
const recoverallRelatedNodes = () => {
  if (
    JSON.stringify(tempRelatedCompany.value) ===
    JSON.stringify(store.relatedCompany)
  ) {
    ElMessage({
      type: "warning",
      message: "关联企业关系未更改，无需重置",
      duration: 1500,
    });
  } else {
    tempRelatedCompany.value = _.cloneDeep(store.relatedCompany);
    store.newRelatedCompany = _.cloneDeep(store.relatedCompany);
    showList.value = _.cloneDeep(store.relatedCompany);
    searchParam.value = ""; //更新搜索框
    ElMessage({
      type: "success",
      message: "关联企业关系已重置",
      duration: 1500,
    });
    store.isSubmitRelation = false;
  }
};

//6.提交关联关系
let previousSubmission = ref();
const submitModify = () => {
  if (
    previousSubmission &&
    JSON.stringify(previousSubmission) ===
      JSON.stringify(tempRelatedCompany.value)
  ) {
    ElMessage({
      type: "warning",
      message: "关联关系未更改，请勿重复提交",
      duration: 1500,
    });
  } else {
    previousSubmission = JSON.parse(JSON.stringify(tempRelatedCompany.value));
    store.newRelatedCompany = _.cloneDeep(tempRelatedCompany.value);
    store.isSubmitRelation = true;
    ElMessage({
      type: "success",
      message: "关联关系提交成功",
      duration: 1500,
    });
  }
};
</script>
<style>
.search-box {
  display: flex;
  justify-content: center;
  align-items: center;
  /* width: 500px; */
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  padding: 0 15px;
  background-color: #fff;
  margin-top: 10px;
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-label {
  margin-right: 10px;
  font-weight: bold;
}

.search-box .el-input {
  border-radius: 20px;
  background-color: transparent;
  border: none;
  box-shadow: none;
  flex: 1;
}

.add-container {
  margin-left: 100px;
}
</style>