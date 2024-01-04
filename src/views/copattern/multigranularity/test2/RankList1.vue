<template>
  <el-col>
    <div class="box-card">
      <h3 class="productStatusTitle">企业群评分排行榜</h3>
      <el-button-group class="button-group-centered">
        <el-button @click="setDateRange('MONTH')">本月</el-button>
        <el-button @click="setDateRange('HALF_YEAR')">半年</el-button>
        <el-button @click="setDateRange('year')">一年</el-button>
      </el-button-group>
      <el-table :data="rankData" class="el-table" stripe>
        <el-table-column type="index" label="排名"   width="120px" align="center"> <template #default="{ row }">
          <span v-if="row.ranking === 1" class="rank-gold">🥇</span>
          <span v-else-if="row.ranking === 2" class="rank-silver">🥈</span>
          <span v-else-if="row.ranking === 3" class="rank-bronze">🥉</span>
          <span v-else>{{ row.ranking }}</span>
        </template></el-table-column>
        <el-table-column prop="groupName" label="企业群名称" width="150px" align="center"></el-table-column>
        <el-table-column prop="score" label="分数"  align="center"></el-table-column>

      </el-table>
    </div>
  </el-col>
</template>

<script>
import { fetchGroupRanking } from "@/api/multigranularity/datashow"; // 确保这个路径与您的项目结构匹配

export default {
  data() {
    return {
      currentFrame: 'MONTH', // 添加这一行
      rankData: []
    };
  },
  created() {
    this.getRankList();  // 调用 getRankList 方法
  },
  methods: {
    setDateRange(timeFrame) {
      this.currentFrame = timeFrame; // 更新当前选中的时间范围
      this.getRankList(); // 重新获取排行数据
    },
    async getRankList() {
      // 这里的API调用需要根据currentFrame来获取对应时间范围的数据
      try {
        const response = await fetchGroupRanking({ timeFrame: this.currentFrame });
        this.rankData = response.filter(item => item.timeFrame === this.currentFrame);
      } catch (error) {
        console.error('Error fetching group ranking data:', error);
      }
    },
    //

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
/* RankList1.vue 或 RankList2.vue 样式 */
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

