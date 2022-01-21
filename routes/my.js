var express  = require('express');

var router = express.Router();

// session이 없을 때 해당 페이지에 들어온 경우
router.get('*',function(req,res,next){
    if(req.session.email == undefined)
        res.send("<script>alert('접근할 수 없는 페이지입니다.');location.href='http://localhost:4000/';</script>");    
    else
        next();  
})

// 유저 정보
// http://localhost:4000/my 
router.get('/', function(req, res){
    res.render('my/myinfo', {info:req.session.email});
});

module.exports = router;