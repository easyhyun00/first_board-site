// '/join'로 시작하는 애들
var express = require('express');

// 유저 정보 db
const JSONdb = require('simple-json-db');
const Udb = new JSONdb('./database/user.json'); 
const Udata = Udb.get('user_data');

var router = express.Router();

// join 페이지
// http://localhost:4000/join
router.get('/', function(req, res){
  res.render('join/joinpage');
});

// 작성한 회원가입 데이터 전달 받음
router.post('/',function(req,res,next){

  const err=new Error;

  for(i=0;i<Udata.length;i++){
    if(Udata[i].email==req.body.email){
      err.status=409; // 이미 사용중인 이메일
      next(err);
      return;     
    }
  }
  if(Udata){ // 일반적인 경우 
    Udata.push(req.body)
    Udb.set('user_data',Udata)
  }
  else{ // db에 아무런 데이터가 없을 때 
    Udb.set('user_data',[req.body])
  }  
  console.log(req.body)
  res.send();
})

// 에러 처리 미들웨어
router.use(function(err,req,res,next){
  console.log(err.status)
  res.status(err.status).send();
})

module.exports = router;