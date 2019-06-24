const ws = require('nodejs-websocket')
const SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline')
// const InterByteTimeout = require('@serialport/parser-inter-byte-timeout')
const Delimiter = require('@serialport/parser-delimiter')

const PORT = 8001
var g_conn 
var g_timer = ''
var serialPortNow
var portOpenSuccess = false

const handShakeRequest = 'be500003000001ed'
const handShakeSuccess = 'be500003020001eb'
const bootmodeSetSuccess = 'be000101003f'
const sendHandshake = [0xbe,0x50,0x00,0x01,0x01,0xef]
const sendSetBootmode = [0xbe,0x00,0x01,0x05,0xe1,0x30,0x02,0x30,0x00,0xf8] //signal test
const sendFlashReboot = [0xbe,0x00,0x02,0x01,0xf3,0x4b]

var responseObj = {
    addr : {
        text : 'RESPONSE,BT_ADDR',
        response : '[response bt_addr]|'
    },
    fcap : {
        text : 'RESPONSE,FCAP',
        response : '[response fcap]|'
    },
    version : {
        text : 'RESPONSE,VERSION',
        response : '[response version]|'
    },
    name : {
        text : 'RESPONSE,NAME',
        response : '[response bt_name]|'
    }
}
const response_addr = 'RESPONSE,BT_ADDR'

function serialportDataHandler(data)
{
    if(data.toString('hex') == handShakeRequest) {
        // console.log('opening') //收到开机握手请求,发送握手信号
        serialPortNow.write(Buffer.from(sendHandshake,'ascii'))
    } else if(data.toString('hex') == handShakeSuccess) {
        // console.log('syncSuccess')  //握手成功设置bootmode
        g_conn.send("[device sync success]");
        serialPortNow.write(Buffer.from(sendSetBootmode,'ascii'))
    } else if(data.toString('hex') == bootmodeSetSuccess) {
        //bootmode设置成功,重启进入testmode
        // console.log("enter signal test mode");
        g_conn.send("[enter signal test mode]");
        serialPortNow.write(Buffer.from(sendFlashReboot,'ascii'))
    } else {
        console.log(data.toString());//打开才好使
        if(data.toString().indexOf('RESPONSE,VERSION') != -1){
            var vdata2 = data.toString().split('\r\n')  
            var vdata = vdata2[1].replace('[','').replace(']','').split(',')
            console.log(vdata);
            var version = vdata[2]
            // console.log(version)
            g_conn.send("[response version]|" + version)
        } else if(data.toString().indexOf('RESPONSE,BT_NAME') != -1) {
            var ndata2 = data.toString().split('\r\n')  
            var ndata = ndata2[1].replace('[','').replace(']','').split(',')
            console.log(ndata);
            var bt_name = ndata[2]
            // console.log(bt_name)
            g_conn.send(responseObj.name.response + bt_name)
        } else if(data.toString().indexOf(responseObj.addr.text) != -1) {
            // console.log('收到的数据' + data.toString())
            var rindex = data.toString().indexOf(responseObj.addr.text)
            // console.log('起始位置:' + (rindex + response_addr.length + 1))
            var addrStr = data.toString().substr(rindex + responseObj.addr.text.length + 1 , 17)
            console.log('地址字符串:' + addrStr);
            g_conn.send("[response bt_addr]|" + addrStr)
            // var addrIndex = data.toString().indexOf('RESPONSE,BT_ADDR')
            // console.log(addrIndex);
            
        } else if(data.toString().indexOf('RESPONSE,FCAP') != -1) {
            var data2 = data.toString().split('\r\n')            
            var fdata = data2[1].replace('[','').replace(']','').split(',')
            console.log(fdata);
            var fcap = fdata[2]
            // console.log('fcap: ' + fcap);
            g_conn.send("[response fcap]|" + fcap)
        }
    }
}

function openSerialPort(port)
{
    //实例化串口
    serialPortNow = new SerialPort(port,{
        baudRate: 921600,
        isOpen: true
    })
    // const parser = serialPortNow.pipe(new Delimiter({ delimiter: '\n' }))
    // parser.on('data', serialportDataHandler);
    // g_timer = setInterval(()=>{
    //     if(portOpenSuccess == true) {
    //         SerialPort.flush()
    //     }
    // },5000)
    serialPortNow.on("data",serialportDataHandler)

    serialPortNow.on("open",err=>{
        if(!err) {
            g_conn.send("[serialport open success]");
            portOpenSuccess = true
        }
            
        else {
            portOpenSuccess = false
            console.log("serialport open fail");
        }
    })

    serialPortNow.on("error",(err)=>{
        console.log(err);
        portOpenSuccess = false
    })
}

function wsDataHandler(str) {
    console.log("Received " + str)
    if(str == 'get serialport') {
        SerialPort.list((err,ports)=>{
            var portslist = []
            ports.forEach((item)=>{
                portslist.push(item.comName)
            })
            g_conn.send('[get serialport]|' + portslist.toString())
            delete portslist
        })
    } else if(str.indexOf('open serialport') != -1) {
        var strArr = str.split("|")
        var portNow = strArr[1]
        openSerialPort(portNow)
    } else if(str.indexOf('close serialport') != -1) {
        serialPortNow.close(err=>{
            if(err) {
                portOpenSuccess = false
                console.log("port close" + err);
            } else {
                g_conn.send('[serialport close success]')
            }
                
        })
    } else if(str.indexOf('get version') != -1) {
        serialPortNow.write('[VERSION,get]')             
    } else if(str.indexOf('get bt name') != -1) {
        serialPortNow.write('[BT_NAME,get]')  
    } else if(str.indexOf('get FCAP') != -1) {
        console.log('服务器收到获取频偏的命令');
        serialPortNow.write('[FCAP,get]')  
    } else if(str.indexOf('get bt addr') != -1) {
        console.log('服务器收到获取蓝牙地址');
        
        serialPortNow.write('[BT_ADDR,get]')  
    }
}

var server = ws.createServer(function (conn) {
    console.log("New connection")
    g_conn = conn
	conn.on("text", wsDataHandler)
	conn.on("close", function (code, reason) {
        console.log("Connection closed")
        if(serialPortNow) {
            serialPortNow.close(err=>{
                if(err) {
                    portOpenSuccess = false
                    console.log("port close" + err);
                }
                    
            })
        }
    })
    conn.on("error", function (code, reason) {
        console.log("Connection closed and error")
        if(serialPortNow) {
            serialPortNow.close(err=>{
                if(err) {
                    portOpenSuccess = false
                    console.log("port close" + err);
                }
            })
        }
	})
}).listen(PORT,()=>{
    console.log('nodejs server open success , port:' + PORT);
})