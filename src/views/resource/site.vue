<template>
  <div class="app-container">
    <!-- 功能按钮栏 -->
    <div class="filter-container">
      <el-select v-model="listQuery.type" clearable="" placeholder="请选择" @change="handleFilter">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

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
      <el-table-column width="60px" align="center" label="icon">
        <template slot-scope="scope">
          <img :src="'https://file.lihailezzc.com/' + scope.row.icon +'?imageView2/1/w/40/h/40'" style="border-radius:50%" alt="" srcset="">
        </template>
      </el-table-column>

      <el-table-column
        label="类型"
        min-width="60px"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.type }}
        </template>
      </el-table-column>

      <el-table-column
        label="描述"
        min-width="160px"
        align="center"
      >
        <template slot-scope="{row}">
          <a :href="row.path" target="_blank" @click="jump(row.path)">{{ row.desc }}</a>
        </template>
      </el-table-column>

      <el-table-column
        label="网址"
        min-width="150px"
        align="center"
      >
        <template slot-scope="{row}">
          <a :href="row.path" target="_blank" @click="jump(row.path)">{{ row.path }}</a>
          <!-- {{ row.path }} -->
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
        width="260"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <!-- <el-button
            type="success"
            size="mini"
            icon="el-icon-check"
            @click="handleFinish(row.id)"
          >
            完成
          </el-button> -->
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
          label="类型"
          prop="type"
        >
          <el-input
            v-model="temp.type"
            placeholder="网站类型"
            style="width: 200px;"
            class="filter-item"
          />
        </el-form-item>

        <el-form-item
          label="网址"
          prop="path"
        >
          <el-input
            v-model="temp.path"
            placeholder="网址"
            class="filter-item"
          />
        </el-form-item>

        <el-form-item
          label="描述"
          prop="desc"
        >
          <el-input
            v-model="temp.desc"
            type="textarea"
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

        <el-form-item
          label="图标"
          prop="icon"
        >
          <el-input
            v-model="temp.icon"
            placeholder="图标"
            class="filter-item"
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
import { addSite, fetchSite, getSiteType, updateSite, deleteSite } from "@/api/rescoure";
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
      options: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        // 查询关键字
        isPaging: true,
        start: 1,
        length: 20,
        search: undefined
      },
      showReviewer: false,
      // 表单提交的数据
      temp: {
        type: "",
        desc: ""
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
        path: [
          { required: true, message: "网址必须填写", trigger: "blur" }
        ],
        desc: [
          { required: true, message: "描述必须填写", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getSiteTypes()
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchSite(this.listQuery).then(response => {
        this.list = response.data.data.list;
        this.total = response.data.data.total;

        this.listLoading = false;
      });
    },
    getSiteTypes() {
      this.listLoading = true;
      getSiteType().then(response => {
        this.options = response.data.data.map(item => ({
          value: item.type,
          lable: item.type
        }))

        this.listLoading = false;
      });
    },
    jump(href) {
      window.open(href, '_blank')
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
          addSite(this.temp).then(res => {
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
          updateSite(tempData.id, tempData).then(res => {
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
          deleteSite(id).then(res => {
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
