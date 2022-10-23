<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        ref="form"
        :model="form"
        label-width="90px"
        :inline="true"
      >
        <el-form-item
          label="商户单号"
          size="medium"
        >
          <el-input v-model="form.trade_no" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="on_search_trade_no"
          >搜索</el-button>
        </el-form-item>
      </el-form>
      <el-form
        ref="form"
        :model="form"
        label-width="90px"
        :inline="true"
      >
        <el-form-item
          label="用户邀请码"
          size="medium"
        >
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="on_search_code"
          >搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="orders"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
      />
      <el-table-column
        prop="out_trade_no"
        label="商户单号"
      />
      <el-table-column
        prop="fee"
        label="金额"
        :formatter="fen2yuan"
      />
      <el-table-column
        prop="num_question"
        label="题量"
      />
      <el-table-column
        prop="createtime"
        label="下单时间"
        :formatter="timestamp2time"
      />
      <el-table-column
        prop="paid"
        label="是否支付"
        :formatter="code2paid"
      />
      <el-table-column
        prop="sub_desc"
        label="类型"
      />
      <el-table-column
        prop="people_desc"
        label="人员类型"
      />
      <el-table-column
        prop="quzheng_desc"
        label="取证类型"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="refund(scope.row)"
          >退款</el-button>
          <el-button
            size="mini"
            @click="change_category_from(scope.row)"
          >修改类别</el-button>
        </template>
      </el-table-column>
    </el-table>

    <category-select
      :visible.sync="target_category_dialog_visible"
      @categorySelected="categorySelected"
    />

    <!-- <el-dialog title="目标种类" :visible.sync="target_category_dialog_visible">
      <el-form :model="change_category_form">
        <el-form-item label="人员类型">
          <el-select v-model="change_category_form.people" placeholder="请选择">
            <el-option v-for="item in peoples" :key="item.id" :label="item.desc" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="sub_categories.length>0" label="类型选择">
          <el-select v-model="change_category_form.sub_category_id" placeholder="请选择">
            <el-option v-for="item in sub_categories" :key="item.id" :label="item.desc" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="取证类型">
          <el-select v-model="change_category_form.quzheng" placeholder="请选择">
            <el-option v-for="item in quzhengs" :key="item.id" :label="item.desc" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="target_category_dialog_visible = false">取 消</el-button>
        <el-button type="primary" @click="change_category">修 改</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { refund } from '@/api/order'
import { service as request } from '@/utils/request'
import categorySelect from '@/components/category_select'

export default {
  name: 'Orders',
  components: { categorySelect },
  directives: {},
  filters: {},
  data() {
    return {
      orders: [],
      vols: [],
      form: {
        trade_no: ''
      },
      // for change category
      change_category_from_info: {
        from_category_id: null,
        order_id: null,
        user_id: null
      },
      change_category_form: {
        sub_category_id: null,
        people: null,
        quzheng: null
      },
      peoples: [{ desc: '安全管理人员', id: 1 }, { desc: '安全负责人', id: 2 }, { desc: '特种工作人员', id: 3 }],
      sub_categories: [],
      quzhengs: [{ desc: '初领', id: 2 }, { desc: '复审', id: 1 }],
      // state
      target_category_dialog_visible: false
    }
  },
  created() {
    request.get('/category/sub').then(res => {
      this.sub_categories = res.data
    })
  },
  methods: {
    on_search_code() {
      const code = this.form.code
      request.get('/admin/order/code/' + code).then((res) => {
        this.orders = res.data
        // this.vols = res.data.vols
      })
    },
    on_search_trade_no() {
      const trade_no = this.form.trade_no
      request.get('/admin/order/trade_no/' + trade_no).then((res) => {
        this.orders = [res.data]
        this.vols = res.data.vols
      })
    },
    detail(id) {
      request.get('/admin/vol/order_id/' + id).then((res) => {
        this.orders = [res.data]
      })
    },
    refund(row) {
      const order_id = row.id
      if (!row.paid) {
        return
      }
      this.$confirm('确定要退款？', '提醒').then(() => {
        refund(order_id).then((res) => {
          this.$message({
            type: 'success',
            message: '退款成功'
          })
        })
      }).catch(() => {})
    },
    // change category
    change_category_from(row) {
      const now = new Date().getTime() / 1000
      if (row.expired_time < now) {
        this.$message.error('已经过期，无法修改')
        return
      }
      this.change_category_from_info.user_id = row.user_id
      this.change_category_from_info.from_category_id = row.category_id
      this.change_category_from_info.order_id = row.id
      this.target_category_dialog_visible = true
    },
    categorySelected(toData) {
      console.log(toData)
      const data = {
        from_category_id: this.change_category_from_info.from_category_id,
        to_category_id: toData.category_id,
        order_id: this.change_category_from_info.order_id
      }
      request.post('/admin/order/change_category_by_id', data).then(res => {
        if (res.errcode === 0) {
          this.$message.success('修改成功')
          this.on_search_code()
          return
        }
        this.$message.error(res.errmsg)
      })
      this.target_category_dialog_visible = false
    },
    cancelCategory() {
      this.target_category_dialog_visible = false
    },
    change_category() {
      if (this.change_category_form.people === null) {
        this.$message.error('请选择人员类型')
        return
      }
      if (this.change_category_form.sub_category_id === null) {
        this.$message.error('请选择类型')
        return
      }
      if (this.change_category_form.quzheng === null) {
        this.$message.error('请选择取证类型')
        return
      }

      const data = Object.assign({}, this.change_category_from_info, this.change_category_form)

      request.post('/admin/order/change_category', data).then(res => {
        if (res.errcode === 0) {
          this.$message.success('修改成功')
          this.on_search_code()
          return
        }
        this.$message.error(res.errmsg)
      })
      this.target_category_dialog_visible = false
    },
    // formatters
    timestamp2time(row, column, cellValue, index) {
      return new Date(parseInt(cellValue) * 1000).toLocaleString()
    },
    fen2yuan(row, column, cellValue, index) {
      return cellValue / 100
    },
    bool2str(row, column, cellValue, index) {
      return cellValue ? '是' : '否'
    },
    code2paid(row, column, cellValue, index) {
      return cellValue ? '是' : '否'
    }
  }
}
</script>
