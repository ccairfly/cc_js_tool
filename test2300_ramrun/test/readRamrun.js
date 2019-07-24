const fs = require('fs')

var subArr = [0x41,0x45,0x21,0x00]
var subBuff = Buffer.from(subArr,'hex')

fs.readFile('./programmer2300.bin',(err,data)=>{
    if(err){
        console.log(err);
        return 
    }
    
    // console.log(data);
    console.log(data.indexOf(subBuff));
    
    // data.indexOf(subBuff)
    
})