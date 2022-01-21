// '/login' 으로 시작하는 애들

var express = require('express');

const JSONdb = require('simple-json-db');

var router = express.Router();

// 로그인
// http://localhost:4000/login
router.get('/', function(req, res){
  res.render('login/loginpage');
});

// 작성한 로그인 데이터 전달 받음
router.post('/',function(req,res,next){ // next: 제어 전달

  const Udb = new JSONdb('./database/user.json'); 
  const Udata = Udb.get('user_data');

  const err=new Error;

  for(i=0;i<Udata.length;i++){
    if(Udata[i].email==req.body.email){
      if(Udata[i].psw==req.body.psw){

        // 로그인 세션
        req.session.email = req.body.email;
        console.log(req.session)

        res.send(); // 성공
      }
      else{
        err.status=401; // 잘못된 비밀번호
        next(err);
      }
      return;
    }
  }
  err.status=400; // 없는 이메일
  next(err);
})

// 에러 처리 미들웨어
router.use(function(err,req,res,next){
  console.log(err.status)
  res.status(err.status).send();
})

// 로그아웃
router.post('/out',function(req,res){
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;