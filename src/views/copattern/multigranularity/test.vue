<template>
  <div class="container">
    <h1 class="page-title">表单提交系统</h1>
    <hr class="divider">
    <el-form :model="form" label-width="80px" class="demo-form">

      <!-- 上半部分 -->
      <el-row :gutter="30" class="row-container">

        <!-- 第一部分 -->
        <el-col :span="12" class="chart-container">
          <div class="box-card">
            <h3>第一部分</h3>
            <el-form-item label="项目 A">
              <el-input v-model="form.itemA"></el-input>
            </el-form-item>
            <el-form-item label="项目 B">
              <el-input v-model="form.itemB"></el-input>
            </el-form-item>
            <el-form-item label="评分">
              <el-rate v-model="form.rating1"></el-rate>
            </el-form-item>
          </div>
        </el-col>

        <!-- 第二部分 -->
        <el-col :span="12">
          <div class="box-card">
            <h3>第二部分</h3>
            <el-form-item label="项目 C">
              <el-input v-model="form.itemC"></el-input>
            </el-form-item>
            <el-form-item label="项目 D">
              <el-input v-model="form.itemD"></el-input>
            </el-form-item>
            <el-form-item label="评分">
              <el-rate v-model="form.rating2"></el-rate>
            </el-form-item>
          </div>
        </el-col>

      </el-row>

      <!-- 下半部分 -->
      <el-row :gutter="30" class="row-container">
        
        <!-- 第三部分 -->
        <el-col :span="12" class="chart-container">
          <div class="box-card">
            <h3>第三部分</h3>
            <el-form-item label="项目 E">
              <el-input v-model="form.itemE"></el-input>
            </el-form-item>
            <el-form-item label="项目 F">
              <el-input v-model="form.itemF"></el-input>
            </el-form-item>
            <el-form-item label="评分">
              <el-rate v-model="form.rating3"></el-rate>
            </el-form-item>
          </div>
        </el-col>

        <!-- 第四部分 -->
        <el-col :span="12">
          <div class="box-card">
            <h3>第四部分</h3>
            <el-form-item label="项目 G">
              <el-input v-model="form.itemG"></el-input>
            </el-form-item>
            <el-form-item label="项目 H">
              <el-input v-model="form.itemH"></el-input>
            </el-form-item>
            <el-form-item label="评分">
              <el-rate v-model="form.rating4"></el-rate>
            </el-form-item>
          </div>
        </el-col>

      </el-row>

      <!-- 提交按钮 -->
      <el-form-item class="submit-button">
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        itemA: '',
        itemB: '',
        itemC: '',
        itemD: '',
        itemE: '',
        itemF: '',
        itemG: '',
        itemH: '',
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0,
      },
    };
  },
  methods: {
    onSubmit() {
      console.log('表单已提交:', this.form);
    },
  },
};
</script>

<style>
.container {
  font-family: 'Arial', sans-serif;
  margin: 40px auto;
  max-width: 1200px;
  color: #333;
}

.row-container {
  margin: 0 auto;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.box-card {
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.1);
  background-color: #ffffff;
}

h3 {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #333;
}

.el-form-item {
  margin-bottom: 20px;
}

.submit-button {
  text-align: center;
  margin-top: 20px;
}

.page-title {
  text-align: center;
  font-weight: bold;
  font-size: 2em;
  margin-bottom: 20px;
}

.divider {
  border: 1px solid #ccc;
  margin-bottom: 20px;
}
</style>
