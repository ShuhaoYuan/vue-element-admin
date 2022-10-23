<template>
  <div class="app-container">

    <category-select
      :visible.sync="categoryInfo.showcategorySelect"
      @categorySelected="categorySelected"
    />

    <el-steps
      :active="step"
      finish-status="success"
    >
      <el-step title="步骤 1：上传文件" />
      <el-step title="步骤 2：选择题目类型" />
      <el-step title="步骤 3：检查表格内容" />
      <el-step title="步骤 3：上传文件" />
    </el-steps>

    <div style="height:30px" />

    <div class="filter-container">

      <el-upload
        action=""
        :multiple="false"
        :drag="true"
        accept=".xlsx,.xls"
        :auto-upload="true"
        :before-upload="handle_read_file"
      >
        <div>您也可以拖拽或者点击打开文件</div>
      </el-upload>
    </div>
    <div v-if="table_data.length>0&&categoryInfo.category_id===null&&categoryInfo.showcategorySelect!==true"><el-button
      type="primary"
      @click="startSelectCategory"
    >选择题目类型</el-button></div>
    <div v-if="categoryInfo.category_id!==null">
      <div>{{ categoryInfo.people }}-{{ categoryInfo.main_category }}-{{ categoryInfo.sub_category }}-{{ categoryInfo.quzheng }}</div>
      <div>
        <el-button
          type="primary"
          @click="changeCategory"
        >修改题目类型</el-button>
        <el-button
          type="primary"
          @click="uploadData"
        >开始上传</el-button>
      </div>
    </div>
    <div>
      <el-table
        :data="table_data"
        border
        highlight-current-row
        style="width: 100%;margin-top:20px;"
      >
        <el-table-column
          v-for="item of header"
          :key="item"
          :prop="item"
          sortable
          :label="item"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
import xlsx from 'xlsx'
import categorySelect from '@/components/category_select'
import { uploadTmpQuestions } from '@/api/question'

export default {
  name: 'UploadXLSXFile',
  components: { categorySelect },
  data() {
    return {
      header: [],
      table_data: [],

      categoryInfo: {
        showcategorySelect: false,
        people: '',
        main_category: '',
        sub_category: '',
        quzheng: '',
        category_id: null
      },
      step: 0
    }
  },
  created() {
  },
  methods: {
    startSelectCategory() {
      this.categoryInfo.showcategorySelect = true
      console.log('show information')
    },
    handle_read_file(file) {
      const file_reader = new FileReader()
      file_reader.onload = (ev) => {
        const workbook = xlsx.read(ev.target.result, { type: 'array' })
        const worksheetname = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[worksheetname]
        const header = this.getHeaderRow(worksheet)
        if (header.indexOf('题目') === -1) {
          this.$message.error('没有"题目"')
          return false
        }
        if (header.indexOf('题目类型') === -1) {
          this.$message.error('没有"题目类型"')
          return false
        }
        if (header.indexOf('A') === -1) {
          this.$message.error('没有选项"A"')
          return false
        }
        if (header.indexOf('B') === -1) {
          this.$message.error('没有选项"B"')
          return false
        }
        if (header.indexOf('答案') === -1) {
          this.$message.error('没有"答案"')
          return false
        }

        let table_data = xlsx.utils.sheet_to_json(worksheet, { header })
        table_data = table_data.map((item) => {
          if (!Object.prototype.hasOwnProperty.call(item, 'C')) {
            item['C'] = null
          }
          if (!Object.prototype.hasOwnProperty.call(item, 'D')) {
            item['D'] = null
          }
          const new_item = {
            '题目': item['题目'],
            '题目类型': item['题目类型'],
            'A': item['A'],
            'B': item['B'],
            'C': item['C'],
            'D': item['D'],
            '答案': item['答案'],
            '解析': item['解析']
          }
          return new_item
        })
        table_data.splice(0, 1)
        this.header = ['题目', '题目类型', 'A', 'B', 'C', 'D', '答案', '解析']
        this.table_data = table_data

        this.categoryInfo.showcategorySelect = true
        this.step = 1
      }
      console.log(file)
      file_reader.readAsArrayBuffer(file)
      return false
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = xlsx.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[xlsx.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = xlsx.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
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

      this.target_category_dialog_visible = false
    },
    categorySelected(categoryInfo) {
      console.log(categoryInfo)
      for (const key in categoryInfo) {
        this.categoryInfo[key] = categoryInfo[key]
      }
      this.step = 2
    },
    changeCategory() {
      this.categoryInfo.showcategorySelect = true
    },
    uploadData() {
      function convertT(T) {
        const t = T.toLowerCase().trim()
        const t_map = { a: 0, b: 1, c: 2, d: 3 }
        return t_map[t]
      }

      const questions = this.table_data.map(item => {
        return {
          question: item['题目'],
          a: item['A'],
          b: item['B'],
          c: item['C'],
          d: item['D'],
          t: convertT(item['答案']),
          analysis: item['解析']
        }
      })

      const data = {
        category_id: this.categoryInfo.category_id,
        questions: questions
      }

      uploadTmpQuestions(data).then(res => {
        this.$message.success('上传成功')
        this.step = 4
      })
    }
  }
}
</script>
