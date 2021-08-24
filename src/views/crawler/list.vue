<template>
  <div class="app-container">
    <!-- 功能按钮栏 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="keyword"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="getList"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getList"
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
        label="标题"
        min-width="150px"
      >
        <template slot-scope="{row}">
          {{ row.title }}
        </template>
      </el-table-column>

      <el-table-column
        label="链接"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <el-button :href="row.href" target="_blank" @click="jump(row.href)"> {{ row.href }} </el-button>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="快照">
        <template slot-scope="scope">
          <img v-if="scope.row.screen_shot" :src="'https://file.lihailezzc.com/' + scope.row.screen_shot[0]" style="width: 150px" alt="" srcset="">
        </template>
      </el-table-column>

      <el-table-column
        label="添加时间"
        width="160px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.createdAt) | formatTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Actions"
        align="center"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit-outline"
            @click="handleScreenShot(row.href, row.id)"
          >
            快照
          </el-button>

          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(row.id)"
          >
            删除
          </el-button>
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
import { fetchNews, deleteNews, saveNews, sendEmail, addModel, updateModel, screenShot } from "@/api/crawler";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "User",
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 20,

        type: undefined
      },
      showReviewer: false,
      // 表单提交的数据
      temp: {
        id: undefined,
        name: "",
        access: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      // 验证方法
      rules: {
        name: [
          { required: true, message: "名称必须填写", trigger: "blur" }
        ],
        access: [
          { required: true, message: "权限必须填写", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchNews(this.listQuery).then(response => {
        this.list = response.data.data.list;
        this.total = response.data.data.total;

        this.listLoading = false;
      });
    },
    jump(href) {
      window.open(href, '_blank')
    },
    saveNews(data) {
      saveNews(Object.assign(data, { type: 'nba' })).then(response => {
        if (this.errorInfo(response)) return;
        this.successInfo();
      });
    },
    handleFilter() {
      sendEmail(this.listQuery).then(response => {
        console.log(response)
      });
    },
    handleSend() {
      sendEmail(this.listQuery).then(response => {
        if (this.errorInfo(response)) return;
        this.successInfo();
      });
    },

    resetTemp() {
      this.temp = {
      };
    },
    // 弹起添加界面
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 添加方法
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addModel(this.temp).then(res => {
            if (this.errorInfo(res)) return;
            this.list.unshift(res.data.data);
            this.dialogFormVisible = false;
            this.successInfo();
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj

      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);

          updateModel(tempData.id, tempData).then(res => {
            if (this.errorInfo(res)) return;
            for (const v of this.list) {
              if (v.id === tempData.id) {
                this.list.splice(this.list.indexOf(v), 1, tempData);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.successInfo();
          });
        }
      });
    },
    handleDelete(id) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteNews(id).then(res => {
            if (this.errorInfo(res)) return;
            for (const v of this.list) {
              if (v.id === id) {
                this.list.splice(this.list.indexOf(v), 1);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.successInfo();
          });
        })
    },
    handleScreenShot(href, id) {
      screenShot({ href, id }).then(response => {
        if (this.errorInfo(response)) return;
        this.successInfo();
      });
    },
    successInfo() {
      this.$notify({
        message: "成功",
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
