<template>
  <div class="main-container">
    <h4>基于element calendar 魔改的日期多选组件</h4>
    <el-form>
      <el-form-item label="最小时间">
        <el-date-picker
          v-model="minDate"
          type="date"
          placeholder="选择日期"/>
      </el-form-item>
    </el-form>
    <a-my-calendar
      v-model="selectDay"
      :min-date="minDate"
      :default-date="defaultDate"
      @prev="handlePrev"
      @next="handleNext"
    />
    <p>当前选中：{{ selectDay }}</p>
  </div>
</template>

<script>
  import AMyCalendar from '@/components/AMyCalendar'
  export default {
    components: { AMyCalendar },
    data() {
      return {
        selectDay: [],
        minDate: new Date(),
        // 初始默认时间
        defaultDate: new Date()
      }
    },
    methods: {
      handlePrev(t) {
        this.$message.success('prev month ' + t.toLocaleString())
      },
      handleNext(t) {
        this.$message.success('next month ' + t.toLocaleString())
      }
    }
  }
</script>

<style scoped>
  .main-container {
    padding: 20px 40px;
  }
</style>
