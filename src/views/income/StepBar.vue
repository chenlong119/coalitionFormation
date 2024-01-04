<template>
  <el-card class="step-card">
    <el-steps :active="active" align-center>
      <el-step
        title="选择企业"
        :icon="OfficeBuilding"
        description="Step 1"
        finish-status="success"
      />
      <el-step title="修改关联关系" :icon="Switch" description="Step 2" />
      <el-step title="确定参数" :icon="Edit" description="Step 3" />
      <el-step title="收益评估" :icon="TrendCharts" description="Step 4" />
    </el-steps>
  </el-card>

  <el-card class="content-card">
    <div v-show="active === 0">
      <Step1
        @onRelatedList="handleRelatedList"
        @onSelectedCompanyInfo="handleSelectedCompanyInfo"
      ></Step1>
    </div>
    <div v-show="active === 1">
      <Step2
        @onRelationSubmit="handleNewRelatedList"
        @isSubmit="handleIsSubmit"
        :selectedCompanyInfo="selectedCompanyInfo"
        :relatedCompanyList="relatedCompanyList"
      ></Step2>
    </div>
    <div v-show="active === 2">
      <Step3
        @onFormInput="onFormInput"
        :selectedCompanyInfo="selectedCompanyInfo"
        @isSubmitForm="handleIsSubmitForm"
        :relatedCompanyModified="relatedCompanyModified"
      >
      </Step3>
    </div>
    <div v-show="active === 3">
      <Step4
        :selectedCompanyInfo="selectedCompanyInfo"
        :relatedCompanyModified="relatedCompanyModified"
        :formData="formData"
      ></Step4>
    </div>
  </el-card>
  <div class="button-container">
    <el-button
      :icon="ArrowLeft"
      type="primary"
      plain
      style="margin-top: 12px"
      @click="back"
      v-show="active !== 0"
      >上一步</el-button
    >
    <div class="right-button-container">
      <el-button
        type="primary"
        plain
        style="margin-top: 12px"
        @click="next"
        v-show="active === 0 || active === 1"
        >下一步<el-icon> <ArrowRight /> </el-icon
      ></el-button>
      <el-button
        type="primary"
        round
        style="margin-top: 12px"
        @click="next"
        v-show="active === 2"
        >预测收益值<el-icon> <ArrowRight /> </el-icon
      ></el-button>
    </div>
  </div>
</template>


<script setup>
import {
  OfficeBuilding,
  Switch,
  Edit,
  TrendCharts,
  ArrowLeft,
  ArrowRight,
} from "@element-plus/icons-vue";
import { ref, toRef, toRaw, reactive, computed, nextTick, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import Step1 from "./components/Step1.vue";
import Step2 from "./components/Step2.vue";
import Step3 from "./components/Step3.vue";
import Step4 from "./components/Step4.vue";
import { predict } from "@/api/income/manage.js";
import { useMyStore } from '@/store/myStore.js'

//全局变量
const store = useMyStore();


//用户选取企业的所有信息——Step1获得
const selectedCompanyInfo = reactive({});
//关联企业列表——Step1获得
const relatedCompanyList = reactive({});
//获取Step1选择的企业
const handleSelectedCompanyInfo = (value) => {
  nextTick(() => {
    selectedCompanyInfo.value = value;

    isSubmit.value = false; //重新选择企业，关联关系要重新提交
  });
};
//获取Step1关联企业列表
const handleRelatedList = (value) => {
  nextTick(() => {
    relatedCompanyList.value = value;
  });
};
//计算用户是否选择了节点(Step1)
const isEmptyNode = computed(() => {
  return Object.keys(selectedCompanyInfo).length === 0;
});

//修改之后的关联企业——Step2获得
const relatedCompanyModified = reactive({});
//判断是否提交关联关系（true需要在Step2中进行提交）
const isSubmit = ref(false); //是否提交关联关系
//获取Step2的参数信息
const handleNewRelatedList = (value) => {
  nextTick(() => {
    relatedCompanyModified.value = JSON.parse(JSON.stringify(value)); //深拷贝
    isSubmit.value = true;
  });
};
const handleIsSubmit = (value) => {
  nextTick(() => {
    isSubmit.value = value;
  });
};

//用户输入的参数信息——Step3获得
const formData = reactive({});
//获取Step3的参数信息
const onFormInput = (value) => {
  Object.assign(formData, value);
};
//计算用户是否输入了参数（Step3）
const isEmptyForm = computed(() => {
  const values = Object.values(formData);
  return values.every((value) => {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "";
    }
  });
});
const isSubmitForm = ref(false); //是否提交表单
const handleIsSubmitForm = (value) => {
  nextTick(() => {
    isSubmitForm.value = value;
  });
};

const individualIncome = ref([]); //个体收益
const groupIncome = ref([]); //群体收益
//步骤条
const active = ref(0);
const back = () => {
  if (active.value-- < 0) active.value = 3;
};
const next = () => {
  if (active.value === 0) {
    if (!isEmptyNode.value) {
      active.value = 1;
    } else {
      ElMessage({
        type: "error",
        message: "请先选择收益评估的企业！",
        duration: 3000,
      });
    }
  } else if (active.value === 1) {
    if (isSubmit.value) {
      active.value = 2;
    } else {
      ElMessage({
        type: "error",
        message: "关联关系未提交！",
        duration: 3000,
      });
    }
  } else if (active.value === 2) {
    if (!isEmptyForm.value && isSubmitForm.value) {
      store.isLoding = true;  //打开加载动画
      const requestData = {
        selectedCompanyInfo: JSON.stringify(selectedCompanyInfo),
        relatedCompanyModified: JSON.stringify(relatedCompanyModified),
        formData: JSON.stringify(formData),
      };
      predict(requestData)
        .then((response) => {
          individualIncome.value = response.single;
          groupIncome.value = response.group;
        })
        .catch((error) => {
          console.error("收益值预测失败", error);
        })
        .finally(() => {
          //将收益值存入全局变量store
          store.setIndividualIncome(individualIncome.value)
          store.setGroupIncome(groupIncome.value)
          store.isLoding = false; //关闭加载动画
          active.value = 3;
        });
    } else {
      ElMessage({
        type: "error",
        message: "请先提交收益评估参数！",
        duration: 3000,
      });
    }
  }
};
</script>
<style>
.step-card {
  margin-top: 12px;
  margin-left: 12px;
  margin-right: 12px;
  height: 120px;
  background-color: (255, 255, 255, 0.1);
}

.content-card {
  margin-top: 12px;
  margin-left: 12px;
  margin-right: 12px;
  /* height: 650px; */
  height: auto;
  background-color: (255, 255, 255, 0.1);
}

.button-container {
  margin-left: 12px;
  margin-right: 12px;
  display: flex;
  justify-content: space-between;
}

.right-button-container {
  margin-left: auto;
}
</style>

  