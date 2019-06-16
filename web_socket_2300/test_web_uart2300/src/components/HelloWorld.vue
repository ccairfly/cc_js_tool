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
    <!-- <div class="textArea"> -->
      <el-row style="margin-top:20px;">
        <el-col :span="24">
          <div style="background-color: #eee ; height:200px;" class="text-body">
          </div>
        </el-col>
      </el-row>
    <!-- </div> -->
  </div>
</template>
<script>
var isWSOpen = false
function wsOpneHandler(){
  console.log('WS server open');
  isWSOpen = true
}

function wsCloseHandler(){
  console.log('WS server close');
  isWSOpen = false
}

const ws = new WebSocket("ws://localhost:8001")
export default {
  data() {
    return {
      options: [],
      comList:[],
      COMValue: '',
      isCOMOpenActive : false,
      checked:true,//复选框选中状态
      textarea:'',//文本域中显示的内容
    }
  },
  created(){    
    ws.onopen = wsOpneHandler
    ws.onmessage = this.wsDataHandler
    ws.onclose = wsCloseHandler
  },
  methods: {
    selectSerial(){
      //选择串口
      if(isWSOpen == true) {
        ws.send("get serialport");
      }
    },
    openSerial(){
      //打开串口
      ws.send("[open serialport]|" + this.COMValue);
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


