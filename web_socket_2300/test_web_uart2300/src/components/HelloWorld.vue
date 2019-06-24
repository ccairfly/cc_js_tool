<template>
  <div>
    <el-row :gutter="20" style="margin-left: -10px;">
      <el-col :span="3">
         <el-button type="primary" @click="selectSerial" size="mini">选择串口</el-button>
      </el-col>
      <el-col :span="3">
          <el-select v-model="COMValue" placeholder="请选择" size="mini">
            <el-option
              v-for="item in comOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-col>
      <el-col :span="3">
          <el-select v-model="SendItem" placeholder="选择发送类型" size="mini">
            <el-option
              v-for="item in sendDataOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px;margin-left: -10px;">
      <el-col :span="3">
        <el-button type="primary" @click="openSerial" :disabled=" isCOMOpenActive || COMValue == ''" size="mini">打开串口</el-button>
      </el-col>
      <el-col :span="3">
        <el-input v-model="inputData" placeholder="请输入内容" :disabled="isInputdisable" size="mini" class="inData"></el-input>
      </el-col>
    </el-row>

    <el-row style="margin-top:10px;margin-left: -10px;">
      <el-col :span="3">
          <el-button type="primary" size="mini" @click="closeSerial" :disabled=" !isCOMOpenActive || COMValue == ''">关闭串口</el-button>
      </el-col>
      <el-col :span="2">
          <el-button type="primary" size="mini" @click="sendData" >发送数据</el-button>
      </el-col>
      <el-col :span="2">
          <el-button type="primary" size="mini" @click="clearData" >清空</el-button>
      </el-col>
    </el-row>

    <!-- <div class="textArea"> -->
    <el-row style="margin-top:10px;">
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
const sendListLabel = [
  '0-get version',
  '1-get bt name',
  '2-set bt name',
  '3-get FCAP',
  '4-set FCAP',
  '5-get bt addr',
  '6-set bt addr',
]

const isSendListActiveArr = [
  false,false,true,false,true,false,true
]

export default {
  data() {
    return {
      isInputdisable : true,
      isWSOpen : false,
      comOptions: [],
      sendDataOptions : [],
      comList:[],
      message : '',
      COMValue: '',
      inputData : '',
      SendItem : 0,
      isSyncSuccess : false,
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
    
    sendListLabel.forEach((item,index)=>{
      var dobj = {}
      dobj.label = item
      dobj.value = index
      this.sendDataOptions.push(dobj)
    })
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
    sendData(){      
      if(this.isSyncSuccess == true){
        this.message = "发送成功" + sendListLabel[this.SendItem]
        ws.send(sendListLabel[this.SendItem])
      }else {
        this.message = "发送错误"
      }
    },
    clearData(){
      this.message = "cleardata"
    },
    wsCloseHandler(){
      console.log('WS server close');
      this.isWSOpen = false
      this.isSyncSuccess = false
      this.message = "服务器关闭"
    },
    wsErrorHandler(){
      this.isWSOpen = false
      this.isSyncSuccess = false
      this.message = "打开服务器发生错误"
    },
    wsOpneHandler(){
      console.log('WS server open');
      this.isWSOpen = true
      this.isSyncSuccess = false
      this.message = "服务器已经链接"
    },
    wsDataHandler(evt){
      if(evt.data.indexOf('get serialport')!=-1) {
        
        var comData = evt.data.split("|")
        //获取到有com号
        console.log("get serialport:" + comData[1]);
        if(comData[1]){
          this.comOptions = []
          this.comList = []
          this.comList = comData[1].split(",")
          this.comList.forEach((element,i) => {
            var serialobj = {}
            serialobj.label = element
            serialobj.value = element
            this.comOptions.push(serialobj)
          })
        }
      } else if(evt.data.indexOf('open success')!=-1) {
        this.isCOMOpenActive = true
        console.log("port open success");
        this.message = "串口打开成功"
        setTimeout(()=>{
          this.message = "请按开机按键开机"
        }, 500);
      } else if(evt.data.indexOf('close success')!=-1) {
        this.isCOMOpenActive = false
        console.log("port close success");
        this.isSyncSuccess = false
        this.message = "串口关闭"
      } else if(evt.data.indexOf('sync success')!=-1){
        this.isSyncSuccess = true
        this.message = "设备同步成功"
      } else if(evt.data.indexOf('test mode')!=-1){
        this.message = "进入测试模式"
      } else if(evt.data.indexOf('response version')!=-1){
        var version = evt.data.split("|")
        this.message = "RESPONSE VERSION:" + version[1]
      } else if(evt.data.indexOf('response bt_name')!=-1){
        var btName = evt.data.split("|")
        this.message = "RESPONSE BT_NAME:" + btName[1]
      } else if(evt.data.indexOf('response fcap')!=-1){
        var fcap = evt.data.split("|")
        this.message = "RESPONSE FCAP: 0x" + fcap[1]
      } else if(evt.data.indexOf('response bt_addr')!=-1){
        var bt_addr = evt.data.split("|")
        this.message = "RESPONSE BT_ADDR: " + bt_addr[1]
      }
    }
  },
  watch :{
    COMValue(newval , oldval){
      if(this.COMValue != oldval){
        this.isCOMOpenActive = false
      }
    },
    SendItem(newval , oldval){
      this.isInputdisable = !isSendListActiveArr[newval]
    }
  }
}
</script>
<style scoped>
.text-header {
}
.inData {
  width: 300px;
  margin-left: 10px;
}
.textArea{
  margin-top: 60px;
}

</style>


