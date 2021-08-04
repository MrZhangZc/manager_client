export default {
  data: function() {
    return {
      listQuery: {
        // 查询关键字
        isPaging: true,
        currentPage: 1,
        pageSize: this.$store.state.app.pageSize,
        search: this.val || null
      }
    }
  },
  watch: {
    'listQuery.pageSize': {
      deep: true,
      handler(v) {
        // console.log('mixins pagesize ',v);
        this.$store.commit('app/PAGESIZE', v)
      }
    }
  }
}
