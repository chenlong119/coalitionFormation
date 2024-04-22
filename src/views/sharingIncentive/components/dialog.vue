<template>
    <div>
        <div></div>
        <el-table :data="tableData" border stripe :header-cell-class-name="headerBg" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="65"> <!--多选框-->
            </el-table-column>
            <el-table-column prop="taskName" label="任务名称" width="160">
            </el-table-column>
            <el-table-column prop="taskReleaser" label="任务发布者" width="90">
            </el-table-column>
            <el-table-column prop="detail" label="任务详情" width="250">
            </el-table-column>
            <el-table-column prop="profit" label="预期增益" width="100">
            </el-table-column>
            <el-table-column prop="difficulty" label="难度" width="80">
            </el-table-column>
            <el-table-column prop="probability" label="按期完成概率(%)" width="180">
            </el-table-column>
            <el-table-column prop="recomendation" label="推荐指数（%）" width="180">
            </el-table-column>
            <el-table-column :prop="dynamicprop1" :label="dynamiclabel1" width="100" v-if="show1">
            </el-table-column>
            <el-table-column :prop="dynamicprop2" :label="dynamiclabel2" width="110" v-if="show2">
            </el-table-column>
            <el-table-column :prop="dynamicprop3" :label="dynamiclabel3" width="110" v-if="show3">
            </el-table-column>
            <el-table-column :prop="dynamicprop4" :label="dynamiclabel4" width="110" v-if="show4">
            </el-table-column>
            <el-table-column :prop="dynamicprop5" :label="dynamiclabel5" width="110" v-if="show5">
            </el-table-column>
            <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
            <template #default="scope">
                <el-tooltip content="接受" placement="top" v-if="scope.row.userId !== 1">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:user:edit']"></el-button>
                </el-tooltip>
                <el-tooltip content="推荐有误" placement="top" v-if="scope.row.userId !== 1">
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']"></el-button>
                </el-tooltip>
            </template>
            </el-table-column>
        </el-table>
        <!-- <el-button type="text" @click="open">点击打开 Message Box</el-button> -->
          <!-- <div>
            <button @click="showDialog">Open Dialog</button>
            <MyDialog v-if="show" @close="closeDialog" />
          </div> -->
    </div>
</template>

<script>
  export default {
    
    data(){
      
        // const open = ref(false)
        // const title = ref("")
        return{
        form: {},
        dynamiclabel1:"任务状态",
        dynamiclabel2:"任务接受者",
        dynamiclabel3:"所属产业链",
        dynamiclabel4:"评价",
        dynamiclabel5:" ",


        show1:false,
        show2:false,
        show3:false,
        show4:false,
        show5:false,
        tablename:"",
        tableData:[],
        total:0,
        multipleSelection:[],
        pageNum:1,
        pageSize:10,
        Station_Number:"",
        id:"",
        dialogFormVisible:false,
        form:{},
        headerBg:'headerBg',

        }
    },
    mounted() {
          this.load()
      },
    methods: {
      open() {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      load() {  
        this.tablename='上传记录表'
        const dataInit=[
          { 
            taskName:'四月电池销量',
            taskReleaser:'小鸭家电',
            detail:"一份23年四月份一份某电池供应商的销量数据",
            profit:10,
            difficulty:'简单',
            probability:"95%",
            recomendation:'100%'
            },
          { 
            taskName:'五月A型芯片计划产量',
            taskReleaser:'比亚迪',
            detail:"一份23年五月份一份某公司A型芯片计划产量",
            profit:20,
            difficulty:"一般",
            probability:"80%",
            recomendation:"80%"
            },
          { 
            taskName:'21年人力平均工资',
            taskReleaser:'富士康劳务',
            detail:"一份21年的整年的公司整体综合劳务开支",
            profit:60,
            difficulty:"一般",
            probability:"70%",
            recomendation:"76.3%"
            },
          { 
            taskName:'618家电类销售综合数据',
            taskReleaser:'小鸭家电',
            detail:"一份23年618京东的家电类综合销售数据（可以提供某种类或者多种类，按照数据质量给出收益）",
            profit:"10~100",
            difficulty:"困难",
            probability:"50%",
            recomendation:"64.2%"
            },
        ]
        this.tableData=dataInit
      },
    }
  }
</script>