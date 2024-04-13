<template>
  <div class="feedback-section">
    <h3 class="section-title">产品评价</h3>

    <!-- 质量不合格的件数 -->
<!-- 质量不合格的件数 -->
<el-form-item label="质量不合格数">

    <el-input
        v-model="feedbackForm.defectiveQuantity"
        type="number"
        placeholder="请输入数量"
        style="width: 110px;"
        @input="updateDefectiveQuantity"
    >
    </el-input>



<!-- 合格率 -->
<div style="margin-left: 5px;">合格率:</div>
  <div class="rating-display">
    {{ calculatePassRate() }}
  </div>
</el-form-item>

<!-- 质量评价 -->
<!-- <el-form-item label="质量评价">
  <div class="rating-container">
    <div
      v-for="(box, index) in 3"
      :key="'quality-evaluation-' + index"
      :class="['rating-box', 
      { active: index < hoveredQualityEvaluationIndex, 
        filled: index < feedbackForm.qualityEvaluation }]"
      @mouseover="hoverOverQualityEvaluation(index)"
      @mouseout="hoverOutQualityEvaluation"
      @click="setQualityEvaluationRating(index + 1)"
      :style="{
        borderRadius: index === 0 ? '4px 0 0 4px' : index === 2 ? '0 4px 4px 0' : '0',
      }"
    >
    </div>
  </div>
  <span class="rating-text">
    <span v-if="selectedQualityRatingText !== null">{{ selectedQualityRatingText }}</span>
    <span v-else-if="hoveredQualityEvaluationIndex === 0">不满意</span>
    <span v-else-if="hoveredQualityEvaluationIndex === 1">基本满意</span>
    <span v-else-if="hoveredQualityEvaluationIndex === 2">非常满意</span>
  </span>
</el-form-item> -->

<!-- (Similar segments for 产品包装 and 产品外观, replacing the corresponding variables.) -->

<!-- 新增一个“数据准确性”的评价项目 -->
<el-form-item label="数据准确性">
  <div class="rating-container">
    <div
      v-for="(box, index) in 5"
      :key="'data-accuracy-' + index"
      :class="['rating-box',
       { active: index < hoveredDataAccuracyIndex, 
       filled: index < feedbackForm.dataAccuracy }]"
      @mouseover="hoverOverDataAccuracy(index)"
      @mouseout="hoverOutDataAccuracy"
  
      @click="setDataAccuracyRating(index + 1)"
      :style="{
        borderRadius: index === 0 ? '4px 0 0 4px' : index === 4 ? '0 4px 4px 0' : '0',
      }"
    >
    </div>
  </div>
  <span class="rating-text">
    <span v-if="selectedDataAccuracyText !== null">
      {{ selectedDataAccuracyText }}
    </span>
    <span v-else-if="hoveredDataAccuracyIndex === 0">很不满意</span>
    <span v-else-if="hoveredDataAccuracyIndex  === 1">不满意</span>
    <span v-else-if="hoveredDataAccuracyIndex  === 2">一般</span>
    <span v-else-if="hoveredDataAccuracyIndex  === 3">满意</span>
    <span v-else-if="hoveredDataAccuracyIndex  === 4">非常满意</span>
  </span>
</el-form-item>

    


   <!-- 产品包装 -->
<el-form-item label="产品包装">
  <div class="rating-container">
    <div
      v-for="(box, index) in 5"
      :key="'product-packaging-' + index"
      :class="['rating-box', 
      { active: index < hoveredPackagingIndex, 
      filled: index < feedbackForm.productPackaging }]"
      
      @mouseover="hoverOverPackaging(index)"

      @mouseout="hoverOutPackaging"
      @click="setPackagingRating(index + 1)"
      :style="{
        borderRadius: index === 0 ? '4px 0 0 4px' : index === 4 ? '0 4px 4px 0' : '0',
      }"
    >
    </div>
  </div>
  <span class="rating-text">
    <span v-if="selectedPackagingText !== null">
      {{ selectedPackagingText }}
    </span>
    <span v-else-if="hoveredPackagingIndex === 0">很不满意</span>
    <span v-else-if="hoveredPackagingIndex === 1">不满意</span>
    <span v-else-if="hoveredPackagingIndex === 2">一般</span>
    <span v-else-if="hoveredPackagingIndex === 3">满意</span>
    <span v-else-if="hoveredPackagingIndex === 4">非常满意</span>
  
  </span>
</el-form-item>

<!-- 产品外观 -->
<el-form-item label="产品外观">
  <div class="rating-container">
    <div
      v-for="(box, index) in 5"
      :key="'product-appearance-' + index"
      :class="['rating-box', 
      { active: index < hoveredAppearanceIndex, 
      filled: index < feedbackForm.productAppearance }]"
      @mouseover="hoverOverAppearance(index)"
      @mouseout="hoverOutAppearance"
      @click="setAppearanceRating(index + 1)"
      :style="{
        borderRadius: index === 0 ? '4px 0 0 4px' : index === 4 ? '0 4px 4px 0' : '0',
      }"
    >
    </div>
  </div>
  <span class="rating-text">
    <span v-if="selectedAppearanceText !== null">
      {{ selectedAppearanceText }}
    </span>
    <span v-else-if="hoveredAppearanceIndex === 0">很不满意</span>
    <span v-else-if="hoveredAppearanceIndex  === 1">不满意</span>
    <span v-else-if="hoveredAppearanceIndex  === 2">一般</span>
    <span v-else-if="hoveredAppearanceIndex  === 3">满意</span>
    <span v-else-if="hoveredAppearanceIndex  === 4">非常满意</span>
  
  </span>
</el-form-item>

  </div>
</template>

<script>
export default {
  props: {
    feedbackForm: {
  type: Object,
  default: () => ({
    defectiveQuantity: 0,
    qualityEvaluation: 0,
    dataAccuracy: 0,
    productPackaging: 0,
      productAppearance: 0,

  }),
}},
  data() {
    return {
      isHovered: false,
      hoveredIndex: -1,

    hoveredQualityReview: -1,
    hoveredQualityEvaluationIndex: -1,
    selectedQualityRatingText: null,
    hoveredDataAccuracyIndex: -1,
    selectedDataAccuracyText: null,
    hoveredPackagingIndex: -1,
    selectedPackagingText: null,
    hoveredAppearanceIndex: -1,
    selectedAppearanceText: null,
    
  
    };
  },
  methods: {
    calculateScore(value) {
      if (value >= 93) return 5;
      else if (value >= 85) return 4;
      else if (value >= 75) return 3;
      else if (value >= 60) return 2;
      else if (value >= 40) return 1;
      else return 0;
    },
    updateDefectiveQuantity() {
      this.$emit('updateDefectiveQuantity', this.feedbackForm.defectiveQuantity);
      this.emitScoreUpdates();
    },

    emitScoreUpdates() {
      const passRateScore = this.calculateScore(this.calculatePassRate());
      const supplyRateScore = this.calculateScore(this.feedbackForm.supplyRate);

      this.$emit('updatePassRateScore', passRateScore);
    },

    calculatePassRate() {
      if (this.feedbackForm.receivedQuantity > 0) {
        let passQuantity = this.feedbackForm.receivedQuantity - this.feedbackForm.defectiveQuantity;
        return (passQuantity / this.feedbackForm.receivedQuantity) * 100;
      } else {
        return 0; // 或者任何表示不适用的值
      }
    },




    setDataAccuracyRating(rating) {

this.feedbackForm.dataAccuracy = rating;
this.selectedDataAccuracyText  = ["很不满意","不满意", "一般","满意", "非常满意"][rating - 1];
this.$emit('updateDataAccuracyRating', rating);  // Emitting the event
},
setPackagingRating(rating) {
    this.feedbackForm.productPackaging = rating;
    this.selectedPackagingText = ["很不满意","不满意", "一般","满意", "非常满意"][rating - 1];
    this.$emit('updatePackagingRating', rating);  // Emitting the event
  },

  setAppearanceRating(rating) {
    this.feedbackForm.productAppearance = rating;
    this.selectedAppearanceText = ["很不满意","不满意", "一般","满意", "非常满意"][rating - 1];
    this.$emit('updateAppearanceRating', rating);  // Emitting the event
  },

  hoverOutPackaging() {
    this.hoveredPackagingIndex = -1;
  },


  hoverOverAppearance(index) {
    this.hoveredAppearanceIndex = index;
  },
  hoverOutAppearance() {
    this.hoveredAppearanceIndex = -1;
  },

hoverOverDataAccuracy(index) {
    this.hoveredDataAccuracyIndex = index;
  },
  hoverOutDataAccuracy() {
    this.hoveredDataAccuracyIndex = -1;
  },

hoverOverQualityEvaluation(index) {
    this.hoveredQualityEvaluationIndex = index;
  },
  hoverOutQualityEvaluation() {
    this.hoveredQualityEvaluationIndex = -1;
  },
  setQualityEvaluationRating(rating) {
    this.feedbackForm.qualityEvaluation = rating;
    if (this.selectedQualityRatingText !== null && this.feedbackForm.qualityEvaluation === rating) { 
      this.selectedQualityRatingText = null;  
    } else {
      this.selectedQualityRatingText = ["不满意", "基本满意", "非常满意"][rating - 1];  
    }
    this.$emit('updateQualityEvaluationRating', rating);  // Emitting the event
  },
    hoverOver(index) {
      this.hoveredIndex = index;
    },
    setRating(rating) {
      this.feedbackForm.productAppearance = rating;
      this.hoveredIndex = -1;
    },
    hoverOverPackaging(index) {
      this.hoveredPackagingIndex = index;
    },
 
    hoverOverQualityReview(index) {
      this.hoveredQualityReview = index;
    },

    
  },
};
</script>
<style>
.rating-display {
  margin-left: 10px;
  font-size: 14px;
  color: #333;
}

.rating-container {  width: 300px;
  height: 24px;
  
  font-size: 10px; /* 字体大小为14px */

  display: flex;
  border: 1px solid #ccc;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: #f9f9f9;
  transition: box-shadow 0.3s ease;
 }/*
.rating-container .rating-box {
  color: black;  
c}

.rating-container .rating-box.filled {
  color: white; 
} */

.rating-box {
  flex: 1;

  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
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
</style>
