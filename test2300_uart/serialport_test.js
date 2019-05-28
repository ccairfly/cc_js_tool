const SerialPort = require("serialport");
const fs = require('fs')

const handShakeRequest = 'be500003000001ed'
const handShakeSuccess = 'be500003020001eb'
const bootmodeSetSuccess = 'be000101003f'
var sendHandshake = [0xbe,0x50,0x00,0x01,0x01,0xef]
var sendSetBootmode = [0xbe,0x00,0x01,0x05,0xe1,0x30,0x02,0x30,0x00,0xf8] //signal test
var sendFlashReboot = [0xbe,0x00,0x02,0x01,0xf3,0x4b]

var readConfigSuccess = false 
try {
  var configData = fs.readFileSync('./config.json').toString()
  var configObj = JSON.parse(configData)
  if(configObj.comPort.indexOf("COM") == -1) {
    console.log("config.json COM setting error !!!");
  } else {
    readConfigSuccess = true
    console.log("open serial port " + configObj.comPort);
  }
} catch(err){
  console.log("read config.json error !!!");
}

if(readConfigSuccess == true) {
  var serialPortNow = new SerialPort(configObj.comPort,{
    baudRate: 921600
  })

  serialPortNow.on("data",(data)=>{
    var datastr = data.toString()
    if(datastr.indexOf('app_voice_report 0') != -1) {
      console.log("earphone poweron");
    } else if(datastr.indexOf('app_voice_report 9') != -1) {
      console.log("bluethooth connected");
    } else if(datastr.indexOf('A2DP_EVENT_STREAM_SUSPENDED') != -1) {
      console.log('a2dp stream suspend');
    } else if(datastr.indexOf('BTIF_A2DP_EVENT_STREAM_CLOSED') != -1) {
      console.log('a2dp stream close');
    } else if(datastr.indexOf('A2DP_EVENT_STREAM_STARTED') != -1) {
      console.log('a2dp stream start');
    }
    console.log(data.toString());

  });
}


