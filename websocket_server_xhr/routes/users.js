var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/ports', function(req, res, next) {
  console.log("收到请求");
  res.send({
    "ports" : 'COM3'
  })
  
});

module.exports = router;
