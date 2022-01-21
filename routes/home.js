// '/'로 시작하는 애들(메인홈페이지)

const e = require('express');
var express = require('express');
const { max } = require('moment');

//// 게시물 정보 db
const JSONdb = require("simple-json-db");
const db = new JSONdb("./database/list.json");
const data = db.get("list_data");

var router = express.Router();

//// 날짜 순으로 정렬
function data_sort(data){
  data.sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1; 
    return 0;
  })
};
data_sort(data);

/////////////////////////////////////////////////////////////////////

// 로그인 전 메인홈페이지
// http://localhost:4000/
router.get('/', function(req, res){
  res.render('home/homepage',{info:req.session.email});
});

// 로그인 후 메인홈페이지
// http://localhost:4000/member
router.get('/member', function(req, res){
  res.render('home/homepage',{info:req.session.email});
});

/////////////////////////////////////////////////////////////////////////////////////////

// 목록페이지, 페이징 기능 추가
router.get('/index*',async function(req,res){
  const data = db.get("list_data"); // 이거 없으면 글 삭제, 수정할 때 바로 반영 안됨
  data_sort(data);

  var page = Math.max(1, parseInt(req.query.page));   
  var limit = Math.max(1, parseInt(req.query.limit)); 
  page = !isNaN(page)?page:1;                         
  limit = !isNaN(limit)?limit:7;    

  var skip = (page-1)*limit; // 무시할 게시물 수
  var count = await data.length // 게시물 수
  var maxPage = Math.ceil(count/limit); // 전체 페이지 수

  var datas=[];
  if(page==maxPage){ // 마지막
    for(var i=skip;i < count ;i++)
      datas.push(data[i]) 
  }
  else if(page==1){ // 처음
    for(var i=skip;i < limit;i++)
      datas.push(data[i])   
  }
  else{ // 중간
    for(var i=skip;i < skip + limit;i++)
      datas.push(data[i])     
  }

  res.render('posts/index',{
    list:datas,
    currentPage:page,
    maxPage:maxPage,
    limit:limit,
    info:req.session.email,
    start:skip
  })
})

//// 로그인 전 게시물 목록 페이지
// http://localhost:4000/posts
// router.get("/index", function (req, res) {
//   const data = db.get("list_data");
//   res.render("posts/index", { list: data,info:req.session.email });
// });

// 목록페이지, 페이징 기능 추가
// router.get('/index/member',async function(req,res){
//   const data = db.get("list_data"); // 이거 없으면 글 삭제, 수정할 때 바로 반영 안됨
//   data_sort(data);

//   var page = Math.max(1, parseInt(req.query.page));   
//   var limit = Math.max(1, parseInt(req.query.limit)); 
//   page = !isNaN(page)?page:1;                         
//   limit = !isNaN(limit)?limit:7;    
//   console.log(page); // page
//   console.log(limit); // limit

//   var skip = (page-1)*limit; // 무시할 게시물 수
//   console.log(skip);
//   var count = await data.length // 게시물 수
//   console.log(count)
//   var maxPage = Math.ceil(count/limit); // 전체 페이지 수
//   console.log(maxPage)
  
//   var datas=[];
//   if(page==maxPage){
//     for(var i=skip;i < count ;i++){ 
//       datas.push(data[i])
//     }
//   }
//   else{
//     for(var i=skip;i < limit;i++){ 
//       datas.push(data[i])
//     }
//   }

//   res.render('posts/index',{list:datas,currentPage:page,maxPage:maxPage,limit:limit,info:req.session.email,start:skip})
// })

//// 로그인 후 게시물 목록 페이지
// http://localhost:4000/posts/member
// router.get("/index/member", function (req, res) {
//   const data = db.get("list_data"); // 이거 없으면 글 삭제, 수정할 때 바로 반영 안됨
//   data_sort(data);
//   res.render("posts/index", { list: data,info:req.session.email });
// });

module.exports = router;
