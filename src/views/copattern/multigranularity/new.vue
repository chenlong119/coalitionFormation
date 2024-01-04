<template>
  <div class="feedback-container">
    <h2 class="title">任务反馈</h2>
    <el-form :model="feedbackForm" label-width="180px" label-position="left" class="feedback-form">

      <!-- 交易类型 -->
      <el-form-item label="交易选择">
        <el-select v-model="feedbackForm.transactionType" placeholder="请选择任务">
          <el-option v-for="option in transactionOptions" :key="option" :label="option" :value="option"></el-option>
        </el-select>
      </el-form-item>

      <!-- 交货情况 -->

  <div class="section">
    <h3 class="section-title">交货情况</h3>
    <el-form-item label="订单准确性">
      <el-rate v-model="feedbackForm.deliveryAccuracy" :max="10"></el-rate>
      <span class="score-display">{{ feedbackForm.deliveryAccuracy }}</span>
    </el-form-item>
    <el-form-item label="交货速度">
      <el-rate v-model="feedbackForm.deliverySpeed" :max="10"></el-rate>
      <span class="score-display">{{ feedbackForm.deliverySpeed }}</span>
    </el-form-item>
  </div>
      
  <!-- 产品质量 -->
  <div class="section">
    <h3 class="section-title">产品质量</h3>
    <el-form-item label="产品外观">
      <el-rate v-model="feedbackForm.productAppearance" :max="10"></el-rate>
      <span class="score-display">{{ feedbackForm.productAppearance }}</span>
    </el-form-item>
    <el-form-item label="产品包装">
      <el-rate v-model="feedbackForm.productPackaging" :max="10"></el-rate>
      <span class="score-display">{{ feedbackForm.productPackaging }}</span>
    </el-form-item>
    <el-form-item label="产品性能">
      <el-rate v-model="feedbackForm.productPerformance" :max="10"></el-rate>
      <span class="score-display">{{ feedbackForm.productPerformance }}</span>
    </el-form-item>
  </div>

      <!-- 服务评价 -->
      <div class="section">
    <h3 class="section-title">服务评价</h3>
    <el-form-item label="客服响应">
      <el-rate v-model="feedbackForm.serviceResponse" :max="10"></el-rate>
      <span class="score-display">{{ feedbackForm.serviceResponse }}</span>
    </el-form-item>
    <el-form-item label="售后服务">
      <el-rate v-model="feedbackForm.afterSalesService" :max="10"></el-rate>
      <span class="score-display">{{ feedbackForm.afterSalesService }}</span>
    </el-form-item>
    <el-form-item label="沟通质量">
      <el-rate v-model="feedbackForm.communicationQuality" :max="10"></el-rate>
      <span class="score-display">{{ feedbackForm.communicationQuality }}</span>
    </el-form-item>
    <el-form-item label="异常处理">
      <el-rate v-model="feedbackForm.exceptionHandling" :max="10"></el-rate>
      <span class="score-display">{{ feedbackForm.exceptionHandling }}</span>
    </el-form-item>
  </div>

<!-- 交易评价 -->
<div class="section">
  <h3 class="section-title">交易评价</h3>
  <el-form-item label="付款流程">
    <el-rate v-model="feedbackForm.paymentProcess" :max="10"></el-rate>
    <span class="score-display">{{ feedbackForm.paymentProcess }}</span>
  </el-form-item>
  <el-form-item label="文档完整性">
    <el-rate v-model="feedbackForm.documentCompleteness" :max="10"></el-rate>
    <span class="score-display">{{ feedbackForm.documentCompleteness }}</span>
  </el-form-item>
  <el-form-item label="交易便捷性">
    <el-rate v-model="feedbackForm.transactionConvenience" :max="10"></el-rate>
    <span class="score-display">{{ feedbackForm.transactionConvenience }}</span>
  </el-form-item>
  <el-form-item label="安全性">
    <el-rate v-model="feedbackForm.security" :max="10"></el-rate>
    <span class="score-display">{{ feedbackForm.security }}</span>
  </el-form-item>
  <el-form-item label="数据准确性">
    <el-rate v-model="feedbackForm.dataAccuracy" :max="10"></el-rate>
    <span class="score-display">{{ feedbackForm.dataAccuracy }}</span>
  </el-form-item>
</div>

<!-- 其他 -->
<div class="section">
  <h3 class="section-title">其他</h3>
  <el-form-item label="整体满意度">
    <el-rate v-model="feedbackForm.overallSatisfaction" :max="10"></el-rate>
    <span class="score-display">{{ feedbackForm.overallSatisfaction }}</span>
  </el-form-item>
  <el-form-item label="是否推荐">
    <el-rate v-model="feedbackForm.recommend" :max="10"></el-rate>
    <span class="score-display">{{ feedbackForm.recommend }}</span>
  </el-form-item>
</div>


      <!-- 其他建议与评论 -->
      <el-form-item label="其他建议与评论">
        <el-input type="textarea" v-model="feedbackForm.otherComments"></el-input>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item class="submit-button">
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      feedbackForm: {
        transactionType: '',
        deliveryAccuracy: 0,
        deliverySpeed: 0,
        productAppearance: 0,
        productPackaging: 0,
        productPerformance: 0,
        serviceResponse: 0,
        afterSalesService: 0,
        communicationQuality: 0,
        exceptionHandling: 0,
        recommend: 0,
        otherComments: '',
        paymentProcess: 0,
        documentCompleteness: 0,
        transactionConvenience: 0,
        security: 0,
        dataAccuracy: 0,
        overallSatisfaction: 0,
        recommend: 0,
      },
      transactionOptions: ['交易一', '交易二', '交易三']
    };
  },
  methods: {
    submitForm() {
      // 提交表单操作
    }
  }
};
</script>

<style scoped>
.feedback-container {
  width: 800px;
  margin: 50px auto;
  border: 1px solid #e5e5e5;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background: #f9f9f9;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}

.feedback-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 20px;
  color: #555;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.score-display {
  font-size: 18px;
 


  margin-left: 15px;
  color: #3a8ee6;
  vertical-align: middle;
  background: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.submit-button {
  text-align: center;
}
</style>
