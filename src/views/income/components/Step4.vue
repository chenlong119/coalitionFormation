<template>
  <div style="width: 100%; margin: 10px auto; text-align: center">
    <span>当前评估企业：</span>
    <span style="font-weight: bold; font-size: large"
      >{{ companyName }}（ID：{{ companyId }}）</span
    >
  </div>

  <div class="container1">
    <div class="title">企业个体/群体收益预估图：</div>
    <div class="chart-wrapper">
      <LineChart
        :predictMonth="predictMonth"
        :individualIncome="individualIncome"
        :groupIncome="groupIncome"
      ></LineChart>
    </div>
  </div>
  <div class="container2">
    <CombinedChart
      :SupplyCount="SupplyCount"
      :CooperationCount="CooperationCount"
      :CompetitionCount="CompetitionCount"
    ></CombinedChart>
  </div>
</template>
  
  
<script lang="ts" setup>
import { reactive, ref, toRefs, toRaw } from "vue";
import { watch, watchEffect, nextTick } from "vue";
import LineChart from "./chart/LineChart.vue";
import CombinedChart from "./chart/CombinedChart.vue";

//接收数据
const props = defineProps({
  selectedCompanyInfo: Object,
  relatedCompanyModified: Object,
  formData: Object,
});

const individualIncome = ref([]);
const groupIncome = ref([]);

const formulaVisible = ref(false);
const formLabelWidth = "140px";
const selectedCompanyInfo = reactive({
  companyId: "",
  name: "",
  field: "",
  category: "",
  marketShare: "",
  marketIncrease: "",
  turnover: "",
  deliveryRate: "",
  earningsRate: "",
  averageRoi: "",
  liability: "",
  ownerEquity: "",
});
const companyId = ref("");
const companyName = ref("");
const relatedCompanyModified: any[] = reactive([]);
const formData = reactive({
  time: "",
  preference: "",
  strategy: [],
});
const SupplyCount = ref(0);
const CooperationCount = ref(0);
const CompetitionCount = ref(0);
const predictMonth = ref(0);

//监听列表
watch(
  () => props.selectedCompanyInfo,
  (newVal) => {
    if (newVal && newVal.value) {
      companyName.value = newVal.value.name;
      companyId.value = newVal.value.companyId;
      Object.assign(selectedCompanyInfo, newVal.value);
    }
  },
  { deep: true, immediate: true }
);
watch(
  () => props.relatedCompanyModified.value,
  (newVal) => {
    if (newVal) {
      relatedCompanyModified.splice(
        0,
        relatedCompanyModified.length,
        ...(Object.values(newVal) as any[])
      ); // 使用Object.values将对象值转换为数组

      const countPropertiesWithValueOne = (array, property) => {
        return array.reduce((count, obj) => {
          if (obj[property] === 1) {
            count++;
          }
          return count;
        }, 0);
      };
      SupplyCount.value = countPropertiesWithValueOne(
        relatedCompanyModified,
        "isSupply"
      );
      CooperationCount.value = countPropertiesWithValueOne(
        relatedCompanyModified,
        "isCooperation"
      );
      CompetitionCount.value = countPropertiesWithValueOne(
        relatedCompanyModified,
        "isCompetition"
      );
    }
  },
  { deep: true, immediate: true }
);
watch(
  () => props.formData,
  (newVal) => {
    if (newVal) {
      predictMonth.value = newVal.time;
      Object.assign(formData, newVal);
    }
  },
  { deep: true, immediate: true }
);

</script>

<style lang="scss" scoped>
.container1 {
  display: flex;
  flex-direction: column;
}
.title {
  margin-left: 60px;
  margin-top: 20px;
  margin-bottom: 20px;
  font-weight: bold;
}
.chart-wrapper {
  display: flex;
  justify-content: center;
}

.container2 {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>