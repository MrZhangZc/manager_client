<template>
  <div class="app-container">
    <!-- 功能按钮栏 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.emailTo"
        placeholder="邮箱"
        style="width: 200px;"
        class="filter-item"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-s-promotion"
        @click="handleSend"
      >
        立即发送
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
        label="发布时间"
        width="160px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.createdAt) | formatTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="发送到"
        min-width="150px"
      >
        <template slot-scope="{row}">
          {{ row.to }}
        </template>
      </el-table-column>

      <el-table-column
        label="结果"
        min-width="150px"
      >
        <template slot-scope="{row}">
          {{ row.result ? '成功' : '失败' }}
        </template>
      </el-table-column>

      <el-table-column
        label="急转弯问题"
        min-width="150px"
      >
        <template slot-scope="{row}">
          {{ row.quest }}
        </template>
      </el-table-column>

      <el-table-column
        label="急转弯答案"
        min-width="150px"
      >
        <template slot-scope="{row}">
          {{ row.questres }}
        </template>
      </el-table-column>

      <!-- <el-table-column
        label="响应结果"
        min-width="150px"
      >
        <template slot-scope="{row}">
          {{ row.response }}
        </template>
      </el-table-column> -->
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
import { fetchEmail, sendEmail, addModel, updateModel, deleteModel } from "@/api/task";
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

        search: undefined
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
      fetchEmail(this.listQuery).then(response => {
        this.list = response.data.data.list;
        this.total = response.data.data.total;

        this.listLoading = false;
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
          deleteModel(id).then(res => {
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
    successInfo() {
      this.$notify({
        message: "邮件发送成功",
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
