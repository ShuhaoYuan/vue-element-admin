<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="code"
        placeholder="邀请码"
        style="width: 350px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleSearch"
      >
        搜索
      </el-button>
    </div>

    <el-table
      :data="promoteList"
      height="800"
    >
      <el-table-column
        prop="month"
        label="月份"
      />
      <el-table-column
        prop="total_fee"
        label="金额(元)"
      />
    </el-table>
  </div>
</template>

<script>
import { service2 as request } from '@/utils/request'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'UserPromote',
  directives: { waves },
  filters: {
  },
  data() {
    return {
      code: undefined,
      promoteList: []
    }
  },
  created() {
  },
  methods: {
    handleSearch: function() {
      var that = this
      request.get('/payment/promote_amount/code/' + this.code).then(function(res) {
        that.promoteList = res.data.map(function(item) {
          item['total_fee'] = item['total_fee'] / 100
          return item
        })
      })
    }
  }
}
</script>
