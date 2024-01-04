<template>
  <div>
    <div class="container">
      <h1 class="page-title">企业协同效果评估系统</h1>
      <hr class="divider">

      <el-form
          :model="feedbackForm"
          label-width="100px"
          class="demo-form">
        <div class="select-container">
          <label for="search">选择待评估任务：</label>
          <el-select v-model="selectedTask" @change="onTaskChange">
            <el-option
                v-for="task in tasks"
                :key="task.id"
                :label="task.name"
                :value="task.id">
            </el-option>
          </el-select>

          <el-select v-model="selectedCompany" @change="updateFeedbackInfo">
            <el-option

                v-for="company in companies"

                :key="company.id"
                :label="company.name"
                :value="company.id">
            </el-option>
          </el-select>


          <!-- ... 其他代码 ... -->
          <el-button type="primary" @click="fetchScoreHistory">历史评分</el-button>
          <el-dialog
              title="历史得分记录"
              v-model="dialogVisible"
              width="60%"

          >
            <el-table :data="scoreHistory" style="width: 80% ">
              <el-table-column
                  prop="taskId"
                  label="任务ID"
                  align="center"
              >
              </el-table-column>

              <el-table-column prop="evaluatedCompanyId" label="被评分企业ID"
                               align="center"
              ></el-table-column>
              <el-table-column prop="score" label="得分"
                               align="center"
              ></el-table-column>
              <el-table-column
                  label="时间"

                  width="400"
                  align="center"

                  :formatter="formatDate">
              </el-table-column>
            </el-table>
            <div v-if="scoreHistory.length === 0">
              <p>暂无历史得分记录</p>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
    </span>
          </el-dialog>
          <!-- ... 其他代码 ... -->

        </div>


        <!-- 上半部分 -->
        <el-row
            :gutter="20"
            class="row-container">
          <!-- 第一部分 -->
          <el-col
              :span="12"
              class="chart-container">
            <div class="box-card">
              <delivery-feedback
                  v-model:feedbackForm="feedbackForm"
                  :deliveryData="deliveryData"
                  @feedbackChanged="handleFeedbackChange"
                  @supplyRateScoreCalculated="handleSupplyRateScore"
                  @deliveryTimeScoreCalculated="handleDeliveryTimeScore"
              />


            </div>
          </el-col>

          <!-- 第二部分 -->
          <el-col
              :span="12"
              class="chart-container">
            <div class="box-card">

              <ProductQualityFeedback v-model:feedbackForm="feedbackForm"
                                      @updateDefectiveQuantity="handleDefectiveQuantityUpdate"
                                      @updatePassRateScore="handlePassRateScoreUpdate"

                                      @updateDataAccuracyRating="updateAccuracy"
                                      @updatePackagingRating="updatePackagingRating"
                                      @updateAppearanceRating="updateAppearanceRating"
              />
            </div>
          </el-col>
        </el-row>

        <!-- 下半部分 -->
        <el-row
            :gutter="20"
            class="row-container">
          <!-- 第三部分 -->
          <el-col
              :span="12"
              class="chart-container">
            <div class="box-card">
              <ServiceFeedback
                  @updateServiceResponseRating="updateServiceResponseRating"
                  @updateAfterSalesServiceRating="updateAfterSalesServiceRating"
                  @updateCommunicationQualityRating="updateCommunicationQualityRating"
                  @updateExceptionHandlingRating="updateExceptionHandlingRating"

              />

            </div>
          </el-col>

          <!-- 第四部分 -->
          <el-col
              :span="12"
              class="chart-container">
            <div class="box-card">
              <TransactionFeedback
                  @updatePriceRating="updatePriceRating"
                  @updateDocumentCompletenessRating="updateDocumentCompletenessRating"
                  @updateTransactionConvenienceRating="updateTransactionConvenienceRating"
                  @TransactionSecurityRating="updateTransactionSecurityRating"
              />
            </div>
          </el-col>
        </el-row>

        <!-- 提交按钮 -->
        <div class="submit-button">
          <el-button
              type="primary"
              @click.prevent="submitForm">
            提交
          </el-button>
        </div>
      </el-form>
    </div>


    <footer style="margin-left: 20px;">
      <p>© 2023 东南大学 仅供测试</p>
    </footer>
  </div>
</template>

<script>

import {
  fetchAllTasks,
  fetchCompaniesByTaskId,
  fetchScoreHistory,
  fetchTaskCompanyInfo,
  submitFeedback,
  submitScoreRecord
} from '@/api/multigranularity/evaluate';
import DeliveryFeedback from './DeliveryFeedback.vue';
import ProductQualityFeedback from './ProductQualityFeedback.vue';
import ServiceFeedback from './ServiceFeedback.vue';
import TransactionFeedback from './TransactionFeedback.vue';
import {ElMessageBox} from 'element-plus';

export default {
  data() {
    return {
      scoreHistory: [],
      deliveryData: {
        scheduledQuantity: null,
        scheduledTime: null,
        expectedDeliveryTime: null,
        expectedQuantity: null
      },
      myresponse: {},
      dialogVisible: false,
      qualityStrength: '92.5',
      goodPoints: '',
      badPoints: '',

      feedbackForm: {
        deliveryFeedback: {
          supplyRate: 0,
          supplyRateScore: 0,
          deliveryTimeDifference: 0,
          deliveryTimeScore: 0,
          expectedQuantity: null,
          expectedDeliveryTime: null
        },

        productQualityFeedback: {
          passRateScore: 0,
          dataAccuracy: 0,
          productPackaging: 0,
          productAppearance: 0,
        },

        serviceFeedback: {
          customerServiceResponse: 0,
          afterSalesService: 0,
          communicationQuality: 0,
          exceptionHandling: 0

        },
        transactionFeedback: {
          priceRating: 0,
          documentCompleteness: 0,
          transactionConvenience: 0,
          transactionSecurity: 0,
        },
      },


      tasks: [],
      companies: [],
      selectedTask: null,
      selectedCompany: null,
      expectedQuantity: null,
      expectedDeliveryTime: null
    };
  },
  created() {

    this.getTasks();

  },
  components: {
    DeliveryFeedback,
    ProductQualityFeedback,
    ServiceFeedback,
    TransactionFeedback,
  },
  methods: {
    formatDate(row, column, cellValue, index) {
      return new Date(row.timestamp).toLocaleString();
    },
    async getTasks() {
      try {
        const response = await fetchAllTasks();
        console.log(response); // This should show you the full response object
        if (response) {
          // Assuming the tasks are directly within `response.data`
          this.tasks = response;
        } else {
          // If the tasks are nested, for example under `response.data.tasks`
          // this.tasks = response.data.tasks;
          console.error('No data received for tasks');
          this.$message.error('无法获取任务列表，请检查网络或稍后再试。');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        this.$message.error('无法获取任务列表，请检查网络或稍后再试。');
      }
    },


    // 在 Vue 组件中
    // async onCompanyChange() {
    //   if (!this.selectedCompany) {
    //
    //     return;
    //   }
    //   try {
    //     const response = await fetchAllCompanies();
    //     if (response ) {
    //       this.companies=response
    //     } else {
    //       console.error('No data received for the selected company');
    //       this.$message.error('无法获取企业详情，请检查网络或稍后再试。');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching company details:', error);
    //     this.$message.error('无法获取企业详情，请检查网络或稍后再试。');
    //   }
    // },

    async onTaskChange() {
      if (!this.selectedTask) {// 清空公司列表
        return;
      }
      try {
        const response = await fetchCompaniesByTaskId(this.selectedTask);
        console.log(response)
        if (response) {
          this.companies = response// 更新公司列表
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        this.$message.error('无法获取公司列表，请检查网络或稍后再试。');
      }
    },
    async updateFeedbackInfo() {
      if (this.selectedTask && this.selectedCompany) {
        try {
          const response = await fetchTaskCompanyInfo(this.selectedTask, this.selectedCompany);
          console.log(response.expectedQuantity)
          if (response) {
            this.deliveryData.expectedQuantity = response.expectedQuantity;
            this.deliveryData.expectedDeliveryTime = response.expectedDeliveryTime;
          } else {
            console.error('No task company info received');
            this.$message.error('无法获取任务和公司信息，请检查网络或稍后再试。');
          }
        } catch (error) {
          console.error('Error fetching task company info:', error);
          this.$message.error('无法获取任务和公司信息，请检查网络或稍后再试。');
        }
      }
    },


    handleDeliveryTimeScore(score) {
      this.feedbackForm.deliveryFeedback.deliveryTimeScore = score;
    },

    handlePassRateScoreUpdate(score) {
      this.feedbackForm.productQualityFeedback.passRateScore = score;
    },
    handleFeedbackChange(data) {
      this.feedbackForm.deliveryFeedback[data.key] = data.value;
    },

    handleSupplyRateScore(score) {
      // 在这里更新父组件中的数据
      this.feedbackForm.deliveryFeedback.supplyRateScore = score;
    },

    handleDefectiveQuantityUpdate(value) {

      this.someDataProperty = value;
    },
    updateAccuracy(rating) {
      this.feedbackForm.productQualityFeedback.dataAccuracy = rating;

      console.log(rating);
    },
    updatePackagingRating(rating) {
      // 同样的，更新feedbackForm对象
      this.feedbackForm.productQualityFeedback.productPackaging = rating;
      console.log(rating);
    },
    updateAppearanceRating(rating) {
      // 同样的，更新feedbackForm对象
      this.feedbackForm.productQualityFeedback.productAppearance = rating;
      console.log(rating);
    },

    updateServiceResponseRating(rating) {
      this.feedbackForm.serviceFeedback.customerServiceResponse = rating;
      console.log(rating);
    },
    updateAfterSalesServiceRating(rating) {
      this.feedbackForm.serviceFeedback.afterSalesService = rating;
      console.log(rating);
    },
    updateCommunicationQualityRating(rating) {
      this.feedbackForm.serviceFeedback.communicationQuality = rating;
      console.log(rating);
    },
    updateExceptionHandlingRating(rating) {
      this.feedbackForm.serviceFeedback.exceptionHandling = rating;
      console.log(rating);
    },
    updatePriceRating(rating) {
      this.feedbackForm.transactionFeedback.priceRating = rating;
      console.log(rating);
    },
    updateDocumentCompletenessRating(rating) {
      this.feedbackForm.transactionFeedback.documentCompleteness = rating;
      console.log(rating);
    },
    updateTransactionConvenienceRating(rating) {
      this.feedbackForm.transactionFeedback.transactionConvenience = rating;
      console.log(rating);
    },
    updateTransactionSecurityRating(rating) {
      this.feedbackForm.transactionFeedback.transactionSecurity = rating;
      console.log(rating);
    },


    async submitForm() {
      // 检查所有必填项目是否已经评价
      const feedback = this.feedbackForm;
      if (
          // !feedback.deliveryFeedback ||
          !feedback.productQualityFeedback.dataAccuracy ||
          !feedback.productQualityFeedback.productPackaging ||
          !feedback.productQualityFeedback.productAppearance ||
          !feedback.serviceFeedback.customerServiceResponse ||
          !feedback.serviceFeedback.afterSalesService ||
          !feedback.serviceFeedback.communicationQuality ||
          !feedback.serviceFeedback.exceptionHandling ||
          !feedback.transactionFeedback.priceRating ||
          !feedback.transactionFeedback.documentCompleteness ||
          !feedback.transactionFeedback.transactionConvenience ||
          !feedback.transactionFeedback.transactionSecurity) {
        // 弹出警告消息
        this.$message({
          type: 'warning',
          message: '请确保所有项目都已进行评价'
        });
        return;
      }

      // 原有的提交逻辑
      this.myresponse = await submitFeedback(this.feedbackForm);
      console.log("myresponse:", this.myresponse);
      const scoreRecord = {
        taskId: this.selectedTask,
        evaluatedCompanyId: this.selectedCompany,
        // 假设这是从 feedbackForm 计算出的总评分
        score: this.myresponse.data[0],
        timestamp: new Date().toISOString() // 当前时间

      };
      await submitScoreRecord(scoreRecord);
      console.log("Score record submitted");
      this.feedbackForm.selectedTask = this.selectedTask;
      try {
        const response = await submitFeedback(this.feedbackForm);
        this.showFeedbackSuccessMessage();
      } catch (error) {
        console.error('API错误:', error);
        this.$message.error('提交时出错，请检查网络或稍后再试。');
      }
    },

    async fetchScoreHistory() {
      try {
        const response = await fetchScoreHistory();
        if (response) {
          this.scoreHistory = response;
          this.dialogVisible = true;
          console.log('Dialog should be visible:', this.dialogVisible);
        } else {
          console.error('No score history data received');
          this.$message.error('无法获取历史得分记录，请检查网络或稍后再试。');
        }
      } catch (error) {
        console.error('Error fetching score history:', error);
        this.$message.error('无法获取历史得分记录，请检查网络或稍后再试。');
      }
    },


    showFeedbackSuccessMessage() {
      this.qualityStrength = '92.5';
      this.goodPoints = '1.价格 2.质量 3.文档完整性';
      this.badPoints = '1.产品外观 2.产品包装 3.售后服务';

      ElMessageBox.alert(`
    <div style="padding-left: 35px;">
      <strong>提交成功！</strong><br/>
      <strong>质量评分：</strong> ${this.myresponse.data[0]}<br/>
    </div>
  `, '企业协同效果评估系统', {
        confirmButtonText: 'OK',
        dangerouslyUseHTMLString: true,
        callback: (action) => {
          console.log(`action: ${action}`);
        },
      });
    }
    ,

  },
};
</script>


<style scoped>
.container {
  font-family: 'Arial, sans-serif';
  margin: 0 auto; /* Remove the margin and add auto to center it horizontally */
  max-width: 80%;
  color: #333;

  flex-direction: column;
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Center items vertically */


  box-sizing: border-box; /* To include padding and border in element's total width and height */
}

.row-container {
  display: flex;
  margin-bottom: 20px;
}

.chart-container {

  font-size: 120%;
  display: flex;
  flex-direction: column;
  gap: 20;
}

.box-card {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
  background-color: #fff;
  transition: transform 0.3s;
  min-height: 300px;
}

.box-card:hover {
  transform: translateY(-10px);
}

h3 {
  font-size: 1.2em;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #dddcdc;
  padding-bottom: 10px;
}

.select-container {

  text-align: center;
  margin: 20px;
}

.search-container label {
  margin-right: 200;
}

.el-button {
  font-size: 1.2em; /* 增加字体大小 */
  padding: 15px 30px; /* 增加内部填充来增大按钮 */
}

.submit-button {
  text-align: center;
  margin-top: 20px;


}


.page-title {
  text-align: center;
  font-weight: bold;
  font-size: 1.5em;
  margin-bottom: 20px;
}

.divider {
  border: 1px solid #817e7e;
  margin-bottom: 10px;
}

.section-title {
  display: flex;
  margin-top: 10px;
}
</style>
