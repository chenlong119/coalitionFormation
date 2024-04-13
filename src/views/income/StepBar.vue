<template>
  <el-card class="step-card">
    <el-steps :active="active" align-center>
      <el-step
        title="查询关联企业"
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
      <Step1></Step1>
    </div>
    <div v-show="active === 1">
      <Step2></Step2>
    </div>
    <div v-show="active === 2">
      <Step3></Step3>
    </div>
    <div v-show="active === 3">
      <Step4></Step4>
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
import { predict,  getCompanyNow } from "@/api/income/manage.js";
import { useMyStore } from '@/store/myStore.js'


//全局变量
const store = useMyStore();

//计算用户是否输入了参数（Step3）
const isEmptyForm = computed(() => {
  const values = Object.values(store.inputForm);
  return values.every((value) => {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "";
    }
  });
});

const individualIncome = ref([]); //个体收益
const groupIncome = ref([]); //群体收益
//步骤条
const active = ref(0);
const back = () => {
  if (active.value-- < 0) active.value = 3;
};
const next = () => {
  if (active.value === 0) {
    active.value = 1;
  }
  else if (active.value === 1) {
    if (store.isSubmitRelation) {
      active.value = 2;
    } else {
      ElMessage({
        type: "error",
        message: "关联关系未提交！",
        duration: 3000,
      });
    }
  } else if (active.value === 2) {
    if (!isEmptyForm.value && store.isSubmitForm) {
      store.isLoding = true;  //打开加载动画
      const requestData = {
        companyInfo: JSON.stringify(store.companyInfo),
        newRelatedCompany: JSON.stringify(store.newRelatedCompany),
        formData: JSON.stringify(store.inputForm),
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

  