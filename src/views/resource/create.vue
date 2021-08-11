<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" class="form-container">
      <div class="createPost-main-container">

        <el-form-item style="margin-bottom: 40px;" label="类型：">
          <el-input v-model="postForm.type" :rows="1" type="textarea" class="article-textarea" autosize placeholder="类型" />
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label="描述：">
          <el-input v-model="postForm.desc" :rows="1" type="textarea" class="article-textarea" autosize placeholder="描述" />
        </el-form-item>

        <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <Upload v-model="postForm.path" />
        </el-form-item>
      </div>
    </el-form>
    <el-button
      class="filter-item"
      style="margin-left: 10px;margin-top: 20px"
      type="primary"
      icon="el-icon-upload"
      @click="handleCreate"
    >
      上传资源
    </el-button>
  </div>
</template>

<script>
import Upload from '@/components/Upload/SingleImage4'
import { create } from "@/api/rescoure";

const defaultForm = {
  desc: ''
}

export default {
  name: "User",
  components: { Upload },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      imgurl: '',
      ocrRes: ''
    }
  },
  methods: {
    handleCreate() {
      create(this.postForm).then(res => {
        if (this.errorInfo(res)) return;
        this.postForm = {}
        this.successInfo()
      });
    },
    successInfo() {
      this.$notify({
        title: "成功",
        message: "上传成功",
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
