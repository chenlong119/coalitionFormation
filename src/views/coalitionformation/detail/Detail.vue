<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card :shadow="'hover'">
          <template #header>
            <span>已分配任务的完成进度变化图</span>
            <el-input v-model="hours" placeholder="请输入时间间隔1-40" style="width: 200px;margin-left: 10px"/>
          </template>
          <div ref="taskInfo" style="width: 100%;height: 350px"
               @mouseenter="handleHover" @mouseleave="handleLeave(40)"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :shadow="'hover'">
          <template #header>
            <span>当前任务间的关系图</span>
          </template>
          <div ref="taskLinkageInfo" style="width:100%; height: 350px"/>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin: 10px 0">
      <el-col :span="14">
        <el-card :shadow="'hover'">
          <template #header>
            <span>任务分配情况</span>
          </template>
          <div style="width:100%; height: 400px">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="id" label="任务编号" width="100"/>
              <el-table-column prop="tname" label="任务名称" width="180"/>
              <el-table-column prop="ttype" label="任务类型" width="180"/>
              <el-table-column prop="duration" label="任务价值(万元)"/>
              <el-table-column prop="tarrival" label="任务到来时间"/>
              <el-table-column prop="current" label="任务当前进度%"/>
              <el-table-column label="任务所属联盟名称">
                <template #default="{row,$index}">
                  <el-link type="primary" @click="handleCoalition($index)">{{ row.cname }}</el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card :shadow="'hover'">
          <template #header>
            <span>任务完成情况</span>
          </template>
          <div ref="taskFinishInfo" style="width:100%; height: 400px"/>
        </el-card>
      </el-col>
    </el-row>
    <el-drawer direction="rtl" v-model="drawer" :size="810">
      <Drawer :cid="cid" :cname="cname"></Drawer>
    </el-drawer>
  </div>
</template>

<script setup>
import {getCurrentInstance, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {useCoalitionStore} from "@/store/modules/coalition";
import * as echarts from "echarts";
import Drawer from "@/views/coalitionformation/detail/coalition/Drawer.vue";


const hours = ref('');
const tableData = [
  {
    id: 1,
    tname: '生产汽车车身',
    ttype: '生产任务',
    duration: 200,
    tarrival: '2021-4-5',
    tddl: '2021-5-4',
    cid: '1',
    cname: '联盟1',
    current: 50
  },
  {
    id: 2,
    tname: '汽车锂电池生产',
    ttype: '销售任务',
    duration: 150,
    tarrival: '2021-4-5',
    tddl: '2021-5-4',
    cid: '2',
    cname: '联盟2',
    current: 30
  },
  {
    id: 3,
    tname: '购买汽车玻璃',
    ttype: '生产任务',
    duration: 100,
    tarrival: '2021-4-5',
    tddl: '2021-5-4',
    cid: '1',
    cname: '联盟1',
    current: 80
  },
  {
    id: 4,
    tname: '生产汽车座椅',
    ttype: '生产任务',
    duration: 100,
    tarrival: '2021-4-5',
    tddl: '2021-5-4',
    cid: '2',
    cname: '联盟2',
    current: 90
  },
  {
    id: 5,
    tname: '销售汽车玻璃',
    ttype: '生产任务',
    duration: 160,
    tarrival: '2021-4-5',
    tddl: '2021-5-4',
    cid: '1',
    cname: '联盟1',
    current: 70
  },
  {
    id: 6,
    tname: '生产汽车轮胎',
    ttype: '采购任务',
    duration: 100,
    tarrival: '2021-4-5',
    tddl: '2021-5-4',
    cid: '2',
    cname: '联盟2',
    current: 60
  },
  {
    id: 7,
    tname: '销售电动汽车',
    ttype: '生产任务',
    duration: 180,
    tarrival: '2021-4-5',
    tddl: '2021-5-4',
    cid: '3',
    cname: '联盟3',
    current: 40
  },
  {
    id: 8,
    tname: '汽车锂电池生产',
    ttype: '采购任务',
    duration: 100,
    tarrival: '2021-4-5',
    tddl: '2021-5-4',
    cid: '2',
    cname: '联盟2',
    current: 20
  },
]
const coalitionStore = useCoalitionStore();
const taskInfo = ref(null);
const {proxy} = getCurrentInstance();
const taskLinkageInfo = ref(null);
let taskFinishInfo = ref(null);
let taskInfoInstance;
let times = [
  //1到40
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40
];
let data = [
  [431, 550, 878, 989, 351, 391, 508, 118],
  [428, 521, 868, 950, 335, 377, 506, 116],
  [422, 512, 867, 936, 316, 367, 502, 116],
  [423, 502, 867, 936, 299, 354, 478, 115],
  [411, 486, 850, 915, 300, 355, 461, 111],
  [409, 478, 837, 889, 285, 370, 458, 109],
  [405, 462, 828, 879, 271, 380, 443, 105],
  [407, 452, 801, 872, 261, 376, 430, 102],
  [400, 462, 790, 868, 253, 356, 430, 983],
  [384, 454, 790, 839, 254, 346, 420, 970],
  [372, 452, 770, 823, 259, 347, 394, 932],
  [359, 448, 770, 802, 240, 349, 394, 923],
  [357, 460, 751, 761, 230, 364, 365, 901],
  [343, 444, 735, 733, 226, 353, 363, 871],
  [331, 453, 722, 718, 225, 364, 339, 856],
  [312, 424, 717, 702, 226, 339, 325, 837],
  [307, 407, 713, 674, 220, 336, 314, 809],
  [300, 409, 686, 661, 211, 308, 312, 774],
  [298, 380, 664, 633, 192, 298, 309, 760],
  [282, 377, 657, 621, 181, 280, 289, 721],
  [279, 367, 646, 578, 178, 264, 285, 682],
  [280, 361, 645, 572, 172, 278, 278, 682],
  [276, 359, 641, 545, 171, 274, 278, 633],
  [261, 348, 629, 527, 168, 256, 263, 590],
  [258, 332, 601, 512, 156, 244, 243, 567],
  [238, 313, 601, 467, 151, 225, 237, 521],
  [227, 286, 594, 424, 137, 201, 237, 488],
  [226, 287, 571, 411, 127, 200, 210, 486],
  [230, 274, 548, 381, 120, 178, 201, 466],
  [218, 262, 541, 334, 103, 188, 187, 421],
  [205, 260, 525, 330, 93, 162, 187, 375],
  [190, 264, 502, 295, 86, 161, 186, 330],
  [190, 264, 502, 295, 86, 161, 186, 330],
  [173, 236, 473, 292, 76, 140, 159, 282],
  [162, 215, 453, 251, 68, 113, 140, 253],
  [159, 192, 444, 210, 71, 89, 134, 243],
  [140, 198, 434, 206, 64, 99, 123, 196],
  [120, 213, 420, 206, 52, 83, 108, 186],
  [119, 192, 413, 193, 47, 90, 82, 142],
  [120, 206, 392, 150, 45, 60, 80, 120],
];

const drawer = ref(false);
let cname = ref();
let cid = ref();
const handleCoalition = (index) => {
  drawer.value = true;
  nextTick(() => {
    cname.value = tableData[index].cname;
    cid.value = tableData[index].cid;
  })
}
//对data每个元素除以10
data = data.map(function (item) {
  return item.map(function (value) {
    return value / 10;
  });
});
let option1 = {
  tooltip: {formatter: "联盟名称：1号联盟<br/>{b}<br/>{c}%"},
  yAxis: {
    data: tableData.map((item) => item.tname),
    inverse: true,
  },
  xAxis: {
    axisLabel: {
      formatter: "{value}%",
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  series: [
    {
      realtimeSort: true,
      name: "Agent",
      showBackground: true,
      label: {
        show: true,
        position: "right",
        valueAnimation: true,
        formatter: "{c}%",
      },
      stack: {},
      type: "bar",
    },
  ],
  animationDuration: 0,
  animationDurationUpdate: 500,
  animationEasing: "linear",
  animationEasingUpdate: "linear",
};
let option2 = {
  title: {
    text: '展示系统中的当前任务之间的关系'
  },
  tooltip: {
    trigger: 'item',
    formatter: (params) => {
      return params.data.desc ? params.data.desc : params.data.name;
    }
  },
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  legend: {
    data: ['已分配', '未分配', '已完成', '失败'],
    left: '20',
    orient: 'vertical',
    top: 'center',
  },
  series: [
    {
      type: 'graph',
      layout: 'none',
      symbolSize: 43,
      roam: false,
      label: {
        show: true
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      edgeLabel: {
        fontSize: 20
      },
      data: [
        {
          name: '任务1',
          x: 200,
          y: 200,
          desc: '生产汽车车身',
          category: 0
        },
        {
          name: '任务2',
          x: 350,
          y: 200,
          desc: '生产汽车轮胎',
          category: 0
        },
        {
          name: '任务3',
          x: 450,
          y: 100,
          desc: '销售汽车玻璃',
          category: 0
        },
        {
          name: '任务4',
          x: 350,
          y: 300,
          desc: '销售电动汽车',
          category: 0
        },
        {
          name: '任务5',
          x: 450,
          y: 350,
          desc: '生产汽车方向盘',
          category: 0
        },
        {
          name: '任务6',
          x: 500,
          y: 200,
          desc: '汽车锂电池生产',
          category: 0
        },
        {
          name: '任务7',
          x: 200,
          y: 300,
          desc: '购买汽车玻璃',
          category: 0
        },
        {
          name: '任务8',
          x: 600,
          y: 100,
          desc: '购买汽车玻璃',
          category: 0
        },
        {
          name: '任务9',
          x: 600,
          y: 300,
          desc: '生产仪表盘',
          category: 1
        },
        {
          name: '任务10',
          x: 600,
          y: 450,
          desc: '提供钢铁',
          category: 1
        },
        {
          name: '任务11',
          x: 350,
          y: 400,
          desc: '销售电视机',
          category: 2
        },
        {
          name: '任务12',
          x: 700,
          y: 200,
          desc: '提供塑料',
          category: 1
        },
        {
          name: '任务13',
          x: 700,
          y: 60,
          desc: '生产整车',
          category: 2
        },
        {
          name: '任务14',
          x: 700,
          y: 350,
          desc: '生产洗衣机',
          category: 1
        },
        {
          name: '任务15',
          x: 500,
          y: 500,
          desc: '生产电视机',
          category: 1
        },
        {
          name: '任务16',
          x: 200,
          y: 450,
          desc: '生产洗衣机电机',
          category: 1
        },
        {
          name: '任务17',
          x: 800,
          y: 400,
          desc: '生产电视机电路板',
          category: 3
        },
        {
          name: '任务18',
          x: 800,
          y: 100,
          desc: '生产电视机示波器',
          category: 1
        },
        {
          name: '任务19',
          x: 900,
          y: 300,
          desc: '提供绝缘材料',
          category: 2
        }
      ],
      categories: [{name: "已分配"}, {name: "未分配"}, {name: "已完成"}, {name: "失败"}],
      links: [
        {
          source: '任务2',
          target: '任务1',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务3',
          target: '任务4',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务1',
          target: '任务3',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务2',
          target: '任务3',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务2',
          target: '任务4',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务1',
          target: '任务4',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务3',
          target: '任务5',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务6',
          target: '任务4',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务5',
          target: '任务10',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务8',
          target: '任务10',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务12',
          target: '任务14',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务11',
          target: '任务15',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务13',
          target: '任务17',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务18',
          target: '任务16',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务16',
          target: '任务19',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务7',
          target: '任务16',
          lineStyle: {
            curveness: 0.2
          }
        },
      ],
      lineStyle: {
        opacity: 0.9,
        width: 2,
        curveness: 0
      }
    }
  ]
};
let option3 = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}' + '\n' + '{d}%',
      },
      labelLine: {
        show: true,
        length: 10,
        length2: 10
      },
      data: [
        {value: 30, name: '已完成任务'},
        {value: 20, name: '现存任务'},
        {value: 8, name: '已分配任务'},
        {value: 12, name: '等待执行任务'},
        {value: 4, name: '失败任务'}
      ]
    }
  ]
};
let interval = null;
let index2 = 0;
const myInterval = (length) => {
  index2 = length - 1;
  interval = setInterval(() => {
    let smallOption = {
      title: {
        text: "前" + times[index2].toString() + "小时任务完成率",
      },
      series: [
        {
          data: data[index2],
        },
      ],
    };
    taskInfoInstance.setOption(smallOption);
    index2--;
    if (index2 < 0) {
      index2 = length - 1;
    }
  }, 1000);
}

const clearMyInterval = () => {
  clearInterval(interval);
}

watch(hours, (val) => {
  if (!val) {
    return;
  }
  if (val < 1 || val > 40) {
    proxy.$message.error("请输入1-40的数字");
    return;
  }
  clearMyInterval();
  myInterval(val);
})
const handleHover = () => {
  clearMyInterval();
}
const handleLeave = (time) => {
  myInterval(time);
}
// let timer = null;
onMounted(() => {
  taskInfoInstance = echarts.init(taskInfo.value);
  const taskLinkageInfoInstance = echarts.init(taskLinkageInfo.value);
  const taskFinishInstance = echarts.init(taskFinishInfo.value);
  taskInfoInstance.setOption(option1);
  taskFinishInstance.setOption(option3);
  myInterval(40);
  taskLinkageInfoInstance.setOption(option2);
})

onUnmounted(() => {
  clearMyInterval();
})
</script>

<style scoped lang="scss">
.text-2xl {
  font-size: 1.5rem;
}
</style>