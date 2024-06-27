<template>
    <el-container>
        <el-header class="data-share-header">
            产业链数据共享
        </el-header>
        <el-main class="data-share-form">
            <div class="form-container">
                <div slot="footer" class="center-container">
                    <el-button @click="showPopupRelease" style ="font-size: 20;">数据共享需求发布</el-button>
                <!-- <el-button @click="showPopupReply">数据共享需求响应</el-button> -->
                <el-button @click="showPopup">数据共享需求查看</el-button>
        </div>

            </div>
        </el-main>
    </el-container>
    <el-dialog title="查看共享需求" width="50%" v-model="isPopupVisible"  @close="hidePopup">
        <el-table :data="dataDemands" border stripe :header-cell-class-name="headerBg" max-height="240" :fit="true" >
                    <el-table-column
                    prop="taskName"
                    label="数据需求名称"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="companyName"
                    label="数据需求企业"
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
                    label="截止时间"
                    :formatter="formatter">
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    :formatter="formatter">
                    <el-link type="primary" @click="showPopupReply" >响应</el-link>

                    </el-table-column>
                </el-table>
        <div slot="footer" class="center-container">
          <el-button @click="hidePopup">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="发布共享需求" width="50%" v-model="isPopupVisibleRelease"  @close="hidePopup">
        <el-form ref="dataShareForm" :model="form" label-width="120px">
                    <el-form-item label="选择产业链">
                        <el-select v-model="form.industryChain" placeholder="请选择产业链">
                        <el-option label="汽车产业链" value="chain1"></el-option>
                        <el-option label="空调产业链" value="chain2"></el-option>
                        <el-option label="冰箱产业链" value="chain2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择企业">
                        <el-select v-model="form.company" placeholder="请选择企业">
                        <el-option label="小鸭家电" value="company1"></el-option>
                        <el-option label="比亚迪集团" value="company2"></el-option>
                        <el-option label="超威集团" value="company3"></el-option>
                        <el-option label="美的集团" value="company4"></el-option>
                        <el-option label="华润集团" value="company5"></el-option>
                        <el-option label="科兴集团" value="company6"></el-option>
                        <el-option label="西门子集团" value="company7"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择数据类型">
                        <el-select v-model="form.dataType" placeholder="请选择数据类型">
                        <el-option label="生产数据" value="type1"></el-option>
                        <el-option label="销售数据" value="type2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="共享需求名称">
                        <el-input v-model="form.shareName"></el-input>
                    </el-form-item>
                    <el-form-item label="截止日期">
                        <el-date-picker type="date" placeholder="选择截止日期" v-model="form.deadline" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="共享需求详情">
                        <el-input type="textarea" v-model="form.details"></el-input>
                    </el-form-item>

                        <div slot="footer" class="center-container">
                            <el-button @click="hidePopupRelease">取 消</el-button>
                            <el-button type="primary" @click="save">提交</el-button>
                            </div>

                </el-form>
      </el-dialog>
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
                            <el-button type="primary" @click="save">提交</el-button>
                            </div>
                </el-form>
      </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import {
    ElForm, ElFormItem, ElInput, ElButton, ElUpload
} from 'element-plus';
const isPopupVisible = ref(false);
const isPopupVisibleRelease =ref(false);
const isPopupVisibleReply =ref(false);


const showPopup = () => {
    isPopupVisible.value = true;

  };
const hidePopup = () => {
    isPopupVisible.value = false;
  };
const showPopupRelease = () => {
    isPopupVisibleRelease.value = true;

  };
const hidePopupRelease = () => {
    isPopupVisibleRelease.value = false;
  };
  const showPopupReply = () => {
    isPopupVisibleReply.value = true;

  };
const hidePopupReply = () => {
    isPopupVisibleReply.value = false;
  };

  const dataDemands =ref([]);
function load(){
    const dataInnit =[
        {
          taskName: '年度营业额',
          companyName: '济南产发园',
          status: '待响应',
          deadline: '2024-12-24 23:12:00',
        },

        {
            taskName: '准时交付率',
          companyName: '济南产发园',
          status: '已结束',
          deadline: '2024-12-24 24:27:02',
        },
        {
        taskName: '订单平均响应速度',
          companyName: '济南产发园',
          status: '待响应',
          deadline: '2024-12-24 23:12:00',
        },
        {
            taskName: '平均配送周期',
          companyName: '济南产发园',
          status: '待响应',
          deadline: '2024-12-24 23:12:00',
        },
      ];
      dataDemands.value=dataInnit
}

onMounted(async() => {
load();
});
const form = ref({
    shareName: '',
    description: ''
});

const dataShareForm = ref(null);
const fileList = ref([]);

const handlePreview = file => {
    console.log('preview', file);
};

const handleRemove = (file, fileList) => {
    console.log('remove', file, fileList);
};

const beforeRemove = (file, fileList) => {
    return confirm(`确定移除 ${file.name}？`);
};

const handleExceed = (files, fileList) => {
    console.error('已超出文件上传数量限制');
};

const onSubmit = () => {
    console.log('Form data:', form.value);
    alert('需求已提交!');
};
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
    height: 80vh;
}
.data-share-form .el-form-item__label {
    white-space: nowrap; /* 防止文本换行 */
    text-align: right; /* 文本右对齐，你也可以选择其他对齐方式 */
    min-width: 160px; /* 设置最小宽度保证对齐 */
    margin-right: 20px; /* 添加右侧间距以分隔标签和输入框 */
    font-weight: bold; /* 加粗标签字体 */
}
</style>

<!-- 在Idea中运行sql语句新增一个表，用来记录新增的数据共享需求，其中有以下几个属性，包括 需求编号（主键），需求名称，需求详情所属产业链，需求所需企业，需求所需的数据类型，需求的截止日期 -->