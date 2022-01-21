// 모듈 불러오기
var express = require('express'); // express 모듈
var JSONdb = require('simple-json-db'); // simple json db 모듈
var bodyParser = require('body-parser'); // form으로 전송된 data 사용하기 위한 모듈
var methodOverride = require('method-override'); // query로 method 값을 받아서 request의 HTTP method를 바꿔주는 역할
var dateUtil = require('date-utils'); // 현재 시간
const { application } = require('express');

const session = require('express-session');
const router = require('./routes/home');
const FileStore = require('session-file-store')(session);

var app = express(); //express를 실행하여 app object를 초기화

// Other settings
// ejs 사용하기 위해 express의 view engine에 ejs를 set
app.set('view engine', 'ejs');
// '현재 위치/public' route를 static폴더(css, js 있음)로 지정하라는 명령어
app.use(express.static(__dirname+'/public'));
// 웹브라우저의 form에 입력한 데이터가 bodyParser를 통해 req.body으로 생성
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
// http://example.com/category/id?_method=delete를 받으면 
// _method의 값인 delete을 읽어 해당 request의 HTTP method를 delete으로 바꿈
app.use(methodOverride('_method'));

app.use(session({ // 로그인 세션
  secret: 'secret key',
  resave: false, // 세션에 아무런 변경사항이 없을때도 그 세션 다시 저장
  saveUninitialized: false, 
  store: new FileStore({logFn: function(){}})
}));

// Routes
app.use('/', require('./routes/home'));
app.use('/join',require('./routes/join'));
app.use('/login', require('./routes/login'));
app.use('/posts',require('./routes/posts'));
app.use('/my',require('./routes/my'));

// Port setting, 4000번 포트 사용
var port = 4000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
