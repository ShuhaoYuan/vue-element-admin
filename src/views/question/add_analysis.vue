<!-- 我的页面 -->
<template>
  <div class="app-container">
    <category-select
      :visible.sync="categoryVisible"
      @categorySelected="categorySelected"
    />
    <div>{{ category.category_id }}/{{ category.main_category }}/{{ category.sub_category }}/{{ category.people }}/{{ category.quzheng }}</div>
    <el-switch
      v-model="no_analysis"
      active-text="仅显示未包含解析题目"
      inactive-text="显示所有题目"
    />
    <div />
    <el-switch
      v-model="all_panduan"
      active-text="仅显示判断题"
      inactive-text="显示所有题"
    />
    <div />
    <el-switch
      v-model="all_wrong"
      active-text="仅显示错误"
      inactive-text="显示所有题"
    />
    <div />
    <el-button
      type="primary"
      @click="start"
    >开始</el-button>
    <div>
      <el-card
        v-for="item in questions"
        :key="item.id"
      >
        <div>ID: {{ item.id }}</div>
        <div>{{ item.question }}</div>
        <div>A:{{ item.a }}</div>
        <div>B:{{ item.b }}</div>
        <div>C:{{ item.c }}</div>
        <div>D:{{ item.d }}</div>
        <div>答案:{{ ['A', 'B', 'C', 'D'][item.t] }}</div>
        <el-input
          v-model="item.analysis"
          type="textarea"
          :rows="6"
        />
        <el-button
          type="primary"
          @click="update(item)"
        >更新解析</el-button>
        <el-divider />
      </el-card>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》'
import categorySelect from '@/components/category_select'
import { get_questions, update_question_analysis } from '@/api/question'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: { categorySelect },
  data() {
    // 这里存放数据
    return {
      category: {
        category_id: null,
        people: null,
        main_category: null,
        sub_category: null,
        quzheng: null
      },
      questions: [],
      categoryVisible: false,
      no_analysis: true,
      all_panduan: true,
      all_wrong: true
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {

  },
  beforeCreate() { }, // 生命周期 - 创建之前
  beforeMount() { }, // 生命周期 - 挂载之前
  beforeUpdate() { }, // 生命周期 - 更新之前
  updated() { }, // 生命周期 - 更新之后
  beforeDestroy() { }, // 生命周期 - 销毁之前
  destroyed() { }, // 生命周期 - 销毁完成
  activated() { }, // 如果页面有keep-alive缓存功能，这个函数会触发
  // 方法集合
  methods: {
    categorySelected(category) {
      this.category = category
    },
    selectCategory() {
      this.categoryVisible = true
    },
    start() {
      console.log('start to load questions')
      if (this.category.category_id === null) {
        this.$message.warning('请先选择题目类型')
        return
      }
      get_questions(
        this.category.category_id,
        this.no_analysis,
        this.all_panduan,
        this.all_wrong
      ).then(res => {
        this.questions = res.data
      })
    },
    update(question) {
      console.log(question)
      update_question_analysis(question.id, question.analysis)
      this.$message.success('更新成功')
    }
  }
}
</script>
