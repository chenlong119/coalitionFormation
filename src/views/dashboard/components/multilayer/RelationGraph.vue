<template>
        <div id="main" style="height:100%"></div>
</template>
  
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';

let myChart = null;
onMounted(async () => {
    const chartDom = document.getElementById('main');
    myChart = echarts.init(chartDom);
    const response = await axios.get('/src/assets/dashboard/networkRelation.json');
    const graph = response.data;
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
        node.x = node.x / 800 * containerWidth;
        node.y = node.y / 500 * containerHeight;
    });

    //绘制ECharts关系图
    myChart.setOption({
        graphic: [
            {
                type: 'polygon',
                shape: {
                    points: calculatePoints([[100, 50], [750, 50], [700, 180], [50, 180]])  //左上、右上、右下、左下
                },
                style: {
                    fill: '#eee',
                    stroke: 'red',
                    lineWidth: 3,
                    opacity: 0.3, //透明度
                    shadowBlur: 10, //边框阴影模糊程度
                    shadowColor: 'black', //边框阴影颜色
                    shadowOffsetX: 5, //边框阴影水平偏移量
                    shadowOffsetY: 5 //边框阴影垂直偏移量
                }
            },
            {
                type: 'polygon',
                shape: {
                    points: calculatePoints([[50, 330], [700, 330], [750, 200], [100, 200]])  //左下、右下、右上、左上
                },
                style: {
                    fill: '#eee',
                    stroke: 'blue',
                    lineWidth: 3,
                    opacity: 0.3,
                    shadowBlur: 10,
                    shadowColor: 'black',
                    shadowOffsetX: 5,
                    shadowOffsetY: 5
                }
            },
            {
                type: 'polygon',
                shape: {
                    points: calculatePoints([[50, 480], [700, 480], [750, 350], [100, 350]])  //左下、右下、右上、左上
                },
                style: {
                    fill: '#eee',
                    stroke: 'green',
                    lineWidth: 3,
                    opacity: 0.2,
                    shadowBlur: 10,
                    shadowColor: 'black',
                    shadowOffsetX: 5,
                    shadowOffsetY: 5
                }
            }
        ],

        tooltip: {
            show: true,
            trigger: 'item',
            formatter: function (params) {
                // console.log(params)
                if (params.dataType === 'node') {
                    var id = params.data.id;
                    var name = params.name;
                    var filed = params.data.filed;
                    var category = params.data.category;
                    var network = params.data.network;
                    return "id: " + id + '<br/>' + "企业：" + name + '<br/>' + "所处领域：" + filed + '<br/>' + '所处产业链: ' + category + '<br/>' + '所处网络: ' + network;
                } else if (params.dataType === 'edge') {
                    var source = params.data.source;
                    var target = params.data.target;
                    var label = params.data.label.formatter;
                    return "源节点: " + source + '<br/>' + "目标节点：" + target + '<br/>' + "连接关系：" + label;
                }
            }
        },
        legend: [
            {
                data: graph.categories.map(function (a) {
                    return a.name;
                }),
                    textStyle: {
                        color:'white'
                    }
            }
        ],
        animationDuration: 1500, //初始动画的时长
        animationEasingUpdate: 'quinticInOut', //节点和边的动画方式（缓动函数）
        series: [{
            type: 'graph',
            layout: 'none',
            data: graph.nodes,
            links: graph.links,
            categories: graph.categories,
            network: graph.network,
            roam: false,     //开启鼠标缩放和平移漫游

            label: {
                show: true,     //是否显示节点标签
                // position: 'right',  //节点标签的位置
                formatter: '{b}'  //节点标签的内容格式器，a 代表系列名，b 代表数据名，c 代表数据值。
            },
            lineStyle: {
                normal: {
                    color: 'source',    //边的颜色是由源节点决定的
                    curveness: 0.4  //边的曲度，支持从 0 到 1 的值，值越大曲度越大。
                }
            },
            emphasis: {
                focus: 'adjacency', //当鼠标移动到节点上，突出显示节点以及节点的边和邻接节点，'adjacency' 表示只突出显示节点以及节点的边
                lineStyle: {    //边的设置
                    width: 10,
                    type: "dotted",
                    // shadowBlur:0.5,
                    opacity: 0.7
                }
            },
        }]


    });

    myChart.on('click', params => {
        if (params.componentType === 'polygon') {
            const nodes = myChart.getOption().series[0].data;
            const nodesInPolygon = nodes.filter(node => {
                const point = myChart.convertToPixel('grid', [node.x, node.y]);
                return myChart.graphic.isPointInGraphic(params.componentIndex, point);
            });
            const selectedNodes = nodesInPolygon.map(node => node.name);
            myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                name: selectedNodes
            });
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

onUnmounted(() => {
    myChart.dispose();
});

</script>
  
<style>
/* 设置容器高度 */
.el-main {
    height: 100%;
}
</style>
