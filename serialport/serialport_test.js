const SerialPort = require("serialport");

const syncDeviceStr = 'be500003000001ed'
const syncDeviceAck1 = 'be500003020001eb'
const syncDeviceAck2 = 'be00000500300200000a'
const syncDeviceAck3 = 'be000001023e'
var sendcmd1 = [0xbe,0x50,0x00,0x01,0x01,0xef]
var sendcmd2 = [0xbe,0x00,0x00,0x01,0xe3,0x5d]
var sendcmd3 = [0xbe,0x00,0x01,0x05,0xe1,0x30,0x02,0x14,0x00,0x14]
var sendcmd4 = [0xbe,0x00,0x02,0x01,0xf3,0x4b]

var portNow = 'COM4'
SerialPort.list(function (err, ports) {
  ports.forEach((port)=>{
    console.log(port.comName);
    // portNow = port.comName
  });
});

var serialPortNow = new SerialPort(portNow,{
    baudRate: 921600
})

serialPortNow.on("data",(data)=>{
  if(data.toString('hex') == syncDeviceStr) {
    console.log('syncDevice');
    var sendBuf = Buffer.from(sendcmd1,'ascii')
    serialPortNow.write(sendBuf)
    setTimeout(() => {
        var sendBuf2 = Buffer.from(sendcmd2,'ascii')
        serialPortNow.write(sendBuf2)
        setTimeout(() => {
            var sendBuf3 = Buffer.from(sendcmd3,'ascii')
            serialPortNow.write(sendBuf3)
            setTimeout(() => {
                var sendBuf4 = Buffer.from(sendcmd4,'ascii')
                serialPortNow.write(sendBuf4)
            }, 500);
        }, 500);
    }, 500);
  } 
});

