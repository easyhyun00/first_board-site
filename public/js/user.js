// 회원가입
$(function() {
    $("#join_new").click(function () {
      psw = $("#psw").val();
      _psw = $("#_psw").val();
      if (psw == "" || _psw == "" || email == "") {
        alert("모든 항목을 입력하시오.");
        window.location.href = "http://localhost:4000/join";
        return;
      }
      else if(psw != _psw){
        alert("비밀번호를 다시 입력하시오.");
        window.location.href = "http://localhost:4000/join";
        return;
      }
      $.ajax({
        type: "post",
        url: "/join",
        data: {
          email: $("#email").val(),
          psw: psw,
        },
        dataType: "text",
        success: function (data) {
          alert("회원가입 하였습니다.");
          window.location.href = "http://localhost:4000/login";
        },
        error: function (e) {
          if(e.status==409){
            alert("이미 사용중인 이메일 입니다.")
            window.location.href = "http://localhost:4000/join";
          }
        },
      });
    });
  
  // 로그인
    $('#login_check').click(function(){ 
        var email=$("#email").val();
        var psw=$("#psw").val();
        if (psw == "" || email == "") {
            alert("모든 항목을 입력하시오.");
            window.location.href = "http://localhost:4000/login";
            return;
        }
        $.ajax({
        type:'post',  
        url:'/login',  
        data:{
            email:email,
            psw:psw
        },  
        dataType:'text',   
        success : function(data){   
            alert("로그인 되었습니다.")
            window.location.href = "http://localhost:4000/member";                            
        },
        error: function(e){
            if(e.status==401)
              alert("잘못된 비밀번호 입니다.")          
            else if(e.status==400)
              alert("없는 이메일 입니다.")          
              window.location.href = "http://localhost:4000/login";
        }
        });
    });
  });  