<template>
  <div class="first">

    <el-row type="flex" justify="space-around">
      <el-col :span="6">
        <el-card shadow="hover">
          <!-- <div id="echarts-middle"></div> -->
          <div id="echarts-line"></div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="hover">
          <div id="echarts-middle"></div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div id="echarts-category"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="second" type="flex"  justify="space-around">
      <el-col :span="6">
        <el-card shadow="hover">
          <div id="echarts-access"></div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="hover">
          <div id="echarts-scatter"></div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div id="echarts-pressure"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script >
import  * as echarts from 'echarts'
// import RelationGraph from "src/views/dashboard/multilayer/RelationGraph.vue"
// import Map from "@arcgis/core/Map";
// import MapView from "@arcgis/core/views/MapView"
// import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
// import Geometry from "@arcgis/core/geometry/Geometry";

export default {
  name: "Home",
  data() {

  },
  created() {

  },
  mounted() {
    this.createsum()
    this.createEchartsline1()
    this.createEchartscategory1()//产业链当前累计上传文件个体排序柱状图
    this.createEchartsAccess1()//产业链当前上传文件省份分布饼图
    this.createEchartsscater1()//产业链近年上传文件情况雷达图
    this.createEchartsPressure1()//产业链总文件上传数量变化折线图
    //this.initMap()
  },
  methods: {
    createsum(){
      var chartDom = document.getElementById('echarts-middle');
      var myChart = echarts.init(chartDom);
      var option;
      option = {
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
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ]
          }
        ]
      };

      option && myChart.setOption(option);
    },
    createEchartsPressure1(){
      var chartDom = document.getElementById('echarts-pressure');
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        title: {
          text: '产业链总文件上传数量变化折线图',
          left:0,
          top:4
        },
        xAxis: {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
          }
        ]
      };

      option && myChart.setOption(option);
    },
    createEchartsscater1(){
      var chartDom = document.getElementById('echarts-scatter');
      var myChart = echarts.init(chartDom);
      var option;

              // Schema:
      // date,AQIindex,PM2.5,PM10,CO,NO2,SO2
      const data20 = [
        [55, 9, 56, 0.46, 18, 6, 1],
        [25, 11, 21, 0.65, 34, 9, 2],
        [56, 7, 63, 0.3, 14, 5, 3],
        [33, 7, 29, 0.33, 16, 6, 4],
        [42, 24, 44, 0.76, 40, 16, 5],
        [82, 58, 90, 1.77, 68, 33, 6],
        [74, 49, 77, 1.46, 48, 27, 7],
        [78, 55, 80, 1.29, 59, 29, 8],
        [267, 216, 280, 4.8, 108, 64, 9],
        [185, 127, 216, 2.52, 61, 27, 10],
        [39, 19, 38, 0.57, 31, 15, 11],
        [41, 11, 40, 0.43, 21, 7, 12],
        [64, 38, 74, 1.04, 46, 22, 13],
        [108, 79, 120, 1.7, 75, 41, 14],
        [108, 63, 116, 1.48, 44, 26, 15],
        [33, 6, 29, 0.34, 13, 5, 16],
        [94, 66, 110, 1.54, 62, 31, 17],
        [186, 142, 192, 3.88, 93, 79, 18],
        [57, 31, 54, 0.96, 32, 14, 19],
        [22, 8, 17, 0.48, 23, 10, 20],
        [39, 15, 36, 0.61, 29, 13, 21],
        [94, 69, 114, 2.08, 73, 39, 22],
        [99, 73, 110, 2.43, 76, 48, 23],
        [31, 12, 30, 0.5, 32, 16, 24],
        [42, 27, 43, 1, 53, 22, 25],
        [154, 117, 157, 3.05, 92, 58, 26],
        [234, 185, 230, 4.09, 123, 69, 27],
        [160, 120, 186, 2.77, 91, 50, 28],
        [134, 96, 165, 2.76, 83, 41, 29],
        [52, 24, 60, 1.03, 50, 21, 30],
        [46, 5, 49, 0.28, 10, 6, 31]
      ];
      const data21 = [
        [26, 37, 27, 1.163, 27, 13, 1],
        [85, 62, 71, 1.195, 60, 8, 2],
        [78, 38, 74, 1.363, 37, 7, 3],
        [21, 21, 36, 0.634, 40, 9, 4],
        [41, 42, 46, 0.915, 81, 13, 5],
        [56, 52, 69, 1.067, 92, 16, 6],
        [64, 30, 28, 0.924, 51, 2, 7],
        [55, 48, 74, 1.236, 75, 26, 8],
        [76, 85, 113, 1.237, 114, 27, 9],
        [91, 81, 104, 1.041, 56, 40, 10],
        [84, 39, 60, 0.964, 25, 11, 11],
        [64, 51, 101, 0.862, 58, 23, 12],
        [70, 69, 120, 1.198, 65, 36, 13],
        [77, 105, 178, 2.549, 64, 16, 14],
        [109, 68, 87, 0.996, 74, 29, 15],
        [73, 68, 97, 0.905, 51, 34, 16],
        [54, 27, 47, 0.592, 53, 12, 17],
        [51, 61, 97, 0.811, 65, 19, 18],
        [91, 71, 121, 1.374, 43, 18, 19],
        [73, 102, 182, 2.787, 44, 19, 20],
        [73, 50, 76, 0.717, 31, 20, 21],
        [84, 94, 140, 2.238, 68, 18, 22],
        [93, 77, 104, 1.165, 53, 7, 23],
        [99, 130, 227, 3.97, 55, 15, 24],
        [146, 84, 139, 1.094, 40, 17, 25],
        [113, 108, 137, 1.481, 48, 15, 26],
        [81, 48, 62, 1.619, 26, 3, 27],
        [56, 48, 68, 1.336, 37, 9, 28],
        [82, 92, 174, 3.29, 0, 13, 29],
        [106, 116, 188, 3.628, 101, 16, 30],
        [118, 50, 0, 1.383, 76, 11, 31]
      ];
      const data22 = [
        [91, 45, 125, 0.82, 34, 23, 1],
        [65, 27, 78, 0.86, 45, 29, 2],
        [83, 60, 84, 1.09, 73, 27, 3],
        [109, 81, 121, 1.28, 68, 51, 4],
        [106, 77, 114, 1.07, 55, 51, 5],
        [109, 81, 121, 1.28, 68, 51, 6],
        [106, 77, 114, 1.07, 55, 51, 7],
        [89, 65, 78, 0.86, 51, 26, 8],
        [53, 33, 47, 0.64, 50, 17, 9],
        [80, 55, 80, 1.01, 75, 24, 10],
        [117, 81, 124, 1.03, 45, 24, 11],
        [99, 71, 142, 1.1, 62, 42, 12],
        [95, 69, 130, 1.28, 74, 50, 13],
        [116, 87, 131, 1.47, 84, 40, 14],
        [108, 80, 121, 1.3, 85, 37, 15],
        [134, 83, 167, 1.16, 57, 43, 16],
        [79, 43, 107, 1.05, 59, 37, 17],
        [71, 46, 89, 0.86, 64, 25, 18],
        [97, 71, 113, 1.17, 88, 31, 19],
        [84, 57, 91, 0.85, 55, 31, 20],
        [87, 63, 101, 0.9, 56, 41, 21],
        [104, 77, 119, 1.09, 73, 48, 22],
        [87, 62, 100, 1, 72, 28, 23],
        [168, 128, 172, 1.49, 97, 56, 24],
        [65, 45, 51, 0.74, 39, 17, 25],
        [39, 24, 38, 0.61, 47, 17, 26],
        [39, 24, 39, 0.59, 50, 19, 27],
        [93, 68, 96, 1.05, 79, 29, 28],
        [188, 143, 197, 1.66, 99, 51, 29],
        [174, 131, 174, 1.55, 108, 50, 30],
        [187, 143, 201, 1.39, 89, 53, 31]
      ];
      const lineStyle = {
        width: 1,
        opacity: 0.5
      };
      option = {
        backgroundColor: '#161627',
        title: {
          text: '产业链近年上传文件情况',
          left: 'left',
          textStyle: {
            color: '#eee'
          }
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          bottom: 25,
          data: ['2020', '2021', '2022'],
          itemGap: 20,
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          selectedMode: 'single'
        },
        radar: {
          indicator: [
            { name: '小鸭家电', max: 300 },
            { name: '比亚迪', max: 250 },
            { name: '南孚电池', max: 300 },
            { name: '富士康劳务', max: 5 },
            { name: '京东', max: 200 },
            { name: '台积电', max: 100 }
          ],
          shape: 'circle',
          splitNumber: 5,
          axisName: {
            color: 'rgb(238, 197, 102)'
          },
          splitLine: {
            lineStyle: {
              color: [
                'rgba(238, 197, 102, 0.1)',
                'rgba(238, 197, 102, 0.2)',
                'rgba(238, 197, 102, 0.4)',
                'rgba(238, 197, 102, 0.6)',
                'rgba(238, 197, 102, 0.8)',
                'rgba(238, 197, 102, 1)'
              ].reverse()
            }
          },
          splitArea: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(238, 197, 102, 0.5)'
            }
          }
        },
        series: [
          {
            name: '2020',
            type: 'radar',
            lineStyle: lineStyle,
            data: data20,
            symbol: 'none',
            itemStyle: {
              color: '#F9713C'
            },
            areaStyle: {
              opacity: 0.1
            }
          },
          {
            name: '2021',
            type: 'radar',
            lineStyle: lineStyle,
            data: data22,
            symbol: 'none',
            itemStyle: {
              color: '#B3E4A1'
            },
            areaStyle: {
              opacity: 0.05
            }
          },
          {
            name: '2022',
            type: 'radar',
            lineStyle: lineStyle,
            data: data21,
            symbol: 'none',
            itemStyle: {
              color: 'rgb(238, 197, 102)'
            },
            areaStyle: {
              opacity: 0.05
            }
          }
        ]
      };
      option && myChart.setOption(option);
    },
    createEchartsAccess1(){
      var chartDom = document.getElementById('echarts-access');
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: '产业链当前上传文件省份分布',
          left:20,
          top:4
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          // top: '5%',
          // left: 'center'
          orient: 'horizontal',
          bottom: '0'
        },
        series: [
          {
            name: '文件数',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 8, name: '江苏' },
              { value: 8, name: '安徽' },
              { value: 5, name: '浙江' },
              { value: 8, name: '河南' },
              { value: 8, name: '山东' },
              { value: 5, name: '河北' },
            ]
          }
        ]
      };
      option && myChart.setOption(option);
    },
    createEchartscategory1(){
      var chartDom = document.getElementById('echarts-category');
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: '当前累计上传文件数企业排序',
          left:20,
          top:4
        },
        dataset: [
          {
            dimensions: ['name','fileNum'],//['name', 'age', 'profession', 'score', 'date'],
            source: [
              ['小鸭家电',36],
              ['南孚电池',326],
              ['比亚迪',136],
              ['京东',66],
              ['富士康劳务',46],
              ['台积电',6],
              // ['Hannah Krause', 41, 'Engineer', 314, '2011-02-12'],
              // ['Zhao Qian', 20, 'Teacher', 351, '2011-03-01'],
              // ['Jasmin Krause ', 52, 'Musician', 287, '2011-02-14'],
              // ['Li Lei', 37, 'Teacher', 219, '2011-02-18'],
              // ['Karle Neumann', 25, 'Engineer', 253, '2011-04-02'],
              // ['Adrian Groß', 19, 'Teacher', '-', '2011-01-16'],
              // ['Mia Neumann', 71, 'Engineer', 165, '2011-03-19'],
              // ['Böhm Fuchs', 36, 'Musician', 318, '2011-02-24'],
              // ['Han Meimei', 67, 'Engineer', 366, '2011-03-12']
            ]
          },
          {
            transform: {
              type: 'sort',
              config: { dimension: 'fileNum', order: 'desc' }
            }
          }
        ],
        xAxis: {
          type: 'category',
          axisLabel: { interval: 0, rotate: 30 }
        },
        yAxis: {},
        series: {
          type: 'bar',
          encode: { x: 'name', y: 'fileNum' },
          datasetIndex: 1
        }
      };

    
      option && myChart.setOption(option);
    },
    createEchartsline1(){
      var chartDom = document.getElementById('echarts-line');
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: '当前累计发布文件数企业排序',
          left:20,
          top:4
        },
        dataset: [
          {
            dimensions: ['name','fileNum'],//['name', 'age', 'profession', 'score', 'date'],
            source: [
              ['小鸭家电',326],
              ['南孚电池',36],
              ['比亚迪',16],
              ['京东',6],
              ['富士康劳务',56],
              ['台积电',55],
              // ['Hannah Krause', 41, 'Engineer', 314, '2011-02-12'],
              // ['Zhao Qian', 20, 'Teacher', 351, '2011-03-01'],
              // ['Jasmin Krause ', 52, 'Musician', 287, '2011-02-14'],
              // ['Li Lei', 37, 'Teacher', 219, '2011-02-18'],
              // ['Karle Neumann', 25, 'Engineer', 253, '2011-04-02'],
              // ['Adrian Groß', 19, 'Teacher', '-', '2011-01-16'],
              // ['Mia Neumann', 71, 'Engineer', 165, '2011-03-19'],
              // ['Böhm Fuchs', 36, 'Musician', 318, '2011-02-24'],
              // ['Han Meimei', 67, 'Engineer', 366, '2011-03-12']
            ]
          },
          {
            transform: {
              type: 'sort',
              config: { dimension: 'fileNum', order: 'desc' }
            }
          }
        ],
        xAxis: {
          type: 'category',
          axisLabel: { interval: 0, rotate: 30 }
        },
        yAxis: {},
        series: {
          type: 'bar',
          encode: { x: 'name', y: 'fileNum' },
          datasetIndex: 1
        }
      };
      option && myChart.setOption(option);
    },
    createEchartsPressure(){
      //默认是汽车产业链
      this.request.get("/groundtemperature-merge/MaxAndMinTempture",{params:{city_name:"汽车产业链"}}
      ).then(res =>{
        var max_float = parseFloat(res[0])
        var min_float = parseFloat(res[1])

        // console.log(max_float)
        var chartDom = document.getElementById('echarts-pressure');
        var myChart = echarts.init(chartDom);
        var option;

        const gaugeData = [
          {
            value: max_float,
            name: '年平均最高共享数据量',
            title: {
              offsetCenter: ['40%', '80%']
            },
            detail: {
              offsetCenter: ['40%', '95%']
            }
          },
          {
            value: min_float,
            name: '年平均最低共享数据量',
            title: {
              offsetCenter: ['40%', '80%']
            },
            detail: {
              offsetCenter: ['40%', '95%']
            },
          },
        ];
        option = {
          tooltip: {
            show:true,
            formatter:function (params){
              console.log(params)
              return '<div>'+ '<span style="font-size: 6px">'+params.marker + params.name +'地温:'+ + params.value.toFixed(2)+ 'byte'+'</span>'+ '</div>';
            }
          },
          title: {
            text:'汽车产业链2020年最大共享文件和最小共享文件',
            fontSize: 14,
            left:'center'
          },
          series: [
            {
              type: 'gauge',
              anchor: {
                show: true,
                showAbove: true,
                size: 18,
                itemStyle: {
                  color: '#FAC858'
                }
              },
              axisLabel: {
                formatter: function (value, index) {
                  return value + "byte";
                },
              },
              pointer: {
                icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                width: 8,
                length: '80%',
                offsetCenter: [0, '8%']
              },
              progress: {
                show: true,
                overlap: true,
                roundCap: true
              },
              axisLine: {
                roundCap: true
              },
              data: gaugeData,
              title: {
                fontSize: 10
              },
              min:0,
              max:50,
              detail: {
                width: 40,
                height: 14,
                fontSize: 14,
                color: '#fff',
                backgroundColor: 'inherit',
                borderRadius: 3,
                formatter: function (results){
                  var num = results/(max_float+min_float)
                  num = num.toFixed(2)*100
                  return num + '%'
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
      })


    },
    createEchartsscater(){
      this.request.get("/groundtemperature-merge/GetNearYearData",{params:{name:this.map_name}}
      ).then(res =>{
        for(var i=0;i<12;i++){
          this.scater_data.push([i+1,res[i]])
        }
        var chartDom = document.getElementById('echarts-scatter');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          tooltip: {
            show:true,
            formatter:function (params){
              return '<div>'+ params.marker + params.value[0] +'月共享:'+ + params.value[1].toFixed(2) + 'byte'+'</div>';
            }
          },
          title: {
            text: '产业链共享数据企业时间分布图',
            left:'center'
          },
          xAxis: {
            type: "value",
            axisLabel: {
              formatter: function (value, index) {
                return value + "月";
              },
            },
          },
          yAxis: {
            type: "value",
            axisLabel: {
              formatter: function (value, index) {
                return value + "byte";
              },
            },
          },
          series: [
            {
              symbolSize: 20,
              //data:this.scater_data,
              data: [
              { value: 8, name: '2019年' },
              { value: 8, name: '2020年' },
              { value: 5, name: '2021年' },
              { value: 8, name: '2022年' },
              { value: 8, name: '2023年' },
              { value: 5, name: '2024年' },
            ],
              type: 'scatter'
            }
          ]
        };
        option && myChart.setOption(option);
      })






    },
    createEchartsAccess(){
      var chartDom = document.getElementById('echarts-access');
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: '产业链当前上传文件省份分布',
          left:20,
          top:4
        },
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
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 8, name: '江苏地区' },
              { value: 8, name: '安徽地区' },
              { value: 5, name: '浙江地区' },
              { value: 8, name: '河南地区' },
              { value: 8, name: '山东地区' },
              { value: 5, name: '河北地区' },
            ]
          }
        ]
      };
      option && myChart.setOption(option);
    },
    createEchartscategory(){
      this.request.get("/groundtemperature-merge/SortCityData",{
      }).then(res =>{
        var json=null
        var str=null
        var number = 0
        var name =null
        var v_name=[]
        var v_data=[]
        for(var i=res.length-1;i>10;i--){
          json = JSON.stringify(res[i])
          str = json.split(":")
          number = parseFloat(str[1].substring(0,str[1].length-1))
          name = str[0].substring(1,str[0].length)
          name = name.substring(1,name.length-1)
          v_data.push(number)
          v_name.push(name)
        }


        var chartDom = document.getElementById('echarts-category');
        var myChart = echarts.init(chartDom);
        var option;

        option = {
          tooltip: {
            trigger: 'item',
            formatter:function (params){
              console.log(params)
              return '<div>'+ params.marker + params.name +'地温:'+ + params.value.toFixed(2) + 'byte'+'</div>';
            }
          },

          title: {
            text: '产业链企业2020年共享数据排行图',
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: [v_name[0], v_name[1], v_name[2], v_name[3], v_name[4], v_name[5], v_name[6], v_name[7], v_name[8], v_name[9]],
            axisLabel: {interval: 0, rotate: 30}
          },
          yAxis: {
            type: 'value',
            max: 20.5,
            min: 19,
            interval: 0.5,
            axisLabel: {
              formatter: function (value, index) {
                return value + "byte";
              },
            },
          },
          series: {
            type: 'bar',
            data: [v_data[0], v_data[1], v_data[2], v_data[3], v_data[4], v_data[5], v_data[6], v_data[7], v_data[8], v_data[9]],
            encode: {x: 'name', y: 'average_surface_temperature'},
            datasetIndex: 1,
            itemStyle: {
              normal: {
                //这里是重点
                color: function (params) {
                  //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                  var colorList = ['#1781b5', '#158bb8','#2f90b9','#10aec2','#0eb0c9','#5cb3cc', '#66a9c9', '#5cb3cc','#63bbd0' , '#c3d7df', '#d8e3e7'];
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        }

        option && myChart.setOption(option);
      })

    },
    createEchartsline(){

      this.request("/groundtemperature-merge/GetHistoryData",{params:{name:"砀山"}}).then(res=>{
        var chartDom = document.getElementById('echarts-line');
        var myChart = echarts.init(chartDom);
        var option;

        function randomData(flag) {
          now = new Date(+now + oneDay);
          value = res[flag].averageSurfaceTemperature
          return {
            name: now.toString(),
            value: [
              [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
              Math.round(value)
            ]
          };
        }

        let temp = []
        let data = [];
        let now = new Date(1969, 1, 1);
        let oneDay = 24 * 3600 * 1000;
        let value = 0;
        var flag = 0
        for (var i = 0; i < 1000; i++) {
          flag+=1
          data.push(randomData(flag));

        }

        option = {
          title: {
            text: '砀山平均地表气温1969~2019年时间变化图',
            left:'center'
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              params = params[0];
              var date = new Date(params.name);
              return (
                  date.getFullYear()+'年'+(date.getMonth() + 1)+'月'+date.getDate()+'日平均地表气温'+':'+
                  params.value[1]
                  +'byte'
              );
            },
            axisPointer: {
              animation: false
            }
          },
          xAxis: {
            type: 'time',
            splitLine: {
              show: false
            },
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
              show: false
            },
            axisLabel:{
              fontSize:10
            }
          },
          series: [
            {
              name: 'Fake Data',
              type: 'line',
              showSymbol: false,
              data: data,

            }
          ]
        };

        setInterval(function () {
          for (var i = 0; i < 5; i++) {
            flag+=1
            //移除数组中第一项
            data.shift();
            data.push(randomData(flag))
          }
          myChart.setOption({
            series: [
              {
                data: data
              }
            ]
          });
        }, 1000);

        option && myChart.setOption(option);
      })

    },
  }
}



</script>

<style scoped>
.first,.second{
  padding-top: 20px;
}
#viewDiv {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
#echarts-line{
  height: 40vh;
  width: 100%;
}
#echarts-category{
  height: 40vh;
  width: 100%;
}
#echarts-access{
  height: 35vh;
  width: 100%;
}
#echarts-scatter{
  height: 35vh;
  width: 100%;
}
#echarts-pressure{
  height: 35vh;
  width: 100%;
}
</style>