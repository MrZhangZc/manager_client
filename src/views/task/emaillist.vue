<template>
  <div class="app-container">
    <!-- 功能按钮栏 -->
    <div class="filter-container">
      <!-- <el-select v-model="listQuery.type" clearable="" placeholder="请选择" @change="handleFilter">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select> -->

      <el-switch
        v-model="listQuery.showAllRemind"
        style="margin-left: 10px"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="显示全部"
        @change="handleFilter"
      />

      <el-button
        class="filter-item"
        style="margin-left: 10px;margin-top:10px"
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
        label="提醒时间"
        min-width="150px"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="row.remind_time">{{ new Date(row.remind_time) | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>

      <el-table-column
        label="描述"
        min-width="150px"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.desc }}
        </template>
      </el-table-column>

      <el-table-column
        label="附加信息"
        min-width="150px"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.addition }}
        </template>
      </el-table-column>

      <el-table-column
        label="提醒人"
        min-width="150px"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.remind_to || '无' }}
        </template>
      </el-table-column>

      <el-table-column
        label="是否已提醒"
        min-width="150px"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.remind_out ? '是' : '否' }}
        </template>
      </el-table-column>

      <el-table-column
        label="创建时间"
        width="160px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ new Date(row.createdAt) | formatTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="280"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-position"
            @click="handleRemind(row.id)"
          >
            立即提醒
          </el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit-outline"
            @click="handleUpdate(row)"
          >
            编辑
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
      :page.sync="listQuery.start"
      :limit.sync="listQuery.length"
      @pagination="getList"
    />

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
          label="描述"
          prop="desc"
        >
          <el-input
            v-model="temp.desc"
            type="textarea"
          />
        </el-form-item>

        <el-form-item label="提醒时间" prop="remind_time">
          <el-date-picker
            v-model="temp.remind_time"
            type="datetime"
            placeholder="选择提醒时间"
          />
        </el-form-item>

        <el-form-item label="提醒人" prop="remind_to">
          <el-input
            v-model="temp.remind_to"
          />
        </el-form-item>

        <el-form-item
          label="附加信息"
          prop="addition"
        >
          <el-input
            v-model="temp.addition"
            type="textarea"
          />
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
import { fetchNote, remindNote, finishNote, addNote, updateNote, deleteNote } from "@/api/task";
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
      options: [
        {
          value: 'note',
          label: '记录'
        },
        {
          value: 'remind',
          label: '提醒'
        }
      ],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        // 查询关键字
        isPaging: true,
        start: 1,
        length: 20,
        type: 'remind',
        search: undefined
      },
      showReviewer: false,
      // 表单提交的数据
      temp: {
        desc: ''
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      // 验证方法
      rules: {
        type: [
          { required: true, message: "类型必须填写", trigger: "blur" }
        ],
        desc: [
          { required: true, message: "描述必须填写", trigger: "blur" }
        ],
        remind_time: [
          { required: true, message: "提醒时间必须填写", trigger: "blur" }
        ],
        remind_to: [
          { required: true, message: "提醒人必须填写", trigger: "blur" }
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
      fetchNote(this.listQuery).then(response => {
        this.list = response.data.data.list;
        this.total = response.data.data.total;

        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.start = 1;
      this.getList();
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
          addNote(Object.assign(this.temp, { type: 'remind' })).then(res => {
            console.log(this.temp)
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
          updateNote(tempData.id, tempData).then(res => {
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
          deleteNote(id).then(res => {
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
    handleFinish(id) {
      this.$confirm("确定完成？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        finishNote(id).then(res => {
          if (this.errorInfo(res)) return;
          this.getList()
          this.successInfo();
        });
      })
    },
    handleRemind(id) {
      this.$confirm("确定立即提醒？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        remindNote(id).then(res => {
          if (this.errorInfo(res)) return;
          this.getList()
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
