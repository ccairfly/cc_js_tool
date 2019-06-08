<template>
  <div>
     <el-button type="primary" plain class="btn" @click="selectSerial">选择串口</el-button>
     <!-- <button class="btn">选择串口</button>
     <button class="openBtn">打开串口</button> -->
     <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.label"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="openBtn">
        <el-button type="primary" plain class="btn" @click="opentSerial">打开串口</el-button>
        <el-checkbox v-model="checked">开启test-mode</el-checkbox>
      </div>
      <div class="textArea">
        <el-input
          type="textarea"
          :rows="3"
          v-model="textarea"
          style="width:500px;">
        </el-input>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [],
      value: '',
      checked:true,//复选框选中状态
      textarea:'',//文本域中显示的内容
    }
  },
  methods: {
    selectSerial(){
      //选择串口
      //192.168.1.102:3000/users/ports
      // https://www.easy-mock.com/mock/5c6ad911d8bc8b31033c36cc/example/get-data-1
      this.$http.get('http://192.168.1.102:3000/users/ports')
      .then((res) => {
        // console.log(res);
        (res.data).map((item) =>{
          // console.log(item)
          var aobj = {
            value : '',
            label : ''
          }
          aobj.label = item
          aobj.value = item
          this.options.push(aobj)
        })
        // console.log(this.options)
      })
    },
    opentSerial(){
      // let params = {}
      //打开串口
      this.$http.post('http://192.168.1.102:3000/users/openSerialport',{
        'com' : 'COM29'
      }).then((res) => {
        console.log(res)
      })
    }
  },
}
</script>
<style scoped>
.btn{
  position: absolute;
  left: 60px;
}
.openBtn{
  margin-top: 60px;
}
.textArea{
  margin-top: 60px;
}
.el-textarea__inner{
  width:500px;
}
</style>


