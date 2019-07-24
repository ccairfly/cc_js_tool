const fs = require('fs')

fs.readFile('./TX2_copy.txt',(err,data)=>{
    // console.log(data.toString('hex'));
    fs.writeFile('./tx_out.txt',data.toString().toUpperCase().replace(/\s*/g,""),()=>{
        console.log('write ok');
    })
})