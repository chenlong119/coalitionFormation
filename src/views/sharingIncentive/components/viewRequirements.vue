<template>
  <div>
    <el-container>
        <el-header class="data-share-header">
        产业链数据共享需求查看
        </el-header>
        <!-- <el-header>Header</el-header> -->
        <el-main class="data-share-form">
                <el-table :data="dataDemands" border stripe>
                    <el-table-column
                    prop="requestName"
                    label="数据需求名称"
                    width="180"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="description"
                    label="数据需求描述"
                    width="280"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="targetCompanies"
                    label="目标企业"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="industryChain"
                    label="所属产业链"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="dataType"
                    label="数据类型"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="status"
                    label="状态"
                    sortable
                    width="180"
                    column-key="date"
                    :filters="[{text: '待响应', value: '待响应'}, {text: '已结束', value: '已结束'}]"
                    :filter-method="filterHandler"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="deadline"
                    label="截止时间">
                    </el-table-column>
                    <el-table-column
                    label="操作">
                    <template v-slot="scope">
                        <el-link
                            type="primary"
                            :disabled="scope.row.status === '已结束'"
                            @click="scope.row.status !== '已结束' && showPopupReply(scope.row)"
                        >响应</el-link>
                    </template>
                    <!-- <el-link type="primary" @click="showPopupReply" >响应</el-link> -->
                    </el-table-column>
                </el-table>
        </el-main>
    </el-container>
      <el-dialog title="共享需求响应" width="50%" v-model="isPopupVisibleReply"  @close="hidePopup">
        <el-form ref="dataShareForm" :model="form" label-width="120px">
                    <!-- 数据共享需求名称 -->
                    <el-form-item label="共享需求详情" required>
                        <el-input type="textarea" v-model="form.shareName" placeholder="请输入数据共享需求详细描述"></el-input>
                    </el-form-item>
                    <!-- 上传文件 -->
                    <el-form-item :label="currentDatatype" required>
<!--                        <el-upload-->
<!--                            class="upload-demo"-->
<!--                            action="https://jsonplaceholder.typicode.com/posts/"-->
<!--                            :on-preview="handlePreview"-->
<!--                            :on-remove="handleRemove"-->
<!--                            :before-remove="beforeRemove"-->
<!--                            multiple-->
<!--                            :limit="3"-->
<!--                            :on-exceed="handleExceed"-->
<!--                            :file-list="fileList">-->
<!--                            <el-button size="small" type="primary">点击上传</el-button>-->
<!--                            <div slot="tip" class="el-upload__tip">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>-->
<!--                        </el-upload>-->
                      <el-input v-model="currentData" placeholder="请输入数据数值"></el-input>
                    </el-form-item>
                    <!-- 描述 -->
                    <el-form-item label="备注" >
                        <el-input type="textarea" v-model="form.description" placeholder="请输入需要备注的内容"></el-input>
                    </el-form-item>
                    <!-- 表单操作按钮 -->
                    <div slot="footer" class="center-container">
                            <el-button @click="hidePopupRelease">取 消</el-button>
                            <el-button type="primary" @click="setFinished()">提交</el-button>
                            </div>
                </el-form>
      </el-dialog>
  </div>
  </template>


<script setup>
import request from "@/utils/request";
import { ref } from 'vue';
import { ElMessage } from 'element-plus'

const dataTypes=["市场份额","市场增长率","盈利率","科研投入比例","产品线宽度","产品线深度","平均收益回报率","库存周转率"];
const engTypes=[
  "marketShare",
  "marketIncrease",
  "profitability",
  "productWidth",
  "productDepth",
  "averageRio",
  "turnOver"
];
const submitInstance=reactive({
companyId:"24",
})
const currentData=ref();
const dataDemands =ref([]);
const getAllTaskData = async () => {
  const res = await request.get("/request/all");
  // 将字符串字段解析为数组
  dataDemands.value=res;
};

function load(){
    const dataInnit =[
    {
        requestName: "年度营业额",
        description: "精确到小数点后两位的年度营业额",
        industryChain: "汽车产业链",
        dataType: "生产数据",
        targetCompanies: "小鸭集团",
        status: "待响应",
        deadline: "2024-06-25",
    },
    {
        requestName: "准数交付率",
        description: "订单的准时交付率",
        industryChain: "空调产业链",
        dataType: "销售数据",
        targetCompanies: "美的集团",
        status: "待响应",
        deadline: "2024-06-30",
        detail: null
    }
];
      dataDemands.value=dataInnit
}
const isPopupVisible = ref(false);
const isPopupVisibleRelease =ref(false);
const isPopupVisibleReply =ref(false);
let currentDatatype=ref('');

const hidePopup = () => {
    isPopupVisible.value = false;
  };

const hidePopupRelease = () => {
    isPopupVisibleRelease.value = false;
  };
let currentRequestID = ref(1);
const showPopupReply = (row) => {
    isPopupVisibleReply.value = true;
    currentRequestID.value = row.requestId;
    currentDatatype.value = row.dataType;
  };
const setFinished = async () =>{
  const res = await request.get("request/finishRequest/"+currentRequestID.value);
  console.log("currentRequestID.value"+currentRequestID.value)
  ElMessage.success('修改成功！');
  getAllTaskData();
  let idx=dataTypes.indexOf(currentDatatype.value);
  submitInstance[engTypes[idx]]=currentData.value;
  await request.post("/request/updateCompanyIncome", submitInstance)
}
onMounted(async() => {
    getAllTaskData();
// load();
});

const form = ref({
    shareName: '',
    description: ''
});
function filterHandler(value, row) {
    return row.status === value;
}
</script>
<style>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh; /* 如果需要垂直居中，设置父容器高度为视口高度 */
}

.data-share-header {
    background-color: #2980b9; /* 深蓝色背景 */
    color: #ffffff; /* 白色文字 */
    font-size: 24px; /* 增大字体大小 */
    text-align: center;
    line-height: 70px; /* 增加行高 */
    border-bottom: 3px solid #3498db; /* 增加底部边框颜色区分 */
}


.data-share-form {
    background-color: #ecf0f1;
    color: #2c3e50;
    font-size: 16px;
    border-top: 3px solid #2980b9;
    align-items: center;
    height: 85vh;
}

.form-container {
    width: 100%;
    height: 85vh;
}
</style>
