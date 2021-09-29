<template>
  <div class="app-container">
    <!-- 功能按钮栏 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.search"
        placeholder="name"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>

      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加类型
      </el-button>

      <!-- 数据列表 -->
      <el-tabs v-model="listQuery.from" @tab-click="handleClick">
        <el-tab-pane label="虎扑" name="hupu"><el-table
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
                @click="saveNews(row)"
              >
                添加收藏
              </el-button>

            </template></el-table-column>
        </el-table></el-tab-pane>
        <el-tab-pane label="搜狐" name="sh"><el-table
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
                @click="saveNews(row)"
              >
                添加收藏
              </el-button>

            </template></el-table-column>
        </el-table></el-tab-pane>
        <el-tab-pane label="nba官网" name="nba-web"><el-table
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
                @click="saveNews(row)"
              >
                添加收藏
              </el-button>

            </template></el-table-column>
        </el-table></el-tab-pane>
      </el-tabs>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.currentPage"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

    </div>

    <!-- 添加和修改界面 -->

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >

        <el-form-item
          label="类型名"
          prop="name"
        >
          <el-input v-model="temp.title" />
        </el-form-item>

        <el-form-item v-if="temp.createdAt" label="时间">
          {{ new Date(temp.createdAt) | parseTime }}
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveType, saveNews, sendEmail, updateModel, deleteModel, crawlerList, crawlerGet } from "@/api/study";
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
        type: 'nba',
        from: 'hupu'
        // keyword: '杜兰特'
      },
      showReviewer: false,
      // 表单提交的数据
      temp: {
        title: "",
        type: "Basic Knowledge"
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      // 验证方法
      rules: {
        title: [
          { required: true, message: "类型必须填写", trigger: "blur" }
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
      crawlerList(this.listQuery).then(response => {
        this.list = response.data.data.list;
        this.total = response.data.data.total;

        this.listLoading = false;
      });
    },
    getNestCrawler() {
      this.listLoading = true;
      crawlerGet({ from: this.listQuery.from }).then(response => {
        if (this.errorInfo(response)) return;
        this.list = []
        this.total = 0
        this.getList()
        this.successInfo();

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
          console.log(this.temp)
          saveType(this.temp).then(res => {
            if (this.errorInfo(res)) return;
            this.list.unshift(res.data.data);
            this.dialogFormVisible = false;
            this.successInfo();
          });
        }
      });
    },
    handleClick(tab, event) {
      this.list = []
      this.getList()
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
