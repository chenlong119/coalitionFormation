<template>
  <div id="main" style="width: 1400px; height: 400px"></div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts";
import { useMyStore } from "@/store/myStore.js";

let myChart = null;
const store = useMyStore();

onMounted(() => {
  const chartDom = document.getElementById("main");
  myChart = echarts.init(chartDom);
});

const combinedWatch = computed(() => ({
  individualIncome: store.individualIncome,
  groupIncome: store.groupIncome,
}));

watch(combinedWatch, (newValues) => {
  const dataLength = store.predictMonth;
  const xAxisData = Array.from(
    { length: dataLength },
    (_, index) => `+${index + 1}月`
  );

  //绘制ECharts关系图
  myChart.setOption({
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xAxisData,
    },
    grid: {
      left: 80,
      right: 10,
      bottom: 20,
      top: 30,
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      padding: [5, 10],
    },
    yAxis: {
      name: "预估收益（万元）",
      axisLabel: {
        show: true,
        formatter: "{value}", // 这里可以自定义y轴标签的显示格式
      },
    },
    legend: {
      data: ["评估企业收益", "关联企业群收益"],
    },
    series: [
      {
        name: "评估企业收益",
        itemStyle: {
          normal: {
            color: "#FF005A",
            lineStyle: {
              color: "#FF005A",
              width: 2,
            },
          },
        },
        smooth: true,
        type: "line",
        data: newValues.individualIncome,
        animationDuration: 1500,
        animationEasing: "cubicInOut",
      },
      {
        name: "关联企业群收益",
        smooth: true,
        type: "line",
        itemStyle: {
          normal: {
            color: "#3888fa",
            lineStyle: {
              color: "#3888fa",
              width: 2,
            },
            areaStyle: {
              color: "#f3f8ff",
            },
          },
        },

        data: newValues.groupIncome,
        animationDuration: 1500,
        animationEasing: "quadraticOut",
      },
    ],
  });
});

watch(
  () => store.predictMonth,
  (newVal) => {
    if (newVal) {
      const predictMonth = newVal;

      // 根据预测月份的数量生成相应的数据
      const dataLength = predictMonth.value;
      const xAxisData = Array.from(
        { length: dataLength },
        (_, index) => `+${index + 1}月`
      );
      //绘制ECharts关系图
      myChart.setOption({
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xAxisData,
        },
        grid: {
          left: 80,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: [5, 10],
        },
        yAxis: {
          name: "预估收益（万元）",
          axisLabel: {
            show: true,
            formatter: "{value}", // 这里可以自定义y轴标签的显示格式
          },
        },
        legend: {
          data: ["评估企业收益", "关联企业群收益"],
        },
        series: [
          {
            name: "评估企业收益",
            itemStyle: {
              normal: {
                color: "#FF005A",
                lineStyle: {
                  color: "#FF005A",
                  width: 2,
                },
              },
            },
            smooth: true,
            type: "line",
            data: [],
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
          {
            name: "关联企业群收益",
            smooth: true,
            type: "line",
            itemStyle: {
              normal: {
                color: "#3888fa",
                lineStyle: {
                  color: "#3888fa",
                  width: 2,
                },
                areaStyle: {
                  color: "#f3f8ff",
                },
              },
            },
            data: [],
            animationDuration: 2800,
            animationEasing: "quadraticOut",
          },
        ],
      });
    }
  },
  { deep: true, immediate: true }
);

</script>

<style>
.el-main {
  height: 100%;
}
</style>
