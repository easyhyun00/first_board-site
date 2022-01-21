// 게시물 작성
$(function() {
  $("#post_new").click(function () {
    if ($("#title").val() == "" || $("#text").val() == "") {
      alert("비어있는 칸을 채우시오.");
      return;
    }
    $.ajax({
      type: "post",
      url: "/posts/member/new",
      data: {
        pid: $("#id").val(),
        title: $("#title").val(),
        text: $("#text").val(),
        date: $("#date").val(),
        writer: $("#writer").val(),
      },
      dataType: "text",
      success: function (data) {
        alert("게시물이 작성되었습니다.");
        window.location.href =
          "http://localhost:4000/posts/member/" + $("#id").val();
      },
      error: function (e) {
        alert("게시물을 작성하지 못했습니다.");
      },
    });
  });
  
  // 게시물 삭제
    $("#post_delete").click(function () {
      if(confirm("게시물을 삭제하시겠습니까?")) {
        $.ajax({
          type: "delete",
          url: "/posts/member/delete",
          data: {
            pid: $("#id").val(),
            writer: $("#writer").val(),
          },
          success: function (result) {
            alert("삭제되었습니다.");
            window.location.href = "http://localhost:4000/index/member";
          },
          error: function (e) {
            alert("게시물을 삭제하지 못했습니다.");
        },
        });
      };
    });
  
  // 게시물 수정
    $("#post_edit").click(function () {
      if ($("#title").val() == "" || $("#text").val() == "") {
        alert("비어있는 칸을 채우시오.");
        return;
      }
      $.ajax({
        type: "put",
        url: "/posts/member/edit",
        data: {
          pid: $("#id").val(),
          title: $("#title").val(),
          text: $("#text").val(),
          date: $("#date").val(),
          writer: $("#writer").val(),
        },
        dataType: "text",
        success: function (data) {
          alert("게시물을 수정했습니다.");
          window.location.href =
            "http://localhost:4000/posts/member/" + $("#id").val();
        },
        error: function (e) {
          alert("게시물을 수정하지 못했습니다.");
        },
      });
    });
  });