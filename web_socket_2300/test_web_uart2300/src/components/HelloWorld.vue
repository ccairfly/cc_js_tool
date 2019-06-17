<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
         <el-button type="primary" @click="selectSerial">选择串口</el-button>
      </el-col>
      <el-col :span="6">
          <el-select v-model="COMValue" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.label"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px;margin-left: -10px;">
      <el-col :span="6">
         <el-button type="primary" @click="openSerial" :disabled="!isCOMOpenActive">打开串口</el-button>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>

    <el-row style="margin-top:20px;margin-left: -10px;">
      <el-col :span="6">
         <el-button type="primary" @click="closeSerial" :disabled="isCOMOpenActive || COMValue == ''">关闭串口</el-button>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>

    <!-- <div class="textArea"> -->
    <el-row style="margin-top:20px;">
      <el-col :span="24">
        <display v-model="message"></display>
      </el-col>
    </el-row>
    <!-- </div> -->
  </div>
</template>
<script>
import display from "./display.vue"

const ws = new WebSocket("ws://localhost:8001")
export default {
  data() {
    return {
      isWSOpen : false,
      message : '',
      options: [],
      comList:[],
      COMValue: '',
      isCOMOpenActive : false,
      checked:true,//复选框选中状态
      textarea:'',//文本域中显示的内容
    }
  },
  created(){    
    ws.onopen = this.wsOpneHandler
    ws.onmessage = this.wsDataHandler
    ws.onclose = this.wsCloseHandler
    ws.onerror = this.wsErrorHandler
  },
  components : {
    display,
  },
  methods: {
    selectSerial(){
      //选择串口
      if(this.isWSOpen == true) {
        ws.send("get serialport");
      }
    },
    closeSerial(){
      ws.send("[close serialport]|" + this.COMValue);
    },
    openSerial(){
      //打开串口
      ws.send("[open serialport]|" + this.COMValue);
    },
    wsCloseHandler(){
      console.log('WS server close');
      this.sWSOpen = false
      this.message = "服务器关闭"
    },
    wsErrorHandler(){
      this.isWSOpen = false
      this.message = "打开服务器发生错误"
    },
    wsOpneHandler(){
      console.log('WS server open');
      this.isWSOpen = true
      this.message = "服务器已经链接"
    },
    wsDataHandler(evt){
      if(evt.data.indexOf('get serialport')!=-1) {
        
        var comData = evt.data.split("|")
        //获取到有com号
        console.log("get serialport:" + comData[1]);
        if(comData[1]){
          this.options = []
          this.comList = []
          this.comList = comData[1].split(",")
          this.comList.forEach((element,i) => {
            var serialobj = {}
            serialobj.label = element
            serialobj.value = element
            this.options.push(serialobj)
          })
        }
      } else if(evt.data.indexOf('open success')!=-1) {
        this.isCOMOpenActive = false
        console.log("port open success");
        this.message = "串口打开成功"
        setTimeout(()=>{
          this.message = "请按开机按键开机"
        }, 500);
      } else if(evt.data.indexOf('close success')!=-1) {
        this.isCOMOpenActive = true
        console.log("port close success");
        this.message = "串口关闭"
      } else if(evt.data.indexOf('sync success')!=-1){
        this.message = "设备同步成功"
      } else if(evt.data.indexOf('test mode')!=-1){
        this.message = "进入测试模式"
      }
    }
  },
  watch :{
    COMValue(newval , oldval){
      if(this.COMValue != oldval){
        this.isCOMOpenActive = true
      }
    }
  }
}
</script>
<style scoped>
.text-header {
}
.textArea{
  margin-top: 60px;
}
.el-textarea__inner{
  width:500px;
}
</style>


