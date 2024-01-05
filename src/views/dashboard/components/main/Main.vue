<template>
    <el-row :gutter="10" style="height:60%">
        <el-col :span="6">
            <dv-border-box-12 class="pd">
                <LeftTop/>
            </dv-border-box-12>
        </el-col>
        <el-col :span="18">
            <RelationGraph/>
        </el-col>
    </el-row>
    <el-row :gutter="10" style="height:40%">
        <el-col :span="8">
            <dv-border-box-8 class="pd">
                <IncomeGraph></IncomeGraph>
            </dv-border-box-8>
        </el-col>
        <el-col :span="8">
            <dv-border-box-12 class="pd">
                <BottomCenter/>
            </dv-border-box-12>
        </el-col>
        <el-col :span="8">
            <dv-border-box-8 class="pd">
                <BottomRight/>
            </dv-border-box-8>
        </el-col>
    </el-row>
</template>

<script setup>
import LeftTop from "../leftTop/LeftTop.vue";
import BottomCenter from "../bottomCenter/BottomCenter.vue";
import BottomRight from "../bottomRight/BottomRight.vue";
import RelationGraph from "../multilayer/RelationGraph.vue";
import IncomeGraph from "../bottomLeft/IncomeGraph.vue";
</script>

<style scoped>
.pd{
    padding: 10px;
}
</style>