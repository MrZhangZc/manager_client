<template>
  <div class="app-container">
    <!-- 功能按钮栏 -->
    <div class="filter-container">
      <el-select v-model="year" clearable="" placeholder="请选择" @change="handleFilter">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-select v-model="month" clearable="" placeholder="请选择" @change="handleFilter">
        <el-option
          v-for="item in optionsMonth"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-s-tools"
        style="margin-top:10px"
        @click="getMonthDay(year, month)"
      >
        配置
      </el-button>

      <el-button
        class="filter-item"
        style="margin-left: 10px;margin-top:10px"
        type="primary"
        icon="el-icon-edit"
        @click="createData"
      >
        确定
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
        label="日"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <span>{{ row.day }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="周几"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <span>{{ row.week }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="值日人"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <el-select v-model="row.duty_user_id" clearable="" placeholder="请选择" @change="handleFilter">
            <el-option
              v-for="item in dauyIdOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column
        label="监督人"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <el-select v-model="row.check_user_id" clearable="" placeholder="请选择" @change="handleFilter">
            <el-option
              v-for="item in dauyIdOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>

      <!-- <el-table-column
        label="第一次登陆"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <span>{{ row.userRecentlyLogin }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="权限"
        min-width="150px"
      >
        <template slot-scope="{row}">
          {{ row.role.name }}
        </template>
      </el-table-column>

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
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(row._id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

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
          label="账号"
          prop="account"
        >
          <el-input v-model="temp.account" />
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="temp.password" />
        </el-form-item>

        <el-form-item
          label="权限"
          prop="access"
        >
          <el-input v-model="temp.access" />
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
import { updateModel, deleteModel } from "@/api/user";
import { addDuty, clockinUsers, getMonthDutyExits } from '@/api/clockin'
import waves from "@/directive/waves"; // waves directive
export default {
  name: "User",
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
          value: 2021,
          label: '2021年'
        },
        {
          value: 2022,
          label: '2021年'
        }
      ],
      optionsMonth: [
        {
          value: 1,
          label: '1月'
        },
        {
          value: 2,
          label: '2月'
        },
        {
          value: 3,
          label: '3月'
        },
        {
          value: 4,
          label: '4月'
        },
        {
          value: 5,
          label: '5月'
        },
        {
          value: 6,
          label: '6月'
        },
        {
          value: 7,
          label: '7月'
        },
        {
          value: 8,
          label: '8月'
        },
        {
          value: 9,
          label: '9月'
        },
        {
          value: 10,
          label: '10月'
        },
        {
          value: 11,
          label: '11月'
        },
        {
          value: 12,
          label: '12月'
        }
      ],
      dauyIdOptions: [
      ],
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      tableKey: 0,
      list: [
      ],
      total: 0,
      listLoading: true,
      listQuery: {
        // 查询关键字
        isPaging: true,
        currentPage: 1,
        pageSize: 20,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
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
    this.getClockinUsers();
  },
  methods: {
    getClockinUsers() {
      this.listLoading = true;
      clockinUsers().then(response => {
        this.dauyIdOptions = response.data.data.map(item => ({
          value: item.id,
          label: item.account
        }))

        this.listLoading = false;
      });
    },
    async getMonthDay(year, month) {
      const res = await getMonthDutyExits({ year, month })
      if (+res.data.data > 0) {
        this.$notify({
          title: "无法再次配置",
          message: `${year}年${month}月值日表已配置`,
          type: "error",
          duration: 2000
        });
        return
      }
      this.list = []
      const days = new Date(year, month, 0).getDate()
      const week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]

      for (let i = 1; i <= days; i++) {
        const data = new Date(`${year}-${month}-${i}`);
        const day = data.getDay()
        this.list.push({
          year,
          month,
          day: i,
          week: week[day]
        })
      }
      return days
    },
    handleFilter() {
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
      this.list.forEach(item => {
        const user = this.dauyIdOptions.find(i => i.value === item.duty_user_id)
        const checkuser = this.dauyIdOptions.find(i => i.value === item.check_user_id)
        item.duty_user = user.label
        item.check_user = checkuser.label
        item.date = `${item.year}-${item.month}-${item.day}`
      })
      addDuty(this.list).then(res => {
        // if (this.errorInfo(res)) return;
        // this.list.unshift(res.data.data);
        // this.dialogFormVisible = false;
        // this.successInfo();
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

          updateModel(tempData._id, tempData).then(res => {
            if (this.errorInfo(res)) return;
            for (const v of this.list) {
              if (v._id === tempData._id) {
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
              if (v._id === id) {
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
      if (res.data && res.data.code !== 0) {
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
