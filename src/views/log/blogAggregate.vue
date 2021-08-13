<template>
  <div class="app-container">
    <!-- 功能按钮栏 -->
    <div class="filter-container">
      <el-select v-model="listQuery.type" clearable="" placeholder="请选择" @change="getList">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-date-picker
        v-model="listQuery.timeRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="getList"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        style="margin-left:10px;margin-top:10px"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
    </div>
    <!-- 数据列表 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        :label="listQuery.type"
        min-width="200px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row._id || '无' }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="数量"
        min-width="150px"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.content_sum }}
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { fetchBlogGroup } from "@/api/log";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "BlogLog",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: "success",
        false: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      typeMap: new Map([
        ['catelook', '类别查看'],
        ['homelook', '首页查看'],
        ['postlook', '文章查看'],
        ['messagelook', '留言板查看']
      ]),
      options: [
        {
          value: 'day',
          label: '时间'
        },
        {
          value: 'category',
          label: '类别'
        },
        {
          value: 'article',
          label: '文章'
        }
      ],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        type: 'article'
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchBlogGroup(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.data.length;

        this.listLoading = false;
      });
    },
    getType(type) {
      return this.typeMap.get(type)
    },
    getContent(data) {
      let res = ''
      if (data.type === 'catelook') res = data.category
      if (data.type === 'homelook') res = '/'
      if (data.type === 'postlook') res = data.article
      if (data.type === 'messagelook') res = '留言板'
      return res
    },
    handleFilter() {
      this.getList()
    },
    successInfo() {
      this.$notify({
        message: "获取成功",
        type: "success",
        duration: 2000
      });
    },
    errorInfo(res) {
      if (res.data && res.state === 200) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
