jQuery(function($){
    var HOST = "http://us.battle.net";
    var CAREER_API = "/api/d3/profile/";
    var CONN_SYMBOL = "/";
    var A_TAG = "IORI-1902";
    module("ajax_test");
    asyncTest("one tag_id ajax test",function(){
        var url = HOST+CAREER_API+A_TAG+CONN_SYMBOL;
        $.ajax({
          url: url,
          type: "GET",
          dataType:"jsonp",
          success: function(data){
            ok(data !== null,"数据正常返回");
            start();
          }
        });
    });
})