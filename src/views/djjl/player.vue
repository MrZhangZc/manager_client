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
      <el-table-column width="180px" align="center" label="照片">
        <template slot-scope="scope">
          <img :src="'https://file.lihailezzc.com/' + scope.row.photo" style="width: 150px" alt="" srcset="">
        </template>
      </el-table-column>

      <el-table-column
        label="名称"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <span
            class="link-type"
          >{{ row.team }}-{{ row.place }}-{{ row.name }}-{{ row.point }}分 </span>
        </template>
      </el-table-column>

      <el-table-column
        label="年限"
        min-width="150px"
      >
        <template slot-scope="{row}">
          {{ row.year_name }}
        </template>
      </el-table-column>

      <el-table-column
        label="品质"
        min-width="150px"
      >
        <template slot-scope="{row}">
          {{ row.quality === 1 ? 'SSR' :row.quality === 2 ? 'SR' : 'R' }}
        </template>
      </el-table-column>

      <el-table-column
        label="熟练英雄"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <div v-for="item in row.hero_info" :key="item.id">
            <img :src="'https://file.lihailezzc.com/' +item.icon" :style="{height:50,width:50}">
            <span>{{ item.name }}</span>
          </div>
          <!-- {{ row.quality === 1 ? 'SSR' :row.quality === 2 ? 'SR' : 'R' }} -->
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
          <!--
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(row.id)"
          >
            删除
          </el-button> -->
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
          label="描述"
          prop="desc"
        >
          <el-input v-model="temp.desc" />
        </el-form-item>

        <el-form-item
          label="图片地址"
          prop="pic_path"
        >
          <el-input v-model="temp.pic_path" />
        </el-form-item>

        <el-form-item
          label="文章地址"
          prop="post_path"
        >
          <el-input v-model="temp.post_path" />
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
import { addBanner, deleteBanner, updateBanner } from "@/api/banner";
import { getPlayer } from "@/api/djjl";
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
        desc: "",
        pic_path: "",
        post_path: ""
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
      getPlayer(this.listQuery).then(response => {
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
        desc: "",
        pic_path: "",
        post_path: ""
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
          addBanner(this.temp).then(res => {
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

          updateBanner(tempData.id, { name: tempData.name, abbreviation: tempData.abbreviation }).then(res => {
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
