<template>
  <br />
  <div
    v-loading="loading"
    element-loading-text="收益值预测中..."
    :element-loading-spinner="svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
  >
    <div class="common-layout">
      <div id="main1" class="container-l">
        <div class="title-info">评估企业信息：</div>
        <el-form style="margin-left: 5%">
          <el-form-item label="评估企业：" prop="nodeName">
            <span style="font-weight: bold"
              >{{ store.companyInfo.name }}（ID：{{ store.companyInfo.companyId }}）</span
            >
          </el-form-item>

          <el-form-item label="所处领域：" prop="nodeFiled">
            <span style="font-weight: bold">{{ store.companyInfo.field }}</span>
          </el-form-item>

          <el-form-item label="所处产业链：" prop="nodeChainName">
            <span style="font-weight: bold">{{ store.companyInfo.chainName }}</span>
          </el-form-item>

          <el-row :gutter="10">
            <el-col :span="5">
              <el-form-item label="关联企业总数：" prop="totalNum">
                <span style="font-weight: bold">{{ totalNum }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <div style="margin-left:40px;font-weight: bold;height:25px">⇩</div>
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item label="供应关系企业数量：" prop="supplyNum">
                <span style="font-weight: bold">{{ supplyNum }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="7" style="margin-left:20px">
              <el-form-item label="合作关系企业数量：" prop="cooperationNum">
                <span style="font-weight: bold">{{ cooperationNum }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="7" style="margin-left:20px">
              <el-form-item label="竞争关系企业数量：" prop="competitioNum">
                <span style="font-weight: bold">{{ competitioNum }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div id="main2" class="container-r">
        <div class="title-info">评估企业收益指标：</div>
        <el-form
          style="display: flex; flex-direction: column; align-items: left; text-align: left;margin-left: 10%;margin-top:5%" 
        >

          <el-row :gutter="24" style="margin-bottom:10px">
            <el-col :span="12">
              <el-form-item label="企业市场份额：" prop="marketShare">
                <span style="font-weight: bold">{{ store.companyInfo.marketShare }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业市场增长率：" prop="marketIncrease">
                <span style="font-weight: bold">{{ store.companyInfo.marketIncrease }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24" style="margin-bottom:10px">
            <el-col :span="12">
              <el-form-item label="库存周转率：" prop="turnover">
                <span style="font-weight: bold">{{ store.companyInfo.turnover }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货物准时交付率：" prop="deliveryRate">
                <span style="font-weight: bold">{{ store.companyInfo.deliveryRate }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24" style="margin-bottom:10px">
            <el-col :span="12">
              <el-form-item label="盈利率：" prop="earningsRate">
                <span style="font-weight: bold">{{ store.companyInfo.earningsRate }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="平均收益回报率：" prop="averageRoi">
                <span style="font-weight: bold">{{ store.companyInfo.averageRoi }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24" style="margin-bottom:10px">
            <el-col :span="12">
              <el-form-item label="负债（万元）：" prop="liability">
                <span style="font-weight: bold">{{ store.companyInfo.liability }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所有者权益（万元）：" prop="ownerEquity">
                <span style="font-weight: bold">{{ store.companyInfo.ownerEquity }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <br />
    <div class="container-b">
      <div class="title-info">算法参数选择：</div>
      <el-form
        ref="inputFormRef"
        :model="inputForm"
        :rules="rules"
        label-width="200px"
        :size="formSize"
        status-icon
        style="display: flex; flex-direction: column; align-items: center"
      >
        <el-form-item label="评估时间：" prop="time">
          <el-select v-model="inputForm.time" placeholder="请选择评估时间">
            <el-option label="3个月" value="3" />
            <el-option label="6个月" value="6" />
            <el-option label="9个月" value="9" />
            <el-option label="12个月" value="12" />
          </el-select>
        </el-form-item>

        <el-form-item prop="preference">
          <template #label>
            <div style="display: flex; align-items: center">
              <span>风险重要性</span>
              <el-tooltip placement="top">
                <template #content>
                  算法参数之一<br />风险越大，收益可能越高
                </template>
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>

              <span>：</span>
            </div>
          </template>
          <el-radio-group v-model="inputForm.preference">
            <el-radio label="偏好" />
            <el-radio label="中立" />
            <el-radio label="规避" />
          </el-radio-group>
        </el-form-item>

        <el-form-item label="关系策略：" prop="strategy">
          <el-checkbox-group v-model="inputForm.strategy">
            <el-checkbox label="合作优先" name="1" />
            <el-checkbox label="竞争优先" name="2" />
            <el-checkbox label="公平优先" name="3" />
            <el-checkbox label="群体优先" name="4" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm(inputFormRef)">
            提交
          </el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { onMounted, watch, nextTick, watchEffect, computed } from "vue";
import isEqual from "lodash/isEqual";
import { ElMessage, ElMessageBox } from "element-plus";
import { QuestionFilled } from "@element-plus/icons-vue";
import { submitParam } from "@/api/income/manage.js";
import { useMyStore } from "@/store/myStore.js";


//全局变量
const store = useMyStore();
// // 定义格式化函数
// function formatPercentage(rate) {
//   // 将 rate 乘以 100 并保留两位小数
//   const formattedRate = (rate * 100).toFixed(2);
//   return `${formattedRate}%`;
// }

//关联关系信息
const totalNum = ref(0);
const supplyNum = ref(0);
const cooperationNum = ref(0);
const competitioNum = ref(0);
// 修改后的企业关联关系
const relatedCompanyModified: any[] = reactive([]);
// 监听关联关系信息
watch(
  () => store.newRelatedCompany,
  (newVal) => {
    if (newVal) {
      relatedCompanyModified.splice(
        0,
        relatedCompanyModified.length,
        ...(Object.values(newVal) as any[])
      ); // 使用Object.values将对象值转换为数组
      const tempSupply = relatedCompanyModified.filter(
        (obj) => obj.isSupply === 1
      ).length;
      const tempCooperation = relatedCompanyModified.filter(
        (obj) => obj.isCooperation === 1
      ).length;
      const tempCompetition = relatedCompanyModified.filter(
        (obj) => obj.isCompetition === 1
      ).length;
      supplyNum.value = tempSupply;
      cooperationNum.value = tempCooperation;
      competitioNum.value = tempCompetition;
      totalNum.value = relatedCompanyModified.length;
    }
  },
  { deep: true, immediate: true }
);

//表单输入数据
const formSize = ref("default");
const inputFormRef = ref<FormInstance>();
const inputForm = reactive({
  time: "",
  preference: "",
  strategy: [],
});
//输入规则
const rules = reactive<FormRules>({
  time: [
    {
      required: true,
      message: "评估时间未选择",
      trigger: "change",
    },
  ],
  preference: [
    {
      required: true,
      message: "风险偏好未选择",
      trigger: "change",
    },
  ],
  strategy: [
    {
      type: "array",
      required: true,
      message: "合作策略未选择",
      trigger: "change",
    },
  ],
});
watch(inputForm, () => {
  store.isSubmitForm = false;
});

// 记录上次提交的表单参数
let lastInputForm = ref({
  time: "-9999",
  preference: "-9999",
  strategy: [],
});
// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // 检查表单参数是否更改
  if (
    lastInputForm.value.time === inputForm.time &&
    lastInputForm.value.preference === inputForm.preference &&
    isEqual(
      Array.from(lastInputForm.value.strategy),
      Array.from(inputForm.strategy)
    )
  ) {
    ElMessage({
      type: "warning",
      message: "参数未更改，请勿重复提交",
      duration: 1500,
    });
    return;
  }
  await formEl.validate((valid, fields) => {
    if (valid) {
      ElMessage({
        type: "success",
        message: "参数提交成功",
        duration: 1500,
      });

      // 更新上次提交的表单参数
      lastInputForm.value = {
        ...inputForm,
        strategy: Array.from(inputForm.strategy),
      };
     
      store.isSubmitForm = true; //更新提交状态
      store.inputForm = inputForm;
      store.predictMonth = Number(inputForm.time);
    } else {
      ElMessage({
        type: "error",
        message: "参数提交失败",
        duration: 1500,
      });
    }
  });
};

// 重置表单数据
const resetForm = () => {
  // 重置表单输入数据为初始状态
  inputForm.time = "";
  inputForm.preference = "";
  inputForm.strategy = [];
  //重置指定表单项的校验状态
  inputFormRef.value?.resetFields(["time", "preference", "strategy"]);
  //重置上次提交的表单参数为初始状态
  lastInputForm.value = {
    time: "-9999",
    preference: "-9999",
    strategy: [],
  };
  store.inputForm = inputForm;
};

//加载动画状态
const loading = computed(() => store.isLoding);
</script>

<style>
.el-form-item__label {
  font-size: 15px;
  font-weight: bold;
}

.el-form-item__content {
  font-size: 17px;
}

.common-layout {
  display: flex; 
}
.container-l {
  height: 350px;
  width: 700px;
  flex: 1; 
  border: 1px solid #bfbfbf; 
  padding: 20px; 
  margin-right: 10px;
}
.container-r {
  height: 350px;
  width: 700px;
  flex: 1; 
  border: 1px solid #bfbfbf; 
  padding: 20px; 
  margin-left: 10px;
}

.container-b {
  border: 1px solid #bfbfbf; 
  padding: 20px; 
}
.title-info {
  font-family: Times New Roman, serif;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
}
</style>
