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
  <div ref="chartContainer" class="chart-container"></div>
  </Body>
</template>


<script setup>
import Body from "@/views/dashboard/components/main/component/Body.vue";
import * as echarts from "echarts";
import {ref, onMounted} from 'vue';


const chartContainer = ref(null);

const createPieChart = () => {
      const chartInstance = echarts.init(chartContainer.value);

      const chartOptions = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          textStyle:
              {
                color: '#fff',
                fontSize: 10,
              },
          left:'10%',
        },
        series: [
          {
            type: 'pie',
            left: 'center',
            bottom:0,
            radius: '100%',
            data: [
              {value: 5, name: '不跨企业'},
              {value: 10, name: '跨企业'},
              {value: 15, name: '跨企业跨链'},
              {value: 50, name: '跨企业跨链跨群'},
              {value: 20, name: '跨企业跨群'},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
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
          },
        ],
      };

      chartInstance.setOption(chartOptions);
    }
;

onMounted(() => {
  createPieChart();
});


</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
