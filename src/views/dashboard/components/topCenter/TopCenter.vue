<script setup>
import {onMounted, ref} from "vue";
import * as echarts from 'echarts'
import mapData from "@/assets/chain.json";
let name_title = "多重产业链网络中企业地理分布图"
const map = ref(null);
let chartInstance = null;
let data = [
  {name: "北京", value: 177},
  {name: "天津", value: 42},
  {name: "河北", value: 102},
  {name: "山西", value: 81},
  {name: "内蒙古", value: 47},
  {name: "辽宁", value: 67},
  {name: "吉林", value: 82},
  {name: "黑龙江", value: 66},
  {name: "上海", value: 24},
  {name: "江苏", value: 92},
  {name: "浙江", value: 114},
  {name: "安徽", value: 109},
  {name: "福建", value: 116},
  {name: "江西", value: 91},
  {name: "山东", value: 119},
  {name: "河南", value: 137},
  {name: "湖北", value: 116},
  {name: "湖南", value: 114},
  {name: "重庆", value: 91},
  {name: "四川", value: 125},
  {name: "贵州", value: 62},
  {name: "云南", value: 83},
  {name: "西藏", value: 9},
  {name: "陕西", value: 80},
  {name: "甘肃", value: 56},
  {name: "青海", value: 10},
  {name: "宁夏", value: 18},
  {name: "新疆", value: 67},
  {name: "广东", value: 123},
  {name: "广西", value: 59},
  {name: "海南", value: 14},
];
let max = 480,
    min = 9; // todo
let maxSize4Pin = 100,
    minSize4Pin = 20;
let geoCoordMap = {};
let convertData = function (data) {
  let res = [];
  for (let i = 0; i < data.length; i++) {
    let geoCoord = geoCoordMap[data[i].name];
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value),
      });
    }
  }
  return res;
};

const initChart = async () => {
  chartInstance = echarts.init(map.value);
  echarts.registerMap('china', mapData);
  mapData.features.forEach(function (item) {
    geoCoordMap[item.properties.name] = item.properties.cp;
  });
  const initOption = {
    title: {
      text: name_title,
      x: 'center',
    },
    geo: {
      type: 'map',
      map: 'china',
      top: '35%',
      bottom: '0',
      roam: false,
      zoom: 1.9,
      itemStyle: {
        normal: {
          areaColor: '#031525',
          borderColor: '#3B5077',
        },
        emphasis: {
          areaColor: '#2B91B7',
        }
      }
    },
    visualMap: {
      show: true,
      min: 0,
      max: 200,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'], // 文本，默认为数值文本
      calculable: true,
      seriesIndex: [0],
      inRange: {
        // color: ['#3B5077', '#031525'] // 蓝黑
        // color: ['#ffc0cb', '#800080'] // 红紫
        // color: ['#3C3B3F', '#605C3C'] // 黑绿
        // color: ['#0f0c29', '#302b63', '#24243e'] // 黑紫黑
        // color: ['#23074d', '#cc5333'] // 紫红
        // color: ['#00467F', '#A5CC82'] // 蓝绿
        // color: ['#1488CC', '#2B32B2'] // 浅蓝
        // color: ['#00467F', '#A5CC82'] // 蓝绿
        color: ['#00467F', '#A5CC82'] // 蓝绿
        // color: ['#00467F', '#A5CC82'] // 蓝绿
        // color: ['#00467F', '#A5CC82'] // 蓝绿
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        if (typeof (params.value)[2] == "undefined") {
          return params.name + ": " + params.value;
        } else {
          return params.name + ": " + params.value[2];
        }
      }
    },
    series: [{
      type: 'map',
      map: 'china',
      geoIndex: 0,
      aspectScale: 0.75, //长宽比
      showLegendSymbol: false, // 存在legend时显示
      label: {
        normal: {
          show: true
        },
        emphasis: {
          show: false,
          textStyle: {
            color: '#fff'
          }
        }
      },
      roam: true,
      itemStyle: {
        normal: {
          areaColor: '#031525',
          borderColor: '#3B5077',
        },
        emphasis: {
          areaColor: '#2B91B7'
        }
      },
      animation: false,
      data: data
    },
      {
        name: '散点',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: convertData(data),
        symbolSize: function (val) {
          return val[2] / 10 > 1 ? val[2] / 10 : 4;
        },
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: true
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: '#05C3F9'
          }
        }
      },
      {
        name: '点',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'pin', //气泡
        symbolSize: function (val) {
          let a = (maxSize4Pin - minSize4Pin) / (max - min);
          let b = maxSize4Pin - a * max;
          return a * val[2] + b;
        },
        label: {
          show: true,
          position: 'inside',
          formatter: function (params) {
            return params.value[2];
          }
        },
        itemStyle: {
          normal: {
            color: '#F62157', //标志颜色
          }
        },
        zlevel: 6,
        data: convertData(data),
      },
      {
        name: 'Top 5',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: convertData(data.sort(function (a, b) {
          return b.value - a.value;
        }).slice(0, 5)),
        symbolSize: function (val) {
          return val[2] / 10;
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: 'yellow',
            shadowBlur: 10,
            shadowColor: 'yellow'
          }
        },
        zlevel: 1
      },
    ]
  }
  chartInstance.setOption(initOption)
}


onMounted(() => {
  initChart();
})
</script>

<template>
    <!--      <template #header style="text-align: center">-->
    <!--        <div style="text-align: center">-->
    <!--          <span style="font-size: 20px;font-family: 'Microsoft YaHei UI'">{{name_title}}</span>-->
    <!--        </div>-->
    <!--    </template>-->
    <div ref="map" style="height: 100%; width:100%;"></div>
</template>

<style scoped lang="scss">

</style>