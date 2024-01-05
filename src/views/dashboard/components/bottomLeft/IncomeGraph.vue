<template>
  <Body :name="'收益评估'" :icon-name="'icon-chart-line'" :dec-id="1">
  <div id="chart" style="height:100%"></div>
  </Body>
</template>
<script setup>
import Body from "@/views/dashboard/components/main/component/Body.vue";
import * as echarts from 'echarts';
import {onMounted} from 'vue';

let myChart = null;
onMounted(async () => {
    // 初始化ECharts实例
    const chartDom = document.getElementById('chart');
    myChart = echarts.init(chartDom);

    // 定义12个月份的数组
    var months = ['2022-01', '2022-02', '2022-03', '2022-04', '2022-05', '2022-06',
        '2022-07', '2022-08', '2022-09', '2022-10', '2022-11', '2022-12'];

    // 指定图表的配置项和数据
    var option = {
        title: {
            // text: '盈利企业数和盈利企业率'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['汽车产业链企业数', '家电产业链企业数', '汽车产业链盈利率', '家电产业链盈利率'],
            textStyle: {
                color: '#fff'
            }
        },
        xAxis: {
            type: 'category',
            data: months
        },
        yAxis: [
            {
                type: 'value',
                name: '盈利企业数',
                min: 0,
                max: 200,
                interval: 50,
                axisLabel: {
                    formatter: '{value} '
                }
            },
            {
                type: 'value',
                name: '盈利企业率',
                min: 0,
                max: 100,
                interval: 20,
                axisLabel: {
                    formatter: '{value} %'
                }
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '30%',
            containLabel: true
        },
        series: [
            {
                name: '汽车产业链企业数',
                type: 'bar',
                data: [100, 120, 130, 150, 160, 180, 190, 200, 180, 160, 140, 120]
            },
            {
                name: '家电产业链企业数',
                type: 'bar',
                data: [80, 90, 100, 110, 120, 130, 140, 150, 130, 110, 90, 70]
            },
            {
                name: '汽车产业链盈利率',
                type: 'line',
                yAxisIndex: 1,
                data: [50, 52, 53, 55, 56, 58, 60, 62, 64, 66, 68, 70]
            },
            {
                name: '家电产业链盈利率',
                type: 'line',
                yAxisIndex: 1,
                data: [40, 45, 48, 50, 52, 55, 57, 60, 63, 65, 68, 70]
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
})

</script>