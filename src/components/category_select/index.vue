<template>
  <div>
    <el-button
      type="primary"
      @click="onChoose"
    >请选择题目类型</el-button>
    <el-dialog
      title="题目类型"
      :visible="visible"
      @close="onClose"
    >
      <el-form label-width="120px">

        <el-form-item
          v-if="formDir.people.length>0"
          label="人员类型"
        >
          <el-select
            v-model="formData.people"
            placeholder="请选择"
            @change="peopleChanged"
          >
            <el-option
              v-for="item in formDir.people"
              :key="item.id"
              :label="item.desc"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="formDir.main_categories.length>0"
          label="主要题目类型"
        >
          <el-select
            v-model="formData.main_caterory"
            placeholder="请选择"
            @change="mainCategoryChanged"
          >
            <el-option
              v-for="item in formDir.main_categories"
              :key="item.id"
              :label="item.desc"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="formDir.sub_categories.length>0"
          label="题目类型"
        >
          <el-select
            v-model="formData.sub_category"
            placeholder="请选择"
            @change="subCategoryChanged"
          >
            <el-option
              v-for="item in formDir.sub_categories"
              :key="item.id"
              :label="item.desc"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="formDir.quzhengs.length>0"
          label="取证类型"
        >
          <el-select
            v-model="formData.category_id"
            placeholder="请选择"
            @change="quzhengChanged"
          >
            <el-option
              v-for="item in formDir.quzhengs"
              :key="item.category_id"
              :label="item.desc"
              :value="item.category_id"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <div>{{ showData.people }}</div>
      <div>{{ showData.main_category }}</div>
      <div>{{ showData.sub_category }}</div>
      <div>{{ showData.quzheng }}</div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancelClicked">取 消</el-button>
        <el-button
          type="primary"
          @click="categorySelected"
        >修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoriesTree } from '@/api/category'

export default {
  name: 'CategorySelect',
  props: { },
  data() {
    return {
      visible: false,
      formDir: {
        people: [],
        main_categories: [],
        sub_categories: [],
        quzhengs: []
      },
      formData: {
        people: null,
        main_caterory: null,
        sub_category: null,
        category_id: null
      },
      showData: {
        people: '',
        main_category: '',
        sub_category: '',
        quzheng: ''
      }
    }
  },
  created() {
    getCategoriesTree().then(res => {
      this.formDir.people = res.data
    })
  },
  methods: {
    peopleChanged(val) {
      const people = this.formDir.people.find(item => { return item.id === val })
      this.formDir.main_categories = people.main_categories
      this.showData.people = people.desc
    },
    mainCategoryChanged(val) {
      const main_category = this.formDir.main_categories.find(item => { return item.id === val })
      this.formDir.sub_categories = main_category.sub_categories
      this.showData.main_category = main_category.desc
    },
    subCategoryChanged(val) {
      const sub_category = this.formDir.sub_categories.find(item => { return item.id === val })
      this.formDir.quzhengs = sub_category.quzheng_types
      this.showData.sub_category = sub_category.desc
    },
    quzhengChanged(val) {
      const quzheng = this.formDir.quzhengs.find(item => { return item.category_id === val })
      this.showData.quzheng = quzheng.desc
    },
    categorySelected() {
      if (this.formData.people === null) {
        this.$message.warning('请选择人员类型')
        return
      }
      if (this.formData.main_category === null) {
        this.$message.warning('请选择题目类型')
        return
      }
      if (this.formData.sub_category === null) {
        this.$message.warning('请选择题目类型')
        return
      }
      if (this.formData.category_id === null) {
        this.$message.warning('请选择取证方法')
        return
      }
      const data = {
        'category_id': this.formData.category_id,
        'people': this.showData.people,
        'main_category': this.showData.main_category,
        'sub_category': this.showData.sub_category,
        'quzheng': this.showData.quzheng
      }
      this.$emit('categorySelected', data)
      this.visible = false
    },
    cancelClicked() {
      this.visible = false
      this.$emit('cancelClicked')
    },
    onClose() {
      this.visible = false
      this.$emit('closeClicked')
    },
    onChoose() {
      this.visible = true
    }
  }
}
</script>

<style lang='stylus' scoped>

</style>
