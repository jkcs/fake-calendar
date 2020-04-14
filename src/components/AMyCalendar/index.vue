<template>
  <div class="calender">
    <header class="calender-header">
      <div class="header-title">
        <el-button :disabled="!isBeforeMinDate" size="medium" icon="el-icon-arrow-left" circle plain type="primary" @click="handlePrev"/>
        <span style="padding: 0 10px;">{{ date.getFullYear() + '年' + (date.getMonth() + 1) + '月' }}</span>
        <el-button size="medium" icon="el-icon-arrow-right" circle plain type="primary" @click="handleNext"/>
      </div>
      <div class="header-right">
        <slot name="header"/>
      </div>
    </header>
    <div>
      <date-table
        :date="date"
        :selected-day="selectedDay"
        :first-day-of-week="1"
        :min-date="minDate"
        @pick="pickDay"/>
    </div>
    <div class="calender-bottom">
      <el-checkbox v-model="isSelectCurrentMonth" border>当月全选</el-checkbox>
      <div>
        <slot name="bottom"/>
      </div>
    </div>
  </div>
</template>

<script>
  import DateTable from './date-table'
  import { isSameOrBefore, nextMonth, prevMonth, isSameOrBeforeEndMonth } from '../../utils/dateUtils'
  import { isArrContain } from '@/utils'

  export default {
    components: {
      DateTable
    },
    model: {
      prop: 'selectedDay',
      event: 'change'
    },
    props: {
      selectedDay: {
        type: Array,
        default: () => ([])
      },
      defaultDate: {
        type: Date,
        default: () => new Date()
      },
      minDate: {
        type: Date,
        default: () => new Date()
      }
    },
    data() {
      return {
        innerDate: undefined
      }
    },
    computed: {
      date() {
        const { innerDate, selectedDay, defaultDate } = this
        if (innerDate) {
          return innerDate
        }
        if (selectedDay.length !== 0) {
          const d = selectedDay[selectedDay.length - 1].split('-')
          return new Date(d[0], d[1] - 1, d[2])
        }
        return defaultDate
      },
      monthDay() {
        const y = this.date.getFullYear()
        const m = String(this.date.getMonth() + 1).padStart(2, '0')
        const temp = new Date(y, Number(m), 0)
        return temp.getDate()
      },
      isBeforeMinDate() {
        const { date, minDate } = this
        if (!minDate) return false
        const prevMonthDate = prevMonth(date)
        return isSameOrBeforeEndMonth(minDate, prevMonthDate)
      },
      currMonthDays() {
        const y = this.date.getFullYear()
        const m = String(this.date.getMonth() + 1).padStart(2, '0')

        const result = []
        Array.apply(null, { length: this.monthDay }).forEach((_, index) => {
          const day = String(index + 1).padStart(2, '0')
          const nDate = new Date(y, this.date.getMonth(), day)
          if (isSameOrBefore(this.minDate, nDate)) {
            const str = `${y}-${m}-${day.padStart(2, '0')}`
            result.push(str)
          }
        })
        return result
      },
      isSelectCurrentMonth: {
        get() {
          return isArrContain(this.selectedDay, this.currMonthDays)
        },
        set(val) {
          const { currMonthDays, selectedDay } = this
          let result = []
          if (val) {
            // 数组加入
            result = [...new Set([].concat(selectedDay, currMonthDays))]
          } else {
            // 数组去除
            currMonthDays.forEach(item => {
              const index = selectedDay.indexOf(item)
              if (index !== -1) {
                selectedDay.splice(index, 1)
              }
            })
            result = selectedDay
          }
          this.$emit('change', result)
        }
      }
    },
    methods: {
      pickDay(date, type) {
        const index = this.selectedDay.indexOf(date)
        if (index !== -1) {
          this.selectedDay.splice(index, 1)
        } else {
          this.selectedDay.push(date)
        }
        this.$emit('change', this.selectedDay)
        this.$emit(type, date)
      },
      handlePrev() {
        // prevMonth
        const { date } = this
        this.innerDate = prevMonth(date)
        this.$emit('prev', this.innerDate)
      },
      handleNext() {
        // nextMonth
        const { date } = this
        this.innerDate = nextMonth(date)
        this.$emit('next', this.innerDate)
      },
      resetDateEmpty() {
        this.innerDate = undefined
      }
    }
  }
</script>

<style scoped>
  .calender {
    background-color: #fff;
    font-size: 16px;
  }

  .calender .calender-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    border-bottom: 1px solid #EBEEF5;
    font-size: 16px;
  }

  .calender .calender-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
  }
  .el-button {
    outline: none;
  }
</style>
