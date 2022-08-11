<template>
  <div class="app-container">
    <!-- 功能按钮栏 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.search"
        placeholder="选手昵称"
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
        label="技能"
        width="150px"
      >
        <template slot-scope="{row}">
          <div :style="{display:'flex', flexDirection: 'row', width:'450px'}">
            <div v-for="item in row.skill_info" :key="item.id" :style="{display:'flex', flexDirection: 'column', flexWrap: 'wrap', width:'50px'}">
              <img :src="'https://file.lihailezzc.com/' +item.icon" :style="{height:50,width:50}">
              <span>{{ item.name }}</span>
            </div>
          </div>
          <!-- {{ row.quality === 1 ? 'SSR' :row.quality === 2 ? 'SR' : 'R' }} -->
        </template>
      </el-table-column>

      <el-table-column
        label="招牌英雄"
        width="150px"
      >
        <template slot-scope="{row}">
          <div :style="{display:'flex', flexDirection: 'row', width:'450px'}">
            <div v-for="item in row.sign_hero_info" :key="item.id" :style="{display:'flex', flexDirection: 'column', flexWrap: 'wrap', width:'50px'}">
              <img :src="'https://file.lihailezzc.com/' +item.icon" :style="{height:50,width:50}">
              <span>{{ item.name }}</span>
            </div>
          </div>
          <!-- {{ row.quality === 1 ? 'SSR' :row.quality === 2 ? 'SR' : 'R' }} -->
        </template>
      </el-table-column>

      <el-table-column
        label="熟练英雄"
        width="300px"
      >
        <template slot-scope="{row}">
          <div :style="{display:'flex', flexDirection: 'row', width:'450px'}">
            <div v-for="item in row.hero_info" :key="item.id" :style="{display:'flex', flexDirection: 'column', flexWrap: 'wrap', width:'50px'}">
              <img :src="'https://file.lihailezzc.com/' +item.icon" :style="{height:50,width:50}">
              <span>{{ item.name }}</span>
            </div>
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
          label="选手id"
          prop="name"
        >
          <el-input v-model="temp.name" />
        </el-form-item>

        <el-form-item
          label="赛季"
          prop="year_name"
        >
          <el-input v-model="temp.year_name" />
        </el-form-item>

        <el-form-item
          label="品质"
          prop="quality"
        >
          <el-input v-model="temp.quality" />
        </el-form-item>

        <el-form-item
          label="战队"
          prop="team"
        >
          <el-input v-model="temp.team" />
        </el-form-item>

        <el-form-item
          label="评分"
          prop="point"
        >
          <el-input v-model="temp.point" />
        </el-form-item>

        <el-form-item
          label="照片"
          prop="photo"
        >
          <el-input v-model="temp.photo" />
        </el-form-item>

        <el-form-item
          label="位置"
          prop="place"
        >
          <el-input v-model="temp.place" />
        </el-form-item>

        <el-form-item
          label="招牌英雄"
          prop="sign_hero"
        >
          <el-select v-model="temp.sign_hero" filterable multiple placeholder="请选择">
            <el-option
              v-for="item in heroList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <img :src="'https://file.lihailezzc.com/' + item.icon" style="width: 25px;height:25px;margin-right: 15px;border-radius:50%" alt="" srcset="">
              <span>{{ item.name }}</span>
              <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span> -->
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="熟练英雄"
          prop="hero"
        >
          <el-select v-model="temp.hero" filterable multiple placeholder="请选择">
            <el-option
              v-for="item in heroList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <img :src="'https://file.lihailezzc.com/' + item.icon" style="width: 25px;height:25px;margin-right: 15px;border-radius:50%" alt="" srcset="">
              <span>{{ item.name }}</span>
              <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span> -->
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="技能"
          prop="skill"
        >
          <el-select v-model="temp.skill" filterable multiple placeholder="请选择">
            <el-option
              v-for="item in skillList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <img :src="'https://file.lihailezzc.com/' + item.icon" style="width: 25px;height:25px;margin-right: 15px;border-radius:50%" alt="" srcset="">
              <span>{{ item.name }}</span>
              <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span> -->
            </el-option>
          </el-select>
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
import { deleteBanner } from "@/api/banner";
import { getPlayer, getAllHero, getAllSkill, addPlayer, updatePlayer } from "@/api/djjl";
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
      heroList: [],
      skillList: [],
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
        id: undefined
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
    this.getHreo();
    this.getSkill();
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
    getHreo() {
      this.listLoading = true;
      getAllHero().then(response => {
        this.heroList = response.data.data;

        this.listLoading = false;
      });
    },
    getSkill() {
      this.listLoading = true;
      getAllSkill().then(response => {
        this.skillList = response.data.data;

        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.currentPage = 1;
      this.getList();
    },

    resetTemp() {
      this.temp = {
        id: undefined
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
          addPlayer(this.temp).then(res => {
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

          updatePlayer(tempData.id, { name: tempData.name, year_name: tempData.year_name, quality: tempData.quality, skill: tempData.skill, sign_hero: tempData.sign_hero, hero: tempData.hero, team: tempData.team, point: tempData.point, photo: tempData.photo, bg_photo: tempData.photo, place: tempData.place }).then(res => {
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
