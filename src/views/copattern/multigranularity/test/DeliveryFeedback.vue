<template>
    <div class="feedback-section">
      <h3 class="section-title">交货情况</h3>
      
      <div class="feedback-content">
        <!-- 应交货数量 -->
        <el-form-item label="应交数量">
          <span style="margin-left: 5px;">
            {{ deliveryData.expectedQuantity }}
          </span>
          <div style="margin-left: 15px;">件</div>
        </el-form-item>
    

    <!-- 实收数量 -->
<el-form-item label="实收数量">
  <el-input 
    v-model="feedbackForm.receivedQuantity" 
    placeholder="请输入实收数量" 
    style="width: 150px; margin-left: 5px;"
    @input="emitFeedbackChange('receivedQuantity', feedbackForm.receivedQuantity)">
  </el-input>
  <div style="margin-left: 10px;">件</div>
</el-form-item>



        <!-- 约定时间 -->
        <el-form-item label="约定时间">
          <span style="margin-left: 10px;">
            {{ deliveryData.expectedDeliveryTime }}
          </span>
        </el-form-item>
    
        <!-- 实际收货时间 -->
    <!-- 实际收货时间 -->
    <el-form-item label="到货时间">
      <el-date-picker
        v-model="feedbackForm.actualDeliveryTime"
        type="datetime"
        placeholder="选择实际收货时间"
        style="width: 170px"
        @change="emitFeedbackChange('actualDeliveryTime', feedbackForm.actualDeliveryTime)">
      </el-date-picker>
    </el-form-item>
      </div>
 
    </div>
  </template>
  
  
  <script>
  export default {
    props: {
      feedbackForm: {
        type: Object,
        default: () => ({


        }),
      },
      deliveryData: {
        type: Object,
        default: () => ({

          expectedDeliveryTime: null,
          expectedQuantity: null
        }),
      }},
      data() {
  return {
    hoveredPriceEvaluationIndex: -1,
    selectedRatingText: null,  // 新增用于存储选中的评价文本
  };
},

    methods: {
      calculateScore(value) {
        // 与之前类似的评分逻辑
        if (value >= 93) {
          return 5;
        } else if (value >= 85) {
          return 4;
        } else if (value >= 75) {
          return 3;
        } else if (value >= 60) {
          return 2;
        } else if (value >= 40) {
          return 1;
        } else {
          return 0;
        }
      },
      // 当receivedQuantity或actualDeliveryTime变化时，立即计算并发送新值
      emitFeedbackChange(key, value) {
        this.$emit('feedbackChanged', { key, value });

        // 计算supplyRate和deliveryTimeDifference
        if (key === 'receivedQuantity' || key === 'actualDeliveryTime') {
          this.calculateSupplyRate();
          this.calculateDeliveryTimeDifference();
        }
      },

      calculateSupplyRate() {
        const received = Number(this.feedbackForm.receivedQuantity);
        const scheduled = Number(this.deliveryData.expectedQuantity);
        if (received && scheduled) {
          const supplyRate = (received / scheduled) * 100;
          const supplyRateScore = this.calculateScore(supplyRate);  // 计算评分
          this.$emit('feedbackChanged', { key: 'supplyRate', value: supplyRate });
          this.$emit('supplyRateScoreCalculated', supplyRateScore);  // 发送评分事件
        }
      },
      calculateDeliveryTimeScore() {
        const diff = this.feedbackForm.deliveryTimeDifference;
        const absDiff = Math.abs(diff); // 取绝对值，忽略正负

        let score;
        if (absDiff <= 3) {
          score = 5;
        } else if (absDiff <= 5) {
          score = 4;
        } else if (absDiff <= 7) {
          score = 3;
        } else if (absDiff <= 10) {
          score = 2;
        } else if (absDiff <= 15) {
          score = 1;
        } else {
          score = 0;
        }

        // 发送计算出的分数
        this.$emit('deliveryTimeScoreCalculated', score);
      },

      calculateDeliveryTimeDifference() {
        const actual = new Date(this.feedbackForm.actualDeliveryTime);
        const scheduled = new Date(this.deliveryData.expectedDeliveryTime);
        if (actual && scheduled) {
          const diff = (actual - scheduled) / (1000 * 3600 * 24); // 转换为天数
          this.feedbackForm.deliveryTimeDifference = diff; // 存储时间差
          this.$emit('feedbackChanged', { key: 'deliveryTimeDifference', value: diff });

          // 在计算时间差后调用计算分数的方法
          this.calculateDeliveryTimeScore();
        }
      },

},
  };
  </script>
  
  <style>
.feedback-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feedback-content {

  margin-top: 0px;
 max-width: max-content;
}
.rating-container {
  font-family: 'Arial', sans-serif; 
  /* 使用Arial字体 */

  font-size: 14px; 
  /* 字体大小为14px */
}
.section-title {
  text-align: center;
   /* 确保标题居中 */
}
.box-card:hover + .divider {
  border-color: #409eff; 
  /* 修改分隔线的颜色为蓝色 */
}
/* 添加一个新的CSS类来设置悬停文本的样式 */
.hover-text {
  position: absolute;
  top: -20px; /* 根据需要调整位置 */
  left: 0;
  width: 100%;
  text-align: center;
}
/* 添加一个新的CSS类来设置评价文本的样式 */
.rating-text {
  margin-left: 10px; 
  /* 根据需要调整位置 */
  font-size: 14px; 
  /* 设置字体大小 */
  color: #333; 
  /* 设置字体颜色 */
  font-weight: 500; 
  /* 设置字体权重 */
  transition: color 0.3s ease; 
  /* 添加颜色过渡效果 */
}

.rating-container:hover .rating-text {
  color: #ff6600; 
  /* 设置悬停时的字体颜色 */
}
  </style>
  