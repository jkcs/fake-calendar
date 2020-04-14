<template>
  <table class="my-calendar-table" cellspacing="0" cellpadding="0">
    <thead>
      <th v-for="day in weekDays" :key="day">{{ day }}</th>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <td
          v-for="(cell, cIndex) in row"
          :key="cIndex"
          :class="{ 'is-selected':cell.isSelected, [cell.type]: true }"
          @click="pickDay(cell)">
          <div :class="['my-calendar-day', cell.isDisabled ? 'is-disabled': '' ]">
            <p :class="{ 'is-selected': cell.isSelected, }">
              {{ cell.text }} {{ cell.isSelected ? '✔️' : '' }}
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import {
    range as rangeArr,
    getFirstDayOfMonth,
    getPrevMonthLastDays,
    getMonthDays,
    formatDate,
    isBefore,
    modifyDateByDay,
    prevMonth,
    nextMonth
  } from '../../utils/dateUtils'

  export default {
    props: {
      selectedDay: [String, Array], // date yyyy-MM-dd
      date: Date,
      hideHeader: Boolean,
      firstDayOfWeek: Number,
      minDate: {
        type: Date
      }
    },

    data() {
      return {
        WEEK_DAYS: ['日', '一', '二', '三', '四', '五', '六']
      }
    },

    computed: {
      prevMonthDatePrefix() {
        const temp = new Date(this.date.getTime())
        temp.setDate(0)
        return formatDate(temp, 'YYYY-MM')
      },

      curMonthDatePrefix() {
        return formatDate(this.date, 'YYYY-MM')
      },

      nextMonthDatePrefix() {
        const temp = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1)
        return formatDate(temp, 'YYYY-MM')
      },

      rows() {
        let days = []
        const date = this.date
        let firstDay = getFirstDayOfMonth(date)
        firstDay = firstDay === 0 ? 7 : firstDay
        const firstDayOfWeek = typeof this.firstDayOfWeek === 'number' ? this.firstDayOfWeek : 1
        const prevMonthDays = getPrevMonthLastDays(date, firstDay - firstDayOfWeek).map(day => ({
          text: day,
          type: 'prev',
          isSelected: this.hasDate(this.getFormateDate(day, 'prev')),
          isDisabled: this.generateDisable(modifyDateByDay(prevMonth(date), day))
        }))
        const currentMonthDays = getMonthDays(date).map(day => ({
          text: day,
          type: 'current',
          isSelected: this.hasDate(this.getFormateDate(day, 'current')),
          isDisabled: this.generateDisable(modifyDateByDay(date, day))
        }))
        days = [...prevMonthDays, ...currentMonthDays]
        const nextMonthDays = rangeArr(42 - days.length).map((_, index) => ({
          text: index + 1,
          type: 'next',
          isSelected: this.hasDate(this.getFormateDate(index + 1, 'next')),
          isDisabled: this.generateDisable(modifyDateByDay(nextMonth(date), index + 1))
        }))
        days = days.concat(nextMonthDays)
        return this.toNestedArr(days)
      },

      weekDays() {
        const start = this.firstDayOfWeek
        const { WEEK_DAYS } = this

        if (typeof start !== 'number' || start === 0) {
          return WEEK_DAYS.slice()
        } else {
          return WEEK_DAYS.slice(start).concat(WEEK_DAYS.slice(0, start))
        }
      }
    },

    methods: {
      toNestedArr(days) {
        return rangeArr(days.length / 7).map((_, index) => {
          const start = index * 7
          return days.slice(start, start + 7)
        })
      },

      getFormateDate(day, type) {
        if (!day || ['prev', 'current', 'next'].indexOf(type) === -1) {
          throw new Error('invalid day or type')
        }
        let prefix = this.curMonthDatePrefix
        if (type === 'prev') {
          prefix = this.prevMonthDatePrefix
        } else if (type === 'next') {
          prefix = this.nextMonthDatePrefix
        }
        day = `00${day}`.slice(-2)
        return `${prefix}-${day}`
      },

      hasDate(date) {
        return this.selectedDay.indexOf(date) !== -1
      },

      pickDay({ text, type, isDisabled }) {
        if (isDisabled) return
        const date = this.getFormateDate(text, type)
        this.$emit('pick', date, type)
      },

      generateDisable(date) {
        const { minDate } = this
        if (!minDate) return false
        return isBefore(date, minDate)
      }
    }
  }
</script>
<style>
  .is-selected {
    color: #1989fa;
  }

  .my-calendar-table {
    table-layout: fixed;
    width: 100%;
    font-size: 16px;
  }

  .my-calendar-table thead th {
    padding: 12px 0;
    color: #606266;
    font-weight: normal;
  }

  .my-calendar-table thead th:not(.is-range), td.prev, td.next {
    color: #C0C4CC;
  }

  .my-calendar-table td {
    border-bottom: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
    vertical-align: top;
    transition: background-color 0.2s ease;
  }

  .my-calendar-table td.is-selected {
    background-color: #F2F8FE;
  }

  .my-calendar-table td.is-today {
    color: #409EFF;
  }

  .my-calendar-table tr:first-child td {
    border-top: 1px solid #EBEEF5;
  }

  .my-calendar-table tr td:first-child {
    border-left: 1px solid #EBEEF5;
  }

  .my-calendar-table tr.el-calendar-table__row--hide-border td {
    border-top: none;
  }

  .my-calendar-day {
    box-sizing: border-box;
    padding: 8px;
    height: 85px;
  }

  .my-calendar-day:hover {
    cursor: pointer;
    background-color: #F2F8FE;
  }
  .is-disabled {
    cursor: not-allowed !important;
  }
</style>
