const fs = require('fs')

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
    let hexA = 0;
    for (let i = 0; i < len; i++) {
        let s = str.substr(pos, 2);
        let v = parseInt(s, 16);
        hexA = v
    }
    return hexA;    
} 

var dataStr = fs.readFileSync('./data.txt').toString()
var dataArr = dataStr.split(' ');
dataArr.forEach((item, idex)=>{
    dataArr[idex] = HexstringArr2btye(item)
})
var checksum = checksumRevertSum(dataArr)
console.log('checksum: ' + '0x' + checksum.toString(16));
