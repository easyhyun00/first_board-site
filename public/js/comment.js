// 댓글 작성
$(function () {
  $("#comment_new").click(function () {
    if ($("#comment").val() == "") {
      alert("댓글을 입력하시오");
      return;
    }
    $.ajax({
      type: "post",
      url: "/posts/member/comment/new",
      data: {
        pid: $("#id").val(),
        cid: $("#Cid").val(),
        writer: $("#Cwriter").val(),
        comment: $("#comment").val(),
        date: $("#Cdate").val(),
      },
      dataType: "text",
      success: function (data) {
        alert("댓글이 작성되었습니다.");
        window.location.href =
          "http://localhost:4000/posts/member/" + $("#id").val();
      },
      error: function (e) {
        alert("댓글을 못 달았습니다.");
      },
    });
  });

  // 댓글 수정
  $("#comment_edit").click(function () {
    if ($("#comment").val() == "") {
      alert("댓글을 입력하시오");
      return;
    }
    $.ajax({
      type: "put",
      url: "/posts/member/comment/edit",
      data: {
        pid: $("#id").val(),
        cid: $("#Cid").val(),
        writer: $("#Cwriter").val(),
        comment: $("#comment").val(),
        date: $("#Cdate").val(),
      },
      dataType: "text",
      success: function (data) {
        alert("댓글이 수정되었습니다.");
        window.location.href =
          "http://localhost:4000/posts/member/" + $("#id").val();
      },
      error: function (request, status, error) {
        alert("댓글이 수정되지 않았습니다.");
      },
    });
  });
});

// 댓글 삭제
function comment_delete(Cid, Writer) {
  if (confirm("댓글을 삭제하시겠습니까?")) {
    $.ajax({
      type: "delete",
      url: "/posts/member/comment/delete",
      data: {
        pid: $("#id").val(),
        cid: Cid,
        writer: Writer,
      },
      success: function (result) {
        alert("삭제되었습니다.");
        window.location.href =
          "http://localhost:4000/posts/member/" + $("#id").val();
      },
      error: function (e) {
          alert("댓글을 삭제하지 못했습니다.");
      },
    });
  }
}
