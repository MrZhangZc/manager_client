<!--
 * @Author: zzc 1761997216@qq.com
 * @Date: 2022-08-02 17:57:29
 * @LastEditors: zzc 1761997216@qq.com
 * @LastEditTime: 2022-08-02 18:14:00
 * @FilePath: /manager_client/src/views/resource/create copy.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" class="form-container">
      <div class="createPost-main-container">

        <el-form-item style="margin-bottom: 40px;" label="url：">
          <el-input v-model="postForm.url" :rows="1" type="textarea" class="article-textarea" autosize placeholder="图片地址" />
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label="存储位置：">
          <el-input v-model="postForm.prefix" :rows="1" type="textarea" class="article-textarea" autosize placeholder="存储位置" />
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
import { createUrl } from "@/api/rescoure";

const defaultForm = {}

export default {
  name: "User",
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      imgurl: '',
      ocrRes: ''
    }
  },
  methods: {
    handleCreate() {
      createUrl(this.postForm).then(res => {
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
