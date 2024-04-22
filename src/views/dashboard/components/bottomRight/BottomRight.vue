<!-- <script setup>
import {ref,onMounted,getCurrentInstance} from "vue";
const {proxy} = getCurrentInstance();
const chartref = ref(null);
var colors=[
    "#00ADD0",
    "#FFA12F",
    "#B62AFF",
    "#604BFF",
    "#6E35FF",
    "#002AFF",
    "#20C0F4",
    "#95F300",
    "#04FDB8",
    "#AF5AFF"
]
var getdata=function getData() {
    let data = {
        name: "根节点1",
        value: 0,
        children: []
    };
    for (let i = 1; i <= 10; i++) {
        let obj = {
            name: "节点" + i,
            value: i,
            children: [],
        };
        for (let j = 1; j <= 5; j++) {
            let obj2 = {
                name: `节点1-${i}-${j}`,
                value: 1 + "-" + i + "-" + j,
            };
            if(j%2==1){
                obj2.children=[]
                for (let k = 1; k <= 3; k++) {
                    let obj3 = {
                        name: `节点1-${i}-${j}-${k}`,
                        value: 1 + "-" + i + "-" + j+'-'+k,
                    };
                    obj2.children.push(obj3);
                }
            }

            obj.children.push(obj2);
        }

        data.children.push(obj);
    }
    let arr=[]
    arr.push(data)
    //
    arr=handle(arr,0)
    return arr;
}
var handle=function handleData(data,index,color='#00f6ff'){
    //index标识第几层
    return data.map((item,index2)=>{
        //计算出颜色
        if(index==1){
            color = colors.find((item, eq) => eq == index2 % 10);
        }
        // 设置节点大小
        if(index===0 || index===1){
            item.label= {
                position: "inside",
                //   rotate: 0,
                //   borderRadius: "50%",
            }
        }
        // 设置label大小
        switch(index){
            case 0:
                item.symbolSize=70
                break;
            case 1:
                item.symbolSize=50
                break;
            default:
                item.symbolSize=10
                break;
        }
        // 设置线条颜色
        item.lineStyle= { color: color }

        if (item.children) {//存在子节点
            item.itemStyle = {
                borderColor: color,
                color:color
            };
            item.children=handle(item.children,index+1,color)
        } else {//不存在
            item.itemStyle = {
                color:'transparent',
                borderColor: color
            };
        }
        return item
    })
}

var option = {
    type: "tree",
    backgroundColor: "#000",
    toolbox: { //工具栏
        show: true,
        iconStyle: {
            borderColor: "#03ceda"
        },
        feature: {
            restore: {}
        }
    },
    tooltip: {//提示框
        trigger: "item",
        triggerOn: "mousemove",
        backgroundColor: "rgba(1,70,86,1)",
        borderColor: "rgba(0,246,255,1)",
        borderWidth: 0.5,
        textStyle: {
            fontSize: 10
        }
    },
    series: [
        {
            type: "tree",
            hoverAnimation: true, //hover样式
            data:getdata(),
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            layout: "radial",
            symbol: "circle",
            symbolSize: 10,
            nodePadding: 20,
            animationDurationUpdate: 750,
            expandAndCollapse: true, //子树折叠和展开的交互，默认打开
            initialTreeDepth: 2,
            roam: true, //是否开启鼠标缩放和平移漫游。scale/move/true
            focusNodeAdjacency: true,
            itemStyle: {
                borderWidth: 1,
            },
            label: { //标签样式
                color: "#fff",
                fontSize: 10,
                fontFamily: "SourceHanSansCN",
                position: "inside",
                rotate: 0,
            },
            lineStyle: {
                width: 1,
                curveness:0.5,
            }
        }
    ]
};
onMounted(()=>{
    let myChart = proxy.$echarts.init(chartref.value);
    myChart.setOption(option);
})
</script>

<template>
    <div class="w-full h-full flex flex-col p-3">
        <div class="title">
            <span class="iconfont icon-layer-group text-blue-300 text-2xl"></span>
            <span class="text-white text-xl ml-2">协同模式</span>
        </div>
        <div ref="chartref" class="flex-grow"></div>
  <template>
  <div ref="chartContainer" class="chart-container"></div>
</template>  </div>
</template>

<style scoped lang="less">

</style> -->

<template>
  <Body :icon-name="'icon-laptop'" :dec-id="1" :name="'企业群多模式协同'">
  <div ref="sit2" class="chart-container"></div>
  </Body>
</template>


<script setup>
import Body from "@/views/dashboard/components/main/component/Body.vue";
import * as echarts from "echarts";
import request from "@/utils/request.js";
import {onMounted, reactive, ref, nextTick} from 'vue';
import {
  runGeneticAlgorithm,
  getActiveTasks,
  sendSolutionToBackend,
  fetchCoalitionDetails,
  modeShow,
  getAllScoreRecords,

} from '@/api/multimode/faultyMachine';


// mode板块
const modesData = ref([]); // 使用ref来保持响应性

const fetchModesData = async () => {
  try {
    const response = await modeShow();
    console.log("Data from modeShow:", response);
    modesData.value = response.map(mode => ({
      ...mode,
      completionRate: (mode.completionRate * 100).toFixed(2) + '%', // 假设完成率是0到1之间的数，转换为百分比
      failureRate:(100- (mode.completionRate * 100).toFixed(2) )+ '%',
    }));
    // 确保DOM已更新，再绘制echarts图表
    nextTick(() => {
      if (sit2.value) { // 确保sit2已经被ref关联
        createPieChart(sit2.value, modesData.value);
      }
    });
  } catch (error) {
    console.error("Failed to fetch modes data:", error);
  }
};
// 定义一个计算属性来排序modesData
const sortedModesData = computed(() => {
  // 假设每个模式对象中的完成率已经是百分比形式的字符串了，需要转换为数字进行比较
  return modesData.value.slice().sort((a, b) => {
    // 转换完成率字符串为数字，去掉百分号并转换为浮点数进行比较
    let rateA = parseFloat(a.completionRate.replace('%', ''));
    let rateB = parseFloat(b.completionRate.replace('%', ''));
    return rateB - rateA; // 降序排序
  });
});

const sit2 = ref(null);//饼状图
onMounted(async () => {
  try {
    const response = await getAllScoreRecords();
    console.log('Received data:', response); // 打印到控制台
    scoreRecords.value = response; // 将数据保存到scoreRecords变量中
  } catch (error) {
    console.error('Error fetching data:', error);
  }

//mode 板块挂载
  fetchModesData();
  fetchData();

  //调用GA函数
  fetchRunDataAndUpdateExceptionalTaskIds();
  //获取长宽
  getActiveTasks().then(response => {
    const rectangle = rectangleRef.value;
    if (rectangle) {
      const containerWidth = rectangle.offsetWidth;
      const containerHeight = rectangle.offsetHeight;
      prepareCircles(response, containerWidth, containerHeight);
    }
  }).catch(error => {
    console.error('获取任务数据失败', error);
  });
  // intervalId = setInterval(toggleCirclesVisibility, 20000);
  try {
    isRunning.value = true;
    const response = await runGeneticAlgorithm();
    console.log(response); // 或者处理返回的数据
    const response1 = await getActiveTasks();
    console.log('获取:',response1); // 或者处理返回的数据
  } catch (error) {
    console.error('Error running genetic algorithm:', error);
  } finally {
    isRunning.value = false;
  }
});
function createPieChart(chartContainer, data) {
  const chartInstance = echarts.init(chartContainer);
  const chartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        //console.log("ECharts tooltip params:", params); // 输出params以检查
        const modeData = data.find(item => item.modeName === params.name);
        const completionRate = modeData.completionRate;
        const failureRate = modeData.failureRate;
        const defaultContent = `${params.marker}${params.name} : ${params.value}<br/>`;
        const additionalContent = `任务完成率: ${completionRate}<br/>故障发生率: ${failureRate}`;
        return defaultContent + additionalContent;
      },
    },
    series: [
      {
        type: 'pie',
        data: data.map(item => ({value: item.competitionNum, name: item.modeName})),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
  chartInstance.setOption(chartOptions);
}

</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
