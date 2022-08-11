<template>
  <div class="app-container">
    <!-- 功能按钮栏 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.search"
        placeholder="类别名"
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
        添加
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
        label="排序"
        min-width="50px"
      >
        <template slot-scope="{row}">
          <span
          >{{ row.rank_num }} </span>
        </template>
      </el-table-column>

     <el-table-column width="180px" align="center" label="icon">
        <template slot-scope="scope">
          <img :src="scope.row.icon" style="width: 150px" alt="" srcset="">
        </template>
      </el-table-column>

     <el-table-column
        label="名称"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <span
          >{{ row.title }} </span>
        </template>
      </el-table-column>

      <el-table-column
        label="标签"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <span
          >{{ row.tag }} </span>
        </template>
      </el-table-column>

      <el-table-column
        label="活动地址"
        min-width="150px"
      >
        <template slot-scope="{row}">
          {{ row.href }}
        </template>
      </el-table-column>

      <el-table-column
        label="结束时间"
        min-width="150px"
      >
        <template slot-scope="{row}">
          {{ row.end_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
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
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>

          <el-button
            v-if="row.state === 0"
            size="mini"
            type="primary"
            icon="el-icon-delete"
            @click="handleUpdateState(row.id)"
          >
            上架
          </el-button> 

          <el-button
            v-if="row.state === 1"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleUpdateState(row.id)"
          >
            下架
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

    <!-- 添加和修改界面 -->

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          label="标题"
          prop="title"
        >
          <el-input v-model="temp.title" />
        </el-form-item>

        <el-form-item
          label="icon"
          prop="icon"
        >
          <el-input type="textarea" autosize="{ minRows: 2, maxRows: 4 }" v-model="temp.icon" />
        </el-form-item>

        <el-form-item
          label="标签"
          prop="tag"
        >
          <el-input v-model="temp.tag" />
        </el-form-item>

        <el-form-item
          label="活动地址"
          prop="href"
        >
          <el-input type="textarea" autosize="{ minRows: 2, maxRows: 4 }" v-model="temp.href" />
        </el-form-item>

        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker v-model="temp.end_time" type="datetime" placeholder="Please pick a date" />
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
import { addBanner, deleteBanner, updateBanner } from "@/api/banner";
import { getDjjlGift, addDjjlGift, updateDjjlGift } from "@/api/djjl";
import { getUTCTime } from '@/utils/date'
import { parseTime } from '@/utils'
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "DjjlGift",
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
        // 查询关键字
        isPaging: true,
        currentPage: 1,
        pageSize: 10,

        search: undefined
      },
      showReviewer: false,
      // 表单提交的数据
      temp: {
        id: undefined,
        title: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getDjjlGift(this.listQuery).then(response => {
        this.list = response.data.data.list;
        this.total = response.data.data.total;

        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.currentPage = 1;
      this.getList();
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        title: "",
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
          addDjjlGift(this.temp).then(res => {
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
          console.log(1111, tempData)
          updateDjjlGift(tempData.id, { name: tempData.name, abbreviation: tempData.abbreviation }).then(res => {
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
    handleUpdateState(id, type) {
      this.$confirm(`${type === 'up' ? '确定上架' : '确定下架'}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteBanner(id).then(res => {
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
        title: "成功",
        message: "信息操作成功",
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
