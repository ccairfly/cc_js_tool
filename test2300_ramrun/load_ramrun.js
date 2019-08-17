const SerialPort = require("serialport");
const fs = require('fs')
const crc = require('crc-32')

const handShakeRequest = 'be500003000001ed'
const handShakeSuccess = 'be500003020001eb'
const handShakeSuccess2 = 'be53000100ed'
const loadRamrunSuccess = 'be54a201202a'

var sendHandshake = [0xbe,0x50,0x00,0x01,0x01,0xef]
// var sendHandshake2 = [0xbe,0x53,0x00,0x0c,0xdc,0x05,0x01,0x20,0x18,0xea,0x00,0x00,0xf4,0xd9,0x84,0x46,0x47] //烧录工具
// var sendHandshake2 = [0xbe,0x53,0x00,0x0c,0xdc,0x05,0x01,0x20,0x80,0xf8,0x00,0x00,0x5f,0x78,0x55,0x4a,0xf2] //小牛测控改
var sendRunRamrun = [0xbe,0x55,0x3c,0x00,0xb0]

var readConfigSuccess = false 
const BUFF_OFFSET = 1052
const setRamrunHeaderArr = [0xbe,0x53,0x00,0x0c,0xdc,0x05,0x01,0x20]
const readRamrunHeaderArr = [0xbe,0x54,0xa2,0x03,0x00,0x00,0x00,0x48]

var _2byteBuff = Buffer.alloc(2)
var ramrunSubBuff

function checksumRevertSum(arr) {
    var sum = 0 
    arr.forEach(i=>{
        sum += i
        if(sum > 0xff)
            sum -= 256
    })
    return 0xff - sum
}

function HexstringArr2btye(str) {
    let pos = 0;
    let len = str.length;
    if (len % 2 != 0) {
        return null;
    }
    len /= 2;
    let hexA = new Array();
    for (let i = 0; i < len; i++) {
        let s = str.substr(pos, 2);
        let v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }
    return hexA;    
} 

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
        console.log(data.toString('hex'))
        if(data.toString('hex') == handShakeRequest) {
            console.log('opening') //收到开机握手请求,发送握手信号
            serialPortNow.write(Buffer.from(sendHandshake,'ascii'))
        } else if(data.toString('hex') == handShakeSuccess) {
            console.log('syncSuccess')  //读取ramrun
            fs.readFile('./programmer2300.bin', (err, data)=>{
                if(err){
                    console.log(err);
                    return 
                }
                ramrunSubBuff = data.slice(BUFF_OFFSET, data.length - 4)
                var crcValue = crc.buf(ramrunSubBuff)
                console.log('CRC32:' + crcValue)
                var crcArr = HexstringArr2btye(crcValue.toString(16)).reverse()
                var crcBuff = Buffer.from(crcArr, 'hex')
                // console.log(crcBuff)
                var lenArr = HexstringArr2btye((data.length - BUFF_OFFSET - 4).toString(16)).reverse()
                var lenBuff = Buffer.concat([Buffer.from(lenArr, 'hex'), _2byteBuff])
                console.log('lenbuff')
                console.log(lenBuff)
                var ramrunArr = setRamrunHeaderArr.concat(lenArr,crcArr)
                var checksumArr = []
                checksumArr.push(checksumRevertSum(ramrunArr))
            
                var ReadRamrunBuff = Buffer.concat([Buffer.from(setRamrunHeaderArr, 'hex'), lenBuff, crcBuff, Buffer.from(checksumArr, 'hex')])
                console.log(ReadRamrunBuff)
                serialPortNow.write(ReadRamrunBuff)
            })
            // serialPortNow.write(Buffer.from(sendHandshake2,'ascii')) //换一种方式来写入handshake2
        } else if(data.toString('hex') == handShakeSuccess2) {
            console.log('handShakeSuccess2 ok') 
            serialPortNow.write(Buffer.concat([Buffer.from(readRamrunHeaderArr,'hex'), ramrunSubBuff]))
        } else if(data.toString('hex') == loadRamrunSuccess) {
            console.log('loadRamrunSuccess ok ')  //写入ramrun成功,执行Ramrun
            serialPortNow.write(Buffer.from(sendRunRamrun,'hex'))
        } 
    })
}