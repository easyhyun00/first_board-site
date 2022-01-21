// 게시물 제목 검색하는 검색창
$(function () {
  $("#keyword").keyup(function () {
    //keyup: 키보드 눌렀다 뗄 때 이벤트 발생

    var k = $(this).val(); // 검색창에 입력한 문자열=k
    $("#user-table > tbody > tr").hide(); // user-table안에 tbody안에 있는 tr태그를 화면에 안 보이게 함
    // td에 k(검색창에 입력한 문자열)를 포함한 tr태그들만 화면에 보이게 함
    var temp = $(
      "#user-table > tbody > tr > td:nth-child(5n+2):contains('" + k + "')"
    );
    $(temp).parent().show();
    // 보이는(k라는 제목이 있는) 게시물 개수
    $(".count").text(temp.length);
  });
});

// 뒤로가기
function goBack(){
  window.history.back();
}
