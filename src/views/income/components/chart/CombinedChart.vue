<template>
  <div class="charts-container">
    <div id="chart1" style="width: 450px; height: 300px"></div>
    <div id="chart2" style="width: 450px; height: 300px"></div>
    <div id="chart3" style="width: 450px; height: 300px"></div>
  </div>
</template>
  
<script setup>
import * as echarts from "echarts";
import { onMounted } from "vue";

let myChart1 = null;
let myChart2 = null;
let myChart3 = null;
const animationDuration = 1500;

//接收数据
const props = defineProps({
  SupplyCount: {
    type: Number,
    default: 0,
  },
  CooperationCount: {
    type: Number,
    default: 0,
  },
  CompetitionCount: {
    type: Number,
    default: 0,
  },
});

watch(
  [
    () => props.SupplyCount,
    () => props.CooperationCount,
    () => props.CompetitionCount,
  ],
  ([supplyCount, cooperationCount, competitionCount]) => {
    //饼图（关联关系）
    const chartDom2 = document.getElementById("chart2");
    myChart2 = echarts.init(chartDom2);

    var option2 = {
      title: {
        text: "企业关联关系统计图",
        textStyle: {
          color: "#333",
          fontSize: 15,
          fontWeight: "bold",
        },
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "horizontal",
        left: "center",
        top: "bottom", // 将图例放置在图表底部
      },
      series: [
        {
          name: "关联关系统计图",
          type: "pie",
          radius: "70%",
          data: [
            { value: competitionCount, name: "竞争关系" },
            { value: cooperationCount, name: "合作关系" },
            { value: supplyCount, name: "供应关系" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    myChart2.setOption(option2);
  },
  { deep: true }
);

onMounted(async () => {
  //雷达图（参数权重）
  const chartDom1 = document.getElementById("chart1");
  myChart1 = echarts.init(chartDom1);
  var option1 = {
    title: {
      text: " 收益评估算法参数权重",
      textStyle: {
        color: "#333",
        fontSize: 15,
        fontWeight: "bold",
      },
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    radar: [
      {
        splitNumber: 8,
        splitArea: {
          areaStyle: {
            color: "rgba(127,95,132,.3)",
            opacity: 1,
            shadowBlur: 45,
            shadowColor: "rgba(0,0,0,.5)",
            shadowOffsetX: 0,
            shadowOffsetY: 15,
          },
        },
        indicator: [
          { text: "企业关联关系", max: 1 },
          { text: "企业收益指标", max: 1 },
          { text: "风险重要性", max: 1 },
          { text: "合作策略", max: 1 },
        ],
        center: ["50%", "55%"], //雷达图位置
        radius: 100,  //雷达图大小
      },
    ],
    series: [
      {
        type: "radar",
        name: "参数权重", // 设置数据系列的名称
        tooltip: {
          trigger: "item",
        },
        areaStyle: {},
        data: [
          {
            value: [0.73, 0.88, 0.67, 0.75],
          },
        ],
      },
    ],
  };
  myChart1.setOption(option1);

  //柱状图(企业数、盈利率)
  const chartDom3 = document.getElementById("chart3");
  myChart3 = echarts.init(chartDom3);

  var months = [
    "2023-01",
    "2023-02",
    "2023-03",
    "2023-04",
    "2023-05",
    "2023-06",
    "2023-07",
    "2023-08",
    "2023-09",
    "2023-10",
    "2023-11",
    "2023-12",
  ];

  var option3 = {
    title: {
      text: "汽车/家电产业链企业盈利数/率", // 设置标题文本
      textStyle: {
        // 设置标题样式
        color: "#333",
        fontSize: 15,
        fontWeight: "bold",
      },
      left: "center", // 设置标题水平居中
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    legend: {
      data: [
        "汽车产业链企业数",
        "家电产业链企业数",
        "汽车产业链盈利率",
        "家电产业链盈利率",
      ],
      top: "bottom", // 将图例放置在图表底部
    },
    xAxis: {
      type: "category",
      data: months,
    },
    yAxis: [
      {
        type: "value",
        name: "盈利企业数",
        min: 0,
        max: 200,
        interval: 50,
        axisLabel: {
          formatter: "{value} ",
        },
      },
      {
        type: "value",
        name: "盈利企业率",
        min: 0,
        max: 100,
        interval: 20,
        axisLabel: {
          formatter: "{value} %",
        },
      },
    ],
    series: [
      {
        name: "汽车产业链企业数",
        type: "bar",
        data: [100, 120, 130, 150, 160, 180, 190, 200, 180, 160, 140, 120],
      },
      {
        name: "家电产业链企业数",
        type: "bar",
        data: [80, 90, 100, 110, 120, 130, 140, 150, 130, 110, 90, 70],
      },
      {
        name: "汽车产业链盈利率",
        type: "line",
        yAxisIndex: 1,
        data: [50, 52, 53, 55, 56, 58, 60, 62, 64, 66, 68, 70],
      },
      {
        name: "家电产业链盈利率",
        type: "line",
        yAxisIndex: 1,
        data: [40, 45, 48, 50, 52, 55, 57, 60, 63, 65, 68, 70],
      },
    ],
  };
  myChart3.setOption(option3);
});
</script>
<style>
.charts-container {
  display: flex;
  justify-content: space-between;
}
</style>