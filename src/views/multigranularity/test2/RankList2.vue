<template>
  <el-col>
    <div class="box-card">
      <h3 class="productStatusTitle">企业评分排行榜</h3>
      <el-button-group class="button-group-centered">
        <el-button @click="setDateRange('month')">本月</el-button>
        <el-button @click="setDateRange('halfYear')">半年</el-button>
        <el-button @click="setDateRange('year')">一年</el-button>
      </el-button-group>
      <el-table :data="rankData" class="el-table" stripe>
        <el-table-column type="index" label="排名" align="center" :width="rankWidth">
          <template #default="{ row }">
          <span v-if="row.companyRanking=== 1" class="rank-gold">🥇</span>
          <span v-else-if="row.companyRanking === 2" class="rank-silver">🥈</span>
          <span v-else-if="row.companyRanking=== 3" class="rank-bronze">🥉</span>
          <span v-else>{{ row.companyRanking }}</span> </template>
        </el-table-column>
        <el-table-column prop="name" label="企业名称" :width="groupNameWidth" align="center"></el-table-column>
        <el-table-column prop="score" label="分数" align="center" :width="scoreWidth"></el-table-column>
      </el-table>
    </div>
  </el-col>
</template>

<script>
import { fetchCompanyRanking } from "@/api/multigranularity/datashow"; // 确保这个路径与您的项目结构匹配

export default {
  data() {
    return {
      rankData: [], // 存储API返回的排名数据
      rankWidth: '20%', // 默认宽度百分比
      groupNameWidth: '50%', // 默认宽度百分比
      scoreWidth: '30%' // 默认宽度百分比
    };
  },
  created() {
    this.getRankList();  // 初始化时调用 getRankList 方法获取数据
  },
  methods: {
    setDateRange(timeFrame) {
      this.currentFrame = timeFrame; // 更新当前选中的时间范围
      this.getRankList(); // 重新获取排行数据
    },
    async getRankList() {
      try {
        const response = await fetchCompanyRanking(); // 调用 API 获取数据
        if (response && Array.isArray(response)) {
          // 先使用 slice() 方法限制数据量至最多十个元素，再使用 map() 方法处理每个元素
          this.rankData = response.slice(0, 10).map((item, index) => ({
            ...item,
            companyRanking: index + 1 // 计算排名，从1开始
          }));
          this.rankWidth = '$20%'; // 排名列宽度
          this.groupNameWidth = '$50%'; // 企业名称列宽度
          this.scoreWidth = '$30%'; // 分数列宽度
        } else {
          console.log("No data received from the API");
        }
      } catch (error) {
        console.error("Failed to fetch ranking data:", error);
      }
    },

  }
};



</script>
<style scoped>
:deep(.el-table .el-table__body tr) {
  height: 80px;
  min-height: 80px;
}
.box-card {
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.1);
  background-color: #ffffff;
}

.productStatusTitle {
  margin-top: 20px;
  font-weight: bold;
  text-align: center;
}

.el-table {
  border-radius: 12px;
  margin-top: 20px;
}
.box-card {
  /* ...其他样式保持不变... */
  display: flex; /* 使用 Flexbox 布局 */
  flex-direction: column; /* 子元素垂直排列 */
  align-items: center; /* 水平居中子元素 */
}

.button-group-centered {
  margin-top: 10px; /* 添加一些顶部边距 */
}
.rank-gold {
  color: gold;
  font-size: 30px
  /* 其他样式 */
}

.rank-silver {
  color: silver;
  font-size: 27px
  /* 其他样式 */
}

.rank-bronze {
  color: #cd7f32;
  font-size: 24px
  /* 其他样式 */
}
</style>

