<template>
  <el-button type="success" plain @click="formulaVisible = true" style="margin-bottom: 10px;">模型解读</el-button>
  <el-dialog v-model="formulaVisible" title="多重产业链企业分布模型解读">
    <el-form>
      <el-form-item label="节点含义：" :label-width="formLabelWidth">
        <span>多重产业链上的企业</span>
      </el-form-item>
      <el-form-item label="网络层含义含义：" :label-width="formLabelWidth">
        <span>多重产业链上的企业组成的不同关系网络</span>
      </el-form-item>
      <el-form-item label="垂直边含义：" :label-width="formLabelWidth">
        <span>同一企业在不同关系网络中的映射</span>
      </el-form-item>
    </el-form>
  </el-dialog>
  <div>
    <div id="main"
         style="width: 1000px;height:400px;margin: 0 auto;background-color: rgba(250,247,247,0.5)"></div>
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="taskAllocationRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入企业名称"/>
        </el-form-item>
        <el-form-item label="企业核心业务" prop="requirements">
          <el-input v-model="form.requirements" placeholder="请输入核心业务"/>
        </el-form-item>
        <el-form-item label="企业市场份额" prop="products">
          <el-input v-model="form.products" placeholder="请输入企业市场份额"/>
        </el-form-item>
        <el-form-item label="企业子企业数量" prop="aa">
          <el-input v-model="form.numbers" placeholder="请输入企业的子企业数量"/>
        </el-form-item>
        <el-form-item label="企业预估盈利率" prop="bb">
          <el-input v-model="form.profit" placeholder="请输入企业预估盈利率"/>
        </el-form-item>
        <el-form-item label="企业性质" prop="property">
          <el-radio-group v-model="form.property">
            <el-radio label="供应商"/>
            <el-radio label="制造商"/>
            <el-radio label="分销商"/>
            <el-radio label="服务商"/>
            <el-radio label="环保公司"/>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="企业所属产业链" prop="chain">
          <el-select v-model="form.chain" placeholder="请选择所属产业链">
            <el-option label="汽车产业链" value="option1"></el-option>
            <el-option label="家电产业链" value="option2"></el-option>
            <el-option label="汽车产业链 & 家电产业链" value="option3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>


<script setup>
import {onMounted, reactive, ref} from 'vue'
import * as echarts from 'echarts'
import {getAllCompany} from "@/api/datafusion/test"; //引入echarts
const formulaVisible = ref(false)
const open = ref(false);
const title = ref("");
const {proxy} = getCurrentInstance();
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    requirements: null,
    products: null,
    ddl: null,
    duration: null,
    number: null,
    lists: null
  },
  rules: {
    name: [
      {required: true, message: "企业名称不能为空", trigger: "blur"}
    ],
    property: [
      {required: true, message: "企业性质不能为空", trigger: "change"}
    ],
    chain: [
      {required: true, message: "企业所属产业链不能为空", trigger: "change"}
    ]
  }
});
const {queryParams, form, rules} = toRefs(data);

function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加企业表 ";
}

function reset() {
  form.value = {
    id: null,
    name: null,
    requirements: null,
    products: null,
    ddl: null,
    duration: null,
    number: null,
    lists: null,
  };
  proxy.resetForm("taskAllocationRef");
}

function submitForm() {

  proxy.$refs["taskAllocationRef"].validate(valid => {
    if (valid) {
      proxy.$modal.msgSuccess("新增成功");
      open.value = false;
    }
  });
}

function cancel() {
  open.value = false;
  reset();
}

//定义组件的自定义事件
let myChart = null;

onMounted(async () => {
  const chartDom = document.getElementById('main');
  myChart = echarts.init(chartDom);
  //const response = await axios.get('/src/assets/dataFusion/company.json');
  const response = ref(null);
  try {
    response.value = await getAllCompany();
    //console.log(response.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  //console.log(JSON.stringify(response.value));
  const graph = response.value;
  // console.log(graph);
  const containerWidth = document.getElementById('main').clientWidth;// 图形容器的宽度
  const containerHeight = document.getElementById('main').clientHeight;// 图形容器的高度

  //计算polygon的相对坐标点
  function calculatePoints(points) {
    const widthRatio = containerWidth / 800; // 宽度比例
    const heightRatio = containerHeight / 500; // 高度比例
    return points.map(point => [point[0] * widthRatio, point[1] * heightRatio]);
  }

  // 计算节点的相对位置
  graph.nodes.forEach(node => {
    node.locationX = node.locationX / 800 * containerWidth;
    node.locationY = node.locationY / 500 * containerHeight;
  });

  //绘制ECharts关系图
  myChart.setOption({
    graphic: [
      {
        type: 'group',
        position: [100, 70], // 左上角位置
        children: [
          {
            type: 'polygon',
            shape: {
              points: calculatePoints([[0, -10], [650, -10], [600, 110], [-50, 110]])  // 左上、右上、右下、左下
            },
            style: {
              fill: '#eee',
              stroke: 'red',
              lineWidth: 3,
              opacity: 0.3,
              shadowBlur: 10,
              shadowColor: 'gray',
              shadowOffsetX: 5,
              shadowOffsetY: 5
            }
          },
          {
            type: 'text',
            position: [-50, 70], // 相对于 group 左上角位置的偏移量
            style: {
              text: '合作关系', // 你要显示的文字
              fill: 'black', // 文字颜色
              fontSize: 14 // 文字大小
            }
          }
        ]
      },

      {
        type: 'group',
        position: [100, 190], // 左上角位置，根据需要进行调整
        children: [
          {
            type: 'polygon',
            shape: {
              points: calculatePoints([[-10, -40], [650, -40], [615, 70], [-50, 70]])  // 左上、右上、右下、左下
            },
            style: {
              fill: '#eee',
              stroke: 'black',
              lineWidth: 3,
              opacity: 0.3,
            }
          },
          {
            type: 'text',
            position: [-50, 40], // 相对于 group 左上角位置的偏移量
            style: {
              text: '供应关系', // 你要显示的文字
              fill: 'black', // 文字颜色
              fontSize: 14 // 文字大小
            }
          }
        ]
      },

      {
        type: 'group',
        position: [50, 310], // 左上角位置
        children: [
          {
            type: 'polygon',
            shape: {
              points: calculatePoints([[0, 30], [660, 30], [700, -80], [45, -80]])  // 左下、右下、右上、左上
            },
            style: {
              fill: '#eee',
              stroke: 'blue',
              lineWidth: 3,
              opacity: 0.3,
              shadowBlur: 10,
              shadowColor: 'gray',
              shadowOffsetX: 5,
              shadowOffsetY: 5
            }
          },
          {
            type: 'text',
            position: [15, 5], // 相对于 group 左上角位置的偏移量
            style: {
              text: '竞争关系', // 你要显示的文字
              fill: 'black', // 文字颜色
              fontSize: 14 // 文字大小
            }
          }
        ]
      }
    ],

    title: {
      text: '多重产业链企业分布模型',
      // subtext: '这是一个副标题',
      top: 'bottom',
      left: 'center'
    },


    tooltip: {
      show: true,
      trigger: 'item',
      formatter: function (params) {
        if (params.dataType === 'node') {
          //console.log(typeof params.data.category);
          var id = params.data.id;
          var trueId = params.data.trueId;
          const name = params.data.name;
          const chain = params.data.chain;
          const category = params.data.category;
          const marketShare = (params.data.marketShare * 100).toFixed(1) + '%';
          const marketIncrease = (params.data.marketIncrease * 100).toFixed(1) + '%';
          const profitability = (params.data.profitability * 100).toFixed(1) + '%';
          const investRatio = (params.data.investRatio * 100).toFixed(1) + '%';
          const productWidth = params.data.productWidth;
          const productDepth = params.data.productDepth;
          const brandAwareness = Math.round(params.data.brandAwareness * 100);
          const cooperationWillingness = params.data.cooperationWillingness * 100;
          const reputation = params.data.reputation * 100;
          const cooperationNum = params.data.cooperationNum;
          const cooperationSuccess = (params.data.cooperationSuccess * 100).toFixed(1) + '%';
          const averageRoi = (params.data.averageRoi * 100).toFixed(1) + '%';
          const suppliersNum = params.data.suppliersNum;
          const turnover = (params.data.turnover * 100).toFixed(1) + '%';
          const deliveryRate = (params.data.deliveryRate * 100).toFixed(1) + '%';
          const tradeLevel = params.data.tradeLevel * 100;
          const layer = params.data.layer;
          if (layer === 1) {
            return "id: " + trueId + '<br/>' + "locationId：" + id + '<br/>' + "企业名称：" + name + '<br/>' + "企业所属产业链：" + chain + '<br/>' + "市场份额：" + marketShare + '<br/>' + "市场增长率：" + marketIncrease + '<br/>' + "盈利率：" + profitability + '<br/>' + "科研投入比例：" + investRatio + '<br/>' + "产品线宽度：" + productWidth + '<br/>' + "产品线深度：" + productDepth + '<br/>' + "品牌知名度：" + brandAwareness;
          } else if (layer === 2) {
            return "id: " + trueId + '<br/>' + "locationId：" + id + '<br/>' + "企业名称：" + name + '<br/>' + "企业所属产业链：" + chain + '<br/>' + "供应商数量：" + suppliersNum + '<br/>' + "库存周转率：" + turnover + '<br/>' + "准时交付率：" + deliveryRate + '<br/>' + "物流水平：" + tradeLevel;
          } else if (layer === 3) {
            return "id: " + trueId + '<br/>' + "locationId：" + id + '<br/>' + "企业名称：" + name + '<br/>' + "企业所属产业链：" + chain + '<br/>' + "合作意愿强度：" + cooperationWillingness + '<br/>' + "信誉分：" + reputation + '<br/>' + "参与合作数量：" + cooperationNum + '<br/>' + "合作成功率：" + cooperationSuccess + '<br/>' + "合作项目平均收益率：" + averageRoi;
          }

        }

      }
    },
    animationDuration: 1000, //初始动画的时长
    animationEasingUpdate: 'quinticInOut', //节点和边的动画方式（缓动函数）
    series: [{
      type: 'graph',
      layout: 'none',
      data: graph.nodes.map(node => ({
        id: node.locationId,  // 使用 locationId 作为唯一标识符
        trueId: node.id,
        x: node.locationX,
        y: node.locationY,
        symbolSize: 20,
        name: node.name,
        chain: node.chain,
        category: node.category,
        marketShare: node.marketShare,
        marketIncrease: node.marketIncrease,
        profitability: node.profitability,
        investRatio: node.investRatio,
        productWidth: node.productWidth,
        productDepth: node.productDepth,
        brandAwareness: node.brandAwareness,
        cooperationWillingness: node.cooperationWillingness,
        reputation: node.reputation,
        cooperationNum: node.cooperationNum,
        cooperationSuccess: node.cooperationSuccess,
        averageRoi: node.averageRoi,
        suppliersNum: node.suppliersNum,
        turnover: node.turnover,
        deliveryRate: node.deliveryRate,
        tradeLevel: node.tradeLevel,
        layer: node.layer
      })),
      //categories: graph.categories,
      roam: true,     //开启鼠标缩放和平移漫游

      // 设置节点样式
      itemStyle: {
        // 指定节点的默认样式
        normal: {
          color: '#61a0a8',  // 节点的默认颜色
        },
        // 指定节点的高亮样式
        emphasis: {
          color: '#c23531',  // 节点的高亮颜色
        },
      },

      label: {
        show: true,     //是否显示节点标签
        // position: 'right',  //节点标签的位置
        formatter: '{b}'  //节点标签的内容格式器，a 代表系列名，b 代表数据名，c 代表数据值。
      },

      emphasis: {
        focus: 'adjacency', //当鼠标移动到节点上，突出显示节点以及节点的边和邻接节点，'adjacency' 表示只突出显示节点以及节点的边
        lineStyle: {    //边的设置
          width: 10,
          type: "dotted",
          opacity: 0.7,
        }
      },
    }]


  });

  myChart.on('click', params => {
    if (params.dataType == "node") {
      taskData.name = params.data.name;
      taskData.requirements = params.data.requirements;
      taskData.products = params.data.products;
      taskData.deadline = params.data.deadline;
      taskData.lastTime = params.data.lastTime;
      taskData.numbers = params.data.numbers;
      taskData.lists = params.data.lists;
      //console.log(params.data.name)
    }
  });

  myChart.on('mousedown', params => {
    if (params.event.target.tagName === 'CANVAS') {
      const startPoint = myChart.convertFromPixel('grid', [params.event.offsetX, params.event.offsetY]);
      let rect = null;

      const mousemoveHandler = e => {
        const curPoint = myChart.convertFromPixel('grid', [e.offsetX, e.offsetY]);
        const minX = Math.min(startPoint[0], curPoint[0]);
        const maxX = Math.max(startPoint[0], curPoint[0]);
        const minY = Math.min(startPoint[1], curPoint[1]);
        const maxY = Math.max(startPoint[1], curPoint[1]);

        if (!rect) {
          rect = myChart.graphic.add({
            type: 'rect',
            shape: {
              x: minX,
              y: minY,
              width: maxX - minX,
              height: maxY - minY
            },
            style: {
              fill: 'rgba(255, 255, 255, 0.3)',
              stroke: '#666',
              lineWidth: 2
            }
          });
        } else {
          rect.setShape({
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
          });
        }

        const nodes = myChart.getOption().series[0].data;
        const nodesInRect = nodes.filter(node => {
          const point = myChart.convertToPixel('grid', [node.x, node.y]);
          return myChart.graphic.isPointInGraphic(rect, point);
        });
        const selectedNodes = nodesInRect.map(node => node.name);
        myChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          name: selectedNodes
        });
      };

      const mouseupHandler = () => {
        myChart.off('mousemove', mousemoveHandler);
        myChart.off('mouseup', mouseupHandler);
        if (rect) {
          myChart.graphic.remove(rect);
        }
      };

      myChart.on('mousemove', mousemoveHandler);
      myChart.on('mouseup', mouseupHandler);
    }
  });


});
// 初始化ECharts实例


</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-container {
  display: flex;
  align-items: center;
}

.header-text {
  margin-right: 10px;
  font-weight: bold
}

.my-table {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
</style>