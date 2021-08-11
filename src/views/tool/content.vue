<template>
  <div class="app-container">
    <!-- 功能按钮栏 -->
    <div class="filter-container">
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-select v-if="value === 'story'" v-model="type" placeholder="请选择">
        <el-option
          v-for="item in storyOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-select v-if="value === 'news'" v-model="newsType" placeholder="请选择">
        <el-option
          v-for="item in newsOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-input
        v-if="value === 'story' || value === 'news'"
        v-model="word"
        placeholder="关键字"
        style="width: 200px;margin-top:10px"
        class="filter-item"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-top:10px"
        @click="handleFilter"
      >
        搜索
      </el-button>

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        style="margin-top:10px"
        @click="handlePage"
      >
        第一页
      </el-button>
    </div>

    <el-card v-if="value === 'story'" class="box-card">
      <h2>{{ title }}</h2>
      <p>{{ content }}</p>
    </el-card>

    <el-table
      v-if="value === 'news'"
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
          <p @click="jump(row.url)"> {{ row.title }} </p>
        </template>
      </el-table-column>

      <el-table-column
        label="来源"
      >
        <template slot-scope="{row}">
          {{ row.source }}
        </template>
      </el-table-column>

      <el-table-column
        label="添加时间"
        width="160px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.ctime) | formatTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
import { fetchContent, addModel, updateModel, deleteModel } from "@/api/tool";
import waves from "@/directive/waves"; // waves directive
// import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "User",
  // components: { Pagination },
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
      options: [{
        value: 'news',
        label: '新闻'
      }, {
        value: 'story',
        label: '故事'
      }],
      storyOptions: [{
        value: 1,
        label: '成语'
      }, {
        value: 2,
        label: '睡前'
      }, {
        value: 3,
        label: '童话'
      }, {
        value: 4,
        label: '寓言'
      }],
      newsOptions: [
        {
          value: 'topnews',
          label: '今日热点'
        },
        {
          value: 'it',
          label: 'IT'
        },
        {
          value: 'nba',
          label: 'NBA'
        },
        {
          value: 'video',
          label: '影视'
        }
      ],
      value: '',
      newsType: '',
      type: '',
      word: '',
      page: 1,
      title: '',
      content: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
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
  // created() {
  //   this.getList();
  // },
  methods: {
    getList() {
      this.listLoading = true;
      fetchContent({ value: this.value, type: this.type || this.newsType, word: this.word, page: ++this.page }).then(response => {
        if (this.value === 'story') {
          this.content = response.data.data.content
          this.title = response.data.data.title
        }
        if (this.value === 'news') {
          this.list = response.data.data
        }

        this.listLoading = false;
      });
    },
    jump(href) {
      window.open('https:' + href, '_blank')
    },
    handlePage() {
      this.page = 0
      this.getList();
    },
    handleFilter() {
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
.box-card{
  h2{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  p{
    color: #303133;
    line-height: 1.5em;
    letter-spacing: 2px;
  }
}
</style>
