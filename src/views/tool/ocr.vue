<template>
  <div class="app-container">
    <Upload v-model="imgurl" />
    <el-button
      class="filter-item"
      style="margin-left: 10px;margin-top: 30px"
      type="primary"
      icon="el-icon-edit"
      @click="handleCreate"
    >
      开始识别
    </el-button>
    <el-input
      v-model="ocrRes"
      type="textarea"
      style="margin-left: 10px;margin-top: 30px"
      autosize
      placeholder="识别结果展示"
    />
  </div>
</template>

<script>
import Upload from '@/components/Upload/SingleImage3'
import { ocr } from "@/api/ai";
export default {
  name: "User",
  components: { Upload },
  data() {
    return {
      imgurl: '',
      ocrRes: ''
    }
  },
  methods: {
    handleCreate() {
      if (!this.imgurl) {
        this.$notify({
          title: "",
          message: "清先上传图片",
          type: "error",
          duration: 2000
        });
        return
      }
      ocr({ path: 'https://file.lihailezzc.com/' + this.imgurl }).then(res => {
        if (this.errorInfo(res)) return;
        this.ocrRes = res.data.data
        this.$copyText(res.data.data)
        this.successInfo()
      });
    },
    successInfo() {
      this.$notify({
        title: "成功",
        message: "识别成功,且已复制到剪贴板",
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
