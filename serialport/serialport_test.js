const SerialPort = require("serialport");
const fs = require('fs')

const handShakeRequest = 'be500003000001ed'
const handShakeSuccess = 'be500003020001eb'
const bootmodeSetSuccess = 'be000101003f'
var sendHandshake = [0xbe,0x50,0x00,0x01,0x01,0xef]
var sendSetBootmode = [0xbe,0x00,0x01,0x05,0xe1,0x30,0x02,0x30,0x00,0xf8] //signal test
var sendFlashReboot = [0xbe,0x00,0x02,0x01,0xf3,0x4b]

var readConfigSuccess = false 
// SerialPort.list(function (err, ports) {
//   ports.forEach((port)=>{
//     console.log(port.comName);
//   });
// });
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
    if(data.toString('hex') == handShakeRequest) {
      console.log('opening') //收到开机握手请求,发送握手信号
      serialPortNow.write(Buffer.from(sendHandshake,'ascii'))
    } else if(data.toString('hex') == handShakeSuccess) {
      console.log('syncSuccess')  //握手成功设置bootmode
      serialPortNow.write(Buffer.from(sendSetBootmode,'ascii'))
    } else if(data.toString('hex') == bootmodeSetSuccess) {
      //bootmode设置成功,重启进入testmode
      console.log("enter signal testmode");
      serialPortNow.write(Buffer.from(sendFlashReboot,'ascii'))
    }
  });
}


