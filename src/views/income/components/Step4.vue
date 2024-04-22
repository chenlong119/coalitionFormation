<template>
  <div style="width: 100%; margin: 10px auto; text-align: center">
    <span>当前评估企业：</span>
    <span style="font-weight: bold; font-size: large"
      >{{ store.companyInfo.name }}（ID：{{ store.companyInfo.companyId }}）</span
    >
  </div>
<div class="title">企业个体/群体收益预估图：</div>
  <div class="container1">
    
    <div class="chart-wrapper">
      <LineChart></LineChart>
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
import { useMyStore } from "@/store/myStore.js";


const store = useMyStore(); //全局变量
const individualIncome = ref([]);
const groupIncome = ref([]);
const formulaVisible = ref(false);
const formLabelWidth = "140px";
const relatedCompanyModified: any[] = reactive([]);
//统计图数据
const SupplyCount = ref(0);
const CooperationCount = ref(0);
const CompetitionCount = ref(0);

watch(
  () => store.newRelatedCompany,
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
</script>

<style lang="scss" scoped>
.title {
  margin-left: 10%;
  margin-top: 2%;
  margin-bottom: 2%;
  font-weight: bold;
}
.container1 {
  display: flex;
  flex-direction: column;
  width: 50%; /* 父容器缩小为50% */
  margin: 0 auto; /* 居中对齐 */
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