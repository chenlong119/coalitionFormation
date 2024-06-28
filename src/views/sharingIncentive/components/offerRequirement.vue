
<template>
    <el-container>
        <el-header class="data-share-header">
        产业链数据共享需求发布
        </el-header>
        <!-- <el-header>Header</el-header> -->
        <el-main class="data-share-form">
            <div class="form-container">
                <el-form ref="dataShareForm" :model="form" label-width="120px">
                    <el-form-item label="选择产业链">
                        <el-select v-model="form.industryChain" placeholder="请选择产业链">
                        <el-option label="汽车产业链" value="汽车产业链"></el-option>
                        <el-option label="空调产业链" value="空调产业链"></el-option>
                        <el-option label="冰箱产业链" value="冰箱产业链"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择企业">
                        <el-select v-model="form.targetCompanies" placeholder="请选择企业">
                        <el-option label="小鸭家电" value="小鸭家电"></el-option>
                        <el-option label="比亚迪集团" value="比亚迪集团"></el-option>
                        <el-option label="超威集团" value="超威集团"></el-option>
                        <el-option label="美的集团" value="美的集团"></el-option>
                        <el-option label="华润集团" value="华润集团"></el-option>
                        <el-option label="科兴集团" value="科兴集团"></el-option>
                        <el-option label="西门子集团" value="西门子集团"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择数据类型">
                        <el-select v-model="form.dataType" placeholder="请选择数据类型">
                        <el-option label="生产数据" value="生产数据"></el-option>
                        <el-option label="销售数据" value="销售数据"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据共享需求名称">
                        <el-input v-model="form.requestName"></el-input>
                    </el-form-item>
                    <el-form-item label="截止日期">
                        <el-date-picker type="date" placeholder="选择截止日期" v-model="form.deadline" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="数据共享需求详情">
                        <el-input type="textarea" v-model="form.description"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-main>
    </el-container>
  </template>
  
  <script setup>
  import request from "@/utils/request";
  import { ref,reactive } from 'vue';
  import { ElForm, ElFormItem, ElSelect, ElOption, ElInput, ElDatePicker, ElButton } from 'element-plus';
  import { useRoute } from 'vue-router';
    const dataShareForm = ref(null);
//   let form = ref({    
//     requestName: '电池没电了',    
//     description: '没啥好说的',
//     industryChain: '汽车产业链',
//     dataType: '生产数据',
//     targetCompanies: '小鸭家电',
//     deadline: '2024-06-26',
//     status: '待响应'
//   });
let form = ref({    
  requestName: '',    
  description: '',
  industryChain: '',
  dataType: '',
  targetCompanies: '',
  deadline: '',
  status: ''
});
let countrefresh =ref(0);
function resetForm() {
  form.value = {    
    requestName: '5月磷酸锂电池济南销售分布数据',    
    description: '精确到每个县的分管门店',
    industryChain: '汽车产业链',
    dataType: '销售数据',
    targetCompanies: '小鸭家电',
    deadline: '2024-06-26',
    status: '待响应'
  };
  countrefresh.value+=1;
  console.log(countrefresh.value)
}
  function addAuction(){
  const addAuction1 = async () => {

  const res = await request.post("/request/add",form.value 
  );
    // 检查状态码
    if (res.status >= 200 && res.status < 300) {
      // 成功的情况
      console.log("Auction added successfully");
      // 这里可以添加其他成功的逻辑
    } else {
      // 失败的情况
      console.error("Failed to add auction");
      // 这里可以添加其他失败的逻辑
    }
  // } catch (error) {
  //   // 捕获异常，例如网络错误
  //   console.error("Error while adding auction:", error.message);
  //   // 这里可以添加其他处理逻辑
  // }   
  };
  addAuction1();

}
onMounted(async() => {
    resetForm();
// load();
});
// onBeforeRouteUpdate((to, from) => {
//   if (to.path !== from.path) {
//     resetForm();  // 来自其他页面时重置
//   }
// });

  
function onSubmit(){
    console.log('Form data:', form.value);
    addAuction();
    alert('需求已提交!');
  };
  </script>


  <style>
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
        max-width: 600px;
        }
        .data-share-form .el-form-item__label {
        white-space: nowrap; /* 防止文本换行 */
        text-align: right; /* 文本右对齐，你也可以选择其他对齐方式 */
        min-width: 160px; /* 设置最小宽度保证对齐 */
        margin-right: 20px; /* 添加右侧间距以分隔标签和输入框 */
        font-weight: bold; /* 加粗标签字体 */
        }
  </style>
  
