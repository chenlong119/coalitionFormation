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
  <Body :icon-name="'icon-laptop'" :dec-id="1" :name="'协同模式'">
  <div ref="taskLinkageInfo1" class="chart-container"></div>
  </Body>
</template>


<script setup>
import Body from "@/views/dashboard/components/main/component/Body.vue";
import * as echarts from "echarts";
import {ref, onMounted} from 'vue';
import {
  fetchBusinessDirections,
  fetchBusinessLocations,
} from '@/api/multimode/faultyMachine';

const businessLocations = ref([]);
const businessDirections = ref([]);
const taskLinkageInfo1 = ref(null);
const colors = ['#e6ccff', '#ccffcc', '#ffffcc', '#ccf5ff'];
const colorMap = new Map();
const linkscolors = ['red', 'green', 'blue', 'gray', 'yellow', 'purple', 'orange'];
const linkscolorMap = new Map();
const getColorByGroupId = (groupId) => {
  if (!colorMap.has(groupId)) {
    // 分配一个新颜色
    const color = colors[colorMap.size % colors.length];
    colorMap.set(groupId, color);
  }
  return colorMap.get(groupId);
};
const getColorByModeId = (modeId) => {
  if (!linkscolorMap.has(modeId)) {
    // 分配一个新颜色
    const color = linkscolors[linkscolorMap.size % linkscolors.length];
    linkscolorMap.set(modeId, color);
  }
  return linkscolorMap.get(modeId);
};
const initializeChart = () => {
  // 创建或更新图表实例
  const chartInstance = echarts.init(taskLinkageInfo1.value);
  // 根据 businessLocations 和 businessDirections 更新图表配置
  const links = businessDirections.value.map(direction => {
    const sourceNode = `企业 ${direction.sourceId}`;
    const targetNode = `企业 ${direction.goalId}`;
    return {
      id: direction.locationId,
      source: sourceNode,
      target: targetNode,
      history: (direction.history || []).map(h => ({
        id: h.id, 
        taskName: h.taskName,
        deliveryDate: h.deliveryDate,
        deliveryExperience: h.deliveryExperience

      })),

      lineStyle: {
        curveness: 0.2,
        color: getColorByModeId(direction.modeId)
      },
      tooltip: {
        formatter: `连线信息：企业${direction.sourceId} -> 企业${direction.goalId}<br>当前合作任务：${direction.taskId}<br>协同模式：${direction.mode}`
      }
    };
  });
  console.log(links);

  const option = {
    tooltip: {},
    animationDurationUpdate: 50,
    animationEasingUpdate: 'quinticInOut',
    series: [{
      type: 'graph',
      layout: 'none',
      symbolSize: 45,
      roam: true,
      label: {
        show: true
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [1, 5],
      edgeLabel: {
        fontSize: 10
      },
      data: businessLocations.value.map(location => ({
        name: `企业 ${location.businessId}`,
        x: location.x,
        y: location.y,
        itemStyle: {color: getColorByGroupId(location.businessGroupId)},
        tooltip: {
          formatter: `节点信息：<br/>${location.businessId}---${location.businessName}<br/>所属企业群编号：${location.businessGroupId}<br/>企业群：${location.businessGroupName}`
        }
      })),
      links: links,
      lineStyle: {
        opacity: 0.9,
        width: 2,
        curveness: 0
      }

    }]

  };
  console.log("Business Locations:", businessLocations.value);
  console.log("Links:", links);
  chartInstance.on('click', (params) => {
    if (params.dataType === 'edge') {
      // 找到点击的连线对应的历史数据
      const clickedLink = businessDirections.value.find(d => `企业 ${d.sourceId}` === params.data.source && `企业 ${d.goalId}` === params.data.target);
      console.log("Clicked Link", clickedLink);

      // 确保找到了连线，并且该连线有历史数据
      if (clickedLink && clickedLink.history) {
        showDrawer({
          source: `企业 ${clickedLink.sourceId}`,
          target: `企业 ${clickedLink.goalId}`,
          history: clickedLink.history.map(h => ({
            id: h.id,
            taskName: h.taskName,
            deliveryDate: h.deliveryDate,
            deliveryExperience: h.deliveryExperience
          }))
        });
      }
    }
  });

  chartInstance.setOption(option);
};


onMounted(async () => {
const responseLocations = await fetchBusinessLocations();
  console.log(responseLocations); // 检查这里的响应
  businessLocations.value = responseLocations;
  const directions = await fetchBusinessDirections();
  businessDirections.value = directions;
  initializeChart();
});


</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
