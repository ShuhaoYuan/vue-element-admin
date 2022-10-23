<template>
  <div class="app-container">
    <el-table
      :data="categories"
      height="800"
    >
      <el-table-column
        type="index"
        label="编号"
        sortable
        width="50"
      />
      <el-table-column
        prop="id"
        label="ID"
        sortable
      />
      <el-table-column
        prop="main_id"
        label="main ID"
        sortable
      />
      <el-table-column
        prop="main_desc"
        label="主类型"
        :filters="main_filters"
        :filter-method="filterMainDesc"
        sortable
      />
      <el-table-column
        prop="sub_id"
        label="sub ID"
        sortable
      />
      <el-table-column
        prop="sub_desc"
        label="子类型"
        :filters="sub_filters"
        :filter-method="filterSubDesc"
        sortable
      />
      <el-table-column
        prop="people_desc"
        label="人员类型"
        sortable
      />
      <el-table-column
        prop="quzheng_desc"
        label="取证类型"
        sortable
      />
    </el-table>

    <!--    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->

    <!--    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">-->
    <!--      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">-->
    <!--        <el-form-item label="Type" prop="type">-->
    <!--          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">-->
    <!--            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />-->
    <!--          </el-select>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="Date" prop="timestamp">-->
    <!--          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="Title" prop="title">-->
    <!--          <el-input v-model="temp.title" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="Status">-->
    <!--          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">-->
    <!--            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />-->
    <!--          </el-select>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="Imp">-->
    <!--          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="Remark">-->
    <!--          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="dialogFormVisible = false">-->
    <!--          Cancel-->
    <!--        </el-button>-->
    <!--        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">-->
    <!--          Confirm-->
    <!--        </el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->

    <!--    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">-->
    <!--      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">-->
    <!--        <el-table-column prop="key" label="Channel" />-->
    <!--        <el-table-column prop="pv" label="Pv" />-->
    <!--      </el-table>-->
    <!--      <span slot="footer" class="dialog-footer">-->
    <!--        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import { service2 as request } from '@/utils/request'

export default {
  name: 'Category',
  data() {
    return {
      categories: [],
      sub_categories: [],
      main_categories: [],
      sub_filters: [],
      main_filters: []
    }
  },
  created() {
    request({
      url: '/category/details',
      method: 'get'
    }).then((res) => {
      const main_categories = res.data.map(item => { return item.main_desc })
      this.main_categories = [...new Set(main_categories)]

      const sub_categories = res.data.map(item => { return item.sub_desc })
      this.sub_categories = [...new Set(sub_categories)]

      this.categories = res.data
    })
  },
  methods: {
    filterSubDesc: (value, row) => {
      return row.sub_desc === value
    },
    filterMainDesc: (value, row) => {
      return row.main_desc === value
    }
  }
}
</script>

<style scoped>

</style>
