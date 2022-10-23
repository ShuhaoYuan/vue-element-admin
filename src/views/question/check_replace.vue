<!-- 我的页面 -->
<template>
  <div class="app-container">
    <!-- <category-select v-on:categorySelected="categorySelected"></category-select> -->

    <el-form :inline="true">
      <el-form-item><category-select @categorySelected="categorySelected" /></el-form-item>
      <el-form-item><el-button
        type="primary"
        @click="selectAllCategory"
      >所有类型</el-button></el-form-item>
    </el-form>
    <div v-if="category.category_id!==null">
      {{ category.people }}
      <el-divider direction="vertical" />
      {{ category.main_category }}
      <el-divider direction="vertical" />
      {{ category.sub_category }}
      <el-divider direction="vertical" />
      {{ category.quzheng }}
    </div>
    <el-divider />
    <el-row :gutter="10">
      <el-col :span="12">
        <div v-if="compareData.tmpQuestion!==null">
          <el-card>
            <div>id:{{ compareData.tmpQuestion.id }}</div>
            <div>{{ compareData.tmpQuestion.question }}</div>
            <div>A:{{ compareData.tmpQuestion.a }}</div>
            <div>B:{{ compareData.tmpQuestion.b }}</div>
            <div v-if="compareData.tmpQuestion.c!==null">C:{{ compareData.tmpQuestion.c }}</div>
            <div v-if="compareData.tmpQuestion.d!==null">D:{{ compareData.tmpQuestion.d }}</div>
            <div>正确答案:{{ ['A', 'B', 'C', 'D'][compareData.tmpQuestion.t] }}</div>
            <div>{{ compareData.tmpQuestion.analysis }}</div>
          </el-card>
          <el-divider />
          <el-form :inline="true">
            <el-form-item><el-button
              :type="type.newType"
              @click="newQuestion"
            >该题是新题目</el-button></el-form-item>
            <el-form-item v-if="type.isAvailable!==null">
              <el-button
                type="primary"
                :disabled="submitting"
                @click="submit"
              >确认提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="12">
        <el-card
          v-for="item in compareData.questions"
          :key="item.id"
        >
          <div>{{ item.question }}</div>
          <div>A:{{ item.a }}</div>
          <div>B:{{ item.b }}</div>
          <div v-if="item.c!==undefined">C:{{ item.c }}</div>
          <div v-if="item.d!==undefined">D:{{ item.d }}</div>
          <div>正确答案:{{ ['A', 'B', 'C', 'D'][item.t] }}</div>
          <div>相似度:{{ item.score1 }}</div>
          <div>{{ item.analysis }}</div>
          <el-divider />
          <el-form :inline="true">
            <el-form-item><el-button
              :type="type.matchType"
              @click="matchQuestion(item.id)"
            >和该题是同一题</el-button></el-form-item>
            <el-form-item v-if="compareData.matchId===item.id">
              <el-button
                type="primary"
                :disabled="submitting"
                @click="submit"
              >确认提交</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》'
import { compareNextQuestion, updateTmp, compareAllNext } from '@/api/question'
import categorySelect from '@/components/category_select'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: { categorySelect },
  data() {
    // 这里存放数据
    return {
      compareData: {
        tmpQuestion: null,
        questions: [],
        matchId: null
      },
      category: {
        category_id: null,
        people: null,
        main_category: null,
        sub_category: null,
        quzheng: null
      },
      categoryVisible: false,
      type: {
        newType: null,
        sameType: null,
        matchType: null,
        isAvailable: null
      },
      submitting: false,
      finished: false
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
    nextQuestion() {

    },
    categorySelected(category) {
      this.category = category
      this.submitting = true
      compareNextQuestion(category.category_id).then(this.processTmpQuestion)
    },
    selectCategory() {
      this.categoryVisible = true
    },
    selectAllCategory() {
      compareAllNext().then(this.processTmpQuestion)
      this.category.category_id = null
    },
    newQuestion() {
      this.type.newType = 'primary'
      this.type.sameType = null
      this.type.isAvailable = 1
    },
    sameQuestion() {
      this.type.newType = null
      this.type.sameType = 'primary'
      this.type.isAvailable = 0
    },
    matchQuestion(id) {
      this.compareData.matchId = id
      this.type.isAvailable = 0
    },
    submit() {
      this.submitting = true
      updateTmp(this.compareData.tmpQuestion.id, this.category.category_id, this.type.isAvailable, this.compareData.matchId).then(this.processTmpQuestion)
    },
    processTmpQuestion(res) {
      this.type = {
        newType: null,
        sameType: null,
        isAvailable: null
      }
      if (res.data === undefined) {
        this.finished = true
        this.submitting = false
        this.$message.success('已经没有题目了')
        return
      } else {
        this.finished = false
      }
      this.compareData.tmpQuestion = res.data.tmp_question
      this.compareData.questions = res.data.questions
      this.submitting = false
    }
  }
}
</script>
