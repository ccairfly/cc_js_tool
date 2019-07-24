const fs = require('fs')
const crc = require('crc-32')

const BUFF_OFFSET = 1052

const ramrunHeaderArr = [0xbe,0x53,0x00,0x0c,0xdc,0x05,0x01,0x20]

var _2byteBuff = Buffer.alloc(2)

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

fs.readFile('./programmer2300.bin', (err, data)=>{
    if(err){
        console.log(err);
        return 
    }
    var subBuff2 = data.slice(BUFF_OFFSET, data.length - 4)
    var crcValue = crc.buf(subBuff2)
    console.log(crcValue)
    var crcArr = HexstringArr2btye(crcValue.toString(16)).reverse()
    var crcBuff = Buffer.from(crcArr, 'hex')
    console.log(crcBuff)
    var lenArr = HexstringArr2btye((data.length - BUFF_OFFSET - 4).toString(16)).reverse()
    var lenBuff = Buffer.concat([Buffer.from(lenArr, 'hex'), _2byteBuff])
    console.log(lenBuff)
    var ramrunArr = ramrunHeaderArr.concat(lenArr,crcArr)
    var checksumArr = []
    checksumArr.push(checksumRevertSum(ramrunArr))

    var ReadRamrunBuff = Buffer.concat([Buffer.from(ramrunHeaderArr, 'hex'), lenBuff, crcBuff, Buffer.from(checksumArr, 'hex')])
    console.log(ReadRamrunBuff)
    
})