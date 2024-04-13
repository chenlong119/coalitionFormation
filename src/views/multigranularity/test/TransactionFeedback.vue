<template>
  <div class="feedback-section">
    <h3 class="section-title">交易评价</h3>
    <div class="feedback-content">
    
      

      <!-- 价格评价 -->
      <el-form-item label="价格评价">
        <div class="rating-container">
          <div
            v-for="(box, index) in 5"
            :key="'price-rating-' + index"
            :class="['rating-box', 
            { 
            active: index < hoveredPriceRatingIndex, 
            filled: index < feedbackForm.priceRating 
            }]"

            @mouseover="hoverOverPriceRating(index)"
            @mouseout="hoverOutPriceRating"
            @click="setPriceRating(index + 1)"
            :style="{
              borderRadius: index === 0 ? '4px 0 0 4px' : index === 2 ? '0 4px 4px 0' : '0',
            }"
          ></div>
        </div>
        <span class="rating-text">
          <span v-if="selectedPriceRatingText !== null">
            {{ selectedPriceRatingText }}
          </span>
          <span v-else-if="hoveredPriceRatingIndex === 0">很不满意</span>
          <span v-else-if="hoveredPriceRatingIndex === 1">不满意</span>
          <span v-else-if="hoveredPriceRatingIndex === 2">一般</span>
          <span v-else-if="hoveredPriceRatingIndex === 3">满意</span>
          <span v-else-if="hoveredPriceRatingIndex === 4">非常满意</span>
        </span>
      </el-form-item>

      <!-- 文档完整性 -->
      <el-form-item label="材料完整性">
        <div class="rating-container">
          <div
            v-for="(box, index) in 5"
            :key="'document-completeness-' + index"
            :class="['rating-box', 
            { 
              active: index < hoveredDocumentCompletenessIndex, 
            filled: index < feedbackForm.documentCompleteness 
            }]"
            @mouseover="hoverOverDocumentCompleteness(index)"
            @mouseout="hoverOutDocumentCompleteness"
            @click="setDocumentCompletenessRating(index + 1)"
            :style="{
              borderRadius: index === 0 ? '4px 0 0 4px' : index === 2 ? '0 4px 4px 0' : '0',
            }"
          ></div>
        </div>
        <span class="rating-text">
          <span v-if="selectedDocumentCompletenessText !== null">
            {{ selectedDocumentCompletenessText }}
          </span>
          <span v-else-if="hoveredDocumentCompletenessIndex === 0">很不满意</span>
          <span v-else-if="hoveredDocumentCompletenessIndex === 1">不满意</span>
          <span v-else-if="hoveredDocumentCompletenessIndex === 2">一般</span>
          <span v-else-if="hoveredDocumentCompletenessIndex === 3">满意</span>
          <span v-else-if="hoveredDocumentCompletenessIndex === 4">非常满意</span>
        </span>
      </el-form-item>

      <!-- 交易便捷性 -->
      <el-form-item label="交易便捷性">
        <div class="rating-container">
          <div
            v-for="(box, index) in 5"
            :key="'transaction-convenience-' + index"
            :class="['rating-box', 
            { 
            active: index < hoveredTransactionConvenienceIndex, 
            filled: index < feedbackForm.transactionConvenience 
            }]"
            @mouseover="hoverOverTransactionConvenience(index)"
            @mouseout="hoverOutTransactionConvenience"
            @click="setTransactionConvenienceRating(index + 1)"
            :style="{
              borderRadius: index === 0 ? '4px 0 0 4px' : index === 2 ? '0 4px 4px 0' : '0',
            }"
          ></div>
        </div>
        <span class="rating-text">
          <span v-if="selectedTransactionConvenienceText !== null">
            {{ selectedTransactionConvenienceText }}
          </span>
          <span v-else-if="hoveredTransactionConvenienceIndex === 0">很不满意</span>
          <span v-else-if="hoveredTransactionConvenienceIndex === 1">不满意</span>
          <span v-else-if="hoveredTransactionConvenienceIndex === 2">一般</span>
          <span v-else-if="hoveredTransactionConvenienceIndex === 3">满意</span>
          <span v-else-if="hoveredTransactionConvenienceIndex === 4">非常满意</span>
        </span>
      </el-form-item>

      <!-- 交易安全性 -->

      <el-form-item label="交易安全性">
        <div class="rating-container">
          <div
            v-for="(box, index) in 5"
            :key="'transaction-security-' + index"
            :class="['rating-box', { 
              active: index < hoveredTransactionSecurityIndex, 
              filled: index < feedbackForm.transactionSecurity }]"
            @mouseover="hoverOverTransactionSecurity(index)"
            @mouseout="hoverOutTransactionSecurity"
            @click="setTransactionSecurityRating(index + 1)"
            :style="{
              borderRadius: index === 0 ? '4px 0 0 4px' : index === 2 ? '0 4px 4px 0' : '0',
            }"
          ></div>

        </div>
        <span class="rating-text">
          <span v-if="selectedTransactionSecurityText !== null">
            {{ selectedTransactionSecurityText }}
          </span>
          <span v-else-if="hoveredTransactionSecurityIndex === 0">很不满意</span>
          <span v-else-if="hoveredTransactionSecurityIndex === 1">不满意</span>
          <span v-else-if="hoveredTransactionSecurityIndex === 2">一般</span>
          <span v-else-if="hoveredTransactionSecurityIndex === 3">满意</span>
          <span v-else-if="hoveredTransactionSecurityIndex === 4">非常满意</span>
        </span>
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

        priceRating: 0,
        documentCompleteness: 0,
        transactionConvenience: 0,
        transactionSecurity: 0,
      }),
    },
  },
  data() {
    return {
      hoveredPriceRatingIndex: -1,
      selectedPriceRatingText: null,

      hoveredDocumentCompletenessIndex: -1,
      selectedDocumentCompletenessText: null,

      hoveredTransactionConvenienceIndex: -1,
      selectedTransactionConvenienceText: null,

      hoveredTransactionSecurityIndex: -1,
      selectedTransactionSecurityText: null,
    };
  },
  methods: {

    hoverOverPriceRating(index) {
      this.hoveredPriceRatingIndex = index;
    },
    hoverOutPriceRating() {
      this.hoveredPriceRatingIndex = -1;
    },
    setPriceRating(rating) {
      this.feedbackForm.priceRating = rating;
      this.selectedPriceRatingText = ["很不满意","不满意", "一般","满意", "非常满意"][rating - 1];
      this.$emit('updatePriceRating', rating);

    },

    hoverOverDocumentCompleteness(index) {
      this.hoveredDocumentCompletenessIndex = index;
    },
    hoverOutDocumentCompleteness() {
      this.hoveredDocumentCompletenessIndex = -1;
    },
    setDocumentCompletenessRating(rating) {
      this.feedbackForm.documentCompleteness = rating;
      this.selectedDocumentCompletenessText = this.getRatingText(rating);
      this.$emit('updateDocumentCompletenessRating', rating);
    },

    hoverOverTransactionConvenience(index) {
      this.hoveredTransactionConvenienceIndex = index;
    },
    hoverOutTransactionConvenience() {
      this.hoveredTransactionConvenienceIndex = -1;
    },
    setTransactionConvenienceRating(rating) {
      this.feedbackForm.transactionConvenience = rating;
      this.selectedTransactionConvenienceText = this.getRatingText(rating);
      this.$emit('updateTransactionConvenienceRating', rating);
    },

    hoverOverTransactionSecurity(index) {
      this.hoveredTransactionSecurityIndex = index;
    },
    hoverOutTransactionSecurity() {
      this.hoveredTransactionSecurityIndex = -1;
    },
    setTransactionSecurityRating(rating) {
      this.feedbackForm.transactionSecurity = rating;
      this.selectedTransactionSecurityText = this.getRatingText(rating);
      this.$emit('TransactionSecurityRating', rating);
    },

    getRatingText(rating) {
      return ["很不满意","不满意", "一般","满意", "非常满意"][rating - 1];
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
  width: 36px;
  height: 24px;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rating-box.active {
  background-color: #b0dfff;
}

.rating-box:hover {
  background-color: #b0dfff;
  transform: scale(1.02);
}

.rating-box.filled {
  background-color: #409eff;
}

.rating-box:not(:last-child) {
  border-right: 1px solid #c9c9c9;
}
</style>
