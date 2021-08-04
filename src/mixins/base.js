export default {
  data() {
    return {
      rollTable: null,
      rollTimer: null,
      step: 6 // 滚动速度
    }
  },
  methods: {
    // 获取滚动窗口
    getRollTable() {
      if (!this.rollTable) {
        this.rollTable = document.getElementsByClassName('el-table__body-wrapper')[0]
      }
    },
    // 加速滚动
    speedup() {
      this.step = this.step * 2
    },
    // 左滚动
    leftroll() {
      clearInterval(this.rollTimer)
      this.getRollTable()
      this.rollTimer = setInterval(() => {
        this.rollTable.scrollLeft -= this.step
      }, 20)
    },
    // 右滚动
    rightroll() {
      clearInterval(this.rollTimer)
      this.getRollTable()
      this.rollTimer = setInterval(() => {
        this.rollTable.scrollLeft += this.step
      }, 20)
    },
    // 停止滚动
    stoproll() {
      this.step = 6
      clearInterval(this.rollTimer)
    },
    successInfo() {
      this.$notify({
        title: '成功',
        message: '信息保存成功',
        type: 'success',
        duration: 2000
      })
    },
    errorInfo(res) {
      if (res.data && res.state === 200) {
        return true
      } else {
        return false
      }
    }

    // 小数点后最多保留两位小数
    // maxTwoDecima(e, num) {
    //   debugger
    //   const len = e.split(".")[1] ? e.split(".")[1].length : 0
    //   if (len > 2) {
    //     num = Math.floor(e * 100) / 100
    //   }
    // }
  }
}
