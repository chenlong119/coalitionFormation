<template>
  <div class="feedback-section">
    <h3 class="section-title">服务评价</h3>
    <div class="feedback-content">
    <!-- 客服响应 -->

    <!-- 客服响应 -->
    <el-form-item label="客服响应">
      <div class="rating-container">
        <div
          v-for="(box, index) in 5"
          :key="'customer-service-response-' + index"
          :class="['rating-box',
          { active: index < hoveredCustomerServiceResponseIndex,
          filled: index < feedbackForm.customerServiceResponse }]"
          @mouseover="hoverOverCustomerServiceResponse(index)"
          @mouseout="hoverOutCustomerServiceResponse"
          @click="setCustomerServiceResponseRating(index + 1)"
          :style="{
            borderRadius: index === 0 ? '4px 0 0 4px' : index === 4 ? '0 4px 4px 0' : '0',
          }"
        >
        </div>
      </div>
      <span class="rating-text">
        <span v-if="selectedCustomerServiceResponseText !== null">
          {{ selectedCustomerServiceResponseText }}
        </span>
        <span v-else-if="hoveredCustomerServiceResponseIndex === 0">很不满意</span>
        <span v-else-if="hoveredCustomerServiceResponseIndex === 1">不满意</span>
        <span v-else-if="hoveredCustomerServiceResponseIndex === 2">一般</span>
        <span v-else-if="hoveredCustomerServiceResponseIndex === 3">满意</span>
        <span v-else-if="hoveredCustomerServiceResponseIndex === 4">特别满意</span>
      </span>
    </el-form-item>

    <!-- 售后服务 -->
    <el-form-item label="售后服务">
      <div class="rating-container">
        <div
          v-for="(box, index) in 5"
          :key="'after-sales-service-' + index"
          :class="['rating-box',
          { active: index < hoveredAfterSalesServiceIndex,

          filled: index < feedbackForm.afterSalesService }]"
          @mouseover="hoverOverAfterSalesService(index)"
          @mouseout="hoverOutAfterSalesService"
          @click="setAfterSalesServiceRating(index + 1)"
          :style="{
            borderRadius: index === 0 ? '4px 0 0 4px' : index === 2 ? '0 4px 4px 0' : '0',
          }"
        >
        </div>
      </div>
      <span class="rating-text">
        <span v-if="selectedAfterSalesServiceText !== null">
          {{ selectedAfterSalesServiceText }}
        </span>
        <span v-else-if="hoveredAfterSalesServiceIndex === 0">很不满意</span>
        <span v-else-if="hoveredAfterSalesServiceIndex === 1">不满意</span>
        <span v-else-if="hoveredAfterSalesServiceIndex === 2">一般</span>
        <span v-else-if="hoveredAfterSalesServiceIndex === 3">满意</span>
        <span v-else-if="hoveredAfterSalesServiceIndex === 4">特别满意</span>
      </span>
    </el-form-item>

    <!-- 沟通质量 -->
    <el-form-item label="沟通质量">
      <div class="rating-container">
        <div
          v-for="(box, index) in 5"
          :key="'communication-quality-' + index"
          :class="['rating-box',
          { active: index < hoveredCommunicationQualityIndex,
          filled: index < feedbackForm.communicationQuality }]"
          @mouseover="hoverOverCommunicationQuality(index)"
          @mouseout="hoverOutCommunicationQuality"
          @click="setCommunicationQualityRating(index + 1)"
          :style="{
            borderRadius: index === 0 ? '4px 0 0 4px' : index === 2 ? '0 4px 4px 0' : '0',
          }"
        >
        </div>
      </div>
      <span class="rating-text">
        <span v-if="selectedCommunicationQualityText !== null">
          {{ selectedCommunicationQualityText }}
        </span>
        <span v-else-if="hoveredCommunicationQualityIndex === 0">很不满意</span>
        <span v-else-if="hoveredCommunicationQualityIndex === 1">不满意</span>
        <span v-else-if="hoveredCommunicationQualityIndex === 2">一般</span>
        <span v-else-if="hoveredCommunicationQualityIndex === 3">满意</span>
        <span v-else-if="hoveredCommunicationQualityIndex === 4">非常满意</span>

      </span>
    </el-form-item>

    <!-- 异常处理 -->
    <el-form-item label="异常处理">
      <div class="rating-container">
        <div
          v-for="(box, index) in 5"
          :key="'exception-handling-' + index"
          :class="['rating-box',
          { active: index < hoveredExceptionHandlingIndex,
           filled: index < feedbackForm.exceptionHandling }]"
          @mouseover="hoverOverExceptionHandling(index)"
          @mouseout="hoverOutExceptionHandling"
          @click="setExceptionHandlingRating(index + 1)"
          :style="{
            borderRadius: index === 0 ? '4px 0 0 4px' : index === 2 ? '0 4px 4px 0' : '0',
          }"
        >
        </div>
      </div>
      <span class="rating-text">
        <span v-if="selectedExceptionHandlingText !== null">
          {{ selectedExceptionHandlingText }}
        </span>
        <span v-else-if="hoveredExceptionHandlingIndex === 0">很不满意</span>
        <span v-else-if="hoveredExceptionHandlingIndex === 1">不满意</span>
        <span v-else-if="hoveredExceptionHandlingIndex === 2">一般</span>
        <span v-else-if="hoveredExceptionHandlingIndex === 3">满意</span>
        <span v-else-if="hoveredExceptionHandlingIndex === 4">非常满意</span>
      </span>
    </el-form-item></div>
  </div>
</template>

<script>
export default {
  props: {
    feedbackForm: {
      type: Object,
      default: () => ({
        customerServiceResponse: 0,
        afterSalesService: 0,
        communicationQuality: 0,
        exceptionHandling: 0,
      }),
    },
  },
  data() {
    return {
      hoveredCustomerServiceResponseIndex: -1,
      selectedCustomerServiceResponseText: null,
      hoveredAfterSalesServiceIndex: -1,
      selectedAfterSalesServiceText: null,
      hoveredCommunicationQualityIndex: -1,
      selectedCommunicationQualityText: null,
      hoveredExceptionHandlingIndex: -1,
      selectedExceptionHandlingText: null,
    };
  },
  methods: {
    hoverOverCustomerServiceResponse(index) {
      this.hoveredCustomerServiceResponseIndex = index;
    },
    hoverOutCustomerServiceResponse() {
      this.hoveredCustomerServiceResponseIndex = -1;
    },
    setCustomerServiceResponseRating(rating)
    {
      this.feedbackForm.customerServiceResponse = rating;
      this.selectedCustomerServiceResponseText = ["很不满意","不满意", "一般","满意", "非常满意"][rating - 1];
      this.$emit('updateServiceResponseRating', rating);
    },
    setAfterSalesServiceRating(rating) {
      this.feedbackForm.afterSalesService = rating;
      this.selectedAfterSalesServiceText = this.getRatingText(rating);
      this.$emit('updateAfterSalesServiceRating', rating);
    },
    setCommunicationQualityRating(rating) {
      this.feedbackForm.communicationQuality = rating;
      this.selectedCommunicationQualityText = this.getRatingText(rating);
      this.$emit('updateCommunicationQualityRating', rating);
    },
    setExceptionHandlingRating(rating) {
      this.feedbackForm.exceptionHandling = rating;
      this.selectedExceptionHandlingText = this.getRatingText(rating);
      this.$emit('updateExceptionHandlingRating', rating);
    },
    hoverOverAfterSalesService(index)
    {
      this.hoveredAfterSalesServiceIndex = index;
    },
    hoverOutAfterSalesService()
    {
      this.hoveredAfterSalesServiceIndex = -1;
    },

    hoverOverCommunicationQuality(index) {
      this.hoveredCommunicationQualityIndex = index;
    },
    hoverOutCommunicationQuality() {
      this.hoveredCommunicationQualityIndex = -1;
    },

    hoverOverExceptionHandling(index) {
      this.hoveredExceptionHandlingIndex = index;
    },
    hoverOutExceptionHandling() {
      this.hoveredExceptionHandlingIndex = -1;
    },
    getRatingText(rating) {
      return ["很不满意","不满意", "一般","满意", "非常满意"][rating - 1];
    },
  },
};
</script>

<!-- <style>
.rating-display {
  margin-left: 10px;
  font-size: 14px;
  color: #333;
}
.rating-container {
  display: flex;
  border: 1px solid #ccc;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: #f9f9f9;
  transition: box-shadow 0.3s ease;

}



.rating-box {
  flex: 1;
  width: 300px; /* slightly increased width */
  height: 24px;
  background-color: #f0f0f0; /* softer background color */
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease; /* smoother transition */
  display: flex;
  align-items: center;
  justify-content: center;
}

.rating-box.active {
  background-color: #b0dfff; /* softer filled color */
   /* slightly larger scale effect */
}
.rating-box:hover {
  background-color: #b0dfff; /* softer filled color */
  transform: scale(1.02); /* slightly larger scale effect */
}
.rating-box.filled {
  background-color: #2c6fff;
}

.rating-box:not(:last-child) {
  border-right: 1px solid #8a8a8a; /* softer border color */
}

</style> -->