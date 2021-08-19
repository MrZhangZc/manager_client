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
        @click="getList()"
      >
        查看
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
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="值日说明" name="1">
        <div>1、值日范围:值日生仅负责公共区域,卧室自行打扫;</div>
        <div>2、值日生职责:每天更新日历,完成晚上0点前完成值日工作,完成后自己点击完成;</div>
        <div>3、检查员职责:每天晚上10点前完成检查检查情况在每一项空格里点击通过或不通过;</div>
      </el-collapse-item>
      <el-collapse-item title="奖惩制度" name="2">
        <div>1、惩罚:任一项不合格,则罚款一次10元,存入公共基金;</div>
        <div>2、奖励:任一项不合格,10点后其他人代替完成,则奖励完成人员10元。从公共基金支出;</div>
        <div>3、公共基金可用于缴纳水电费、购买每周食材等公共支出;</div>
      </el-collapse-item>
      <el-collapse-item title="其他" name="3">
        <div>1、每周日为大扫除时间,需进行全屋拖地倒垃圾、床单更换、除螨等工作;</div>
        <div>2、每天最后一个出门的需要注意断水断电;</div>
        <div>3、每周六为采购日,需采购本周六日及下周的食材和水果,采购前列请单,由值日生带队前往采购。公共采购优先从公共基金支出,若不够,则由三人平分;</div>
        <div>4、水电费:优先从公共基金支出,若不够,则由三人平分;</div>
      </el-collapse-item>
    </el-collapse>
    <!-- 数据列表 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      height="650"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="日期"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.day }} 号 ({{ row.week }})</span>
        </template>
      </el-table-column>

      <el-table-column
        label="值日人"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.duty_user }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="监督人"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.check_user }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="客厅清理"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="+new Date(row.date) < +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span v-if="row.duty_room" style="color:green">已完成</span>
            <span v-else style="color:red">未完成</span>
          </span>
          <span v-else-if="+new Date(row.date) > +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span>时间未到</span>
          </span>
          <span v-else>
            <span v-if="row.duty_room_lock">
              <span v-if="row.duty_room" style="color:green">已完成</span>
              <span v-else style="color:red">未完成</span>
            </span>
            <span v-else>
              <el-button type="primary" @click="handleDutyUpdate(row.id, 'duty_room', true)">完成</el-button>
              <el-button type="danger" style="margin-top:5px;margin-right:10px" @click="handleDutyUpdate(row.id, 'duty_room', false)">未完成</el-button>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="客厅清理检查"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="+new Date(row.date) < +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span v-if="row.check_duty_room" style="color:green">通过</span>
            <span v-else style="color:red">未通过</span>
          </span>
          <span v-else-if="+new Date(row.date) > +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span>时间未到</span>
          </span>
          <span v-else>
            <span v-if="row.check_duty_room_lock">
              <span v-if="row.check_duty_room" style="color:green">通过</span>
              <span v-else style="color:red">未通过</span>
            </span>
            <span v-else>
              <el-button type="primary" @click="handleDutyUpdate(row.id, 'check_duty_room', true)">通过</el-button>
              <el-button type="danger" style="margin-top:5px;margin-right:10px" @click="handleDutyUpdate(row.id, 'check_duty_room', false)">未通过</el-button>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="卫生间清理"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="+new Date(row.date) < +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span v-if="row.duty_toilet" style="color:green">已完成</span>
            <span v-else style="color:red">未完成</span>
          </span>
          <span v-else-if="+new Date(row.date) > +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span>时间未到</span>
          </span>
          <span v-else>
            <span v-if="row.duty_toilet_lock">
              <span v-if="row.duty_toilet" style="color:green">已完成</span>
              <span v-else style="color:red">未完成</span>
            </span>
            <span v-else>
              <el-button type="primary" @click="handleDutyUpdate(row.id, 'duty_toilet', true)">完成</el-button>
              <el-button type="danger" style="margin-top:5px;margin-right:10px" @click="handleDutyUpdate(row.id, 'duty_toilet', false)">未完成</el-button>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="卫生间清理检查"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="+new Date(row.date) < +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span v-if="row.check_duty_toilet" style="color:green">通过</span>
            <span v-else style="color:red">未通过</span>
          </span>
          <span v-else-if="+new Date(row.date) > +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span>时间未到</span>
          </span>
          <span v-else>
            <span v-if="row.check_duty_toilet_lock">
              <span v-if="row.check_duty_toilet" style="color:green">已通过</span>
              <span v-else style="color:red">未通过</span>
            </span>
            <span v-else>
              <el-button type="primary" @click="handleDutyUpdate(row.id, 'check_duty_toilet', true)">通过</el-button>
              <el-button type="danger" style="margin-top:5px;margin-right:10px" @click="handleDutyUpdate(row.id, 'check_duty_toilet', false)">未通过</el-button>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="阳台清理"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="+new Date(row.date) < +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span v-if="row.duty_balcony" style="color:green">已完成</span>
            <span v-else style="color:red">未完成</span>
          </span>
          <span v-else-if="+new Date(row.date) > +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span>时间未到</span>
          </span>
          <span v-else>
            <span v-if="row.duty_balcony_lock">
              <span v-if="row.duty_balcony" style="color:green">已完成</span>
              <span v-else style="color:red">未完成</span>
            </span>
            <span v-else>
              <el-button type="primary" @click="handleDutyUpdate(row.id, 'duty_balcony', true)">完成</el-button>
              <el-button type="danger" style="margin-top:5px;margin-right:10px" @click="handleDutyUpdate(row.id, 'duty_balcony', false)">未完成</el-button>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="阳台清理检查"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="+new Date(row.date) < +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span v-if="row.check_duty_balcony" style="color:green">通过</span>
            <span v-else style="color:red">未通过</span>
          </span>
          <span v-else-if="+new Date(row.date) > +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span>时间未到</span>
          </span>
          <span v-else>
            <span v-if="row.check_duty_balcony_lock">
              <span v-if="row.check_duty_balcony" style="color:green">已通过</span>
              <span v-else style="color:red">未通过</span>
            </span>
            <span v-else>
              <el-button type="primary" @click="handleDutyUpdate(row.id, 'check_duty_balcony', true)">通过</el-button>
              <el-button type="danger" style="margin-top:5px;margin-right:10px" @click="handleDutyUpdate(row.id, 'check_duty_balcony', false)">未通过</el-button>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="洗手池清理"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="+new Date(row.date) < +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span v-if="row.duty_washing" style="color:green">已完成</span>
            <span v-else style="color:red">未完成</span>
          </span>
          <span v-else-if="+new Date(row.date) > +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span>时间未到</span>
          </span>
          <span v-else>
            <span v-if="row.duty_washing_lock">
              <span v-if="row.duty_washing" style="color:green">已完成</span>
              <span v-else style="color:red">未完成</span>
            </span>
            <span v-else>
              <el-button type="primary" @click="handleDutyUpdate(row.id, 'duty_washing', true)">完成</el-button>
              <el-button type="danger" style="margin-top:5px;margin-right:10px" @click="handleDutyUpdate(row.id, 'duty_washing', false)">未完成</el-button>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="洗手池清理检查"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="+new Date(row.date) < +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span v-if="row.check_duty_washing" style="color:green">通过</span>
            <span v-else style="color:red">未通过</span>
          </span>
          <span v-else-if="+new Date(row.date) > +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span>时间未到</span>
          </span>
          <span v-else>
            <span v-if="row.check_duty_washing_lock">
              <span v-if="row.check_duty_washing" style="color:green">已通过</span>
              <span v-else style="color:red">未通过</span>
            </span>
            <span v-else>
              <el-button type="primary" @click="handleDutyUpdate(row.id, 'check_duty_washing', true)">通过</el-button>
              <el-button type="danger" style="margin-top:5px;margin-right:10px" @click="handleDutyUpdate(row.id, 'check_duty_washing', false)">未通过</el-button>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="厨房清理"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="+new Date(row.date) < +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span v-if="row.duty_kitchen" style="color:green">已完成</span>
            <span v-else style="color:red">未完成</span>
          </span>
          <span v-else-if="+new Date(row.date) > +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span>时间未到</span>
          </span>
          <span v-else>
            <span v-if="row.duty_kitchen_lock">
              <span v-if="row.duty_kitchen" style="color:green">已完成</span>
              <span v-else style="color:red">未完成</span>
            </span>
            <span v-else>
              <el-button type="primary" @click="handleDutyUpdate(row.id, 'duty_kitchen', true)">完成</el-button>
              <el-button type="danger" style="margin-top:5px;margin-right:10px" @click="handleDutyUpdate(row.id, 'duty_kitchen', false)">未完成</el-button>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="厨房清理检查"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="+new Date(row.date) < +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span v-if="row.check_duty_kitchen" style="color:green">通过</span>
            <span v-else style="color:red">未通过</span>
          </span>
          <span v-else-if="+new Date(row.date) > +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span>时间未到</span>
          </span>
          <span v-else>
            <span v-if="row.check_duty_kitchen_lock">
              <span v-if="row.check_duty_kitchen" style="color:green">已通过</span>
              <span v-else style="color:red">未通过</span>
            </span>
            <span v-else>
              <el-button type="primary" @click="handleDutyUpdate(row.id, 'check_duty_kitchen', true)">通过</el-button>
              <el-button type="danger" style="margin-top:5px;margin-right:10px" @click="handleDutyUpdate(row.id, 'check_duty_kitchen', false)">未通过</el-button>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="做饭/洗碗"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="+new Date(row.date) < +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span v-if="row.duty_cook" style="color:green">已完成</span>
            <span v-else style="color:red">未完成</span>
          </span>
          <span v-else-if="+new Date(row.date) > +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span>时间未到</span>
          </span>
          <span v-else>
            <span v-if="row.duty_cook_lock">
              <span v-if="row.duty_cook" style="color:green">已完成</span>
              <span v-else style="color:red">未完成</span>
            </span>
            <span v-else>
              <el-button type="primary" @click="handleDutyUpdate(row.id, 'duty_cook', true)">完成</el-button>
              <el-button type="danger" style="margin-top:5px;margin-right:10px" @click="handleDutyUpdate(row.id, 'duty_cook', false)">未完成</el-button>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="做饭/洗碗检查"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="+new Date(row.date) < +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span v-if="row.check_duty_cook" style="color:green">通过</span>
            <span v-else style="color:red">未通过</span>
          </span>
          <span v-else-if="+new Date(row.date) > +new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())">
            <span>时间未到</span>
          </span>
          <span v-else>
            <span v-if="row.check_duty_cook_lock">
              <span v-if="row.check_duty_cook" style="color:green">已通过</span>
              <span v-else style="color:red">未通过</span>
            </span>
            <span v-else>
              <el-button type="primary" @click="handleDutyUpdate(row.id, 'check_duty_cook', true)">通过</el-button>
              <el-button type="danger" style="margin-top:5px;margin-right:10px" @click="handleDutyUpdate(row.id, 'check_duty_cook', false)">未通过</el-button>
            </span>
          </span>
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
import { addDuty, dutyList, dutyStatusUpdate } from '@/api/clockin'
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
      activeNames: [''],
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
        {
          value: 3,
          label: '赵肖东'
        },
        {
          value: 2,
          label: '张小燕'
        },
        {
          value: 1,
          label: '张智超'
        }
      ],
      chooseStatus: {
        duty_room: false,
        duty_toilet: false,
        duty_balcony: false,
        duty_washing: false,
        duty_cook: false,
        duty_kitchen: false,
        check_duty_room: false,
        check_duty_toilet: false,
        check_duty_balcony: false,
        check_duty_kitchen: false,
        check_duty_cook: false,
        check_duty_washing: false
      },
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      tableKey: 0,
      list: [],
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
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      dutyList({ year: this.year, month: this.month }).then(response => {
        this.list = response.data.data;

        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.currentPage = 1;
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
    handleChange(val) {
      console.log(val);
    },
    // 添加方法
    createData() {
      this.list.forEach(item => {
        const user = this.dauyIdOptions.find(i => i.value === item.duty_user_id)
        console.log({ user })
        item.duty_user = user.label
      })
      addDuty(this.list).then(res => {
        // if (this.errorInfo(res)) return;
        // this.list.unshift(res.data.data);
        // this.dialogFormVisible = false;
        // this.successInfo();
      });
    },
    handleDutyUpdate(id, type, result) {
      dutyStatusUpdate(id, { type, result }).then(res => {
        if (this.errorInfo(res)) return;
        this.getList()
        this.chooseStatus[type] = true
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
