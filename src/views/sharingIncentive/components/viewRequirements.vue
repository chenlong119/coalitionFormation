<template>
    <el-container>
        <el-header class="data-share-header">
        产业链数据共享需求查看
        </el-header>
        <!-- <el-header>Header</el-header> -->
        <el-main class="data-share-form">
            <div class="form-container">
                <el-table :data="dataDemands" border stripe :header-cell-class-name="headerBg" max-height="340" :fit="true" >
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
                            @click="scope.row.status !== '已结束' && showPopupReply(scope.row.requestId)"
                        >响应</el-link>
                    </template>
                    <!-- <el-link type="primary" @click="showPopupReply" >响应</el-link> -->
                    </el-table-column>
                </el-table>
            </div>
        </el-main>
    </el-container>
      <el-dialog title="共享需求响应" width="50%" v-model="isPopupVisibleReply"  @close="hidePopup">
        <el-form ref="dataShareForm" :model="form" label-width="120px">
                    <!-- 数据共享需求名称 -->
                    <el-form-item label="共享需求详情" required>
                        <el-input type="textarea" v-model="form.shareName" placeholder="请输入数据共享需求详细描述"></el-input>
                    </el-form-item>
                    <!-- 上传文件 -->
                    <el-form-item label="上传文件" required>
                        <el-upload
                            class="upload-demo"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            multiple
                            :limit="3"
                            :on-exceed="handleExceed"
                            :file-list="fileList">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
                        </el-upload>
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
  </template>
<script setup>
import request from "@/utils/request";
import { ref } from 'vue';
import { ElMessage } from 'element-plus'

const dataDemands =ref([]);
const getAllTaskData = async () => {
  const res = await request.get("/request/all");
  // 将字符串字段解析为数组
  dataDemands.value=res;
// console.log(allData.value)
// console.log(tableData.value)
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


const hidePopup = () => {
    isPopupVisible.value = false;
  };

const hidePopupRelease = () => {
    isPopupVisibleRelease.value = false;
  };
let currentRequestID = ref(1);
const showPopupReply = (requestId) => {
    isPopupVisibleReply.value = true;
    currentRequestID.value = requestId;
    console.log("currentRequestID.value"+currentRequestID.value)
  };
const setFinished = async () =>{
  const res = await request.get("request/finishRequest/"+currentRequestID.value);
  console.log("currentRequestID.value"+currentRequestID.value)
  ElMessage.success('修改成功！');
  getAllTaskData();

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

.data-share-form .el-form-item {
    margin-bottom: 20px; /* 增加表单项间距 */
    display: flex;
    justify-content: center;
}

.data-share-form .el-input,
.data-share-form .el-select {
    border: 1px solid #bdc3c7; /* 输入框和选择框的边框颜色 */
    border-radius: 4px; /* 边框圆角 */
    width: 300px; /* 设置文本框和选择框的固定宽度 */
}

.data-share-form .el-button {
    background-color: #3498db; /* 调整按钮颜色为亮蓝色 */
    border: none;
    color: white;
    padding: 10px 20px; /* 增加按钮的填充，使其更显著 */
    border-radius: 5px; /* 添加圆角 */
}

.data-share-form .el-button:hover {
    background-color: #2980b9;
}

.data-share-form .el-button:disabled {
    background-color: #bdc3c7; /* 禁用按钮的颜色 */
    color: #ecf0f1; /* 禁用文字颜色 */
}

.data-share-form {
    background-color: #ecf0f1;
    color: #2c3e50;
    font-size: 16px;
    border-top: 3px solid #2980b9;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 85vh;
}

.form-container {
    width: 100%;
    max-width: 1800px;
    height: 85vh;
}
.data-share-form .el-form-item__label {
    white-space: nowrap; /* 防止文本换行 */
    text-align: right; /* 文本右对齐，你也可以选择其他对齐方式 */
    min-width: 160px; /* 设置最小宽度保证对齐 */
    margin-right: 20px; /* 添加右侧间距以分隔标签和输入框 */
    font-weight: bold; /* 加粗标签字体 */
}
</style>
