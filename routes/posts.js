//// '/posts' 로 시작하는 애들

var express = require("express");
const { disabled } = require("express/lib/application");

//// 게시물 정보 db
const JSONdb = require("simple-json-db");
const db = new JSONdb("./database/list.json");
const data = db.get("list_data");
//// 댓글 정보 db
const Cdb = new JSONdb("./database/comment.json");

//// 날짜 순으로 정렬
function data_sort(data){
  data.sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1; 
    return 0;
  })
};
data_sort(data);

//// 현재시간
function now_time(){
  var time = new Date();
  var now_time = time.toFormat("YYYY-MM-DD HH24:MI:SS");
  return now_time;
}

var router = express.Router();

// session이 없을 때 해당 페이지에 들어온 경우
router.get("/member/*",function(req,res,next){
  console.log(req.session.email)
  if(req.session.email == undefined)
      res.send("<script>alert('접근할 수 없는 페이지입니다.');location.href='http://localhost:4000/';</script>");    
  else
      next();  
})
///////////////////////////////////////////////////////////////////////////////////////////////////////

//// 게시물 작성 페이지
// http://localhost:4000/posts/member/new
router.get("/member/new", function (req, res) {

  const data = db.get("list_data"); // 이거 없으면 next_pid 값 못 구함
  // 현재 시간
  var my_time = now_time()

  // pid값 제일 큰 거 찾아서 +1 해서 보냄(작성할 게시물의 pid값=next_pid)
  if(data[0]){
    var next_pid = parseInt(data[0].pid);
    for (var i = 1; i < data.length; i++) {
      if (parseInt(data[i].pid) > next_pid) {
        next_pid = parseInt(data[i].pid);
      }
    }
    next_pid++;
  }
  else // 작성된 게시물이 아예없을 때
  next_pid=1;

  res.render("posts/new", { next_pid, info: req.session.email, my_time }); // 작성할 게시물의 pid, uera email, date
});

//// 작성한 게시물 데이터 전달 받음(ajax)
router.post("/member/new", function (req, res) {

  const data = db.get("list_data"); // 이거 없으면 전에 삭제된 게시물도 같이 보임
  console.log(req.body);

  // 배열에 새로운 데이터 넣고 그 값을 db에 set함
  data.push(req.body);
  db.set("list_data", data);

  // 작성 후 작성일 순으로 정렬
  data_sort(data);

  // 작성 후 작성한 게시물 보는 페이지
  res.send(data)
});

///////////////////////////////////////////////////////////////////////////////////////////////////////

//// 작성한 게시물 내용 보는 페이지, 작성한 게시물의 댓글 보는 페이지
// http://localhost:4000/posts/member/:pid
router.get("/member/:pid", function (req, res) {

  // 현재 시간
  var my_time = now_time()

  // 볼 게시물의 pid를 _pid로
  const _pid = req.params.pid;

  const data = db.get("list_data");

  // _pid를 가진 게시물의 data 찾기
  const FPdata = data.filter(function (fp_data) {
    return fp_data.pid == _pid;
  });

  // _pid게시물의 댓글 데이터를 가져옴
  const Cdata = Cdb.get(_pid); 

  // 댓글 cid중에서 가장 큰 cid값 찾아서 +1해서 다음 작성할 cid값 제공(next_cid=다음 작성할 댓글의 id값)
  if (Cdata) {
    var next_cid = parseInt(Cdata[0].cid);
    for (var i = 0; i < Cdata.length; i++) {
      if (parseInt(Cdata[i].cid) > next_cid) {
        next_cid = parseInt(Cdata[i].cid);
      }
    }
    next_cid++; 
  } else // 댓글이 아예 없을 때 next_cid=1
    next_cid = 1;

  // data 정보 넘겨주면서 그 게시물과 댓글 보여줌
  res.render("posts/show", {list: FPdata[0], info: req.session.email, _pid, comments: Cdata, my_time, next_cid});
});

//////////////////////////////////////////////////////////////////////////////////////////////////////

///// 작성한 댓글 데이터 전달 받음(ajax)
router.post("/member/comment/new", function (req, res) {

  // 댓글을 단 게시물의 pid
  const _pid = req.body.pid;
  // _pid게시물의 댓글 db
  const Cdata = Cdb.get(_pid);
  if (Cdata) {
    // 이미 댓글이 있는 경우
    Cdata.push(req.body);
    Cdb.set(_pid, Cdata);
  } else {
    // 댓글이 아무것도 없는 경우
    Cdb.set(_pid, [req.body]);
  }
  // 댓글 작성 후 해당 게시물 페이지로
  res.send();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////

////// 작성한 댓글 삭제(ajax)
router.delete("/member/comment/delete", function (req, res) {

  // _pid는 게시물 pid, _cid는 댓글 cid
  const _pid = req.body.pid;
  const _cid = req.body.cid;

  // _pid게시물의 댓글 db
  const Cdata = Cdb.get(_pid);

  // _cid를 가진 댓글 찾기(삭제할 댓글=FCdata)
  const FCdata = Cdata.filter(function(fc_data){
    return fc_data.cid == _cid;
  })

  // Cdata에서 FCdata와 일치하지 않는 것만 DCdata라고 함(Cdata에서 FCdata를 뺀 데이터를 DCdata)
  var DCdata = Cdata.filter((item)=>!FCdata.includes(item));
  /// 만약에 댓글이 없을 때는 key값을 삭제(해당 게시물의 모든 댓글 데이터 삭제)
  if(DCdata.length==0){
    Cdb.delete(_pid)
    res.send(); 
  }
  else{ // 일반적인 경우
    Cdb.set(_pid,DCdata); 
    res.send();
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////

//// 작성한 댓글 수정하는 페이지
router.get("/member/:pid/comment/:cid/edit", function (req, res) {
    
  // _pid는 게시물 pid, _cid는 댓글 cid
  const _pid = req.params.pid;
  const _cid = req.params.cid;

  // _pid게시물의 댓글 db
  const Cdata = Cdb.get(_pid);

  // _cid를 가진 댓글 찾기(수정할 댓글)
  const FCdata = Cdata.filter(function(fc_data){
    return fc_data.cid == _cid;
  })

  // 현재 시간
  var my_time = now_time()
  
  // _pid를 가진 게시물
  const data = db.get("list_data");
  const FPdata = data.filter(function (fp_data) {
    return fp_data.pid == _pid;
  });
  
  // 기존 게시물, 댓글 수정칸, 기존 댓글
  res.render("posts/comment_edit", {list: FPdata[0], info: req.session.email, _pid, comments: Cdata, my_time, edit_c:FCdata[0], _cid});
});

//// 수정한 댓글 데이터 받음(ajax)
router.put("/member/comment/edit", function (req, res) {

  // _pid는 게시물 pid, _cid는 댓글 cid
  const _pid = req.body.pid;
  const _cid = req.body.cid;

  // _pid게시물의 댓글 db
  const Cdata = Cdb.get(_pid);

  // _cid를 가진 댓글 찾기(수정할 댓글)
  const FCdata = Cdata.filter(function(fc_data){
    return fc_data.cid == _cid;
  })

  // 댓글 수정
  var ECdata = Cdata.map((value) =>
    value == FCdata[0] ? (value = req.body) : value
  );
  // db에 넣기
  Cdb.set(_pid, ECdata);

  res.send();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////

//// 작성한 게시물 수정 하는 페이지
//http://localhost:4000/posts/member/:pid/edit
router.get("/member/:pid/edit", function (req, res) {

  const data = db.get("list_data");
  // 현재 시간
  var my_time = now_time()

  // pid를 가진 게시물 data찾기
  const _pid = req.params.pid;
  const FPdata = data.filter(function (fp_data) {
    return fp_data.pid == _pid;
  });

  res.render("posts/edit", { list: FPdata[0], info: req.session.email, my_time });
});

//// 수정한 데이터 전달 받음(ajax)
router.put("/member/edit",function(req,res){

  const data = db.get("list_data");
  // 수정할 원래 게시물
  const _pid = req.body.pid;
  const FPdata = data.filter(function (fp_data) {
    return fp_data.pid == _pid;
  });
  // 원래 게시물에 입력받은 수정할 데이터로 변경
  var EPdata = data.map((value) =>
    value == FPdata[0] ? (value = req.body) : value
  );
  db.set("list_data", EPdata);

  // 수정후 시간순으로 정렬
  data_sort(EPdata);

  res.send(EPdata)
})

////////////////////////////////////////////////////////////////////////////////////////////////////

//// 작성한 게시물 삭제(ajax)
router.delete("/member/delete", function (req, res) {

  const data = db.get("list_data");
  // 삭제할 데이터
  const _pid = req.body.pid;

  const FPdata = data.filter(function (fp_data) {
    return fp_data.pid == _pid;
  });
  // data에 FPdata과 일치하지 않는 것만 DPdata라고 함
  var DPdata = data.filter((item) => !FPdata.includes(item));
  db.set("list_data", DPdata);

  // 해당 pid값을 가진 댓글도 삭제
  Cdb.delete(_pid);

  res.send();
});

module.exports = router;
