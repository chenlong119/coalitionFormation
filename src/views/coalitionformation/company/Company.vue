<script setup>

import CompanyTable from "@/views/coalitionformation/company/CompanyTable.vue";
import {onMounted, ref} from 'vue';
import * as echarts from 'echarts';

const bubbles = ref(null);
let colorList = [[
  '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
  '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
  '#1e90ff', '#ff6347', '#7b68ee', '#d0648a', '#ffd700',
  '#6b8e23', '#4ea397', '#3cb371', '#b8860b', '#7bd9a5'
],
  [
    '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
    '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
    '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
    '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'
  ],
  [
    '#929fff', '#9de0ff', '#ffa897', '#af87fe', '#7dc3fe',
    '#bb60b2', '#433e7c', '#f47a75', '#009db2', '#024b51',
    '#0780cf', '#765005', '#e75840', '#26ccd8', '#3685fe',
    '#9977ef', '#f5616f', '#f7b13f', '#f9e264', '#50c48f'
  ]][2];

onMounted(() => {
  const chart = echarts.init(bubbles.value);

  const option = {
    backgroundColor: '#fff',
    tooltip: {},
    animationDurationUpdate: function (idx) {
      // 越往后的数据延迟越大
      return idx * 100;
    },
    animationEasingUpdate: 'bounceIn',
    color: ['#fff', '#fff', '#fff'],
    series: [{
      type: 'graph',
      layout: 'force',
      force: {
        repulsion: 500,
        edgeLength: 10
      },
      roam: true,
      label: {
        normal: {
          show: true,
          position: 'inside',
          color: '#fff',
          fontSize: 16,
          formatter:(params)=>{
            return params.data.name+"\n"+params.data.value;
          }
        }
      },
      data: [{
        "name": "水管制造",
        "value": 13,
        "symbolSize": 72,
        "draggable": true,
        "itemStyle": {
          "normal": {
            "shadowBlur": 100,
            "shadowColor": colorList[0],
            "color": colorList[0]
          }
        }
      },
        {
          "name": "洗衣机制造",
          "value": 18,
          "symbolSize": 90,
          "draggable": true,
          "itemStyle": {
            "normal": {
              "shadowBlur": 100,
              "shadowColor": colorList[1],
              "color": colorList[1]
            }
          }
        },
        {
          "name": "锂电池制造",
          "value": 18,
          "symbolSize": 90,
          "draggable": true,
          "itemStyle": {
            "normal": {
              "shadowBlur": 100,
              "shadowColor": colorList[1],
              "color": colorList[1]
            }
          }
        },
        {
          "name": "发动机制造",
          "value": 19,
          "symbolSize": 95,
          "draggable": true,
          "itemStyle": {
            "normal": {
              "shadowBlur": 100,
              "shadowColor": colorList[1],
              "color": colorList[1]
            }
          }
        },
        {
          "name": "汽车制造",
          "value": 16,
          "symbolSize": 80,
          "draggable": true,
          "itemStyle": {
            "normal": {
              "shadowBlur": 100,
              "shadowColor": colorList[6],
              "color": colorList[6]
            }
          }
        },
        {
          "name": "电视机制造",
          "value": 21,
          "symbolSize": 114,
          "draggable": true,
          "itemStyle": {
            "normal": {
              "shadowBlur": 100,
              "shadowColor": colorList[16],
              "color": colorList[16]
            }
          }
        },
        {
          "name": "空调制造",
          "value": 25,
          "symbolSize": 130,
          "draggable": true,
          "itemStyle": {
            "normal": {
              "shadowBlur": 100,
              "shadowColor": colorList[17],
              "color": colorList[17]
            }
          }
        },
        {
          "name": "冰箱制造",
          "value": 20,
          "symbolSize": 100,
          "draggable": true,
          "itemStyle": {
            "normal": {
              "shadowBlur": 100,
              "shadowColor": colorList[18],
              "color": colorList[18]
            }
          }
        }]
    }]
  };
  chart.setOption(option);
});
</script>

<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <div class="companyStatistic">
          <div class="numStatistic">
            <div class="header">
              <span>平台企业统计</span>
            </div>
            <div class="body">
              <div class="cell">
                <div class="number">112</div>
                <div class="label">企业总数</div>
              </div>
              <div class="cell">
                <div class="number">52</div>
                <div class="label">家电企业</div>
              </div>
              <div class="cell">
                <div class="number">50</div>
                <div class="label">汽车企业</div>
              </div>
              <div class="cell">
                <div class="number">50</div>
                <div class="label">正在执行任务企业</div>
              </div>
              <div class="cell">
                <div class="number">50</div>
                <div class="label">空闲企业</div>
              </div>
              <div class="cell">
                <div class="number">2</div>
                <div class="label">任务异常企业</div>
              </div>
            </div>
          </div>
          <div class="companyDistribution">
            <div class="header">
              <span>制造企业分布</span>
            </div>
            <div class="bubbles" ref="bubbles"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <company-table></company-table>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.companyStatistic {
  margin-top: 20px;
  margin-left: 10px;
  text-align: center;

  .header {
    font-size: 20px;
    margin-bottom: 10px;
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
  }

  .numStatistic {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;

    .body {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;

      .cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-right: 1px solid #ccc;
        padding: 10px 0;
      }

      .number {
        font-size: 24px;
        font-weight: bold;
      }

      .label {
        font-size: 12px;
        color: #666;
      }

      & :nth-child(3n) {
        border-right: none;
      }
    }
  }

  .companyDistribution {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    .bubbles {
      width: 100%;
      height: 500px;
    }
  }
}
</style>