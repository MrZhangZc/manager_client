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
        label="访问时间"
        width="160px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.createdAt) | formatTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="类型"
        min-width="80px"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.type }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作人"
        min-width="80px"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.operator }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作内容"
        min-width="80px"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.addition }}
        </template>
      </el-table-column>

      <el-table-column
        label="接口"
        min-width="100px"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.operate_api }}
        </template>
      </el-table-column>

      <el-table-column
        label="接口参数"
        min-width="100px"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.parameter }}
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
import { fetchCmsLog } from "@/api/log";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "CmsLog",
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
          value: 'postlook',
          label: '文章'
        },
        {
          value: 'catelook',
          label: '类别'
        },
        {
          value: 'homelook',
          label: '首页'
        },
        {
          value: 'messagelook',
          label: '留言板'
        }
      ],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        type: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchCmsLog(this.listQuery).then(response => {
        this.list = response.data.data.list;
        this.total = response.data.data.total;

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
