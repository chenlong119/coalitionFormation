<template>
  <body>
    <div>当前积分：30分
     </div> 
    <!-- <div>
      <el-main>
          <el-table :data="tableData" border stripe :header-cell-class-name="headerBg" @selection-change="handleSelectionChange">
          <el-table-column prop="itemName" label="项目名称" width="280">
          </el-table-column>
          <el-table-column prop="cost" label="积分消耗(分)" width="220">
          </el-table-column>
          <el-table-column prop="numberleft" label="剩余份数" width="220">
          </el-table-column>
          <el-table-column prop="detail" label="详情" width="220">
          </el-table-column>
          <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
              <template #default="scope">
                  <el-tooltip content="购买" placement="top" v-if="scope.row.userId !== 1">
                  <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:user:edit']"></el-button>
                  </el-tooltip>
                  <el-tooltip content="不再推荐" placement="top" v-if="scope.row.userId !== 1">
                  <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']"></el-button>
                  </el-tooltip>
              </template>
          </el-table-column>
        </el-table>
      </el-main>
    </div> -->
    <el-button type="text" @click="dialogTableVisible = true">打开嵌套表格的 Dialog</el-button>

    <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="date" label="日期" width="150"></el-table-column>
        <el-table-column property="name" label="姓名" width="200"></el-table-column>
        <el-table-column property="address" label="地址"></el-table-column>
      </el-table>
    </el-dialog>
  </body>
</template>


<script>
import * as echarts from 'echarts/core';
export default {
    data() {
      return {
        gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      };
    }
  };
// export default {
//   data() {
//     return {
//       zFieldName: "elevation", // 设置默认的属性字段名称
//     }
//   },
//   beforeMount() {

//   },
//   created() {
    
//     this.load()

//   },
//   mounted() {
//   },
//   methods: {

//     load(){
//       const dataInit=[
//           { 
//             itemName:'五月普通广告一天',
//             cost:5,
//             numberleft:10,
//             detail:10
//             },
//           { 
//             itemName:'五月头条广告一天',
//             cost:20,
//             numberleft:10,
//             detail:10
//             },
//           { 
//             itemName:'任务置顶卡一天',
//             cost:6,
//             numberleft:10,
//             detail:10
//             },
//           { 
//             itemName:'任务置顶卡七天',
//             cost:40,
//             numberleft:10,
//             detail:10
//             }
//             ]
//         this.tableData=dataInit
//     }
//   }
// }
</script>

<style>
html,body,#viewDiv{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>